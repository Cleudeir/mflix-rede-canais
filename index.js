const express = require('express');
const bodyParser = require('body-parser');
const Crawler = require('crawler');
const fetch = (...args) => import('node-fetch')
	.then(({default: fetch}) => fetch(...args));

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
        console.log(error);
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
            const dataSlice = firstPageData.slice(0,10)
            function add(){
              count++
            }
            for (let j = 0; j < dataSlice.length; j++) {
              const {url, name} = firstPageData[j]
              const c =  new Crawler({
                maxConnections: 5,
                async callback(error, resp, done) {                  
                  if (error) {
                    console.log(error);
                  } else {
                    const { $ } = resp;
                    const response = $('iframe')[0].attribs.src;
                    if(response){
                      const [one,two] = response.split(".php")
                      const info = await RequestInfo({ name, type , add})
                      secondPageData.push(
                        {...info ,
                        url: BASE_URL+one+"hlb"+".php"+two
                      })
                    }
                   }                   
                   if(count === dataSlice.length){                   
                    res.status(200).json(secondPageData)
                    console.log('firstPageData ', firstPageData.length)
                    console.log('secondPageData ', secondPageData)
                    done()
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


async function RequestInfo({ name, type , add}) {
 
}