window.onload=function(){
    var url=window.location.search;
    var loc = url.substring(url.lastIndexOf('=')+1, url.length);
    var tranName = $("#tranName").val();
    $("#compName").val(tranName);
    if(loc==="toRelation"){
        $(".relation_box ul li:first-child input").prop("checked",true);
        $(".relation_box ul li:first-child i").css("background","url(../img/check_green.png)");
        $(".relation_box ul li:not(:first-child) input").prop("checked",true);
        $(".relation_box ul li:not(:first-child) i").css("background","url(../img/check_blue.png)");
    }else if(loc==="toTrade"){
        $(".relation_box ul li:first-child input").prop("checked",true);
        $(".relation_box ul li:first-child i").css("background","url(../img/check_green.png)");
    }else{
        $(".relation_box ul li:first-child input").prop("checked",true);
        $(".relation_box ul li:first-child i").css("background","url(../img/check_green.png)");
        $(".relation_box ul li:not(:first-child) input").prop("checked",true);
        $(".relation_box ul li:not(:first-child) i").css("background","url(../img/check_blue.png)");
    }
    if(tranName!=""&&tranName!=null){

        $('#searchBtn').trigger("click");
    }
}
$(function () {
    var tranName = $("#tranName").val();
    $("#compName").val(tranName);
    if (tranName.length > 0) {
        $('#searchBtn').trigger("click");
    }
    //点击查询关系按钮事件 by lkl 2018年5月25日 11:53:45
    $('#searchBtn').click(function(){
        //myChart1.clear();
        //清除分页
        $('#pagination').empty();
        $('#pagination').removeData("twbs-pagination");
        $('#pagination').unbind('page');

        $(".company_info>span").trigger("click");
        var compName = $("#compName").val();
        if (compName == null || compName == "") {
            compName = tranName;
        }
        //获取关联企业名称，实现向后台传递数据格式的数据 by lkl 2018年5月22日 16:26:38
        var nameList = [];
        $("#qy input[type = 'text']").each(function () {
            nameList.push($(this).val());
        })


        var rel = document.getElementsByName('gx');
        //获取复选框选择的关系值 by lkl 2018年5月22日 20:10:44
        var relation = new Array();
        var jygx = "";
        var jyje = $("#jyje").val();
        for (var i = 0; i < rel.length; i++) {
            if (rel[i].checked) {
                if (rel[i].value == 'jygx') {
                    jygx = "jygx";
                } else {
                    relation.push(rel[i].value);
                }
            }
        }
        if(relation.length==0){
            alert("选择关系");
            return;
        }
        if (compName.length == 0) {
            alert("人员姓名不能为空");
            return;
        }
        layui.use('layer', function(){
            var index = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
        });
        /**
         * 获取正常企业四类人员
         */
        $.ajax({
            type: "get",
            data:{
                "page": 1,
                "searchWord": compName,//证件号或者名称
                "compNames": nameList,//公司名称或者纳税人识别号
                "relations": relation //角色
            },
            traditional: true,
            url:"/comp/selectZcqySlry",
            success: function (result) {
                $("#zcslryList").empty();
                if(result.result.length>0){
                    getDataHtml(result);
                    $('.sync-pagination').twbsPagination({
                        totalPages: result.totalPages,
                        onPageClick: function (evt, page) {
                            $.ajax({
                                type: "get",
                                data:{
                                    "page": page,
                                    "searchWord": compName,//证件号或者名称
                                    "compNames": nameList,//公司名称或者纳税人识别号
                                    "relations": relation //角色
                                },
                                traditional: true,
                                url:"/comp/selectZcqySlry",
                                success: function (result) {
                                    getDataHtml(result);
                                }
                            });
                        }
                    });
                    $('.sync-pagination').show();
                }else{
                    $('.sync-pagination').hide();
                }

            }
         });
        /**
         *页面展示数据
         */
        function getDataHtml(result) {
            var searchHtml = "<table cellpadding='0' cellspacing='0' style='width: 1300px;' ><thead>" +
                "<tr><th>正常企业纳税人名称</th><th >纳税人识别号</th><th>税务机关</th><th>主管税务机关</th>" +
                "<th >税收管理员</th><th>注册地址</th><th>注册时间</th><th >现任职务</th></tr>" +
                "</thead><tbody>";
            $.each(result.result, function (index, item) {
                searchHtml += "<tr><td>"+ item.nsrmc +"</td><td>" + item.nsrsbh + "</td><td>" + item.swjgmc2 + "</td><td>" + item.swjgmc + "</td><td>"+item.swryxm+"</td><td>" + item.zcdz + "</td><td>"+item.djrq+"</td><td>" + item.zczwmc + "</td></tr>";
            });
            searchHtml += " </tbody></table>";
            $("#zcslryList").html(searchHtml);
        }

        $.ajax({
            url: "/comp/search",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(getFormJson()),//配合后端controller中接收参数的格式@RequestBody,避免太多的参数手动封装
            traditional: true,//为实现向后台传递数据，后台直接用名字接收 by lkl 2018年5月22日 16:25:45
            type: "POST",//因高版本tomcat不支持url中包含中文字符，可采用转换后提交或者Post提交
            dataType: "json",
            success: function (data) {
                if (data != null && JSON.stringify(data) != "{}") {
                    if($("#main").hasClass("tip")){
                        $("#main").removeClass("tip");
                    }
                    var dataObj = eval(data);
                    showGraph(dataObj);
                } else {
                    echarts.init(document.getElementById("main")).dispose();
                    if(!$("#main").hasClass("tip")){
                        $("#main").append("<p class='tip' style='font-size:20px;text-align: center;padding-top:250px;'>没有找到匹配的关系</p>");
                    }
                }
                layui.use('layer', function(){
                    layer.closeAll('loading');
                });
            }
        });

        function getFormJson() {
            var Json = {
                searchWord: compName,//"河南航天金穗电子有限公司",
                compNames: nameList,//["河南省顺丰速运有限公司"],
                //qy:["郑州市久润润滑油有限责任公司","郑州四海冷却液有限公司","河南天义包装容器有限公司"],
                endDate: "",//"201805",
                startDate: "",//"198001",
                pathDepth: "",
                relations: relation,
                jygx: "",//"jygx",
                jyje:"",
                identifier:"toRelation"
            };
            return Json;
        }
    });
});

