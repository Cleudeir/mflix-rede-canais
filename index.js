const express = require('express');
const bodyParser = require('body-parser');
const env = require('dotenv').config().parsed
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
  const {type} = req.body; 
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
              const [one,two] = url.split('-dublado-')
              const name = one.replace('/','').split("-").join(' ')
              let dataAno = ''
              let quality = ''
              if(two && two.includes('-')){
                const [dataAnoSplite,qualitySplite] = two.split('-')
                dataAno = dataAnoSplite
                if(qualitySplite){
                  [quality] = qualitySplite.split('_')
                }
              }
              firstPageData.push({name, url, dataAno,quality})        
            }         
          }
                
            const secondPageData = [];
            for (let j = 0; j < 10; j++) {
               console.log(`${BASE_URL}${firstPageData[j].url}`)
              const c =  new Crawler({
                maxConnections: 5,
                async callback(error, resp, done) {
                  if (error) {
                    console.log(error);
                  } else {       
                    const { $ } = resp;
                    const response = $('iframe')[0].attribs.src;
                    if(response){                         
                      secondPageData.push(response)                
                    }                
                   }                       
                  }      
                })
            c.queue(`${BASE_URL}${firstPageData[j].url}`);
            } 
          console.log('firstPageData ', firstPageData.length)
          console.log('secondPageData ', secondPageData)
          done()         
       }     
      }      
    })
    c.queue(`${BASE_URL}/mapafilmes.html`);
  });




/*

app.post('/themoviedb', async(req, res) => {
  console.log('themoviedb ',req.body)
  const { library, type } = req.body;
  if(!library || !type){
    res.status(200).json("Falta parameros")
    return null
  }
  const get = async () => {
    const arrayInfos = [];
    for (let i = 0; i < library.length; i += 1) {
      const getFetch = await RequestInfo({ id: library[i], type })
      arrayInfos.push(getFetch);
    }
    const result = await Promise.all(arrayInfos)
    return result
  };
  const pull = await get();
  const result = pull.filter((x) => x !== false);
  res.status(200).json(result);
})

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`)
})

async function RequestInfo({ id, type }) {
  const API_KEY = '5417af578f487448df0d4932bc0cc1a5';
  const API_BASE = 'https://api.themoviedb.org/3';
  const pullSearch = await fetch(`${API_BASE}/${type}/${id}?api_key=${API_KEY}`)
  const jsonSearch = await pullSearch.json()
  if (jsonSearch && jsonSearch.genres && jsonSearch.poster_path) {
    if (jsonSearch.backdrop_path) {
      jsonSearch.backdrop_path = `https://image.tmdb.org/t/p/original${jsonSearch.backdrop_path}`;
    } else {
      jsonSearch.backdrop_path = `https://image.tmdb.org/t/p/original${jsonSearch.poster_path}`;
    }

    jsonSearch.poster_path = `https://image.tmdb.org/t/p/w342${jsonSearch.poster_path}`;

    if (jsonSearch.genres[0]) {
      jsonSearch.genres = await jsonSearch.genres[0].name;
    } else if (jsonSearch.genres[1]) {
      jsonSearch.genres = await jsonSearch.genres[1].name;
    } else if (jsonSearch.genres[2]) {
      jsonSearch.genres = await jsonSearch.genres[2].name;
    } else {
      jsonSearch.genres = 'Others';
    }
    if (type === 'movie') {
      const {
        backdrop_path,
        genres,
        original_title,
        overview,
        poster_path,
        runtime,
        title,
        vote_average,
      } = jsonSearch;

      return {
        backdrop_path,
        genres,
        imdb_id: id,
        original_title,
        overview,
        poster_path,
        runtime,
        title,
        vote_average,
      };
    }
    if (type === 'tv') {
      const {
        backdrop_path,
        genres,
        original_title,
        overview,
        poster_path,
        runtime,
        original_name,
        vote_average,
        number_of_seasons,
      } = jsonSearch;
      // buscar informação detalhada das temporadas
      async function SeasonsDetails() {
        const promisse_seasons_details = [];
        for (let i = 1; i <= number_of_seasons; i += 1) {
          try {
            const search_details = await fetch(
              `${API_BASE}/tv/${id}/season/${i}?api_key=${API_KEY}`,
            )
            const json = await search_details.json()
            promisse_seasons_details.push(json);  
          } catch (error) {
            console.log(error)
          }        
        }
        const result = await Promise.all(promisse_seasons_details)
        return result
      }
      const seasons_details = await SeasonsDetails(); 
      const seasons = [];
      for (let j = 0; j < seasons_details.length; j += 1) {
        if(
          seasons_details[j].episodes && 
          seasons_details[j].episodes.length
          )
          {
          seasons.push(seasons_details[j].episodes.length)
          }
      }
      return {
        seasons,
        backdrop_path,
        genres,
        imdb_id: id,
        original_title,
        overview,
        poster_path,
        runtime,
        title: original_name,
        vote_average,
      };
    }
  } else {
    return false;
  }
}
*/