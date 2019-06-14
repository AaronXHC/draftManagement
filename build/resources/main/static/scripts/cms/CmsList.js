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
        url: "/cms/articleList",
        success: function (result) {
            if(result.list.length>0){
                for(var i=0;i<result.list.length;i++){
                    $("#articleList").append("<li class=\"mui-table-view-cell mui-media\">\n" +
                        "        <a onclick=\"selectArticle('"+result.list[i].ID+"')\">\n" +
                        "            <img class=\"mui-media-object mui-pull-right\" src=\""+result.list[i].IMG_URL+"\">\n" +
                        "            <div class=\"mui-media-body\">\n" +
                        result.list[i].TITLE+
                        "                <p class=\"mui-ellipsis\">"+result.list[i].SUMMARY+"</p>\n" +
                        "<p  class=\"kr-article-author\">"+result.list[i].AUTHOR+"</p>\n" +
                        "\t\t\t\t\t<p  class=\"kr-article-time\">"+result.list[i].PUBLISH_TIME+"</div>"+
                        "            </div>\n" +
                        "        </a>\n" +
                        "    </li>");
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
                            url: "/cms/articleList",
                            success: function (result) {
                                for(var i=0;i<result.list.length;i++){
                                    $("#articleList").append("<li class=\"mui-table-view-cell mui-media\">\n" +
                                        "        <a onclick=\"selectArticle('"+result.list[i].ID+"')\">\n" +
                                        "            <img class=\"mui-media-object mui-pull-right\" src=\""+result.list[i].IMG_URL+"\">\n" +
                                        "            <div class=\"mui-media-body\">\n" +
                                        result.list[i].TITLE+
                                        "                <p class=\"mui-ellipsis\">"+result.list[i].SUMMARY+"</p>\n" +
                                        "<p  class=\"kr-article-author\">"+result.list[i].AUTHOR+"</p>\n" +
                                        "\t\t\t\t\t<p  class=\"kr-article-time\">"+result.list[i].PUBLISH_TIME+"</div>"+
                                        "            </div>\n" +
                                        "        </a>\n" +
                                        "    </li>");
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
    window.open("/cms/CmsContent?id="+id);
}

