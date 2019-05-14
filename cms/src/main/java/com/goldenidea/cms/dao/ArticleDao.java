package com.goldenidea.cms.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ArticleDao {

    int addArticle(Map<String, Object> article);

    int deleteArticleByPK(String article_pk);

    int deleteArticleByFilePk(String file_pk);

    String getArticlePkByFilePk(String file_pk);

    Map<String, Object> getArticleByPK(String article_pk)
            ;
    List<Map<String, Object>> getArticleListPaging(@Param("offset") Integer offset, @Param("rows") Integer rows, @Param("searchKey") String searchKey, @Param("articleType") Integer articleType, @Param("articlePower") String articlePower);

    int getTotalCount(@Param("searchKey") String searchKey, @Param("articleType") Integer articleType, @Param("articlePower") String articlePower);

    int addArticleReadByPK(String article_pk);

    int addCommentNumberByPK(String article_pk);

    int addLikeNumberByPK(String article_pk);

    int addUnLikeNumberByPK(String article_pk);

    List<Map<String, Object>> getArticleByUserPkAndArticleTypeListPaging(@Param("offset") Integer offset, @Param("rows") Integer rows, @Param("searchKey") String searchKey, @Param("articleType") Integer articleType, @Param("user_pk") String user_pk);

    int getTotalCountByUserPkAndArticleType(@Param("searchKey") String searchKey, @Param("articleType") Integer articleType, @Param("user_pk") String user_pk);

    int isLike(@Param("user_pk") String user_pk, @Param("article_pk") String article_pk, @Param("type") Integer type);

    int updateArticle(Map<String, Object> article);
}
