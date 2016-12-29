'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const path = require("path")

var pdfVar = require("./src/uploadPDF");
var downloadVar = require("./src/download");
var firebaseDB = require("./src/firebase");
var sendMessage = require("./src/sendMessage");

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

firebaseDB.initFirebase();

/* Posting Data  */
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
                    sendMessage.sendTextMessage(sender, "Type in your File Name")
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
<<<<<<< HEAD
                        sendMessage.sendTextMessage(sender, "Here is your file link test 1" + snapshot.val().FileLink);
                        sendMessage.sendTextMessage(sender, "here is your file link test 2" + snapshot.child("FileLink").val());
=======

                        sendTextMessage(sender, "Here is your file link" + snapshot.val().FileLink);
>>>>>>> parent of 41416bb... added FileLink
                    }, function (error) {
                        sendMessage.sendTextMessage(sender, "Here is your error" + error);
                    });
                }
                if (text === 'Upload') {
                    pdfVar.uploadPDFFileName = true
                    sendMessage.sendTextMessage(sender, "Type in your File Name")
                    res.sendStatus(200)
                    return
                }
                if (pdfVar.uploadPDFFileName && text != 'Type in your File Name') {
                    pdfVar.fileName = text
                    sendMessage.sendTextMessage(sender, "Please Upload a File")
                    pdfVar.uploadPDFFileName = false
                    pdfVar.uploadPDF = true
                    res.sendStatus(200)
                    return
                }
                sendMessage.sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
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
                 sendMessage.sendTextMessage(sender, "File Received")
                 continue
                 }

            }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendMessage.sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})



// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
