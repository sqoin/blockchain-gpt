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




function formatDate(date:any) {
  // Convert the input date object to a string and remove all hyphens (-)
  let formattedDate = date
    .toISOString()
    .replace(/-/g, "")
    .replace(/:/g, "")
    .replace(/\.000/g, "");

  // Parse the formatted string back into a date object and return it
  return formattedDate;
}



app.get("/user-behaviour/getUsersConnectedFirstTimePerMonth", (req:any, res:any) => {

      var date = new Date();
      let result=[{account:3,date:"1688541367000"},{account:2,date:"1688627767000"},{account:2,date:"1688714167000"},
        {account:2,date:"1688800567000"},{account:2,date:"1688886967000"},{account:2,date:"1688973367000"},
        {account:2,date:"1689059767000"},{account:10,date:"1689146167000"},{account:15,date:"1689232567000"}]
      res.send(result);
});

app.listen(PORT, () => {
  console.log('server is listening on port ' + PORT)
})

