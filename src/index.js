const express = require('express');
const bodyParser = require('body-parser');
const Crawler = require('crawler');
const pageOne = require('./pages/pageOne');
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

const port = process.env.PORT || 3333
const baseUrl = "https://redecanais.to";

app.get('/', (req, res) => {
  const c = new Crawler({
    maxConnections: 5,
    callback (error, resp, done) {     
        pageOne({baseUrl,resp,send})
       }
    })
    c.queue(`${baseUrl}/mapafilmes.html`);

    function send(result){
      console.log(result)
      res.status(200).json(result)
    }

  });

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`)
})

