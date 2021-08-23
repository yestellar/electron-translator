const axios = require("axios").default
const RAPIDAPI_TRANSLATE_KEY = '7101228203msha4a42872d3e7d62p1e25d1jsndf57c0e6fc3f'

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
            'x-rapidapi-key': RAPIDAPI_TRANSLATE_KEY
        }
    }
  
    return axios.request(options)
}