/**
 * shiyanyan
 * 2018-09-19
 * 功能描述：发票日历
 */
$(function () {
    /**
     * 获取当年
     * @returns {number}
     */
    function getCurrentYear() {
        var curDate = new Date();
        var currentYear = curDate.getFullYear()-1;
        return currentYear;
    }

    /**
     * 获取时间区间
     * @param str
     * @returns {*}
     */
    function getRang(str) {
        var a = getCurrentYear() + str;
        return a;
    }

    /**
     * 根据数据的最大值，动态显示散点的比例
     * @param str
     */
    function getScale(str) {
        var res = 500;
        var a = Math.ceil(str);
        var len = a.toString().length;
        if (len > 4) {
            res = 5 * Math.pow(10, (len - 2));
        }
        return res;
    }

    /**
     * 从后台获取销方，购方数据
     * @returns {Array}
     */
    function getData(flag) {
        var compName = $("#compName").val();
        var data = [];
        $.ajax({
            type: "get",
            data: {
                "flag": flag,
                "compName": compName
            },
            async: false,
            url: "/comp/selectQyfprl",
            success: function (result) {
                if (result != null) {
                    var obj = eval('(' + result + ')');
                    $.each(obj, function (index, item) {
                        data.push([item.day, item.value.toFixed(2)])
                    })
                }
            }
        });
        return data;
    }

// 初始化销方数据开始
    var myChartXF = echarts.init(document.getElementById('invoice_con1'));
    var dataXF = getData("XF");
    var max_xf=parseFloat(dataXF[0][1]);
    for(var i=0;i<dataXF.length;i++){
        var value=parseFloat(dataXF[i][1]);
        if(max_xf<value){
            max_xf=value;
        }
    }
    var min_xf=max_xf;
    for(var i=0;i<dataXF.length;i++){
        var value=parseFloat(dataXF[i][1]);
        if(min_xf>value && value>=0){
            min_xf=value;
        }
    }
    var optionXF = {
        backgroundColor: '#f4f5f7',
        title: {
            top: 30,
            text: getCurrentYear() + '年企业开具发票日历',
            left: 'center',
            textStyle: {
                color: '#1c6dd0'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return  echarts.format.formatTime(params.value[0]) + "<br/>" + params.value[1];
            }
        },
        legend: {
            top: '30',
            left: '20',
            //data: ['开具', 'Top 12'],
            data: ['开具'],
            textStyle: {
                color: '#1c6dd0'
            }
        },
        calendar: [{
            cellSize: 19,
            top: 100,
            left: 60,
            range: [getRang('-01-01'), getRang('-06-30')],
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#1c6dd0',
                    width: 2,
                    type: 'solid'
                }
            },
            dayLabel: {
                nameMap: 'cn'
            },
            yearLabel: {
                formatter: '{start}  上半年',
                textStyle: {
                    color: '#1c6dd0'
                }
            },
            monthLabel: {
                nameMap: 'cn'
            },
            itemStyle: {
                normal: {
                    color: '#C1C1C1',
                    borderWidth: 1,
                    borderColor: '#e2e2e2'
                }
            }
        }, {
            cellSize: 19,
            top: 280,
            left: 60,
            range: [getRang('-07-01'), getRang('-12-31')],
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#1c6dd0',
                    width: 2,
                    type: 'solid'
                }
            },
            dayLabel: {
                nameMap: 'cn'
            },
            monthLabel: {
                nameMap: 'cn'
            },
            yearLabel: {
                formatter: '{start}  下半年',
                textStyle: {
                    color: '#1c6dd0'
                }
            },
            itemStyle: {
                normal: {
                    color: '#C1C1C1',
                    borderWidth: 1,
                    borderColor: '#e2e2e2'
                }
            }
        }],
        series: [
            {
                name: '开具',
                type: 'scatter',
                coordinateSystem: 'calendar',
                data: dataXF,
                symbolSize: function (val) {
                    if(max_xf!=min_xf){
                        return (val[1]-min_xf)*20/ (max_xf-min_xf);
                    }else if(max_xf==min_xf && max_xf!=0.00){
                        return (val[1]/max_xf);
                    }else{
                        return val[1];
                    }

                },
                itemStyle: {
                    normal: {
                        color: '#185aac'
                    }
                }
            },
            {
                name: '开具',
                type: 'scatter',
                coordinateSystem: 'calendar',
                calendarIndex: 1,
                data: dataXF,
                symbolSize: function (val) {
                    if(max_xf!=min_xf){
                        return (val[1]-min_xf)*20/ (max_xf-min_xf);
                    }else if(max_xf==min_xf && max_xf!=0.00){
                        return (val[1]/max_xf);
                    }else{
                        return val[1];
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#185aac'
                    }
                }
            }
            // {
            //     name: 'Top 12',
            //     type: 'effectScatter',
            //     coordinateSystem: 'calendar',
            //     calendarIndex: 1,
            //     data: dataXF.sort(function (a, b) {
            //         return b[1] - a[1];
            //     }).slice(0, 12),
            //     symbolSize: function (val) {
            //         return val[1] / getScale(val[1]);
            //     },
            //     showEffectOn: 'render',
            //     rippleEffect: {
            //         brushType: 'stroke'
            //     },
            //     hoverAnimation: true,
            //     itemStyle: {
            //         normal: {
            //             color: '#1c6dd0',
            //             shadowBlur: 10,
            //             shadowColor: '#333'
            //         }
            //     },
            //     zlevel: 1
            // },
            // {
            //     name: 'Top 12',
            //     type: 'effectScatter',
            //     coordinateSystem: 'calendar',
            //     data: dataXF.sort(function (a, b) {
            //         return b[1] - a[1];
            //     }).slice(0, 12),
            //     symbolSize: function (val) {
            //         return val[1] / getScale(val[1]);
            //     },
            //     showEffectOn: 'render',
            //     rippleEffect: {
            //         brushType: 'stroke'
            //     },
            //     hoverAnimation: true,
            //     itemStyle: {
            //         normal: {
            //             color: '#1c6dd0',
            //             shadowBlur: 10,
            //             shadowColor: '#333'
            //         }
            //     },
            //     zlevel: 1
            // }
        ]
    };
    myChartXF.setOption(optionXF);
