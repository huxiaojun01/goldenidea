package com.goldenidea.cms.service;

import com.goldenidea.cms.dto.UserSession;
import com.goldenidea.cms.utils.MessageUtil;

import java.util.Map;

public interface ArticleService {
    MessageUtil addArticle(Map<String, Object> article);

    MessageUtil deleteArticleByPK(String article_pk);

    MessageUtil getArticleByPK(String article_pk, UserSession user);

    MessageUtil getArticleListPaging(Integer page, Integer pageRows, String searchKey, Integer articleType, String articlePower, UserSession user);

    MessageUtil getArticleByUserPkAndArticleTypeListPaging(Integer page, Integer pageRows, String searchKey, Integer articleType, String user_pk);

    MessageUtil addLikeNumberByPK(String article_pk, String user_pk, Integer type);

    MessageUtil updateArticle(Map<String, Object> article);
}
