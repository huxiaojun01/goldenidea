package com.goldenidea.cms.service;


import com.goldenidea.cms.utils.MessageUtil;

import java.util.Map;

public interface CommentService {

    MessageUtil addComment(Map<String, Object> comment);

    MessageUtil addLikeRecord(Map<String, Object> likeRecord);

    MessageUtil deleteCommentByPK(String comment_pk);

    MessageUtil getFirstLevelByArticlePK(Integer page, Integer pageRows, String article_pk);

    MessageUtil getCommentByArticlePKAndCommentParentPK(String article_pk, String commentParent_pk);

    MessageUtil getCommentListPaging(Integer page, Integer pageRows);

    MessageUtil updateCommentState(String comment_pk, String commentState);
}
