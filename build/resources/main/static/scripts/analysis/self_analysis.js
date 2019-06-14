/**
 * @Description:
 * @Author: shiyanyan
 * @Date: 2018/10/18 8:19
 * 自助分析
 */
/**
 * 初始化加载
 */
$(document).ready(function(){
   commonUtil.getZtree("/common/getHY","treeDemo_HY");
    commonUtil.getZtree("/common/getZGSWJG","treeDemo_ZGSWJG");
    commonUtil.getZtree("/common/getDJZCLX","treeDemo_DJZCLX");
    commonUtil.getZtree("/common/getZGSWSKFJ","treeDemo_ZGSWSKFJ");
    commonUtil.getZtree("/common/getKZZTDJLX","treeDemo_KZZTDJLX");
});
/**
 * 获取焦点显示树形
 */
$("#ZGSWJG").focus(function () {
    $("#menuContent_ZGSWJG").show();
});
$("#ZGSWSKFJ").focus(function () {
    $("#menuContent_ZGSWSKFJ").show();
});
$("#KZZTDJLX").focus(function () {
    $("#menuContent_KZZTDJLX").show();
});
$("#DJZCLX").focus(function () {
    $("#menuContent_DJZCLX").show();
});
$("#HY").focus(function () {
    $("#menuContent_HY").show();
});





$(document).click(function () {
    $("#menuContent_ZGSWJG").hide();
    $("#menuContent_ZGSWSKFJ").hide();
    $("#menuContent_KZZTDJLX").hide();
    $("#menuContent_DJZCLX").hide();
    $("#menuContent_HY").hide();
});
$("#menuContent_ZGSWJG").click(function (event) {
    event.stopPropagation();
});
$("#menuContent_ZGSWSKFJ").click(function (event) {
    event.stopPropagation();
});
$("#menuContent_KZZTDJLX").click(function (event) {
    event.stopPropagation();
});
$("#menuContent_DJZCLX").click(function (event) {
    event.stopPropagation();
});
$("#menuContent_HY").click(function (event) {
    event.stopPropagation();
});

$("#ZGSWJG").click(function () {
    event.stopPropagation();
});
$("#ZGSWSKFJ").click(function (event) {
    event.stopPropagation();
});
$("#KZZTDJLX").click(function (event) {
    event.stopPropagation();
});
$("#DJZCLX").click(function (event) {
    event.stopPropagation();
});
$("#HY").click(function (event) {
    event.stopPropagation();
});

/**
 * 加载纳税人状态
 */
commonUtil.getSelectData("/analysis/getNsrzt","nsrzt")
/**
 * 加载增值税
 */
commonUtil.getSelectData("/common/getZZSQYLX","ZZSQYLX");
/**
 * 获取街道乡镇
 */
commonUtil.getSelectData("/common/getJDXZ","JDXZ");

/**
 * 页面默认加载（数据来源 为申报小规模）
 */
load('1');
/**
 * 监听数据选择下拉框
 * 加载分组和指标项目
 */
$('#sbxx').change(function () {
    var tslx=$("#sbxx").val();
    load(tslx);
});
/**
 * 上传文件
 * @param url 到control处理的url
 * @param file_name_id 页面显示文件名称的id
 * @param data_hidden_id 页面隐藏数据标标识的id
 */
function upload(url,file_name_id,data_hidden_id){
    var inputElement = document.getElementById("file");
    var fileList = inputElement.files;
    var file=fileList[0];
    if(!file) return;
    var fileName=file.name;
    var formData = new FormData($('#uploadForm')[0]);
    $.ajax({
        type: 'post',
        url: url,
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
    }).success(function (data) {
        if(data!=null && ""!=data){
            var dataJson=JSON.parse(data);
            if(dataJson.code=="1"){
                var result=dataJson.msg;
                $("#"+data_hidden_id).val(result.path);
                $("#"+file_name_id).html("已上传"+fileName);
            }else {
                alert(dataJson.errMsg);
            }
        }else{
            alert("上传失败");
        }
    }).error(function () {
        alert("上传失败");
    });
}

/**
 * 加载分组项目和指标项目
 */
