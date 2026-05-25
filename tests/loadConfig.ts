const { google } = require('googleapis')

async function loadConfig() {

  const credentialsJson = process.env.SERVICE_ACCOUNT_JSON

if (!credentialsJson) {
  throw new Error('SERVICE_ACCOUNT_JSON is not defined')
}

const credentials = JSON.parse(credentialsJson)

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({
    version: 'v4',
    auth,
  })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.CONFIG_SHEET_ID,
    range: '団体一覧!A:C',
  })

  const rows = response.data.values || []

  const config = new Map<string, string>()

  // 1行目スキップ
  for (const row of rows.slice(1)) {
    const key = row[0]   // A列
    const value = row[2] // C列

    if (!key || !value) continue

    config.set(key, value)
  }

  return config
}

module.exports = {
  loadConfig,
}