'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const path = require("path")


var pdfVar = require("./src/uploadPDF");
/*
 *
 * *
 * App Initialization
 *
 *
 * */



app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
    res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})


/*Initialize Database*/

//Initialize data base
var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyDTrJWeSWmX5JTPW-h0rX1d0NAqntSnF8k",
    authDomain: "mayra-han.firebaseapp.com",
    databaseURL: "https://mayra-han.firebaseio.com",
    storageBucket: "mayra-han.appspot.com",
    messagingSenderId: "819633055429"
};
firebase.initializeApp(config);

// Get a reference to the database service

/*
 function writeUserData(userId, name, email) {
 firebase.database().ref('users/' + userId).push({
 username: name,
 email: email
 });
 }
 writeUserData(1, 'hashim', 'hh1316');
 */

/*
 *
 *
 * Posting Data
 *
 *
 *
 * */
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            if (text === 'Generic') {
                sendGenericMessage(sender)
                continue
            }

            if (text === 'Upload PDF') {
                sendTextMessage(sender,"Type in your File Name")
                pdfVar.uploadPDFFileName = true
                break;

            }
            if(pdfVar.uploadPDFFileName)
            {
                pdfVar.fileName = text
                sendTextMessage(sender, "Please Upload a PDF")
                pdfVar.uploadPDFFileName = false
                pdfVar.uploadPDF = true
                return
            }

            if(pdfVar.uploadPDF)
            {

                pdfVar.fileLink = text
                firebase.database().ref('pdfs/' + pdfVar.fileLink).push({
                    FileName: pdfVar.fileName,
                    FileLink: pdfVar.fileLink
                });
                pdfVar.uploadPDF = false
                sendTextMessage(sender, "File Received")
                continue;
            }
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})



// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAAIkTDOuK30BAFYwWOasXy0NEsZCO7XJ0LBglGEN501jE1T65qwKzBOygA7p8TWu8Pqb2mek5CytQwJqI5ztT2YoDIhftXhP27a9jteq6nq6iYegibtN9VBnThDizZCL4MhFZBKqaR1vMKPlxhjqcPRd12uWL1lTLnFXZAGZBywZDZD"


/*Function: sendTextMessage
 *@Params: sender
 *@Params: text
 */
function sendTextMessage(sender, text) {
    let messageData = { text:text }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
