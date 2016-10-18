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
 * Allows administrators to add new companies to MongoDB
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
          var user =
          {
              _id: temp._id,
              name: temp.name,
              gender: temp.gender
          };
          UserArray.push(user);
        }
        res.json(UserArray);
      }
  }
);
});

/**
 * Allows administrators to add a new user.
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
 * Returns a list of all users that are in the MongoDB. 
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
  console.log(req.headers.authorization);
  var tempToken = req.headers.authorization;
  if(tempToken === undefined)
  {
    res.statusCode = 401
    return res.json("The token is missing");
  }
  //se til hvort þurfi
  var UserExists = false;
  var UserArray = [];
  var PunchesCount = [];
  var response;
  console.log(UserArray);
  entities.User.find(function(err,docs)
  {
      if(err)
      {
        res.statusCode = 401
        return res.json(err);
      }
      else {
        UserArray = docs;
        }
  }
  for(i = 0; i < UserArray.length; i++)
  {
    var temp = UserArray[i];
    if(temp.token === tempToken )
    {
      UserExists = true;
      entities.Company.find({_id: req.company_id}, function(err,docs)
      {
          if(err)
          {
            res.statusCode = 404
            return res.json(err);
          }
          else {
            var CompanyArray = docs;
          }
      }
      //check what the punchCount is of the user for the company
      entities.Punches.find({company_id: req.company_id}, function(err,docs)
      {
          if(err)
          {
            res.statusCode = 404
            return res.json(err);
          }
          else {
             PunchesCount = docs;
          }
      }
      var Punch =
      {
        user_id: req.body.user_id,
        company_id: req.body.user.company_id
      }
      var entity = new entities.Punches(Punch);
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
              if(PunchesCount.length == CompanyArray.punchCount )
              {
                console.log("The punches have been reached");
                //Add discount: true into the response
                //change the used to true for every punch

                for(i = 0; i < PunchesCount.length; i++)
                {

                }
                res.statusCode = 201;
                return res.json({
                  _id: entity._id,
                  discount: true
                });
              }
               res.statusCode = 201;
               return res.json({
                 _id: entity._id
               });
            }
        });

      //bua til svo

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
