/**
 * @Description:
 * @Author: shiyanyan
 * @Date: 2018/10/18 8:19
 * 票流分析
 */
$(function () {
    $("#cxlx").bind('change',function(){
        var select_text=$("#cxlx option:selected") .val();
        if(select_text!='hy'){
            $("#sjhydm").val("");
            $("#xzqh").attr("disabled",true)
        }else{
            $("#xzqh").attr("disabled",false)
        }
    });
});
$(document).ready(function(){
    commonUtil.getZtree("/common/getSPBM","treeDemo_SPBM");
});
$("#SPBM").click(function () {
    $("#menuContent_SPBM").show();
});
$("#SPBM").focus(function () {
    $("#menuContent_SPBM").show();
});
$("#xzqh").focus(function(){
    $("#menuContent").show();
});
/**
 * 获取焦点显示树形
 */
$(document).click(function () {
    $("#menuContent").hide();
    $("#menuContent_SPBM").hide();
});

$("#menuContent_SPBM").click(function (event) {
    event.stopPropagation();
});
$("#menuContent").click(function (event) {
    event.stopPropagation();
});

$("#SPBM").click(function (event) {
    event.stopPropagation();
});
$("#xzqh").click(function (event) {
    event.stopPropagation();
});

/**
 * 加载树形数据
 * @type {Array}
 */
var data=[];
$.ajax({
    type: "post",
    data: "",
    async:false,
    url: "/common/getXZQH",
    success: function (result) {
        if(result!=null){
            $.each(result, function (index, item) {
                var sjxzqhsz_dm=item.sjxzqhsz_DM==null?0:item.sjxzqhsz_DM;
                var json_data={ xzqhsz_DM: item.xzqhsz_DM, sjxzqhsz_DM: sjxzqhsz_dm, name:item.xzqhmc,xzqhjc:item.xzqhjc}
                data.push(json_data);
            })
        }
    }
});
var zTreeObj;
// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
var setting = {
    view: {
        dblClickExpand: false,
        showLine: true,
        selectedMulti: false
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "xzqhsz_DM",
            pIdKey: "sjxzqhsz_DM",
            rootPId: ""
        }
    },
    check: {
        enable: true,
        chkStyle: "checkbox"

    },
    callback: {
        //onClick: zTreeOnClick,
        onCheck: zTreeOnCheck
    }
};
function zTreeOnCheck() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var nodes = zTree.getCheckedNodes(true),
        item, inputMc = '', intpuDmSj = '', inputDmDsj = '', halfCheck,
        radio;

    for (var i = 0; i < nodes.length; i++) {
        item = nodes[i];
        if (item['xzqhjc'] === '1') {
            radio = false;
            inputMc += ((inputMc ? ',' : '') + item['name']);
            halfCheck = item.getCheckStatus();
            if (!halfCheck.half) {
                intpuDmSj += ((intpuDmSj ? ',' : '') + item['xzqhsz_DM']);
                radio = true;
            }
            continue;
        }
        if (radio) {
            continue;
        }
        inputDmDsj += ((inputDmDsj ? ',' : '') + item['xzqhsz_DM']);
    }
    $('#xzqh').val(inputMc);
    $('#xzqhsz_dm').val(intpuDmSj + ((inputDmDsj ? (';' + inputDmDsj) : '')));
}
// zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
var zNodes = data;
$(document).ready(function(){
    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
});

