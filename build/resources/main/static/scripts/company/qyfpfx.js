/**
 * shiyanyan
 * 2018-11-22
 * 功能描述：企业发票分析
 */
/**
 * 首次加载加载省级的进销项
 */
$(function () {
    loadQypl("mainjx","jx", "sj");
    loadQypl("mainxx","xx", "sj");
    function loadQypl(maskbody,jxxxz, dqjb, dqdm) {
        var kpyfq=commonUtil.getDefaultStartTime();
        var kpyfz=commonUtil.getCurEndMonth();
        var searchWord=$("#tranName").val();
        var reg=/^[A-Za-z0-9]+$ /;
        var nsrmc,nsrsbh;
        if(reg.test(searchWord)){
            nsrsbh=searchWord;
            nsrmc=""
        }else {
            nsrsbh="";
            nsrmc=searchWord;
        }
        $.ajax({
            type: "post",
            data: {
                "jxxxz": jxxxz,
                "kpyfq":kpyfq ,
                "kpyfz": kpyfz,
                "nsrsbh": nsrsbh,
                "nsrmc":nsrmc,
                "cxlx": "dq",
                "hwmc": "",
                "dqjb": dqjb,
                "dqdm": dqdm,
                "xzqh": "",
                "hyjb": ""
            },
            url: "/invoice/getResult",
            success: function (result) {
                getJXMap(maskbody,result, jxxxz, dqdm)
            }
        });
    }
    function getJXMap(maskbody,data, jxxxz, dqdm) {
        var mydataFpzje = [], mydataPtfpzje = [], mydataZzsfpzje = [], mydataJsfpzje = [], mydataDzfpzje = [],
            dw = 10000;
        var ds = false;
        var maxRange = 1;
        $.each(data, function (index, item) {
            if (index === 1 && item.QYJB === 'ds') {
                ds = true;
            }
            var mc = item.FLMC;
            if (item.QYJB === 'sj') {
                mc = getMapType(mc);
            }
            var zje = parseInt(item.FPZJE / dw);
            if (maxRange < zje) {
                maxRange = zje;
            }
            mydataFpzje.push({name: mc, value: (item.FPZJE / dw).toFixed(2)});
            mydataPtfpzje.push({name: mc, value: (item.PP / dw).toFixed(2)});
            mydataDzfpzje.push({name: mc, value: (item.DZ / dw).toFixed(2)});
            mydataJsfpzje.push({name: mc, value: (item.JS / dw).toFixed(2)});
            mydataZzsfpzje.push({name: mc, value: (item.ZP / dw).toFixed(2)});
        });
        if(typeof(dqdm) == "undefined"){
            loadMapChina(maskbody,mydataFpzje, mydataPtfpzje, mydataZzsfpzje, mydataJsfpzje, mydataDzfpzje, maxRange, jxxxz);
        }else {
            getProviceMap(maskbody,dqdm,mydataFpzje,mydataPtfpzje,mydataZzsfpzje,mydataJsfpzje,mydataDzfpzje,maxRange,jxxxz)
        }


    }
    function getMapType(type) {
        var typeMap = "";
        switch (type) {
            case '黑龙江省':
                typeMap = '黑龙江';
                break;
            case '内蒙古自治区':
                typeMap = '内蒙古';
                break;
            default:
                typeMap = type.substr(0, 2);
        }
        return typeMap;
    }
    var mask;

    /**
     *
     * @param maskbody 代表echart的div
     * @param mydataFpzje
     * @param mydataPtfpzje
     * @param mydataZzsfpzje
     * @param mydataJsfpzje
     * @param mydataDzfpzje
     * @param maxRange
     * @param jxxxz
     */
    function loadMapChina(maskbody,mydataFpzje, mydataPtfpzje, mydataZzsfpzje, mydataJsfpzje, mydataDzfpzje, maxRange, jxxxz) {
        var title_use;
        if (jxxxz === "jx") {
            title_use = "企业与外省贸易情况(取得)";
        }else {
            title_use = "企业与外省贸易情况(开具)";
        }
        var div = document.getElementById(maskbody);
        if(div){
            echarts.init(div).dispose();
        }
        var chart = echarts.init(div);
        var option = {
            backgroundColor: '#FFFFFF',
            title: {
                text: title_use,
                subtext: '单位：（万元）',
                x: 'center'
            },
            toolbox: {
                show: true,
                feature: {
                    //restore: {show: true},
                    magicType: {show: true, type: ['force', 'chord']},
                    //saveAsImage: {show: true},
                    myTool2: {
                        show: (maskbody!="main_mask_body"?true:false),
                        title: '全屏显示',
                        icon: 'image://../img/fullscreen.png',
                        onclick: function (){
                            $("#mask_fpfx").css("display","block");
                            loadMapChina("main_mask_body",mydataFpzje, mydataPtfpzje, mydataZzsfpzje, mydataJsfpzje, mydataDzfpzje, maxRange,jxxxz);
                            // if(!"main"+jxxxz){
                            //     mask=chart;
                            // }
                        }
                    },
                    myTool1: {
                        show:(maskbody=="main_mask_body"?true:false),
                        title: '退出',
                        icon: 'image://../img/closed.png',
                        onclick: function (){
                            $("#mask_fpfx").css("display","none");
                        }
                    }
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var res = params.name + '<br/>';
                    var myseries = option.series;
                    for (var i = 0; i < myseries.length; i++) {
                        for (var j = 0; j < myseries[i].data.length; j++) {
                            if (myseries[i].data[j].name == params.name) {
                                res += myseries[i].name + ' : ' + myseries[i].data[j].value + '</br>';
                            }
                        }
                    }
                    return res;
                }
            },
            visualMap: {
                left: (maskbody=="main_mask_body"?'20%':'left'),
                top: 'bottom',
                min: 0,//值域控件最小值
                max: maxRange/6,
                text: ['高', '低'],           // 文本，默认为数值文本
                calculable: true,
                inRange: {
                     color: ['lightskyblue','yellow', 'orangered']
                   // color: ['#E1F5FE', '#29B6F6', '#0288D1', '#01579B']
                   //  ['#426EB4','#1B4F93',"#103667"]
                },
                show:true,
                formatter: function(params){
                    return "";
                }
            },
            series: [{
                name: '总金额',
                type: 'map',
                mapType: 'china',
                roam: true,
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: mydataFpzje
            }, {
                name: '专票金额',
                type: 'map',
                mapType: 'china',
                roam: true,
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: mydataZzsfpzje
            }, {
                name: '普票金额',
                type: 'map',
                mapType: 'china',
                roam: true,
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: mydataPtfpzje
            }]
        };
        chart.setOption(option);
        chart.on('click',function (params) {
            //先加载数据
            loadQypl(maskbody,jxxxz,"ds",proviceDm[params.name])
        })
    }
//加载js使用
    var provinceMap={
        "310000":"shanghai",
        "520000":"guizhou",
        "540000":"xizang",
        "630000":"qinghai",
        "150000":"neimenggu",
        "320000":"jiangsu",
        "220000":"jilin",
        "360000":"jiangxi",
        "640000":"ningxia",
        "650000":"xinjiang",
        "420000":"hubei",
        "120000":"tianjin",
        "450000":"guangxi",
        "460000":"hainan",
        "500000":"chongqing",
        "230000":"heilongjiang",
        "110000":"beijing",
        "140000":"shanxi",
        "210000":"liaoning",
        "130000":"hebei",
        "620000":"gansu",
        "350000":"fujian",
        "340000":"anhui",
        "370000":"shandong",
        "530000":"yunnan",
        "610000":"shanxi1",
        "710000":"taiwan",
        "810000":"xianggang",
        "820000":"maomen",
        "510000":"sichuan",
        "440000":"guangdong",
        "330000":"zhejiang",
        "430000":"hunan",
        "410000":"henan"
    };
    var provinceMC = {
        "310000": "上海市",
        "520000": "贵州省",
        "540000": "西藏自治区",
        "630000": "青海省",
        "150000": "内蒙古自治区",
        "320000": "江苏省",
        "220000": "吉林省",
        "360000": "江西省",
        "640000": "宁夏回族自治区",
        "650000": "新疆维吾尔自治区",
        "420000": "湖北省",
        "120000": "天津市",
        "450000": "广西壮族自治区",
        "460000": "海南省",
        "500000": "重庆市",
        "230000": "黑龙江省",
        "110000": "北京市",
        "140000": "山西省",
        "210000": "辽宁省",
        "130000": "河北省",
        "620000": "甘肃省",
        "350000": "福建省",
        "340000": "安徽省",
        "370000": "山东省",
        "530000": "云南省",
        "610000": "陕西省",
        "710000": "台湾省",
        "810000": "香港特别行政区",
        "820000": "澳门特别行政区",
        "510000": "四川省",
        "440000": "广东省",
        "330000": "浙江省",
        "430000": "湖南省",
        "410000": "河南省"
    };
//代码，后台调用数据使用
    var proviceDm={
        "上海":"310000",
        "贵州":"520000",
        "西藏":"540000",
        "青海":"630000",
        "内蒙古":"150000",
        "江苏":"320000",
        "吉林":"220000",
        "江西":"360000",
        "宁夏":"640000",
        "新疆":"650000",
        "湖北":"420000",
        "天津":"120000",
        "广西":"450000",
        "海南":"460000",
        "重庆":"500000",
        "黑龙江":"230000",
        "北京":"110000",
        "山西":"140000",
        "辽宁":"210000",
        "河北":"130000",
        "甘肃":"620000",
        "福建":"350000",
        "安徽":"340000",
        "山东":"370000",
        "云南":"530000",
        "陕西":"610000",
        "台湾":"710000",
        "香港":"810000",
        "澳门":"820000",
        "四川":"510000",
        "广东":"440000",
        "浙江":"330000",
        "湖南":"430000",
        "河南":"410000"
    };

    function getProviceMap(maskbody,id,mydataFpzje, mydataPtfpzje, mydataZzsfpzje, mydataJsfpzje, mydataDzfpzje, maxRange,jxx) {
        $("script[src='/scripts/province/*.js']").remove();
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/scripts/province/" + provinceMap[id] + ".js";
        document.getElementsByTagName('head')[0].appendChild(script);
        //js加载完成执行方法
        script.onload = function () {
            loadProviceMap(maskbody,id, mydataFpzje, mydataPtfpzje, mydataZzsfpzje, mydataJsfpzje, mydataDzfpzje, maxRange,jxx)
        }
    }
    /*
     **
     * 地图展示
     */
    function loadProviceMap(maskbody,id, mydataFpzje, mydataPtfpzje, mydataZzsfpzje, mydataJsfpzje, mydataDzfpzje, maxRange, jxxxz) {
        var div = document.getElementById(maskbody);
        if(div){
            echarts.init(div).dispose();
        }
        var myChart = echarts.init(div);
        var mc = provinceMC[id];
        var title = "";
        if (jxxxz === "jx") {
            title = "企业与"+mc+"贸易情况(取得)";
        }
        else {
            title = "企业与"+mc+"贸易情况(开具)";
        }
        var type = getMapType(mc);
// 指定图表的配置项和数据
        var option = {
            title: {
                text: title,
                subtext: '单位：（万元）',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var res = params.name + '<br/>';
                    var myseries = option.series;
                    for (var i = 0; i < myseries.length; i++) {
                        for (var j = 0; j < myseries[i].data.length; j++) {
                            if (myseries[i].data[j].name == params.name) {
                                res += myseries[i].name + ' : ' + myseries[i].data[j].value + '</br>';
                            }
                        }
                    }
                    return res;
                }
            },
            toolbox: {
                show: true,
                feature: {
                    //restore: {show: true},
                    magicType: {show: true, type: ['force', 'chord']},
                    //saveAsImage: {show: true},
                    myTool1: {
                        show:(maskbody=="main_mask_body"?true:false),
                        title: '退出',
                        icon: 'image://../img/closed.png',
                        onclick: function (){
                            $("#mask_fpfx").css("display","none");
                        }
                    }
                }
            },
//     layoutCenter: ['50%', '30%'],
// // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
            layoutSize: 100,
            visualMap: {
                left: (maskbody=="main_mask_body"?'20%':'left'),
                top: 'bottom',
                min: 0,//值域控件最小值
                max: maxRange/6,
                text: ['高', '低'],           // 文本，默认为数值文本
                calculable: true,
                inRange: {
                    color: ['lightskyblue','yellow', 'orangered']
                    //color: ['#E1F5FE', '#29B6F6', '#0288D1', '#01579B']
                },
                show:true,
                formatter: function(params){
                    return "";
                }
            },
            series: [
                {
                    name: '总金额',
                    type: 'map',
                    mapType: type,
                    roam: false,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: mydataFpzje
                },
                {
                    name: '专票金额',
                    type: 'map',
                    mapType: type,
                    roam: false,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: mydataZzsfpzje
                },
                {
                    name: '普票金额',
                    type: 'map',
                    mapType: type,
                    roam: false,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: mydataPtfpzje
                }//,
                // {
                //     name: '卷式票金额',
                //     type: 'map',
                //     mapType: type,
                //     roam: false,
                //     label: {
                //         normal: {
                //             show: true
                //         },
                //         emphasis: {
                //             show: true
                //         }
                //     },
                //     data: mydataJsfpzje
                // },
                // {
                //     name: '电子票金额',
                //     type: 'map',
                //     mapType: type,
                //     roam: false,
                //     label: {
                //         normal: {
                //             show: true
                //         },
                //         emphasis: {
                //             show: true
                //         }
                //     },
                //     data: mydataDzfpzje
                // }
            ]
        };
// // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        myChart.on('click', function(params) {
            loadQypl(maskbody,jxxxz, "sj");
        });
        myChart.showLoading({text: '正在努力的读取数据中...'});
        myChart.hideLoading();
    }

})
