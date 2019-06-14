$(".business ul li:last-child").css("margin-right","0px");

//正在进行中弹框
function model_develop(){
	$(".model_develop").show();
	var t=setTimeout(function(){
		$(".model_develop").hide();
	},2000)
}

/*遮罩*/
var screen_w=$(window).width();
var screen_h=$(window).height();
var login_box_w=$(".login_box").width();
var login_box_h=$(".login_box").height();
$(".mask").css({"width":screen_w,"height":screen_h});
$(".login_box").css({"top":(screen_h-login_box_h)/2+'px',"left":(screen_w-login_box_w)/2+'px'});

$(".logo_box .btn_login").click(function(){
	$(".login_box").show();
	$(".mask").show();
	$('html,body').addClass('ovfHiden'); 
})
$(".login_box .close_btn").click(function(){
	$(this).parent(".login_box").hide();
	$(".mask").hide();
	$('html,body').removeClass('ovfHiden');
})

/*关联关系复选框改变*/


$(".relation_box ul li").click(function(){
	if($(this).index()==0){
		if($(this).find("input").prop("checked"))
		{
		  $(this).find("i").css("background","url(../img/check_green.png)");
		}else{
			$(this).find("i").css("background","url(../img/check_default.png)");
		}
	}
	else{
		if($(this).find("input").prop("checked"))
		{
		  $(this).find("i").css("background","url(../img/check_blue.png)");
		}else{
			$(this).find("i").css("background","url(../img/check_default.png)");
		}
	}
})

/*登录页面忘记密码复选框*/
$('.login_con li input[type="checkbox"]').click(function(){
	if($(this).prop("checked")){
		$(this).next("i").css("background","url(../img/check_blue.png)");
	}else{
		$(this).next("i").css("background","url(../img/check_default.png)");
	}
})

/*路径深度选择*/
$(function() {
    var tag = false,
        ox = 0,
        left = 0,
        bgleft = 0;
    $('.progress_btn').mousedown(function(e) {
        ox = e.pageX - left;
        tag = true;
    });
    $(document).mouseup(function() {
        tag = false;
    });
    $('.progress').mousemove(function(e) {
        //鼠标移动
        if (tag) {
            left = e.pageX - ox;
            if (left <= 0) {
                left = 0;
            }else if (left > 300) {
                left = 300;
            }
            $('.progress_btn').css('left', left);
            $('.progress_bar').width(left);
            $('.text').html(parseInt((left/77)+2));
            $('.text').css('left', left-8);
        }
    });
    $('.progress_bg').click(function(e) {
        //鼠标点击
        if (!tag) {
            bgleft = $('.progress_bg').offset().left;
            left = e.pageX - bgleft;
            if (left <= 0) {
                left = 0;
            }else if (left > 300) {
                left = 300;
            }
            $('.progress_btn').css('left', left);
            $('.progress_bar').animate({width:left},300);
            $('.text').html(parseInt((left/77)+2));
            $('.text').css('left', left-8);
        }
    });
});

		
/*日期*/
layui.use('laydate', function(){
	var laydate = layui.laydate;
    //年月选择器
    laydate.render({
        elem: '#startDate'
        ,type: 'month'
    });
    laydate.render({
        elem: '#endDate'
        ,type: 'month'
    });
    laydate.render({
        elem: '#kpyfz'
        ,type: 'month'
    });
    laydate.render({
        elem: '#kpyfq'
        ,type: 'month'
    });
    laydate.render({
        elem:'#startTime',
        type:'month'
    });

});
//关联企业增加