function showGraph(dataObj) {
    var nodeCom = [];
    var linkCom = [];
    //查询的人（公司、证件号，纳税人识别号，作为关系图谱 的中心节点）
    var centerParam="\""+$("#compName").val()+"\"";
    //表示是黑名单的
    var black="\"Y\"";
    //表示根据指标确定的疑似黑名单企业；
    var uncertain="\"YS\"";
    //处理企业节点数据,category=1 by lkl 2018年5月25日 16:23:16
    var nodeComp = "[";
    if(dataObj!=null && dataObj.company!=null){
        //默认公司节点的颜色(蓝色)
        var symbolSize=80;
        for (var i = 0; i < dataObj.company.length; i++) {
            var color='#70b9ff';
            var type="否";
             if(dataObj.company[i].name==centerParam ||dataObj.company[i].nsrsbh==centerParam){
                  color='#fec23b';
             }
            if(dataObj.company[i].black==black){
                type="是";
                if(!(dataObj.company[i].name==centerParam ||dataObj.company[i].nsrsbh==centerParam)){
                    color='#ff6633';
                }
            }
            if(dataObj.company[i].black==uncertain){
                type="疑似";
                if(!(dataObj.company[i].name==centerParam ||dataObj.company[i].nsrsbh==centerParam)){
                    color='#c1c1c1';
                }
            }
            nodeComp += "{name:" + dataObj.company[i].djxh + ",des:" + dataObj.company[i].name + ",nsrsbh:" + dataObj.company[i].nsrsbh +",type:'"+type+"',symbolSize:"+symbolSize+",itemStyle:{normal: {color: '"+color+"'}},category:1},";
        }
        nodeComp=nodeComp.substr(0,nodeComp.length-1)+"]";
    }

    var nodeCompObj = eval("(" + nodeComp + ")");

    //处理人员节点,categoty=0 by lkl 2018年5月25日 16:24:46
    if (dataObj!=null && dataObj.people!=null && dataObj.people.length>0) {
        var nodePeop = "[";

        var symbolSize=60;
        for (var i = 0; i < dataObj.people.length; i++) {
            //默认人员节点的颜色
            var color="#99cccc";
            var type="否";
            if(dataObj.people[i].name==centerParam ||dataObj.people[i].zjhm==centerParam ){
                color="#fec23b";
            }
            if(dataObj.people[i].black==black ){
                var type="是";
                if(!(dataObj.people[i].name==centerParam ||dataObj.people[i].zjhm==centerParam)){
                    color='#ff6633';
                }
            }
            nodePeop += "{name:" + dataObj.people[i].zjhm + ",des:" + dataObj.people[i].name + ",type:'"+type+"',symbolSize:"+symbolSize+", itemStyle: {normal: {type: 'dotted',color: '"+color+"'}},category:0},";
        }
        nodePeop=nodePeop.substr(0,nodePeop.length-1)+"]";
        var nodePeopObj = eval("(" + nodePeop + ")");
    }

    //合并企业节点和个人节点，综合整理成图谱的节点 by lkl 2018年5月25日 16:25:27

    if(dataObj!=null){
        if (dataObj.people!=null && dataObj.company!=null && dataObj.people.length > 0 && dataObj.company.length > 0) {
            nodeCom = combine(nodeCompObj, nodePeopObj);
        } else if (dataObj.people!=null && dataObj.people.length > 0) {
            nodeCom = nodePeopObj;
        } else if ( dataObj.company!=null && dataObj.company.length > 0) {
            nodeCom = nodeCompObj;
        }
    }

    //处理企业与个人关系数据 by lkl 2018年5月25日 16:26:38
    if (dataObj!=null && dataObj.work!=null && dataObj.work.length>0) {
        var linkWork = "[";
        for (var i = 0; i < dataObj.work.length; i++) {
            var relWork = dataObj.work[i].type;
            if (relWork.length == 0) {
                relWork = "";
            }
            if (i != dataObj.work.length - 1) {
                linkWork += "{source:" + dataObj.work[i].startId + ",target:" + dataObj.work[i].endId + ",type:'" + relWork + "',category:2},"
            } else {
                linkWork += "{source:" + dataObj.work[i].startId + ",target:" + dataObj.work[i].endId + ",type:'" + relWork + "',category:2}]"
            }
        }
        var linkWorkObj = eval("(" + linkWork + ")");
    }

    //处理企业与企业关系数据 by lkl 2018年5月25日 16:27:05
    var linkSend = "[";
    if(dataObj!=null && dataObj.send!=null){
        for (var i = 0; i < dataObj.send.length; i++) {
            if (i < dataObj.send.length - 1 && dataObj.send[i + 1].id == dataObj.send[i].id && dataObj.send[i + 1].endID == dataObj.send[i].endID) {

            } else {
                if (i != dataObj.send.length - 1) {
                    linkSend += "{source:" + dataObj.send[i].stardID + ",target:" + dataObj.send[i].endID + ",type:'" + changNodeData(dataObj.send[i].fplx) + ":" + dataObj.send[i].kpje + "',weight:1,yf:'" + dataObj.send[i].yf + "',fplx:" + dataObj.send[i].fplx + ",category:2,itemStyle:{normal: {lineWidth:1}}},"
                } else {
                    linkSend += "{source:" + dataObj.send[i].stardID + ",target:" + dataObj.send[i].endID + ",type:'" + changNodeData(dataObj.send[i].fplx) + ":" + dataObj.send[i].kpje + "',weight:1,yf:'" + dataObj.send[i].yf + "',fplx:" + dataObj.send[i].fplx + ",category:2,itemStyle:{normal: {lineWidth:1}}}"
                }
            }

        }
    }

    linkSend += "]";

    var linkSendObj = eval("(" + linkSend + ")");
    //合并两个关系，综合整理为节点之间关系数据 by lkl 2018年5月25日 16:27:53
    if(dataObj!=null){
        if (dataObj.work!=null && dataObj.work.length > 0 && dataObj.send!=null && dataObj.send.length > 0) {
            linkCom = combine(linkWorkObj, linkSendObj);
        } else if (dataObj.work!=null  && dataObj.work.length > 0 ) {
            linkCom = linkWorkObj;
        } else if ( dataObj.send!=null && dataObj.send.length > 0) {
            linkCom = linkSendObj;
        }
    }
   myChart_relationDiagram("main",nodeCom,linkCom);


}
var mask;
function myChart_relationDiagram(id,nodeCom,linkCom,maskBody) {
    echarts.init(document.getElementById(id)).dispose();//销毁前一个实例
    var myChart1 = echarts.init(document.getElementById(id));
    var option = {
        tooltip: {
            formatter: function (params) {
                if (!params.data.hasOwnProperty("name")) {

                } else {
                    var res = "名称：" + params.data.des + '<br/>';
                    var myseries = option.series;
                    for (var i = 0; i < myseries.length; i++) {
                        for (var j = 0; j < myseries[i].data.length; j++) {
                            if (myseries[i].data[j].name == params.name) {
                                if (params.data.category == 0) {
                                    res += "身份证号：" + myseries[i].data[j].name + '</br>';
                                    res+="是否风险人员："+myseries[i].data[j].type+'<br/>';
                                } else if (params.data.category == 1) {
                                    res += "纳税人识别号：" + myseries[i].data[j].nsrsbh + '</br>';
                                    res+="是否风险企业："+myseries[i].data[j].type+'<br/>';
                                }

                            }
                        }
                    }
                    return res;
                }
            }
        },
        graphic: [
            {
                type: 'image',
                id: 'logo',
                left: 0,
                top: 0,
                z: -10,
                bounding: 'raw',
                origin: [75, 75],
                style: {
                    image: '../img/bg.png',
                    width: 1200,
                    height: 500,
                }
            }],
        toolbox: {
            show: true,
            feature: {
                restore: {show: true},
                magicType: {show: true, type: ['force', 'chord']},
                saveAsImage: {show: true},
                myTool2: {
                    show: true,
                    title: '全屏显示',
                    icon: 'image://../img/fullscreen.png',
                    onclick: function (){
                        $("#mask").css("display","block");
                        myChart_relationDiagram("mask-body",nodeCom,linkCom,"关系图谱");
                        if(!maskBody){
                            mask=myChart1;
                        }
                    }
                },
                myTool1: {
                    show: true,
                    title: '退出',
                    icon: 'image://../img/closed.png',
                    onclick: function (){
                        $("#mask").css("display","none");
                    }
                }
            }
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                animation: false,
                //节点圆的大小控制
                symbolSize: 80,
                roam: true,
                edgeSymbol: ['circle', 'arrow'],
                //箭头的两头大小控制
                edgeSymbolSize: [2, 10],
                preventOverlap:true,
                edgeLabel: {
                    normal: {
                        textStyle: {
                            fontSize: 20
                        }
                    }
                },
                force: {
                    repulsion: 800,
                    //关系线的长度控制
                    edgeLength: 150
                },
                draggable: true,
                focusNodeAdjacency:true,
                itemStyle: {
                    normal: {
                        color: '#4b565b'
                    }
                },
                lineStyle: {
                    normal: {
                        width: 2,
                        color: '#4b565b'
                        //curveness: 0.3

                    }
                },
                edgeLabel: {//设置关系名字的属性
                    normal: {
                        show: true,
                        formatter: function (x) {
                            return x.data.type;
                        }
                    }
                },
                label: {//设置节点名字的属性 by lkl 2018年5月23日 17:40:16
                    normal: {
                        show: true,
                        formatter: function (x) {
                            var nodeName = "";
                            if (x.data.des.length > 5 && x.data.des.length <= 11) {
                                nodeName = x.data.des.substring(0, 5) + "\n" + x.data.des.substring(5, x.data.des.length);
                            } else if (x.data.des.length > 11) {
                                nodeName = x.data.des.substring(0, 5) + "\n" + x.data.des.substring(5, 10) + "...";
                            } else {
                                nodeName = x.data.des;
                            }
                            return nodeName;
                        }
                    }
                },
                data: nodeCom,
                links: linkCom
            }
        ]
    };
    myChart1.showLoading({
        text: "站点关系图正在努力加载..."
    });
    myChart1.hideLoading();
    myChart1.setOption(option,true);
    window.onresize = myChart1.resize;
    myChart1.on("dblclick", function (param){
        if(param.dataType == "node" && param.data.category==0 && param.data.type=="是"){
            var sfzh=param.data.name;
            window.open('/comp/qyxx?SFZJHM='+sfzh,'_blank');
        }
    });
}


