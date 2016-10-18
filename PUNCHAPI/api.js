const express = require("express");
const app = express();
const entities = require("./entities");
const uuid = require("node-uuid");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var adminToken = "Batman";

/**
 * Fetches a list of companies that have been added to MongoDB
 */
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
/**
 * Fetches a given company that has been added to MongoDB by id.
 * if the the we can not finde the id of the company in the db we return 404
 */
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

/**
 * Returns a list of all users that are in the MongoDB.
 */
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
        console.log(temp.token);
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
/**
 * Allows administrators to add new companies to MongoDB
 */
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
/**
 * Allows administrators to add new companies to MongoDB
 */
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
        res.statusCode = 500;
        return res.json("Server error");
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
/**
 * Creates a new punch for the "current user" for a given company
 */
app.post("/my/punches",jsonParser, function(req, res){
  //Þurfum að ná í auth headerinn
  //Renna i gegnum user listan og finna hvort það sé user með það token
  //ef enginn finnst eða vantar token == 401
  //Bua til þá nytt punch með userid
  //Companyid ekki til == 404
  //If count a punches er jafnt og punchCount skila discount = true as well as marking
  //the true
  //annars 201 og punchid
  console.log("Inside punches");
  console.log(req.headers.authorization);
  var tempToken = req.headers.authorization;
  if(tempToken == undefined)
  {
    res.statusCode = 401
    return res.json("The token is missing");
  }
  //se til hvort þurfi
  var Punchlength = false;
  var UserExists = false;
  var PunchesCount = [];
  var response;
  var Punch;
  var UserArray = {};
  entities.User.find({token: tempToken}, function(err,docs)
  {
    if(err)
    {
      res.statusCode = 401
      return res.json(err);
    }
    else {
      console.log("Users Found");
       UserArray = docs[0];
       entities.Company.find({_id: req.company_id}, function(err,docs)
       {
         if(err)
         {
           console.log("Company not found");
           res.statusCode = 404
           return res.json(err);
         }
         else
         {
           console.log("Company found");
           var CompanyArray = docs;
           entities.Punches.find({company_id: req.body.company_id}, function(err,docs)
           {
             if(err)
             {
               res.statusCode = 404
               return res.json(err);
             }
             else {
               PunchesCount = docs;
               //Create the new punch
               var Punch =
               {
                 user_id: UserArray._id,
                 company_id: req.body.company_id
               }
               var entity = new entities.Punches(Punch);
               entity.validate(function(err)
               {
                 if(err)
                 {
                   console.log(Punch);
                   console.log("Failed in validation");
                   res.StatusCode = 412;
                   return res.json("Precondition failed");
                 }
                 console.log("Validation successful");
                 if(PunchesCount.length == CompanyArray.punchCount )
                 {
                   Punchlength = true;
                   console.log("The punches have been reached");
                   //Update the punches
                   var query = {company_id: req.company_id };
                   Punch.update(query,{ $set: {discount:'true'}},callback);
                 }
                 entity.save(function(err) {
                   if(err)
                   {
                     res.statusCode = 500;
                     return res.json("Server error");
                   }
                   else {
                     console.log("Save a sucess");
                     if(Punchlength)
                     {
                       //If the punch count has been reached
                       res.statusCode = 201;
                       return res.json({
                         _id: entity._id,
                         discount: true
                       });
                     }
                     //If the punch count hasn't been reached
                     res.statusCode = 201;
                     return res.json({
                       _id: entity._id,
                     });
                   }
                 });
             });
           }
         });
       }
     });
  }
});
});

module.exports = app;
