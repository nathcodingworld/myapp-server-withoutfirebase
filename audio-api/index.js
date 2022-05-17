const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")
const fs = require("fs")
const cors = require("cors")

const port = process.env.PORT || 8000;

const app = express()

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'audio/mp3' ||
      file.mimetype === 'audio/x-m4a' ||
      file.mimetype === 'audio/wav' ||
      file.mimetype === 'audio/mid' ||
      file.mimetype === 'audio/aif' 
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  // app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
  app.use(bodyParser.json()); // application/json
  app.use(
    multer({ dest: "audios" , fileFilter: fileFilter }).single('audio')
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

  app.put('/postaudio', (req, res, next) => {
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
  
  app.get("/audios?",function (req, res) {
      const audio = req.query.audio
    res.sendFile(__dirname + "/audios/" + audio )
  });
    
  app.delete('/deleteaudio?',(req,res,next)=>{
    const file = req.query.file
    fs.unlink(__dirname + "/audios/" + file, (err)=>{
        if(err) console.log(err);
        else console.log("deleted");
    })

  })

  
app.listen(port, ()=>{
    console.log(`audio api listening at port ${port}`);
})