function load(tslx) {
    $.ajax({
        type: "post",
        data: {
            tslx:tslx
        },
        async:false,
        url: "/analysis/getZztszd",
        success: function (result) {
            if(result!=null){
                //<th><input type="checkbox" id="checkedAll" />全选/全选</th>
                var html_com='<table cellpadding="0" cellspacing="0" style="width:800px"><colgroup><col style="" /><col style="width: 80px;" /></colgroup><tbody>';
                //var html_nsrxx='<table cellpadding="0" cellspacing="0" style="width:800px"><thead><tr><th width="10%"></th><th>纳税人信息过滤字段</th></tr></thead><tbody>';
                var html_fzxm="",html_zbxm="",html_nsrxxxm="";
                $.each(result, function (index, item) {
                    if(item.lx=='1'&& "2"!=item.tslx){
                        html_zbxm+='<tr><td>'+item.zwmc+'</td><td><input type="checkbox" name="zbxm" value="'+item.ywmc+' " mc="'+item.zwmc+'" ly="'+item.tslx+'"  style="zoom:150%;"></td></tr>'
                    }else{
                        //纳税人信息的字符型数据
                        if("2"==item.tslx){
                            var zwmc=item.zwmc;
                            if(zwmc.indexOf('代码')!=-1){
                                zwmc=zwmc.replace('代码','');
                            }
                            html_nsrxxxm+='<tr><td>'+zwmc+'</td><td><input type="checkbox" name="nsrxxxm" value="'+item.ywmc+'" mc="'+zwmc+'" ly="'+item.tslx+'"  style="zoom:150%;"></td></tr>'
                        }else{
                            html_fzxm+='<tr><td>'+item.zwmc+'</td><td><input type="checkbox" name="fzxm" value="'+item.ywmc+'" mc="'+item.zwmc+'" ly="'+item.tslx+'"  style="zoom:150%;"></td></tr>'
                        }
                    }
                })
                var nsrxx=html_com+html_nsrxxxm+'</tbody></table>';
                var zbxm=html_com+html_zbxm+'</tbody></table>';
                var fzxm=html_com+html_fzxm+'</tbody></table>';
                $("#fpList_fzxm").empty().append(fzxm);
                $("#fpList_zbxm").empty().append(zbxm);
                $("#fpList_nsrxxxm").empty().append(nsrxx);
            }
        }
    });
}
$(".sumbit_fzxm").click(function () {
    var chk_value =[];
    var chk_mc=[];
    $('input[name="fzxm"]:checked').each(function(){
       // var json={ly:$(this).attr("ly"),value:$(this).val()}
        chk_value.push($(this).val());
        chk_mc.push($(this).attr("mc"))
    });
    if(chk_value.length==0){
        alert("至少选中一项分组项目");
        return false;
    }
    if(chk_value.length>5){
        alert("最多可以选五项项分组项目");
        return false;
    }
    var chk_value_str="",chk_mc_str="";
    for(var i=0;i<chk_mc.length;i++){
        if(i!=chk_mc.length-1){
            chk_mc_str+=chk_mc[i]+",";
        }else{
            chk_mc_str+=chk_mc[i];
        }
    }
   $("#fzxm_ZWMC").val(chk_mc_str);
    for(var i=0;i<chk_value.length;i++){
        if(i!=chk_value.length-1){
            chk_value_str+=chk_value[i]+",";
        }else{
            chk_value_str+=chk_value[i];
        }
    }
    //$("#fzxm_YWMC").val(JSON.stringify(chk_value));
    $("#fzxm_YWMC").val(chk_value_str);
    $("#fzxm").hide();
    $(".mask").hide();
    $('html,body').removeClass('ovfHiden');
});
$(".sumbit_zbxm").click(function () {
    var chk_value =[];
    var chk_mc=[];
    $('input[name="zbxm"]:checked').each(function(){
      //  var json={ly:$(this).attr("ly"),value:$(this).val()}
        var mc=$(this).attr("mc")
        chk_value.push($(this).val());
        chk_mc.push(mc);
    });
    if(chk_value.length==0){
        alert("至少选中一项指标项目");
        return false;
    }
    if(chk_value.length>5){
        alert("最多可以选五项项指标项目");
        return false;
    }
    var chk_value_str="",chk_mc_str="";
    for(var i=0;i<chk_mc.length;i++){
        if(i!=chk_mc.length-1){
            chk_mc_str+=chk_mc[i]+",";
        }else{
            chk_mc_str+=chk_mc[i];
        }
    }
    $("#zbxm_ZWMC").val(chk_mc_str);
    for(var i=0;i<chk_value.length;i++){
        if(i!=chk_value.length-1){
            chk_value_str+=chk_value[i]+",";
        }else{
            chk_value_str+=chk_value[i];
        }
    }
    //$("#zbxm_YWMC").val(JSON.stringify(chk_value));
    $("#zbxm_YWMC").val(chk_value_str);
    $("#zbxm").hide();
    $(".mask").hide();
    $('html,body').removeClass('ovfHiden');
});
$(".sumbit_nsrxxxm").click(function () {
    var chk_value =[];
    var chk_mc=[];
    $('input[name="nsrxxxm"]:checked').each(function(){
        //  var json={ly:$(this).attr("ly"),value:$(this).val()}
        var mc=$(this).attr("mc")
        chk_value.push($(this).val());
        chk_mc.push(mc);
    });
    if(chk_value.length==0){
        alert("至少选中一项纳税人信息");
        return false;
    }
    if(chk_value.length>5){
        alert("最多可以选五项纳税人信息");
        return false;
    }
    var chk_value_str="",chk_mc_str="";
    for(var i=0;i<chk_mc.length;i++){
        if(i!=chk_mc.length-1){
            chk_mc_str+=chk_mc[i]+",";
        }else{
            chk_mc_str+=chk_mc[i];
        }
    }
    $("#nsrxxxm_ZWMC").val(chk_mc_str);
    for(var i=0;i<chk_value.length;i++){
        if(i!=chk_value.length-1){
            chk_value_str+=chk_value[i]+",";
        }else{
            chk_value_str+=chk_value[i];
        }
    }
    //$("#zbxm_YWMC").val(JSON.stringify(chk_value));
    $("#nsrxxxm_YWMC").val(chk_value_str);
    $("#nsrxxxm").hide();
    $(".mask").hide();
    $('html,body').removeClass('ovfHiden');
});

