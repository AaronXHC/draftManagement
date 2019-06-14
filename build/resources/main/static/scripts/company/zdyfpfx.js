/**
 * @Description:
 * @Author: shiyanyan
 * @Date: 2018/10/11 15:19
 * 自定义发票分析
 */
$(document).click(function () {
    $("#menuContent").hide();
});
$("#menuContent").click(function (event) {
    event.stopPropagation();
});
   $("#xzqh").click(function (event) {
       event.stopPropagation();
   });

$("#xzqh").focus(function(){
    $("#menuContent").show();
});

$(document).bind('click', function(e){

})

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
    console.log(data);
    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
});
window.onload=function(){
    $("#kpyfq").val(getStartTime());
    $("#kpyfz").val(getEndTime());
    $('#searchBtn').click(function(){doSearch()});


}

/**
 *默认开始时间
 * @returns {string}
 */
function getStartTime() {
    var date = new Date();
    var e = date.getFullYear();
    return e+"-01";
}
/**
 * 默认结束时间
 * @returns {string}
 */
function  getEndTime() {
    var date = new Date();
    var e = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var selectDate = e + "-" + month;
    return selectDate;
}
/**
 * 获取查询参数
 * @returns {{kpyfq: (*|jQuery), kpyfz: (*|jQuery), nsrsbh: (*|jQuery), nsrmc: (*|jQuery), jklx: (*|jQuery), hwmc: (*|jQuery), sxje: (*|jQuery)}}
 */
function getSearchParams(){
    var kpyfq = $("#kpyfq").val(); // 开票月份开始
    var kpyfz = $("#kpyfz").val(); // 开票月份结束
    var nsrsbh = $("#nsrsbh").val(); // 纳税人识别号
    var nsrmc = $("#nsrmc").val(); // 纳税人名称
    var jklx = $("#jklx").val(); // 监控类型
    var hwmc = $("#hwmc").val(); // 货物名称
    var sxje=$("#sxje").val();//筛选金额
    var xzqh=$("#xzqhsz_dm").val();
    return {
        kpyfq : kpyfq,
        kpyfz : kpyfz,
        nsrsbh : nsrsbh,
        nsrmc : nsrmc,
        jklx:jklx,
        hwmc : hwmc,
        sxje:sxje,
        xzqh:xzqh
    };
}
function doSearch() {
    var params = getSearchParams();
    $.ajax({
        type: "post",
        data: params,
        url: "/invoice/getZdyfpfx",
        success: function (result) {
            getHtml(result);
        }
    });

}
function getHtml(data) {
    var html = "<table cellpadding='0' cellspacing='0' style='width:1200px'><thead>" +
        "<tr><th style='width:25%' >纳税人名称</th>" +
        "<th style='width:25%' >纳税人识别号</th>"+
        "<th style='width:15%' >总金额</th><th style='width:15%'>专票金额</th>" +
        "<th style='width:15%'>普票金额</th><th style='width:15%'>" +
        "卷式票金额</th><th style='width:15%'>电子票金额</th></tr></thead><tbody>";
    var fpzje, ptfpzje, zzsfpzje,hj,hjdm,jsfpzje,dzfpzje;
    $.each(data, function(index, item) {
        if ("-" === item.QYDM ) {
            hj=item.QYMC;
            hjdm=item.QYDM;
            fpzje = item.FPZJE;
            ptfpzje = item.PP;
            zzsfpzje = item.ZP;
            jsfpzje=item.JS;
            dzfpzje=item.DZ;
        } else {
            html += "<tr><td>"+item.QYMC+"</td><td>"+item.QYDM+"</td>" +
                "<td><a href='javascript:void(0);' onclick='showList(\""+item.QYDM+"\",\"zje\")'>" + item.FPZJE + "</a></td>" +
                "<td><a href='javascript:void(0);' onclick='showList(\""+item.QYDM+"\",\"zp\")'>" + item.ZP + "</a></td>" +
                "<td><a href='javascript:void(0);' onclick='showList(\""+item.QYDM+"\",\"pp\")'>" + item.PP + "</a></td>" +
                "<td><a href='javascript:void(0);' onclick='showList(\""+item.QYDM+"\",\"js\")'>" +item.JS + "</a></td>" +
                "<td><a href='javascript:void(0);' onclick='showList(\""+item.QYDM+"\",\"dz\")'>" +item.DZ + "</a></td>" +
                "</tr>";
        }
    });
    html += "<tr><td >"+hj+"</td><td>"+hjdm+"</td><td>" + fpzje + "</td><td>" + zzsfpzje + "</td><td>" + ptfpzje + "</td><td>" + jsfpzje +
        "</td><td>" + dzfpzje + "</td></tr>";
    $('#resultList').empty().html(html);
    
}
function showList(qydm,fplx){
    $("#fpList").empty();
    //清除分页
    $('#pagination').empty();
    $('#pagination').removeData("twbs-pagination");
    $('#pagination').unbind('page');
    var params = getSearchParams();

    params.qydm=qydm;
    params.fplx=fplx;
    params.page=1;
    console.log(params);
    $.ajax({
        type: "post",
        async:false,
        data: params,
        url: "/invoice/getZdyfpmx",
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
                            url:"/invoice/getZdyfpmx",
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

    $(".fplist_box").show();
    $(".mask").show();
    $('html,body').addClass('ovfHiden');
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
function getDataHtml(result) {
    var searchHtml = "<table cellpadding='0' cellspacing='0' style='width: 2000px;' ><thead>" +
        "<tr>" +
        "<th>发票号码</th>" +
        "<th style='width: 80px'>发票代码</th>" +
        "<th style='width: 250px'>货物名称</th>" +
        "<th>金额</th>" +
        "<th >税额</th><th style='width: 80px'>开票日期</th>" +
        "<th>状态</th><th >发票类型</th>" +
        "<th style='width: 160px'>销方名称</th>" +
        "<th style='width: 160px'>销方纳税人识别号</th>" +
        "<th style='width: 160px'>销方主管税务机关</th>" +
        "<th style='width: 200px'>购方名称</th>" +
        "<th style='width: 160px'>购方纳税人识别号</th>" +
        "<th style='width: 180px'>购方主管税务机关</th><" +
        "/tr>" +
        "</thead><tbody>";
    $.each(result, function (index, item) {
        searchHtml += "<tr><td>"+ item.fphm +"</td><td>" + item.fpdm + "</td><td>" + item.hwmc + "</td>" +
            "<td>" + item.je + "</td><td>"+item.se+"</td><td>" + item.kprq.substr(0,10) + "</td>" +
            "<td>"+(item.zfbz=="N"?"正常":"作废")+"</td>" +
            "<td>" + getType(item.type) + "</td>" +
            "<td title=\""+item.xfmc+"\">" + item.xfmc + "</td>" +
            "<td>" + item.xfsbh + "</td>"+
            "<td title=\""+item.xf_swjgfjmc+"\">" + item.xf_swjgfjmc + "</td>" +
            "<td title=\""+item.gfmc+"\">" + item.gfmc + "</td>" +
            "<td>" + item.gfsbh + "</td>" +
            "<td title=\""+item.gf_swjgfjmc+"\">" + item.gf_swjgfjmc + "</td>" +
            "</tr>";
    });
    searchHtml += " </tbody></table>";
    $("#fpList").html(searchHtml);
}
function getType(type) {
    var type_result;
    switch (type){
        case "pp":
            type_result='普票';
            break;
        case "zp":
            type_result='专票';
            break
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
