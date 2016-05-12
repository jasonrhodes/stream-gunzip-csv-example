'use strict'

let zlib = require('zlib')
let http = require('http')
let csv = require('csv-parser')

process.env.CSVPORT = 8080
require('./server')

http.get({
  host: 'localhost',
  port: process.env.CSVPORT,
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
