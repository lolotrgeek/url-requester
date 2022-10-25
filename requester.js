const https = require('https')

/**
 * Make a request to an API url, handle data with callback
 * @param {string} url 
 * @param {function} callback 
 * @param {Array} headers 
 */
function Requester(url, callback, headers=[]) {
    const req = https.request(url, res => {
        console.log(`statusCode: ${res.statusCode}`)
        let raw = []
        res.on('data', stream => {
            raw.push(stream)
        })
        res.on('close', () => {
            let data = JSON.parse(raw.map(element => element.toString('utf8')).join(''))
            callback(data)
        })
    })
    headers.forEach(header => {
        if(typeof header.name === 'string' && typeof header.value === 'string') req.setHeader(header.name, header.value)
    })
    req.on('error', error => callback(error))
    req.end()
}

/**
* Access authenticated API endpoints with HMAC signature and sha256 encryption.
* @param {*} host the base url, with no `https://` or query elements
* @param {*} query 
* @param {*} headers 
* @param {*} method 
* @returns 
*/
function Auth_Requester(host, query, headers= [], method = 'GET') {
   return new Promise((resolve, reject) => {
       try {
           let timestamp = Math.floor(new Date().getTime()).toString()
           let secret = keys.secret
           let data = `timestamp=${timestamp}`
           let signature = crypto.createHmac('sha256', secret).update(data).digest("hex")
           const options = {
               hostname: host,
               port: 443,
               path: `${query}?${data}&signature=${signature}`,
               method: method
           }
            Requester(options, resolve, headers)   
       }
       catch (error) { reject({ error }) }
   })
}

module.exports = { Requester, Auth_Requester }