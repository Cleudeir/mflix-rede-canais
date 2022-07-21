const pageTwo = require('./pageTwo');

const pageOne = function ({resp,baseUrl,send}){
    const { $ } = resp;           
    const response = $('a:contains("Assistir")');
    const pageOne = []
      for (let i = 0; i < response.length; i++) {
        const url = response[i].attribs.href;          
        if(url.includes('dublado') && (url.includes('1080p') || url.includes('720p'))){
          const [one] = url.split('-dublado-')
          const name = one.replace('/','').split("-").join(' ')
          pageOne.push({name, url})        
        }
      }
      const dataOne = pageOne.slice(0,1000)
      pageTwo({dataOne,baseUrl,send})
  }
  module.exports = pageOne