var hyjb=1;
window.onload=function(){
    //从纳税人画像跳转，获取带入的参数，查询
    var nsrmc=$("#company").val();
    var startTime=$("#YF").val();
    if(startTime.length>0){
        var st=startTime.substr(0,4)+"-"+startTime.substr(4,5);
        $("#kpyfq").val(st);
    }else{
        $("#kpyfq").val(commonUtil.getDefaultStartTime());
    }
    $("#kpyfz").val(changeDate(new Date()));
    if(nsrmc.length>0){
        $("#nsrmc").val(nsrmc);
        doSearch();
    }
    $('#searchBtn').click(function(){
        doSearch()
    });
    $('#goBackBtn').click(function(){
        goBack();
    });
    $('#cxlx').change(function () {
        var cxlx=$("#cxlx").val();
        if(cxlx!='hy'){
            $("#xzqh").val("");
            hyjb=1;
            $("#yjhydm").val("");
            $("#ejhydm").val("");
            $("#goBackBtn").hide();
        }else if (cxlx!='dq'){
            $("#goBackBtn").hide();
            $("#sjdqdm").val("");
            $("#dsdqdm").val("");
            $("#qxdqdm").val("");
            $("#dqjb").val("sj");
        }else {

        }
        doSearch();
    });
    $('#goBackBtn').hide();
};
// 点击搜索按钮查询，（查询进销项）
function doSearch(){
    var params = getSearchParams();
    if(params.cxlx === 'dq') {
        // 得到本级地区级别
        var dqjb = $("#dqjb").val();
        if (dqjb === "qx") {
            params.dqjb = "qx";
            params.dqdm = $("#dsdqdm").val();
        } else if (dqjb === "ds") {
            params.dqjb = "ds";
            params.dqdm = $("#sjdqdm").val();
        } else{
            $('#dqjb').val('sj');
            params.dqjb = "sj";
        }
    }else if(params.cxlx==='hy'){
        params.dqdm=$("#sjhydm").val();
    }else{
        $('#dqjb').val("qxdq");
        $("#goBackBtn").hide();
    }
    var jxData,xxData;
    //查询进项
    params.jxxxz="jx";
    //加进度条
    layui.use('layer', function(){
        var index = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
    });
    $.ajax({
        type: "post",
        data: params,
        async:false,
        url: "/invoice/getResult",
        success: function (result) {
             jxData=result;
           // getHtml(result, params.cxlx,params.dqdm);
           // $('#cxlxhc').val(params.cxlx);
        }
    });
    //查询销项
    params.jxxxz="xx"
    $.ajax({
        type: "post",
        data: params,
        async:false,
        url: "/invoice/getResult",
        success: function (result) {
            xxData=result;
            // getHtml(result, params.cxlx,params.dqdm);
           // $('#cxlxhc').val(params.cxlx);
        }
    });
    //页面同时展示进销项
    getHtmlJxx(jxData,xxData,params.cxlx,params.dqdm);
    //从后台加载数据之后，进度条消失
    layui.use('layer', function(){
        layer.closeAll('loading');
    });
    $('#cxlxhc').val(params.cxlx);
}
// 点击省、地市时查询地市、区县
function doSearch2(dqdm, dqjb){

    var jxData,xxData;
    var cxlx1=$("#cxlx").val();
    if(cxlx1==="hy"){
        $("#sjhydm").val(dqdm);
        if (dqdm.length===1){
            $("#yjhydm").val(dqdm);
        }
        if (dqdm.length===2){
            $("#ejhydm").val(dqdm);
        }
        if (hyjb===1||hyjb===2||hyjb===3){
            hyjb=hyjb+1;
            $("#hyjb").val(hyjb);
        }
    }
    var params = getSearchParams();
    if(dqjb === "sj"){
        $("#dqjb").val("ds");
        $("#sjdqdm").val(dqdm);
        params.dqjb = 'ds';
    }
    if(dqjb === "ds"){
        $("#dqjb").val("qx");
        $("#dsdqdm").val(dqdm);
        params.dqjb = 'qx';
    }
    params.dqdm = dqdm;
    params.jxxxz="xx";
    //加载进度条
    layui.use('layer', function(){
        var index = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
    });
    $.ajax({
        type: "post",
        data: params,
        async:false,
        url: "/invoice/getResult",
        success: function (result) {
            xxData=result;
        }
    });
    params.jxxxz="jx"
    $.ajax({
        type: "post",
        data: params,
        async:false,
        url: "/invoice/getResult",
        success: function (result) {
           jxData=result;
        }
    });
    getHtmlJxx(jxData,xxData,params.cxlx,params.dqdm);
    //从后台加载数据之后，进度条消失
    layui.use('layer', function(){
        layer.closeAll('loading');
    });
    $("#goBackBtn").show();
}
// 点击返回
function goBack(){
    //加载进度条
    layui.use('layer', function(){
        var index = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
    });
    var xxData,jxData;
    var sjhydm="";
    var cxlx1=$("#cxlx").val();
    if(cxlx1==="hy"){
        if (hyjb===2||hyjb===3||hyjb===4){
            hyjb=hyjb-1;
            $("#hyjb").val(hyjb);
            if(hyjb===3){
                sjhydm=$("#ejhydm").val();
            }
            if(hyjb===2){
                sjhydm=$("#yjhydm").val();
            }
        }
    }
    // 得到本级地区级别
    var dqjb = $("#dqjb").val();
    var params = getSearchParams();
    if(dqjb === "qx"){
        params.dqjb = "ds";
        params.dqdm = $("#sjdqdm").val();
        $("#dqjb").val("ds");
        $("#dsdqdm").val("");
    }else if(dqjb === "ds"){
        params.dqjb = "sj";
        $("#dqjb").val("sj");
        $("#sjdqdm").val("");
    }
    if (cxlx1==='hy'){
        params.dqdm=sjhydm;
    }
    params.jxxxz="xx";
    $.ajax({
        type: "post",
        data: params,
        async:false,
        url: "/invoice/getResult",
        success: function (result) {
            xxData=result;
        }
    });
    params.jxxxz="jx";
    $.ajax({
        type: "post",
        data: params,
        async:false,
        url: "/invoice/getResult",
        success: function (result) {
            jxData=result;
        }
    });
    getHtmlJxx(jxData,xxData,params.cxlx,params.dqdm);
    //从后台加载数据之后，进度条消失
    layui.use('layer', function(){
        layer.closeAll('loading');
    });
    if(cxlx1==='dq'&&$("#dqjb").val() === 'sj'){
        $("#goBackBtn").hide();
    }
    if(cxlx1==='hy'&&hyjb===1){
        $("#goBackBtn").hide();
    }
}
// 获取页面搜索参数
function getSearchParams(){
   // var jxxxz = $("#jxxxz").val(); // 进销项选择 jx进项 xx销项
    var kpyfq = $("#kpyfq").val(); // 开票月份开始
    var kpyfz = $("#kpyfz").val(); // 开票月份结束
    var nsrsbh = $("#nsrsbh").val(); // 纳税人识别号
    var nsrmc = $("#nsrmc").val(); // 纳税人名称
    var cxlx = $("#cxlx").val(); // 查询类别 dq按地区 hy按行业 swjg按税务机关
    var hwmc = $("#hwmc").val(); // 货物名称
    var dqjb = $("#dqjb").val(); // 地区级别 sj省级 ds地市级 qx区县级 qxdq不按地区查询
    if(cxlx != 'dq'){dqjb = 'qxdq'};
    var xzqh=$("#xzqhsz_dm").val();
    var spbm=$("#SPBM_DM").val();
    return {
        //jxxxz : jxxxz,
        kpyfq : kpyfq,
        kpyfz : kpyfz,
        nsrsbh : nsrsbh,
        nsrmc : nsrmc,
        cxlx : cxlx,
        hwmc : hwmc,
        dqjb : dqjb,
        xzqh:xzqh,
        hyjb:hyjb,
        spbm:spbm
    };
}
/*
 开具--->销项
 取得--->进项(可能没有数据)
 */
