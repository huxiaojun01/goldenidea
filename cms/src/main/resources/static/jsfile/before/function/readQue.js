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
            if (data.m_istatus == "1") {
                //文章
                var html = "<img width='100%' height='100%' src='" + "http://localhost:8080/storage/" + data.m_object.fileUrl + "'/>";
                $("#articleLogo").html(html);
                $("#articleTitle").html(data.m_object.articleTitle);
                $("#articleContent").append(data.m_object.articleHtml);
                $("#commentNumber").html(data.m_object.commentNumber);
                $("#likeNumber").html(data.m_object.likeNumber);
                $("#time").html(data.m_object.createTime);
                $("#author").html(data.m_object.telphone);
                user_pk = data.m_object.user_pk;
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

//评论
function getFirstLevelByArticlePK(article_pk) {
    alert("请登录！");
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

// 根据参数名称获取url参数
function getUrlParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}