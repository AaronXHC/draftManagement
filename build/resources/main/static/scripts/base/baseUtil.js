var baseUtil = function (){}();
var accessToken = "";
baseUtil.checkOauth = function () {
    if(baseUtil.GetQueryString(code)!=null){
        //设置登陆后的cookie
        $.ajax({
            type: "get",
            async: false,
            data: {
                code:baseUtil.GetQueryString(code)
            },
            url: "/workWeChat/getuserinfo",
            success: function (result) {
                $.cookie('UserId', result.userinfo.UserId);
                accessToken = result.accessToken;
            }
        });
    }
    var UserId = $.cookie('UserId');
    if (UserId=="undefined") {
        var redirectUrl = encodeURIComponent(window.location.href);
        window.location.href = "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=ww7cfff6e545ddb0fe&agentid=1000009&redirect_uri="+redirectUrl+"&state=STATE"
    }
}

baseUtil.GetQueryString = function(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

