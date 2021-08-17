'use strict';
//Node.jsに用意されたモジュールの呼び出し
const fs = require('fs');//FileSystemの略
const readline = require('readline');//ファイルを一行ずつ読み込む
//popu-pref.csv ファイルから、ファイルを読み込みを行う Stream（ストリーム）を生成し、 さらにそれを readline オブジェクトの input として設定し rl オブジェクトを作成しています。
const rs = fs.createReadStream('./popu-pref.csv');
//popu-pref.csvをファイルとして読み込める状態に準備する
const rl = readline.createInterface({ input: rs, output: {} });
// readlineモジュールに rs を設定する
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
  //「”2010","北海道","237155,258530"]のようなデータ配列に分割
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = (columns[1]);
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
     //都道府県ごとのデータを作る
    let value = prefectureDataMap.get(prefecture);
    //データがなかったらデータを初期化
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
   for (let [key, value] of prefectureDataMap) {
      value.change = ( value.popu15 / value.popu10)* 100 ;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
      return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value],i) => {
      return (i + 1) + '位' + '_' +
        key +
        ': ' +
        value.popu10 + '人' +
        '=>' +
        value.popu15 + '人' +
        ' 変化率:' +
        value.change.toFixed(1) + '%' ;
    });
    console.log(rankingStrings);
  });