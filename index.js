const express = require("express");

const bodyParser = require("body-parser");
const controller = require('./controller/index')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post( "/upload",controller.upload,controller.NFTgen);
app.listen(3000, (err) => {
  if (err) throw err;
  else console.log(`App Running on port 3000`);
});
