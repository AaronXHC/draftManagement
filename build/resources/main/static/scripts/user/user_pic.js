$(function () {
    /*查看风险企业*/
    $(".check_com").click(function () {
        if($(".taxpayer").css("display")=="none"){
            $(".taxpayer").slideDown();
            $(this).text("关闭风险企业TOP50")
        }else{
            $(".taxpayer").slideUp();
            $(this).text("查看风险企业TOP50")

        }
    });

/*用户画像线开始*/
    var Canvas = {};
    Canvas.cxt = document.getElementById('canvasId').getContext('2d');
    Canvas.Point = function(x, y){
        this.x = x;
        this.y = y;
    };

    /*擦除canvas上的所有图形*/
    Canvas.clearCxt = function(){
        var me = this;
        var canvas = me.cxt.canvas;
        me.cxt.clearRect(0,0, canvas.offsetWidth, canvas.offsetHeight);
    };

    /*时钟*/
    Canvas.Clock = function(){
        var me = Canvas,
            c = me.cxt,
            radius = 220, /*半径*/
            hourangle = (1/12.5)*Math.PI, /*一小时的弧度*/
            center = new me.Point(c.canvas.width/2, c.canvas.height/2); /*圆心*/
        function drawBackGround(){
            c.save();
            c.translate(center.x, center.y); /*平移变换*/
            /*绘制刻度*/
            function drawScale(){
                c.strokeStyle="#e2e2e2";
                c.moveTo(0, 0);
                c.lineTo(radius, 0);
            };
            for (var i = 1; i <= 25; i++) {
                    drawScale();
                c.rotate(hourangle); /*旋转变换*/
            };
            c.stroke();
            c.restore();
        };

        /*依据本机时间绘制时钟*/
        this.drawClock = function(){
            var me = this;

            function draw(){
                var date = new Date();
                Canvas.clearCxt();
                drawBackGround();
            }
            draw();
            setInterval(draw, 1000);
        };
    };

    var main = function(){
        var clock = new Canvas.Clock();
        clock.drawClock();
    };
    window.onload=function(){
        main();
    };



    // var v1dom = document.getElementById("main");
    // var v1 = echarts.init(v1dom);
    // var dataBJ = [[]];
    //
    // var indicatorData = [{
    //     name: '申报风险类',
    //     max: 10
    // }, {
    //     name: '发票风险类',
    //     max: 10
    // }, {
    //     name: '财务报表风险类',
    //     max: 10
    // },{
    //     name: '纳税人管理风险类',
    //     max: 10
    // },{
    //     name: '发票管理风险类',
    //     max: 10
    // }];
    // var lineStyle = {
    //     normal: {
    //         width: 1,
    //         opacity: 0.5
    //     }
    // };
    //
    //  var option = {
    //     color: [],
    //     legend: {
    //         bottom: 0,
    //         orient: 'horizontal',
    //         itemWidth: 30,
    //         itemHeight: 20,
    //         data: [{
    //             name: '',
    //             icon: 'circle',
    //             textStyle: {
    //                 color: "#fc20ff"
    //             }
    //         }]
    //     },
    //     tooltip: {},
    //     radar: {
    //         center: ['50%', '50%'],
    //         indicator: indicatorData,
    //         radius: '60%',
    //         splitNumber: 1,
    //         name: {
    //             textStyle: {
    //                 color: '#333',
    //                 fontSize: 10
    //             }
    //         },
    //         splitLine: {
    //             lineStyle: {
    //                 color: '#fff',
    //                 opacity: 0.5
    //             }
    //         },
    //         splitArea: {
    //             show: true,
    //             areaStyle: {
    //                 color: '#d6d6d6',
    //                 opacity: 0.1
    //             }
    //         },
    //         axisLine: {
    //             show: true,
    //             lineStyle: {
    //                 color: '#C2C9D1',
    //                 opacity: 0.5
    //             }
    //         }
    //     },
    //     series: [{
    //         name: '雷达线ALL',
    //         type: 'radar',
    //         silent: true,
    //         lineStyle: {
    //             normal: {
    //                 type: 'solid',
    //                 color: "#C2C9D1",
    //                 width: 0.5,
    //                 opacity: 1
    //             }
    //         },
    //         data: [[10, 10, 10, 10, 10]],
    //         itemStyle: {
    //             normal: {
    //                 opacity: 0
    //             }
    //         },
    //         areaStyle: {
    //             normal: {
    //                 color: '#d6d6d6',
    //                 opacity: 0
    //             }
    //         }
    //     }, {
    //         name: '雷达线2',
    //         type: 'radar',
    //         silent: true,
    //         lineStyle: {
    //             normal: {
    //                 type: 'solid',
    //                 color: "#C2C9D1",
    //                 width: 0.5,
    //                 opacity: 1
    //             }
    //         },
    //         data: [[8, 8, 8, 8, 8]],
    //         itemStyle: {
    //             normal: {
    //                 opacity: 0
    //             }
    //         },
    //         areaStyle: {
    //             normal: {
    //                 color: 'rgba(0,0,0,0)',
    //                 opacity: 0.1
    //             }
    //         }
    //     }, {
    //         name: '雷达线3',
    //         type: 'radar',
    //         silent: true,
    //         lineStyle: {
    //             normal: {
    //                 type: 'solid',
    //                 color: "#C2C9D1",
    //                 width: 0.5,
    //                 opacity: 1
    //             }
    //         },
    //         data: [
    //             [6, 6, 6, 6, 6]
    //         ],
    //         itemStyle: {
    //             normal: {
    //                 opacity: 0
    //             }
    //         },
    //         areaStyle: {
    //             normal: {
    //                 color: 'rgba(0,0,0,0)',
    //                 opacity: 0.1
    //             }
    //         }
    //     }, {
    //         name: '雷达线4',
    //         type: 'radar',
    //         silent: true,
    //         lineStyle: {
    //             normal: {
    //                 type: 'solid',
    //                 color: "#C2C9D1",
    //                 width: 0.5,
    //                 opacity: 1
    //             }
    //         },
    //         data: [[4,4,4,4,4]],
    //         itemStyle: {
    //             normal: {
    //                 opacity: 0
    //             }
    //         },
    //         areaStyle: {
    //             normal: {
    //                 color: '#d6d6d6',
    //                 opacity: 0.1
    //             }
    //         }
    //     }, {
    //         name: '雷达线5',
    //         type: 'radar',
    //         silent: true,
    //         lineStyle: {
    //             normal: {
    //                 type: 'solid',
    //                 color: "#C2C9D1",
    //                 width: 0.5,
    //                 opacity: 1
    //             }
    //         },
    //         data: [[2, 2, 2, 2, 2]],
    //         itemStyle: {
    //             normal: {
    //                 opacity: 0
    //             }
    //         },
    //         areaStyle: {
    //             normal: {
    //                 color: '#d6d6d6',
    //                 opacity: 0
    //             }
    //         }
    //     }, {
    //         name: '风险指标分布',
    //         type: 'radar',
    //         lineStyle: lineStyle,
    //         data: dataBJ,
    //         symbolSize: 2,
    //         itemStyle: {
    //             normal: {
    //                 borderColor: '#1a56a8',
    //                 borderWidth: 2
    //             }
    //         },
    //         areaStyle: {
    //             normal: {
    //                 color: '#d6d6d6',
    //                 opacity: 0.5
    //             }
    //         }
    //     }, {
    //         name: '雷达线',
    //         type: 'radar',
    //         silent: true,
    //         lineStyle: {
    //             normal: {
    //                 type: 'dotted',
    //                 width: 4,
    //                 opacity: 0.5
    //             }
    //         },
    //         data: [
    //             [6, 5, 6, 4, 2]
    //         ],
    //         itemStyle: {
    //             normal: {
    //                 opacity: 0
    //
    //             }
    //         }
    //     }
    //     ]
    // };
    //
    //
    // v1.setOption(option);
    // var fxzbOption = v1.getOption();

    $('#search_btn').click(function () {
        var nsrmc = $('#NSRMC').val();
        changeNsrhx(nsrmc);
    });
    // firstLoad();
    // function firstLoad() {
    //     var nsrmc=$('#company').val();
    //     getFxzb(nsrmc);
    // }
    function changeNsrhx(nsrmc) {
        // nsrhx(nsrmc);
        nsrxx(nsrmc);
        // getFxzb(nsrmc);
    }

    // function getFxzb(nsrmc) {
    //     $.ajax({
    //         url: "/user/getFxzb",
    //         data: {
    //             "company": nsrmc
    //         },
    //         // traditional: true,//为实现向后台传递数据，后台直接用名字接收 by lkl 2018年5月22日 16:25:45
    //         type: "get",//因高版本tomcat不支持url中包含中文字符，可采用转换后提交或者Post提交
    //         dataType: "json",
    //         success: function (data) {
    //             // if (data) {
    //             //     fxzbOption.series[5].data=[data];
    //             //     v1.setOption(fxzbOption);
    //             // }
    //         }
    //     })
    // }

    //纳税人画像风险项
    $("#search_btn").click(function(){

        var companyName = $("#NSRMC").val()
        $.ajax({
            type: "get",
            data: {
                "company": companyName
            },
            url: "/user/userLable",
            success: function (result) {
                if(result){
                    $("#label_1").empty();
                    $("#label_2").empty();
                    $("#label_3").empty();
                    $("#label_4").empty();
                    $("#label_5").empty();
                    for(var i=0;i<result.length;i++){
                        var res = result[i].labelSjbqCode;
                        if(res!=null && res.indexOf("A")!=-1){
                            if( $("#label_1 span").length<5){
                                $("#label_1").append("<span title="+result[i].labelName + ":"+ result[i].labelValue+">"+
                                    (result[i].labelName=="纳税人状态"?result[i].labelName+":":"")
                                     +result[i].labelValue +"</span>");
                            }
                        }
                        if(res!=null && res.indexOf("B")!=-1){
                            if( $("#label_2 span").length<5){
                                $("#label_2").append("<span title="+result[i].labelName + ":"+ result[i].labelValue+">" + result[i].labelName + ":"+ result[i].labelValue +"</span>");
                            }
                        }
                        if(res!=null && res.indexOf("C")!=-1){
                            if( $("#label_3 span").length<5){
                                $("#label_3").append("<span title="+result[i].labelName + ":"+ result[i].labelValue+">" + result[i].labelName + ":"+ result[i].labelValue +"</span>");
                            }
                        }
                        if(res!=null && res.indexOf("D")!=-1){
                            if( $("#label_4 span").length<5){
                                $("#label_4").append("<span title="+result[i].labelName + ":"+ result[i].labelValue+">" + result[i].labelName + ":"+ result[i].labelValue +"</span>");
                            }
                        }
                        if(res!=null && res.indexOf("E")!=-1){
                            if( $("#label_5 span").length<5){
                                $("#label_5").append("<span>" + result[i].labelName + ":"+ result[i].labelValue +"</span>");
                            }
                        }

                    }

                }

            }
        });

    });




   //纳税人基本信息
    function nsrxx(nsrmc) {
        $.ajax({
            url: "/user/nsrxx",
            data: {
                "company": nsrmc
            },
            type: "get",
            dataType: "json",
            success: function (data) {
                if (data!=null) {
                    $("#xx_nsrmc").text(data.nsrmc);
                    $("#xx_nsrsbh").text(data.nsrsbh);
                    $("#xx_fr").text(data.fddbrxm);
                    $("#xx_sshy").text(data.hymc);
                    $("#xx_djrq").text(data.djrq);
                    $("#xx_swskfj").text(data.swjgmc);
                    $("#xx_zsxm").text(data.zspmmc);
                } else {
                    alert("暂无纳税人信息")
                }
            }
        })
    }
});





