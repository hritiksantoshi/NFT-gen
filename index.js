const express = require("express");
const bodyParser = require("body-parser");
const path = require('path')
const app = express();
const {router} = require('./routes');
const config = require('./config/config');
const connection = require('./db/conn');
const dotenv = require('dotenv');
dotenv.config({ path:'./.env' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/',router);
app.use('/images',express.static(path.join(__dirname,"build/images")));
connection.connect().then((connected) => {

  app.listen(config.PORT , (err) => {

      if (err) throw err;

      else console.log(`App Running on port ${config.PORT}`);
  });

  console.log(connected);

}).catch((error) => {

  console.log("Database Connection Error:", error);

});