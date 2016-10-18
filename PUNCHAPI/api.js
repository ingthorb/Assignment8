const express = require("express");
const app = express();
const entities = require("./entities");
const uuid = require("node-uuid");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var adminToken = "Batman";

//getum sett i fleiri files
app.get("/companies", function GetCompanies(req, res){
  entities.Company.find(function(err,docs)
  {
      if(err)
      {
        res.statusCode = 500
        return res.json(err);
      }
      else {
        var CompanyArray = [];
        for(i = 0; i < docs.length; i++)
        {
          var temp = docs[i];
          var company =
          {
              _id: temp._id,
              name: temp.name,
              punchCount: temp.punchCount
          };
          CompanyArray.push(company);
        }
        //docs er array
        res.json(CompanyArray);
      }
  }
  );
});

app.get("/companies/:id", function(req, res){
  entities.Company.find({_id: req.params.id}, function(err,docs)
  {
      if(err)
      {
        res.statusCode = 404
        return res.json(err);
      }
      else {
        if(docs != null && docs.length > 0)
        {
            res.json(docs);
        }
        else{
          res.statusCode = 404
          return res.json("Company not found");
        }
      }
  });
});


app.get("/users", function GetUsers(req, res){
  entities.User.find(function(err,docs)
  {
      if(err)
      {
        res.statusCode = 500
        return res.json(err);
      }
      else {
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
  console.log("NaNaNaNaNaNaNa" + req.headers.authorization);
  if(req.headers.authorization !== adminToken)
  {
    res.statusCode = 401;
    return res.json("Not Authorized");
  }
  var Company = {
    name: req.body.name,
    punchCount: req.body.punchCount
  };
  var entity = new entities.Company(Company);
  entity.validate(function(err)
  {
    if(err)
    {
        res.StatusCode = 412;
        return res.json("Precondition failed");
    }
    entity.save(function(err) {
        if(err)
        {
          res.statusCode = 500;
          return res.json("Server error");
        }
        else {
           res.statusCode = 201;
           return res.json({
             _id: entity._id,
           });
        }
    });
  });

});

app.post("/users",jsonParser, function(req, res){
  console.log("NaNaNaNaNaNaNa" + req.headers.authorization);
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

  var entity = new entities.User(User);
  entity.validate(function(err)
  {
    if(err)
    {
        res.StatusCode = 412;
        return res.json("Precondition failed");
    }
    entity.save(function(err) {
        if(err)
        {
          res.statusCode = 412;
          return res.json("Values incorrect");
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
});
app.post("/my/punches",jsonParser, function(req, res){
  //Þurfum að ná í auth headerinn
  //Renna i gegnum user listan og finna hvort það sé user með það token
  //ef enginn finnst eða vantar token == 401
  //Bua til þá nytt punch með userid
  //Companyid ekki til == 404
  //If count a punches er jafnt og punchCount skila discount = true as well as marking
  //the true
  //annars 201 og punchid
  var tempToken = req.headers.authorization;
  //se til hvort þurfi
  var UserExists = false;
  var UserArray = GetUsers();
  console.log(UserArray);
  entities.User.find(function(err,docs)
  {
      if(err)
      {
        res.statusCode = 500
        return res.json(err);
      }
      else {
        UserArray = docs;
        }
  }
  console.log(req.headers.authorization);
  for(i = 0; i < UserArray.length; i++)
  {
    var temp = UserArray[i];
    if(temp.token === tempToken )
    {
      UserExists = true;
      //User exists
      //find the company
      entities.Company.find({_id: req.company_id}, function(err,docs)
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

    }
  }

//Return 401 if the temp.token isn't available
});

/*function GetCompanies(req,res)
{
  entities.Company.find(function(err,docs)
  {
      if(err)
      {
        res.statusCode = 500
        return res.json(err);
      }
      else {
        var CompanyArray = [];
        for(i = 0; i < docs.length; i++)
        {
          var temp = docs[i];
          var company =
          {
              _id: temp._id,
              name: temp.name,
              punchCount: temp.punchCount
          };
          CompanyArray.push(company);
        }
        //docs er array
        res.json(CompanyArray);
      }
  }
  );
}*/

module.exports = app;
