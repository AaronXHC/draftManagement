var editor;
var draftId = null;

/*! function (window, document, $, undefined) {
    'use strict';
    editor = CKEDITOR.replace('editor', {
        language: 'zh-CN',
        uiColor: '#ffffff',
        resize_enabled: false,
        placeholder: '请输入内容',
        toolbar: [{
                name: 'clipboard',
                items: ['Undo', 'Redo']
            },
            {
                name: 'styles',
                items: ['Format', 'FontSize']
            },
            {
                name: 'colors',
                items: ['TextColor', 'BGColor']
            },
            {
                name: 'align',
                items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
            },
            {
                name: 'basicstyles',
                items: ['Bold', 'RemoveFormat']
            },
            {
                name: 'links',
                items: ['Link', 'Unlink']
            },
            {
                name: 'paragraph',
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
            },
            {
                name: 'insert',
                items: ['Image']
            }
        ],
        image_previewText: ' ',
        extraAllowedContent: 'h3{clear};h2{line-height};h2 h3{margin-left,margin-top}',
        extraPlugins: 'format,colorbutton,justify,image2,uploadimage,confighelper',
        //文件上传地址
        filebrowserImageUploadUrl: '/draft/imgUpload',
        removeDialogTabs: 'image:Link;image:advanced;link:advanced',
        removePlugins: 'image,elementspath',
        on: {
            instanceReady: function () {
                $('.cke_inner').css('height', $(window).height() - $('.form-input').outerHeight() * 2 - 4);
                $('#cke_1_contents').css('height', $('.cke_inner').outerHeight() - $('#cke_1_top').outerHeight());
                console.log($('#cke_1_top').outerHeight())
            }
        }
    });

}(window, document, jQuery);*/



function saveDraft() {
    var content = editor.getData();
    var title =  $("#title").val();
    var summary =  $("#summary").val();
    var keyword = $("#keyword").val();
    var DATA,URL;
    if(draftId!=null){
        DATA = {
            TITLE:title,
            SUMMARY: summary,
            CONTENT:content,
            KEYWORD:keyword,
            USERID: $.cookie('UserId'),
            ID: draftId
        }
        URL = "/draft/reEditDraft";
    }else{
        DATA = {
            TITLE:title,
            SUMMARY: summary,
            CONTENT:content,
            KEYWORD:keyword,
            USERID: $.cookie('UserId')
        }
        URL = "/draft/insertDRAFT_INFO";
    }
    $.ajax({
        type: "POST",
        url: URL,
        data: DATA,
        success: function (result) {
            if(result==0){
                alert("发布成功！");
                window.location.href="/draft/DraftList"
            }
        }
    });
}


window.onload=function(){
    /*commonUtil.Oauth();*/
    editor = CKEDITOR.replace('editor', {
        language: 'zh-CN',
        uiColor: '#ffffff',
        resize_enabled: false,
        placeholder: '请输入内容',
        toolbar: [{
            name: 'clipboard',
            items: ['Undo', 'Redo']
        },
            {
                name: 'styles',
                items: ['Format', 'FontSize']
            },
            {
                name: 'colors',
                items: ['TextColor', 'BGColor']
            },
            {
                name: 'align',
                items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
            },
            {
                name: 'basicstyles',
                items: ['Bold', 'RemoveFormat']
            },
            {
                name: 'links',
                items: ['Link', 'Unlink']
            },
            {
                name: 'paragraph',
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
            },
            {
                name: 'insert',
                items: ['Image']
            }
        ],
        image_previewText: ' ',
        extraAllowedContent: 'h3{clear};h2{line-height};h2 h3{margin-left,margin-top}',
        extraPlugins: 'format,colorbutton,justify,image2,uploadimage,confighelper',
        //文件上传地址
        filebrowserImageUploadUrl: '/draft/imgUpload',
        removeDialogTabs: 'image:Link;image:advanced;link:advanced',
        removePlugins: 'image,elementspath',
        on: {
            instanceReady: function () {
                $('.cke_inner').css('height', $(window).height() - $('.form-input').outerHeight() * 2 - 4);
                $('#cke_1_contents').css('height', $('.cke_inner').outerHeight() - $('#cke_1_top').outerHeight());
                console.log($('#cke_1_top').outerHeight())
            }
        }
    });
    if(commonUtil.GetQueryString("id")!=null){
        draftId=commonUtil.GetQueryString("id");
        $.ajax({
            type: "get",
            async:false,
            data: {
                id:draftId
            },
            url: "/draft/draftContent",
            success: function (result) {
                console.log(result);
                $("#title").val(result.info[0].TITLE);
                $("#summary").val(result.info[0].SUMMARY);
                $("#keyword").val(result.info[0].KEYWORD);
                var content = "";
                for(var a=0;a<result.content.length;a++){
                    content+=result.content[a].CONTENT;
                }
                editor.setData(content);
            }
        });
    }
}