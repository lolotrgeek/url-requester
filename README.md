# Requester
Make https request to a url.

## Usage
```
const {Requester} = require('requester')

Requester('http://example.com/route?params', data => {
    console.log(data)
})

```