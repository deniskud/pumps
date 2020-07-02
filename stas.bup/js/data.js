
corr = {
	    1:[4067993,7005662],
	    5:[3931701,13288961]
}

pumps = {
	    1:"323033375D387201",
	    5:"373130386A397003"
}

datas = {1:[0,0],2:[0,0],3:[0,0],4:[0,0],5:[0,0]}

function ge(a) {return document.getElementById(a);}
function init() {xws.send(JSON.stringify({login:'stas',password:'josperado',cmd:'auth_req'}));}

//const ws = new WebSocket('ws://dutch.lora-wan.net:8002/');
xws.onopen = function() {
    console.log('WebSocket Client Connected');
    init();
};

xws.onmessage = function(e) {
  try{
    json=JSON.parse(e.data);
    getData(json);
    }
     catch(err)
         {
             console.log('Server прислал чушь');
             console.log(err);
		
         }
};

function getId(a) {for (i in pumps) if (pumps[i]==a) return i; return 0;}


function getNum(prs) {
    len = prs.length;
    tm = parseInt(prs.substring(12,14)+prs.substring(10,12)+prs.substring(8,10)+prs.substring(6,8),16);
    xtm = new Date(tm*1000); xxx = xtm.toISOString();
    l1 = parseInt(prs.substring(len-16,len-18)+prs.substring(len-18,len-20)+prs.substring(len-20,len-22)+prs.substring(len-22,len-24),16);
    p1 = parseInt(prs.substring(len-24,len-26)+prs.substring(len-26,len-28)+prs.substring(len-28,len-30)+prs.substring(len-30,len-32),16);
//    console.log(xxx,' -- ',l1,"---",p1);

/*
	l1+=corr[xid][1];
	p1+=corr[xid][0];
*/
	l1 = l1/100;
	p1 = p1/1000;
    return {l1,p1};
}

function getData(data) {
//console.log(data.cmd);
    switch(data.cmd) {
    case 'auth_resp':
    console.log("Token: ",data.token);
    getIt(1);
    getIt(5);
    break;
    case 'get_data_resp':

	xout = JSON.stringify(data);
	xid = getId(data.devEui);

//	console.log(data);

//   out=data.data_list.length;
    
//    for (i=0;i<data.data_list.length;i++) {
 
//   out+=data.data_list[i]
if (data.data_list.length==0) {

console.log('NOTHING');

return;
}

//console.log("=========== "+data.data_list.length);

    prs = data.data_list[0].data;
    xx = getNum(data.data_list[0].data);
if (data.data_list.length>1) {
    yy = getNum(data.data_list[data.data_list.length-1].data);
    xx.l1 = xx.l1-yy.l1;
    xx.p1 = xx.p1-yy.p1;
}
	datas[xid] = xx;
	update_screen(xid);

    break;    


    }

};

function update_screen(i) {
	console.log(i,datas[i]);
	if (datas[i].l1) {
			ge('w'+i).innerHTML=datas[i].l1;	
			ge('p'+i).innerHTML=datas[i].p1;	
			ge('x'+i).innerHTML=Math.round((datas[i].p1/datas[i].l1)*100)/100;	
			ge('ww'+i).innerHTML=datas[i].l1;	
			ge('pp'+i).innerHTML=datas[i].p1;	
		}
}

function getIt(id,datef=0,datet=0,limit=1) {
//console.log("FUCK");
    var tmp = new Object();
    tmp.cmd = "get_data_req";
    tmp.select = new Object();
if (datef) {
    tmp.select.date_from=datef;
    tmp.select.date_to=datet;
}
	tmp.select.limit = limit;
//    console.log(pumps[id])
    tmp.devEui = pumps[id];
console.log("-----");
console.log(tmp); 
    xws.send(JSON.stringify(tmp));
}
