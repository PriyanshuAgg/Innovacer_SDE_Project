
var crypto = require('crypto'),
    secret_key = "priyanshu200198@gmail.com",
    password = "j8M5Eko2Y6NpGy34S",
    express = require("express"),
    CryptoJS = require('crypto-js'),
    app = express(),
    request = require('request'),
    bodyParser = require("body-parser"),
    mongoose    = require("mongoose"),
    _ = require("underscore");

const scrapedData = require('./scrape.js');  //invoking app.js file which is giving us some data after scrapping through web


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/treatment_data");  //connecting to database at port 27017

var issueSchema = new mongoose.Schema({    //making schema or collection that stored in our database
   name: String,
   treatment: mongoose.Schema.Types.Mixed
});

var Issue = mongoose.model("Issue", issueSchema);   // put schema model in a variable or can say collection 


var uri = "https://sandbox-authservice.priaid.ch/login",
    computedHash = CryptoJS.HmacMD5(uri, password),
    computedHashString = computedHash.toString(CryptoJS.enc.Base64),  //gives password after encryption
    auth = 'Bearer ' + secret_key + ':' + computedHashString,
    url = "https://sandbox-authservice.priaid.ch/login",
    token,
    allSymptoms,
    collname = "not";

  request.post({        //posting request to given url to get token to access that site and get data from it
      url : url,
      headers : 
          {
              "Host": 'sandbox-authservice.priaid.ch',
              "Authorization" : auth
          } 
      },function(error, response, body) 
          { 
            if(error)
              console.log("error", error)
              var data = JSON.parse(body);
              token = data["Token"];
          });

app.get("/", function(req, res){   // function to get symptoms from given api and call search.ejs file
        var url = "https://sandbox-healthservice.priaid.ch/symptoms?token="+token+"&language=en-gb";
        request(url, function(error, response, body)
          {   
              if(!error && response.statusCode == 200) 
                {
                    allSymptoms = JSON.parse(body);
                    res.render("search",{symptoms: allSymptoms});  
                }              
          });
    });

app.post("/search", function(req, res){   //receive information from form submission in search.ejs and call given api to get issues and send them to issues.ejs file
    var arr2= [];
    var gender = (req.body.gender);
    var yob = req.body.yob
    var arr2 = req.body.id;
    var array = arr2.split(",");
    var idarr = [];
    for (var i = 0; i < array.length-1; i++) 
    { 
      for (var j = 0; j < allSymptoms.length; j++) 
      {
          if(allSymptoms[j].Name == array[i])
          {
            idarr.push(allSymptoms[j].ID);
          }
      }
    }
    //var arrw = [104,124];
    var uri = "https://sandbox-healthservice.priaid.ch/diagnosis?token="+token+"&language=en-gb&symptoms=["+idarr+"]&gender="+gender+"&year_of_birth="+yob;
        request(uri, function(error, response, body){
          if(!error && response.statusCode == 200) 
                {
                  //console.log(body);
                    diagnosis = JSON.parse(body);
                    res.render("issues",{issues: diagnosis});
                }

        })        
    });

app.get("/results", (req, res) => {  //now finally send treatment options data we are getting after scrapping to output.ejs file
  //console.log(req.query.issue)
  Issue.find({name:req.query.issue},function(err, allIssues){
       if(err || allIssues.length === 0)
       {
           console.log(err);
           res.render("output",{treatments:allIssues[0].treatment});
       } 
       else 
       {
          scrapedData(req.query.issue, (data) => {
            var issue = req.query.issue;
            if(!_.isEmpty(data))  //if we are getting data after scrapping 
            {
              //console.log("true");
              var newIssue = {name:issue, treatment: data};
              Issue.create(newIssue, function(err, newlyCreated) //putting dta in dtabase collection
              {
                  if(err)
                  {
                    console.log(err);
                  } 
                  else 
                  {
                    console.log("Created");
                  }
              });
              res.render("output",{treatments:data});
            }
            else //if not getting data from scrpping call issues info api to get treatment options and specialists
            {
              var obj = {};
              var issueid= req.query.issueid;
              specialisation = req.query.specialisation;
              //console.log(specialisation);
              var uri = "https://sandbox-healthservice.priaid.ch/issues/"+issueid+"/info?token="+token+"&language=en-gb";
              request(uri, function(error, response, body){
              if(!error && response.statusCode == 200) 
                {
                  //console.log(body);
                  desc = JSON.parse(body);
                  //console.log(desc);
                  //console.log(desc.TreatmentDescription);
                  obj["TreatmentDescription"] = desc.TreatmentDescription;
                  obj["Specialist"] = specialisation;
                  res.render("output",{treatments:obj});
                }
              })
            }
          })
       }
    });
  
  
})  

app.listen(8080, function(){  // local host running at 8080
   console.log("Server Has Started!");
});