function GetUrlParam(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
                return arr[1];
            }
        }
        return "";
    }
    else {
        return "";
    }
}
window.onload=function(){
    /*commonUtil.Oauth();*/
    var id = GetUrlParam("id");
    $.ajax({
        type: "get",
        data: {
            id:id
        },
        url: "/cms/articleContent",
        success: function (result) {
            console.log(result);
            $("#title").append(result.info[0].TITLE);
            $("#publish_time").append(result.info[0].PUBLISH_TIME);
            $("#author").append(result.info[0].AUTHOR);
            $("#summary").append(result.info[0].SUMMARY);
            for(var a=0;a<result.content.length;a++){
                $("#content").append(result.content[a].CONTENT);
            }
        }
    });
}