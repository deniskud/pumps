/**
 * Created by No Fear on 15.05.2020.
 * E-mail: g0th1c097@gmail.com
 */

$(document).ready(function () {

    // ----- toggle views
    $('.head-select ul li').click(function () {
        $('.head-select ul li').removeClass('active');
        $('body').removeClass('head-select-map head-select-info head-select-compare').addClass($(this).attr('class'));
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

    // ----- remove chart legend
    Chart.defaults.global.legend.display = false;

    // ----- init single chart for water
    let infoChartWater = new Chart($('.info-chart-water'), {
        type: 'line',
        data: {
            labels: ['12 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'],
            datasets: [{
                data: [1847.618, 2498.956, 2569.487, 2856.236, 3214.584, 3622.824],
                backgroundColor: 'rgba(23, 146, 232, 0.1)',
                borderColor: '#1792e8',
                pointBackgroundColor: 'rgba(0,0,0,0)',
                pointBorderColor: '#1792e8',
                pointHitRadius: 10,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
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
        }
    });

    // ----- init single chart for energy
    let infoChartEnergy = new Chart($('.info-chart-energy'), {
        type: 'line',
        data: {
            labels: ['12 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'],
            datasets: [{
                data: [1847.618, 2498.956, 2569.487, 2856.236, 3214.584, 3622.824],
                backgroundColor: 'rgba(23, 146, 232, 0.1)',
                borderColor: '#1792e8',
                pointBackgroundColor: 'rgba(0,0,0,0)',
                pointBorderColor: '#1792e8',
                pointHitRadius: 10,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
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
        }
    });

    // ----- init single chart for comparison
    let infoChartCompare = new Chart($('.info-chart-compare'), {
        type: 'line',
        data: {
            labels: ['12 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'],
            datasets: [{
                data: [18.618, 24.956, 25.487, 28.236, 32.584, 36.824],
                backgroundColor: 'rgba(23, 146, 232, 0.1)',
                borderColor: '#1792e8',
                pointBackgroundColor: 'rgba(0,0,0,0)',
                pointBorderColor: '#1792e8',
                pointHitRadius: 10,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
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
        }
    });

    // ----- click on well title in different modes
    $('.well-head h4').click(function () {

        if($(this).closest('.head-select-info').length) {

            $('.well').removeClass('is-info');
            $(this).closest('.well').addClass('is-info');

            infoChartWater.data.labels = ['1 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'];
            infoChartWater.data.datasets.forEach((dataset) => {
                dataset.data = [1847.618, 2498.956, 2569.487, 2856.236, 3214.584, 1522.824];
            });
            infoChartWater.update();

            infoChartEnergy.data.labels = ['1 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'];
            infoChartEnergy.data.datasets.forEach((dataset) => {
                dataset.data = [1847.618, 2498.956, 2569.487, 2856.236, 3214.584, 1522.824];
            });
            infoChartEnergy.update();

            infoChartCompare.data.labels = ['1 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'];
            infoChartCompare.data.datasets.forEach((dataset) => {
                dataset.data = [18.618, 24.956, 25.487, 28.236, 32.584, 15.824];
            });
            infoChartCompare.update();

        }
        if($(this).closest('.head-select-compare').length) {

            $(this).siblings('.checkbox').find('input').attr('checked', !$(this).siblings('.checkbox').find('input').attr('checked')).closest('.well').toggleClass('is-compare');

            compareFunction();

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
            $(this).closest('.period-select-wrap').find('.period-selected').attr('data-period', $(this).parent().siblings('.active').data('period')).find('span').text($(this).parent().siblings('.active').text());
            //TODO
            // ----- data request here

	    out='';
	    for (i in myDatepicker1) {out+=i+' - '+myDatepicker1[i]+'\n';}
	    console.log(out);
//	    alert(myDatepicker1);
        }
        $(this).closest('.period-select-wrap').removeClass('active');
    });

    $('body').click(function (e) {

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

    // ----- init datepicker for single mode graphs
    let firstShow1 = 1;
    let myDatepicker1 = $('.period-calendar-input-1').datepicker({
        range: true,
        position: 'bottom right',
        multipleDatesSeparator: ' - ',
        onShow: function (inst, animationCompleted) {
            if(firstShow1) {
                firstShow1 = 0;
                inst.$datepicker.append($('<div class="submit-block-1 clearfix"><button type="button" class="period-submit-1">Применить</button><button type="button" class="period-cancel-1">Закрыть</button></div>'));
            }
        }
    }).data('datepicker');

    // ----- show datepicker for single mode graphs
    $('.period-calendar-btn-1').click(function () {
        $(this).closest('.period-select-wrap').removeClass('active');
        myDatepicker1.clear();
        myDatepicker1.show();
    });

    // ----- submit datepicker for single mode graphs selection
    $('body').on('click','.period-submit-1', function () {
        if(myDatepicker1.selectedDates.length === 2) {
            $('.period-calendar-input-1').parent().siblings('.period-selected').attr('data-period', 7).find('span').text($('.period-calendar-input-1').val());
            //TODO
	    d1 = new Date(myDatepicker1.selectedDates[0]);
	    d2 = new Date(myDatepicker1.selectedDates[1]);

	    update_data(d1.getTime(),d2.getTime());
//	    console.log(d1.getTime());               
//	    console.log(myDatepicker2.selectedDates);               

// ----- data request here
            // ----- range dates
        }
        else if(myDatepicker1.selectedDates.length === 1) {
            $('.period-calendar-input-1').parent().siblings('.period-selected').attr('data-period', 7).find('span').text($('.period-calendar-input-1').val());
            //TODO
            // ----- data request here
            // ----- single date
        }
        myDatepicker1.hide();
    }).on('click','.period-cancel-1', function () {
        myDatepicker1.hide();
    });

    // ----- init datepicker for compare mode graphs
    let firstShow2 = 1;
    let myDatepicker2 = $('.period-calendar-input-2').datepicker({
        range: true,
        position: 'bottom right',
        multipleDatesSeparator: ' - ',
        onShow: function (inst, animationCompleted) {
            if(firstShow2) {
                firstShow2 = 0;
                inst.$datepicker.append($('<div class="submit-block-2 clearfix"><button type="button" class="period-submit-2">Применить</button><button type="button" class="period-cancel-2">Закрыть</button></div>'));
            }
        }
    }).data('datepicker');

    // ----- show datepicker for compare mode graphs
    $('.period-calendar-btn-2').click(function () {
        $(this).closest('.period-select-wrap').removeClass('active');
        myDatepicker2.clear();
        myDatepicker2.show();
    });

    // ----- submit datepicker for compare mode graphs selection
    $('body').on('click','.period-submit-2', function () {
        if(myDatepicker2.selectedDates.length === 2) {
            $('.period-calendar-input-2').parent().siblings('.period-selected').attr('data-period', 7).find('span').text($('.period-calendar-input-2').val());
            //TODO
            // ----- data request here
            // ----- range dates
        }
        else if(myDatepicker2.selectedDates.length === 1) {
            $('.period-calendar-input-2').parent().siblings('.period-selected').attr('data-period', 7).find('span').text($('.period-calendar-input-2').val());
            //TODO
            // ----- data request here
            // ----- single date
        }
        myDatepicker2.hide();
    }).on('click','.period-cancel-2', function () {
        myDatepicker2.hide();
    });

    // ----- init compare chart for water
    let compareChartWater = new Chart($('.compare-chart-water'), {
        type: 'line',
        data: {
            labels: ['12 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'],
            datasets: [{
                label: 'Скважина №1',
                borderColor: $('.well[data-id="1"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [1847.618, 2498.956, 2569.487, 2856.236, 3214.584, 3622.824]
            }, {
                label: 'Скважина №2',
                borderColor: $('.well[data-id="2"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [147.618, 498.956, 269.487, 856.236, 314.584, 622.824]
            }, {
                label: 'Скважина №3',
                borderColor: $('.well[data-id="3"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [1147.618, 1498.956, 2169.487, 756.236, 1314.584, 2622.824]
            }, {
                label: 'Скважина №4',
                borderColor: $('.well[data-id="4"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [47.618, 2198.956, 1269.487, 1856.236, 2014.584, 1622.824]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
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
        }
    });

    // ----- init compare chart for energy
    let compareChartEnergy = new Chart($('.compare-chart-energy'), {
        type: 'line',
        data: {
            labels: ['12 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'],
            datasets: [{
                label: 'Скважина №1',
                borderColor: $('.well[data-id="1"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [1847.618, 2498.956, 2569.487, 2856.236, 3214.584, 3622.824]
            }, {
                label: 'Скважина №2',
                borderColor: $('.well[data-id="2"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [147.618, 498.956, 269.487, 856.236, 314.584, 622.824]
            }, {
                label: 'Скважина №3',
                borderColor: $('.well[data-id="3"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [1147.618, 1498.956, 2169.487, 756.236, 1314.584, 2622.824]
            }, {
                label: 'Скважина №4',
                borderColor: $('.well[data-id="4"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [47.618, 2198.956, 1269.487, 1856.236, 2014.584, 1622.824]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
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
        }
    });

    // ----- init compare chart for comparison
    let compareChartCompare = new Chart($('.compare-chart-compare'), {
        type: 'line',
        data: {
            labels: ['12 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'],
            datasets: [{
                label: 'Скважина №1',
                borderColor: $('.well[data-id="1"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [1847.618, 2498.956, 2569.487, 2856.236, 3214.584, 3622.824]
            }, {
                label: 'Скважина №2',
                borderColor: $('.well[data-id="2"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [147.618, 498.956, 269.487, 856.236, 314.584, 622.824]
            }, {
                label: 'Скважина №3',
                borderColor: $('.well[data-id="3"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [1147.618, 1498.956, 2169.487, 756.236, 1314.584, 2622.824]
            }, {
                label: 'Скважина №4',
                borderColor: $('.well[data-id="4"] .well-head').css('color'),
                pointHitRadius: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                data: [47.618, 2198.956, 1269.487, 1856.236, 2014.584, 1622.824]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
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
        }
    });

    // ----- add/remove well information for compare charts mode
    $('.well-head .checkbox').click(function (e) {

        e.preventDefault();

        $(this).find('input').attr('checked', !$(this).find('input').attr('checked')).closest('.well').toggleClass('is-compare');

        compareFunction();

    });

    // ----- show/hide well info on map
    $('.map-point > svg').click(function () {
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

    // ----- hide page preloader
    $('#page-loader').stop().fadeOut();

    // ----- function rewrites compare mode graphs with new data
    function compareFunction() {

        compareChartWater.data.labels = ['1 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'];
        compareChartWater.data.datasets = [{
            label: 'Скважина №1',
            borderColor: $('.well[data-id="1"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [847.618, 298.956, 256.487, 856.236, 314.584, 1622.824]
        }, {
            label: 'Скважина №2',
            borderColor: $('.well[data-id="2"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [1417.618, 1498.956, 269.487, 56.236, 1314.584, 622.824]
        }, {
            label: 'Скважина №3',
            borderColor: $('.well[data-id="3"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [147.618, 498.956, 169.487, 1756.236, 2314.584, 1622.824]
        }, {
            label: 'Скважина №4',
            borderColor: $('.well[data-id="4"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [2047.618, 1198.956, 129.487, 156.236, 214.584, 122.824]
        }];
        compareChartWater.update();

        compareChartEnergy.data.labels = ['1 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'];
        compareChartEnergy.data.datasets = [{
            label: 'Скважина №1',
            borderColor: $('.well[data-id="1"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [847.618, 298.956, 256.487, 856.236, 314.584, 1622.824]
        }, {
            label: 'Скважина №2',
            borderColor: $('.well[data-id="2"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [1417.618, 1498.956, 269.487, 56.236, 1314.584, 622.824]
        }, {
            label: 'Скважина №3',
            borderColor: $('.well[data-id="3"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [147.618, 498.956, 169.487, 1756.236, 2314.584, 1622.824]
        }, {
            label: 'Скважина №4',
            borderColor: $('.well[data-id="4"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [2047.618, 1198.956, 129.487, 156.236, 214.584, 122.824]
        }];
        compareChartEnergy.update();

        compareChartCompare.data.labels = ['1 апр', '15 апр', '18 апр', '20 апр', '25 апр', '1 мая'];
        compareChartCompare.data.datasets = [{
            label: 'Скважина №1',
            borderColor: $('.well[data-id="1"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [847.618, 298.956, 256.487, 856.236, 314.584, 1622.824]
        }, {
            label: 'Скважина №2',
            borderColor: $('.well[data-id="2"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [1417.618, 1498.956, 269.487, 56.236, 1314.584, 622.824]
        }, {
            label: 'Скважина №3',
            borderColor: $('.well[data-id="3"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [147.618, 498.956, 169.487, 1756.236, 2314.584, 1622.824]
        }, {
            label: 'Скважина №4',
            borderColor: $('.well[data-id="4"] .well-head').css('color'),
            pointHitRadius: 10,
            borderWidth: 1,
            backgroundColor: 'transparent',
            data: [2047.618, 1198.956, 129.487, 156.236, 214.584, 122.824]
        }];
        compareChartCompare.update();

    }

});

$(window).resize(function () {

    $('.head-select').removeClass('active');
    $('.sidebar').removeClass('active');

});
