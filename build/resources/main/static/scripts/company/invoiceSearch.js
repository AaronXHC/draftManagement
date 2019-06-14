window.onload=function(){
//默认日期选择　by lkl 2018年5月25日 11:53:55
    $("#kpyfq").val(commonUtil.getFirstMonthEveryYear());
//     $("#kpyfq").val(defultDate());
    $("#kpyfz").val(changeDate2(new Date()));
    //点击查询关系按钮事件 by lkl 2018年5月25日 11:53:45

    $('#searchBtn').click(function(){
        $("#fpList").empty();
        //清除分页
        $('#pagination').empty();
        $('#pagination').removeData("twbs-pagination");
        $('#pagination').unbind('page');
        $.ajax({
            type: "post",
            data: {
                "page": 1,
                "fpdm": $("#fpdm").val(),
                "fphm": $("#fphm").val(),
                "gfmc": $("#gfmc").val(),
                "xfmc": $("#xfmc").val(),
                "gfsbh": $("#gfsbh").val(),
                "xfsbh": $("#xfsbh").val(),
                "hwmc": $("#hwmc").val(),
                "zxje": $("#zxje").val(),
                "zdje": $("#zdje").val(),
                "fplx": $("#fplx").val(),
                "kpyfq": $("#kpyfq").val(),
                "kpyfz": $("#kpyfz").val()
            },
            url: "/invoice/searchFpmx",
            success: function (result) {
                if(result.length>0){
                    getDataHtml(result);
                    $('.sync-pagination').twbsPagination({
                        totalPages: result[0].totalPages,
                        onPageClick: function (evt, page) {
                            $.ajax({
                                type: "post",
                                data: {
                                    "page": page,
                                    "fpdm": $("#fpdm").val(),
                                    "fphm": $("#fphm").val(),
                                    "gfmc": $("#gfmc").val(),
                                    "xfmc": $("#xfmc").val(),
                                    "gfsbh": $("#gfsbh").val(),
                                    "xfsbh": $("#xfsbh").val(),
                                    "hwmc": $("#hwmc").val(),
                                    "zxje": $("#zxje").val(),
                                    "zdje": $("#zdje").val(),
                                    "fplx": $("#fplx").val(),
                                    "kpyfq": $("#kpyfq").val(),
                                    "kpyfz": $("#kpyfz").val()
                                },
                                url: "/invoice/searchFpmx",
                                success: function (result) {
                                    getDataHtml(result);
                                }
                            });
                        }
                    });
                    $('.sync-pagination').show();
                }else{
                    $('.sync-pagination').hide()
                }
            }
        });
    });
    //实现页面意见在就绑定查关系的点击事件 by lkl 2018年5月25日 18:56:41
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
            temp="卷式票";
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

function getDataHtml(result) {
    var searchHtml = "<table cellpadding='0' cellspacing='0' style='width: 2000px;' ><thead>" +
        "<tr>" +
        "<th style='width: 80px'>发票代码</th>" +
        "<th style='width:80px;'>发票号码</th>" +
        "<th style='width: 250px'>货物名称</th>" +
        "<th style='width: 80px'>金额</th>" +
        "<th style='width: 80px'>税额</th>" +
        "<th style='width: 80px'>价税合计</th>" +
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
            "<td title=\""+item.fpdm+"\">" + item.fpdm + "</td>" +
            "<td>"+ item.fphm +"</td>" +
            "<td title=\""+item.hwmc+"\">" + item.hwmc + "</td>" +
            "<td title=\""+item.je+"\">" + item.je + "</td>" +
            "<td title=\""+item.se+"\">"+item.se+"</td>" +
            "<td title=\""+item.jshj+"\">"+changeNull(item.jshj)+"</td>" +
            "<td>" + item.kprq.substr(0,10) + "</td>" +
            "<td>"+(item.zfbz=="N"?"正常":"作废")+"</td>" +
            "<td>" + getType(item.type) + "</td>" +
            "<td title=\""+item.xfmc+"\">" + changeNull(item.xfmc )+ "</td>" +
            "<td  title=\""+item.xfsbh+"\">" + changeNull(item.xfsbh) + "</td>"+
            "<td title=\""+item.xf_swjgfjmc+"\">" + changeNull(item.xf_swjgfjmc) + "</td>" +
            "<td title=\""+item.gfmc+"\">" + changeNull(item.gfmc) + "</td>" +
            "<td title=\""+item.gfsbh+"\">" + changeNull(item.gfsbh) + "</td>" +
            "<td title=\""+item.gf_swjgfjmc+"\">" + changeNull(item.gf_swjgfjmc) + "</td>" +
            "</tr>";
    });
    searchHtml += " </tbody></table>";
    $("#fpList").html(searchHtml);
}

function changeNull(filed) {
    if (filed===null){
        return "-";
    }else {
        return filed;
    }
}


function getType(type) {
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
//页面加载的时候就触发查关系按钮  by lkl 2018年5月27日 09:45:34


