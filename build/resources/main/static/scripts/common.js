/**
 * @Description:
 * @Author: shiyanyan
 * @Date: 2018/10/23 14:07
 * 公共js
 */
var commonUtil = function () {
    return {
        getSetting: function () {
            var setting = {
                view: {
                    dblClickExpand: false,
                    showLine: true,
                    selectedMulti: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                        rootPId: ""
                    }
                },
                check: {
                    enable: true,
                    chkStyle: "checkbox"

                },
                callback: {
                    onCheck: commonUtil.zTreeOnCheck
                }
            }
            return setting;
        },
        getZtreeData: function (url) {
            var data = [];
            $.ajax({
                type: "post",
                data: "",
                async: false,
                url: url,
                success: function (result) {
                    if (result != null) {
                        $.each(result, function (index, item) {
                            var sjdm = item.SJDM == null ? 0 : item.SJDM;
                            var json_data = {id: item.DM, pid: sjdm, name: item.MC, jc: item.JC}
                            data.push(json_data);
                        })
                    }
                }
            });
            return data;
        },
        zTreeOnCheck: function (event, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            var nodes = zTree.getCheckedNodes(true),
                item, inputMc = '', inputDm = '', halfCheck,
                radio;
            for (var i = 0; i < nodes.length; i++) {
                item = nodes[i];
                radio = false;
                inputMc += ((inputMc ? ',' : '') + item['name']);
                inputDm += ((inputDm ? ',' : '') + item['id'])
                halfCheck = item.getCheckStatus();
                if (!halfCheck.half) {
                    radio = true;
                }
                continue;
                if (radio) {
                    continue;
                }
            }
            $("#" + treeId).parent().parent().find("input").eq(0).val(inputMc);
            $("#" + treeId).parent().parent().find("input").eq(1).val(inputDm)
        },
        getZtree: function (url, id) {
            var zTreeObj = $.fn.zTree.init($("#" + id), commonUtil.getSetting(), commonUtil.getZtreeData(url));
        },
        getZtree2: function (data, setting, id) {
            var zTreeObj = $.fn.zTree.init($("#" + id), setting, data);
        },
        /**
         * 形成下拉框数据
         * @param url
         * @param id
         */
        getSelectData: function (url, id) {
            $.ajax({
                type: "post",
                data: "",
                async: false,
                url: url,
                success: function (result) {
                    if (result != null) {
                        var selectparam;
                        $.each(result, function (index, item) {
                            selectparam += '<option value="' + item.DM + '">' + item.MC + '</option>';
                        })
                        $("#" + id).append(selectparam);
                    }
                }
            });
        },
        preparePostData: function (params) {
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
        },
        /**
         * 获取当前月份之前的n+1月份
         * @param n
         * @returns {string}
         */
        getStartMonth: function (n) {
            var d = new Date();
            // 因为getMonth()获取的月份的值只能在0~11之间所以我们在进行setMonth()之前先给其减一
            d.setMonth((d.getMonth() - 1) - n);
            var yy1 = d.getFullYear();
            var mm1 = d.getMonth() + 1;
            var dd1 = d.getDate();
            if (mm1 < 10) {
                mm1 = '0' + mm1;
            }
            return yy1 + "-" + mm1;
        },
        /**
         * 获取当前月份
         * @returns {string}
         */
        getCurEndMonth: function () {
            var date = new Date();
            var e = date.getFullYear();//获取完整的年份（4位，2017年）
            var month = ("0" + (date.getMonth() + 1)).slice(-2);//获取当前的月份，用2位表示
            var selectDate = e + "-" + month;//拼写出的日期2015-03
            return selectDate;
        },
        getYearBefore:function (n) {
            var date = new Date();
            var e = date.getFullYear()-n;//获取完整的年份（4位，2017年）
            return e+"-"+"01";
        },
        getFirstMonthEveryYear:function () {
            var date = new Date();
            var e = date.getFullYear();//获取完整的年份（4位，2017年）
            return e+"-"+"01";
        },
        getBasePath: function () {
            var port = window.location.port;
            var hostname = location.hostname;
            return "http://" + hostname + ":" + port;
        },
        /**
         * 获取默认的开始时间
         * 如果是当前时间是前半年----则默认开始时间是去年1月
         * 如果是当前时间是后半年---则默认开始时间是今年1月
         */
        getDefaultStartTime:function () {
            var defaultStartTime;
            var date = new Date();
            var curMonth=date.getMonth()+1;
            if(curMonth<=6){
                defaultStartTime=date.getFullYear()-1+"-01";
            }else{
                defaultStartTime=date.getFullYear()+"-01";
            }
            return defaultStartTime;
        },

        /**
         * Created by Administrator on 2015/10/31.
         *
         * 实现类似jsp中<%=basePath%>的功能，获取项目根目录有助于url的填写
         *
         * 使用方法，用类似引用jQuery的方法引入本插件
         *
         * 定义一个全局的变量，然后的ready方法内部掉用本方法，获得basePath
         */
        getBasePath1: function () {
            //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
            var curWwwPath = window.document.location.href;
            //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            //获取主机地址，如： http://localhost:8080
            var localhostPath = curWwwPath.substring(0, pos);
            //获取带"/"的项目名，如：/ems
            var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            //获取项目的basePath   http://localhost:8080/ems/
            return localhostPath + projectName + "/";
        },
        Oauth : function(){
            if(commonUtil.GetQueryString("code")!=null){
                //设置登陆后的cookie
                $.ajax({
                    type: "get",
                    async: false,
                    data: {
                        code:commonUtil.GetQueryString("code")
                    },
                    url: "/workWeChat/getuserinfo",
                    success: function (result) {
                        $.cookie('UserId', result.userinfo.UserId);
                        accessToken = result.accessToken;
                    }
                });
            }
            var UserId = $.cookie('UserId');
            if (typeof(UserId)=="undefined") {
                var redirectUrl = encodeURIComponent(window.location.href);
                window.location.href = "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=ww7cfff6e545ddb0fe&agentid=1000009&redirect_uri="+redirectUrl+"&state=STATE"
            }
        },
        GetQueryString:function(name){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        }

    }
}();

