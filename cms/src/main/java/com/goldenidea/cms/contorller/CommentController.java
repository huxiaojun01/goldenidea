package com.goldenidea.cms.contorller;

import com.goldenidea.cms.dto.UserSession;
import com.goldenidea.cms.service.CommentService;
import com.goldenidea.cms.utils.MessageUtil;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RequestMapping("/commentController")
@RestController
public class CommentController {
    @Resource
    CommentService commentService;

    @RequestMapping("/addComment.do")
    MessageUtil addComment(@RequestBody Map<String, Object> comment, HttpServletRequest request) {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");
        comment.put("user_pk", userSession.getUser_pk());
        return this.commentService.addComment(comment);
    }

    @RequestMapping("/addLikeRecord.do")
    MessageUtil addLikeRecord(@RequestBody Map<String, Object> likeRecord, HttpServletRequest request) {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");
        likeRecord.put("user_pk", userSession.getUser_pk());
        return this.commentService.addLikeRecord(likeRecord);
    }

    @RequestMapping("/deleteCommentByPK.do")
    MessageUtil deleteCommentByPK(String comment_pk) {
        return this.commentService.deleteCommentByPK(comment_pk);
    }

    @RequestMapping("/getFirstLevelByArticlePK.do")
    MessageUtil getFirstLevelByArticlePK(Integer page, Integer pageRows, String article_pk) {
        return this.commentService.getFirstLevelByArticlePK(page, pageRows, article_pk);
    }

    @RequestMapping("/getCommentByArticlePKAndCommentParentPK.do")
    MessageUtil getCommentByArticlePKAndCommentParentPK(String article_pk, String commentParent_pk) {
        return this.commentService.getCommentByArticlePKAndCommentParentPK(article_pk, commentParent_pk);
    }

    @RequestMapping("/getCommentListPaging.do")
    MessageUtil getCommentListPaging(Integer page, Integer pageRows){
        return this.commentService.getCommentListPaging(page, pageRows);
    }

    @RequestMapping("/updateCommentState.do")
    MessageUtil updateCommentState(String comment_pk, String commentState){
        return this.commentService.updateCommentState(comment_pk, commentState);
    }

}
