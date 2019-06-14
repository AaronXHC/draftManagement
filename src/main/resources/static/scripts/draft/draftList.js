! function (window, document, $, undefined) {
    'use strict';
    console.log($);
    $(".form-date").datetimepicker({
        language: 'zh-CN',
        autoclose: true,
        minView: 2,
        format: 'yyyy-mm-dd',
        bootcssVer: 3,
        endDate:new Date()
    });
}(window, document, jQuery);


function searchArticleList(){
    $("#articleList").empty();
    $('#pagination').empty();
    $('#pagination').removeData("twbs-pagination");
    $('#pagination').unbind('page');
    $.ajax({
        type: "get",
        data: {
            "pageNum":1,
            "CJSJS":$('#CJSJS').val(),
            "CJSJE":$('#CJSJE').val(),
            "KEYWORD":$('#KEYWORD').val()
        },
        url: "/draft/draftList",
        success: function (result) {
            if(result.list.length>0){
                for(var i=0;i<result.list.length;i++){
                    $("#articleList").append("<div class=\"item\">\n" +
                        "                <a class=\"con\" onclick=\"selectArticle('"+result.list[i].ID+"')\">\n" +
                        "                    <div class=\"con-l\">\n" +
                        "                        <img src=\""+result.list[i].IMG_URL+"\" alt=\"\">\n" +
                        "                    </div>\n" +
                        "                    <div class=\"con-r\">\n" +
                        "                        <h3 class=\"title ell\">"+result.list[i].TITLE+"</h3>\n" +
                        "                        <div class=\"info ell\">"+result.list[i].SUMMARY+"</div>\n" +
                        "                        <div class=\"detail ell\">"+result.list[i].AUTHOR+"</div>\n" +
                        "                        <div class=\"detail ell\">"+result.list[i].PUBLISH_TIME+"</div>\n" +
                        "                    </div>\n" +
                        "                </a>\n" +
                        "            </div>");
                }
                $('.sync-pagination').twbsPagination({
                    totalPages: result.pages,
                    visiblePages: result.pages<4?result.pages:4,
                    last:"末页",
                    onPageClick: function (evt, page) {
                        $("#articleList").empty();
                        $.ajax({
                            type: "post",
                            data: {
                                "pageNum": page,
                                "CJSJS":$('#CJSJS').val(),
                                "CJSJE":$('#CJSJE').val(),
                                "KEYWORD":$('#KEYWORD').val()
                            },
                            url: "/draft/draftList",
                            success: function (result) {
                                for(var i=0;i<result.list.length;i++){
                                    $("#articleList").append("<div class=\"item\">\n" +
                                        "                <a class=\"con\" onclick=\"selectArticle('"+result.list[i].ID+"')\">\n" +
                                        "                    <div class=\"con-l\">\n" +
                                        "                        <img src=\""+result.list[i].IMG_URL+"\" alt=\"\">\n" +
                                        "                    </div>\n" +
                                        "                    <div class=\"con-r\">\n" +
                                        "                        <h3 class=\"title ell\">"+result.list[i].TITLE+"</h3>\n" +
                                        "                        <div class=\"info ell\">"+result.list[i].SUMMARY+"</div>\n" +
                                        "                        <div class=\"detail ell\">"+result.list[i].AUTHOR+"</div>\n" +
                                        "                        <div class=\"detail ell\">"+result.list[i].PUBLISH_TIME+"</div>\n" +
                                        "                    </div>\n" +
                                        "                </a>\n" +
                                        "            </div>");
                                }
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
}
window.onload=function(){
    /*window.location.href="https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=ww7cfff6e545ddb0fe&agentid=1000009&redirect_uri=http%3A%2F%2F172.17.4.201%3A8180%2Fcms%2FCmsList&state=STATE";*/
    /*commonUtil.Oauth();*/
    searchArticleList();
}
function selectArticle(id) {
    window.open("/draft/Content?id="+id);
}