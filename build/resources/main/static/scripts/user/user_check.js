$(function () {
    var cxyf=$("#YF").val()+'';
    if (cxyf===""){
        $("#startTime").val(commonUtil.getStartMonth(1));
    }else {
        var char=cxyf.substr(0,4);//在2的后面插入字符串
        var gshyf= cxyf.replace(char,char+'-');//替换时别忘记把原先的字符加上
        $("#startTime").val(gshyf);
    }
    //第一次加载默认显示年月
    // $("#startTime").val(commonUtil.getStartMonth(1));
    var nsrmc = $('#NSRMC').val();
    if(nsrmc.length>0){
        var yf=$("#startTime").val();
        if(yf==null ||""==yf){
            alert("请选择月份");
            return;
        }else{
            yf=yf.replace("-","");
        }
        $("#QYMC").text(nsrmc);
        nsrhx(nsrmc,yf);
        //$('#search_btn').trigger("click");
    }
    /**
     *点击搜索按钮
     */
    $('#search_btn').click(function () {
        var nsrmc = $('#NSRMC').val();
        if(""==nsrmc){
            alert("请输入纳税人名称或纳税人识别号");
            return;
        }
        var yf=$("#startTime").val();
        if(yf==null ||""==yf){
            alert("请选择月份");
            return;
        }else{
            yf=yf.replace("-","");
        }
        $("#QYMC").text(nsrmc);
        nsrhx(nsrmc,yf);

    });
    $('#NSRMC').focus(function () {
        $("#NSRMC").val("");
    });

    /**
     * 当前年月
     * @returns {string}
     */
    function getCurrentTime() {
        var date = new Date();
        var e = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var currentMonth = e + "-" + month;
        return currentMonth;
    }
    //纳税人画像风险项
    function nsrhx(nsrmc,yf) {
        $.ajax({
            url: "/user/search",
            data: {
                "company": nsrmc,
                "yf":yf
            },
            // traditional: true,//为实现向后台传递数据，后台直接用名字接收 by lkl 2018年5月22日 16:25:45
            type: "get",//因高版本tomcat不支持url中包含中文字符，可采用转换后提交或者Post提交
            dataType: "json",
            success: function (data) {
                if (data) {
                    $("#nsrhx_1 ul").empty();
                    $("#nsrhx_2 ul").empty();
                    $("#nsrhx_3 ul").empty();
                    $("#nsrhx_4 ul").empty();
                    $("#nsrhx_5 ul").empty();
                    $("#nsrhx_6 ul").empty();
                    $("#nsrhx_7 ul").empty();
                    var fxfxzs;
                    for (var i = 0; i < data.length; i++) {
                        //展示共性的五类
                        var zblx = data[i].zblx;
                        switch (zblx) {
                            case '100008':
                                if (data[i].kpi_value === "0") {
                                    $("#nsrhx_1 ul").append("<li><span class=\"normal\"></span><label>" + data[i].kpi_name + "</label></li>");
                                } else {
                                    $("#nsrhx_1 ul").append("<li><span class=\"alert\"></span><label>" + data[i].kpi_name + "</label></li>");
                                }
                                break;
                            case '100004':
                                if (data[i].kpi_value === "0") {
                                    $("#nsrhx_2 ul").append("<li><span class=\"normal\"></span><label>" + data[i].kpi_name + "</label></li>");
                                } else {
                                    $("#nsrhx_2 ul").append("<li><span class=\"alert\"></span><label>" + data[i].kpi_name + "</label></li>");
                                }
                                break;
                            case '100007':
                                if (data[i].kpi_value === "0") {
                                    $("#nsrhx_3 ul").append("<li><span class=\"normal\"></span><label>" + data[i].kpi_name + "</label></li>");
                                } else {
                                    $("#nsrhx_3 ul").append("<li><span class=\"alert\"></span><label>" + data[i].kpi_name + "</label></li>");
                                }
                                break;
                            case '100005':
                                if (data[i].kpi_value === "0") {
                                    $("#nsrhx_4 ul").append("<li><span class=\"normal\"></span><label>" + data[i].kpi_name + "</label></li>");
                                } else {
                                    $("#nsrhx_4 ul").append("<li><span class=\"alert\"></span><label>" + data[i].kpi_name + "</label></li>");
                                }
                                break;
                            case '100002':
                                if (data[i].kpi_value === "0") {
                                    $("#nsrhx_5 ul").append("<li><span class=\"normal\"></span><label>" + data[i].kpi_name + "</label></li>");
                                } else {
                                    $("#nsrhx_5 ul").append("<li><span class=\"alert\"></span><label>" + data[i].kpi_name + "</label></li>");
                                }
                                break;
                            case '900002':
                                $("#fxxs").text(data[i].kpi_value);
                                var fxxs=parseInt(data[i].kpi_value);
                                if(fxxs>=4){
                                    $("#fxcd").text("极高");
                                    $(".checkup_box>div:first").removeAttr("class").attr("class","fx_grade fx_red")
                                    $("#fxtx").text("该企业风险等级极高");
                                }else if (fxxs<4 &&fxxs>0){
                                    $("#fxcd").text("高");
                                    $(".checkup_box>div:first").removeAttr("class").attr("class","fx_grade fx_orange")
                                    $("#fxtx").text("该企业风险等级较高");
                                }else if (fxxs===0){
                                    $("#fxcd").text("正常");
                                    $(".checkup_box>div:first").removeAttr("class").attr("class","fx_grade fx_green")
                                    $("#fxtx").text("该企业体检正常");
                                }
                                break;
                            case  '900003':
                                fxfxzs=data[i].kpi_value;
                                break;
                            default:
                        }
                        //判断是不是建筑、房地产
                        var hydm=data[i].hydm;
                        if(hydm=="K" ){
                            //展示房地产总指标
                            switch (zblx){
                                case  '900005':
                                    if(data[i].kpi_code=="100011"){
                                        $("#zzbs").text(parseInt(data[i].kpi_value)+parseInt(fxfxzs));
                                    }
                                    break;
                                case '100011':
                                    if (data[i].kpi_value === "0") {
                                        $("#nsrhx_7 ul").append("<li><span class=\"normal\"></span><label>" + data[i].kpi_name + "</label></li>");
                                    } else {
                                        $("#nsrhx_7 ul").append("<li><span class=\"alert\"></span><label>" + data[i].kpi_name + "</label></li>");
                                    }
                                    $("#fdc").css("display","block");
                                    $("#jz").css("display","none");
                                    break;
                                default:
                            }
                        }else if(hydm=="E"){
                            //展示建筑
                            switch (zblx){
                                case  '900005':
                                    if(data[i].kpi_code=="100010"){
                                        $("#zzbs").text(parseInt(data[i].kpi_value)+parseInt(fxfxzs));
                                    }
                                    break;
                                case '100010':
                                    if (data[i].kpi_value === "0") {
                                        $("#nsrhx_6 ul").append("<li><span class=\"normal\"></span><label>" + data[i].kpi_name + "</label></li>");
                                    } else {
                                        $("#nsrhx_6 ul").append("<li><span class=\"alert\"></span><label>" + data[i].kpi_name + "</label></li>");
                                    }
                                    $("#jz").css("display","block");
                                    $("#fdc").css("display","none");
                                    break;
                                default:
                            }
                        }else{
                            //展示防虚风险指标
                            $("#zzbs").text(fxfxzs);
                            // switch (zblx){
                            //     case  '900003':
                            //         $("#zzbs").text(data[i].kpi_value);
                            //         break;
                            //     default:
                            // }
                        }
                    }
                }
            }
        });
    }

   // //纳税人基本信息
   //  function nsrxx(nsrmc) {
   //      $.ajax({
   //          url: "/user/nsrxx",
   //          data: {
   //              "company": nsrmc
   //          },
   //          type: "get",
   //          dataType: "json",
   //          success: function (data) {
   //              if (data) {
   //                  $("#xx_nsrmc").text(data.nsrmc);
   //                  $("#xx_nsrsbh").text(data.nsrsbh);
   //                  $("#xx_fr").text(data.fddbrxm);
   //                  $("#xx_sshy").text(data.hymc4);
   //                  // $("#xx_swskfj").text(data.swjgmc);
   //              } else {
   //                  alert("暂无纳税人信息")
   //              }
   //          }
   //      })
   //  }

});





