const express = require('express');
const url = require('url');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public'))) // set up access to the public folder
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    console.log('Received a request for the root (/)')
    res.render("pages/index");
  })

  .get('/postage', (req, res) => {
    
    const parts = url.parse(req.url, true);
    const query = parts.query;
    let params = {};
    let oz = parseFloat(query.ozRange);
    params.weight = query.ozRange;

    console.log('It looks like the form called the right site on the server ' + query.mailType + ", " + query.ozRange)

    switch (query.mailType){
      case "stamp":
          if (oz > 0 && oz <= 1){
            params.result = "$0.55";
          } else if (oz > 1 && oz <= 2) {
            params.result = "$0.70";
          } else if (oz > 2 && oz <= 3) {
            params.result = "$0.85";
          } else if (oz > 3 && oz <= 3.5) {
            params.result = "$1.00";
          } else {
            params.result = "Error, Standard letters can't weight more then 3.5 oz. Please select Large Envelop for pricing on items over 3.5 oz.";
          }
          params.type = "Stamped Letter";
        break;
      case "metered":
        if (oz > 0 && oz <= 1){
          params.result = "$0.50";
        } else if (oz > 1 && oz <= 2) {
          params.result = "$0.65";
        } else if (oz > 2 && oz <= 3) {
          params.result = "$0.80";
        } else if (oz > 3 && oz <= 3.5) {
          params.result = "$0.95";
        } else {
          params.result = "Error, Standard letters can't weight more then 3.5 oz. Please select Large Envelop for pricing on items over 3.5 oz.";
        }
        params.type = "Metered Letter";
        break;
      case "large":
        if (oz > 0 && oz <= 1){
          params.result = "$1.00";
        } else if (oz > 1 && oz <= 2) {
          params.result = "$1.20";
        } else if (oz > 2 && oz <= 3) {
          params.result = "$1.40";
        } else if (oz > 3 && oz <= 4) {
          params.result = "$1.60";
        } else if (oz > 4 && oz <= 5) {
          params.result = "$1.80";
        } else if (oz > 5 && oz <= 6) {
          params.result = "$2.00";
        } else if (oz > 6 && oz <= 7) {
          params.result = "$2.20";
        } else if (oz > 7 && oz <= 8) {
          params.result = "$2.40";
        } else if (oz > 8 && oz <= 9) {
          params.result = "$2.60";
        } else if (oz > 9 && oz <= 10) {
          params.result = "$2.80";
        } else if (oz > 10 && oz <= 11) {
          params.result = "$3.00";
        } else if (oz > 11 && oz <= 12) {
          params.result = "$3.20";
        } else if (oz > 12 && oz <= 13) {
          params.result = "$3.40";
        } else {
          params.result = "Error, Large Envelopes can't weight more then 13 oz. Please call post office for pricing";
        }
        params.type = "Large Envelope";
        break;
      case "package":
        if (oz > 0 && oz <= 4){
          params.result = "$3.80";
        } else if (oz > 4 && oz <= 8) {
          params.result = "$4.60";
        } else if (oz > 8 && oz <= 12) {
          params.result = "$5.30";
        } else if (oz > 12 && oz <= 13) {
          params.result = "$5.90";
        } else {
          params.result = "Error, Large Envelopes can't weight more then 13 oz. Please call post office for pricing";
        }
        params.type = "First-Class Package Service";
        break;
      default:
        params.result = "Error, it looks like something not quite right. Please try again";
        break;
    }

    if(query.format && query.format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(params));
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.render("pages/response", params);
    }
    
  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