function doSearch() {
    if(btxy()){
        var params= getSearchParams();
        console.log(params);
        $.ajax({
            type: "post",
            data: params,
            url: "/analysis/getResultData",
            success: function (result) {
                getHtml(result);
                console.log(result);
            }
        });
    }
}
function btxy() {
    var skssqq=$("#skssqq").val();
    var skssqz=$("#skssqz").val();
    var fzxm=$("#fzxm_YWMC").val();
    var zbxm=$("#zbxm_YWMC").val();
    var nsrxxxm=$("#nsrxxxm_YWMC").val();
    if(""==skssqq){
        alert("请选择所属期");
        return false;
    }
    if(""==skssqz){
        alert("请选择所属期");
        return false;
    }
    if(""==fzxm){
        alert("至少选中一项分组项目");
        return false;
    }
    if(""==zbxm){
        alert("至少选中一项指标项目");
        return false;
    }
    if(""==nsrxxxm){
        alert("至少选中一项纳税人信息");
        return false;
    }
    return true;
    
}
function getHtml(result) {
    var zwmc_fzxm_array=$("#fzxm_ZWMC").val().split(",");
    var ywmc_fzxm_array=$("#fzxm_YWMC").val().split(",");

    var zwmc_array=$("#zbxm_ZWMC").val().split(",");
    var ywmc_array=$("#zbxm_YWMC").val().split(",");
    var zwmc_nsrxx_array=$("#nsrxxxm_ZWMC").val().split(',');
    var ywmc_nsrxx_array=$("#nsrxxxm_YWMC").val().split(",");
    var html = "<table cellpadding='0' cellspacing='0' style='width:1200px'><thead>" +
        "<tr><th style='width:45%'>纳税人名称</th>" +
        "<th style='width:35%' >纳税人识别号</th>"+
        "<th style='width:60%'>主管税务机关</th>" ;
    for(var i=0;i<zwmc_nsrxx_array.length;i++){
        var zwmc=zwmc_nsrxx_array[i];
        html+="<th style='width:35%' title='"+zwmc+"'>"+zwmc+"</th>"
    }
    for(var i=0;i<zwmc_fzxm_array.length;i++){
        var zwmc=zwmc_fzxm_array[i];
        html+="<th style='width:35%' title='"+zwmc+"'>"+zwmc+"</th>"
    }
    for(var i=0;i<zwmc_array.length;i++){
        var zwmc=zwmc_array[i];
         html+="<th style='width:35%' title='"+zwmc+"'>"+zwmc+"</th>";
    }
    html+=  "</tr></thead><tbody>";
    console.log(html);
    $.each(result, function(index, item) {
        html+="<tr>" +
            "<td title='"+item.NSRMC+"'>"+item.NSRMC+"</td>" +
            "<td>"+item.NSRSBH+"</td>" +
            "<td title='"+item.SWJGMC+"'>"+item.SWJGMC+"</td>" ;
           var nsrxxxmHtml="";
           for(var i=0;i<ywmc_nsrxx_array.length;i++){
               var ewmc=ywmc_nsrxx_array[i].trim();
               nsrxxxmHtml+="<td>"+item[ewmc]+"</td>";
           }
           html+=nsrxxxmHtml;
        var fzxmHtml="";
        for(var i=0;i<ywmc_fzxm_array.length;i++){
            var ewmc=ywmc_fzxm_array[i].trim();
            fzxmHtml+="<td>"+item[ewmc]+"</td>";
        }
        html+=fzxmHtml;
        var zbxmHtml="";
        for(var i=0;i<ywmc_array.length;i++){
            var ewmc=ywmc_array[i].trim();
            zbxmHtml+="<td>"+item[ewmc]+"</td>";
        }
        html+=zbxmHtml;
        html+="</tr>"
    });
    html+="</table>";
    $('#resultList').empty().html(html);
}
$('#searchBtn').click(function(){doSearch()});
$("#export").click(function () {
    if(btxy()){
        var params= getSearchParams();
        var znxm_mc=$("#zbxm_ZWMC").val();
        var fzxm_mc=$("#fzxm_ZWMC").val();
        var nsrxxxm_mc=$("#nsrxxxm_ZWMC").val();
        params.fzxm_mc=fzxm_mc;
        params.zbxm_mc=znxm_mc;
        params.nsrxxxm_mc=nsrxxxm_mc;
        var urlParams=preparePostData(params);
        var url="/export/analysisExcel";
        window.location.href=url+"?"+urlParams;
    }

});
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
/**
 * 获取参数
 * @returns {{tabName: (*|jQuery), sbyf: (*|jQuery), skssqq: (*|jQuery), skssqz: (*|jQuery), nsrzt_dm: (*|jQuery), zgswjg_dm: (*|jQuery), zgswskfj_dm: (*|jQuery), djrqq: (*|jQuery), djrqz: (*|jQuery), kzztdjlx_dm: (*|jQuery), djzclx_dm: (*|jQuery), hy_dm: (*|jQuery), jdxz_dm: (*|jQuery), zzsqylx_dm: (*|jQuery), nsrxxxm: (*|jQuery), fzxm: (*|jQuery), zbxm: (*|jQuery)}}
 */
