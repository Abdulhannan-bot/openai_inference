$(function () {
    "use strict";

    // Chart for signals by account
    const signal_list_by_account = JSON.parse('{{ signals_by_account | safe }}');
    var signal_name_list = [];
    var signal_count_list = [];
    signal_list_by_account.forEach(element => {
        signal_name_list.push(element.account_name);
        signal_count_list.push(element.signal_count);
    });


    var accountChart = echarts.init(document.getElementById('signals_by_account-bar'));

    // specify chart configuration item and data
    var accountOption = {
        responsive: true,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: 'Number of signals by account'
        },
        grid: {
            left: '1%',
            right: '2%',
            bottom: '3%',
            containLabel: true,
        },
        color: ["#2962FF", "#4fc3f7"],
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: signal_name_list,
                axisTick: {
                    alignWithLabel: true,
                },
                axisLabel: {
                    interval: 0,
                    rotate: 45,
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                boundaryGap: [0, '100%']
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                startValue: 0,
                endValue: 20,
            },
            {
                type: 'slider',
                startValue: 0,
                endValue: 20,
                top: 'bottom',
                bottom: -25,
            }
        ],
        series: [
            {
                name: 'Signal Count',
                type: 'bar',
                barWidth: '60%',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }
                    ])
                },
                data: signal_count_list,
            }
        ]
    };

    // use configuration item and data specified to show chart
    accountChart.setOption(accountOption);


    // Chart for signals by account owner
    const signal_list_by_account_owner = JSON.parse('{{ signals_by_account_owner | safe }}');

    var signal_name_list2 = [];
    var signal_count_list2 = [];
    signal_list_by_account_owner.forEach(element => {
        signal_name_list2.push(element.account_owner_name);
        signal_count_list2.push(element.signal_count);
    });


    var accountOwnerChart = echarts.init(document.getElementById('signals_by_account_owner-bar'));
    // specify chart configuration item and data
    var accountOwnerOption = {
        responsive: true,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: 'Number of Signals by Account Owners'
        },
        grid: {
            left: '1%',
            right: '2%',
            bottom: '3%',
            containLabel: true,
        },
        color: ["#2962FF", "#4fc3f7"],
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: signal_name_list2,
                axisTick: {
                    alignWithLabel: true,
                },
                axisLabel: {
                    interval: 0,
                    rotate: 45,
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                boundaryGap: [0, '100%']
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                // start: 0,
                // end: 40,
                startValue: 0,
                endValue: 20,
            },
            {
                type: 'slider',
                startValue: 0,
                endValue: 20,
                top: 'bottom',
                bottom: -20,
            }
        ],
        series: [
            {
                name: 'Signal Count',
                type: 'bar',
                barWidth: '60%',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }
                    ])
                },
                data: signal_count_list2,
            }
        ]
    };

    accountOwnerChart.setOption(accountOwnerOption);


    // Chart for signals by signal sales play(PIE chart)
    const signal_list_by_sales_play = JSON.parse('{{ signals_by_sales_play | safe }}');
    var signal_objList_by_sales_play = [];

    signal_list_by_sales_play.forEach(element => {
        var sales_play_name = null;
        if (element.sales_play == "01") {
            sales_play_name = "Stakeholders Joining Accounts: Who's new to this account?"
        } else if (element.sales_play == "02") {
            sales_play_name = "Stakeholders Leaving Accounts: Who's left this account?"
        } else if (element.sales_play == "03") {
            sales_play_name = "Competitors Joining Accounts: Who has competitive experience in this account?"
        } else if (element.sales_play == "04") {
            sales_play_name = "Competitors Connecting with Stakeholders: Who has connected with competitors in this account?"
        } else if (element.sales_play == "05") {
            sales_play_name = "Academic Connections in Accounts: Which key stakeholder in this account attended your College/University?"
        } else if (element.sales_play == "06") {
            sales_play_name = "Customers Joining Named Accounts: Which past advocate is new to this account?"
        } else if (element.sales_play == "07") {
            sales_play_name = "Customers Joining Net New Accounts: Which past advocate is new to this account?"
        } else if (element.sales_play == "08") {
            sales_play_name = "Account Growth & Reduction Signals:This account has dramatically changed headcount."
        } else if (element.sales_play == "09") {
            sales_play_name = "Future Recruitment: What Job Role is this account hiring/replacing?"
        } else if (element.sales_play == "10") {
            sales_play_name = "Talent Migration: What 10 accounts are heavily recruiting talent from your customer base?"
        }

        signal_objList_by_sales_play.push({
            "value": element.signal_count,
            "name": sales_play_name,
        })
    });

    var salesPlayChart = echarts.init(document.getElementById('signals_by_sales_play-bar'));
    var salesPlayOption = {
        title: {
            text: 'Signal Sales Play',
            right: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            top: 'center',
        },
        series: [
            {
                name: 'Signal Sales Play',
                type: 'pie',
                radius: 180,
                label: {
                    position: 'inside',
                    formatter: '{d}%',
                    avoidLabelOverlap: true,
                    // edgeDistance: '20%',
                    // distanceToLabelLine: 10,
                },
                center: ['25%', '50%'],
                // radius: ['0', '50%'],
                data: signal_objList_by_sales_play,
                // color: ['lightblue', 'orange', 'lightcoral', 'plum'],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgb(102,102,102)'
                    }
                }
            }
        ]
    };
    salesPlayChart.setOption(salesPlayOption);


    // Chart for signals by customer relation
    const signal_list_by_customer_relation = JSON.parse('{{ signals_by_customer_relation | safe }}');
    var signal_name_list4 = [];
    var signal_count_list4 = [];
    signal_list_by_customer_relation.forEach(element => {
        signal_name_list4.push(element.account_name);
        signal_count_list4.push(element.signal_count);
    });

    var customerChart = echarts.init(document.getElementById('customer_signals-bar'));

    var customerOption = {
        responsive: true,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: 'Number of signals by Account'
        },
        grid: {
            left: '1%',
            right: '2%',
            bottom: '3%',
            containLabel: true,
        },
        color: ["#2962FF", "#4fc3f7"],
        calculable: true,
        xAxis: [{
            type: 'category',
            data: signal_name_list4,
            axisTick: {
                alignWithLabel: true,
            },
            axisLabel: {
                interval: 0,
                rotate: 45,
            }
        }],
        yAxis: [{
            type: 'value',
            boundaryGap: [0, '100%']
        }],
        dataZoom: [{
            type: 'inside',
            startValue: 0,
            endValue: 20,
        }, {
            type: 'slider',
            start: 0,
            end: 10,
            top: 'bottom',
            bottom: -25,
        }],
        series: [{
            name: 'Signal Count',
            type: 'bar',
            barWidth: '60%',
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                    },
                    {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                    }
                ])
            },
            data: signal_count_list4,
        }]
    };

    customerChart.setOption(customerOption);


    // Chart for signals by competitor relation
    const signal_list_by_competitor_relation = JSON.parse('{{ signals_by_competitor_relation | safe }}');
    var signal_name_list5 = [];
    var signal_count_list5 = [];
    signal_list_by_competitor_relation.forEach(element => {
        signal_name_list5.push(element.account_name);
        signal_count_list5.push(element.signal_count);
    });


    var competitorChart = echarts.init(document.getElementById('competitor_signals-bar'));

    // specify chart configuration item and data
    var competitorOption = {
        responsive: true,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: 'Number of signals by Account'
        },
        grid: {
            left: '1%',
            right: '2%',
            bottom: '3%',
            containLabel: true,
        },
        color: ["#2962FF", "#4fc3f7"],
        calculable: true,
        xAxis: [{
            type: 'category',
            data: signal_name_list5,
            axisTick: {
                alignWithLabel: true,
            },
            axisLabel: {
                interval: 0,
                rotate: 45,
            }
        }],
        yAxis: [{
            type: 'value',
            boundaryGap: [0, '100%']
        }],
        dataZoom: [{
            type: 'inside',
            startValue: 0,
            endValue: 20,
        }, {
            type: 'slider',
            start: 0,
            end: 10,
            top: 'bottom',
            bottom: -25,
        }],
        series: [{
            name: 'Signal Count',
            type: 'bar',
            barWidth: '60%',
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                    },
                    {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                    }
                ])
            },
            data: signal_count_list5,
        }]
    };

    // use configuration item and data specified to show chart
    competitorChart.setOption(competitorOption);

    //------------------------------------------------------
    // Resize chart on menu width change and window resize
    //------------------------------------------------------
    $(function () {
        // Resize chart on menu width change and window resize
        $(window).on('resize', resize);
        $(".sidebartoggler").on('click', resize);

        // Resize function
        function resize() {
            setTimeout(function () {
                // Resize chart
                accountChart.resize();
                accountOwnerChart.resize();
                salesPlayChart.resize();
                customerChart.resize();
                competitorChart.resize();
            }, 200);
        }
    });

});

