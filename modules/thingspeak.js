var config = require( '../config.js' );
var request = require( 'request' );

function updateThingspeak( rate ) {
  request( {
    url: 'https://api.thingspeak.com/update?key=' + config.ThingSpeakWriteAPI + '&field1=' + rate,
    method: 'GET',
    timeout: 10000
  }, function( error, response, body ) {
    if ( ! error && 200 == response.statusCode ) {

      //Success
      console.log( 'Rate sent to ThingSpeak.' );
    } else {
      console.log( 'error' + response.statusCode );
    }
  });
};

exports.updateThingspeak = updateThingspeak;
