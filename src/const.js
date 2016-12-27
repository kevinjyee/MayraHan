
"use strict";


var FACEBOOK_PAGE_ACCESS_TOKEN = "EAAIkTDOuK30BAObZCJMsYgFgwV4NLS3ZCnDP1RIgVWWMULztnIyPoajKfIlNVueS02neS9a7NoKA0F2qdEljeKNKUJiefvEwyEd4cz57gv6Gw6rjh840WLnGEKXscOLTdEfGk6fanRXFMSGTs5oxZAKwSVQlZBknBOt8y9gL6gZDZD"
var consts = {
    FACEBOOK_WELCOME_MSG_URL: "https://graph.facebook.com/v2.6/" + FACEBOOK_PAGE_ID + "/thread_settings?access_token=" + FACEBOOK_PAGE_ACCESS_TOKEN,
    FACEBOOK_USER_PROFILE_API: "https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + FACEBOOK_PAGE_ACCESS_TOKEN,
    ANALYTICS_API: "http://api.bot-metrics.com/v1/messages",
    LUIS_NLP_API: "https://api.projectoxford.ai/luis/v1/application?id=f087a4b1-ce4c-4eb0-b2fb-35c0afd1b3b8&subscription-key=" + process.env.LUIS_NLP_TOKEN + "&q=",
    LUIS_MIN_SCORE: 0.6,

};

module.exports = consts;