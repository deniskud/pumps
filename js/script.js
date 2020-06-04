/**
 * Created by No Fear on 15.05.2020.
 * E-mail: g0th1c097@gmail.com
 */

$(document).ready(function () {

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
    wellData = {
        chartDates/*this is arrays with dates for info and compare modes*/: {
            chartInfoDates: [1586702022000, 1586961222000, 1587220422000, 1587393222000, 1587825222000, 1588343622000],// this is information charts dates
            chartCompareDates: [1586702022000, 1586961222000, 1587220422000, 1587393222000, 1587825222000, 1588343622000]// this is comparison charts dates
        },
        wells/*this is information for each well*/: {
            1/*this is the number of well - this numbers will not change*/: {
                day: { // this is table data for last day
                    water: 12,
                    energy: 11,
                    efficiency: 0.94
                },
                week: { // this is table data for last week
                    water: 114,
                    energy: 256,
                    efficiency: 1.33
                },
                month: { // this is table data for last month
                    water: 2145,
                    energy: 2365,
                    efficiency: 1.45
                },
                year: { // this is table data for last year
                    water: 12546,
                    energy: 15423,
                    efficiency: 1.5
                },
                totalWater: '25468', // this is total water mining
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
            },
            2: {
                day: {
                    water: 0,
                    energy: 0,
                    efficiency: 0
                },
                week: {
                    water: 118,
                    energy: 286,
                    efficiency: 1.83
                },
                month: {
                    water: 3254,
                    energy: 4875,
                    efficiency: 1.05
                },
                year: {
                    water: 25463,
                    energy: 12354,
                    efficiency: 0.53
                },
                totalWater: '21468',
                totalEnergy: '140896',
                totalEfficiency: ['1.558', '2'],
                lockStatus: "1",
                chartWaterI: [33.618, 22.956, 49.487, 55.236, 12.584, 32.824],
                chartEnergyI: [28.618, 19.956, 5.487, 18.236, 24.584, 15.824],
                chartEfficiencyI: [1.618, 2.956, 1.487, 2.836, 1.584, 2.824],
                chartEngineI: [14.618, 12.956, 15.487, 3.236, 4.584, 21.824],
                chartWaterC: [33.618, 22.956, 49.487, 55.236, 12.584, 32.824],
                chartEnergyC: [28.618, 19.956, 5.487, 18.236, 24.584, 15.824],
                chartEfficiencyC: [1.618, 2.956, 1.487, 2.836, 1.584, 2.824],
                chartEngineC: [14.618, 12.956, 15.487, 3.236, 4.584, 21.824]
            },
            3: {
                day: {
                    water: 25,
                    energy: 23,
                    efficiency: 1.41
                },
                week: {
                    water: 254,
                    energy: 145,
                    efficiency: 1.72
                },
                month: {
                    water: 1254,
                    energy: 4875,
                    efficiency: 3.21
                },
                year: {
                    water: 15634,
                    energy: 21456,
                    efficiency: 0.74
                },
                totalWater: '2468',
                totalEnergy: '14896',
                totalEfficiency: ['1.358', '3'],
                lockStatus: "0",
                chartWaterI: [23.618, 45.956, 12.487, 15.236, 29.584, 45.824],
                chartEnergyI: [15.618, 23.956, 14.487, 22.236, 42.584, 21.824],
                chartEfficiencyI: [2.318, 3.056, 1.687, 0.936, 2.084, 0.824],
                chartEngineI: [1.618, 20.956, 13.487, 13.236, 3.584, 17.824],
                chartWaterC: [23.618, 45.956, 12.487, 15.236, 29.584, 45.824],
                chartEnergyC: [15.618, 23.956, 14.487, 22.236, 42.584, 21.824],
                chartEfficiencyC: [2.318, 3.056, 1.687, 0.936, 2.084, 0.824],
                chartEngineC: [1.618, 20.956, 13.487, 13.236, 3.584, 17.824]
            },
            4: {
                day: {
                    water: 36,
                    energy: 45,
                    efficiency: 1.28
                },
                week: {
                    water: 458,
                    energy: 541,
                    efficiency: 1.02
                },
                month: {
                    water: 3621,
                    energy: 3587,
                    efficiency: 1.00
                },
                year: {
                    water: 26984,
                    energy: 28716,
                    efficiency: 1.55
                },
                totalWater: '12468',
                totalEnergy: '114896',
                totalEfficiency: ['1.158', '4'],
                lockStatus: "0",
                chartWaterI: [31.618, 21.956, 9.487, 15.236, 22.584, 42.824],
                chartEnergyI: [35.618, 1.956, 2.487, 18.236, 35.584, 1.824],
                chartEfficiencyI: [1.218, 2.256, 1.887, 2.336, 1.984, 2.024],
                chartEngineI: [13.618, 11.956, 1.487, 8.236, 15.584, 12.824],
                chartWaterC: [31.618, 21.956, 9.487, 15.236, 22.584, 42.824],
                chartEnergyC: [35.618, 1.956, 2.487, 18.236, 35.584, 1.824],
                chartEfficiencyC: [1.218, 2.256, 1.887, 2.336, 1.984, 2.024],
                chartEngineC: [13.618, 11.956, 1.487, 8.236, 15.584, 12.824]
            },
            5: {
                day: {
                    water: 15,
                    energy: 9,
                    efficiency: 1.63
                },
                week: {
                    water: 142,
                    energy: 265,
                    efficiency: 0.62
                },
                month: {
                    water: 2145,
                    energy: 2953,
                    efficiency: 2.01
                },
                year: {
                    water: 23654,
                    energy: 12985,
                    efficiency: 1.96
                },
                totalWater: '29468',
                totalEnergy: '200896',
                totalEfficiency: ['0.958', '5'],
                lockStatus: "0",
                chartWaterI: [43.618, 34.956, 59.487, 19.236, 41.584, 12.824],
                chartEnergyI: [26.618, 21.956, 41.487, 38.236, 52.584, 13.824],
                chartEfficiencyI: [0.918, 1.556, 1.187, 1.336, 2.284, 1.424],
                chartEngineI: [2.618, 7.956, 17.487, 18.236, 22.584, 4.824],
                chartWaterC: [43.618, 34.956, 59.487, 19.236, 41.584, 12.824],
                chartEnergyC: [26.618, 21.956, 41.487, 38.236, 52.584, 13.824],
                chartEfficiencyC: [0.918, 1.556, 1.187, 1.336, 2.284, 1.424],
                chartEngineC: [2.618, 7.956, 17.487, 18.236, 22.584, 4.824]
            },
            6: {
                day: {
                    water: 14,
                    energy: 20,
                    efficiency: 0.74
                },
                week: {
                    water: 384,
                    energy: 249,
                    efficiency: 1.08
                },
                month: {
                    water: 1782,
                    energy: 2056,
                    efficiency: 0.56
                },
                year: {
                    water: 26547,
                    energy: 30014,
                    efficiency: 1.34
                },
                totalWater: '468',
                totalEnergy: '896',
                totalEfficiency: ['0.758', '6'],
                lockStatus: "0",
                chartWaterI: [18.618, 54.956, 37.487, 41.236, 29.584, 46.824],
                chartEnergyI: [17.618, 42.956, 37.487, 14.236, 31.584, 24.824],
                chartEfficiencyI: [0.518, 0.756, 0.487, 0.936, 0.784, 1.324],
                chartEngineI: [12.618, 14.956, 16.487, 6.236, 14.584, 23.824],
                chartWaterC: [18.618, 54.956, 37.487, 41.236, 29.584, 46.824],
                chartEnergyC: [17.618, 42.956, 37.487, 14.236, 31.584, 24.824],
                chartEfficiencyC: [0.518, 0.756, 0.487, 0.936, 0.784, 1.324],
                chartEngineC: [12.618, 14.956, 16.487, 6.236, 14.584, 23.824]
            },
            7: {
                day: {
                    water: 32,
                    energy: 14,
                    efficiency: 1.76
                },
                week: {
                    water: 284,
                    energy: 341,
                    efficiency: 0.83
                },
                month: {
                    water: 1258,
                    energy: 1005,
                    efficiency: 1.65
                },
                year: {
                    water: 19453,
                    energy: 26931,
                    efficiency: 1.13
                },
                totalWater: '32468',
                totalEnergy: '320896',
                totalEfficiency: ['0.558', '7'],
                lockStatus: "0",
                chartWaterI: [25.618, 1.956, 34.487, 29.236, 57.584, 35.824],
                chartEnergyI: [12.618, 2.956, 43.487, 21.236, 40.584, 30.824],
                chartEfficiencyI: [1.518, 1.756, 1.487, 1.936, 1.784, 0.924],
                chartEngineI: [5.618, 7.956, 21.487, 17.236, 9.584, 3.824],
                chartWaterC: [25.618, 1.956, 34.487, 29.236, 57.584, 35.824],
                chartEnergyC: [12.618, 2.956, 43.487, 21.236, 40.584, 30.824],
                chartEfficiencyC: [1.518, 1.756, 1.487, 1.936, 1.784, 0.924],
                chartEngineC: [5.618, 7.956, 21.487, 17.236, 9.584, 3.824]
            },
            8: {
                day: {
                    water: 3,
                    energy: 4,
                    efficiency: 1.26
                },
                week: {
                    water: 48,
                    energy: 54,
                    efficiency: 1.23
                },
                month: {
                    water: 265,
                    energy: 387,
                    efficiency: 0.95
                },
                year: {
                    water: 1542,
                    energy: 2698,
                    efficiency: 0.83
                },
                totalWater: '3268',
                totalEnergy: '32896',
                totalEfficiency: ['0.358', '7'],
                lockStatus: "0",
                chartWaterI: [57.618, 13.956, 11.487, 40.236, 50.584, 30.824],
                chartEnergyI: [29.618, 22.956, 15.487, 34.236, 19.584, 39.824],
                chartEfficiencyI: [1.618, 1.156, 1.787, 1.036, 1.284, 0.724],
                chartEngineI: [21.618, 4.956, 17.487, 14.236, 19.584, 6.824],
                chartWaterC: [57.618, 13.956, 11.487, 40.236, 50.584, 30.824],
                chartEnergyC: [29.618, 22.956, 15.487, 34.236, 19.584, 39.824],
                chartEfficiencyC: [1.618, 1.156, 1.787, 1.036, 1.284, 0.724],
                chartEngineC: [21.618, 4.956, 17.487, 14.236, 19.584, 6.824]
            },
            9: {
                day: {
                    water: 26,
                    energy: 34,
                    efficiency: 1.96
                },
                week: {
                    water: 182,
                    energy: 200,
                    efficiency: 1.63
                },
                month: {
                    water: 3652,
                    energy: 2996,
                    efficiency: 0.71
                },
                year: {
                    water: 20011,
                    energy: 24631,
                    efficiency: 1.63
                },
                totalWater: '13268',
                totalEnergy: '132896',
                totalEfficiency: ['0.358', '7'],
                lockStatus: "0",
                chartWaterI: [27.618, 23.956, 14.487, 51.236, 36.584, 27.824],
                chartEnergyI: [31.618, 40.956, 24.487, 20.236, 41.584, 38.824],
                chartEfficiencyI: [0.618, 0.956, 1.187, 0.836, 0.584, 0.324],
                chartEngineI: [16.618, 17.956, 11.487, 5.236, 8.584, 9.824],
                chartWaterC: [27.618, 23.956, 14.487, 51.236, 36.584, 27.824],
                chartEnergyC: [31.618, 40.956, 24.487, 20.236, 41.584, 38.824],
                chartEfficiencyC: [0.618, 0.956, 1.187, 0.836, 0.584, 0.324],
                chartEngineC: [16.618, 17.956, 11.487, 5.236, 8.584, 9.824]
            },
            10: {
                day: {
                    water: 18,
                    energy: 25,
                    efficiency: 1.06
                },
                week: {
                    water: 256,
                    energy: 512,
                    efficiency: 0.50
                },
                month: {
                    water: 1415,
                    energy: 2413,
                    efficiency: 0.41
                },
                year: {
                    water: 17563,
                    energy: 19542,
                    efficiency: 1.38
                },
                totalWater: '33268',
                totalEnergy: '332896',
                totalEfficiency: ['0.358', '7'],
                lockStatus: "0",
                chartWaterI: [2.618, 3.956, 4.487, 1.236, 6.584, 7.824],
                chartEnergyI: [1.618, 2.956, 4.487, 2.236, 7.584, 9.824],
                chartEfficiencyI: [0.518, 0.856, 1.087, 2.436, 0.984, 0.824],
                chartEngineI: [0.618, 1.956, 2.487, 0.536, 0.984, 0.824],
                chartWaterC: [2.618, 3.956, 4.487, 1.236, 6.584, 7.824],
                chartEnergyC: [1.618, 2.956, 4.487, 2.236, 7.584, 9.824],
                chartEfficiencyC: [0.518, 0.856, 1.087, 2.436, 0.984, 0.824],
                chartEngineC: [0.618, 1.956, 2.487, 0.536, 0.984, 0.824]
            },
            11: false,
            12: false,
            13: {
                day: {
                    water: 21,
                    energy: 36,
                    efficiency: 0.76
                },
                week: {
                    water: 125,
                    energy: 174,
                    efficiency: 1.44
                },
                month: {
                    water: 3652,
                    energy: 4785,
                    efficiency: 2.41
                },
                year: {
                    water: 24736,
                    energy: 30100,
                    efficiency: 1.58
                },
                totalWater: '13268',
                totalEnergy: '142896',
                totalEfficiency: ['0.358', '7'],
                lockStatus: "0",
                chartWaterI: [7.618, 41.956, 34.487, 37.236, 42.584, 25.824],
                chartEnergyI: [12.618, 45.956, 39.487, 41.236, 46.584, 31.824],
                chartEfficiencyI: [0.718, 1.056, 1.287, 0.736, 1.284, 0.424],
                chartEngineI: [6.618, 14.956, 18.487, 23.236, 9.584, 21.824],
                chartWaterC: [7.618, 41.956, 34.487, 37.236, 42.584, 25.824],
                chartEnergyC: [12.618, 45.956, 39.487, 41.236, 46.584, 31.824],
                chartEfficiencyC: [0.718, 1.056, 1.287, 0.736, 1.284, 0.424],
                chartEngineC: [6.618, 14.956, 18.487, 23.236, 9.584, 21.824]
            }
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
                $('.well[data-id="' + n + '"] .well-info, .map-point[data-id="' + n + '"] .mpi-info').html('<li><i class="icon-water-drop"></i>' + wellData.wells[n].totalWater + ' <span>м<sup>3</sup></span></li><li><i class="icon-lighting"></i>' + wellData.wells[n].totalEnergy + ' <span>кВт</span></li><li><i class="well-efficiency-icon icon-chart" data-efficiency="' + wellData.wells[n].totalEfficiency[1] + '"></i>' + wellData.wells[n].totalEfficiency[0] + ' <span>кВт за м<sup>3</sup></span></li><li><i class="well-lock" data-lock="' + wellData.wells[n].lockStatus + '"></i><strong class="well-lock-status">Зачинено</strong><strong class="well-lock-status">Відчинено</strong></li>');
            }
        }
    }

    // ----- write graphs total information
    function graphsInfo() {

        $('.total-period-info[data-id="1"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> видобуто води</div><div>' + computeTotal(wellData.wells[$('.well.is-info').attr('data-id')].chartWaterI) + ' <span>м<sup>3</sup></span></div>');

        $('.total-period-info[data-id="2"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> витрачено електроенергії</div><div>' + computeTotal(wellData.wells[$('.well.is-info').attr('data-id')].chartEnergyI) + ' <span>кВт</span></div>');

        $('.total-period-info[data-id="3"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> середня витрата електроенергії на видобуток 1 м<sup>3</sup> води</div><div>' + computeMiddle(wellData.wells[$('.well.is-info').attr('data-id')].chartEfficiencyI) + ' <span>кВт</span></div>');

        $('.total-period-info[data-id="4"]').html('<div>З <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[0]) + '</strong> по <strong>' + setTimestampDate(wellData.chartDates.chartInfoDates[wellData.chartDates.chartInfoDates.length - 1]) + '</strong> двигун працював</div><div>' + computeTotal(wellData.wells[$('.well.is-info').attr('data-id')].chartEngineI) + ' <span>год.</span></div>');

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

    // ----- draw tables
    for(let n in wellData.wells) {
        if(wellData.wells[n] !== false) {
            $('#table-day').append('<tr><td>№ ' + (n < 10 ? 0 + n : n) + '</td><td>' + wellData.wells[n].day.water + '</td><td>' + wellData.wells[n].day.energy + '</td><td class="ef' + (wellData.wells[n].day.efficiency < 1.45 ? ' ef-low' : '') + (wellData.wells[n].day.efficiency > 1.55 ? ' ef-high' : '') + (wellData.wells[n].day.efficiency === 0 ? ' ef-no' : '') + '">' + wellData.wells[n].day.efficiency + '</td></tr>');
            $('#table-summary').append('<tr><td>№ ' + n + '</td><td>' + wellData.wells[n].week.water + '</td><td>' + wellData.wells[n].week.energy + '</td><td class="ef' + (wellData.wells[n].week.efficiency < 1.45 ? ' ef-low' : '') + (wellData.wells[n].week.efficiency > 1.55 ? ' ef-high' : '') + (wellData.wells[n].week.efficiency === 0 ? ' ef-no' : '') + '">' + wellData.wells[n].week.efficiency + '</td><td>' + wellData.wells[n].month.water + '</td><td>' + wellData.wells[n].month.energy + '</td><td class="ef' + (wellData.wells[n].month.efficiency < 1.45 ? ' ef-low' : '') + (wellData.wells[n].month.efficiency > 1.55 ? ' ef-high' : '') + (wellData.wells[n].month.efficiency === 0 ? ' ef-no' : '') + '">' + wellData.wells[n].month.efficiency + '</td><td>' + wellData.wells[n].year.water + '</td><td>' + wellData.wells[n].year.energy + '</td><td class="ef' + (wellData.wells[n].year.efficiency < 1.45 ? ' ef-low' : '') + (wellData.wells[n].year.efficiency > 1.55 ? ' ef-high' : '') + (wellData.wells[n].year.efficiency === 0 ? ' ef-no' : '') + '">' + wellData.wells[n].year.efficiency + '</td></tr>');
        }
    }

    // ----- tables highlight cells
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
            total += el[i];
        }
        return total.toFixed(1);
    }

    // ----- compute middle graph value
    function computeMiddle(el) {
        let total = 0;
        for(let i = 0; i < el.length; i++) {
            total += el[i];
        }
        return (total/el.length).toFixed(3);
    }

});

$(window).resize(function () {

    $('.head-select').removeClass('active');
    $('.sidebar').removeClass('active');

});
