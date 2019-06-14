/**
 * shiyanyan
 * 2018-11-23
 * 功能描述：企业税负
 */
$(function () {
    var startTime=commonUtil.getYearBefore(2).replace("-","");
    var middleTime=commonUtil.getYearBefore(1);
    var endTime=commonUtil.getCurEndMonth().replace("-","");
    var compName=$("#tranName").val();
    var legendArr = [];
    var sk_min=0,sk_max=0,sf_min=0,sf_max=0;
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        color:['#003366', '#006699', '#4cabce','#71C671','#DAA520','#B22222'],
        legend: {
            data: []
        },
        xAxis: [{
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        }],
        yAxis: [{
            type: 'value',
            name: '税款(元)',
            min: 0,
            max: 0,
            interval: 0,
            axisLabel: {
                formatter: '{value}'
            }
        },
            {
                type: 'value',
                name: '税负（百分比）',
                min: 0,
                max: 0,
                interval: 5,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: []
    };

    /**
     * 获取数据
     */
    $.ajax({
        type: "post",
        data: {
            "startTime": startTime,
            "endTime": endTime,
            "compName":compName
        },
        async: false,
        url: "/comp/searchQYSF",
        success: function (result) {
            if (result != null && JSON.stringify(result) != "{}") {
                var data = eval(result);
                $.each(data,function(key,value){
                    var legendStr=getLegendStr(key);
                    legendArr.push(legendStr);
                    var values=[];
                    //按照key排序（Java代码中有序，但是前端js中map不是按月份排列的
                    // 所以中间集合a，按照key排序）
                    var a = [];
                    $.each(value, function(key, val) { a[a.length] = key;});
                    a.sort();
                    $.each(a, function(i, key) {
                        var sigle_value=value[key];
                        if(legendStr.indexOf("税款")!=-1){
                            if(sk_min>sigle_value){
                                sk_min=sigle_value;
                            }
                            if(sk_max<sigle_value){
                                sk_max=sigle_value;
                            }
                        }else{
                            if(sf_min>sigle_value){
                                sf_min=sigle_value;
                            }
                            if(sf_max<sigle_value){
                                sf_max=sigle_value;
                            }
                        }
                        values.push(sigle_value);
                    });
                    var item;
                    //税款税负左右轴分开
                    //switch case 为每条线设置不同的颜色
                    if(key.indexOf("sk")!=-1){
                        switch (key){
                            case "sk_first_year_data":
                                item={name:legendStr, type: 'bar',data:values,
                                    itemStyle : {normal : {
                                        lineStyle:{
                                            color:'#003366'
                                        }
                                    }
                                }};
                                break;
                            case "sk_second_year_data":
                                item={name:legendStr, type: 'bar',data:values,
                                    itemStyle : {
                                        normal : {
                                            lineStyle:{
                                                color:'	#006699'
                                            }
                                        }
                                    }};
                                break;
                            case "sk_third_year_data":
                                item={name:legendStr, type: 'bar',data:values,
                                    itemStyle : {
                                        normal : {
                                            lineStyle:{
                                                color:'	#4cabce'
                                            }
                                        }
                                    }};
                                break;
                            default:
                        }
                    }else{
                        switch (key){
                            case "sf_first_year_data":
                                item={name:legendStr, type: 'line', yAxisIndex: 1,data:values,smooth:true,
                                    itemStyle : {
                                        normal : {
                                            lineStyle:{
                                                color:'	#71C671'
                                            }
                                        }
                                    }};
                                break;
                            case "sf_second_year_data":
                                item={name:legendStr, type: 'line', yAxisIndex: 1,data:values,smooth:true,
                                    itemStyle : {
                                        normal : {
                                            lineStyle:{
                                                color:'#DAA520'
                                            }
                                        }
                                    }};
                                break;
                            case "sf_third_year_data":
                                item={name:legendStr, type: 'line', yAxisIndex: 1,data:values,smooth:true,
                                    itemStyle : {
                                        normal : {
                                            lineStyle:{
                                                color:'#B22222'
                                            }
                                        }
                                    }};
                                break;
                            default:
                        }
                    }
                    option.series.push(item);
                });
                option.legend.data=legendArr;
                option.yAxis[0].min=sk_min;
                option.yAxis[0].max=sk_max+(Math.ceil(sk_max/5));
                option.yAxis[0].interval=Math.ceil(sk_max/5);
                option.yAxis[1].min=sf_min.toFixed(2);
                option.yAxis[1].max=(sf_max+(sf_max/5)).toFixed(2);
                option.yAxis[1].interval=(sf_max/5).toFixed(2);
                var mychart=echarts.init(document.getElementById("qysf"));
                mychart.setOption(option);
            }
        }
    });
    function getLegendStr(key){
        var str="";
        switch (key){
            case "sk_first_year_data":
                str=startTime.substr(0,4)+"年税款";
                break;
            case "sk_second_year_data":
                str=middleTime.substr(0,4)+"年税款";
                break;
            case "sk_third_year_data":
                str=endTime.substr(0,4)+"年税款";
                break;
            case "sf_first_year_data":
                str=startTime.substr(0,4)+"年税负";
                break;
            case "sf_second_year_data":
                str=middleTime.substr(0,4)+"年税负";
                break;
            case "sf_third_year_data":
                str=endTime.substr(0,4)+"年税负";
                break;
            default:
        }
        return str;

    }
});