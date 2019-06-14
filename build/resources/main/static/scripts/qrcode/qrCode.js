function selectQrcodeList(){
    $("#qrList").empty();
    $('#pagination').empty();
    $('#pagination').removeData("twbs-pagination");
    $('#pagination').unbind('page');
    $.ajax({
        type: "get",
        data: {
            "pageNum":1
        },
        url: "/qr/selectQrcodeList",
        success: function (result) {
            if(result.list.length>0){
                $('.layout').append("<div class=\"page_box\">\n" +
                    "            <ul class=\"sync-pagination pagination-sm\" style=\"text-align: center\" id=\"pagination\"></ul>\n" +
                    "        </div>");
                $('.sync-pagination').twbsPagination({
                    totalPages: result.pages,
                    visiblePages: result.pages<4?result.pages:4,
                    last:"末页",
                    onPageClick: function (evt, page) {
                        $("#qrList").empty();
                        $.ajax({
                            type: "get",
                            data: {
                                "pageNum": page
                            },
                            url: "/qr/selectQrcodeList",
                            success: function (result) {
                                for(var i=0;i<result.list.length;i++){
                                    $("#qrList").append("<div class=\"item\">\n" +
                                        "                <span class=\"con\" href=\"\">\n" +
                                        "                    <div class=\"con-l\">\n" +
                                        "                        <h3 class=\"title ell\">"+result.list[i].TITLE+"</h3>\n" +
                                        "                        <div class=\"info ell-two\">"+result.list[i].SUMMARY+"</div>\n" +
                                        "                        <div class=\"detail ell\">"+result.list[i].CONTENT+"</div>\n" +
                                        "                    </div>\n" +
                                        "                    <div class=\"con-r\">\n" +
                                        "                        <a href=\"/qr/fileDownLoad?QRCODE_SRC="+result.list[i].QRCODE_SRC+"\">\n" +
                                        "                        <img src=\"/img/arrow.jpg\" alt=\"\">\n" +
                                        "                        </a>\n" +
                                        "                        <img src=\""+result.list[i].QRCODE_SRC+"\" alt=\"\">\n" +
                                        "                    </div>\n" +
                                        "                </span>\n" +
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
    commonUtil.Oauth();
    selectQrcodeList();
}



