/**
 * Created by kevin on 12/28/16.
 */


module.exports =
    {
        initFirebase: function() {
            var firebase = require("firebase");
            var config = {
                apiKey: "AIzaSyDTrJWeSWmX5JTPW-h0rX1d0NAqntSnF8k",
                authDomain: "mayra-han.firebaseapp.com",
                databaseURL: "https://mayra-han.firebaseio.com",
                storageBucket: "mayra-han.appspot.com",
                messagingSenderId: "819633055429"
            };
            firebase.initializeApp(config);

        }
}