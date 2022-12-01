'use strict'

const fs = require('fs')
const jade = require('jade')
const open = require('open')
const mkdirp = require('mkdirp')
const packageData = require('./package.json')
const path = require('path')

const tmplPath = path.join(__dirname, 'template.jade')
const template = jade.compile(fs.readFileSync(tmplPath, 'utf-8'))

module.exports = function (options) {
  return new BrowserTransport(options)
}

function BrowserTransport (options) {
  this.options = options || {}
  this.dir = options.dir || path.join(process.cwd(), 'tmp', 'postman')
  this.browser = typeof options.browser === 'boolean' ? options.browser : true
  this.name = 'BrowserPreview'
  this.version = packageData.version

  const made = mkdirp.sync(this.dir)
  if (made) {
    console.log(`$Created directory ${made}`)
  }
}

BrowserTransport.prototype.send = function send (mail, callback) {
  const timestamp = (new Date()).toISOString().replace(/[-:TZ.]/g, '')
  const directory = path.join(this.dir, timestamp)

  const made = mkdirp.sync(directory)
  if (made) {
    console.log(`$Created directory ${made}`)
  }

  const multipart = mail.data.html && mail.data.text
  const files = {}

  const parts = ['html', 'text']

  parts.forEach(p => {
    if (!mail.data[p]) return
    const part = p // (p == 'body' ? 'text' : p)
    const filename = path.join(directory, 'message_' + part + '.html')
    const charset = mail.options && mail.options.charset ? mail.options.charset : 'utf-8'

    const output = template({
      message: mail.data,
      charset,
      content: mail.data[p],
      multipart,
      part
    })

    fs.writeFileSync(filename, output, charset)

    files[part] = filename
  })

  if (this.browser) open(files.html || files.text)

  callback(null, files)

  // var self = this
  // var mailData = mail.data
  // series([
  //   function (done) {
  //     if (mailData.template && mailData.template.name && mailData.template.engine) {
  //       mailData.template.context = mailData.template.context || {}
  //       cons[mailData.template.engine](mailData.template.name, mailData.template.context, function (err, html) {
  //         if (err) throw err
  //         mailData.html = html
  //         done()
  //       })
  //     } else {
  //       done()
  //     }
  //   },
  //   function (done) {
  //     // convert address objects or array of objects to strings if present
  //     var targets = ['from', 'to', 'cc', 'bcc', 'replyTo']
  //     var count = 0
  //     for (var target of targets) {
  //       var addrsData = mailData[target]
  //       if (addrsData !== null && (typeof addrsData === 'object' || Array.isArray(addrsData))) {
  //         var addrs = []
  //         var addresses = typeof addrsData === 'object' ? [addrsData] : addrsData
  //         for (var addr of addresses) {
  //           if (Array.isArray(addr)) {
  //             for (var add of addr) {
  //               if (typeof add === 'object' && add.address) {
  //                 var final = add.name ? add.name + ' <' + add.address + '>' : add.address
  //                 addrs.push(final)
  //               } else if (typeof add === 'string') {
  //                 addrs.push(add)
  //               }
  //             }
  //           } else {
  //             if (addr.address) {
  //               var final = addr.name ? addr.name + ' <' + addr.address + '>' : addr.address
  //               addrs.push(final)
  //             }
  //           }
  //         }
  //         mailData[target] = addrs.join()
  //       }
  //       count++
  //       count == 5 ? done() : null
  //     }
  //   },
  //   function (done) {
  //     // convert nodemailer attachments to mailgun-js attachements
  //     if (mailData.attachments) {
  //       var attachment, mailgunAttachment, data, attachmentList = [], inlineList = []
  //       for (var i in mailData.attachments) {
  //         attachment = mailData.attachments[i]

  //         // mailgunjs does not encode content string to a buffer
  //         if (typeof attachment.content === 'string') {
  //           data = new Buffer(attachment.content, attachment.encoding)
  //         } else {
  //           data = attachment.content || attachment.path || undefined
  //         }
  //         // console.log(data);
  //         mailgunAttachment = new self.mailgun.Attachment({
  //           data: data,
  //           filename: attachment.cid || attachment.filename || undefined,
  //           contentType: attachment.contentType || undefined,
  //           knownLength: attachment.knownLength || undefined
  //         })

  //         if (attachment.cid) {
  //           inlineList.push(mailgunAttachment)
  //         } else {
  //           attachmentList.push(mailgunAttachment)
  //         }
  //         // console.log(b);
  //       }

  //       mailData.attachment = attachmentList
  //       mailData.inline = inlineList
  //       delete mailData.attachments
  //     }

  //     delete mailData.headers

  //     transformList.forEach(function (key) {
  //       if (mailData[key]) {
  //         switch (key) {
  //           case 'replyTo':
  //             mailData['h:Reply-To'] = mailData[key]
  //             delete mailData[key]
  //         }
  //       }
  //     })

  //     var options = pickBy(mailData, function (value, key) {
  //       if (whitelistExact.indexOf(key) !== -1) {
  //         return true
  //       }

  //       return some(whitelistPrefix, function (prefix) {
  //         return startsWith(key, prefix)
  //       })
  //     })

  //     self.messages.send(options, function (err, data) {
  //       if (data) {
  //         data.messageId = data.id
  //       }
  //       callback(err || null, data)
  //     })
  //   }
  // ], function (err) {
  //   if (err) throw err
  // })
}

// var path = require('path')
// var mkdirp = require('mkdirp')
// var fs = require('fs')
// var jade = require('jade')
// var open = require('open')

// var tmplPath = path.join(__dirname, 'template.jade')
// var template = jade.compile(fs.readFileSync(tmplPath, 'utf-8'))

// // (function () {
// //   var nodemailer = require('nodemailer')
// //   nodemailer.createTransport()// = BrowserTransport
// // })()

// module.exports = BrowserTransport

// function BrowserTransport (options) {
//   options = options || {}
//   this.dir = options.dir || path.join(process.cwd(), 'tmp', 'postman')
//   this.browser = typeof options.browser === 'boolean' ? options.browser : true
//   mkdirp.sync(this.dir)
// }

// BrowserTransport.prototype.sendMail = function (mail, callback) {
//   callback = callback || function () {}
//   process.nextTick(function () { this._process(mail, callback) }.bind(this))
// }

// BrowserTransport.prototype.close = function (callback) {
//   if (typeof callback === 'function') callback()
// }

// BrowserTransport.prototype._process = function (mail, callback) {
//   console.log(mail)
//   var timestamp = (new Date()).toISOString().replace(/[-:TZ\.]/g, '')
//   var directory = path.join(this.dir, timestamp)
//   mkdirp.sync(directory)

//   var multipart = mail._message.html && mail._message.body
//   var files = {};

//   ['html', 'body'].forEach(function (p) {
//     if (!mail._message[p]) return
//     var part = (p == 'body' ? 'text' : p)
//     var filename = path.join(directory, 'message_' + part + '.html')

//     var output = template({
//       message: mail._message,
//       charset: mail.options.charset || 'utf-8',
//       content: mail._message[p],
//       multipart: multipart,
//       part: part
//     })

//     fs.writeFileSync(filename, output, mail.options.charset || 'utf-8')

//     files[part] = filename
//   })

//   if (this.browser) open(files.html || files.text)

//   callback(null, files)
// }
