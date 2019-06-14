$(function () {
    $("#toRelation").click(function () {
        window.open(encodeURI("/comp/relationDiagram?id=" + $(this).attr('id')));
    });
//        $("#toRelation").click(function () {
//            window.open(encodeURI("/comp/showResult?id=" + $(this).attr('id')));
//        });
    $("#toTrade").click(function () {
        window.open(encodeURI("/comp/showResult?id=" + $(this).attr('id')));
    });
    $("#plfx").click(function () {
        window.open(encodeURI("/invoice/toInvoicePage"));
    });

    $("#usercheck").click(function () {
        window.open(encodeURI("/user/userCheck"));
    });
    $("#invoiceSearch").click(function () {
        window.open(encodeURI("/comp/invoiceSearch"));
    });
    $.ajax({
        type: "get",
        data: {
            "page": 1
        },
        url: "/comp/nsrfx",
        success: function (result) {
            $('#nsrfx_page .sync-pagination').twbsPagination({
                totalPages: result.totalPages,
                onPageClick: function (evt, page) {
                    $.ajax({
                        type: "get",
                        data: {
                            "page": page
                        },
                        url: "/comp/nsrfx",
                        success: function (result) {
                            var searchHtml = "<table cellpadding='0' cellspacing='1'><thead><tr><th style='width:12%'>纳税人名称</th><th style='width:12%'>纳税人识别号</th><th style='width:20%'>所属税务机关</th><th style='width:5%'>法人姓名</th><th style='width:10%'>黑名单认定日期</th><th style='width:5%'>税收管理员</th><th style='width:10%'>黑名单类型</th><th style='width:12%'>操作</th></tr></thead><tbody>";
                            //&nbsp;<a href='/comp/hmdyh?compName=" + item.nsrmc + "'>人员关系</a>
                            $.each(result.result, function (index, item) {
                                searchHtml += "<tr><td>" + item.nsrmc + "</td><td>" + item.nsrsbh + "</td><td>" + item.zgswskfj + "</td><td>" + item.fddbrxm + "</td><td>" + item.rdrq + "</td><td>" + item.ssgly + "</td><td>" + (item.hmdlx!=null?item.hmdlx:"") + "</td><td><a href='/comp/showResult?compName=" + item.nsrmc + "'>企业关系</a>&nbsp;&nbsp;<a href='/comp/main?compName=" + item.nsrmc + "'>企业画像</a></td></tr>";
                            });
                            searchHtml += " </tbody></table>";
                            $("#nsrfx").html(searchHtml);
                        }
                    });

                }
            });
            var searchHtml = "<table cellpadding='0' cellspacing='1'><thead><tr><th style='width:12%'>纳税人名称</th><th style='width:12%'>纳税人识别号</th><th style='width:20%'>所属税务机关</th><th style='width:5%'>法人姓名</th><th style='width:10%'>黑名单认定日期</th><th style='width:5%'>税收管理员</th><th style='width:10%'>黑名单类型</th><th style='width:12%'>操作</th></tr></thead><tbody>";
            //&nbsp;<a href='/comp/hmdyh?compName=" + item.nsrmc + "'>人员关系</a>
            $.each(result.result, function (index, item) {
                searchHtml += "<tr><td>" + item.nsrmc + "</td><td>" + item.nsrsbh + "</td><td>" + item.zgswskfj + "</td><td>" + item.fddbrxm + "</td><td>" + item.rdrq + "</td><td>" + item.ssgly + "</td><td>" + item.hmdlx + "</td><td><a href='/comp/showResult?compName=" + item.nsrmc + "'>企业关系</a>&nbsp;&nbsp;<a href='/comp/main?compName" + item.nsrmc + "'>企业画像</a></td></tr>";
            });
            searchHtml += " </tbody></table>";
            $("#nsrfx").html(searchHtml);
        }
    });
    /**
     *疑似风险人员
     */
    $.ajax({
        type: "get",
        data: {
            "page": 1
        },
        url: "/comp/ysfxry",
        success: function (result) {
            $('#ysfxry_page .sync-pagination').twbsPagination({
                totalPages: result.totalPages,
                onPageClick: function (evt, page) {
                    $.ajax({
                        type: "get",
                        data: {
                            "page": page
                        },
                        url: "/comp/ysfxry",
                        success: function (result) {
                            var searchHtml = "<table cellpadding='0' cellspacing='1'><thead>" +
                                "<tr><th style='width:5%'rowspan='2'>人员名称</th><th style='width:10%' rowspan='2'>身份证件号码</th><th style='width:5%'rowspan='2'>任职黑名单企业总数量</th><th style='width:20%'  colspan='4'>任职正常企业</th></tr>" +
                                "<tr><th style='width:5%'>任法人代表数量</th><th style='width:5%'>任财务人员数量</th><th style='width:5%'>任办税人员数量</th><th style='width:5%'>任购票人员数量</th></tr>" +
                                "</thead><tbody>";
                            $.each(result.result, function (index, item) {
                                var href_param="/comp/relationDiagram?id=toRelation&compName="+item.sfzjhm;
                                if(item.rzhmdzsl>0){
                                    var href_param_hmdqy="/comp/qyxx?SFZJHM="+item.sfzjhm;
                                    searchHtml += "<tr><td><a href='"+href_param+"'>"+ item.ryxm +"</a></td><td>" + item.sfzjhm + "</td><td><a href='"+href_param_hmdqy+"'>" + item.rzhmdzsl + "</td><td>" + item.fddbrzcsl + "</td><td>" + item.cwfzrzcsl + "</td><td>" + item.bsrzcsl + "</td><td>" + item.gprzcsl + "</td></tr>";
                                }else{
                                    searchHtml += "<tr><td><a href='"+href_param+"'>"+ item.ryxm +"</a></td><td>" + item.sfzjhm + "</td><td>" + item.rzhmdzsl + "</td><td>" + item.fddbrzcsl + "</td><td>" + item.cwfzrzcsl + "</td><td>" + item.bsrzcsl + "</td><td>" + item.gprzcsl + "</td></tr>";
                                }
                            });
                            searchHtml += " </tbody></table>";
                            $("#ysfxry").html(searchHtml);
                        }
                    });
                }
            });

        }
    });

});
//搜索跳转 by lkl 2018年5月25日 19:02:39
//加入公司和人的判断，跳转不同的页面
function showResult() {
    var compName = $("#txtAddress").val();
    var flag=$("#flag").val()
    if (compName == null || compName == "") {
        //window.open(encodeURI("/comp/showResult"));
        return;
    } else {
        if(flag=="" || flag==null ||flag=="0"){
            window.open(encodeURI("/comp/main?compName=" + $(".search input").val()));
        }else{
             window.open(encodeURI("/comp/relationDiagram?id=toRelation&compName="+compName))
        }
    }
}
var autoBox = $(".autoComplete"),
    autoUl = $(".autoComplete ul"),
    textFill = $("#txtAddress");
