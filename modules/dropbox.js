
var Promise = require( 'bluebird' );
var dropbox = require( 'dropbox' );
var dbx = new dropbox( { accessToken: process.env.DropboxAccessToken } );
var fs = require( 'fs' );

var TokenDir = ( process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE ) + '/.credentials/';
var TokenPath = TokenDir + process.env.TokenName;

function maybeTokenDownloadDropbox() {
  return new Promise( function( resolve, reject ) {
    dbx.filesDownload( { path: '/' + process.env.TokenName } )
    .then( function( res ) {
      if ( undefined !== res.fileBinary ) {
        console.log( 'Token file found on Dropbox.' );
        try {
          fs.mkdirSync( TokenDir );
        } catch ( err ) {
          if ( 'EEXIST' != err.code ) {
            throw err;
          }
        }
        fs.writeFile( TokenPath, res.fileBinary, 'binary', function( err ) {
          if ( err ) {
            return reject( 'Failed to create token file on the file system' );
          } else {
            var successMessage = 'Token file found on Dropbox and saved on the local file system.';
            console.log( successMessage );
            return resolve( successMessage );
          }
        });
      } else {
        var errorMessage = 'Unable to download token file from Dropbox.';
        return reject( errorMessage );
      }
    })
    .catch(function( error ) {
      var errorMessage = 'Token file not found on Dropbox.';
      return reject( errorMessage );
    });
  });
}

function storeTokenOnDropbox( token ) {
  dbx.filesUpload({ path: '/' + process.env.TokenName, contents: JSON.stringify( token ) })
      .then(function( response ) {
        console.log( 'Token uploded to dropbox' );
      })
      .catch(function( err ) {
        console.log( err );
      });
}

exports.maybeTokenDownloadDropbox = maybeTokenDownloadDropbox;
exports.storeTokenOnDropbox = storeTokenOnDropbox;
