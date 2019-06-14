/**
 * @Description:
 * @Author: shiyanyan
 * @Date: 2018/11/06 09:30
 * 行业紧密度分析
 */
$(document).ready(function(){
    var setting_zt = {
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
            onCheck: zTreeOnCheck,
             // onClick:zTreeOnClick,
            beforeCheck: zTreeBeforeCheck
        }
    };
    function zTreeOnClick(event,treeId,treeNode) {
        var zTree=$.fn.zTree.getZTreeObj(treeId);
        var inputMc=treeNode['name'];
        var inputDm=treeNode['id'];
        var hyjb=treeNode['jc'];
        $("#hyjb").val(hyjb);
        $("#"+treeId).parent().parent().find("input").eq(0).val(inputMc);
        $("#"+treeId).parent().parent().find("input").eq(1).val(inputDm);
        //var t=zTree.getSelectedNodes();
        //console.log(t);
    }
    function zTreeOnCheck(event, treeId, treeNode) {
        var value=$("#"+treeId).parent().parent().find("input").eq(0).val();
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        // var cancelNode=zTree.getCancelSelectNode;
        // var status=treeNode.getCheckStatus;
        // console.log(status);
        // console.log(cancelNode);
        // var inputDm=treeNode['id'];
        // var inputMc=treeNode['name'];
        var hyjb=parseInt($('#hyfzlb option:selected').val());
        // var selectNodes=zTree.getSelectedNodes(treeNode);
        // console.log(selectNodes);
        // console.log(selectNode);
        var nodes = zTree.getCheckedNodes(true),
            item, inputMc = '', inputDm = '', halfCheck,
            radio;
        for (var i = 0; i < nodes.length; i++) {
            item = nodes[i];
            if(item['jc']===hyjb){
                radio = false;
                inputMc += ((inputMc ? ',' : '') + item['name']);
                inputDm+=((inputDm ? ',' : '') + item['id']);
                halfCheck = item.getCheckStatus();
                if (!halfCheck.half) {
                    radio = true;
                }
                continue;
                if (radio) {
                    continue;
                }
            }
        }
        $("#hyjb").val(hyjb);
        $("#"+treeId).parent().parent().find("input").eq(0).val(inputMc);
        $("#"+treeId).parent().parent().find("input").eq(1).val(inputDm);
    }
    function zTreeBeforeCheck(treeId, treeNode, clickFlag) {
        if(treeNode.isParent){
            // alert("只能选择最细粒度的行业！");
            // return false;
            return true;
        }else {
            var value=$("#"+treeId).parent().parent().find("input").eq(1).val();
            // if(""!=value) {
            //     alert("最多只能选择一个主体行业！");
            //     return false;
            // }else{
            //     return true;
            // }
            return true;
        }
    };
    var data=commonUtil.getZtreeData("/common/getHY");
    commonUtil.getZtree2(data,setting_zt,"treeDemo_HY_ZT");
    $("#startDate").val(commonUtil.getDefaultStartTime());
    $("#endDate").val(commonUtil.getCurEndMonth());
});
$("#HY_ZT").focus(function () {
    $("#menuContent_HY_ZT").show();
});
$(document).click(function () {
    $("#menuContent_HY_ZT").hide();
});
$("#menuContent_HY_ZT").click(function (event) {
    event.stopPropagation();
});
$("#HY_ZT").click(function (event) {
    event.stopPropagation();
});

function clearDiv() {
    $("#HY_ZT").val("");
    $("#HY_ZT_DM").val("");
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo_HY_ZT");
    treeObj.checkAllNodes(false);
    // treeObj.cancelSelectedNode();
}
/**
 * 切换角度
 * @param value
 */
