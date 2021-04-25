/**
 * Logs the redict URI to register.
 */
function logRedirectUri() {
  Logger.log(OAuth2.getRedirectUri());
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  getService().reset();
}
function getRedirectUri() {
  console.log(getService().getRedirectUri());
}
function getStorage() {
  console.log(getService().getStorage());
}

function testAPI() {
  const param = { date: "2021-04-24" };

  var service = getService();
  if (service.hasAccess()) {
    const res = new API(service).getHR(param);
    console.log(JSON.stringify(res, null, 2));

  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
      authorizationUrl);
  }
}

function testPS() {
  const sp = PropertiesService.getScriptProperties();
  const up = PropertiesService.getUserProperties();
  const dp = PropertiesService.getDocumentProperties();

  const listProps = ps => Object.entries(ps.getProperties()).forEach(([key, value]) => console.log("key: %s, value: %s.", key, value))

  up.setProperty("test", 1);
  up.setProperty("test2", new Date());
  console.log("----------------- scriptProperties -----------------");
  listProps(sp);

  console.log("----------------- userProperties -----------------");
  listProps(up);

  console.log("----------------- documentProperties -----------------");
  listProps(dp);

  const lastSync = sp.getProperty(props.latestSync);
  console.log(Number(lastSync));
  console.log(new Date(lastSync));
  console.log(new Date(Number(lastSync)));
}

function howToUse() {
  const ss = SpreadsheetApp.getActive();
  console.log(ss.getId());
  console.log(ss.getName());
  console.log(ss.getUrl());
  console.log(ss.getLastRow());

  const sheet = ss.getActiveSheet();
  const lastRow = sheet.getLastRow();
  console.log(sheet.getName());
  console.log(sheet.getSheetId());
  console.log(sheet.getSheetName());


  const cnt = lastRow === 0 ? 1 : sheet.getSheetValues(lastRow, 1, 1, 1)[0][0] + 1;
  sheet.appendRow([cnt, new Date()]);

  const rRows = 10;
  const range = sheet.getRange(lastRow + 1, 1, rRows, 2);
  const values = [];
  for (let i = 0; i < rRows; i++) values.push([cnt + 1 + i, Date.now()]);
  range.setValues(values);

}




function checkTimeZone() {
  console.log(new Date());
  const foo = new MyDate("2021-04-22");
  console.log(foo);
  console.log(foo.strftime("%Y/%m/%d %H:%M:%S"));

  const sheet = SpreadsheetApp.getActive().getActiveSheet();
  const lastRow = sheet.getLastRow();

  const latestSyncedTimestamp = sheet.getRange(lastRow, 1).getValue();

  console.log(new Date(latestSyncedTimestamp));


}

function drive() {
  const workingDir = DriveApp.getFileById(SpreadsheetApp.getActive().getId()).getParents().next();
  console.log(workingDir.getName());

  // console.log(MimeType.GOOGLE_SHEETS);
  // const newSheet = SpreadsheetApp.create("created10");
  // DriveApp.getFileById(newSheet.getId()).moveTo(DriveApp.getFolderById(workingDir.getId()));

  for (let i = 2020; i < 2120; i++)
    addSpreadSheet(workingDir, `${i}`);
}

function SpreadsheetAppTest() {
  SpreadsheetApp.create("created");
}



