var page = 0;
var total = 1;    //总页码
var article_pk = getUrlParamValue("article_pk");
var telphone = getUrlParamValue("telphone");
var userFaceUrl = getUrlParamValue("userFaceUrl");
$(function () {
    if(userFaceUrl!=null && userFaceUrl!='' && userFaceUrl !='null'){
        $("#userFaceUrl").attr("src", "http://localhost:8080/storage/" + userFaceUrl);
    } else {
        $("#userFaceUrl").attr("src", "/img/default.png");
    }

    $("a[name=personal]").attr("href","../personal/personal.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);

    $("#home1").attr("href", "../module/index-login.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    $("#idea1").attr("href", "../module/idea-login.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    $("#mood1").attr("href", "../module/mood-login.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    getArticleByPK(article_pk);

});
//搜索
function search() {
    window.location.href="../function/search-login.html?searchKey=" + $("#searchKey").val()+"&telphone=" + telphone + "&userFaceUrl=" + userFaceUrl;
}

//获取文章信息
function getArticleByPK(article_pk) {
    $.ajax({
        url: "../../../articleController/getArticleByPK.do",
        type: "POST",
        dataType: "json",
        data: "article_pk=" + article_pk,
        success: function (data) {
            if (data.m_istatus == "1") {
                //文章
                var html = "<img width='100%' height='100%' src='" + "http://localhost:8080/storage/" + data.m_object.fileUrl + "'/>";
                $("#articleLogo").html(html);
                $("#articleTitle").html(data.m_object.articleTitle);
                $("#articleContent").append(data.m_object.articleContent);
                $("#commentNumber").html(data.m_object.commentNumber);
                $("#likeNumber").html(data.m_object.likeNumber);
                $("#unLikeNumber").html(data.m_object.unLikeNumber);
                $("#time").html(data.m_object.createTime);
                $("#author").html(data.m_object.telphone);
                //资源下载
                if (data.m_object.isDownload) { //有下载权限
                    $("#download").attr("href", "../../../resourceController/download.do?fileUrl=" + data.m_object.fileUrl + "&fileName=" + data.m_object.fileName);
                } else {    //无权限下载
                    $("#div").attr("class", "col-xs-6 text-right");
                    $("#download_div").hide();
                }
                //评论
                getFirstLevelByArticlePK(article_pk);
            } else {
                alert(data.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败!错误码:" + XMLHttpRequest.status);
        }
    });
}

//获取评论信息
function getFirstLevelByArticlePK(article_pk) {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../../commentController/getFirstLevelByArticlePK.do",
            type: "POST",
            dataType: "json",
            data: "page=" + page + "&pageRows=" + 5 + "&article_pk=" + article_pk,
            success: function (msg) {
                var data = msg.m_object;
                total = data.total;
                var html = "";
                $.each(data.data, function (i, o) {
                    html += "<div class=\"message\">" + o.commentContent + " <div class=\"author\">" +
                        "<b style=\"float:left;\">作者：<span>" + o.telphone + "</span></b>" +
                        "<b style=\"float:right;\">发表时间：<span>" + o.createTime + "</span></b></div></div>";
                });
                $("#moreComment").remove();
                $("#noMore").remove();
                if ((page+1)!=total){
                    html += "<div id='moreComment' class=\"text-center\" onclick='moreComment()' style='cursor: pointer;'>查看更多</div>";
                } else {    //最后一页
                    html += "<div style='cursor: pointer;' id='noMore' class=\"text-center\">没有更多数据了~</div>";
                }
                $("#comment").append(html);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

//查看更多评论
function moreComment() {
    page++;
    getFirstLevelByArticlePK(article_pk);
}

//发表评论
function addComment() {
    var commentContent = $("#commentContent").val();
    if (commentContent == "") {
        alert("评论内容不能为空！");
        return;
    }

    var obj = {};
    obj['article_pk'] = article_pk;
    obj['commentContent'] = commentContent;

    $.ajax({
        url: "../../../commentController/addComment.do",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                //评论成功，更新评论列表
                $("#comment").html("<div class=\"form-group\"><h4 id=\"section-3\">评论区</h4>" +
                    "<textarea class=\"form-control\" rows=\"3\" id=\"commentContent\">你有什么好办法吗？</textarea>" +
                    "<button class=\"fbbtn\" onclick=\"addComment()\">发布</button></div>");
                page=0;
                total=1;
                $("#articleContent").html("");
                getArticleByPK(article_pk);
            } else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("网络出错!错误码:" + XMLHttpRequest.status);
        }
    });
}

//点赞
function addLikeNumber() {
    $.ajax({
        url: "../../../articleController/addLikeNumberByPK.do",
        type: "POST",
        dataType: "json",
        data: "article_pk=" + article_pk+"&type=1",
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                $("#articleContent").html("");
                getArticleByPK(article_pk);
            }else {
                alert(mu.m_strMessage);
            }
        }
    });
}
//反对
function addUnLikeNumber() {
    $.ajax({
        url: "../../../articleController/addLikeNumberByPK.do",
        type: "POST",
        dataType: "json",
        data: "article_pk=" + article_pk+"&type=0",
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                $("#articleContent").html("");
                getArticleByPK(article_pk);
            }else {
                alert(mu.m_strMessage);
            }
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