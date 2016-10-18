const express = require("express");
const app = express();
const entities = require("./entities");
const uuid = require("node-uuid");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//getum sett i fleiri files
app.get("/companies", function(req, res){
  console.log("Testing");
  entities.Companies.find(function(err,docs)
  {
      if(err)
      {
        res.statusCode = 500
        return res.send(err);
      }
      else {
        //Na i allt nema token
        console.log("TESTING");
        //docs er array
        //Viljum for loopa í gegn og ná í hvern og einn gæja
        //skila svo aftur array án token
        res.json(docs);
      }
  }
);
});

app.get("/companies/:id", function(req, res){
  //TODO
});

app.get("/users", function(req, res){
  console.log("Testing");
  entities.User.find(function(err,docs)
  {
      if(err)
      {
        res.statusCode = 500
        return res.send(err);
      }
      else {
        //Na i allt nema token
        console.log("TESTING");
        //docs er array
        //Viljum for loopa í gegn og ná í hvern og einn gæja
        //skila svo aftur array án token
        res.json(docs);
      }
  }
);
  //TODO
});

app.post("/companies",jsonParser, function(req, res){
  //TODO
});

app.post("/users",jsonParser, function(req, res){

      if(req.headers.Authorization !== adminToken)
      {
        res.statusCode = 401;
        return res.send("Not Authorized");
    }

  var User = {
    name: req.body.name,
    gender: req.body.gender,
    token: uuid.v1()
  };

  //Byr til instance i minni
  var entity = new entities.User(data);

  entity.save(function(err) {
      if(err)
      {
        res.statusCode = 412;
        return res.send("Save failed");
      }
      else {
         res.statusCode = 201;
         return res.send({
           _id: entity._id,
           token: data.token
         });
      }
  });
  //TODO
});
app.post("/my/punches",jsonParser, function(req, res){
  //TODO
});

console.log("HELLO2")
module.exports = app;
