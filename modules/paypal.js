var config = require( '../config.js' );
var xml2js = require( 'xml2js' );
var request = require( 'request' );
var googleDocsModule = require( './googleDocs.js' );
var thingspeakModule = require( './thingspeak.js' );

function fetchPaypalRate() {
  var paypalURL = 'https://www.paypal.com/gr/cgi-bin/webscr?cmd=_manage-currency-conversion&amount_in=' + config.TargetAmmount + '&currency_in=' + config.PayPalCurrencyIn + '&currency_out=' + config.PayPalCurrencyOut + '&currency_conversion_type=BalanceConversion';

  request( {
    url: paypalURL,
    method: 'GET',
    timeout: 60000
  }, function( error, response, body ) {
    if ( ! error &&  200 == response.statusCode ) {
      parseXML( body );
    } else {
      console.log( 'error' + response.statusCode );
    }
  });
};

function parseXML( xml ) {
  xml2js.parseString( xml, function( err, result ) {
    result.ConversionInfoOutVO.exchange_rate_formatted.forEach( function( element ) {
      thingspeakModule.updateThingspeak( element );
      googleDocsModule.updateGoogleSheet( element );
    });
  });
};

exports.fetchPaypalRate = fetchPaypalRate;
