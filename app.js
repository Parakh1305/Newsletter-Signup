const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();

client.setConfig({
  apiKey: "d0e56fefc6371b22c5c565a291f6e1bc-us1",
  server: "us21",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  const run = async () => {
    const response = await client.lists.addListMember("0c1723134a", {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    // console.log(response); // (optional)
  };

  run();

  if(res.statusCode===200){
    res.sendFile(__dirname + "/success.html");
  }else{
    res.sendFile(__dirname + "/failure.html");
  }
  // const data = {
  //     members: [
  //         {
  //             email_address: email,
  //             status: "subscribed",
  //             merge_fields: {
  //                 FNAME: firstName,
  //                 LNAME: lastName,
  //             }
  //         }
  //     ]
  // };

  // const jsonData = JSON.stringify(data);
  // const url = "https://us21.api.mailchimp.com/3.0/lists/0c1723134a";
  // const options = {
  //     method: "POST",
  //     auth: "Parakh1305:d0e56fefc6371b22c5c565a291f6e1bc-us21",
  // };

  // const request = https.request(url,options,function(response){
  //     response.on("data",function(data){
  //         console.log(JSON.parse(data));
  //     })
  // });

  // request.write(jsonData);
  // request.end;
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});

// API Key: d0e56fefc6371b22c5c565a291f6e1bc-us21
// List ID: 0c1723134a
