const Crawler = require('crawler');
const Tmdb = require('./Tmdb');

const pageTwo = async function ({data,baseUrl,send}){

    let count = 0
    const dataTwo = [];    

    for (let j = 0; j < data.length; j++) {

      const {url, name} = data[j]
      const c =  new Crawler({
        maxConnections: 5,
        callback(error, resp, done) {  
            count++                
            const { $ } = resp;
            const response = $('iframe')
            if(response && response[0] && response[0].attribs && response[0].attribs.src){                      
                const [one,two] = response[0].attribs.src.split(".php")                 
                dataTwo.push({name , url: one+"hlb"+".php"+two })
            }                            
            if(count === data.length){
                Tmdb({dataTwo,send})
            }
        }
        })
   c.queue(`${baseUrl}${url}`)

  }
}
module.exports = pageTwo