function getHtmlJxx(jxData,xxData,cxlx,dqdm){
    var mydataFpzje=[],mydataPtfpzje=[],mydataZzsfpzje=[],dw=10000;
    var title = '';
    var style='';
    if(cxlx === 'dq'){title = '地区';style="";$("#main").css("display","block")}
    else if(cxlx === 'hy') { title = '行业'; $("#main").css("display","none")}
    else if(cxlx === 'swjg') { title = '税务机关';$("#main").css("display","none") }
    var html = "<table cellpadding='0' cellspacing='1' style='width:1500px'>" +
        "<thead>" +
        "<tr>" +
        "<th rowspan='2' style='width: 18%'>" + title + "</th>" +
        "<th rowspan='2' style='width: 8%'>贸易总额</th>" +
        "<th rowspan='2' style='width: 8%'>贸易总额占比</th>" +
        "<th rowspan='2' style='width: 8%'>贸易差额</th>" +
        "<th colspan='5' style='width: 33%'>开具</th>" +
        "<th colspan='5' style='width: 33%'>取得</th>" +
        "</tr>" +
        "<tr>" +
        "<th>总金额</th>"+
        "<th>专票金额</th>"+
        "<th>比例</th>"+
        "<th>普票金额</th>"+
        "<th>比例</th>"+
        "<th>总金额</th>"+
        "<th>专票金额</th>"+
        "<th>比例</th>"+
        "<th>普票金额</th>"+
        "<th>比例</th>"+
        "</tr>"+
        "</thead>" +
        "<tbody>";
    var xxfpzje, xxptfpzje, xxzzsfpzje;
    var jxfpzje, jxptfpzje, jxzzsfpzje;
    var myze_fpzje;
    var myce_fpzje;
    var xxmaxRange=0;
    var jxItem;
    var maxRange=1;
    var hj_index;
    $.each(xxData, function(index, item) {
        var html_kj="",html_qd="",html_ze="";
        //地图数据
       if(cxlx === 'dq'){
           var mc=item.FLMC;
           if(item.QYJB === 'sj'){
               mc =getMapType(mc);
           }
           var zje = parseInt(item.FPZJE/dw);
           if (maxRange < zje) {
               maxRange = zje;
           }
           mydataFpzje.push({name: mc, value: (item.FPZJE / dw).toFixed(2)});
           mydataPtfpzje.push({name: mc, value: (item.PP / dw).toFixed(2)});
           mydataZzsfpzje.push({name: mc, value: (item.ZP / dw).toFixed(2)});
       }
        //列表数据
        //总计
        if ("0000" === item.FLDM ) {
            xxfpzje = item.FPZJE;
            xxptfpzje = item.PP;
            xxzzsfpzje = item.ZP;
            jxItem=getJxItem(jxData,"0000");
            jxfpzje=jxItem.FPZJE;
            jxptfpzje= jxItem.PP;
            jxzzsfpzje=jxItem.ZP;
            //记录下合计的下标
            hj_index=index;
        } else {
            //第一个td （名称）
            if(item.QYJB === 'sj' || item.QYJB === 'ds'||(cxlx === 'hy'&&hyjb!==4)) {
                html += "<tr>" +
                    "<td title='"+item.FLMC +"'><a href='javascript:void(0);' onclick='doSearch2(\"" + item.FLDM + "\",\"" + item.QYJB + "\")'>" + item.FLMC + "</a></td>" ;
            }else{
                html += "<tr><td title='"+item.FLMC +"'>" + item.FLMC + "</td>";
            }
            //<a href='javascript:void(0);' onclick='showFpList(\""+item.FLDM+"\",\"zp\",\"xx\")'>
            //贸易总额、占比、差额



            //开具
            html_kj= "<td>" + (item.FPZJE/dw).toFixed(2) + "</td>" +
                "<td>" + (item.ZP/dw).toFixed(2) + "</td>" +
                "<td>"+(item.ZP/item.FPZJE*100).toFixed(2)+"%</td>"+
                "<td>" + (item.PP/dw).toFixed(2) + "</td>" +
                "<td>"+(item.PP/item.FPZJE*100).toFixed(2)+"%</td>";
            //取得
            jxItem=getJxItem(jxData,item.FLDM);
            var id1="myze"+index;
            var id2="myze_zb"+index;

            if(jxItem!=null){
                html_qd = "<td style='white-space: nowrap;'>" +(jxItem.FPZJE/dw).toFixed(2) + "</td>" +
                    "<td style='white-space: nowrap;'>" + (jxItem.ZP/dw).toFixed(2) + "</td>" +
                    "<td>"+(jxItem.ZP/jxItem.FPZJE*100).toFixed(2)+"%</td>"+
                    "<td style='white-space: nowrap;'>" + (jxItem.PP/dw).toFixed(2) + "</td>" +
                    "<td>"+(jxItem.PP/jxItem.FPZJE*100).toFixed(2)+"%</td>";

                html_ze="<td id="+id1+">"+((item.FPZJE+jxItem.FPZJE)/dw).toFixed(2)+"</td>";
                html_ze+="<td id="+id2+"></td>";
                myze_fpzje+=item.FPZJE+jxItem.FPZJE;
                html_ze+="<td>"+((item.FPZJE-jxItem.FPZJE)/dw).toFixed(2)+"</td>";
                myce_fpzje+=item.FPZJE-jxItem.FPZJE;
            }else{
                html_ze="<td id="+id1+">"+(item.FPZJE/dw).toFixed(2)+"</td>";
                html_ze+="<td id="+id2+"></td>";
                myze_fpzje+=item.FPZJE;
                html_ze+="<td>"+(item.FPZJE/dw).toFixed(2)+"</td>";
                myce_fpzje+=item.FPZJE;
                html_qd += "<td>-</td>" +
                    "<td>-</td>" +
                    "<td>-</td>"+
                    "<td>-</td>" +
                    "<td>-</td>";
            }

            html+=html_ze+html_kj+html_qd+"</tr>";
        }
    });
    html += "<tr><td>总计</td>" +
        "<td id='myze_hj'>"+((xxfpzje+jxfpzje)/dw).toFixed(2)+"</td>"+
        "<td id='myze_hj_zb'>"+((xxfpzje+jxfpzje)==0?0:(xxfpzje+jxfpzje)/(xxfpzje+jxfpzje)*100).toFixed(2)+"%</td>"+
        "<td>"+((xxfpzje-jxfpzje)/dw).toFixed(2)+"</td>"+
        "<td>" + (xxfpzje/dw).toFixed(2) + "</td>" +
        "<td>" + (xxzzsfpzje/dw).toFixed(2) + "</td>" +
        "<td>" + (xxfpzje==0?0:xxzzsfpzje/xxfpzje*100).toFixed(2) + "%</td>" +
        "<td >" + (xxptfpzje/dw).toFixed(2) + "</td>" +
        "<td>"+(xxfpzje==0?0:(xxptfpzje/xxfpzje*100)).toFixed(2)+"%</td>" +
        "<td>" + (jxfpzje/dw).toFixed(2) + "</td>" +
        "<td>"+(jxzzsfpzje/dw).toFixed(2)+"</td>" +
        "<td>"+(jxfpzje==0?0:(jxzzsfpzje/jxfpzje*100)).toFixed(2)+"%</td>" +
        "<td>"+(jxptfpzje/dw).toFixed(2)+"</td>" +
        "<td>"+(jxfpzje==0?0:jxptfpzje/jxfpzje*100).toFixed(2)+"%</td>" +
        "</tr></table>";
    $('#resultList').empty().html(html)
    for(var i=0;i<xxData.length;i++){
        if(i==hj_index){
            continue;
        }
        var  val=$("#myze"+i).html();
        var myze_hj=$("#myze_hj").html();
        var zb=(myze_hj==0?0:((val/myze_hj*100).toFixed(2)));
        var val2=$("#myze_zb"+i).html(zb+"%");
    }
    if(cxlx === 'dq'){
        if(typeof(dqdm) == "undefined"){
            loadMapChina(mydataFpzje,mydataPtfpzje,mydataZzsfpzje,maxRange,"xx");
        }else {
            getProviceMap(dqdm,mydataFpzje,mydataPtfpzje,mydataZzsfpzje,maxRange,"xx")
        }
        getJxMapData(jxData,dqdm);
    }
}
function getJxItem(jxData,FLDM) {
    var itemResult=null;
    $.each(jxData,function (index,item){
        var jxFldm=item.FLDM;
        if(jxFldm==FLDM){
            itemResult=item;
            return false;
        }
    });
    return itemResult;
}
/**
 * 进项数据
 * @param data
 */
