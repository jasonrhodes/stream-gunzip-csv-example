'use strict';

let zlib = require('zlib')
let http = require('http')
let csv = require('csv-parser')
let json = require('JSONStream')

/** The fake webserver */

let fs = require('fs')

http.createServer((req, res) => {
  fs.readFile(__dirname + req.url, (err, buf) => {
    res.writeHead(200, { 'Content-Encoding': 'gzip' })
    zlib.gzip(buf, (err, zipped) => {
      res.end(zipped)
    })
  })
}).listen(8080)

/** End of the server */


http.get({
  host: 'localhost',
  port: 8080,
  path: '/preview.csv',
  auth: 'user:password'
}, (res) => {
  let stream = res.pipe(new zlib.Gunzip()).pipe(csv())

  stream.on('data', (invoice) => {
    if (parseFloat(invoice.amount, 10) > 100) {
      console.log(`Running a bill run for CID ${invoice.cid} for $${invoice.amount}`)
    }
  })

  stream.on('error', (err) => {
    console.error(err)
  })

  stream.on('end', () => process.exit())
})
