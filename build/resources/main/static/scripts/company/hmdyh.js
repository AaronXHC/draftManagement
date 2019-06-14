window.onload=function(){
    //
    var nsrmc=GetQueryString("compName");
    if(nsrmc){
        $("#NSRMC").val(nsrmc);
    }
    getTax();
    selectHmd();
    $('#searchBtn').click(function(){
        $('.list_box').css('border','none');
        layui.use('layer', function(){
            var index = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
        });
        selectHmd();
    });
    
    $('#export').click(function () {
        var params={
            "XM":$("#XM").val(),
            "NSRMC":$("#NSRMC").val(),
            "SJSWJG_DM":$("#SJSWJG_DM").val()
        };
        var urlParams=preparePostData(params);
        var url="/export/hmdExcel";
        // var url="http://83.20.16.15:8180/export/hmdExcel";
        window.location.href=url+"?"+urlParams;
    })
};


function tc(sfzjhm) {
    var url="/comp/qyxx?SFZJHM="+sfzjhm;
    window.open(encodeURI(url));
}


function selectHmd() {
    $.ajax({
        type: "get",
        data: {
            "page": 1,
            "XM":$("#XM").val(),
            "NSRMC":$("#NSRMC").val(),
            "SJSWJG_DM":$("#SJSWJG_DM").val()
        },
        url: "/comp/hmdyhSearch",
        success: function (result) {
            $("#fpList").empty();
            if(result.result.length>0){
                var html = "<table cellpadding='0' cellspacing='0' style='width:2000px'><thead><tr>" +
                    "<th >正常企业纳税人名称</th><th >纳税人识别号</th><th >社会信用代码</th>" +
                    "<th >税务机关</th><th >主管税务分局</th><th >税管员</th><th >登记日期</th>" +
                    "<th >法人</th><th >法人身份证号</th><th >法人非正常企业任职情况</th><th >财务人员姓名</th>" +
                    "<th >财务人员身份证号</th><th >财务非正常企业任职情况</th><th >办税人姓名</th><th >办税人身份证号</th><th >办税人非正常企业任职情况</th>" +
                    "<th >购票人姓名</th><th >购票人身份证号</th><th >购票人非正常企业任职情况</th></tr></thead><tbody>";
                $.each(result.result, function (index, item) {
                    html += "<tr><td>" + item.nsrmc + "</td><td>" + item.nsrsbh+"</td><td>" + item.shxydm + "</td><td>" + item.swjgmc2 + "</td><td>" + item.swjgmc + "</td>" +
                        "<td>" + item.swryxm + "</td><td>" + item.djrq + "</td><td>" + item.fddbrxm + "</td><td>" +item.fddbrsfzjhm  + "</td><td onclick=tc('"+item.fddbrsfzjhm+"')>" +item.frrzhmdqygs  + "</td>" +
                        "<td >" + item.cwfzrxm + "</td><td>" +item.cwfzrsfzjhm  + "</td><td  onclick=tc('"+item.cwfzrsfzjhm+"')>" +item.cwrzhmdqygs+ "</td>" +
                        "<td>" + item.bsrxm + "</td><td>" + item.bsrsfzjhm + "</td><td onclick=tc('"+item.bsrsfzjhm+"')>" +item.bsrrzhmdqygs  + "</td>" +
                        "<td>" + item.gprxm + "</td><td>" + item.gprsfzjhm+"</td><td onclick=tc('"+item.gprsfzjhm+"')>" +item.gprrzhmdqygs+ "</td>";
                });

                html += "</tbody></table>";

                $("#fpList").html(html);

                $('.sync-pagination').twbsPagination({
                    totalPages: result.totalPages,
                    onPageClick: function (evt, page) {
                        $.ajax({
                            type: "get",
                            data: {
                                "page": page,
                                "XM":$("#XM").val(),
                                "NSRMC":$("#NSRMC").val(),
                                "SJSWJG_DM":$("#SJSWJG_DM").val()
                            },
                            url: "/comp/hmdyhSearch",
                            success: function (data) {

                                var html = "<table cellpadding='0' cellspacing='0' style='width:2000px'><thead><tr>" +
                                    "<th >正常企业纳税人名称</th><th >纳税人识别号</th><th >社会信用代码</th>" +
                                    "<th >税务机关</th><th >主管税务分局</th><th >税管员</th><th >登记日期</th>" +
                                    "<th >法人</th><th >法人身份证号</th><th >法人非正常企业任职情况</th><th >财务人员姓名</th>" +
                                    "<th >财务人员身份证号</th><th >财务非正常企业任职情况</th><th >办税人姓名</th><th >办税人身份证号</th><th >办税人非正常企业任职情况</th>" +
                                    "<th >购票人姓名</th><th >购票人身份证号</th><th >购票人非正常企业任职情况</th></tr></thead><tbody>";
                                $.each(data.result, function (index, item) {
                                    html += "<tr><td>" + item.nsrmc + "</td><td>" + item.nsrsbh+"</td><td>" + item.shxydm + "</td><td>" + item.swjgmc2 + "</td><td>" + item.swjgmc + "</td>" +
                                        "<td>" + item.swryxm + "</td><td>" + item.djrq + "</td><td>" + item.fddbrxm + "</td><td>" +item.fddbrsfzjhm  + "</td><td onclick=tc('"+item.fddbrsfzjhm+"')>" +item.frrzhmdqygs  + "</td>" +
                                        "<td >" + item.cwfzrxm + "</td><td>" +item.cwfzrsfzjhm  + "</td><td  onclick=tc('"+item.cwfzrsfzjhm+"')>" +item.cwrzhmdqygs+ "</td>" +
                                        "<td>" + item.bsrxm + "</td><td>" + item.bsrsfzjhm + "</td><td onclick=tc('"+item.bsrsfzjhm+"')>" +item.bsrrzhmdqygs  + "</td>" +
                                        "<td>" + item.gprxm + "</td><td>" + item.gprsfzjhm+"</td><td onclick=tc('"+item.gprsfzjhm+"')>" +item.gprrzhmdqygs+ "</td>";
                                });

                                html += "</tbody></table>";

                                $("#fpList").html(html);

                            }
                        });
                    }
                });
                $('.list_box').css('border','1px solid #ccc');
            }else{
                $('.sync-pagination').hide()
            }
            layui.use('layer', function(){
                layer.closeAll('loading');
            });
        }
    });
}





function getTax() {
    $.ajax({
        type:'get',
        data:{},
        url:'/comp/tax',
        success:function (result) {
            if(result.result.length>0){
                var  html="<option value=\"\">--未选择---</option>";
                $.each(result.result,function (index,item) {
                    html+="<option value="+item.zzjg_dm_2+">"+item.zzjg_mc_2+"</option>"
                });
                $("#SJSWJG_DM").html(html)
            }
        }
    })

}


//获取url传递的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}



/**
 * 自动组装指定表单数据
 *
 * @param formNames
 *            表单名称数组，可以为空
 * @param params
 *            附加参数对象数组 可以为空
 * @return 返回值对字符串,找不到表单时返回""
 */
function preparePostData (params) {
    var result = [];
    var bUserID = false;
    // 添加附加参数
    if (params) {
        var fjParam = [];
        for (var key in params) {
            var val = params[key] != undefined ? params[key].toString() : "";
            if (key == "CUR_USERID")
                bUserID = true;
            fjParam.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
        }
        result.push(fjParam.join("&"));
    }

    return result.join("&");
}


// //获取url传递的参数
// function GetQueryString(name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//     var r = window.location.search.substr(1).match(reg);
//     if (r != null) return decodeURI(r[2]);
//     return null;
// }
