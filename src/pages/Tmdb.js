const fetch = (...args) => import('node-fetch')
	.then(({default: fetch}) => fetch(...args));
const fs = require('fs');

const Tmdb = async function ({dataTwo,send}){
    let count = 0
    const result = []

    for (let k = 0; k < dataTwo.length; k++) {  
                              
        const {url, name} = dataTwo[k]
        const api_key = "5417af578f487448df0d4932bc0cc1a5"
        const query = name.split(" ").join("+")

        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}&language=pt-BR`)
        .then(data=>data.json()).then(data=>{
            count++            
            if(data.results.length > 0){
                const [info] = data.results                            
                result.push({...info,url,title_redecanais:name})
                if(count === dataTwo.length){
                    fs.writeFileSync("data.json", JSON.stringify(result))
                    send(result)
                    console.log(result.length)
                }
            }                          
        })                   
    }
}
module.exports = Tmdb