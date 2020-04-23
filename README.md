# 1.事前準備
## slackのLegacy Tokenの発行
↓[こちら](https://api.slack.com/legacy/custom-integrations/legacy-tokens)でできます
https://api.slack.com/legacy/custom-integrations/legacy-tokens

tokenは作成したら、あとでGASに入れるのでどこかにメモる

## Outgoing WebHooksの設定
1. https://your-team(チーム名).slack.com/apps/manage/custom-integrationsへアクセス
2. 検索窓からOutgoing Webhooksを探してクリック
3. 「Add Configuration」ボタンをクリック

ここから、Outgoing WebHooksの詳細設定
4. チャンネルを選択
5. 引き金となる言葉をカンマ区切りで
今回は以下を追加（一緒にカスタム絵文字に追加しておくのをお勧めします）
* :kintaikaishi:
* :kintaishuryo:
* :kyukeikaishi:
* :kyukeishuryo:
6. URLは一旦空で良い。あとでGASのエンドポイントを入力する
7. tokenはあとでGASに入れるのでどこかにメモる
8. 保存

# 2. 記録するスプレッドシートを用意する
1. 適当にスプレッドシートを用意してください
１行目は
日付	勤務開始時刻	休憩開始時刻	休憩終了時刻	勤務終了時刻
を入れると良いです。
2. スプレッドシートのkeyをメモる
keyとは、以下のURLのhogehoge部分です。あとでGASに入れます。
https://docs.google.com/spreadsheets/d/hogehoge/edit#gid=0

# 3. GASを書いていく
1. Google DriveからGoogle App Scriptを新規作成
2. 以下のコードをコピペ
https://github.com/shogokusumure/slack_kintai_manager/blob/master/script/kintai_managaer.gs
3. 先の項でメモったSLACK_TOKEN, WEBHOOK_TOKEN, SHEET_KEYを入れる
4. （必須じゃないけど）slackに返信をくれるbotのアイコンと名前を設定
https://github.com/shogokusumure/slack_kintai_manager/blob/a116b4aae8242dd3011d9d8622748c45904b94d3/script/kintai_managaer.gs#L128-L129

# 4.GASとslackの繋ぎ込み
## SlackAppライブラリを設定する
1. ファイルを保存
2. メニュー(リソース) > ライブラリをクリック
3. プロジェクトキー 「M3W5Ut3Q39AaIwLquryEPMwV62A3znfOO」 を入力 > 追加 > バージョンを最新に指定 > 保存

## Outgoing WebhooksにGASのエンドポイントを指定
1. メニュー(ファイル) > 版を管理 > 新しいバージョンを保存
2. メニュー(公開) > ウェブアプリケーションとして導入
次のユーザーとしてアプリケーションを実行「自分」
アプリケーションにアクセスできるユーザー「全員(匿名ユーザーを含む)」 ※組織でやる場合は権限周りでうまくできないかも
（スクリプト更新した時は毎回ウェブアプリケーションとして導入をしないと反映されないので注意）
3. エンドポイントが表示されるので、Outgoing Webhooksの設定画面に戻り、URLのところに記載