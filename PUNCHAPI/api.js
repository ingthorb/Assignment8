const express = require("express");
const app = express();
const entities = require("./entities");
const uuid = require("node-uuid");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var adminToken = "Batman";

//getum sett i fleiri files
app.get("/companies", function(req, res){
  console.log("Testing");
  entities.Company.find(function(err,docs)
  {
      if(err)
      {
        res.statusCode = 500
        return res.json(err);
      }
      else {
        //Na i allt nema token
        console.log("TESTING");
        //docs er array
        res.json(docs);
      }
  }
);
});

app.get("/companies/:id", function(req, res){
  entities.Company.find({_id: id}, function(err,docs)
  {
      if(err)
      {
        res.statusCode = 404
        return res.json(err);
      }
      else {
        res.json(docs);
      }
  }
);
});

app.get("/users", function(req, res){
  console.log("Testing");
  entities.User.find(function(err,docs)
  {
      if(err)
      {
        res.statusCode = 500
        return res.json(err);
      }
      else {
        //Na i allt nema token
        console.log("TESTING");
        //docs er array
        var UserArray = [];
        for(i = 0; i < docs.length; i++)
        {
          var temp = docs[i];
          var user =
          {
              _id: temp._id,
              name: temp.name,
              gender: temp.gender
          };
          UserArray.push(user);
        }

        //Viljum for loopa í gegn og ná í hvern og einn gæja
        //skila svo aftur array án token
        res.json(UserArray);
      }
  }
);
});

app.post("/companies",jsonParser, function(req, res){
});

app.post("/users",jsonParser, function(req, res){
    console.log(req.headers.authorization);
    if(req.headers.authorization !== adminToken)
    {
      res.statusCode = 401;
      return res.json("Not Authorized");
    }

  var User = {
    name: req.body.name,
    gender: req.body.gender,
    token: uuid.v1()
  };

  //Byr til instance i minni
  var entity = new entities.User(User);

  entity.save(function(err) {
      if(err)
      {
        res.statusCode = 412;
        return res.json("Save failed");
      }
      else {
         res.statusCode = 201;
         return res.json({
           _id: entity._id,
           token: User.token
         });
      }
  });
});
app.post("/my/punches",jsonParser, function(req, res){
});


module.exports = app;
