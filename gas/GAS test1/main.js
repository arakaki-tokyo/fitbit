/**
 * Authorizes and makes a request to the FitBit API.
 */
function authorize() {
  var service = getService();
  if (service.hasAccess()) {
    console.log("You've already done authorization.")
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
      authorizationUrl);
  }
}

/**
 * @param {SpreadsheetApp.Sheet} sheet
 * @param {String} date
 */
function sync(sheet, date, startTime, endTime) {
  console.log(new MyDate().strftime("%H:%M:%S:%f"), `: fetch data of ${date} ${startTime ? startTime : '00:00'} to ${endTime ? endTime : '23:59'}`);

  const res = new API(getService()).getHR({ date, startTime, endTime });
  insertData(sheet, res);
}

/** 
 * format API response, then insert it to specified sheet
 * 
 * @param {SpreadsheetApp.Sheet} sheet
 * @param {Object} res
 */
function insertData(sheet, res) {
  // format data
  const dateTime = res["activities-heart"][0].dateTime;
  const array = res["activities-heart-intraday"].dataset;

  const rowLength = array.length;
  if (rowLength === 0) return;
  const lastRow = sheet.getLastRow();
  const values = [];
  array.forEach(data => {
    const time = new Date(`${dateTime} ${data.time} GMT+0900`).getTime();
    values.push([time, data.value]);
  })

  // insert data
  const range = sheet.getRange(lastRow + 1, 1, rowLength, 2);
  range.setValues(values);
}


function pereodic() {
  const sp = PropertiesService.getScriptProperties();
  const latestSync = getPropLatestSync();

  if (latestSync === null) {
    console.log("You must do first synchronize by calling init()");
    return;
  }
  const latestSyncDate = new MyDate(latestSync);
  const now = new MyDate();

  const workingDir = DriveApp.getFileById(SpreadsheetApp.getActive().getId()).getParents().next();

  const latestFile = workingDir.getFilesByName(`${now.getFullYear()}`).next();
  const latestSS = SpreadsheetApp.openById(latestFile.getId());

  let sheetToday;
  let sheetYesterday;
  const startDateTime = new MyDate(latestSyncDate.getTime() + 1000 * 60);

  if (latestSyncDate.getFullYear() !== now.getFullYear()) {
    // 年跨ぎ
    sheetToday = addSpreadSheet(workingDir, `${now.getFullYear()}`).getSheetByName('1');
    sheetYesterday = latestSS.getSheetByName(`${latestSyncDate.getMonth() + 1}`);
  } else {
    sheetToday = latestSS.getSheetByName(`${now.getMonth() + 1}`);
    if (latestSyncDate.getMonth() !== now.getMonth()) {
      // 月跨ぎ
      sheetYesterday = ss.getSheetByName(`${latestSyncDate.getMonth() + 1}`);
    } else {
      sheetYesterday = sheetToday;
    }
  }

  if (latestSyncDate.getDate() === now.getDate()) {
    sync(sheetToday, now.strftime('%Y-%m-%d'), startDateTime.strftime('%H:%M'), now.strftime('%H:%M'));
    setPropLatestSync(sheetToday);
  } else {
    // 日跨ぎの処理
    const resToday = new API(getService()).getHR({ date: now.strftime('%Y-%m-%d') });
    if (resToday["activities-heart-intraday"].dataset.length === 0) {
      return;
    }
    // sync yesterday
    sync(sheetYesterday, latestSyncDate.strftime('%Y-%m-%d'), startDateTime.strftime('%H:%M'), '23:59');
    // sync today
    insertData(sheetToday, resToday);
    setPropLatestSync(sheetToday);
  }
}

function init() {
  const workingDir = DriveApp.getFileById(SpreadsheetApp.getActive().getId()).getParents().next();
  const startDate = new Date(START_DATE);
  startDate.setHours(0, 0, 0, 0);
  console.log(startDate);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const startDateYear = startDate.getFullYear();
  let ss;
  // Create a spreadsheet for each year
  for (let year = startDateYear; year <= now.getFullYear(); year++) {
    ss = year === startDateYear ?
      addSpreadSheet(workingDir, `${year}`, startDate.getMonth() + 1) :
      addSpreadSheet(workingDir, `${year}`);
  }

  // Sync data of this year
  const syncStartDate = now.getFullYear() === startDateYear ? startDate : new Date(`${now.getFullYear()}-01-01T00:00:00+0900`);
  let targetSheet = ss.getSheetByName(`${syncStartDate.getMonth() + 1}`);
  for (
    const workingDate = new MyDate(syncStartDate);
    workingDate.getTime() <= now.getTime();
    workingDate.setDate(workingDate.getDate() + 1)
  ) {
    if (targetSheet.getName() !== String(workingDate.getMonth() + 1)) {
      targetSheet = ss.getSheetByName(`${workingDate.getMonth() + 1}`);
    }
    sync(targetSheet, workingDate.strftime("%Y-%m-%d"));
  }

  setPropLatestSync(targetSheet);

}

/**
 * Set latestSync property to scriptProperties
 * @param {Sheet} sheet sheet to read latest synced timestamp
 */
function setPropLatestSync(sheet) {
  const latestSync = sheet.getRange(sheet.getLastRow(), 1).getValue();
  PropertiesService.getScriptProperties().setProperty(props.latestSync, latestSync);
}

function getPropLatestSync() {
  return Number(PropertiesService.getScriptProperties().getProperty(props.latestSync))
}

/**
 * Add new spreadsheet having sheets nemed from "1" to "12"
 * 
 * @param {DriveApp.Folder} distDir
 * @param {String} year
 * @param {Number} [startMonth]
 * @return {SpreadSheet}
 */
function addSpreadSheet(distDir, name, startMonth) {
  const ss = SpreadsheetApp.create(name, 1, 2);
  const template = ss.getActiveSheet();
  let i = startMonth && startMonth >= 1 && startMonth <= 12 ? Math.floor(startMonth) : 1;
  for (; i <= 12; i++) {
    ss.insertSheet(`${i}`, { template });
  }
  ss.deleteSheet(template);
  DriveApp.getFileById(ss.getId()).moveTo(DriveApp.getFolderById(distDir.getId()));
  return ss;
}
