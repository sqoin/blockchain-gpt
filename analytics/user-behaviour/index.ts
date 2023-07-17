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



app.get("/user-behaviour/PaidAccountsYEAR", (req:any, res:any) => {
  var date = new Date();
  let result = [
  { name: "freeAccounts", count: 2, date:"202207"},
  { name: "PaidAccounts", count:3 , date:"202207"},
  { name: "freeAccounts", count: 3, date:"202208"},
  { name: "PaidAccounts", count:7 , date:"202208"},
  { name: "freeAccounts", count: 4, date:"202209"},
  { name: "PaidAccounts", count:10 , date:"202209"},
  { name: "freeAccounts", count: 6, date:"202210"},
  { name: "PaidAccounts", count:11 , date:"202210"},
  { name: "freeAccounts", count: 7, date:"202211"},
  { name: "PaidAccounts", count:14 , date:"202211"},
  { name: "freeAccounts", count: 9, date:"202212"},
  { name: "PaidAccounts", count:17 , date:"202212"},
  { name: "freeAccounts", count: 10, date:"202301"},
  { name: "PaidAccounts", count:19 , date:"202301"},
  { name: "freeAccounts", count: 11, date:"202302"},
  { name: "PaidAccounts", count:21 , date:"202302"},
  { name: "freeAccounts", count: 11, date:"202303"},
  { name: "PaidAccounts", count:23 , date:"202303"},
  { name: "freeAccounts", count: 12, date:"202304"},
  { name: "PaidAccounts", count:25 , date:"202304"},
  { name: "freeAccounts", count: 13, date:"202305"},
  { name: "PaidAccounts", count:26 , date:"202305"},
  { name: "freeAccounts", count: 14, date:"202306"},
  { name: "PaidAccounts", count:28 , date:"202306"},
  { name: "freeAccounts", count: 15, date:"202307"},
  { name: "PaidAccounts", count:30 , date:"202307"}]
  

  

    

  res.send(result);



  

});






app.listen(PORT, () => {
  console.log('server is listening on port ' + PORT)
})

