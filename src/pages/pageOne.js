const pageTwo = require('./pageTwo');

const pageOne = function ({resp,baseUrl,send}){
    const { $ } = resp;           
    const response = $('a:contains("Assistir")');
    const pageOne = []
      for (let i = 0; i < response.length; i++) {
        const url = response[i].attribs.href;          
        if(url.includes('dublado')){
          const [one] = url.split('-dublado-')
          const name = one.replace('/','').split("-").join(' ')
          pageOne.push({name, url})        
        }
      }
      const data = pageOne.slice(0,5)
      pageTwo({data,baseUrl,send})
  }
  module.exports = pageOne