/**
 * Created by kevin on 12/26/16.
 */
var path = require('path');

var HashMap = require("hashmap");

var map = new HashMap();

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

var database = firebase.database();

function writeUserData(userId, name, email) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email
    });
}

writeUserData(1, 'hashim', 'hh1316');


exports.map = map;
