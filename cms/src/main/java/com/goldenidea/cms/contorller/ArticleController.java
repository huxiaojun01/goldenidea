package com.goldenidea.cms.contorller;

import com.goldenidea.cms.dto.UserSession;
import com.goldenidea.cms.service.ArticleService;
import com.goldenidea.cms.utils.MessageUtil;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RequestMapping("/articleController")
@RestController
public class ArticleController {
    @Resource
    ArticleService articleService;

    @RequestMapping("/addArticle.do")
    MessageUtil addArticle(@RequestBody Map<String, Object> article, HttpServletRequest request){
        UserSession userSession = (UserSession)request.getSession().getAttribute("userSession");
        article.put("user_pk", userSession.getUser_pk());
        return this.articleService.addArticle(article);
    }

    @RequestMapping("/deleteArticleByPK.do")
    MessageUtil deleteArticleByPK(String article_pk){
        return this.articleService.deleteArticleByPK(article_pk);
    }

    @RequestMapping("/getArticleByPK.do")
    MessageUtil getArticleByPK(String article_pk){
        return this.articleService.getArticleByPK(article_pk);
    }

    @RequestMapping("/getArticleListPaging.do")
    MessageUtil getArticleListPaging(HttpServletRequest request, Integer page, Integer pageRows, String searchKey, Integer articleType){
        String articlePower = "";
        UserSession user = (UserSession)request.getSession().getAttribute("userSession");
        //userType：0-管理员  1-VIP 2-普通用户
        int userType = 2;
        if (user!=null){
            userType = Integer.parseInt(user.getUserType());
        }
        //文章权限：1-对外开放  2-仅会员可见  3-个人可见
        if (userType==0){
            articlePower="1,2,3";
        } else if (userType==1){
            articlePower="1,2,3";
        } else {
            articlePower="1,3";
        }
        return this.articleService.getArticleListPaging(page, pageRows, searchKey, articleType, articlePower, user);
    }

    @RequestMapping("/getArticleByUserPkAndArticleTypeListPaging.do")
    MessageUtil getArticleByUserPkAndArticleTypeListPaging(HttpServletRequest request, Integer page, Integer pageRows, String searchKey, Integer articleType){
        UserSession user = (UserSession)request.getSession().getAttribute("userSession");
        return this.articleService.getArticleByUserPkAndArticleTypeListPaging(page, pageRows, searchKey, articleType, user.getUser_pk());
    }

    @RequestMapping("/addLikeNumberByPK.do")
    MessageUtil addLikeNumberByPK(HttpServletRequest request, String article_pk, Integer type){
        UserSession user = (UserSession)request.getSession().getAttribute("userSession");
        return this.articleService.addLikeNumberByPK(article_pk, user.getUser_pk(), type);
    }
}
