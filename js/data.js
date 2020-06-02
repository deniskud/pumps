//    wellData = {
//        chartDates/*this is arrays with dates for info and compare modes*/: {
//            chartInfoDates: [1586702022000, 1586961222000, 1587220422000, 1587393222000, 1587825222000, 1588343622000],// this is information charts dates
//            chartCompareDates: [1586702022000, 1586961222000, 1587220422000, 1587393222000, 1587825222000, 1588343622000]// this is comparison charts dates
//        },
//        wells/*this is information for each well*/: {
//            1/*this is the number of well - this numbers will not change*/: {
//                totalWater: '25468', // this is total water mining
//                totalEnergy: '145896', // this is total energy expense
//                totalEfficiency: ['1.858', '1'], // this is total(mean) energy expense; 1 element - expense for 1㎥, 2 element - efficiency - number from 1 to 7 (1 - best efficiency)
//                lockStatus: "0", // this is lock status of well: 1 - opened, 0 - closed
//                chartWaterI: [47.618, 24.956, 69.487, 28.236, 32.584, 2.824], // this is water mining for selected period in information mode
//                chartEnergyI: [18.618, 9.956, 25.487, 8.236, 14.584, 0.824], // this is energy expense for selected period in information mode
//                chartEfficiencyI: [2.618, 3.956, 3.487, 3.836, 2.584, 1.824], // this is energy expense for 1㎥ for selected period in information mode
//                chartEngineI: [18.618, 2.956, 12.487, 8.236, 14.584, 1.824], // this is engine work time for selected period in information mode
//                chartWaterC: [47.618, 24.956, 69.487, 28.236, 32.584, 2.824], // this is water mining for selected period in comparison mode
//                chartEnergyC: [18.618, 9.956, 25.487, 8.236, 14.584, 0.824], // this is energy expense for selected period in comparison mode
//                chartEfficiencyC: [2.618, 3.956, 3.487, 3.836, 2.584, 1.824], // this is energy expense for 1㎥ for selected period in comparison mode
//                chartEngineC: [18.618, 2.956, 12.487, 8.236, 14.584, 1.824] // this is engine work time for selected period in comparison mode
//            },


corr = {
	    1:[4067993,7005662],
	    5:[3931701,13288961]
}

pumps = {
	    1:"323033375D387201",
	    5:"373130386A397003"
}

datas = {1:[0,0],2:[0,0],3:[0,0],4:[0,0],5:[0,0]}

const xws = new WebSocket('ws://dutch.lora-wan.net:8002/');

//function ge(a) {return document.getElementById(a);}
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
    xtm = new Date(tm*1000); xxx = xtm.getTime();
    l1 = parseInt(prs.substring(len-16,len-18)+prs.substring(len-18,len-20)+prs.substring(len-20,len-22)+prs.substring(len-22,len-24),16)/100;
    p1 = parseInt(prs.substring(len-24,len-26)+prs.substring(len-26,len-28)+prs.substring(len-28,len-30)+prs.substring(len-30,len-32),16)/1000;
    return {xxx,l1,p1};
}

function getData(data) {
    switch(data.cmd) {
    case 'auth_resp':
    console.log("Token: ",data.token);
    getIt(1);
    getIt(5);
    break;
    case 'get_data_resp':

	xout = JSON.stringify(data);
	xid = getId(data.devEui);

	if (data.data_list.length==0) {
	    console.log('NOTHING');
	    return;
	}
    xx = getNum(data.data_list[0].data);

    console.log();    
    console.log(xid+'-',xx);

//    wellData = new Object();
//    wellData.chartDates = new Object();

    for (i=data.data_list.length-1;i>1;i--) {

    yy = getNum(data.data_list[i].data);
    console.log(yy);

    }

    wellData = {
        chartDates/*this is arrays with dates for info and compare modes*/: {
            chartInfoDates: [1586702022000, 1586961222000, 1587220422000, 1587393222000, 1587825222000, 1588343622000],// this is information charts dates
            chartCompareDates: [1586702022000, 1586961222000, 1587220422000, 1587393222000, 1587825222000, 1588343622000]// this is comparison charts dates
        },
        wells/*this is information for each well*/: {
            1/*this is the number of well - this numbers will not change*/: {
                totalWater: '35468', // this is total water mining
                totalEnergy: '145896', // this is total energy expense
                totalEfficiency: ['1.858', '1'], // this is total(mean) energy expense; 1 element - expense for 1㎥, 2 element - efficiency - number from 1 to 7 (1 - best efficiency)
                lockStatus: "0", // this is lock status of well: 1 - opened, 0 - closed
                chartWaterI: [47.618, 24.956, 69.487, 28.236, 32.584, 2.824], // this is water mining for selected period in information mode
                chartEnergyI: [18.618, 9.956, 25.487, 8.236, 14.584, 0.824], // this is energy expense for selected period in information mode
                chartEfficiencyI: [2.618, 3.956, 3.487, 3.836, 2.584, 1.824], // this is energy expense for 1㎥ for selected period in information mode
                chartEngineI: [18.618, 2.956, 12.487, 8.236, 14.584, 1.824], // this is engine work time for selected period in information mode
                chartWaterC: [47.618, 24.956, 69.487, 28.236, 32.584, 2.824], // this is water mining for selected period in comparison mode
                chartEnergyC: [18.618, 9.956, 25.487, 8.236, 14.584, 0.824], // this is energy expense for selected period in comparison mode
                chartEfficiencyC: [2.618, 3.956, 3.487, 3.836, 2.584, 1.824], // this is energy expense for 1㎥ for selected period in comparison mode
                chartEngineC: [18.618, 2.956, 12.487, 8.236, 14.584, 1.824] // this is engine work time for selected period in comparison mode
            }
	}
    }

//    drawInfo();
    drawGraghs();

/*
    if (data.data_list.length>1) {
        yy = getNum(data.data_list[data.data_list.length-1].data);
        xx.l1 = xx.l1-yy.l1;
        xx.p1 = xx.p1-yy.p1;
    }
	datas[xid] = xx;
//	update_screen(xid);
*/
    break;    


    }

};

function update_screen(i) {
	console.log(i,datas[i]);
//	if (datas[i].l1) {
//			ge('w'+i).innerHTML=datas[i].l1;	
//			ge('p'+i).innerHTML=datas[i].p1;	
//			ge('x'+i).innerHTML=Math.round((datas[i].p1/datas[i].l1)*100)/100;	
//			ge('ww'+i).innerHTML=datas[i].l1;	
//			ge('pp'+i).innerHTML=datas[i].p1;	
//		}
}

function getIt(id,datef=0,datet=0,limit=1) {

    var tmp = new Object();
    tmp.cmd = "get_data_req";
    tmp.select = new Object();
if (datef) {
    tmp.select.date_from=datef;
    tmp.select.date_to=datet;
} else {
    limit=100;
}
    tmp.select.limit = limit;
    tmp.devEui = pumps[id];
    xws.send(JSON.stringify(tmp));
}
