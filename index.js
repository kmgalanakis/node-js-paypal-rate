require( 'dotenv' ).config();
var dropboxModule = require( './modules/dropbox.js' );
var googleDocsModule = require( './modules/googleDocs.js' );
var paypalModule = require( './modules/paypal.js' );
var express = require( 'express' );
var app = express();

app.set( 'port', ( process.env.PORT ) );
app.use( express.static( __dirname + '/public' ) );

app.get( '/googleapitoken', function( request, response ) {
  googleDocsModule.googleAPIAuthorize( request, response );
});

app.get( '/trigger', function( request, response ) {
  googleDocsModule.verifySecrets()
  .then(function( res ) {
    console.log( 'Application verified! Fetching PayPal rate.' );
    paypalModule.fetchPaypalRate();
    response.send( 'Triggered!' );
  })
  .catch(function( error ) {
    var errorMessage = 'Failed to authenticate! (' + error + ')';
    console.log( errorMessage );
    response.send( errorMessage );
  });
});

app.listen( app.get( 'port' ), function() {
  console.log( 'Node app is running at localhost:' + app.get( 'port' ) );
});