function changeView(value) {
    //纳税人
    if("0"==value){
        if($("#compName1").attr("disabled")){
            $("#compName1").removeAttr("disabled");
        }
        if($("#compName1").attr("style")){
            $("#compName1").removeAttr("style");
        }
        if(!$("#HY_ZT").attr("disabled")){
            $("#HY_ZT").attr("disabled","true");
        }
        if(!$("#HY_ZT").attr("style")){
            $("#HY_ZT").css("background-color","#ceced0");
        }
        //行业类别
        if(!$("#hyfzlb").attr("disabled")){
            $("#hyfzlb").attr("disabled","true");
        }
        if(!$("#hyfzlb").attr("style")){
            $("#hyfzlb").css("background-color","#ceced0");
        }


    }else{
        //行业
        if(!$("#compName1").attr("disabled")){
            $("#compName1").attr("disabled","true");
        }
        if(!$("#compName1").attr("style")){
            $("#compName1").css("background-color","#ceced0");
        }
        if($("#HY_ZT").attr("disabled")){
            $("#HY_ZT").removeAttr("disabled");
        }
        if($("#HY_ZT").attr("style")){
            $("#HY_ZT").removeAttr("style");
        }

        if($("#hyfzlb").attr("disabled")){
            $("#hyfzlb").removeAttr("disabled");
        }
        if($("#hyfzlb").attr("style")){
            $("#hyfzlb").removeAttr("style");
        }

    }
}
$("#searchBtn").click(function () {
    nodes_xf.length=0;
    links_xf.length=0;
    nodes_gf_cl.length=0;
    links_gf_cl.length=0;
    var view=$("#jdmView").val();
    var searchParam="";
    var value=$("#treeDemo_HY_ZT").parent().parent().find("input").eq(1).val().split(',');
    var hyml=$("#hyfzlb").find("option:selected").text();
    //行业
    if("1"===view){
        searchParam=$("#HY_ZT_DM").val();
        if(""==searchParam){
            alert("请选择一个主体行业");
            return;
        }else if(value.length>5){
            alert("请选择不超过5个"+hyml+"行业");
            return;
        }
    }//纳税人
    else{
        searchParam=$("#compName1").val();
        if(""==searchParam || searchParam==null){
            alert("请输入纳税人名称或纳税人识别号");
            return;
        }
    }

    //var jyje=$("#jyje").val();
    //暂时为0；方便页面加入此条件
    var jyje=0;
    var hyjb=$("#hyjb").val();
    var startDate=$("#startDate").val();
    var endDate=$("#endDate").val();
    var hygs=$("#hygs").val();
    hygs=hygs==""?20:hygs;
    if(hygs>30){
        alert("最大个数为30！");
        return;
    }
    if(""==startDate||""==endDate){
        alert("请选选择交易区间");
        return;
    }
    layui.use('layer', function(){
        var index = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
    });
    $.ajax({
        url: "/comp/searchHY_xg",
        data:{
            searchParam:searchParam,
            jyje:jyje,
            hygs:hygs,
            startDate:startDate,
            endDate:endDate,
            view:view,
            hyjb:hyjb
        },
        type: "POST",
        dataType: "json",
        success: function (data) {
            if (data != null && JSON.stringify(data) != "{}") {
                var dataObj = eval(data);
                loadSankey(dataObj);
                layui.use('layer', function(){
                    layer.closeAll('loading');
                });
            } else {
                alert("没有找到匹配的关系");
            }
        }
    });
});
//偶数 行业-行业-地区
//奇数 行业-地区-行业
var xf_flag=0;
var gf_flag=0;
var nodes_xf=[],links_xf=[],nodes_gf_cl=[],links_gf_cl=[];
function loadSankey(data) {
    var dw=10000;
    var nodes=data.nodes;
    var links=data.links;
    var nodes_gf=data.nodes_gf;
    var links_gf=data.links_gf;
    xf_flag=0;
    gf_flag=0;
    var labelName="";
    var zb="";
    if(nodes.length>0 && links.length>0){
        for(var i=0;i<nodes.length;i++){
            if(nodes[i].BZ=="1"){
                labelName="地区";
            }else{
                labelName="行业";
            }
            if(nodes[i].BZ=="0"){
                zb=(nodes[i].KPJE/dw).toFixed(2);
            }else{
                zb=nodes[i].KPJEBL+"%";
            }
            var node={"name":nodes[i].DM,"mc":nodes[i].MC,label: labelName,zb:zb,kpje:nodes[i].KPJE,bz:nodes[i].BZ}
            nodes_xf.push(node);
        }

        for(var i=0;i<links.length;i++){
            var link={"source":links[i].SOURCE_DM,"target":links[i].TARGET_DM,"value":links[i].KPJE,sourceName: links[i].SOURCE_MC,
                targetName: links[i].TARGET_MC,zb:links[i].KPJEBL,bz:links[i].BZ};
            links_xf.push(link);
        }
        getXFSankey(nodes_xf,links_xf);
    }else{
        alert("销方找不到匹配关系");
    }
    if(nodes_gf.length>0 && links_gf.length>0){
        //购方
        for(var i=0;i<nodes_gf.length;i++){
            if(nodes_gf[i].BZ=="1"){
                labelName="地区";
            }else{
                labelName="行业";
            }
            if(nodes_gf[i].BZ=="0"){
                zb=(nodes_gf[i].KPJE/dw).toFixed(2);
            }else{
                zb=nodes_gf[i].KPJEBL+"%";
            }
            var node_gf={"name":nodes_gf[i].DM,"mc":nodes_gf[i].MC,label: labelName,zb:zb,kpje:nodes_gf[i].KPJE,bz:nodes_gf[i].BZ}
            nodes_gf_cl.push(node_gf);
        }
        for(var i=0;i<links_gf.length;i++){
            var link_gf={"source":links_gf[i].TARGET_DM,"target":links_gf[i].SOURCE_DM,"value":links_gf[i].KPJE,sourceName: links_gf[i].TARGET_MC,
                targetName: links_gf[i].SOURCE_MC,zb:links_gf[i].KPJEBL,bz:links_gf[i].BZ};
            links_gf_cl.push(link_gf);
        }
        getGFSankey(nodes_gf_cl,links_gf_cl);
    }else {
        alert("购方找不到匹配关系");
    }
}

