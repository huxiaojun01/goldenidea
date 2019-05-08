package com.goldenidea.cms.service.impl;

import com.goldenidea.cms.dao.ArticleDao;
import com.goldenidea.cms.dao.CommentDao;
import com.goldenidea.cms.dao.IntegralDao;
import com.goldenidea.cms.dao.ResourceDao;
import com.goldenidea.cms.dto.UserSession;
import com.goldenidea.cms.service.ArticleService;
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
public class ArticleServiceImpl implements ArticleService {
    @Resource
    ArticleDao articleDao;
    @Resource
    CommentDao commentDao;
    @Resource
    IntegralDao integralDao;
    @Resource
    ResourceDao resourceDao;


    @Override
    public MessageUtil addArticle(Map<String, Object> article) {
        MessageUtil mu = new MessageUtil();
        String file_pk = Snowflake.getInstance().nextId().toString();
        String file_pk1 = Snowflake.getInstance().nextId().toString();
        article.put("article_pk", Snowflake.getInstance().nextId());
        article.put("resource_pk", file_pk1);
        article.put("file_pk", file_pk);
        int i = this.articleDao.addArticle(article);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("发布成功！");
            //添加记录-封面图片
            Map<String, Object> resource = new HashMap<>();
            resource.put("file_pk", file_pk);
            String fileUrl = String.valueOf(article.get("articleImage"));
            int lastIndexOf = fileUrl.lastIndexOf("/");
            String fileName = fileUrl.substring(lastIndexOf + 1);
            resource.put("fileName", fileName);
            resource.put("fileUrl", fileUrl);
            int i1 = this.resourceDao.addResource(resource);
            //添加记录-上传资源
            resource.replace("file_pk", file_pk1);
            String fileUrl1 = String.valueOf(article.get("resource"));
            int lastIndexOf1 = fileUrl.lastIndexOf("/");
            String fileName1 = fileUrl.substring(lastIndexOf1 + 1);
            resource.replace("fileName", fileName1);
            resource.replace("fileUrl", fileUrl1);
            int i2 = this.resourceDao.addResource(resource);
            //积分增加
            String user_pk = String.valueOf(article.get("user_pk"));
            //文章类型：1-文章  2-心情  3-想法
            int articleType = Integer.parseInt(String.valueOf(article.get("articleType")));
            //文章权限：1-对外开放  2-仅会员可见  3-个人可见
            int articlePower = Integer.parseInt(String.valueOf(article.get("articlePower")));
            if (articleType == 1) {    //发表文章
                if (articlePower == 1) {
                    this.integralDao.addUserIntegral(user_pk, 5);   //+5
                } else if (articlePower == 2) {
                    this.integralDao.addUserIntegral(user_pk, 3);   //+3
                }
            } else {   //发表想法/心情
                this.integralDao.addUserIntegral(user_pk, 1);   //+1
            }
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("发布失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil deleteArticleByPK(String article_pk) {
        MessageUtil mu = new MessageUtil();
        int i = this.articleDao.deleteArticleByPK(article_pk);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("删除成功！");
            //同时删除评论
            this.commentDao.deleteCommentByArticlePK(article_pk);
            //同时删除点赞记录
            this.commentDao.deleteLikeRecordByArticlePK(article_pk);
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("删除失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil getArticleByPK(String article_pk, UserSession user) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> article = this.articleDao.getArticleByPK(article_pk);
        if (article != null && !article.isEmpty()) {
            mu.setM_istatus(1);
            mu.setM_strMessage("查询成功！");
            //下载权限判断 (文件权限：1-对外开放  2-仅会员可见  3-个人可见)
            boolean isDownload = false; //下载权限
            int resourcePower = Integer.parseInt(article.get("resourcePower").toString());
            String userType = user.getUserType();   //0-管理员  1-VIP 2-普通用户
            if (resourcePower == 1) {   //对外开放
                isDownload = true;
            } else if (resourcePower == 2) {    //仅会员
                if (userType.equals("1")) {
                    isDownload = true;
                } else {
                    isDownload = false;
                }
            } else { //个人可见

            }
            String login_user_pk = user.getUser_pk();
            String user_pk = article.get("user_pk").toString();
            if (login_user_pk.equals(user_pk)) {  //本人资源--可下载
                isDownload = true;
            }
            article.put("isDownload", isDownload);
            mu.setM_object(article);
            //阅读量+1
            this.articleDao.addArticleReadByPK(article_pk);
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("查询失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil getArticleListPaging(Integer page, Integer pageRows, String searchKey, Integer articleType, String articlePower, UserSession user) {
        MessageUtil mu = new MessageUtil();
        int r = 0;
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> list = this.articleDao.getArticleListPaging(page * pageRows, pageRows, searchKey, articleType, articlePower);
        for (int i = 0; i < list.size(); i++) {
            //articlePower文章权限：1-对外开放  2-仅会员可见  3-个人可见
            if ("3".equals(String.valueOf(list.get(i).get("articlePower")))) {
                String loginUser = user.getUser_pk();
                String articleUser = String.valueOf(list.get(i).get("user_pk"));
                if (!loginUser.equals(articleUser)) {    //不是本人文章
                    list.remove(i);
                    r += 1;
                }
            }
        }
        int total = this.articleDao.getTotalCount(searchKey, articleType, articlePower);
        total -= r;
        result.put("data", list);
        result.put("total", DataUtil.proPage(total, pageRows));
        mu.setM_istatus(1);
        mu.setM_object(result);

        return mu;
    }

    @Override
    public MessageUtil getArticleByUserPkAndArticleTypeListPaging(Integer page, Integer pageRows, String searchKey, Integer articleType, String user_pk) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> list = this.articleDao.getArticleByUserPkAndArticleTypeListPaging(page * pageRows, pageRows, searchKey, articleType, user_pk);
        int total = this.articleDao.getTotalCountByUserPkAndArticleType(searchKey, articleType, user_pk);
        result.put("data", list);
        result.put("total", DataUtil.proPage(total, pageRows));
        mu.setM_istatus(1);
        mu.setM_object(result);

        return mu;
    }

    @Override
    public MessageUtil addLikeNumberByPK(String article_pk, String user_pk, Integer type) {
        MessageUtil mu = new MessageUtil();
        //判断是否重复点赞
        int like = this.articleDao.isLike(user_pk, article_pk, type);
        if (like > 0) {//已点赞
            mu.setM_istatus(0);
            mu.setM_strMessage("已" + (type.intValue() != 1 ? "反对" : "点赞") + "过啦！");
            return mu;
        }
        if (type.intValue() != 1) {
            this.articleDao.addUnLikeNumberByPK(article_pk);
        } else {
            this.articleDao.addLikeNumberByPK(article_pk);
        }
        Map<String, Object> likeRecord = new HashMap<>();
        likeRecord.put("fabulous_pk", Snowflake.getInstance().nextId());
        likeRecord.put("article_pk", article_pk);
        likeRecord.put("user_pk", user_pk);
        likeRecord.put("type", type);
        int i = this.commentDao.addLikeRecord(likeRecord);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage((type.intValue() != 1 ? "反对" : "点赞") + "成功！");
            //积分增加(点赞)
            if (type.intValue() != 0) {
                Map<String, Object> article = this.articleDao.getArticleByPK(article_pk);
                String user_pk1 = article.get("user_pk").toString();
                //1-文章  2-心情  3-想法
                int articleType = Integer.parseInt(article.get("articleType").toString());
                this.integralDao.addUserIntegral(user_pk1, articleType == 1 ? 3 : 1);
            }
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage((type.intValue() != 1 ? "反对" : "点赞") + "失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil updateArticle(Map<String, Object> article) {
        MessageUtil mu = new MessageUtil();
        String file_pk = Snowflake.getInstance().nextId().toString();
        article.replace("file_pk", file_pk);
        int i = this.articleDao.updateArticle(article);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("修改成功！");
            //添加记录
            Map<String, Object> resource = new HashMap<>();
            resource.put("file_pk", file_pk);
            String fileUrl = String.valueOf(article.get("articleImage"));
            int lastIndexOf = fileUrl.lastIndexOf("/");
            String fileName = fileUrl.substring(lastIndexOf + 1);
            resource.put("fileName", fileName);
            resource.put("fileUrl", fileUrl);
            this.resourceDao.addResource(resource);
            //删除原有记录
            this.resourceDao.deleteResourceByPK(article.get("file_pk").toString());
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("修改失败！");
        }
        return mu;
    }
}
