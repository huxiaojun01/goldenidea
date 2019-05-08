var page = 0;
var total = 1;    //总页码
var article_pk = getUrlParamValue("article_pk");
$(function () {
    getArticleByPK(article_pk);

});
//搜索
function search() {
    window.location.href="../function/search.html?searchKey=" + $("#searchKey").val();
}

//获取文章信息
function getArticleByPK(article_pk) {
    $.ajax({
        url: "../../../articleController/getArticleByPK.do",
        type: "POST",
        dataType: "json",
        data: "article_pk=" + article_pk,
        success: function (data) {
            console.log(data)
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
    alert("请登录！");
}

//点赞
function addLikeNumber() {
    alert("请登录！");
}
//反对
function addUnLikeNumber() {
    alert("请登录！");
}

// 根据参数名称获取url参数
function getUrlParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}