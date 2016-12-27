/**
 * Created by kevin on 12/26/16.
 */

path = require('path');

var Consts = require('./consts');
var request = require('request');

/*
function httpGetJson(url, callback) {
    request({
        url: url,
        method: 'GET'
    }, function(error, response, body) {
        if (error) {
            console.error('Error http get ' + url, error);
        } else if (response.body.error) {
            console.error('Error in response body for http get ' + url, response.body.error);
        } else {
            try {
                console.log(response.body);
                var jsonResponse = JSON.parse(response.body);
                callback(jsonResponse);
                return;
            } catch (e) {
                console.error('Error parsing json response from http get ' + url);
            }
        }
        callback();
    });
}

function getUserInfoInternal(userId, callback) {
    httpGetJson(Consts.FACEBOOK_USER_PROFI
    LE_API.replace("<USER_ID>", userId), function(userInfo) {
        userInfo.user_id = userId;
        insertUserInfoToFireBase(userInfo);
    });


}
*/

