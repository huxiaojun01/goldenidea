var searchKey = getUrlParamValue("searchKey");
var page = 0;
var total = 1;    //总页码
$(function () {
    $("#searchKey").val(searchKey);
    getArticleList();
});

function getArticleList() {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../../articleController/getArticleListPaging.do",
            type: "POST",
            dataType: "json",
            data: "page=" + page + "&pageRows=5" + "&articleType=-1&searchKey=" +searchKey,    //1-文章  2-心情  3-想法
            success: function (mu) {
                if (mu.m_istatus == "1") {
                    var data = mu.m_object.data;
                    total = mu.m_object.total;
                    var html = "";
                    $.each(data, function (i, o) {
                        var articleContent = o.articleContent;
                        if (articleContent.length > 150) {
                            articleContent = articleContent.substring(0, 150) + "......"
                        }
                        html += "<div onclick='getArticleByPK(this)' id='" + o.article_pk+","+o.articleType + "' style='cursor: pointer;' class=\"message\">" + articleContent + "<div class=\"author\">" +
                            "<b style=\"float:left;\">作者：<span>" + o.telphone + "</span></b>" +
                            "<b style=\"float:right;\">发表时间：<span>" + o.createTime + "</span></b>" +
                            "</div></div>";

                    });
                    $("#moreArticle").remove();
                    if ((page+1)!=total&&data.length>0){
                        html += "<div id='moreArticle' style='cursor: pointer;' class=\"text-center\" onclick='moreArticle()'>查看更多</div>";
                    } else {    //最后一页
                        html += "<div style='cursor: pointer;' class=\"text-center\">没有更多数据了~</div>";
                    }
                    $("#content").append(html);

                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败!错误码:" + XMLHttpRequest.status);
            }
        });
    }else {

    }
}
function search() {
    searchKey=$("#searchKey").val();
    $("#content").html(" 搜索结果如下：");
    getArticleList();
}
//跳转详情
function getArticleByPK(ev) {
    var articleType = ev.id.split(",")[1];
    if (articleType == 1) {    //1-文章  2-心情  3-想法
        window.location.href = "../function/readEss.html?article_pk=" + ev.id.split(",")[0];
    } else if (articleType == 2) {
        window.location.href = "../function/readMood.html?article_pk=" + ev.id.split(",")[0];
    } else if (articleType == 3) {
        window.location.href = "../function/readQue.html?article_pk=" + ev.id.split(",")[0];
    } else {
        alert("error!");
    }
}
//查看更多
function moreArticle() {
    page++;
    getArticleList();
}
//心情--弹窗
function upload() {
    var formData = new FormData($("#form")[0]);
    formData.append("filePath", "/mood");
    $.ajax({
        url: '../../../upload.do',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.m_istatus == 1) { //上传成功
                alert(data.m_strMessage);
                articleImage = data.m_object;   //图片路径
                $("#uploadF").html($("#file").val());
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
    var articleContent = $("#articleContent").val();
    if (articleContent == "") {
        alert("请输入内容！");
        return;
    }
    var articleTextNumber = articleContent.length;
    var articleType = 2; //1-文章  2-心情  3-想法
    var articlePower = 1;   //1-对外开放  2-仅会员可见  3-个人可见


    var obj = {};
    obj['articleTitle'] = "";
    obj['articleContent'] = articleContent;
    obj['articleHtml'] = "";
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
                window.location.href = "../module/index-login.html?userFaceUrl="+userFaceUrl+"&telphone="+telphone;
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

// 根据参数名称获取url参数
function getUrlParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}