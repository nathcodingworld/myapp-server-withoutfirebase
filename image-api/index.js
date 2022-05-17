const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")
const fs = require("fs")

const port = process.env.PORT || 7000;

const app = express()

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  // app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
  app.use(bodyParser.json()); // application/json
  app.use(
    multer({ dest: "images" , fileFilter: fileFilter }).single('image')
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
    
  app.get("/images?",function (req, res) {
      const image = req.query.image
    res.sendFile(__dirname + "/images/" + image )
  });
    
  app.delete('/deleteimage?',(req,res,next)=>{
    const file = req.query.file
    fs.unlink(__dirname + "/images/" + file, (err)=>{
        if(err) console.log(err);
        else console.log("deleted");
    })

  })
  app.put('/postimage', (req, res, next) => {
    // if (!req.isAuth) {
    //   throw new Error('Not authenticated!');
    // }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
    }
    return res
      .status(201)
      .json({ message: 'File stored.', filePath: req.file.path });
  });
  
app.listen(port, ()=>{
    console.log(`listening at ${port}`);
})