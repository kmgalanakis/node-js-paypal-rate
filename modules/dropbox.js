var config = require( '../config.js' );
var Promise = require( 'bluebird' );
var dropbox = require( 'dropbox' );
var dbx = new dropbox( { accessToken: config.DropboxAccessToken } );
var fs = require( 'fs' );

function maybeTokenDownloadDropbox() {
  return new Promise( function( resolve, reject ) {
    dbx.filesDownload( { path: '/' + config.TokenName } )
    .then( function( res ) {
      if ( undefined !== res.fileBinary ) {
        console.log( 'Token file found on Dropbox.' );
        try {
          fs.mkdirSync( config.TokenDir );
        } catch ( err ) {
          if ( 'EEXIST' != err.code ) {
            throw err;
          }
        }
        fs.writeFile( config.TokenPath, res.fileBinary, 'binary', function( err ) {
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
  dbx.filesUpload({ path: '/' + config.TokenName, contents: JSON.stringify( token ) })
      .then(function( response ) {
        console.log( 'Token uploded to dropbox' );
      })
      .catch(function( err ) {
        console.log( err );
      });
}

exports.maybeTokenDownloadDropbox = maybeTokenDownloadDropbox;
exports.storeTokenOnDropbox = storeTokenOnDropbox;