//合并两个json by lkl 2018年5月23日 19:55:37
function combine(json1, json2) {
    var resultJsonObject = [];
    for (var i = 0; i < json1.length; i++) {
        resultJsonObject[i] = json1[i];
    }
    var m = json1.length;
    for (var j = 0; j < json2.length; j++) {
        resultJsonObject[m] = json2[j];
        m++;
    }
    return resultJsonObject;
}

//发票类型汉化
function changNodeData(fplx) {
    var temp="";
    switch (fplx){
        case '"zp"':
            temp="专票";
            break;
        case '"pp"':
            temp="普票";
            break;
        case '"dz"':
            temp="电子票";
            break;
        case '"js"':
            temp="卷票";
            break;
        case "zp":
            temp="专票";
            break;
        case "pp":
            temp="普票";
            break;
        case "dz":
            temp="电子票";
            break;
        case "js":
            temp="卷票";
            break;
        default:
            break;
    }
    return temp;
}

//转换日期格式  by lkl 2018年5月24日 15:21:34
function changeDate(b) {
    var date = new Date(b);
    var e = date.getFullYear();//获取完整的年份（4位，2017年）
    var month = ("0" + (date.getMonth() + 1)).slice(-2);//获取当前的月份，用2位表示
    var selectDate = e + month;//拼写出的日期201503
    return selectDate;
}

//日历控件默认显示半年时间 by lkl 2018年5月25日 11:19:55
function defultDate() {
    // 先获取当前时间
    var curDate = (new Date()).getTime();
    // 将半年的时间单位换算成毫秒
    var halfYear = 365 / 2 * 24 * 3600 * 1000;
    var pastResult = curDate - halfYear;  // 半年前的时间（毫秒单位）
    // 日期函数，定义起点为半年前
    var pastDate = new Date(pastResult),
        pastYear = pastDate.getFullYear(),
        pastMonth = ("0" + (pastDate.getMonth() + 1)).slice(-2),
        pastDay = pastDate.getDate();

    return pastYear + '-' + pastMonth;
}

function changeDate2(b) {
    var date = new Date(b);
    var e = date.getFullYear();//获取完整的年份（4位，2017年）
    var month = ("0" + (date.getMonth() + 1)).slice(-2);//获取当前的月份，用2位表示
    var selectDate = e + "-" + month;//拼写出的日期2015-03
    return selectDate;
}

//获取url传递的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//页面加载的时候就触发查关系按钮  by lkl 2018年5月27日 09:45:34


