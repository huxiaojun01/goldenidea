package com.goldenidea.cms.service.impl;

import com.goldenidea.cms.dao.ArticleDao;
import com.goldenidea.cms.dao.CommentDao;
import com.goldenidea.cms.dao.IntegralDao;
import com.goldenidea.cms.service.CommentService;
import com.goldenidea.cms.utils.DataUtil;
import com.goldenidea.cms.utils.MessageUtil;
import com.goldenidea.cms.utils.Snowflake;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@Service
public class CommentServiceImpl implements CommentService {
    @Resource
    CommentDao commentDao;
    @Resource
    ArticleDao articleDao;
    @Resource
    IntegralDao integralDao;


    @Override
    public MessageUtil addComment(Map<String, Object> comment) {
        MessageUtil mu = new MessageUtil();
        comment.put("comment_pk", Snowflake.getInstance().nextId());
        int i = this.commentDao.addComment(comment);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("评论成功！");
            //评论数++
            this.articleDao.addCommentNumberByPK(comment.get("article_pk").toString());
            //积分增加
            Map<String, Object> article = this.articleDao.getArticleByPK(String.valueOf(comment.get("article_pk")));
            String user_pk_login = String.valueOf(comment.get("user_pk"));    //评论发表人
            String user_pk_article = String.valueOf(article.get("user_pk"));    //文章发布人
            //文章类型：1-文章  2-心情  3-想法
            int articleType = Integer.parseInt(String.valueOf(article.get("articleType")));
            if (articleType == 3) {
                this.integralDao.addUserIntegral(user_pk_login, 3);
            } else {
                this.integralDao.addUserIntegral(user_pk_login, 1);
            }
            this.integralDao.addUserIntegral(user_pk_article, 1);//收获一个评论+1

        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("评论失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil addLikeRecord(Map<String, Object> likeRecord) {
        MessageUtil mu = new MessageUtil();
        likeRecord.put("fabulous_pk", Snowflake.getInstance().nextId());
        int i = this.commentDao.addLikeRecord(likeRecord);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("点赞记录添加成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("点赞记录添加失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil deleteCommentByPK(String comment_pk) {
        MessageUtil mu = new MessageUtil();
        int i = this.commentDao.deleteCommentByPK(comment_pk);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("评论删除成功！");

        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("评论删除失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil getFirstLevelByArticlePK(Integer page, Integer pageRows, String article_pk) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> list = this.commentDao.getFirstLevelByArticlePK(page * pageRows, pageRows, article_pk);
        int total = this.commentDao.getFirstLevelTotal(article_pk);
        result.put("data", list);
        result.put("total", DataUtil.proPage(total, pageRows));
        mu.setM_istatus(1);
        mu.setM_object(result);
        return mu;
    }

    @Override
    public MessageUtil getCommentByArticlePKAndCommentParentPK(String article_pk, String commentParent_pk) {
        MessageUtil mu = new MessageUtil();
        List<Map<String, Object>> list = this.commentDao.getCommentByArticlePKAndCommentParentPK(article_pk, commentParent_pk);
        if (list != null && list.size() > 0) {
            mu.setM_istatus(1);
            mu.setM_object(list);
            mu.setM_strMessage("查询成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("无记录！");
        }
        return mu;
    }

    @Override
    public MessageUtil getCommentListPaging(Integer page, Integer pageRows) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> list = this.commentDao.getCommentListPaging(page * pageRows, pageRows);
        int total = this.commentDao.getTotalCount();
        result.put("data", list);
        result.put("total", DataUtil.proPage(total, pageRows));
        mu.setM_istatus(1);
        mu.setM_object(result);

        return mu;
    }

    @Override
    public MessageUtil updateCommentState(String comment_pk, String commentState) {
        MessageUtil mu = new MessageUtil();
        int i = this.commentDao.updateCommentState(comment_pk, commentState);
        if(i>0){
            mu.setM_istatus(1);
            mu.setM_strMessage("审核成功！");
        }else {
            mu.setM_istatus(0);
            mu.setM_strMessage("审核失败！");
        }
        return mu;
    }

}