$("#txtAddress").on("keyup", function (e) {
    //38：向上箭头；40：向下箭头；13：Enter键
    if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) {
        textSearch = $(this).val();
        setTimeout(function () {
            autoMapPg.getData(textSearch);
        }, 100)
    }
});

$(".autoComplete ul").on("click", ".suggestItem", function (e) {
    var ft = $(this).attr("data-item");
    textFill.val(ft);
    $("#flag").val($(this).attr("index"))
    $(".autoComplete").css("display", "none");
//        autoMapPg.getData(ft).then(function (data) {
//            //autoMapPg.abovePoint(data,ft)
//        })
});
var autoMapPg = {
    //获取实时提示数据
    getData: function (textSearch) {
        var dfd = $.Deferred();
        if (textSearch) {
            $.ajax({
                type: "get",
                data: {
                    "compName": textSearch.toString().toLowerCase()
                },
                url: "/comp/suggestMode",
                success: function (result) {
                    var searchHtml = "";
                    $.each(result, function (index, item) {

                        searchHtml += '<li class="suggestItem" data-item="' + item.mc + '" index="'+item.flag+'"><i class="default" >' + item.mc + '</i></li>';

                    });

                    autoBox.show().siblings().hide();
                    autoUl.html(searchHtml);
                    listLength = autoUl.children().length;
                    dfd.resolve(result)
                }
            })
            return dfd.promise();
        } else {
            autoUl.html("");
            $(".dataUpload").show();
        }

    }
};

// 检查更新
var screen_w=$(window).width();
var screen_h=$(window).height();
var update_info_box_w=$(".update_info_box").width();
var update_info_box_h=$(".update_info_box").height();
$(".mask").css({"width":screen_w,"height":screen_h});
$(".update_info_box").css({"top":(screen_h-update_info_box_h)/2+'px',"left":(screen_w-update_info_box_w)/2+'px'});
$(".update_info_box .close_btn").click(function(){
    $(this).parent(".update_info_box").hide();
    $(".mask").hide();
    $('html,body').removeClass('ovfHiden');
})
$.ajax({
    type: "get",
    url: "/comp/checkUpdate",
    success: function (result) {
        if(result != ""){
            $(".update_info_conn").html(result);
            $(".update_info_box").show();
            $(".mask").show();
            $('html,body').addClass('ovfHiden');
        }
    }
});
function showAllUpdates(){
    window.open(encodeURI("/comp/showUpdateInfos"));
}
$(document).keypress(function (e) {
    if(e.keyCode==13){
        showResult();
    }
});