var request = require( 'request' );

function updateThingspeak( rate ) {
  request( {
    url: 'https://api.thingspeak.com/update?key=' + process.env.ThingSpeakWriteAPI + '&field1=' + rate + '&field2=' + parseFloat( rate * process.env.TargetAmmount ).toFixed( 2 ),
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
}

exports.updateThingspeak = updateThingspeak;
