var express = require("express");
const cors = require('cors');

var bodyParser = require("body-parser");

let PORT=3033;
var app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req:any, res: any, next:any) => {
  res.payload = {};
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
  res.header("X-Frame-Options: SAMEORIGIN");
  next();
});








app.get("/user-behaviour/getUsersConnectedFirstTimePerMonth", (req:any, res:any) => {

      var date = new Date();
      let result=[{account:2,date:new Date(date.getDate() - 8)},{account:2,date:new Date(date.getDate() - 7)},{account:2,date:new Date(date.getDate() - 6)},
        {account:2,date:new Date(date.getDate() - 5)},{account:2,date:new Date(date.getDate() - 4)},{account:2,date:new Date(date.getDate() - 3)},
        {account:2,date:new Date(date.getDate() - 2)},{account:10,date:new Date(date.getDate() - 1)},{account:15,date:new Date()}]
      res.send(result);
});

app.listen(PORT, () => {
  console.log('server is listening on port ' + PORT)
})

