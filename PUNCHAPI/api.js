const express = require("express");
const app = express.Router();
const entities = require("./entities");
const uuid = require("node-uuid");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

console.log("HELLO")
//getum sett i fleiri files
app.get("/api/companies", function(req, res){
  console.log("Testing");
  //TODO
});

app.get("/api/companies/:id", function(req, res){
  //TODO
});

app.get("/api/users", function(req, res){
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
      }
  }
);
  //TODO
});

app.post("/api/companies",jsonParser, function(req, res){
  //TODO
});

app.post("/api/users",jsonParser, function(req, res){

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
app.post("/api/my/punches",jsonParser, function(req, res){
  //TODO
});

console.log("HELLO2")
module.exports = app;
