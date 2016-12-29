'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const path = require("path")


var pdfVar = require("./src/uploadPDF");
var downloadVar = require("./src/download");



/* App Initialization*/



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


/* Posting Data */
app.post('/webhook/', function (req, res) {

    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if(event.message && event.message.text) {
            let text = event.message.text

            if(text === 'Download')
            {
                downloadVar.downloadPDFFileName = true
                sendTextMessage(sender, "Type in your File Name")
                res.sendStatus(200)
                return
            }

            if(downloadVar.downloadPDFFileName && text != 'Type in your File Name')
            {
                downloadVar.downloadPDFFileName = false
                downloadVar.dfileName = text

                var ref = firebase.database().ref('pdfs/' + text);

                ref.on("value", function(snapshot) {
                    console.log(snapshot.val());


                    sendImageMessage(sender,snapshot.child("FileLink").val());
                }, function (error) {
                    sendTextMessage(sender, "Here is your error" + error);
                });





            }

            if (text === 'Upload') {
                pdfVar.uploadPDFFileName = true
                sendTextMessage(sender, "Type in your File Name")
                res.sendStatus(200)
                return
            }

            if (pdfVar.uploadPDFFileName && text != 'Type in your File Name') {
                pdfVar.fileName = text
                sendTextMessage(sender, "Please Upload a File")
                pdfVar.uploadPDFFileName = false
                pdfVar.uploadPDF = true
                res.sendStatus(200)
                return
            }

            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }

        if(event.message.attachments)
        {

            if (pdfVar.uploadPDF) {

                /*http://stackoverflow.com/questions/37117083/how-to-receive-image-in-facebook-messenger-bot*/
                //pdfVar.fileLink = event.message.attachments.payload.url;

                pdfVar.fileLink = event.message.attachments[0].payload.url;

                firebase.database().ref('pdfs/' + pdfVar.fileName).set({
                    FileName: pdfVar.fileName,
                    FileLink: pdfVar.fileLink
                });
                pdfVar.uploadPDF = false
                sendTextMessage(sender, "File Received")
                continue
            }

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

function sendGenericMessage(sender,imageURL) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": imageURL,
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


function sendImageMessage(sender,imageURL) {
    let messageData = {
        "attachment": {
            "type": "image",
            "payload": {

                        "url": imageURL

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