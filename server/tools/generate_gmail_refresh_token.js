#!/usr/bin/env node
/*
  Interactive helper to generate a Gmail OAuth2 refresh token.
  Usage:
    1) npm install googleapis
    2) node server/tools/generate_gmail_refresh_token.js
    3) Open the printed URL, grant access, paste the code back into the terminal.
    The script will print access_token and refresh_token (save refresh_token to .env as GMAIL_REFRESH_TOKEN).
*/
const readline = require('readline');
const { google } = require('googleapis');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function question(q) {
  return new Promise((res) => rl.question(q, res));
}

async function main() {
  console.log('Generate Gmail OAuth2 refresh token');
  const clientId = await question('Enter GMAIL_CLIENT_ID: ');
  const clientSecret = await question('Enter GMAIL_CLIENT_SECRET: ');
  const redirectUri = 'urn:ietf:wg:oauth:2.0:oob'; // out-of-band

  const oAuth2Client = new google.auth.OAuth2(clientId.trim(), clientSecret.trim(), redirectUri);
  const scopes = ['https://mail.google.com/'];

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  console.log('\nOpen this URL in your browser and grant access:\n');
  console.log(authUrl);
  console.log('\nAfter granting access you will get a code. Paste it here.');

  const code = await question('Enter code: ');
  try {
    const { tokens } = await oAuth2Client.getToken(code.trim());
    console.log('\nTokens received:\n', tokens);
    console.log('\nCopy the refresh_token value into your .env as GMAIL_REFRESH_TOKEN');
  } catch (e) {
    console.error('Failed to get tokens', e);
  } finally {
    rl.close();
  }
}

main().catch((e) => { console.error(e); rl.close(); });
