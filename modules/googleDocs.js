var config = require( '../config.js' );
var google = require( 'googleapis' );
var googleAuth = require( 'google-auth-library' );
var fs = require( 'fs' );
var request = require( 'request' );
var Promise = require( 'bluebird' );
var readFile = Promise.promisify( require( 'fs' ).readFile );
var moment = require( 'moment-timezone' );
var dropboxModule = require( './dropbox.js' );

var clientSecret = config.GoogleAPIClientSecret;
var clientId = config.GoogleAPIClientID;
var redirectUrl = config.GoogleAPIRedirectURIs;
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2( clientId, clientSecret, redirectUrl );

/**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
*
* @param {function} callback The callback to call with the authorized client.
*/
function authorize( callback, args ) {

  // Check if we have previously stored a token.
  fs.readFile( config.TokenPath, function( err, token ) {
    if ( err ) {
      console.log( 'You need to authorize the app first.' );
    } else {
      oauth2Client.credentials = JSON.parse( token );
      callback( oauth2Client, args );
    }
  });
}

/**
* Store token to disk be used in later program executions.
*
* @param {Object} token The token to store to disk.
*/
function storeToken( token ) {
  try {
    fs.mkdirSync( config.TokenDir );
  } catch ( err ) {
    if ( 'EEXIST' != err.code ) {
      throw err;
    }
  }
  fs.writeFile( config.TokenPath, JSON.stringify( token ) );
  console.log( 'Token stored to ' + config.TokenPath );

  dropboxModule.storeTokenOnDropbox( token );
}

function googleAPIAuthorize( request, response ) {
  fs.readFile( config.TokenPath, function processClientSecrets( err, content ) {
    if ( err ) {
      if ( request.query.token && request.query.token.length > 0 ) {
        var code = request.query.token;

        oauth2Client.getToken( code, function( err, token ) {
          if ( err ) {
            console.log( 'Error while trying to retrieve access token', err );
            response.send( 'Error while trying to retrieve access token' + err );
            return;
          }
          oauth2Client.credentials = token;
          storeToken( token );
          response.send( 'Authorized!' );
        });
      } else {
        var authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: config.GoogleAPIScopes
        });
        response.send( 'Authorize this app by visiting <a href="' + authUrl + '" target="_blank">this url</a>.' );
      }
    } else {
      response.send( 'Already authorized!' );
    }
  });
}

function verifySecrets() {
  return new Promise( function( resolve, reject ) {
    readFile( config.TokenPath )
    .then( function() {
      var successMessage = 'Token file found on the filesystem';
      console.log( successMessage );
      return resolve( successMessage );
    })
    .catch( function( error ) {
      console.log( 'Token file not found. Attempt to download token file from Dropbox.' );
      dropboxModule.maybeTokenDownloadDropbox()
      .then( function( result ) {
        var successMessage = 'Token file found and downloaded from Dropbox.';
        console.log( successMessage );
        return resolve( successMessage );
      })
      .catch( function( error ) {
        console.log( 'Failed to download token file from Dropbox.' );
        return reject( error );
      });
    });
  });
}

function appendRate( auth, args ) {
  var sheets = google.sheets( 'v4' );
  sheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: config.SpreadSheetID,
    range: config.SpreadSheetRateRange,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [
        [
          args.time,
          args.rate,
          args.amount
        ]
      ]
    }

  }, function( err, response ) {
    if ( err ) {
      console.log( 'The API returned an error: ' + err );
      return;
    }

    updateLastChanged( auth, args );
  });
}

function updateLastChanged( auth, args ) {
  var sheets = google.sheets( 'v4' );
  sheets.spreadsheets.values.update({
    auth: auth,
    spreadsheetId: config.SpreadSheetID,
    range: config.SpreadSheetLastUpdatedRange,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [
        [ args.time ]
      ]
    }

  }, function( err, response ) {
    if ( err ) {
      console.log( 'The API returned an error: ' + err );
      return;
    }
  });
}

function updateGoogleSheet( exRate ) {
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    var values = {
      time: moment().tz( config.TimeZone ).format( config.DateFormat ),
      rate: exRate,
      amount: parseFloat( exRate * parseInt( config.TargetAmmount ) ).toFixed( 2 )
    };
    authorize( appendRate, values );
}

exports.updateGoogleSheet = updateGoogleSheet;
exports.authorize = authorize;
exports.verifySecrets = verifySecrets;
exports.storeToken = storeToken;
exports.googleAPIAuthorize = googleAPIAuthorize;
exports.appendRate = appendRate;
exports.updateLastChanged = updateLastChanged;
