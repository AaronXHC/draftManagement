/**
 * @Description:
 * @Author: shiyanyan
 * @Date: 2018/9/21 17:19
 * 税收收入模型算法预测
 */
$(function()  {
    var dw=100000000;
    // var dw=1;
    /**
     * 样式Js
     * @type {*}
     */
    var fl_boxH = $("#fl_box").height();
    var fr_boxH = $("#fr_box").height();
    if (fl_boxH>fr_boxH) {
        $("#fr_box").css('height',fl_boxH);
    }else{
        $("#fl_box").css('height',fr_boxH);
    }
    /**
     * 指定的字段，降序排序
     * @param x
     * @param y
     * @returns {number}
     */
    var desc = function(x,y)
    {
        return (x["value"] < y["value"]) ? 1 : -1
    }
    /**
     * 下载模板
     */
    $("#downloadModel").click(function () {
        window.location.href="/model/download";
    });
    /**
     * 首次加载历史税收预测结果（默认数据为至今12个月前数据，
     * 没有的不显示）
     */
    // get_fact_forecast_contrast();
    var url_default="/model/getRevenueForecastReslutRecent";
    get_result(url_default,"");
    /**
     * 数据预览
     */
    $("#dataScan").click(function () {
        var data_id=$("#data_id").val();
        if(data_id==null || ""==data_id){
            alert("请先选择文件！");
            return;
        }
        var screen_w=$(window).width();
        var screen_h=$(window).height();
        var data_scan_box_w=$(".data_scan_box").width();
        var data_scan_box_h=$(".data_scan_box").height();
        $(".mask").css({"width":screen_w,"height":screen_h});
        $(".data_scan_box").css({"top":(screen_h-data_scan_box_h)/2+'px',"left":(screen_w-data_scan_box_w)/2+'px'});
        $(".data_scan_box .close_btn").click(function(){
            $(this).parent(".data_scan_box").hide();
            $(".mask").hide();
            $('html,body').removeClass('ovfHiden');
        });

        $.ajax({
            type: "get",
            data:{
               "prid":data_id
            },
            url: "/model/selectRevenueModelSourceDataById",
            success: function (result) {
                if(result != ""){
                    var data= JSON.parse(result);
                     var html;
                    for(var i=0;i<data.length;i++){
                        html+="<tr>"
                            +'<td class="c2">'+data[i].swjgmc+'</td>' +
                            '<td class="c2">'+data[i].swjg+'</td>' +
                            '<td class="c2">'+data[i].ycyf+'</td>' +
                            '<td class="c2">'+data[i].tjyf+'</td>' +
                            '<td class="c2">'+data[i].ysbhs+'</td>' +
                            '<td class="c2">'+data[i].wsbhs+'</td>' +
                            '<td class="c2">'+data[i].bysftk+'</td>' +
                            '<td class="c2">'+data[i].tqsftk+'</td>' +
                            '<td class="c2">'+data[i].jmse+'</td>' +
                            '<td class="c2">'+data[i].sssr+'</td>' +
                            '<td class="c2">'+data[i].sssr_tq+'</td>' +
                            '<td class="c2">'+data[i].xznsrhs+'</td>' +
                            '<td class="c2">'+data[i].xznsrhs_sr+'</td>' +
                            '<td class="c2">'+data[i].zxnsrhs+'</td>' +
                            '<td class="c2">'+data[i].zxnsrhs_rksr+'</td>' +
                            '<td class="c2">'+data[i].zxnsrhs_qcruksr+'</td></tr>';
                    }
                    $("#data_scan_result").append(html);
                    $(".data_scan_box").show();
                    $(".mask").show();
                }
            }
        });
    });

    /**
     * 点击提交按钮，调用预测接口，显示预测结果
     */
    $("#comfirm_submit").click(function () {
        var data_id=$("#data_id").val();
        if(data_id==null && ""==data_id){
            alert("请先选择文件");
            return;
        }
        var url="/model/getRevenueForecastReslut";
        get_result(url,data_id);
    });
    function get_result(url,prid) {
        $.ajax({
            type: 'post',
            url: url,
            data: {
                "prid":prid
            },
            async:false,
        }).success(function (data) {
            var revenue_forecast_reslut_list_json=JSON.parse(data);
            //广义线性预测结果,累加
            var lin_result=0;
            //随机森林的预测结果,累加
            var ranforest_result=0;
            //模型系数
            var lincoef;
            //模型常量
            var intercept;
            //随机森林,重要性
            var rffeature_importance;
            for(var i=0;i<revenue_forecast_reslut_list_json.length;i++){
                var revenue_forecast=revenue_forecast_reslut_list_json[i];
                lin_result+=revenue_forecast.lin;
                ranforest_result+=revenue_forecast.ranforest;
                //只需要取值一次,先获取值，再页面显示
                if(i==0){
                    var time=get_xdata_cn(revenue_forecast.ycyf)+"份预测税收收入:";
                    $("#ranforest_time").text(time);
                    $("#lin_time").text(time);
                    lincoef=revenue_forecast.lincoef;
                    intercept=revenue_forecast.linintercept.intercept.toFixed(2);
                    rffeature_importance=revenue_forecast.rffeature_importance;
                }
            }
            //显示到页面
            //线性回归
            $("#lin").text(lin_result+"元");
            get_model_lincoef(lincoef);
            get_mode_intercept(intercept);
            //预测月份税收收入
            get_revenue_forecast(lincoef,intercept);
            //随机森林，结果
            $("#ranforest").text(ranforest_result+"元");
            //随机森林 ，重要性 柱状图展示
            get_ranforest_histogram(rffeature_importance);
            //再一次查看实际和预测的对比结果（包含本次上传的数据）
            get_fact_forecast_contrast();
        }).error(function () {
            alert("上传失败");
        });
        
    }
    /**
     * 随机森林 ，重要性 柱状图展示
     * @param rffeature_importance
     */
    function get_ranforest_histogram(rffeature_importance) {
        var rffeature_importance_array=jsonObjToJsonArray(rffeature_importance);
        rffeature_importance_array.sort(desc);
        var maxValue=rffeature_importance_array[0].value;
        var xdata=new Array();
        var ydata=new Array();
        for(var i=0;i<rffeature_importance_array.length;i++){
            var xname=rffeature_importance_array[i].name;
            xdata.push(get_xnam_cn(xname));
            ydata.push((rffeature_importance_array[i].value/maxValue).toFixed(2));
        }
        var myChartRanforest = echarts.init(document.getElementById('rffeature_importance'));
        var option = {
            title: {
                text: '特征重要性分布',
                textStyle:{
                    fontSize:14
                }
            },
            //调整画布与div容器的距离
            grid:{
                x:2
                // y:25,
                // x2:25,
                // y2:35
            },
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                extraCssText:'width:auto;',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '15%',
                //right: '4%',
                bottom: '35%',
                containLabel: true
            },
            xAxis : [
                {
                    name: '特征',
                    type : 'category',
                    data : xdata,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval:0,
                        rotate:40
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:'重要性指数'
                }
            ],
            series : [
                {
                    name:'特征重要性指数',
                    type:'bar',
                    barWidth: '30%',
                    data:ydata
                }
            ]
        };
        myChartRanforest.setOption(option);
    }
    /**
     * 判断一个数字的正还是负数
     * @param num
     * @returns {*}
     */
    function judgeSign(num) {
        var reg = new RegExp("^-?[0-9]*.?[0-9]*$");
        if ( reg.test(num) ) {
            var absVal = Math.abs(num);
            return num==absVal?"+"+absVal:"-"+absVal;
        }
    }

    /**
     * 页面显示线性系数
     * @param lincoef
     */
    function get_model_lincoef(lincoef) {
        $("#ysbhs").text(lincoef.ySBHS.toFixed(2));
        $("#wsbhs").text(lincoef.wSBHS.toFixed(2));
        $("#bysftk").text(lincoef.bYSFTK.toFixed(2));
        $("#tqsftk").text(lincoef.tQSFTK.toFixed(2));
        $("#jmse").text(lincoef.jMSE.toFixed(2));
        $("#sssr").text(lincoef.sSSR.toFixed(2));
        $("#sssr_tq").text(lincoef.sSSR_TQ.toFixed(2));
        $("#xznsrhs").text(lincoef.xZNSRHS.toFixed(2));
        $("#xznsrhs_sr").text(lincoef.xZNSRHS_SR.toFixed(2));
        $("#zxnsrhs").text(lincoef.zXNSRHS.toFixed(2));
        $("#zxnsrhs_rksr").text(lincoef.zXNSRHS_RKSR.toFixed(2));
        $("#zxnsrhs_qcruksr").text(lincoef.zXNSRHS_QCRUKSR.toFixed(2));
    }

    /**
     * 页面显示线性常量
     * @param intercept
     */
    function get_mode_intercept(intercept) {
        $("#intercept").text(intercept);
    }

    /**
     * 显示线性回归预测的税收收入公式
     * @param lincoef
     * @param intercept
     */
    function get_revenue_forecast(lincoef,intercept) {
        var revenue_forecast_html="预测月份税收收入 = "+lincoef.ySBHS.toFixed(2)+"*应申报户数"+judgeSign(lincoef.wSBHS.toFixed(2))+"*未申报户数 "+judgeSign(lincoef.bYSFTK.toFixed(2))+"*本月税费退库"+judgeSign(lincoef.tQSFTK.toFixed(2))
            +"*同期税费退库"+judgeSign(lincoef.jMSE.toFixed(2))+"*减免税额"+judgeSign(+lincoef.sSSR.toFixed(2))+"*税收收入"+judgeSign(lincoef.sSSR_TQ.toFixed(2))+"同期税费收入"+judgeSign(lincoef.xZNSRHS)+"*新增纳税人户数"+judgeSign(lincoef.xZNSRHS_SR.toFixed(2))
            +"*新增纳税人入库收入"+judgeSign(lincoef.zXNSRHS.toFixed(2))+"*注销纳税人户数"+judgeSign(lincoef.zXNSRHS_RKSR.toFixed(2))+"*注销纳税人户数入库收入"+judgeSign(lincoef.zXNSRHS_QCRUKSR.toFixed(2))+"*注销纳税人户数注销迁出收入"+judgeSign(intercept);
        $("#ycyfsssr").text(revenue_forecast_html);
    }

    /**
     * json对象转自定义的json数组
     * @param map
     * @returns {Array}
     */
    function jsonObjToJsonArray(map){
        var array=[];
        for(var key in map) {
            var a={};
            a.name=key;
            a.value= map[key];
            array.push(a);
        }
        return  array;
    }


    /**
     * 获取x坐标轴的中文名称的中文名称（方法二）
     * @type {{bYSFTK: string, jMSE: string, sSSR: string, sSSR_TQ: string, tQSFTK: string, wSBHS: string, xZNSRHS: string, xZNSRHS_SR: string, ySBHS: string, zXNSRHS: string, zXNSRHS_QCRUKSR: string, zXNSRHS_RKSR: string}}
     */
    var xname_en_cn={"bYSFTK":"本月税费退库",
        "jMSE":"减免税额",
        "sSSR":"税收收入",
        "sSSR_TQ":"同期税收收入",
        "tQSFTK":"同期税费退库",
        "wSBHS":"未申报户数",
        "xZNSRHS":"新增纳税人户数",
        "xZNSRHS_SR":"新增纳税人户数入库收入",
        "ySBHS":"应申报户数",
        "zXNSRHS":"注销纳税人户数",
        "zXNSRHS_QCRUKSR":"注销纳税人户数注销迁出收入",
        "zXNSRHS_RKSR":"注销纳税人户数入库收入"
    }

    /**
     * 获取x坐标轴的中文名称
     * @param xname_en
     * @returns {string}
     */
    function get_xnam_cn(xname_en) {
        var xname_cn="";
        switch (xname_en)
        {
            case "jMSE":
                xname_cn="减免税额";
                break;
            case "sSSR":
                xname_cn="税收收入";
                break;
            case "bYSFTK":
                xname_cn="本月税费退库";
                break;
            case "sSSR_TQ":
                xname_cn="同期税收收入";
                break;
            case "tQSFTK":
                xname_cn="同期税费退库";
                break;
            case "wSBHS":
                xname_cn="未申报户数";
                break;
            case "xZNSRHS":
                xname_cn="新增纳税人户数";
                break;
            case "xZNSRHS_SR":
                xname_cn="新增纳税人户数入库收入";
                break;
            case "zXNSRHS_QCRUKSR":
                xname_cn="注销纳税人户数注销迁出收入";
                break;
            case "zXNSRHS":
                xname_cn="注销纳税人户数";
                break;
            case "ySBHS":
                xname_cn="应申报户数";
                break;
            case "zXNSRHS_RKSR":
                xname_cn="注销纳税人户数入库收入";
                break;
            default:
                xname_cn="";
        }
        return xname_cn;
    }

    /**
     * 获取实际税收收入和预测结果的对比结果
     * 折线图展示
     */
    function get_fact_forecast_contrast() {
        var myEchartContrast=echarts.init(document.getElementById('fact_forecast_contrast'));
        myEchartContrast.clear();
        var xdata=new Array();
        var fact_sssr=new Array();
        var sum_lin=new Array();
        var sum_ranforest=new Array();
        $.ajax({
            type: "post",
            url: "/model/getFactForecastContrast",
            async:false,
            success: function (result) {
                if(result != ""){
                    var tbody_html='<tbody>';
                    var data= JSON.parse(result);
                    var tb_html="<tbody>"
                    for(var i=0;i<data.length;i++){
                        var ycyf=get_xdata_cn(data[i].ycyf);
                        tbody_html+='<tr>' +
                            '<td>'+ycyf+'</td>';
                        //折线图
                        xdata.push(ycyf);
                        if(data[i].fact_sssr!=0.0){
                            fact_sssr.push((data[i].fact_sssr/dw).toFixed(2));
                            tbody_html+= '<td>'+((data[i].fact_sssr/dw).toFixed(2))+'</td>'+
                                '<td>'+((data[i].sum_lin/dw).toFixed(2))+'</td>' +
                                '<td>'+((data[i].cz_lin/dw).toFixed(2))+'</td>' +
                                '<td>'+(data[i].wcl_lin)+'%</td>'+
                                '<td>'+((data[i].sum_ranforest/dw).toFixed(2))+'</td>' +
                                '<td>'+((data[i].cz_ranforest/dw).toFixed(2))+'</td>' +
                                '<td>'+(data[i].wcl_ranforest)+'%</td>';
                        }else{
                            tbody_html+= '<td>-</td>'+
                                '<td>'+((data[i].sum_lin/dw).toFixed(2))+'</td>' +
                                '<td>-</td>' +
                                '<td>-</td>'+
                                '<td>'+((data[i].sum_ranforest/dw).toFixed(2))+'</td>' +
                                '<td>-</td>' +
                                '<td>-</td>';
                        }
                        sum_lin.push((data[i].sum_lin/dw).toFixed(2));
                        sum_ranforest.push((data[i].sum_ranforest/dw).toFixed(2));
                    }
                    tbody_html+="</tbody>";
                    $("#fact_forecast_contrast_tb").append(tbody_html);
                }
            }
        });
        var option = {
            title: {
                text: '',
                // text: '税收收入预测效果对比图',
                textStyle:{
                    fontSize:14
                }
                //subtext: '税收收入预测效果比较图'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                y:"bottom",
                left:"center",
                data:['实际值','线性回归预测值','随机森林预测值']
            },
            toolbox: {
                show: true,
                feature: {
                    // dataZoom: {
                    //     yAxisIndex: 'none'
                    // },
                   // dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis:  {
                type: 'category',
                name:'月份',
                boundaryGap: false,
                data: xdata
            },
            yAxis: {
                type: 'value',
                name:'税收收入(亿元)',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name:'实际值',
                    type:'line',
                    data:fact_sssr
                },
                {
                    name:'线性回归预测值',
                    type:'line',
                    data:sum_lin
                },
                {
                    name:'随机森林预测值',
                    type:'line',
                    data:sum_ranforest
                }
            ]
        };
        myEchartContrast.setOption(option);
    }

    /**
     * 年月转化
     *201809-2018年9月
     */
    function get_xdata_cn(ycyf) {
        var yf=ycyf.substr(4);
        var yf_cn="";
        switch (yf)
        {
            case "01":
                yf_cn="1月";
                break;
            case "02":
                yf_cn="2月";
                break;
            case "03":
                yf_cn="3月";
                break;
            case "04":
                yf_cn="4月";
                break;
            case "05":
                yf_cn="5月";
                break;
            case "06":
                yf_cn="6月";
                break;
            case "07":
                yf_cn="7月";
                break;
            case "08":
                yf_cn="8月";
                break;
            case "09":
                yf_cn="9月";
                break;
            case "10":
                yf_cn="10月";
                break;
            case "11":
                yf_cn="11月";
                break;
            case "12":
                yf_cn="12月";
                break;
            default:
                yf_cn="";
        }
        return ycyf.substr(0,4)+"年"+yf_cn;
    }
    function compare(string1, string2) {
        for(var i=1;i<string1.length;i++){
            var val1 = string1[i];
            var val2 = string2[i];
            if (val1 < val2) {
                return false;
            } else if (val1 > val2) {
                return true;
            }
        }
        return false;
    }
});


function upload(){
    var inputElement = document.getElementById("file");
    var fileList = inputElement.files;
    var file=fileList[0];
    if(!file) return;
    var fileName=file.name;
    var formData = new FormData($('#uploadForm')[0]);
    $.ajax({
        type: 'post',
        url: "/model/uploadAndSave",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
    }).success(function (data) {
        if(data!=null && ""!=data){
            var dataJson=JSON.parse(data);
            if(dataJson.code=="1"){
                $("#data_id").val(dataJson.msg);
                $("#fileName").html("已上传"+fileName);
            }else {
                alert(dataJson.errMsg);
            }
        }else{
            alert("上传失败");
        }
    }).error(function () {
        alert("上传失败");
    });
}