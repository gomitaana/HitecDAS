'use strict';

/*ACCOUNT KIT CONFIG BACKEND*/
const API_VERSION = 2.7;
const ACCOUNT_KIT_VERSION     = 'v1.0';
const APP_ID                  = "158727357950373";
const APP_SECRET              = "28b4c551af5e3c87f890000dd1cef1a0";
const ME_ENDPOINT_BASE_URL    = 'https://graph.accountkit.com/v1.0/me';
const TOKEN_EXCHANGE_BASE_URL = 'https://graph.accountkit.com/v1.0/access_token'; 
const SECRET_KEY_USERS        = "mngd&k*VuH6*nxXGWqCWB67fjNC5xG5akP=qxFw5c$x&gyf%gbS_";

module.exports = {
  API_VERSION: API_VERSION,
  ACCOUNT_KIT_VERSION: ACCOUNT_KIT_VERSION,
  APP_ID:APP_ID,
  APP_SECRET:APP_SECRET,
  ME_ENDPOINT_BASE_URL:ME_ENDPOINT_BASE_URL,
  TOKEN_EXCHANGE_BASE_URL:TOKEN_EXCHANGE_BASE_URL,
  SECRET_KEY_USERS: SECRET_KEY_USERS
}