
window.onload=function(){
    commonUtil.Oauth();
}


function encode() {
    var data = new FormData(document.getElementById("fileUploadForm"));
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/qr/encode",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        success: function (result) {
            $('#previewImg').attr('src', 'data:image/jpg;base64,' + result);
            $("#txt").remove();
            $("#imgArea").removeClass("hide");
        }
    });
}

function onSave(){
    var src = $("#previewImg").attr("src")
    $.ajax({
        type: "post",
        url: "/qr/onSave",
        data: {
            src:src,
            title:  $('#title').val(),
            summary:$('#summary').val(),
            content:$('#content').val(),
            UserId: $.cookie('UserId')
        },
        success: function (result) {
            alert(result);
        }
    });
}



