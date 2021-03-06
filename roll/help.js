"use strict";

var Dice = [],
	Tool = [],
	admin = [],
	funny = [],
	help = [],
	link = [];
const start = async () => {
	await require('fs').readdirSync(__dirname).forEach(async function (file) {
		try {
			if (require('./' + file).gameType && require('./' + file).gameType()) {
				var type = require('./' + file).gameType().replace(/:.*/i, '')
				var name = file.replace('.js', '');
				exports[type + '_' + name] = await require('./' + file);
			}

		} catch (error) {
			console.log(error)
		}
	})

	version = "v1." + Object.keys(exports).length + "." + heroku_version.replace(/[v]/, '');
	if (process.env.HEROKU_RELEASE_CREATED_AT) {
		version += '\n最後更新時間' + new Date(process.env.HEROKU_RELEASE_CREATED_AT).toLocaleString("en-US", {
			timeZone: "Asia/Shanghai"
		}).replace('GMT+0800 (GMT+08:00)', '');
	}
	ver = 'v1.' + Object.keys(exports).length;
	for (let name of Object.keys(exports)) {
		if (name.match(/^DICE/i)) {
			Dice.push(exports[name])
		}
		if (name.match(/^Tool/i)) {
			Tool.push(exports[name]);
		}
		if (name.match(/^admin/i)) {
			admin.push(exports[name]);
		}
		if (name.match(/^funny/i)) {
			funny.push(exports[name]);
		}
		if (name.match(/^help/i)) {
			help.push(exports[name]);
		}
		if (name.match(/^link/i)) {
			link.push(exports[name]);
		}
	}
}
start();
var variables = {};
//heroku labs:enable runtime-dyno-metadata -a <app name>

var heroku_version = 'v0'
var ver = '';
if (process.env.HEROKU_RELEASE_VERSION)
	heroku_version = process.env.HEROKU_RELEASE_VERSION;
var version = "";


var gameName = function () {
	return '骰子機器人說明';
}

var gameType = function () {
	return 'bothelp:hktrpg'
}
var prefixs = function () {
	return [{
		first: /^bothelp$/i,
		second: null
	}]

}
var getHelpMessage = function () {
	return "暗骰功能 在指令前輸入dr 結果會私訊你\n\
ddr dddr 可以私訊已設定的群組GM, 詳情可打.drgm查詢\n\
【基本擲骰】1d100(khN|klN|dhN|dlN)\n\
例如輸入(2d6+1)*2 攻撃！\n\
會輸出）(2d6+1)*2：攻撃！  (10[5+5]+1)2 = 22\n\
如上面一樣,在骰子數字後方隔空白位打字,可以進行發言。\n\
5 3D6 ：	分別骰出5次3d6 最多30次\n\
((2d6+1)*2)-5/2>=10 支援括號加減乘除及大於小於(>,<,>=,<=)計算\n\
支援kh|kl|dh|dl，k keep保留，d drop 放棄，h highest最高，l lowest最低\n\
如3d6kh 保留最大的1粒骰，3d6dl2 放棄最小的2粒骰"
}
var initialize = function () {
	return variables;
}


var rollDiceCommand = async function ({
	mainMsg
}) {
	let rply = {
		default: 'on',
		type: 'text',
		text: ''
	};
	//let result = {};
	switch (true) {
		case !mainMsg[1]:
			rply.text =
			"【Discord擲骰BOT】\
	 \n  \
	 \n 支援基本擲骰, COC, 永遠的後日談, 黑暗世界, DX3, SW2.0 \
	 \n 暗骰功能 在指令前打dr 結果會私訊你\
	 \n 基本擲骰1d100\
	 \n 例如輸入2d6+1　攻撃！\
	 \n 會輸出）2d6+1：攻撃  9[6+3]+1 = 10\
	 \n 如上面一樣,在骰子數字後方隔空白位打字,可以進行發言。\
	 \n 以下還有其他例子\
	 \n 5 3D6 	：分別骰出5次3d6\
	 \n D66 D66s ：骰出D66 s小者固定在前\
	 \n 5B10：不加總的擲骰 會進行小至大排序 \
	 \n 5B10 9：如上,另外計算其中有多少粒大於9 \
	 \n 5U10 8：進行5D10 每骰出一粒8會有一粒獎勵骰 \
	 \n 5U10 8 9：如上,另外計算其中有多少粒大於9 \
	 \n 隨機選擇：啓動語choice/隨機/選項/選1\
	 \n (問題)(啓動語)(問題)  (選項1) (選項2) \
	 \n 例子 隨機收到聖誕禮物數 1 2 3 >4  \
	 \n COC7ed：cc 80 技能小於等於80 \
	 \n 其他指令請到 https://github.com/zerolinghy/DiscordRollBot"
			return rply;
	}
}


