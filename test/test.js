const assert = require('assert')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')

const nodemailerPreview = require('./../index')

let tmpdir = path.join(__dirname, 'tmp', 'nodemailer')
let transport = new nodemailerPreview({
  dir: tmpdir,
  browser: false
})

let mailer = nodemailer.createTransport(transport)

let email = {
  from: 'John Lennon <j.lennon@gmail.com>',
  to: 'Paul McCartney <p.mccartney@gmail.com>, George Harrison <g.harrison@gmail.com>',
  cc: 'Ringo Starr <r.starr@gmail.com>',
  bcc: 'Yoko Ono <y.ono@gmail.com>',
  replyTo: 'beatles@breeze123.com',
  subject: 'Song Idea',
  charset: 'utf-8',
  text: [
    "Hey jude, don't make it bad.",
    'Take a sad song and make it better.',
    'Remember to let her into your heart,',
    'Then you can start to make it better.'
  ].join('\n'),
  html: [
    '<h1>Hey Jude</h1>',
    "<p>\nHey jude, don't make it bad.",
    'Take a sad song and make it better.',
    'Remember to let her into your heart,',
    'Then you can start to make it better.\n</p>'
  ].join('<br>\n')
}

describe('Preview', function () {
  describe('.sendMail()', function () {
    let error, response

    before(function (done) {
      mailer.sendMail(email, function (e, r) {
        error = e
        response = r
        done()
      })
    })

    after(function () {
      try {
        // Cleanup files
        fs.unlinkSync(response.html)
        fs.unlinkSync(response.text)
        fs.rmdirSync(path.dirname(response.html))
      } catch (e) {
        console.error('Could not clean up temporary files')
        console.error(e.stack || e)
      }
    })

    it('does not return an error', function () {
      assert(error == null)
    })

    it('returns the details in the response', function () {
      assert(response.html && response.text)
    })

    it('writes the text part of the email to the corresponding file', function () {
      let body = fs.readFileSync(response.text, 'utf-8')
      assert(body.indexOf("Hey jude, don't make it bad.") >= 0)
    })

    it('writes the html part of the email to the corresponding file', function () {
      let body = fs.readFileSync(response.html, 'utf-8')
      assert(body.indexOf('<h1>Hey Jude</h1>') >= 0)
    })
  })
})
