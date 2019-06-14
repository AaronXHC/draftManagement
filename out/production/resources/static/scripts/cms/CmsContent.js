


function insertUsageRecord(){
    commonUtil.Oauth();
    $.ajax({
        type: "get",
        data: {
            ID:GetUrlParam("id"),
            USE_TIME:$("#use_time").val(),
            CONTENT_USE:$("#use").val(),
            USERID:$.cookie('UserId'),
            exists:0
        },
        url: "/draft/insertUsageRecord",
        success: function (result) {
            if(result.length>0){
                for(var i=0;i<result.length;i++){
                    $("#record").append(result[i].CONTENT_USE+" "+result[i].USE_TIME+" "+result[i].USERNAME);
                }
                $("#insertRecord").empty();
            }
        }
    });
}

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
            if(result.record.length>0){
                for(var i=0;i<result.record.length;i++){
                    $("#record").append(result.record[i].CONTENT_USE+" "+result.record[i].USE_TIME+" "+result.record[i].USERNAME);
                }
            }else{
                $("#insertRecord").append("<select name=\"sel\" id=\"use\" class=\"c control\">\n" +
                    "        <option value=\"管理版\">管理版</option>\n" +
                    "        <option value=\"营销版\">营销版</option>\n" +
                    "        <option value=\"微信\">微信</option>\n" +
                    "        <option value=\"网站\">网站</option>\n" +
                    "        <option value=\"外围平台\">外围平台</option>\n" +
                    "    </select>\n" +
                    "    <input class=\"form-date control\" name=\"date\" id=\"use_time\" readonly type=\"text\" placeholder=\" 年-月-日\">\n" +
                    "    <button class=\"btn btn-default\" onclick=\"insertUsageRecord();\">添加使用记录</button>");
                $(".form-date").datetimepicker({
                    language: 'zh-CN',
                    autoclose: true,
                    minView: 2,
                    format: 'yyyy-mm-dd',
                    bootcssVer: 3
                });
            }
        }
    });
}