# Symptom App

## Functionality

1.  Install require packages like : crypto-js,body-parser,express,mongoose,request,crypto etc

2.  Call scrape.js file that return data after scrapping the web, using google here to get data

3.  Packages require for scrapping : puppeteer , cheerio

4.  Making database and connecting to database using mongoose

5.  Creating schema/collection with two attributes one as string type and other as string type

6.  Sending post request to given Host and get token to access some API

7.  Making get request to given API to get Symptoms Data and Pass to "search.ejs" File

8.  search.ejs file - making form for user to fill some details like Gender , year_Of_birth, and choose symptoms from given list suggested at time of filling that particular entry (Using JqueryUI for Autocompletion Functionality)

9.  Making post request to get data of form fill by user

10. Using this data we call API to get data(contains info like issues, specialists etc) and send it to issues.ejs file 

11. issues.ejs file - Show issues realated to that Symptoms if exists otherwise shows No Issues Found and on click of user to any issue sending some data like issueid, ICDName,Specialists to server.js in response of get request made by server

12. After getting data from issues.js we check whether data(Issue) is already exist in our collection or not, If exists then send that to "output.ejs" file if not send to scrape.js file to get data after scrapping through web and add to our collection and send it to "output.ejs" file

13. output.ejs file - Shows the treatment options like medication, self-care, specialists, therapies, Medical-care etc

## Enviornments

1. Node.js
2. MongoDB

## Libraries Used

1. Express
2. Mongoose
3. Request