module.exports = {
	rollDiceCommand: rollDiceCommand,
	initialize: initialize,
	getHelpMessage: getHelpMessage,
	prefixs: prefixs,
	gameType: gameType,
	gameName: gameName
};



/**
bothelp
請問有什麼可以幫你?
請輸入你想查詢的項目名字.
-------
bothelp ver    - 查詢版本及公告(xxxx時間更新)
bothelp Dice   - 查詢trpg 不同系統擲骰指令
bothelp Tool   - 查詢trpg 輔助工具
bothelp admin  - 查詢系統工具
bothelp funny  - 查詢趣味功能
bothelp link   - 查詢hktrpg 不同平台連結
bothelp report - 意見提供
-----
輸入 1 或 bothelp 公告 或 bothelp 版本
【HKTRPG擲骰BOT】" + version
及公告
------
輸入 2 或 bothelp Dice
0: 【進階擲骰】 .ca (計算)|D66(sn)|5B10 Dx|5U10 x y|.int x y
2: 【克蘇魯神話】 cc cc(n)1~2 ccb ccrt ccsu .dp .cc7build .cc6build .cc7bg
3: 【朱の孤塔】 .al (nALxp)
4: 【神我狩】 .kk (ET RT NT KT MTx)
5: 【迷宮王國】 .mk (nMK+m 及各種表)
6: 【亞俠必死的冒險】 .ss (nR>=x[y,z,c] SRx+y FumbleT)
7: 【忍神】 .sg (ST FT ET等各種表)
8: 【歌風】 .UK (nUK nUK@c or nUKc)
9: 【魔女狩獵之夜】.wn xDn+-y
10: 【DX2nd,3rd】 .dx (xDX+y@c ET)
11: 【命運Fate】 .4df(m|-)(加值)
12: 【永遠的後日談】 .nc (NM xNC+m xNA+m)
13: 【劍世界2.5】.sw (Kx Gr FT TT)
14: 【WOD黑暗世界】.xWDy
15: 【貓貓鬼差】.kc xDy z
------
輸入 3 或 bothelp Tool
 (公測中)暗骰GM功能 .drgm (addgm del show) dr ddr dddr
 (公測中)角色卡功能 .char (add edit show delete use nonuse) .ch (set show showall)
 (公測中)儲存擲骰指令功能 .cmd (add del show 自定關鍵字)
------
輸入 4 或 bothelp admin
.admin state
.admin
22: (公測中)擲骰開關功能 .bk (add del show)
------
輸入 5 或 bothelp funny
1: 【趣味擲骰】 排序(至少3個選項) choice/隨機(至少2個選項) 每日塔羅 運勢 立flag .me
17: (公測中)經驗值功能 .level (show config LevelUpWord RankWord)
18: Wiki查詢/圖片搜索 .wiki .image
20: (公測中)自定義回應功能 .ra(p)(次數) (add del show 自定關鍵字)
23: (公測中)資料庫功能 .db(p) (add del show 自定關鍵字)
------
輸入 6 或 bothelp link
DISCORD
TG
LINE
WWW
GITHUB
------
輸入 7 或 bothelp report
可以立即回應東西
------
**/
