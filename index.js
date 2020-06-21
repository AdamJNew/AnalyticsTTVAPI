// Define our dependencies
const express        = require('express');
const session        = require('express-session');
const request        = require('request');
const handlebars     = require('handlebars');
const Datastore      = require('nedb');
const twitchStrategy = require("passport-twitch").Strategy;
const axios          = require('axios')
const got            = require('got');

require('dotenv').config()

// Define our constants, you will change these with your own
const TwitchClientID = process.env.TWITCH_CLIENT_ID;
const TwitchSecret    = process.env.TWITCH_SECRET;

const app = express();
console.log('https://id.twitch.tv/oauth2/token?client_id='+process.env.TWITCH_CLIENT_ID+'&client_secret='+process.env.TWITCH_SECRET+'&grant_type=client_credentials')

requestValidate();
const accessToken = null;

async function requestValidate() {
request.post('https://id.twitch.tv/oauth2/token?client_id='+process.env.TWITCH_CLIENT_ID+'&client_secret='+process.env.TWITCH_SECRET+'&grant_type=client_credentials', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    console.log(body);
    const authJson = JSON.parse(body);
    const accessToken = authJson.access_token;
      got({
          url: "https://id.twitch.tv/oauth2/validate",
          method: "GET",
          headers: {
              Authorization: "OAuth " + accessToken
          },
          responseType: "json",
      }).then(resp => {
        console.log("Validated: ", resp.body);
        if (resp.body.expires_in <= 3600) {
            twitch.makeClientCred();
        } else {
            // it"s ok
        }
    }).then(stream => {
      RequestStreams()
    })
    .catch(err => {
        console.error(err);
        twitch.makeClientCred();
    });
    
});
}

async function RequestStreams() {
  got({
    url: "https://api.twitch.tv/helix/channels?broadcaster_id=44445592",
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Client-ID': TwitchClientID,
      'Authorization': 'Bearer '+ accessToken
    },
    responseType: "json"
}).then(resp => {
  console.log("Ok", resp.body);
  if (resp.body.expires_in <= 3600) {
      twitch.makeClientCred();
  } else {
      // it"s ok
  }
}).catch(err => {
  console.log('Error Time!')
  console.error(err, err.response.body);
});
}

async function getUser() {
  try {
    const response = await axios.get('https://api.twitch.tv/helix/users?id=44322889');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

app.listen(3000, function () {
  console.log('Twitch auth sample listening on port 3000!')
});
