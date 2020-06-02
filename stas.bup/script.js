/**
 * Created by No Fear on 15.05.2020.
 * E-mail: g0th1c097@gmail.com
 */


xrange = 0;
 
$(document).ready(function () {





const xws = new WebSocket('ws://dutch.lora-wan.net:8002/');

base = {   // Стартовые значения счетчиков (water, kw)
	    1:[7070500,7200],
	    2:[3139600,-1400],
	    5:[13474700,171600]

}

pumps = {	// Lora devEui	для счетчиков
	    1:"323033375D387201",
	    2:"3230333770386801",
	    5:"373130386A397003"
}



function init() {xws.send(JSON.stringify({login:'stas',password:'josperado',cmd:'auth_req'}));}
function getId(a) {for (i in pumps) if (pumps[i]==a) return i; return 0;}

xws.onopen = function() {init();};
xws.onmessage = function(e) {
  try{
    json=JSON.parse(e.data);
    getData(json);
    }
     catch(err) {console.log(err);}
};

function getNum(prs) { // Распаковывает значения из полученных данных
    len = prs.length;
    tm = parseInt(prs.substring(12,14)+prs.substring(10,12)+prs.substring(8,10)+prs.substring(6,8),16);
    xtm = new Date(tm*1000); tm = xtm.getTime();
    l1 = parseInt(prs.substring(len-16,len-18)+prs.substring(len-18,len-20)+prs.substring(len-20,len-22)+prs.substring(len-22,len-24),16)/100;
    p1 = parseInt(prs.substring(len-24,len-26)+prs.substring(len-26,len-28)+prs.substring(len-28,len-30)+prs.substring(len-30,len-32),16)/600;
    return {tm,l1,p1}; // Время, вода, электричество
}



function getData(data) {  // Обрабатывает ответы от сервера.
    switch(data.cmd) {
    case 'auth_resp':	
    console.log("Token: ",data.token);
    getIt(1);
    getIt(2);
    getIt(5);
    break;
    case 'get_data_resp':

//    console.log("-----",data);
	xout = JSON.stringify(data);
	xid = getId(data.devEui);

	if (data.data_list.length==0) {
	    console.log('NOTHING',chartRequest);

	wellData.chartDates.chartInfoDates = chartRequest.slice(1);
	wellData.chartDates.chartCompareDates = chartRequest;

//	    alert("Data empty");
          redrawGraphs();
								// Нет данных. Ничего не делаем, добавить отображение что НЕТ.
          $('#page-loader').stop().fadeOut();
	    return;
	}

    xx = getNum(data.data_list[0].data); //tm - time, l1 - water, p1 - power

	wellData.wells[xid].totalWater = Math.round((xx.l1+(base[xid][0])/100)*100)/100;
	wellData.wells[xid].totalEnergy = Math.round((xx.p1+(base[xid][1])/600)*100)/100;
	wellData.wells[xid].totalEfficiency =[Math.round((xx.p1/xx.l1)*100)/100,1];

	
	times = Array(); n1=Array(); n2 = Array(); n3 = Array();

	intr = 0;
	if (data.date_from) intr = data.date_from-data.date_to;
		
//	if (intr>86400) console.log('ok');
	console.log(xrange,intr,"----------------------------");

olddat=dat=oldday=day=inc=0;

	console.log("========================---------------------------=======================");
	console.log(xrange);


    for (i=1;i<data.data_list.length-1;i++) {

	yy = getNum(data.data_list[i].data);

	olddat = dat; oldday = day; xxtm = new Date(yy.tm); day = xxtm.getDay(); dat = yy;

//	console.log(xrange);

	
	if (xrange>2) {
    		if (!olddat) {start = yy; continue;}
		if (oldday!=day) {
		
		dat = new Date(olddat.tm); xnow = new Date();
		if (!olddat.tm || (olddat.tm<1000000000 || dat>xnow)) continue;


		times.push(olddat.tm);
		n1[inc] = (Math.round((start.l1-olddat.l1)*100)/100);
		n2[inc] = (Math.round((start.p1-olddat.p1)*100)/100);
		if (!n1[inc] || !n2[inc]) n3[inc]=0; else n3[inc] = n2[inc]/n1[inc];	
		inc++;
		} else continue;	

	} else {	

	times.push(yy.tm);
	n1[i-1] = (Math.round((xx.l1-yy.l1)*100)/100);
	n2[i-1] = (Math.round((xx.p1-yy.p1)*100)/100);

	xx = yy;

	n3[i-1] = n2[i-1]/n1[i-1];
	if (Number.isNaN(n3[i-1]) || isFinite(n3[i-1])) n3[i-1] = 0;
	}

   }

	console.log(times,n1,n2,n3);
//	console.log(times,n1);
	wellData.wells[xid].chartWaterI = n1;
	wellData.wells[xid].chartEnergyI = n2;
	wellData.wells[xid].chartEfficiencyI = n3;
	wellData.wells[xid].chartEngineI = n2;

	wellData.wells[xid].chartWaterC = n1;
	wellData.wells[xid].chartEnergyC = n2;
	wellData.wells[xid].chartEfficiencyC = n3;
	wellData.wells[xid].chartEngineC = n2;

//console.log("-===========================================================================");
//console.log(times);
	wellData.chartDates.chartInfoDates = times
	wellData.chartDates.chartCompareDates = times
	drawInfo();
        redrawGraphs();
        $('#page-loader').stop().fadeOut();

    break;    


    }

};


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
	console.log(JSON.stringify(tmp));	
    xws.send(JSON.stringify(tmp));
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
    let infoChartWater, infoChartEnergy, infoChartCompare, infoChartEngine, compareChartWater, compareChartEnergy, compareChartCompare, compareChartEngine, compareChartWaterData = [], compareChartEnergyData = [], compareChartCompareData = [], compareChartEngineData = [], wellData, chartRequest = [];

    // ----- remove chart legend
    Chart.defaults.global.legend.display = false;

    // ----- data for all wells


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



    wellData = {
        chartDates/*this is arrays with dates for info and compare modes*/: {
            chartInfoDates: [1586702022000, 1586961222000, 1587220422000, 1587393222000, 1587825222000, 1588343622000],// this is information charts dates
            chartCompareDates: [1586702022000, 1586961222000, 1587220422000, 1587393222000, 1587825222000, 1588343622000]// this is comparison charts dates
        },
        wells/*this is information for each well*/: {
	    1: {totalWater:0,totalEnergy:0,totalEfficiency:[0,1],lockStatus:0,chartWaterI:[0],chartEnergyI:[0],chartEfficiencyI:[0],chartEngineI:[0],chartWaterC:[0],chartEnergyC:[0],chartEfficiencyC:[0],chartEngineC:[0]},
	    2: {totalWater:0,totalEnergy:0,totalEfficiency:[0,1],lockStatus:0,chartWaterI:[0],chartEnergyI:[0],chartEfficiencyI:[0],chartEngineI:[0],chartWaterC:[0],chartEnergyC:[0],chartEfficiencyC:[0],chartEngineC:[0]},
            3: false,
            4: false,
	    5: {totalWater:0,totalEnergy:0,totalEfficiency:[0,1],lockStatus:0,chartWaterI:[0],chartEnergyI:[0],chartEfficiencyI:[0],chartEngineI:[0],chartWaterC:[0],chartEnergyC:[0],chartEfficiencyC:[0],chartEngineC:[0]},
            6: false,
            7: false,
            8: false,
            9: false,
            10: false,
            11: false,
            12: false,
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
            else {                $('.well[data-id="' + n + '"] .well-info, .map-point[data-id="' + n + '"] .mpi-info').html('<li><i class="icon-water-drop"></i>' + wellData.wells[n].totalWater + ' <span>м<sup>3</sup></span></li><li><i class="icon-lighting"></i>' + wellData.wells[n].totalEnergy + ' <span>кВт</span></li><li><i class="well-efficiency-icon icon-chart" data-efficiency="' + wellData.wells[n].totalEfficiency[1] + '"></i>' + wellData.wells[n].totalEfficiency[0] + ' <span>кВт за м<sup>3</sup></span></li><li><i class="well-lock" data-lock="' + wellData.wells[n].lockStatus + '"></i><strong class="well-lock-status">Зачинено</strong><strong class="well-lock-status">Відчинено</strong></li>');
            }
        }
    }

    // ----- write graphs total information
    function graphsInfo() {

        $('.total-period-info[data-id="1"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> видобуто води</div><div>' + computeTotal(wellData.wells[$('.well.is-info').attr('data-id')].chartWaterI) + ' <span>м<sup>3</sup></span></div>');

        $('.total-period-info[data-id="2"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> витрачено електроенергії</div><div>' + computeTotal(wellData.wells[$('.well.is-info').attr('data-id')].chartEnergyI) + ' <span>кВт</span></div>');

        $('.total-period-info[data-id="3"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> середня витрата електроенергії на видобуток 1 м<sup>3</sup> води</div><div>' + computeMiddle(wellData.wells[$('.well.is-info').attr('data-id')].chartEfficiencyI) + ' <span>кВт</span></div>');

        $('.total-period-info[data-id="4"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> двигун працював</div><div>' + computeTotal(wellData.wells[$('.well.is-info').attr('data-id')].chartEngineI) + ' <span>год.</span></div>');

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
    function dataRequest() {

	if (!chartRequest[2]) {chartRequest[2] = chartRequest[1];chartRequest[1] = chartRequest[1]-86400*1000;}
	console.log(chartRequest);
         $('#page-loader').stop().fadeIn();

	getIt(chartRequest[0],chartRequest[1],chartRequest[2],5000);
//	getIt(2,chartRequest[1],chartRequest[2],5000);
//	getIt(5,chartRequest[1],chartRequest[2],5000);
//    drawInfo();
//    drawGraphs();
//    redrawGraphs();
//	console.log("realy?");
        /**
         * when this request is going you will array named "chartRequest"
         * in this array you will get 2 or 3 elements - example ["1", 1589835600000, 1590699600000]: two elements - single date, three elements range dates
         * first element - is a view request: 1 - is for information charts, 2 - is for comparison charts
         * second element is requested date if 2 elements in array; and start date if 3 elements in array
         * third element is final date
         *
         * before request starts set next function
         * $('#page-loader').stop().fadeIn();
         *
         * after request ended rewrite "wellData" with new data and set following functions
         * redrawGraphs();
         * $('#page-loader').stop().fadeOut();
         */
	
    }

    // ----- draw all information at first time
    drawInfo();
    drawGraphs();

    // ----- hide page preloader
    $('#page-loader').stop().fadeOut();

    // ----- toggle views
    $('.head-select ul li').click(function () {
        $('.head-select ul li').removeClass('active');
        _body.removeClass('head-select-map head-select-info head-select-compare').addClass($(this).attr('class'));
        $(this).addClass('active');
        $('.map, .graphs, .comparison').hide();
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

	     xrange = dataPeriod;

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

    // ----- compute total graph value
    function computeTotal(el) {
        let total = 0;
        for(let i = 0; i < el.length; i++) {
	  if (el[i])  total += el[i];
        }
        return total.toFixed(1);
//	    return 0;
    }

    // ----- compute middle graph value
    function computeMiddle(el) {
        let total = 0; count = 0;
        for(let i = 0; i < el.length; i++) {
            if ((el[i])) {total += el[i];count++;}
        }
	if (total === Infinity || total === 0) return 0; else return (total/count).toFixed(3);
//(total/count).toFixed(3); else return 0;
//	return total;
    }

});

$(window).resize(function () {

    $('.head-select').removeClass('active');
    $('.sidebar').removeClass('active');

});


