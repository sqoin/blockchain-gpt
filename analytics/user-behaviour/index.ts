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
      let result=[{ccount:3,date:"20230704000000"},{ccount:2,date:"20230705000000"},{ccount:2,date:"20230706000000"},
        {ccount:2,date:"20230707000000"},{ccount:2,date:"20230708000000"},{ccount:2,date:"20230709000000"},
        {ccount:2,date:"20230710000000"},{ccount:10,date:"20230711000000"},{ccount:15,date:"20230712000000"}]
      res.send(result);
});

app.get("/user-behaviour/getRequestNumberPerDay", (req:any, res:any) => {

  var date = new Date();
  let result=[{number_of_requests:12,date:"20230704000000"},{number_of_requests:20,date:"20230705000000"},{number_of_requests:29,date:"20230706000000"},
    {number_of_requests:25,date:"20230707000000"},{number_of_requests:27,date:"20230708000000"},{number_of_requests:29,date:"20230709000000"},
    {number_of_requests:24,date:"20230710000000"},{number_of_requests:30,date:"20230711000000"},{number_of_requests:35,date:"20230712000000"}]
  res.send(result);
});

app.get("/user-behaviour/PaidAccounts", (req:any, res:any) => {let result = [
  { name: "freeAccounts", count: 15 },
  { name: "PaidAccounts", count:30 }]

  res.send(result);

  

});






app.listen(PORT, () => {
  console.log('server is listening on port ' + PORT)
})

