'use strict'

let fs = require('fs')
let zlib = require('zlib')
let http = require('http')

http.createServer((req, res) => {
  fs.readFile(__dirname + req.url, (err, buf) => {
    res.writeHead(200, { 'Content-Encoding': 'gzip' })
    zlib.gzip(buf, (err, zipped) => {
      res.end(zipped)
    })
  })
}).listen(process.env.CSVPORT)