function getJxMapData(data,dqdm) {
    var mydataFpzje=[],mydataPtfpzje=[],mydataZzsfpzje=[],dw=10000,maxRange=1;
    $.each(data,function (index,item) {
        var mc=item.FLMC;
        if(item.QYJB === 'sj'){
            mc =getMapType(mc);
        }
        var zje = parseInt(item.FPZJE/dw);
        if (maxRange < zje) {
            maxRange = zje;
        }
        mydataFpzje.push({name: mc, value: (item.FPZJE / dw).toFixed(2)});
        mydataPtfpzje.push({name: mc, value: (item.PP / dw).toFixed(2)});
        mydataZzsfpzje.push({name: mc, value: (item.ZP / dw).toFixed(2)});
    });
    if(typeof(dqdm) == "undefined"){
        loadMapChina(mydataFpzje,mydataPtfpzje,mydataZzsfpzje,maxRange,"jx");
    }else {
        getProviceMap(dqdm,mydataFpzje,mydataPtfpzje,mydataZzsfpzje,maxRange,"jx")
    }
}

/* 发票明细弹出层开始 */
var screen_w=$(window).width();
var screen_h=$(window).height();
var fplist_box_w=$(".fplist_box").width();
var fplist_box_h=$(".fplist_box").height();
$(".mask").css({"width":screen_w,"height":screen_h});
$(".fplist_box").css({"top":(screen_h-fplist_box_h)/2+'px',"left":(screen_w-fplist_box_w)/2+'px'});
$(".fplist_box .close_btn").click(function(){
    $(this).parent(".fplist_box").hide();
    $(".mask").hide();
    $('html,body').removeClass('ovfHiden');
})
/**
 * 点击金额数量，查询发票明细
 * @param fldm 代码（地区、行业、税务机关）
 * @param fplx 查询发票类型（总、专、普、卷，电）
 */
