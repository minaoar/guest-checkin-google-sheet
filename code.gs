const REG_SHEET_NAME = "Registrations";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Guest Check-in");
}

function norm_(s) {
  return (s || "").toString().trim().toLowerCase();
}


function test(){
  Logger.log("Tanzil");
}

function apiFindGuestsByName(nameQuery) {
  const q = norm_(nameQuery);
  if (!q) return { found: false, message: "Type a name to search." };

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(REG_SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();

  const nameCol = headers.findIndex(h => norm_(h) === "name");
  const regCol  = headers.findIndex(h => norm_(h) === "total registration");
  const chkCol  = headers.findIndex(h => norm_(h) === "total checkin");

  if ([nameCol, regCol, chkCol].some(i => i === -1)) {
    return { found: false, message: "Missing required columns: Name, Total Registration, Total CheckIn." };
  }

  Logger.log("Lines: " + values.length);
  
  const matches = [];
  for (let i = 0; i < values.length; i++) {
  // for (let i = 0; i < 200; i++) {
    const row = values[i];
    const name = (row[nameCol] || "").toString().trim();
    if (!name) continue;

    if (norm_(name).includes(q)) {
      matches.push({
        rowNumber: i + 2,
        name: name,
        registered: row[regCol] ?? 0,
        checkedIn: row[chkCol] ?? 0
      });
    }
  }

  if (matches.length === 0) return { found: false, message: "No match found." };
  if (matches.length === 1) return { found: true, single: true, match: matches[0], matches: [] };

  return { found: true, single: false, matches };
}

function apiSetCheckIn(rowNumber, newCheckIn) {
  rowNumber = Number(rowNumber);
  newCheckIn = Number(newCheckIn);

  if (!Number.isFinite(rowNumber) || rowNumber < 2) {
    return { ok: false, message: "Invalid row number." };
  }
  if (!Number.isFinite(newCheckIn) || newCheckIn < 0) {
    return { ok: false, message: "Invalid check-in number." };
  }

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(REG_SHEET_NAME);

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const chkCol = headers.findIndex(h => norm_(h) === "total checkin");
  const regCol = headers.findIndex(h => norm_(h) === "total registration");

  if (chkCol === -1 || regCol === -1) {
    return { ok: false, message: "Missing 'Total Registration' or 'Total CheckIn' column." };
  }

  const registered = Number(sheet.getRange(rowNumber, regCol + 1).getValue()) || 0;
  const already_checked_in = Number(sheet.getRange(rowNumber, chkCol + 1).getValue()) || 0;

/*
  if (totalCheckIn > registered) {
    return { ok: false, message: `Check-in (${totalCheckIn}) cannot exceed registered (${registered}).` };
  }
*/
  const total_check_in = newCheckIn + already_checked_in;
  sheet.getRange(rowNumber, chkCol + 1).setValue(total_check_in);
  return { ok: true, message: `Check-in (${total_check_in}) out of (${registered}) registered guests.`  };
}

function debugRegistrationSetup() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(REG_SHEET_NAME);

  if (!sheet) {
    throw new Error(`Sheet tab not found: "${REG_SHEET_NAME}". Tabs: ${ss.getSheets().map(s => s.getName()).join(", ")}`);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  Logger.log("Spreadsheet name: " + ss.getName());
  Logger.log("Sheet tab: " + sheet.getName());
  Logger.log("Headers: " + JSON.stringify(headers));
}
