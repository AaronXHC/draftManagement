/**
 * @Description:
 * @Author: shiyanyan
 * @Date: 2018/10/26 15:30
 * 纳税人信息分析
 */
/**
 * 显示excel上传的内容
 * @type {*}
 */
var screen_w=$(window).width();
var screen_h=$(window).height();
var data_scan_box_w=$(".scan_box").width();
var data_scan_box_h=$(".scan_box").height();
$(".mask").css({"width":screen_w,"height":screen_h});
$(".scan_box").css({"top":(screen_h-data_scan_box_h)/2+'px',"left":(screen_w-data_scan_box_w)/2+'px'});
$(".scan_box .close_btn").click(function(){
    $(this).parent(".scan_box").hide();
    $(".mask").hide();
    $('html,body').removeClass('ovfHiden');
});
/**
 *纳税人信息过滤
 * @type {*}
 */
var fplist_box_w=$(".fplist_box").width();
var fplist_box_h=$(".fplist_box").height();
$(".mask").css({"width":screen_w,"height":screen_h});
$(".fplist_box").css({"top":(screen_h-fplist_box_h)/10+'px',"left":(screen_w-fplist_box_w)/2+'px'});
$(".fplist_box .close_btn").click(function(){
    $(this).parent(".fplist_box").hide();
    $(".mask").hide();
    $('html,body').removeClass('ovfHiden');
})
$(".sumbit").click(function () {
    var chk_value=[];
    $('input[name="title"]:checked').each(function(){
        chk_value.push($(this).val());
    });
    if(chk_value.length==0){
        alert("请至少勾选一个");
        return false;
    }
    if(chk_value.length>2){
        alert("请最多勾选两个");
        return false;
    }
    $(".scan_box").hide();
    $(".mask").hide();
    $('html,body').removeClass('ovfHiden');
    $.ajax({
        url: "/analysis/analysisFile",
        data:{
            "filePath":$("#data_id").val(),
            "chkValue":chk_value,
            "nsrxxxm":$("#nsrxxxm_YWMC").val()
        },
        traditional: true,
        async:false,
        type: "POST",
        dataType: "json",
        success: function (data) {
            getHtml(data);
        }
    });
});
function getHtml(result) {
    var zwmc_nsrxx_array=$("#nsrxxxm_ZWMC").val().split(',');
    var ywmc_nsrxx_array=$("#nsrxxxm_YWMC").val().split(",");
    var html = "<table cellpadding='0' cellspacing='0' style='width:1200px'><thead>" +
        "<tr><th style='width:15%'>纳税人名称(EXCEL)</th>" +
        "<th style='width:15%' >纳税人识别号(EXCEL)</th>"+
        "<th style='width:15%'>纳税人名称(提取)</th>" +
        "<th style='width:15%' >纳税人识别号(提取)</th>";
    for(var i=0;i<zwmc_nsrxx_array.length;i++){
        var zwmc=zwmc_nsrxx_array[i];
        html+="<th style='width:35%' title='"+zwmc+"'>"+zwmc+"</th>"
    }
    html+=  "</tr></thead><tbody>";

    $.each(result, function(index, item) {
        html+="<tr>" +
            "<td title='"+item.EXCEL_NSRMC+"'>"+(typeof (item.EXCEL_NSRMC)=="undefined"?"":item.EXCEL_NSRMC)+"</td>" +
            "<td title='"+item.EXCEL_NSRSBH+"'>"+(typeof (item.EXCEL_NSRSBH)=="undefined"?"":item.EXCEL_NSRSBH)+"</td>"+
            "<td title='"+item.TQ_NSRMC+"'>"+(typeof (item.TQ_NSRMC)=="undefined"?"":item.TQ_NSRMC)+"</td>" +
            "<td title='"+item.TQ_NSRSBH+"'>"+(typeof (item.TQ_NSRSBH)=="undefined"?"":item.TQ_NSRSBH)+"</td>";

        var nsrxxxmHtml="";
        for(var i=0;i<ywmc_nsrxx_array.length;i++){
            var ewmc=ywmc_nsrxx_array[i].trim();
            nsrxxxmHtml+="<td>"+(typeof (item[ewmc])=="undefined"?"":item[ewmc])+"</td>"
        }
        html+=nsrxxxmHtml;
        html+="</tr>"
    });
    html+="</table>";
    $('#resultList').empty().html(html);
}
$.ajax({
    type: "post",
    data: {
        tslx:"2"
    },
    async:false,
    url: "/analysis/getZztszd",
    success: function (result) {
        if (result != null) {
            var html_nsrxx='<table cellpadding="0" cellspacing="0" style="width:800px"><colgroup><col style="width:80px;"/><col style="" /><col style="width: 80px;" /></colgroup><tbody>';
            var html_nsrxxxm="";
            $.each(result, function (index, item){
                var xh=index+1;
                if("2"==item.tslx){
                    var zwmc=item.zwmc;
                    if(zwmc.indexOf('代码')!=-1){
                        zwmc=zwmc.replace('代码','');
                    }
                    html_nsrxxxm+='<tr><td>'+xh+'</td><td>'+zwmc+'</td><td><input type="checkbox" name="nsrxxxm" value="'+item.ywmc+'" mc="'+zwmc+'" ly="'+item.tslx+'" style="zoom:150%;"></td></tr>'
                }
            });
            var nsrxx=html_nsrxx+html_nsrxxxm+'</tbody></table>';
            $("#fpList_nsrxxxm").empty().append(nsrxx);
        }
    }
});
$("#export").click(function () {
        var params=getSearchParams();
        if(params.filePath==null || ""==params.filePath){
            alert("请先选择文件!");
            return false;
        }
        var urlParams=commonUtil.preparePostData(params);
        var url="/export/nsrxxAnalysisExcel";
        window.location.href=url+"?"+urlParams;
});
function getSearchParams() {
    var nsrxxxm_zwmc=$("#nsrxxxm_ZWMC").val();
    var nsrxxxm_ewmc=$("#nsrxxxm_YWMC").val();
    var filePath=$("#data_id").val();
    return{
        nsrxxxm_zwmc:nsrxxxm_zwmc,
        nsrxxxm_ewmc:nsrxxxm_ewmc,
        filePath:filePath
    }
}