function getXFSankey(nodes,links) {
    echarts.init(document.getElementById('main_xf')).dispose();//销毁前一个实例
    var myChart = echarts.init(document.getElementById('main_xf'));
    var option = {
       //标题
        title: {
            //text: 'Sankey Diagram'
        },
        grid:{
            top:'10%'
        },

        //工具提示
        tooltip : {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter : function(a) {
                var data = eval(a['data']);
                if (data.label) {
                    return ('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'
                    + a['color'] + '"></span>' + data.label + ' : ' + data.mc)
                } else {
                    return  (data.sourceName + ' -> ' +data.targetName
                    + ' : ' + data.value +"</br>"+"占比:"+data.zb+"%");
                }
            }
        },
        toolbox: {
            show: true,
            feature: {
                myTool2: {
                    show: true,
                    title: '切换',
                    icon: 'image://../img/switch.png',
                    onclick: function () {
                        if(xf_flag%2==0){
                            var start_dm;
                            var start_mc;
                            var links_reverse=[];
                            for(var i=0;i<links.length;i++){
                                if(links[i].bz=="2"){
                                    var link_re={"source":links[i].target,"target":links[i].source,"value":links[i].value,sourceName: links[i].targetName,
                                        targetName: links[i].sourceName,zb:links[i].zb,bz:links[i].bz};
                                    links_reverse.push(link_re);
                                }
                                if(links[i].bz=="1"){
                                    start_dm=links[i].source;
                                    start_mc=links[i].sourceName;
                                }
                            }
                            for(var j=0;j<nodes.length;j++){
                                if(nodes[j].bz=="2"){
                                    var  link={"source":start_dm,"target":nodes[j].name,"value":nodes[j].kpje,sourceName: start_mc,
                                        targetName: nodes[j].mc,zb:nodes[j].zb,bz:nodes[j].bz};
                                    links_reverse.push(link);
                                }
                            }
                            xf_flag++;
                            getXFSankey(nodes,links_reverse);
                        }else{
                            getXFSankey(nodes_xf,links_xf);
                            xf_flag=0;
                        }
                    }
                }
            },
            itemSize:32,//工具栏 icon 的大小
            emphasis:{//触发时
                iconStyle:{
                    borderColor:"#006bb7"//图形的描边颜色
                }
            },
        },
        series: [
            {
                //图的类型
                type: 'sankey',
                layout:'none',
                //图中所用数据，就是上面引入的数据，包括节点和关联两部分
                data: nodes,
                links:links,
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    }
                },
                //线条样式
                lineStyle: {
                    normal: {
                        curveness: 0.5,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: '#426EB4' // 0% 处的颜色
                            },{
                                offset: 0.7, color: '#1B4F93' // 70% 处的颜色
                            }, {
                                offset: 1, color: '#103667' // 100% 处的颜色
                            }],
                            globalCoord: true // 缺省为 false
                        }
                    }
                },
                label:{
                    fontSize:20
                }
            }
       ],
        label : {
            normal : {
                position : 'insideLeft|insideTop',
                formatter : function(a) {
                    var data = eval(a['data']);
                    return (data.mc+":"+data.zb);
                },
                color : '#fff',
                padding : [ 10, 0, 0, 10 ]
            }
        }
    }
    myChart.setOption(option);
}
function getGFSankey(nodes,links) {
    echarts.init(document.getElementById('main_gf')).dispose();//销毁前一个实例
    var myChart = echarts.init(document.getElementById('main_gf'));
    var option = {
        //标题
        title: {
           // text: 'Sankey Diagram'
        },
        grid:{
            top:'10%'
        },
        //工具提示
        tooltip : {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter : function(a) {
                var data = eval(a['data']);
                if (data.label) {
                    return ('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'
                        + a['color'] + '"></span>' + data.label + ' : ' + data.mc)
                } else {
                    return  (data.sourceName + ' -> ' +data.targetName
                        + ' : ' + data.value +"</br>"+"占比:"+data.zb+"%");
                }
            }
        },
        toolbox: {
            show: true,
            feature: {
                myTool2: {
                    show: true,
                    title: '切换',
                    icon: 'image://../img/switch.png',
                    onclick: function () {
                        if(gf_flag%2==0){
                            var end_dm;
                            var end_mc;
                            var links_reverse=[];
                            for(var i=0;i<links.length;i++){
                                if(links[i].bz=="2"){
                                    var link_re={"source":links[i].target,"target":links[i].source,"value":links[i].value,sourceName: links[i].targetName,
                                        targetName: links[i].sourceName,zb:links[i].zb,bz:links[i].bz};
                                    links_reverse.push(link_re);
                                }
                                if(links[i].bz=="1"){
                                    end_dm=links[i].target;
                                    end_mc=links[i].targetName;
                                }
                            }
                            for(var j=0;j<nodes.length;j++){
                                if(nodes[j].bz=="2"){
                                    var  link={"source":nodes[j].name,"target":end_dm,"value":nodes[j].kpje,sourceName: nodes[j].mc,
                                        targetName: end_mc,zb:nodes[j].zb,bz:nodes[j].bz};
                                    links_reverse.push(link);
                                }
                            }
                            gf_flag++;
                            console.log(links_reverse);
                            getGFSankey(nodes,links_reverse);
                        }else{
                            getGFSankey(nodes_gf_cl,links_gf_cl);
                            gf_flag=0;
                        }
                    }
                }
            },
            itemSize:32,//工具栏 icon 的大小
            emphasis:{//触发时
                iconStyle:{
                    borderColor:"#006bb7"//图形的描边颜色
                }
            }
        },
        series: [
            {
                //图的类型
                type: 'sankey',
                layout:'none',
                //图中所用数据，就是上面引入的数据，包括节点和关联两部分
                data: nodes,
                links:links,
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    }
                },
                //线条样式
                lineStyle: {
                    normal: {
                        curveness: 0.5,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: '#426EB4' // 0% 处的颜色
                            },{
                                offset: 0.7, color: '#1B4F93' // 70% 处的颜色
                            }, {
                                offset: 1, color: '#103667' // 100% 处的颜色
                            }],
                            globalCoord: true // 缺省为 false
                        }
                    }
                }
            }
        ],
        label : {
            normal : {
                position : 'insideLeft|insideTop',
                formatter : function(a) {
                    var data = eval(a['data']);
                    return ( data.mc+":"+data.zb);
                    // var data = eval(a['data']);
                    // return (data.mc );
                },
                color : 'blue',
                padding : [ 10, 0, 0, 10 ]
            }
        }
    }
    myChart.setOption(option);
}