function showFpList(fldm,fplx){
    $("#fpList").empty();
    //清除分页
    $('#pagination').empty();
    $('#pagination').removeData("twbs-pagination");
    $('#pagination').unbind('page');
    var params = getSearchParams();
    var dqjb = params.dqjb;
    //if(dqjb === 'qxdq'){
        // 按行业或者税务机关查询发票明细
        params.fldm=fldm;
        params.fplx=fplx;
        params.page=1;

        $.ajax({
            type: "post",
            async:false,
            data: params,
            url: "/invoice/getFpmx",
            success: function (result) {
                if(result.length>0){
                    getDataHtml(result);
                    $('.sync-pagination').twbsPagination({
                        totalPages: result[0].totalPages,
                        onPageClick: function (evt, page) {
                            params.page=page;
                            $.ajax({
                                type: "post",
                                async:false,
                                data: params,
                                url:"/invoice/getFpmx",
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

    // }else{
    //     // 按地区查询发票明细
    //
    // }
    $(".fplist_box").show();
    $(".mask").show();
    $('html,body').addClass('ovfHiden');
}
/* 发票明细弹出层结束 */
function getDataHtml(result) {
    var searchHtml = "<table cellpadding='0' cellspacing='0' style='width: 2000px;' ><thead>" +
        "<tr>" +
        "<th style='width: 80px'>发票代码</th>" +
        "<th>发票号码</th>" +
        "<th style='width: 250px'>货物名称</th>" +
        "<th>金额</th>" +
        "<th >税额</th>" +
        "<th >价税合计</th>" +
        "<th style='width: 80px'>开票日期</th>" +
        "<th>状态</th><th >发票类型</th>" +
        "<th style='width: 160px'>销方名称</th>" +
        "<th style='width: 160px'>销方纳税人识别号</th>" +
        "<th style='width: 140px'>销方主管税务机关</th>" +
        "<th style='width: 200px'>购方名称</th>" +
        "<th style='width: 160px'>购方纳税人识别号</th>" +
        "<th style='width: 160px'>购方主管税务机关</th>" +
        "</tr>" +
        "</thead><tbody>";
    $.each(result, function (index, item) {
        searchHtml += "<tr>" +
            "<td>" + item.fpdm + "</td>" +
            "<td>"+ item.fphm +"</td>" +
            "<td title=\""+item.hwmc+"\">" + item.hwmc + "</td>" +
            "<td title=\""+item.je+"\">" + changeNull(item.je) + "</td>" +
            "<td title=\""+item.se+"\">"+changeNull(item.se)+"</td>" +
            "<td title=\""+item.jshj+"\">"+changeNull(item.jshj)+"</td>" +
            "<td>" + changeNull(item.kprq.substr(0,10)) + "</td>" +
            "<td>"+(item.zfbz=="N"?"正常":"作废")+"</td>" +
            "<td>" + getType(item.type) + "</td>" +
            "<td title=\""+item.xfmc+"\">" + changeNull(item.xfmc) + "</td>" +
            "<td title=\""+item.xfsbh+"\">" + changeNull(item.xfsbh) + "</td>"+
            "<td title=\""+item.xf_swjgfjmc+"\">" +changeNull(item.xf_swjgfjmc)  + "</td>" +
            "<td title=\""+changeNull(item.gfmc)+"\">" + changeNull(item.gfmc) + "</td>" +
            "<td title=\""+changeNull(item.gfsbh)+"\">" + changeNull(item.gfsbh) + "</td>" +
            "<td title=\""+item.gf_swjgfjmc+"\">" + changeNull(item.gf_swjgfjmc) + "</td>" +
            "</tr>";
    });
    searchHtml += " </tbody></table>";
    $("#fpList").html(searchHtml);
}

//日历控件开始时间默认显示半年前的时间
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
function changeDate(b) {
    var date = new Date(b);
    var e = date.getFullYear();//获取完整的年份（4位，2017年）
    var month = ("0" + (date.getMonth() + 1)).slice(-2);//获取当前的月份，用2位表示
    var selectDate = e + "-" + month;//拼写出的日期2015-03
    return selectDate;
}function getType(type) {
    var type_result;
    switch (type){
        case "pp":
            type_result='普票';
            break;
        case "zp":
            type_result='专票';
            break;
        case 'dz':
            type_result='电子票';
            break;
        case 'js':
            type_result='卷式票';
            break;
        default:
            type_result='';
    }
    return type_result;
}
function getMapType(type) {
    var typeMap="";
    switch(type)
    {
        case '黑龙江省':
            typeMap='黑龙江';
            break;
        case '内蒙古自治区':
            typeMap='内蒙古';
            break;
        default:
            typeMap=type.substr(0,2);
    }
    return typeMap;
}

function changeNull(filed) {
    if (filed===null){
        return "-";
    }else {
        return filed;
    }
}

/**
 * 地图展示
 */
function loadProviceMap(id,mydataFpzje,mydataPtfpzje,mydataZzsfpzje,maxRange,jxxxz) {
    var div = document.getElementById('main' + jxxxz);
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
    var type=getMapType(mc);
// 指定图表的配置项和数据
var option = {
    title: {
        text: title,
        subtext: '单位：（万元）',
        left: 'center'
        // bottom:10
        // padding:[0,0,1000,0]
    },
    tooltip: {
        trigger: 'item',
        formatter: function(params) {
            var res = params.name+'<br/>';
            var myseries = option.series;
            for (var i = 0; i < myseries.length; i++) {
                for(var j=0;j<myseries[i].data.length;j++){
                    if(myseries[i].data[j].name==params.name){
                        res+=myseries[i].name +' : '+myseries[i].data[j].value+'</br>';
                    }
                }
            }
            return res;
        }
    },
//     layoutCenter: ['50%', '30%'],
// // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
    layoutSize: 100,
    visualMap: {
        left: 'left',
        top: 'bottom',
        // bottom:10,
        // top: '1000px',
        min : 0,//值域控件最小值
        max: maxRange/6,
        text: ['高','低'],           // 文本，默认为数值文本
        calculable: true,
        inRange: {
            color: ['lightskyblue','yellow', 'orangered']
           // color:['#E1F5FE','#29B6F6','#0288D1','#01579B']
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
            top:60,
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
            data:mydataFpzje
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
            data:mydataZzsfpzje
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
            data:mydataPtfpzje
        }
    ]
};
// // 使用刚指定的配置项和数据显示图表。
    //={visualMap:{show:false}}
myChart.setOption(option);
myChart.showLoading({text: '正在努力的读取数据中...'});
myChart.hideLoading();
}

function loadMapChina(mydataFpzje,mydataPtfpzje,mydataZzsfpzje,maxRange,jxxxz) {
    var div=document.getElementById('main'+jxxxz);
    var chart = echarts.init(div);
    var title_use;
    if (jxxxz === "jx") {
        title_use = "企业与外省贸易情况(取得)";
    }
    else {
        title_use = "企业与外省贸易情况(开具)";
    }
    var option = {
        backgroundColor: '#FFFFFF',
        title: {
            text: title_use,
            subtext: '单位：（万元）',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: function(params) {
                var res = params.name+'<br/>';
                var myseries = option.series;
                for (var i = 0; i < myseries.length; i++) {
                    for(var j=0;j<myseries[i].data.length;j++){
                        if(myseries[i].data[j].name==params.name){
                            res+=myseries[i].name +' : '+myseries[i].data[j].value+'</br>';
                        }
                    }
                }
                return res;
            }
        },
        visualMap: {
            left: 'left',
            top: 'bottom',
            min : 0,//值域控件最小值
            max: maxRange/6,
            text: ['高','低'],           // 文本，默认为数值文本
            calculable: true,
            inRange: {
                 color: ['lightskyblue','yellow', 'orangered']
               // color:['#E1F5FE','#29B6F6','#0288D1','#01579B']
               // color:['#E1F5FE','#29B6F6','#33ffff','#103667','#0288D1','#01579B']
                // ['#426EB4','#1B4F93',"#103667"]
               // color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
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
            data:mydataFpzje
        },{
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
            data:mydataZzsfpzje
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
            data:mydataPtfpzje
        }]
    };
    chart.setOption(option);
}
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
var provinceMC={
    "310000":"上海市",
    "520000":"贵州省",
    "540000":"西藏自治区",
    "630000":"青海省",
    "150000":"内蒙古自治区",
    "320000":"江苏省",
    "220000":"吉林省",
    "360000":"江西省",
    "640000":"宁夏回族自治区",
    "650000":"新疆维吾尔自治区",
    "420000":"湖北省",
    "120000":"天津市",
    "450000":"广西壮族自治区",
    "460000":"海南省",
    "500000":"重庆市",
    "230000":"黑龙江省",
    "110000":"北京市",
    "140000":"山西省",
    "210000":"辽宁省",
    "130000":"河北省",
    "620000":"甘肃省",
    "350000":"福建省",
    "340000":"安徽省",
    "370000":"山东省",
    "530000":"云南省",
    "610000":"陕西省",
    "710000":"台湾省",
    "810000":"香港特别行政区",
    "820000":"澳门特别行政区",
    "510000":"四川省",
    "440000":"广东省",
    "330000":"浙江省",
    "430000":"湖南省",
    "410000":"河南省"
};
function getProviceMap(id,mydataFpzje,mydataPtfpzje,mydataZzsfpzje,maxRange,jxxxz) {
    $("script[src='/scripts/province/*.js']").remove();
    var script=document.createElement("script");
    script.type="text/javascript";
    script.src="/scripts/province/"+provinceMap[id]+".js";
    document.getElementsByTagName('head')[0].appendChild(script);
    //js加载完成执行方法
    script.onload=function(){
        loadProviceMap(id,mydataFpzje,mydataPtfpzje,mydataZzsfpzje,maxRange,jxxxz)
    }
}


