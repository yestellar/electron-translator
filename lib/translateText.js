const axios = require("axios").default

module.exports = function(text) {
    const options = {
        method: 'GET',
        url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
        params: {
            text: text, 
            to: 'ru', 
            from: 'en'
        },
        headers: {
            'x-rapidapi-host': 'nlp-translation.p.rapidapi.com',
            'x-rapidapi-key': '7101228203msha4a42872d3e7d62p1e25d1jsndf57c0e6fc3f'
        }
    }
  
    return axios.request(options)
}