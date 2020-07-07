/*
 * Created by No Fear on 15.05.2020.
 * E-mail: g0th1c097@gmail.com
 */


top.xtimes = Array();
xrange = 0;
nows = 1; 
intr = 0;

$(document).ready(function () {

if (!document.cookie || !document.cookie.match(/Token/)) top.location='/login.html';
const xws = new WebSocket('ws://dutch.lora-wan.net:8002/');

const xxws = new WebSocket('ws://pumps.lora-wan.net:8080/');

base = {   // Стартовые значения счетчиков (water, kw)
//        1:[7070500,7200],
        1:[0,0],
//	    2:[3139600,-1400],
        2:[0,0],
        3:[0,0],
       5:[0,0],
//        5:[13474700,171600],
        10:[0,0],

	12:[0,0]

}

pumps = {	// Lora devEui	для счетчиков
        1:"323033375D387201",
        2:"3230333770386801",
	3:"323834345A396206",
        5:"373130386A397003",
	10:"3238343456396206",
	12:"373130386D396D01"
}



function init() {xws.send(JSON.stringify({login:'stas',password:'josperado',cmd:'auth_req'}));}
function getId(a) {for (i in pumps) if (pumps[i]==a) return i; return 0;}

xxws.onopen = function() {

xxws.send(JSON.stringify({cmd:'start'}));

//xxws.send(JSON.stringify({cmd:'getit',id:1}));
}

xxws.onmessage = function(e) {
  try{
    json = e.data;
    
    newData(JSON.parse(json));
 //   console.log(json);
    }
     catch(err) {console.log(err);}
}

xws.onopen = function() {init();};
xws.onmessage = function(e) {
  try{
    json = e.data;
//    console.log(e.data);
    getData(JSON.parse(json));
    }
     catch(err) {console.log(err);}
};



function newData(data) {



//xdat = JSON.parse(data);
//console.log(data);
id = data.id;
console.log(">>>>>",id);
//    wellData.wells[xid].totalWater = ((xx.l1+base[xid][0])/10).toFixed(2);
//    wellData.wells[xid].totalEnergy = ((xx.p1+base[xid][1])/600).toFixed(2);
//    wellData.wells[xid].totalEfficiency =[(xx.p1/xx.l1).toFixed(2),1];

    times = Array(); n1=Array(); n2 = Array(); n3 = Array(); n4 = Array(); n5 = Array(); nr = Array();
j = 0;

var end = parseInt(data.df);
var start = parseInt(data.dt);

//JSON.stringify(data);
h = parseInt((start-end)/3600000);
console.log("---------------- ",data.df,data.dt,h);


ww = 0;
ee = 0;
ef = 0;

wk = 0;
ek = 0;


    flagd = false;
    flagw = false;

    for (i in data.data) {   
	times[i] = parseInt(data.data[i][0]);  
	n1[j] = (parseInt(data.data[i][1])/10).toFixed(2);
	n2[j] = (parseInt(data.data[i][2])/600).toFixed(2);
	n4[j] = (parseInt(data.data[i][3])/10).toFixed(2);
	n5[j] = (parseInt(data.data[i][4])/600).toFixed(2);

	if (n1[j]) n3[j] = (n2[j]/n1[j]).toFixed(2);	

       else n3[j]=0;

	if (times[0]-times[i]>86400000) {

		console.log(">",id,"day");
		if (!flagd) {flagd = true; ww = (n4[0]-n4[j]).toFixed(2);ee=(n5[0]-n5[j]).toFixed(2);


      //by zlodey
	if (ww) ef = (ee/ww).toFixed(2);
        else ef=0;  //by zlodey
	if (isNaN(ef)) ef=0;
	 wellData.wells[id].day = {water:ww,energy:ee,efficiency:ef};

	}}

	if (i && times[0]-times[i]<86400000*7) {
		
			
	wwk = parseInt((n4[j-1]-n4[j]));
	eek = parseInt((n5[j-1]-n5[j]));
	if (wwk) wk+=wwk;
	if (eek) ek+=eek;
	
//		console.log("+++",wk);
	}

/*
	if (times[0]-times[i]>86400000*7) {
		console.log(">",id,"week");

		if (!flagw) {flagw = true; ww = (n4[0]-n4[j]).toFixed(2);ee=(n5[0]-n5[j]).toFixed(2);


	 //by zlodey
	if (ww) ef = (ee/ww).toFixed(2);
	else ef=0;  //by zlodey

	 console.log(">> ",id,ww,ee);
	 wellData.wells[id].week = {water:ww,energy:ee,efficiency:ef};


	}}
*/ 

//	console.log(">>",times[0]-times[i],((times[0]-times[i]>86400000*7)));
	j++;
	}
	top.xtimes[id] = times;

	wk = wk.toFixed(2);
	ek = ek.toFixed(2);
	if (wk) ef = (ee/ww).toFixed(2); else ef=0; 
	if (isNaN(ef)) ef=0;
	 wellData.wells[id].week = {water:wk,energy:ek,efficiency:ef};
	

	ww = (n4[0]-n4[j-1]).toFixed(2);
	ee = (n5[0]-n5[j-1]).toFixed(2);
	
	if (ww) ef = (ee/ww).toFixed(2);
	else ef=0; //by zlodey
	if (isNaN(ef)) ef=0;

	 wellData.wells[id].month = {water:ww,energy:ee,efficiency:ef};

	ww = (n4[0]-0).toFixed(2);
	ee = (n5[0]-0).toFixed(2);
		
	if (ww) ef = (ee/ww).toFixed(2);
        else ef=0; //by zlodey
	if (isNaN(ef)) ef=0;

	 wellData.wells[id].year = {water:ww,energy:ee,efficiency:ef};


//console.log(times);

    wellData.chartDates.chartInfoDates = top.xtimes[id];
    wellData.chartDates.chartCompareDates = top.xtimes[id];

//    wellData.wells[id].totalWater = ((xx.l1+base[xid][0])/10).toFixed(2);
//    wellData.wells[id].totalEnergy = ((xx.p1+base[xid][1])/600).toFixed(2);
//    wellData.wells[id].totalEfficiency =[(xx.p1/xx.l1).toFixed(2),1];

    wellData.wells[id].chartWaterI = n1;
    wellData.wells[id].chartEnergyI = n2;
    wellData.wells[id].chartEfficiencyI = n3;
    wellData.wells[id].chartEngineI = n2;
 //wellData.wells[id].day = {water:ww,energy:ee,efficiency:ef};
 //wellData.wells[id].week = {water:ww,energy:ee,efficiency:ef};

console.log(id,times,n1);
    drawTables();
    drawInfo();

        redrawGraphs();
    $('#page-loader').stop().fadeOut();

}


function getNum(prs) { // Распаковывает значения из полученных данных
    len = prs.length;
    tm = parseInt(prs.substring(12,14)+prs.substring(10,12)+prs.substring(8,10)+prs.substring(6,8),16);
    xtm = new Date(tm*1000); tm = xtm.getTime();
//    l1 = parseInt(prs.substring(len-16,len-18)+prs.substring(len-18,len-20)+prs.substring(len-20,len-22)+prs.substring(len-22,len-24),16)/100;
//    p1 = parseInt(prs.substring(len-24,len-26)+prs.substring(len-26,len-28)+prs.substring(len-28,len-30)+prs.substring(len-30,len-32),16)/300;
    l1 = parseInt(prs.substring(len-16,len-18)+""+prs.substring(len-18,len-20)+""+prs.substring(len-20,len-22)+""+prs.substring(len-22,len-24),16);
    p1 = parseInt(prs.substring(len-24,len-26)+""+prs.substring(len-26,len-28)+""+prs.substring(len-28,len-30)+""+prs.substring(len-30,len-32),16);

    return {tm,l1,p1}; // Время, вода, электричество
}


function getData(data) {  // Обрабатывает ответы от сервера.
    if (!data.status) return;
    switch(data.cmd) {
    case 'auth_resp':	
    console.log("Token: ",data.token);
    getRest();
    break;
    case 'get_data_resp':
    xout = JSON.stringify(data);
    xid = getId(data.devEui);


    if (data.data_list.length==0) {
        console.log('NOTHING',chartRequest);
    wellData.chartDates.chartInfoDates = chartRequest.slice(1);
    wellData.chartDates.chartCompareDates = chartRequest;
        redrawGraphs();
//	console.log("---------->>>>>>>>>>>>>>>",chartRequest);			
				// Нет данных. Ничего не делаем, добавить отображение что НЕТ.
          $('#page-loader').stop().fadeOut();
        return;
    }

    xx = getNum(data.data_list[0].data); //tm - time, l1 - water, p1 - power

if (data.data_list.length==1) {

return;
}

    wellData.wells[xid].totalWater = ((xx.l1+base[xid][0])/10).toFixed(2);
    wellData.wells[xid].totalEnergy = ((xx.p1+base[xid][1])/600).toFixed(2);
    wellData.wells[xid].totalEfficiency =[(xx.p1/xx.l1).toFixed(2),1];

    
    times = Array(); n1=Array(); n2 = Array(); n3 = Array(); nr = Array();

//	intr = 0;
//	console.log(data);
//	if (data.date_from) intr = data.date_from - data.date_to;
	
//	if (intr>86400) console.log('ok');
//	console.log(xrange,intr,"----------------------------");

    olddat=dat=oldday=day=inc=0;

//	console.log("========================---------------------------=======================");
//	console.log(xrange);


//console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",intr);

ii=0;
/*
for (i in data.data_list) {
//data_list[i]

//    for (i=1;i<data.data_list.length;i++) {
    

    yy = getNum(data.data_list[i].data);

    if (yy.tm<1500000000000 || yy.tm>9500000000000 || xx.tm<yy.tm) continue;

    
    olddat = dat; xxtm = new Date(yy.tm); day = xxtm.getDay(); dat = yy;

    console.log("___",intr,xrange);

    if (!olddat) {olddat=xx;oldday=0;}

	nr[ii] = yy;
    
    if (intr>86400*8000000) {
	if (oldday!=day) {
	oldday = day;
	xxdat = new Date(olddat.tm); xnow = new Date();
	if (!olddat.tm) continue;
//|| (olddat.tm<1000000000 || xxdat>xnow
	times[inc] = olddat.tm;
	n1[inc] = (((olddat.l1-yy.l1))/10).toFixed(2);
	n2[inc] = (((olddat.p1-yy.p1))/600).toFixed(2);
	if (!n1[inc] || !n2[inc]) n3[inc]=0; else n3[inc] = (n2[inc]/n1[inc]).toFixed(2);	
	inc++;
	} else continue;	
    } else {	

    times[ii] = yy.tm;
    n1[ii] = (((xx.l1-yy.l1))/10).toFixed(2);
    n2[ii] = (((xx.p1-yy.p1))/600).toFixed(2);

    xx = yy;

    n3[ii] = (n2[ii]/n1[ii]).toFixed(2);
//	if (Number.isNaN(n3[i-1]) || isFinite(n3[i-1])) n3[i-1] = 0;
    }
ii++;
   }

*/
    console.log("$$$",times,n1,n2,n3);
//	console.log(times,n1);


//    console.log('=======',wellData.wells[xid].day);

    wellData.wells[xid].chartWaterI = n1;
    wellData.wells[xid].chartEnergyI = n2;
    wellData.wells[xid].chartEfficiencyI = n3;
    wellData.wells[xid].chartEngineI = n2;

    wellData.wells[xid].chartWaterC = n1;
    wellData.wells[xid].chartEnergyC = n2;
    wellData.wells[xid].chartEfficiencyC = n3;
    wellData.wells[xid].chartEngineC = n2;
    top.xtimes[xid] = times;
//console.log("-===========================================================================");
//console.log(top.xtimes);
    ww = ((nr[0].l1 - nr[nr.length-1].l1)/10).toFixed(2);
    ee = ((nr[0].p1 - nr[nr.length-1].p1)/600).toFixed(2);
    if (ww) ef = (ee/ww).toFixed(2);
    else ef=0;
//    ee = nr[0].p1 - nr[nr.length-1].p1;
//    ee = (nr[0].tm-nr[nr.length-1].tm)/1000/60/60;
//    ef = nr.length;
    wellData.chartDates.chartInfoDates = top.xtimes[xid];
    wellData.chartDates.chartCompareDates = top.xtimes[xid];
    wellData.wells[xid].day = {water:ww,energy:ee,efficiency:ef};
    wellData.wells[xid].month.efficiency = 33;
    drawTables();
    drawInfo();

        redrawGraphs();
        $('#page-loader').stop().fadeOut();
    
    break;    
    }

};

function getRest() {for (i in pumps) {


getIt(i);// drawTables();

}


}

function getIt(id,datef=0,datet=0,limit=0) {

    var tmp = new Object();
    tmp.cmd = "get_data_req";
    tmp.xid = id;
    tmp.select = new Object();
    console.log(":::",datef,datet);
if (datef) {
    tmp.select.date_from=datef;
    if (!datet) {datet=datef;}//+86400*1000;} //;datef = datef-86400*1000;}
    tmp.select.date_to=datet;
    if (!limit) limit=15000;
} else {
    ttm = new Date();
    xttm = ttm.getTime(); //-(ttm.getHours()-8)*60*60*1000-ttm.getMinutes()*60*1000+60*60*2*1000;
    tmp.select.date_from=xttm-86400*30*1000;
    tmp.select.date_to=xttm;
    
 //  tmp.select.limit = limit;
     limit=10000;
}

// if(intr>86400000*3) limit=5000; else limit=100;
    intr=tmp.select.date_to-tmp.select.date_from;
    tmp.select.limit = limit;
    tmp.devEui = pumps[id];
//    console.log(JSON.stringify(tmp));	
//    xws.send(JSON.stringify(tmp));
    xxws.send(JSON.stringify(tmp));

}
 


    moment.locale('uk');
    moment().format('HHmm');

    // ----- necessary variables
    const _body = $('body'), chartInfoOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'time',
                distribution: 'series',
                time: {
                    isoWeekday: true,
                    minUnit: 'minute',
                    tooltipFormat: 'DD MMM YYYY HH:mm',
                    displayFormats: {
                        minute: 'HH:mm',
                        hour: 'DD-MM HH:mm'
                    }
                },
                ticks: {
                    fontColor: "#a9afb1"
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: "#a9afb1"
                }
            }]
        }
    }, chartCompareOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'time',
                distribution: 'series',
                time: {
                    isoWeekday: true,
                    minUnit: 'minute',
                    tooltipFormat: 'DD MMM YYYY HH:mm',
                    displayFormats: {
                        minute: 'HH:mm',
                        hour: 'DD-MM HH:mm'
                    }
                },
                ticks: {
                    fontColor: "#a9afb1"
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: "#a9afb1"
                }
            }]
        },
        tooltips: {
            mode: 'index'
        }
    };
    let infoChartWater, infoChartEnergy, infoChartCompare, infoChartEngine, compareChartWater, compareChartEnergy, compareChartCompare, compareChartEngine, compareChartWaterData = [], compareChartEnergyData = [], compareChartCompareData = [], compareChartEngineData = [], wellData, chartRequest = [], pageTitle = document.title;

    // ----- remove chart legend
    Chart.defaults.global.legend.display = false;


    // ----- data for all wells
    wellData = {
        chartDates/*this is arrays with dates for info and compare modes*/: {
            chartInfoDates: [],// this is information charts dates
            chartCompareDates: []// this is comparison charts dates
        },
        wells/*this is information for each well*/: {
            1/*this is the number of well - this numbers will not change*/: {
                day: { // this is table data for last day
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                week: { // this is table data for last week
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                month: { // this is table data for last month
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                year: { // this is table data for last year
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                totalWater: '0', // this is total water mining
                totalEnergy: '0', // this is total energy expense
                totalEfficiency: '0', // this is total(mean) energy expense for 1㎥
                lockStatus: "0", // this is lock status of well: 1 - opened, 0 - closed
                chartWaterI: [], // this is water mining for selected period in information mode
                chartEnergyI: [], // this is energy expense for selected period in information mode
                chartEfficiencyI: [], // this is energy expense for 1㎥ for selected period in information mode
                chartEngineI: [], // this is engine work time for selected period in information mode
                chartWaterC: [], // this is water mining for selected period in comparison mode
                chartEnergyC: [], // this is energy expense for selected period in comparison mode
                chartEfficiencyC: [], // this is energy expense for 1㎥ for selected period in comparison mode
                chartEngineC: [] // this is engine work time for selected period in comparison mode
            },
            2:  {
                day: { // this is table data for last day
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                week: { // this is table data for last week
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                month: { // this is table data for last month
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                year: { // this is table data for last year
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                totalWater: '0', // this is total water mining
                totalEnergy: '0', // this is total energy expense
                totalEfficiency: '0', // this is total(mean) energy expense for 1㎥
                lockStatus: "0", // this is lock status of well: 1 - opened, 0 - closed
                chartWaterI: [], // this is water mining for selected period in information mode
                chartEnergyI: [], // this is energy expense for selected period in information mode
                chartEfficiencyI: [], // this is energy expense for 1㎥ for selected period in information mode
                chartEngineI: [], // this is engine work time for selected period in information mode
                chartWaterC: [], // this is water mining for selected period in comparison mode
                chartEnergyC: [], // this is energy expense for selected period in comparison mode
                chartEfficiencyC: [], // this is energy expense for 1㎥ for selected period in comparison mode
                chartEngineC: [] // this is engine work time for selected period in comparison mode
            },
            3:  {
                day: { // this is table data for last day
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                week: { // this is table data for last week
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                month: { // this is table data for last month
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                year: { // this is table data for last year
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                totalWater: '0', // this is total water mining
                totalEnergy: '0', // this is total energy expense
                totalEfficiency: '0', // this is total(mean) energy expense for 1㎥
                lockStatus: "0", // this is lock status of well: 1 - opened, 0 - closed
                chartWaterI: [], // this is water mining for selected period in information mode
                chartEnergyI: [], // this is energy expense for selected period in information mode
                chartEfficiencyI: [], // this is energy expense for 1㎥ for selected period in information mode
                chartEngineI: [], // this is engine work time for selected period in information mode
                chartWaterC: [], // this is water mining for selected period in comparison mode
                chartEnergyC: [], // this is energy expense for selected period in comparison mode
                chartEfficiencyC: [], // this is energy expense for 1㎥ for selected period in comparison mode
                chartEngineC: [] // this is engine work time for selected period in comparison mode
            },
            4: false,
            5: {
                day: { // this is table data for last day
                    water: 1,
                    energy: 1,
                    efficiency: 1
                },
                week: { // this is table data for last week
                    water: 2,
                    energy: 2,
                    efficiency: 2
                },
                month: { // this is table data for last month
                    water: 3,
                    energy: 3,
                    efficiency: 3
                },
                year: { // this is table data for last year
                    water: 4,
                    energy: 4,
                    efficiency: 4
                },
                totalWater: '0', // this is total water mining
                totalEnergy: '0', // this is total energy expense
                totalEfficiency: '0', // this is total(mean) energy expense for 1㎥
                lockStatus: "0", // this is lock status of well: 1 - opened, 0 - closed
                chartWaterI: [], // this is water mining for selected period in information mode
                chartEnergyI: [], // this is energy expense for selected period in information mode
                chartEfficiencyI: [], // this is energy expense for 1㎥ for selected period in information mode
                chartEngineI: [], // this is engine work time for selected period in information mode
                chartWaterC: [], // this is water mining for selected period in comparison mode
                chartEnergyC: [], // this is energy expense for selected period in comparison mode
                chartEfficiencyC: [], // this is energy expense for 1㎥ for selected period in comparison mode
                chartEngineC: [] // this is engine work time for selected period in comparison mode
            },
            6: false,
            7: false,
            8: false,
            9: false,
            10:  {
                day: { // this is table data for last day
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                week: { // this is table data for last week
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                month: { // this is table data for last month
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                year: { // this is table data for last year
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                totalWater: '0', // this is total water mining
                totalEnergy: '0', // this is total energy expense
                totalEfficiency: '0', // this is total(mean) energy expense for 1㎥
                lockStatus: "0", // this is lock status of well: 1 - opened, 0 - closed
                chartWaterI: [], // this is water mining for selected period in information mode
                chartEnergyI: [], // this is energy expense for selected period in information mode
                chartEfficiencyI: [], // this is energy expense for 1㎥ for selected period in information mode
                chartEngineI: [], // this is engine work time for selected period in information mode
                chartWaterC: [], // this is water mining for selected period in comparison mode
                chartEnergyC: [], // this is energy expense for selected period in comparison mode
                chartEfficiencyC: [], // this is energy expense for 1㎥ for selected period in comparison mode
                chartEngineC: [] // this is engine work time for selected period in comparison mode
            },
	    11: false,
	    12: 
 {
                day: { // this is table data for last day
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                week: { // this is table data for last week
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                month: { // this is table data for last month
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                year: { // this is table data for last year
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                totalWater: '0', // this is total water mining
                totalEnergy: '0', // this is total energy expense
                totalEfficiency: '0', // this is total(mean) energy expense for 1㎥
                lockStatus: "0", // this is lock status of well: 1 - opened, 0 - closed
                chartWaterI: [], // this is water mining for selected period in information mode
                chartEnergyI: [], // this is energy expense for selected period in information mode
                chartEfficiencyI: [], // this is energy expense for 1㎥ for selected period in information mode
                chartEngineI: [], // this is engine work time for selected period in information mode
                chartWaterC: [], // this is water mining for selected period in comparison mode
                chartEnergyC: [], // this is energy expense for selected period in comparison mode
                chartEfficiencyC: [], // this is energy expense for 1㎥ for selected period in comparison mode
                chartEngineC: [] // this is engine work time for selected period in comparison mode
            },
	    13: false
    	  
	}    
    };

    // ----- redraw information for map and sidebar
    function drawInfo() {
        for(let n in wellData.wells) {
            if(wellData.wells[n] === false) {
                $('.well[data-id="' + n + '"], .map-point[data-id="' + n + '"]').addClass('disabled');
                $('.well[data-id="' + n + '"] .well-info, .map-point[data-id="' + n + '"] .mpi-info').html('<li><i class="icon-water-drop"></i>—//— <span>м<sup>3</sup></span></li><li><i class="icon-lighting"></i>—//— <span>кВт</span></li><li><i class="well-efficiency-icon icon-chart"></i>—//— <span>кВт за м<sup>3</sup></span></li><li><i class="well-lock"></i>—//—</li>');
            }
            else {
                $('.well[data-id="' + n + '"] .well-info').html('<li><i class="icon-water-drop"></i>' + wellData.wells[n].day.water + ' <span>м<sup>3</sup></span></li><li><i class="icon-lighting"></i>' + wellData.wells[n].day.energy + ' <span>кВт</span></li><li><i class="well-efficiency-icon icon-chart ef' + (wellData.wells[n].totalEfficiency <= 1 ? ' ef-high' : '') + (wellData.wells[n].totalEfficiency > 1.4 ? ' ef-low' : '') + '"></i>' + wellData.wells[n].day.efficiency + '<span>кВт за м<sup>3</sup></span></li><li><i class="well-lock" data-lock="' + wellData.wells[n].lockStatus + '"></i><strong class="well-lock-status">Зачинено</strong><strong class="well-lock-status">Відчинено</strong></li>');
                $('.map-point[data-id="' + n + '"] .mpi-info').html('<li><i class="icon-water-drop"></i>' + wellData.wells[n].day.water + ' <span>м<sup>3</sup></span></li><li><i class="icon-lighting"></i>' + wellData.wells[n].day.energy + ' <span>кВт</span></li><li><i class="well-efficiency-icon icon-chart ef' + (wellData.wells[n].day.efficiency <= 1 ? ' ef-high' : '') + (wellData.wells[n].day.efficiency > 1.4 ? ' ef-low' : '') + '"></i>' + wellData.wells[n].day.efficiency + ' <span>кВт за м<sup>3</sup></span></li>');
            }
        }
    }

    // ----- write graphs total information
    function graphsInfo() {

        $('.total-period-info[data-id="1"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> видобуто води</div><div>' + computeTotal(wellData.wells[$('.well.is-info').attr('data-id')].chartWaterI) + ' <span>м<sup>3</sup></span></div>');

        $('.total-period-info[data-id="2"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> витрачено електроенергії</div><div>' + computeTotal(wellData.wells[$('.well.is-info').attr('data-id')].chartEnergyI) + ' <span>кВт</span></div>');

        $('.total-period-info[data-id="3"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> середня витрата електроенергії на видобуток 1 м<sup>3</sup> води</div><div>' + computeMiddle(wellData.wells[$('.well.is-info').attr('data-id')].chartEfficiencyI) + ' <span>кВт</span></div>');

        $('.total-period-info[data-id="4"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1] + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0])) + '</strong> двигун працював</div><div>' + computeTotal(wellData.wells[$('.well.is-info').attr('data-id')].chartEngineI) + ' <span>год.</span></div>');

    }

    // ----- first graphs drawing
    function drawGraphs() {

        // ----- init single chart for water
        infoChartWater = new Chart($('.info-chart-water'), {
            type: 'line',
            data: {
                labels: wellData.chartDates.chartInfoDates,
                datasets: [{
                    data: wellData.wells[1].chartWaterI,
                    backgroundColor: 'rgba(23, 146, 232, 0.1)',
                    borderColor: '#1792e8',
                    pointBackgroundColor: 'rgba(0,0,0,0)',
                    pointBorderColor: '#1792e8',
                    pointHitRadius: 10,
                    borderWidth: 1
                }]
            },
            options: chartInfoOptions
        });

        // ----- init single chart for energy
        infoChartEnergy = new Chart($('.info-chart-energy'), {
            type: 'line',
            data: {
                labels: wellData.chartDates.chartInfoDates,
                datasets: [{
                    data: wellData.wells[1].chartEnergyI,
                    backgroundColor: 'rgba(23, 146, 232, 0.1)',
                    borderColor: '#1792e8',
                    pointBackgroundColor: 'rgba(0,0,0,0)',
                    pointBorderColor: '#1792e8',
                    pointHitRadius: 10,
                    borderWidth: 1
                }]
            },
            options: chartInfoOptions
        });

        // ----- init single chart for comparison
        infoChartCompare = new Chart($('.info-chart-compare'), {
            type: 'line',
            data: {
                labels: wellData.chartDates.chartInfoDates,
                datasets: [{
                    data: wellData.wells[1].chartEfficiencyI,
                    backgroundColor: 'rgba(23, 146, 232, 0.1)',
                    borderColor: '#1792e8',
                    pointBackgroundColor: 'rgba(0,0,0,0)',
                    pointBorderColor: '#1792e8',
                    pointHitRadius: 10,
                    borderWidth: 1
                }]
            },
            options: chartInfoOptions
        });

        // ----- init single chart for engine work hours
        infoChartEngine = new Chart($('.info-chart-engine'), {
            type: 'bar',
            data: {
                labels: wellData.chartDates.chartInfoDates,
                datasets: [{
                    data: wellData.wells[1].chartEngineI,
                    backgroundColor: 'rgba(23, 146, 232, 0.1)',
                    borderColor: '#1792e8',
                    pointBackgroundColor: 'rgba(0,0,0,0)',
                    pointBorderColor: '#1792e8',
                    pointHitRadius: 10,
                    borderWidth: 1
                }]
            },
            options: chartInfoOptions
        });
        infoChartEngine.options.scales.xAxes[0].offset = true;
        infoChartEngine.options.scales.yAxes[0].ticks.max = 24;
        infoChartEngine.update();

        // ----- set data for comparison charts
        $('.well.is-compare').each(function () {

            compareChartWaterData.push({
                label: 'Свердловина №' + $(this).attr('data-id'),
                borderColor: $(this).find('.well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: wellData.wells[$(this).attr('data-id')].chartWaterC
            });

            compareChartEnergyData.push({
                label: 'Свердловина №' + $(this).attr('data-id'),
                borderColor: $(this).find('.well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: wellData.wells[$(this).attr('data-id')].chartEnergyC
            });

            compareChartCompareData.push({
                label: 'Свердловина №' + $(this).attr('data-id'),
                borderColor: $(this).find('.well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: wellData.wells[$(this).attr('data-id')].chartEfficiencyC
            });

            compareChartEngineData.push({
                label: 'Свердловина №' + $(this).attr('data-id'),
                borderColor: $(this).find('.well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: $(this).find('.well-head').attr('data-bg'),
                data: wellData.wells[$(this).attr('data-id')].chartEngineC
            });

        });

        // ----- init compare chart for water
        compareChartWater = new Chart($('.compare-chart-water'), {
            type: 'line',
            data: {
                labels: wellData.chartDates.chartCompareDates,
                datasets: compareChartWaterData
            },
            options: chartCompareOptions
        });

        // ----- init compare chart for energy
        compareChartEnergy = new Chart($('.compare-chart-energy'), {
            type: 'line',
            data: {
                labels: wellData.chartDates.chartCompareDates,
                datasets: compareChartEnergyData
            },
            options: chartCompareOptions
        });

        // ----- init compare chart for comparison
        compareChartCompare = new Chart($('.compare-chart-compare'), {
            type: 'line',
            data: {
                labels: wellData.chartDates.chartCompareDates,
                datasets: compareChartCompareData
            },
            options: chartCompareOptions
        });

        // ----- init compare chart for engine work hours
        compareChartEngine = new Chart($('.compare-chart-engine'), {
            type: 'bar',
            data: {
                labels: wellData.chartDates.chartCompareDates,
                datasets: compareChartEngineData
            },
            options: chartCompareOptions
        });
        compareChartEngine.options.scales.xAxes[0].offset = true;
        compareChartEngine.options.scales.yAxes[0].ticks.max = 24;
        compareChartEngine.update();

        graphsInfo();

    }

    // ----- redrawing of graphs on time changed or other well selected
    function redrawGraphs() {
        let infoWell = $('.well.is-info').attr('data-id');

wellData.chartDates.chartInfoDates = top.xtimes[infoWell];
console.log(">>",infoWell,top.xtimes);

        infoChartWater.data.labels = infoChartEnergy.data.labels = infoChartCompare.data.labels = infoChartEngine.data.labels = wellData.chartDates.chartInfoDates;

        infoChartWater.data.datasets.forEach((dataset) => {
            dataset.data = wellData.wells[infoWell].chartWaterI;
        });

        infoChartEnergy.data.datasets.forEach((dataset) => {
            dataset.data = wellData.wells[infoWell].chartEnergyI;
        });

        infoChartCompare.data.datasets.forEach((dataset) => {
            dataset.data = wellData.wells[infoWell].chartEfficiencyI;
        });

        infoChartEngine.data.datasets.forEach((dataset) => {
            dataset.data = wellData.wells[infoWell].chartEngineI;
        });

        infoChartWater.update();
        infoChartEnergy.update();
        infoChartCompare.update();
        infoChartEngine.update();

        compareChartWater.data.labels = compareChartEnergy.data.labels = compareChartCompare.data.labels = compareChartEngine.data.labels = wellData.chartDates.chartCompareDates;

        compareChartWaterData.length = compareChartEnergyData.length = compareChartCompareData.length = compareChartEngineData.length = 0;

        // ----- set data for comparison charts
        $('.well.is-compare').each(function () {

            compareChartWaterData.push({
                label: 'Свердловина №' + $(this).attr('data-id'),
                borderColor: $(this).find('.well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: wellData.wells[$(this).attr('data-id')].chartWaterC
            });

            compareChartEnergyData.push({
                label: 'Свердловина №' + $(this).attr('data-id'),
                borderColor: $(this).find('.well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: wellData.wells[$(this).attr('data-id')].chartEnergyC
            });

            compareChartCompareData.push({
                label: 'Свердловина №' + $(this).attr('data-id'),
                borderColor: $(this).find('.well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: wellData.wells[$(this).attr('data-id')].chartEfficiencyC
            });

            compareChartEngineData.push({
                label: 'Свердловина №' + $(this).attr('data-id'),
                borderColor: $(this).find('.well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: wellData.wells[$(this).attr('data-id')].chartEngineC
            });

        });

        compareChartWater.data.datasets = compareChartWaterData;

        compareChartEnergy.data.datasets = compareChartEnergyData;

        compareChartCompare.data.datasets = compareChartCompareData;

        compareChartEngine.data.datasets = compareChartEngineData;

        compareChartWater.update();
        compareChartEnergy.update();
        compareChartCompare.update();
        compareChartEngine.update();

        graphsInfo();

    }

    // ----- this is requests from period selection
    function drawTables() {

$('#table-day tbody > tr').remove();
$('#table-summary tbody >tr').remove();

    for(let n in wellData.wells) {
        if(wellData.wells[n] !== false) {
            $('#table-day').append('<tr><td>№ ' + (n < 10 ? 0 + n : n) + '</td><td>' + wellData.wells[n].day.water + '</td><td>' + wellData.wells[n].day.energy + '</td><td class="ef' + (wellData.wells[n].day.efficiency <= 1 ? ' ef-high' : '') + (wellData.wells[n].day.efficiency > 1.4 ? ' ef-low' : '') + (wellData.wells[n].day.efficiency === 0 ? ' ef-no' : '') + '">' + wellData.wells[n].day.efficiency + '</td></tr>');
            $('#table-summary').append('<tr><td>№ ' + n + '</td><td>' + wellData.wells[n].week.water + '</td><td>' + wellData.wells[n].week.energy + '</td><td class="ef' + (wellData.wells[n].week.efficiency <= 1 ? ' ef-high' : '') + (wellData.wells[n].week.efficiency > 1.4 ? ' ef-low' : '') + (wellData.wells[n].week.efficiency === 0 ? ' ef-no' : '') + '">' + wellData.wells[n].week.efficiency + '</td><td>' + wellData.wells[n].month.water + '</td><td>' + wellData.wells[n].month.energy + '</td><td class="ef' + (wellData.wells[n].month.efficiency <= 1 ? ' ef-high' : '') + (wellData.wells[n].month.efficiency > 1.4 ? ' ef-low' : '') + (wellData.wells[n].month.efficiency === 0 ? ' ef-no' : '') + '">' + wellData.wells[n].month.efficiency + '</td><td>' + wellData.wells[n].year.water + '</td><td>' + wellData.wells[n].year.energy + '</td><td class="ef' + (wellData.wells[n].year.efficiency <= 1 ? ' ef-high' : '') + (wellData.wells[n].year.efficiency > 1.4 ? ' ef-low' : '') + (wellData.wells[n].year.efficiency === 0 ? ' ef-no' : '') + '">' + wellData.wells[n].year.efficiency + '</td></tr>');
        }
    }

    $(".table").on('mouseenter', 'td', function(){
        $(this).closest('.table').find('tbody tr td:nth-of-type(' + ($(this).index() + 1) + ')').addClass('highlighted');
        $(this).siblings('td').addClass('highlighted');
    }).on('mouseleave', 'td', function(){
        $('.table').find('tbody tr td').removeClass('highlighted');
    });

    // ----- day table add class for sorting
    $('#table-day th').click(function () {
        if($(this).hasClass('asc')) {
            $(this).removeClass('asc').addClass('desc');
        }
        else if($(this).hasClass('desc')) {
            $(this).removeClass('desc').addClass('asc');
        }
        else {
            $('#table-day th').removeClass('asc desc');
            $(this).addClass('asc');
        }
    });

    // ----- day table sorting
    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
    const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
    document.querySelectorAll('#table-day th').forEach(th => th.addEventListener('click', (() => {
        const table = $(th).closest('table').find('tbody')[0];
        Array.from(table.querySelectorAll('tr:nth-child(n+1)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr));
    })));


    }

    function dataRequest() {

    if (!chartRequest[2]) {chartRequest[2] = chartRequest[1];chartRequest[1] = chartRequest[1]-86400*1000;}
//    console.log(chartRequest);
         $('#page-loader').stop().fadeIn();
//    console.log(":::::::::::::::",chartRequest,chartRequest[1]);
    getIt(1,chartRequest[1],chartRequest[2],5000);
	getIt(2,chartRequest[1],chartRequest[2],5000);
	getIt(5,chartRequest[1],chartRequest[2],5000);
//    drawInfo();
//    drawGraphs();
//    redrawGraphs();
//	console.log("realy?");
    }

    // ----- draw all information at first time
    drawInfo();
    drawGraphs();
//    drawTables();
    // ----- draw tables

    // ----- tables highlight cells

    // ----- hide page preloader
    $('#page-loader').stop().fadeOut();

    // ----- toggle views
    $('.head-select ul li').click(function () {
        $('.head-select ul li').removeClass('active');
        _body.removeClass('head-select-tables head-select-map head-select-info head-select-compare').addClass($(this).attr('class'));
        $(this).addClass('active');
        $('.tables, .map, .graphs, .comparison').hide();
        $(this).hasClass('head-select-tables') && $('.tables').show();
        $(this).hasClass('head-select-map') && $('.map').show();
        $(this).hasClass('head-select-info') && $('.graphs').show();
        $(this).hasClass('head-select-compare') && $('.comparison').show();
        $('.head-select-selected span').text($(this).text());
        $('.head-select').removeClass('active');
    });

    // ----- show/hide header toggle on mobile
    $('.head-select-selected').click(function () {
        $('.head-select').toggleClass('active');
    });

    // ----- show/hide mobile sidebar
    $('.sidebar-btn').click(function () {
        $('.sidebar').toggleClass('active');
    });

    // ----- hide mobile sidebar
    $('.sidebar-close').click(function () {
        $('.sidebar').removeClass('active');
    });

    // ----- toggle well information
    $('.well-btn').click(function () {
        $(this).closest('.well').toggleClass('opened').find('.well-info').stop().slideToggle(300);
    });

    // ----- change viewmodes for graphs and comparison
    $('.viewmode li').click(function () {
        if(_body.hasClass('head-select-info')) {
            if($(this).hasClass('listview')) {
                _body.addClass('listview-info');
            }
            else {
                _body.removeClass('listview-info');
            }
        }
        else {
            if($(this).hasClass('listview')) {
                _body.addClass('listview-compare');
            }
            else {
                _body.removeClass('listview-compare');
            }
        }
        $(this).addClass('active').siblings('li').removeClass('active');
    });

    // ----- click on well title in different modes
    $('.well-head h4').click(function () {

        if($(this).closest('.head-select-info').length) {

            $('.well').removeClass('is-info');
            $(this).closest('.well').addClass('is-info');

            redrawGraphs();

        }
        if($(this).closest('.head-select-compare').length) {

            $(this).siblings('.checkbox').find('input').attr('checked', !$(this).siblings('.checkbox').find('input').attr('checked')).closest('.well').toggleClass('is-compare');

            redrawGraphs();

        }
        if($(this).closest('.head-select-map').length) {
            $(this).closest('.well').toggleClass('tooltip-shown');
            $('.map-point[data-id="' + $(this).closest('.well').attr('data-id') + '"]').toggleClass('tooltip-shown');
        }
        if($(this).closest('.head-select-tables').length) {
            $(this).siblings('.well-btn').click();
        }

    });

    // ----- show period select dropdown
    $('.period-selected').click(function () {
        $(this).parent().toggleClass('active').find('.period-select > button').removeClass('active');
        $(this).parent().find('.period-select').find('[data-period="' + $(this).attr('data-period') + '"]').addClass('active');
    });

    // ----- hide period select dropdown on cancel click
    $('.period-cancel').click(function () {
        $(this).closest('.period-select-wrap').removeClass('active');
    });

    // ----- toggle period select buttons activity
    $('.period-select > button').click(function () {
        $(this).siblings('button').removeClass('active');
        $(this).addClass('active');
    });

    // ----- submit period selection
    $('.period-submit').click(function () {
        if($(this).parent().siblings('.active').attr('data-period') !== $(this).closest('.period-select-wrap').find('.period-selected').attr('data-period')) {
            $(this).closest('.period-select-wrap').find('.period-selected').attr('data-period', $(this).parent().siblings('.active').attr('data-period')).find('span').text($(this).parent().siblings('.active').text());


            let dataPeriod = parseInt($(this).closest('.period-select-wrap').find('.period-selected').attr('data-period'));

            requestCommon();

            if(dataPeriod === 1) {
                chartRequest.push(+ new Date());
            }
            if(dataPeriod === 2) {
                chartRequest.push(+ new Date(Date.now() - (24*60*60*1000)));
            }
            if(dataPeriod === 3) {
                chartRequest.push(+ new Date(Date.now() - (6*24*60*60*1000)));
                chartRequest.push(+ new Date());
            }
            if(dataPeriod === 4) {
                chartRequest.push(+ new Date(Date.now() - (29*24*60*60*1000)));
                chartRequest.push(+ new Date());
            }
            if(dataPeriod === 5) {
                if(new Date().getDate() === 1) {
                    chartRequest.push(+ new Date());
                }
                else {
                    chartRequest.push(+ new Date(Date.now() - ((new Date().getDate() - 1)*24*60*60*1000)));
                    chartRequest.push(+ new Date());
                }
            }
            if(dataPeriod === 6) {
                if((new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).toString() === (new Date(new Date().getFullYear(), 0, 1)).toString()) {
                    chartRequest.push(+ new Date());
                }
                else {
                    chartRequest.push(+ new Date(new Date().getFullYear(), 0, 1));
                    chartRequest.push(+ new Date());
                }
            }

            dataRequest();

        }
        $(this).closest('.period-select-wrap').removeClass('active');
    });

    _body.click(function (e) {

        // ----- hide period select dropdown on click non-dropdown elements
        if(!($(e.target).closest('.period-select-wrap').length || $(e.target).closest('.datepickers-container').length)) {
            $('.period-select-wrap').removeClass('active');
        }

        // ----- hide header dropdown on click non-dropdown elements
        if(!$(e.target).closest('.head-select').length) {
            $('.head-select').removeClass('active');
        }

        // ----- hide mobile sidebar on click non-sidebar elements
        if(!($(e.target).closest('.sidebar').length || $(e.target).closest('.sidebar-btn').length)) {
            $('.sidebar').removeClass('active');
        }

    });

    // ----- add ukrainian language in datepicker
    $.fn.datepicker.language['ua'] =  {
        days: ['Неділя','Понеділок','Вівторок','Середа','Четвер','П`ятница','Субота'],
        daysShort: ['Нед','Пон','Вів','Сер','Чет','П`ят','Суб'],
        daysMin: ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'],
        months: ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'],
        monthsShort: ['Січ','Лют','Бер','Квіт','Трав','Чер','Лип','Сер','Вер','Жов','Лист','Груд'],
        today: 'Сьогодні',
        clear: 'Очистити'
    };

    // ----- init datepicker for single mode graphs
    let firstShow1 = 1;
    let myDatepicker1 = $('.period-calendar-input-1').datepicker({
        range: true,
        language: 'ua',
        position: 'bottom right',
        multipleDatesSeparator: ' - ',
        onShow: function (inst, animationCompleted) {
            if(firstShow1) {
                firstShow1 = 0;
                inst.$datepicker.append($('<div class="submit-block-1 clearfix"><button type="button" class="period-submit-1">Застосувати</button><button type="button" class="period-cancel-1">Закрити</button></div>'));
            }
        }
    }).data('datepicker');

    // ----- show datepicker for single mode graphs
    $('.period-calendar-btn-1').click(function () {
        $(this).closest('.period-select-wrap').removeClass('active');
        myDatepicker1.clear();
        myDatepicker1.view = 'days';
        myDatepicker1.date = new Date();
        myDatepicker1.show();
    });

    // ----- submit datepicker for single mode graphs selection
    _body.on('click','.period-submit-1', function () {
        if(myDatepicker1.selectedDates.length === 2) {
            $('.period-calendar-input-1').parent().siblings('.period-selected').attr('data-period', 7).find('span').text($('.period-calendar-input-1').val());

            requestCommon();

            chartRequest.push(+ myDatepicker1.selectedDates[0]);
            chartRequest.push(+ myDatepicker1.selectedDates[1]);

            dataRequest();

        }
        else if(myDatepicker1.selectedDates.length === 1) {

            $('.period-calendar-input-1').parent().siblings('.period-selected').attr('data-period', 7).find('span').text($('.period-calendar-input-1').val());

            requestCommon();

            chartRequest.push(+ myDatepicker1.selectedDates[0]);

            dataRequest();

        }
        myDatepicker1.hide();
    }).on('click','.period-cancel-1', function () {
        myDatepicker1.hide();
    });

    // ----- init datepicker for compare mode graphs
    let firstShow2 = 1;
    let myDatepicker2 = $('.period-calendar-input-2').datepicker({
        range: true,
        language: 'ua',
        position: 'bottom right',
        multipleDatesSeparator: ' - ',
        onShow: function (inst, animationCompleted) {
            if(firstShow2) {
                firstShow2 = 0;
                inst.$datepicker.append($('<div class="submit-block-2 clearfix"><button type="button" class="period-submit-2">Застосувати</button><button type="button" class="period-cancel-2">Закрити</button></div>'));
            }
        }
    }).data('datepicker');

    // ----- show datepicker for compare mode graphs
    $('.period-calendar-btn-2').click(function () {
        $(this).closest('.period-select-wrap').removeClass('active');
        myDatepicker2.clear();
        myDatepicker2.view = 'days';
        myDatepicker2.date = new Date();
        myDatepicker2.show();
    });

    // ----- submit datepicker for compare mode graphs selection
    _body.on('click','.period-submit-2', function () {
        if(myDatepicker2.selectedDates.length === 2) {
            $('.period-calendar-input-2').parent().siblings('.period-selected').attr('data-period', 7).find('span').text($('.period-calendar-input-2').val());

            requestCommon();

            chartRequest.push(+ myDatepicker1.selectedDates[0]);
            chartRequest.push(+ myDatepicker1.selectedDates[1]);

            dataRequest();

        }
        else if(myDatepicker2.selectedDates.length === 1) {
            $('.period-calendar-input-2').parent().siblings('.period-selected').attr('data-period', 7).find('span').text($('.period-calendar-input-2').val());

            requestCommon();

            chartRequest.push(+ myDatepicker1.selectedDates[0]);

            dataRequest();

        }
        myDatepicker2.hide();
    }).on('click','.period-cancel-2', function () {
        myDatepicker2.hide();
    });

    // ----- add/remove well information for compare charts mode
    $('.well-head .checkbox').click(function (e) {

        e.preventDefault();

        $(this).find('input').attr('checked', !$(this).find('input').attr('checked')).closest('.well').toggleClass('is-compare');

        redrawGraphs();

    });

    // ----- show/hide well info on map
    $('.map-point > img').click(function () {
        $(this).closest('.map-point').toggleClass('tooltip-shown');
        $('.well[data-id="' + $(this).parent().attr('data-id') + '"]').toggleClass('tooltip-shown');
    });

    // ----- hide well info on map on close click
    $('.map-point-inner-btn').click(function () {
        $(this).closest('.map-point').toggleClass('tooltip-shown');
        $('.well[data-id="' + $(this).closest('.map-point').attr('data-id') + '"]').toggleClass('tooltip-shown');
    });

    // ----- show/hide well info on map on well title hover
    $('.well-head h4').hover(function () {
        $('.map-point[data-id="' + $(this).closest('.well').attr('data-id') + '"]').addClass('tooltip-visible');
    }, function () {
        $('.map-point[data-id="' + $(this).closest('.well').attr('data-id') + '"]').removeClass('tooltip-visible');
    });

    // ----- print info tables
    $('.print-btn').click(function () {
        window.print();
    });

    // ----- common data for all requests
    function requestCommon() {
        chartRequest.length = 0;
        if(_body.hasClass('head-select-info')) {
            chartRequest.push('1');
        }
        else {
            chartRequest.push('2');
        }
    }

    // ----- convert timestamp to correct date format
    function setTimestampDate(timestamp) {

        let day = parseInt(new Date(timestamp).getDate());
        day < 10 ? day = '0' + day : '';
        let month = parseInt(new Date(timestamp).getMonth()) + 1;
        month < 10 ? month = '0' + month : '';

        return day + '.' + month + '.' + new Date(timestamp).getFullYear();

    }

    function computeTotal(el) {
        let total = 0;
        for(let i = 0; i < el.length; i++) {
      if (el[i])  total += el[i]*1;
        }
        return total.toFixed(2);
//	    return 0;
    }

    // ----- compute middle graph value
    function computeMiddle(el) {
        let total = 0; count = 0;
        for(let i = 0; i < el.length; i++) {
//		if (!el) continue;
            if ((el[i]) && (el[i]!= Infinity)  && !isNaN(el[i])) {total = total+parseInt(el[i]*100);count++;}
        }
    
    if (count && total) return (total/count/100).toFixed(2); else return 0;

//(total/count).toFixed(3); else return 0;
//	return total;
    }

});


$(window).resize(function () {

    $('.head-select').removeClass('active');
    $('.sidebar').removeClass('active');

});
