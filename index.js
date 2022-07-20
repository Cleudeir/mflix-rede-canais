const express = require('express');
const bodyParser = require('body-parser');
const Crawler = require('crawler');
const fetch = (...args) => import('node-fetch')
	.then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

const port = process.env.PORT || 3333
/*
app.get('/',(req, res)=>{
  res.status(200).json("online")
})
<iframe name=Player "" src="https://sinalpublico.com/player3/serverf5hlb.php?vid=ALVE" frameborder=0 height=400 scrolling=no width=640 allowFullScreen> </iframe>
*/
const BASE_URL = "https://redecanais.to";

app.get('/', (req, res) => {
  // const {type} = req.body;
  const type = "movie"
  const c = new Crawler({
    maxConnections: 5,
    // This will be called for each crawled page
    async callback (error, resp, done) {
      if (error) {
      } else {
        const { $ } = resp;           
          const response = $('a:contains("Assistir")');
          const firstPageData = []
          for (let i = 0; i < response.length; i++) {
            const url = response[i].attribs.href;          
            if(url.includes('dublado')){
              const [one] = url.split('-dublado-')
              const name = one.replace('/','').split("-").join(' ')
              firstPageData.push({name, url})        
            }
          }                
            const secondPageData = [];
            let count = 0
            const dataSlice = firstPageData.slice(0,2000)
            
            for (let j = 0; j < dataSlice.length; j++) {
              const {url, name} = firstPageData[j]
              const c =  new Crawler({
                maxConnections: 5,
                async callback(error, resp, done) {  
                  count++                
                  if (error) {                 
                  } else {
                    const { $ } = resp;
                    const response = $('iframe')
                    if(response && response[0] && response[0].attribs && response[0].attribs.src){                      
                      const [one,two] = response[0].attribs.src.split(".php")                 
                      secondPageData.push(
                        {name ,
                        url: one+"hlb"+".php"+two
                      })
                    }
                   }                   
                   if(count === dataSlice.length){
                    count=0
                      const result = []
                      for (let k = 0; k < secondPageData.length; k++) {                        
                        const {url, name} = secondPageData[k]
                        const api_key = "5417af578f487448df0d4932bc0cc1a5"
                        const query = name.split(" ").join("+")
                        const pull = fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}&language=pt-BR`)
                        .then(data=>data.json()).then(data=>{
                          count++
                          
                          if(data.results.length > 0){
                            const [info] = data.results                            
                            result.push({...info,url,title_redecanais:name})
                            if(count === secondPageData.length){
                              fs.writeFileSync("data.json", JSON.stringify(result))
                              console.log(result.length)
                              res.status(200).json(result)
                              done()
                            }
                          }                          
                        })                    
                      }
                  }
                }
                })
            c.queue(`${BASE_URL}${url}`);
          }
       }
      }      
    })
    c.queue(`${BASE_URL}/mapafilmes.html`);
  });


app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`)
})