$(".gly_list_box").on("click",".btn_add",function(){
    var num=$(".gly_list_box >div").length+1;
    var str='1234';
    $(".gly_list_box >div").each(function(){
       var id=$(this).find("input").attr("id");
        id=id.substring((id.length-1),id.length);
       if(str.indexOf(id)!=-1){
          str=str.replace(id,"");
       }
    });
    if(str){
        num=str.substring(0,1);
    }
    $(this).removeClass("btn_add").addClass("btn_reduce").next().text("删除关联企业");
    if($(".gly_list_box >div").length<3){
        var html="";
        html+='<div class="list_box">'
        html+=	'<input type="text" id="compName'+num+'" placeholder="请输入纳税人名称或纳税人识别号">'
        html+='<p>'
        html+=		'<span class="btn btn_add"></span>'
        html+=	    '<span class="btn_tip">增加关联企业</span>'
        html+=	'</p>'
        html+=    '<div class="search_tip">'
        html+=   ' <div class="autoComplete'+num+'">'
        html+=    '<ul></ul>'
        html+=    '</div>'
        html+='</div>';
        $(".gly_list_box").append(html);
    }else{
        var html="";
        html+='<div class="list_box">'
        html+=	'<input type="text" id="compName'+num+'" placeholder="请输入企业名称和纳税人识别号">'
        html+='<p>'
        html+=		'<span class="btn btn_reduce"></span>'
        html+=	    '<span class="btn_tip">删除关联企业</span>'
        html+=	'</p>'
        html+=    '<div class="search_tip">'
        html+=   ' <div class="autoComplete'+num+'">'
        html+=    '<ul></ul>'
        html+=    '</div>'
        html+='</div>';
        $(".gly_list_box").append(html);
    }
    var autoBox,autoUl,textFill,autoMapPg,ft,textSearch,dfd
    var autoBoxnum=autoBox+num;
    var autoUlnum=autoUl+num;
    var textFillnum=textFill+num;
    var autoMapPgnum=autoMapPg+num;
    var ftnum=ft+num;
    var textSearchnum=textSearch+num;
    var dfdnum=dfd+num;
    var autoBoxnum = $(".autoComplete"+num+""),
        autoUlnum = $(".autoComplete"+num+" ul"),
        textFillnum = $("#compName"+num+"");
    $("#compName"+num+"").on("keyup", function (e) {
        //38：向上箭头；40：向下箭头；13：Enter键
        if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) {
            textSearch = $(this).val();
            setTimeout(function () {
                autoMapPgnum.getData(textSearch);
            }, 100)
        }
    });

    $(".autoComplete"+num+" ul").on("click", ".suggestItem", function (e) {
        var ftnum = $(this).attr("data-item");
        textFillnum.val(ftnum);
        $(".autoComplete"+num+"").css("display","none");
//        autoMapPg.getData(ft).then(function (data) {
//            //autoMapPg.abovePoint(data,ft)
//        })
    });


    var autoMapPgnum = {
        //获取实时提示数据
        getData: function (textSearchnum) {
            var dfdnum = $.Deferred();
            if (textSearchnum) {
                $.ajax({
                    type: "get",
                    data: {
                        "compName": textSearchnum.toString().toLowerCase()
                    },
                    url: "/comp/suggestName",
                    success: function (result) {

                        var searchHtml = "";

                        $.each(result, function (index, item) {

                            searchHtml += '<li class="suggestItem" data-item="' + item + '"><i class="default">' + item + '</i></li>';

                        });

                        autoBoxnum.show().siblings().hide();
                        autoUlnum.html(searchHtml);
                        listLength = autoUlnum.children().length;
                        dfdnum.resolve(result)
                    }
                })
                return dfdnum.promise();
            } else {
                autoUlnum.html("");
                $(".dataUpload").show();
            }

        }
    };


})

$(".gly_list_box").on("click",".btn_reduce",function(){
    $(this).parent("p").parent("div").remove();
    $(".gly_list_box div:last-child .btn").removeClass("btn_reduce").addClass("btn_add").next().text("增加关联企业");
});
$(".gly_list_box").on("mouseover",".btn_reduce",function(){
    $(this).next().show();
})
$(".gly_list_box").on("mouseleave",".btn_reduce",function(){
    $(this).next().hide();
})

$(".gly_list_box").on("mouseover",".btn_add",function(){
    $(this).next().show();
})
$(".gly_list_box").on("mouseleave",".btn_add",function(){
    $(this).next().hide();
})

function check(){
	var user_name=$(".user_name").val();
	var pas_word=$(".pas_word").val();
	 if((user_name=="")||(user_name==null)){
		$(".user_name").addClass("error");
		$(".user_name").next().css("visibility","visible");
	}
	if((pas_word=="")||(pas_word==null)){
		$(".pas_word").addClass("error");
		$(".pas_word").next().css("visibility","visible");
	}
}

