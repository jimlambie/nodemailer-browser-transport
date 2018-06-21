# Nodemailer Preview Transport

Preview your [Nodemailer](https://github.com/andris9/Nodemailer) emails in your
browser (Inspired by [Letter Opener](https://github.com/ryanb/letter_opener)).

## Usage

1. Install via NPM

    ```
    $ npm install nodemailer-browser-transport
    ```

2. Use it with Nodemailer

    ```javascript
    const nodemailer = require('nodemailer')
    const nodemailerBrowser = require('nodemailer-browser-transport')

    let tmpdir = require('path').join(process.cwd(), 'tmp', 'nodemailer')

    let transport = new nodemailerBrowser({
      dir: tmpdir,
      browser: true
    })

    let mailer = nodemailer.createTransport(transport)

    mailer.sendMail({
        from: 'hello@domain.com',
        to: user.email,
        // cc:'second@domain.com',
        // bcc:'secretagent@company.gov',
        subject: 'Hello',
        text: 'How are you?'
      }, function (err, info) {
        if (err) {
          console.log('Error: ' + err)
        } else {
          console.log('Response: ' + info)
        }
      })
    }

    ```

    Any emails sent through the preview transport will be written to the
    `tmpdir` and opened in a browser (unless `browser` is set to false).
