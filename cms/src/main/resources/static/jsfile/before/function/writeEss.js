var telphone = getUrlParamValue("telphone");
var userFaceUrl = getUrlParamValue("userFaceUrl");
var articleImage="";    //封面图片
$(function () {
    if(userFaceUrl!=null && userFaceUrl!='' && userFaceUrl !='null'){
        $("#userFaceUrl").attr("src", "http://localhost:8080/storage/" + userFaceUrl);
    } else {
        $("#userFaceUrl").attr("src", "/img/default.png");
    }
    $("#userName").text(telphone);
    $("a[name=personal]").attr("href","../personal/personal.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    $("#upload").change(function () {
        upload();
    });
});

function upload() {
    var formData = new FormData($("#form")[0]);
    formData.append("filePath","/img");
    $.ajax({
        url: '../../../upload.do',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            if (data.m_istatus==1){ //上传成功
                alert(data.m_strMessage);
                articleImage = data.m_object;   //图片路径
                var html = "<img width='100%' height='100%' src='"+"http://localhost:8080/storage/"+articleImage+"'/>";
                $("#articleLogo").html(html);
            } else {
                alert(data.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败!错误码:" + XMLHttpRequest.status);
        }
    });
}

function addArticle() {
    var articleTitle = $("#articleTitle").val();
    if (articleTitle=="") {
        alert("请输入标题！");
        return;
    }
    var articleContent=CKEDITOR.instances.exampleTextarea.document.getBody().getText(); //取得纯文本
    var articleHtml = CKEDITOR.instances.exampleTextarea.getData();	//获取文本编辑器中的内容
    if (articleHtml==""){
        alert("请输入内容！");
        return;
    }
    if (articleImage==""){
        alert("请上传封面图片！");
        return;
    }
    var articleTextNumber = articleContent.length;
    var articleType = 1; //1-文章  2-心情  3-想法
    var articlePower = $("input[name=articlePower]:checked").val();


    var obj = {};
    obj['articleTitle'] = articleTitle;
    obj['articleContent'] = articleContent;
    obj['articleHtml'] = articleHtml;
    obj['articleImage'] = articleImage;
    obj['articleTextNumber'] = articleTextNumber;
    obj['articleType'] = articleType;
    obj['articlePower'] = articlePower;

    $.ajax({
        url: "../../../articleController/addArticle.do",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                window.close();
                //window.location.href="../module/index-login.html?userFaceUrl="+userFaceUrl+"&telphone="+telphone;
            } else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("网络出错!错误码:" + XMLHttpRequest.status);
            $("#submit").attr("disabled", false);
        }
    });
}

//退出登录
function logOut() {
    $.ajax({
        url: "../../../userController/logOut.do",
        type: "POST",
        dataType: "json",
        data: "",
        success: function (mu) {
            window.location.href = "../module/index.html";
        }
    });
}

// 根据参数名称获取url参数
function getUrlParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}