function getSearchParams(){
    var tabName=$("#sbxx").val();
    var sbyf=$("#sbyf").val();
    var skssqq=$("#skssqq").val();
    var skssqz=$("#skssqz").val();
    var nsrzt_dm=$("#nsrzt").val();
    var zgswj_dm=$("#ZGSWJG_DM").val();
    var zgswskfj_dm=$("#ZGSWSKFJ_DM").val();
    var djrqq=$("#djrqq").val();
    var djrqz=$("#djrqz").val();
    var kzztdjlx_dm=$("#KZZTDJLX_DM").val();
    var djzclx_dm=$("#DJZCLX_DM").val();
    var hy_dm=$("#HY_DM").val();
    var jdxz_dm=$("#JDXZ").val();
    var zzsqylx_dm=$("#ZZSQYLX").val();
    var fzxm=$("#fzxm_YWMC").val();
    var zbxm=$("#zbxm_YWMC").val();
    var nsrxxxm=$("#nsrxxxm_YWMC").val();
    return{
        tabName:tabName,
        sbyf:sbyf,
        skssqq:skssqq,
        skssqz:skssqz,
        nsrzt_dm:nsrzt_dm,
        zgswj_dm:zgswj_dm,
        zgswskfj_dm:zgswskfj_dm,
        djrqq:djrqq,
        djrqz:djrqz,
        kzztdjlx_dm:kzztdjlx_dm,
        djzclx_dm:djzclx_dm,
        hy_dm:hy_dm,
        jdxz_dm:jdxz_dm,
        zzsqylx_dm:zzsqylx_dm,
        nsrxxxm:nsrxxxm,
        fzxm:fzxm,
        zbxm:zbxm
    }
}
var screen_w=$(window).width();
var screen_h=$(window).height();
var fplist_box_w=$(".fplist_box").width();
var fplist_box_h=$(".fplist_box").height();
$(".mask").css({"width":screen_w,"height":screen_h});
$(".fplist_box").css({"top":(screen_h-fplist_box_h)/10+'px',"left":(screen_w-fplist_box_w)/2+'px'});
$(".fplist_box .close_btn").click(function(){
    $(this).parent(".fplist_box").hide();
    $(".mask").hide();
    $('html,body').removeClass('ovfHiden');
})


$("#fzxm_ZWMC").focus(function(){
    $("#fzxm").show();
    $(".mask").show();
    $('html,body').addClass('ovfHiden');
});
$("#zbxm_ZWMC").focus(function(){
    $("#zbxm").show();
    $(".mask").show();
    $('html,body').addClass('ovfHiden');
});
$("#nsrxxxm_ZWMC").focus(function(){
    $("#nsrxxxm").show();
    $(".mask").show();
    $('html,body').addClass('ovfHiden');
});


