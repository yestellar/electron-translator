const axios = require("axios").default
require('dotenv').config()

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
            'x-rapidapi-key': process.env.RAPIDAPI_TRANSLATE_KEY
        }
    }
  
    return axios.request(options)
}