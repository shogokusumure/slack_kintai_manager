// Legacy token
var SLACK_TOKEN = "hogehogehogehogehogehogehogehoge";
// Outgoing WebhooksのToken
var WEBHOOK_TOKEN = "fugafugafugafugafugafugafugafugafugafugafuga";
// スプレッドシートのkey(https://docs.google.com/spreadsheets/d/xxx/edit の xxx部分 )
var SHEET_KEY = "xxxxxxxxxxxxxxxxxxxx"

var SHEET_BASE_URL = "https://docs.google.com/spreadsheets/d/"

// slackのpostを受け取る
function doPost(e) {
  var inputTxt = e.parameter.text

  var currentDay = getCurrentDay();
  var currentTime = getCurrentTime();

  var sheet = SpreadsheetApp.openById(SHEET_KEY).getActiveSheet();

  var now = new Date();
  var rowNum = findDate(sheet, now.getTime())
  // 今日の日付がからだったときのエラー処理。次の行にセットして最終行を更新
  if(rowNum === 0) {
    rowNum = findBlankRow(sheet)
    sheet.getRange(rowNum, 1).setValue(currentDay);
  }

  var responseTxt = ''
  var colNum = ''
  if(inputTxt === ':kintaikaishi:'){ // 勤怠開始
    colNum = 2 //　勤怠開始のカラム番号
  } else if(inputTxt === ':kintaishuryo:'){ // 勤怠終了
    colNum = 3 //　休憩開始のカラム番号
  } else if(inputTxt === ':kyukeikaishi:'){ // 休憩開始
    colNum = 4 //　休憩終了のカラム番号
  } else if(inputTxt === ':kyukeishuryo:'){ // 休憩終了
    colNum = 5 //　勤怠終了のカラム番号
  }

  var response = dakokuExec(sheet, colNum, rowNum, currentTime)

  if(response == 'success') {
    responseTxt = '打刻Done'
  } else {
    responseTxt = '既に打刻済かも…？ 確認してみて!\n→ ' +  SHEET_BASE_URL + SHEET_KEY
  }

  // 念のため、botの投稿でリピートしないように
  if (e.parameter.user_name != "slackbot"){
    postMessage(e.parameter.token, e.parameter.channel_name, responseTxt);
  }
}

// 今日の日付のデータがあるか探索し、その行番号を返す。
// 見つからなったら0を返す
function findDate(sheet,dateTime){
  var lastRow=sheet.getDataRange().getLastRow();

  var oneDaySec = 24 * 60 * 60 * 1000　
  for(var i=1;i<=lastRow;i++){
    var dateString = sheet.getRange(i,1).getValue()
    var sheetTime = Date.parse(dateString)

    if(dateTime > sheetTime && dateTime - sheetTime < oneDaySec){
      return i;
    }
  }
  return 0
}

// 最新のBlankの行番号返す
function findBlankRow(sheet) {
  return sheet.getDataRange().getLastRow() + 1;
}

// 現在の日付を返す
function getCurrentDay(){
  var now = new Date();

  var Year = now.getFullYear();
  var Month = now.getMonth() + 1;
  var DateObj = now.getDate();

  return Year + '-' + Month + '-' + DateObj;
}

// 現在時刻を返す
function getCurrentTime(){
  var now = new Date();

  var Hour = now.getHours();
  var Min = now.getMinutes();
  var Sec = now.getSeconds();

  return Hour + ':' + Min + ':' + Sec;
}

// 特定座標の値のnull確認
function isBlankArea(sheet, col, row){
  return sheet.getRange(row, col).getValue() == '' ? true : false
}

// 打刻処理
// レスポンスはstatusとslackに返却するメッセージ
function dakokuExec(sheet, col, row, currentTime){
  var status = ''
  // var responseTxt = ''
    if(isBlankArea(sheet, col, row) == true){
      sheet.getRange(row,col).setValue(currentTime);
      status = 'success'
    } else {
      status = 'fail'
    }
  return status
}

//Post massage(Slackに投稿する関数)
var postMessage = function(webhook_token,channel_name, text){
  // GASのendpointを知られてしまい、勝手にGASにPOSTされた場合の対策
  if (WEBHOOK_TOKEN != webhook_token) {
    throw new Error("invalid token."); //エラーを通知します
  }
  // PropertiesService：https://developers.google.com/apps-script/reference/properties/
  PropertiesService.getScriptProperties().setProperty("token", SLACK_TOKEN);
  var prop =  PropertiesService.getScriptProperties().getProperties();
  // slackAppライブラリを利用してslackに投稿
  var slackApp = SlackApp.create(prop.token);
  slackApp.postMessage("#"+channel_name, text, {
                       username : "勤怠管理するマン",// slackにレスポンスくれるbotの名前
                       icon_url : "kintai_kanri_suru_man.jpg"// アイコン画像URL
                       });
  return null;
}
