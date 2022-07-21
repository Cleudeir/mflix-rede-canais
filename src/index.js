const express = require('express');
const bodyParser = require('body-parser');
const Crawler = require('crawler');
const pageOne = require('./pages/pageOne');
const app = express()
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

const port = process.env.PORT || 3333
const baseUrl = "https://redecanais.to";

app.get('/start', (req, res) => {
  const c = new Crawler({
    maxConnections: 5,
    callback (error, resp, done) {    
        if(error){
          return null
        } 
        pageOne({baseUrl,resp,send})
      }
    })
    c.queue(`${baseUrl}/mapafilmes.html`);

    function send(result){
      fs.writeFileSync("data.json", JSON.stringify(result))
      res.status(200).json(result)
    }

  });
  app.get('/data', (req, res) => {
      const result = require('../data.json') || {}
      res.status(200).json(result)
    });

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`)
})

