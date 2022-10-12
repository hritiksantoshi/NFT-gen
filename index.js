const express = require("express");
const bodyParser = require("body-parser");
const path = require('path')
const app = express();
const cors = require('cors');
const router = require('./routes');
const config = require('./config/config');
const connection = require('./db/conn');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
dotenv.config({ path:'./.env' });
const corsOptions = {
  origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (['http://localhost:3000', 'http://localhost:8000'].indexOf(origin) === -1) {
          let msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
      }
      return callback(null, true);
  },
  optionsSuccessStatus: 200
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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

// const arr = [1,6,6,7,7,11,19,20];
// const arr1=  [];// rep
// const arr2 = [];// missing

// for(let i=0;i<arr.length;i++){
//   if(arr[i] == arr[i+1]){
//     arr1.push(arr[i]);
//   }
//   for(let j = arr[i]+1;j<arr[i+1];j++){
//     arr2.push(j)
//   }
// }

// console.log(arr1);
// console.log(arr2);
// const num = 134;
// let str = num.toString();
// let arr = str.split("");
// let apparr = arr.map((e) =>{
//     return [e*num;
// })
// console.log(apparr);