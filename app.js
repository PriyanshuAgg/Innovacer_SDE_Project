const puppeteer = require('puppeteer');
const $ = require('cheerio');

const scrapedData = (keyword, callback) => puppeteer //scrapped from google using npm packages pupeeteer and cheerio
  .launch()
  .then(function(browser) {
    return browser.newPage();
  })
  .then(function(page) {
    const url = `https://www.google.co.in/search?q=${keyword}+cure&oq=${keyword}+cure&aqs=chrome..69i57j0l5.11735j0j7&sourceid=chrome&ie=UTF-8`;
    return page.goto(url).then(function() {
      return page.content();
    });
  })
  .then(function(html) {
    let arr1 =[];
    let arr2 =[];
    let obj = {};
    $('div.hXYDxb', html).each(function() {
      arr1.push($(this).text().split('\n').toString());
    });
    
    $('div.Y6f3fc', html).each(function() {
       arr2.push($(this).text().split('\n').toString());
    });
    // console.log(arr1);
    // console.log(arr2);
    for (var i = 0; i < arr1.length; i++) {
        obj[arr1[i]] = arr2[i];
    }
    // console.log(obj)
    callback(obj) //returns obj
  })
  .catch(function(err) {
    return -1
  });



module.exports = scrapedData; //exporting scrapedData so that some js file can take use of it