/**
 * 上传文件
 * @param url 到control处理的url
 * @param file_name_id 页面显示文件名称的id
 * @param data_hidden_id 页面隐藏数据标标识的id
 */
function upload(){
    var inputElement = document.getElementById("file");
    var fileList = inputElement.files;
    var file=fileList[0];
    if(!file) return;
    var fileName=file.name;
    var formData = new FormData($('#uploadForm')[0]);
    $.ajax({
        type: 'post',
        url: "/analysis/upload",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
    }).success(function (data) {
        if(data!=null && ""!=data){
            var dataJson=JSON.parse(data);
            if(dataJson.code=="1"){
                var result=dataJson.msg;
                 var title=result.title;
                 var titles=title.split(',');
                 //记录哪一列是 识别号，那一列是名称
                 var mc="",sbh="",html="<thead><tr>";
                 for(var i=0;i<titles.length;i++){
                     if(titles[i].trim()=='纳税人识别号'){
                         mc=i;
                         html+="<td title='"+titles[i]+"'><div class='award-name'>"+titles[i]+"<div><input name='title' type='checkbox' value='"+i+"' checked=‘checked’/></td>";
                         continue;
                     }
                     if(titles[i].trim()=='纳税人名称'){
                         sbh=i;
                         html+="<td title='"+titles[i]+"'><div class='award-name'>"+titles[i]+"</div><input name='title' type='checkbox' value='"+i+"' checked=‘checked’ /></td>"
                         continue;
                     }
                     html+="<td title='"+titles[i]+"'><div class='award-name'>"+titles[i]+"</div><input name='title' type='checkbox' value='"+i+"'/></td>"
                 }

                 var value=result.value;
                var values=value.split(',');
                html+="</tr></thead><tr>"
                for(var i=0;i<values.length;i++){
                    html+="<td title='"+values[i]+"'><div class='award-name'>"+values[i]+"</div></td>"

                }
                html+="</tr>"
                $("#scan_result").empty().append(html);
                $(".scan_box").show();
                $(".mask").show();
                $("#data_id").val(result.path);
                $("#fileName").html("已上传"+fileName);
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
$("#nsrxxxm_ZWMC").focus(function(){
    $("#nsrxxxm").show();
    $(".mask").show();
    $('html,body').addClass('ovfHiden');
});
$(".sumbit_nsrxxxm").click(function () {
    var chk_value =[];
    var chk_mc=[];
    $('input[name="nsrxxxm"]:checked').each(function(){
        var mc=$(this).attr("mc")
        chk_value.push($(this).val());
        chk_mc.push(mc);
    });
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

    $("#nsrxxxm_YWMC").val(chk_value_str);
    $("#nsrxxxm").hide();
    $(".mask").hide();
    $('html,body').removeClass('ovfHiden');
});