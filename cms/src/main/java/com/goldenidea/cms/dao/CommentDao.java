package com.goldenidea.cms.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommentDao {

    int addComment(Map<String, Object> comment);

    int addLikeRecord(Map<String, Object> likeRecord);

    int deleteCommentByPK(String comment_pk);

    int deleteCommentByArticlePK(String article_pk);

    int deleteLikeRecordByArticlePK(String article_pk);

    List<Map<String, Object>> getFirstLevelByArticlePK(@Param("offset") Integer offset, @Param("rows") Integer rows, @Param("article_pk") String article_pk);

    int getFirstLevelTotal(@Param("article_pk") String article_pk);

    List<Map<String, Object>> getCommentByArticlePKAndCommentParentPK(@Param("article_pk") String article_pk, @Param("commentParent_pk") String commentParent_pk);

    List<Map<String, Object>> getCommentListPaging(@Param("offset") Integer offset, @Param("rows") Integer rows);

    int getTotalCount();

    int updateCommentState(@Param("comment_pk") String comment_pk, @Param("commentState") String commentState);

}