// 初始化销方数据结束
//初始化购方数据开始
    var myChartGF = echarts.init(document.getElementById('invoice_con2'));
    var dataGF = getData("GF");
    var max_gf=parseFloat(dataGF[0][1]);
    for(var i=0;i<dataGF.length;i++){
        var value=parseFloat(dataGF[i][1]);
        if(max_gf<value){
            max_gf=value;
        }
    }
    var min_gf=max_gf;
    for(var i=0;i<dataGF.length;i++){
        var value=parseFloat(dataGF[i][1]);
        if(min_gf>value && value>=0){
            min_gf=value;
        }
    }
    var optionGF = {
        backgroundColor: '#f4f5f7',
        title: {
            top: 30,
            text: getCurrentYear() + '年企业取得发票日历',
            left: 'center',
            textStyle: {
                color: '#1c6dd0'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return  echarts.format.formatTime(params.value[0]) + "<br/>" + params.value[1];
            }
        },
        legend: {
            top: '30',
            left: '20',
            //data: ['取得', 'Top 12'],
            data: ['取得'],
            textStyle: {
                color: '#1c6dd0'
            }
        },
        calendar: [{
            cellSize: 19,
            top: 100,
            left: 60,
            range: [getRang('-01-01'), getRang('-06-30')],
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#1c6dd0',
                    width: 2,
                    type: 'solid'
                }
            },
            monthLabel: {
                nameMap: 'cn'
            },
            dayLabel: {
                nameMap: 'cn'
            },
            yearLabel: {
                formatter: '{start}  上半年',
                textStyle: {
                    color: '#1c6dd0'
                }
            },
            itemStyle: {
                normal: {
                    color: '#C1C1C1',
                    borderWidth: 1,
                    borderColor: '#e2e2e2'
                }
            }
        }, {
            cellSize: 19,
            top: 280,
            left: 60,
            range: [getRang('-07-01'), getRang('-12-31')],
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#1c6dd0',
                    width: 2,
                    type: 'solid'
                }
            },
            monthLabel: {
                nameMap: 'cn'
            },
            dayLabel: {
                nameMap: 'cn'
            },
            yearLabel: {
                formatter: '{start}  下半年',
                textStyle: {
                    color: '#1c6dd0'
                }
            },
            itemStyle: {
                normal: {
                    color: '#C1C1C1',
                    borderWidth: 1,
                    borderColor: '#e2e2e2'
                }
            }
        }],
        series: [
            {
                name: '取得',
                type: 'scatter',
                coordinateSystem: 'calendar',
                data: dataGF,
                symbolSize: function (val) {
                    if(max_gf!=min_gf){
                        return (val[1]-min_gf)*20/(max_gf-min_gf);
                    }else if(max_gf==min_gf && max_gf!=0.00){
                        return val[1]/max_gf;
                    }else{
                        return val[1];
                    }


                },
                itemStyle: {
                    normal: {
                        color: '#185aac'
                    }
                }
            },
            {
                name: '取得',
                type: 'scatter',
                coordinateSystem: 'calendar',
                calendarIndex: 1,
                data: dataGF,
                symbolSize: function (val) {
                    if(max_gf!=min_gf){
                        return (val[1]-min_gf)*20/(max_gf-min_gf);
                    }else if(max_gf==min_gf && max_gf!=0.00){
                        return val[1]/max_gf;
                    }else{
                        return val[1];
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#185aac'
                    }
                }
            }
            // {
            //     name: 'Top 12',
            //     type: 'effectScatter',
            //     coordinateSystem: 'calendar',
            //     calendarIndex: 1,
            //     data: dataGF.sort(function (a, b) {
            //         return b[1] - a[1];
            //     }).slice(0, 12),
            //     symbolSize: function (val) {
            //         return val[1] / getScale(val[1]);
            //     },
            //     showEffectOn: 'render',
            //     rippleEffect: {
            //         brushType: 'stroke'
            //     },
            //     hoverAnimation: true,
            //     itemStyle: {
            //         normal: {
            //             color: '#1c6dd0',
            //             shadowBlur: 10,
            //             shadowColor: '#333'
            //         }
            //     },
            //     zlevel: 1
            // },
            // {
            //     name: 'Top 12',
            //     type: 'effectScatter',
            //     coordinateSystem: 'calendar',
            //     data: dataGF.sort(function (a, b) {
            //         return b[1] - a[1];
            //     }).slice(0, 12),
            //     symbolSize: function (val) {
            //         return val[1] / getScale(val[1]);
            //     },
            //     showEffectOn: 'render',
            //     rippleEffect: {
            //         brushType: 'stroke'
            //     },
            //     hoverAnimation: true,
            //     itemStyle: {
            //         normal: {
            //             color: '#1c6dd0',
            //             shadowBlur: 10,
            //             shadowColor: '#333'
            //         }
            //     },
            //     zlevel: 1
            // }
        ]
    };
    myChartGF.setOption(optionGF);
//初始化购方数据结束

});




function changeNull(filed) {
    if (filed === null) {
        return "-";
    } else {
        return filed;
    }
}

