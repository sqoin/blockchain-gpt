const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const env = require("dotenv").config({ path: "./.env" });
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-08-01",
  });
  

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use((req, res, next) => {
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


const port = process.env.PORT || 3002;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


  app.get("/config", (req, res) => {
    console.log(process.env.STRIPE_PUBLISHABLE_KEY);

    res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  });
  app.post("/create-payment-intent",async(req,res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        currency :'eur',
        amount : 1999,
         automatic_payment_methods:{
          enabled: true,
         },
      });
      res.send({clientSecret : paymentIntent.client_secret  });
    }  catch (e){
      return res.status(400).send({
        error:{
          message : e.message,
        },
      });
    } 
    
  
  });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
