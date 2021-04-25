/**
 * Configures the service.
 */
function getService() {
  const BASE_URL = 'https://www.fitbit.com/oauth2/authorize';
  const TOKEN_URL = 'https://api.fitbit.com/oauth2/token';
  const SCOPE = 'activity heartrate location nutrition profile settings sleep social weight';

  return OAuth2.createService('FitBit')
    .setAuthorizationBaseUrl(BASE_URL)
    .setTokenUrl(TOKEN_URL)
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setScope(SCOPE)
    .setTokenHeaders({
      'Authorization': 'Basic ' +
        Utilities.base64Encode(CLIENT_ID + ':' + CLIENT_SECRET)
    });
}

/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}