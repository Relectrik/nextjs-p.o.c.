'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    gapi: any
  }
}

function authenticate() {
  return window.gapi.auth2
    .getAuthInstance()
    .signIn({
      scope:
        'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly',
    })
    .then(function () {
      console.log('Sign-in successful')
    })
    .catch(function (err) {
      console.error('Error signing in', err)
    })
}

function loadClient() {
  window.gapi.client.setApiKey('YOUR_API_KEY')
  return window.gapi.client
    .load('https://sheets.googleapis.com/$discovery/rest?version=v4')
    .then(function () {
      console.log('GAPI client loaded for API')
    })
    .catch(function (err) {
      console.error('Error loading GAPI client for API', err)
    })
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  return window.gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: '1fWOF289lDMqhVUs5TgD7QSxlIMJQR0VD5bo0f3VhFzI',
      range: 'MESO 1',
    })
    .then(function (response: any) {
      // Handle the results here (response.result has the parsed body).
      console.log('Response', response)
    })
    .catch(function (err: any) {
      console.error('Execute error', err)
    })
}

const GoogleSheetsExample = () => {
  useEffect(() => {
    window.gapi.load('client:auth2', function () {
      window.gapi.auth2.init({ client_id: '149819275403-bec3otj11gj775kvo6iqpb4unfncnapu.apps.googleusercontent.com' })
    })
  }, [])

  return (
    <>
      <button onClick={() => authenticate().then(loadClient)}>authorize and load</button>
      <button onClick={execute}>execute</button>
    </>
  )
}

export default GoogleSheetsExample
