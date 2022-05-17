const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")
const fs = require("fs")
const cors = require("cors")

const port = process.env.PORT || 7500;

const app = express()

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/mov' ||
      file.mimetype === 'video/wmv' ||
      file.mimetype === 'video/avi' ||
      file.mimetype === 'video/avchd' ||
      file.mimetype === 'video/mkv' ||
      file.mimetype === 'video/webm' ||
      file.mimetype === "video/flv"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  // app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
  app.use(bodyParser.json()); // application/json
  app.use(
    multer({ dest: "videos" , fileFilter: fileFilter }).single('video')
  );

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
      );
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
  });

  app.use(cors())

  app.put('/postvideo', (req, res, next) => {
    // if (!req.isAuth) {
    //   throw new Error('Not authenticated!');
    // }
    console.log(req.file);
    console.log("run");
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
    }
    return res
      .status(201)
      .json({ message: 'File stored.', filePath: req.file.path });
  });
  
  app.get("/videos?",function (req, res) {
      const video = req.query.video
    res.sendFile(__dirname + "/videos/" + video )
  });
    
  app.delete('/deletevideo?',(req,res,next)=>{
    const file = req.query.file
    fs.unlink(__dirname + "/videos/" + file, (err)=>{
        if(err) console.log(err);
        else console.log("deleted");
    })

  })

  
app.listen(port, ()=>{
    console.log(`video api listening at port ${port}`);
})