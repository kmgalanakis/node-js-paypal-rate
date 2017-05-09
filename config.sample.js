var config = {};

// Application parameters
config.AppPort = process.env.PORT || 30000;
config.TimeZone = 'Europe/Athens';
config.DateFormat = 'YYYY-MM-DD HH:mm:ss';

// Environment parameters
config.TokenDir = ( process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE ) + '/.credentials/';
config.TokenName = 'sheets.googleapis.com-nodejs-paypal-exchange-rate.json';
config.TokenPath = config.TokenDir + config.TokenName;

// GoogleAPI parameters
config.GoogleAPIScopes = ['https://www.googleapis.com/auth/spreadsheets'];
config.GoogleAPIClientID = 'REPLACE_WITH_YOUR_GOOGLEAPI_CLIENT_ID';
config.GoogleAPIClientSecret = 'REPLACE_WITH_YOUR_GOOGLEAPI_CLIENT_SECRET';
config.GoogleAPIRedirectURIs = 'urn:ietf:wg:oauth:2.0:oob';

// Google Sheetes parameters
config.SpreadSheetID = 'REPLACE_WITH_YOUR_GOOGLE_SPREADSHEET_ID';
config.SpreadSheetRateRange = 'REPLACE_WITH_YOUR_GOOGLE_SPREADSHEET_RANGE';
config.SpreadSheetLastUpdatedRange = 'REPLACE_WITH_YOUR_GOOGLE_SPREADSHEET_LAST_UPDATED_RANGE';

// Dropbox parameters
config.DropboxAccessToken = 'REPLACE_WITH_YOUR_DROPBOX_ACCESS_TOKEN';

// ThingSpeak parameters
config.ThingSpeakWriteAPI = 'REPLACE_WITH_YOUR_THINGSPEAK_WRITE_API_KEY';

// PayPal parameters
config.PayPalCurrencyIn = 'USD';
config.PayPalCurrencyOut = 'EUR';
config.TargetAmmount = 2000;

module.exports = config;
