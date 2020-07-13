#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();
client.on('connect', handler);
client.connect('ws://dutch.lora-wan.net:8002/');


const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });


wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {

	msg = JSON.parse(message);

	switch(msg.cmd) {

		case "start":
			console.log("Start");
		break;

		case "get_data_req":

			h = (msg.select.date_to-msg.select.date_from)/3600000;


			console.log(">>>",h);

			out = Array();

			xdd = -1;

			for (i in dpumps[msg.xid]) {
//				console.log(dpumps[msg.xid][i].t,dpumps[msg.xid][i]);
			t = dpumps[msg.xid][i].t;


			if (parseInt(t)>starts[msg.xid] && parseInt(t)>parseInt(msg.select.date_from) && parseInt(i)<parseInt(msg.select.date_to)) {

				tmp = [t,dpumps[msg.xid][i].v_l1,dpumps[msg.xid][i].v_p1,dpumps[msg.xid][i].l1,dpumps[msg.xid][i].p1];
				out.push(tmp);

				}


				
			}			
			if (out.length) ws.send(JSON.stringify({id:msg.xid,df:msg.select.date_from,dt:msg.select.date_to,data:out}));	
		break;
	
	}
  });
 
//  ws.send('something');
});


var dpump = Array();
//console.log(dpump);
xfirst = false;
var ltime = ptime = 0;
var v_l1 = v_p1 = v1_l1 = v1_p1 = 0;
var count = 0;

function geth(tm) {
	xx = new Date(tm);
	return xx.getTime()-xx.getMinutes()*60000;
}

function getd(tm) {
	xx = new Date(tm);
	return xx.getTime()-xx.getMinutes()*60000-xx.getHours()*3600000;
}


oldtm = 0;

function xparse(id,prs) {
//	if (!xfirst) {xfirst = true; return;}	
    len = prs.length;
   if (len!=48 && len!=50) return;
    tm = parseInt(prs.substring(12,14)+prs.substring(10,12)+prs.substring(8,10)+prs.substring(6,8),16);
    xtm = new Date(tm*1000); tm = xtm.getTime();
    if (tm<starts[id]) return;
//console.log(">>>>>>>>>>",id,len,tm)

    
//    if (oldtm && oldtm<tm) { console.log("FUCK",id,tm-oldtm);}

//	oldtm = tm;
  

    l1 = parseInt(prs.substring(len-16,len-18)+""+prs.substring(len-18,len-20)+""+prs.substring(len-20,len-22)+""+prs.substring(len-22,len-24),16);
    p1 = parseInt(prs.substring(len-24,len-26)+""+prs.substring(len-26,len-28)+""+prs.substring(len-28,len-30)+""+prs.substring(len-30,len-32),16);
//    return {tm,l1,p1}; // Время, вода, электричество
  if (tm<1580000000000 || tm>1900000000000) {console.log("FUCK",len,tm,l1,p1);return;}


    if (ltime == 0) {
	ltime = tm;
	ptime = tm;
	hr = xtm.getHours();
	dd = xtm.getDate();
     	v_l1 = l1;
	v_p1 = p1;
     	v1_l1 = l1;
	v1_p1 = p1;
	return;
    }

    diff = ltime-tm;

	xhr = xtm.getHours();
	xdd = xtm.getDate();
	if (xhr!=hr) {
		v_l1 = v_l1-l1;v_p1 = v_p1-p1;
		if (v_l1>0 || v_p1>0) {
		t = geth(ltime);
		dpump[t] = {t,v_l1,v_p1,l1,p1};
//		dpump.push([geth(ltime),v_l1,v_p1);
//		console.log(">>",geth(ltime),v_l1,v_p1,l1,p1);
		count++;
		}
	     	v_l1 = l1;
		v_p1 = p1;
	hr = xhr;
	} else if (xdd!=dd)  {
		
		

	dd = xdd;
	}

	ltime = tm;
}

var dpumps = Array();
xfirst = false;


function save_data(id) {
xfirst = false;
oldtm = 0;
//arr = Object.keys(dpump).map(key => dpump[key]);
//ok = arr.sort((itemA, itemB) =>  itemA - itemB);
//console.log(ok);
    dpumps[id] = dpump; 
    dpump={};
//console.log(dpump);
console.log(">>>>",id,count);
count=0;
};

starts = {
	1:1586951000000,
//	2:1586951000000,
	2:1593800962000,
	3:1593800000000,
//	  1593799200000
	5:1586951000000,
	10:1586951000000,
	12:1593820800000
}
pumps = {       // Lora devEui  для счетчиков
        1:"323033375D387201",
        2:"3230333770386801",
        3:"323834345A396206",
        5:"373130386A397003",
        10:"3238343456396206",
        12:"373130386D396D01"
};


function getId(a) {for (i in pumps) if (pumps[i]==a) return i; return 0;}

function handler(c) {

function getIt(id,datef=0,datet=0,limit=0) {

    var tmp = new Object();
    tmp.cmd = "get_data_req";
    tmp.select = new Object();
//    console.log(":::",datef.datet);

if (datef) {
    tmp.select.date_from=datef;
    if (!datet) {datet=datef;}
    tmp.select.date_to=datet;
    if (!limit) limit=5000;
} else {
    ttm = new Date();
    xttm = ttm.getTime()-(ttm.getHours()-8)*60*60*1000-ttm.getMinutes()*60*1000;//+60*60*2*1000;
//    tmp.select.date_to=xttm;
//    tmp.select.date_from=xttm-86500*1000;
        tmp.select.date_from=0;
    limit=10000;
}

//    intr=tmp.select.date_to-tmp.select.date_from;
    tmp.select.limit = limit;
    tmp.devEui = pumps[id];
//    console.log(JSON.stringify(tmp));
    c.send(JSON.stringify(tmp));
}




    c.on("message", function(msg) {
	var json = JSON.parse(msg.utf8Data);
//	console.log(">>>",json.cmd);
	if (!json.status) return;
	switch(json.cmd) {

	case "auth_resp":
	console.log("Auth");
	refresh();
        break;

	case "get_data_resp":

	devid = getId(json.devEui);
//	console.log("!!!",devid);
	if (json.data_list.length) {
	
	for (i in json.data_list) if (json.data_list[i]) xparse(devid,json.data_list[i].data);
	}
	save_data(devid);
	console.log(":>>>",devid,json.data_list.length);
	break;

	}

    });

function refresh () {
	for (i in pumps) getIt(i);

}
setInterval(refresh, 1000*600);

    c.sendUTF(JSON.stringify({login:'stas',password:'josperado',cmd:'auth_req'}));
}


