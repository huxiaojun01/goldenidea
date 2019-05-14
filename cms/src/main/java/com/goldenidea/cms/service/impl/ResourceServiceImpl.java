package com.goldenidea.cms.service.impl;

import com.goldenidea.cms.dao.ArticleDao;
import com.goldenidea.cms.dao.CommentDao;
import com.goldenidea.cms.dao.IntegralDao;
import com.goldenidea.cms.dao.ResourceDao;
import com.goldenidea.cms.service.ArticleService;
import com.goldenidea.cms.service.ResourceService;
import com.goldenidea.cms.utils.DataUtil;
import com.goldenidea.cms.utils.MessageUtil;
import com.goldenidea.cms.utils.Snowflake;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@Service
public class ResourceServiceImpl implements ResourceService {
    @Value("${file.storage}")
    private String fileStorage;
    @Resource
    ResourceDao resourceDao;
    @Resource
    ArticleDao articleDao;
    @Resource
    CommentDao commentDao;
    @Resource
    ArticleService articleService;


    @Override
    public MessageUtil addResource(Map<String, Object> resource) {
        MessageUtil mu = new MessageUtil();
        resource.put("file_pk", Snowflake.getInstance().nextId());
        int i = this.resourceDao.addResource(resource);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("上传成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("上传失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil deleteResourceByPK(String file_pk) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> resource = this.resourceDao.getResourceByPK(file_pk);
        File file = new File(fileStorage + String.valueOf(resource.get("fileUrl")));
        if (file.exists())
            file.delete();
        int i = this.resourceDao.deleteResourceByPK(file_pk);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("文件删除成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("文件删除失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil getResourceListPaging(Integer page, Integer pageRows) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> list = this.resourceDao.getResourceListPaging(page * pageRows, pageRows);
        int total = this.resourceDao.getTotalCount();
        result.put("data", list);
        result.put("total", DataUtil.proPage(total, pageRows));
        mu.setM_istatus(1);
        mu.setM_object(result);

        return mu;
    }

    @Override
    public MessageUtil updateResourceState(String file_pk, String fileState) {
        MessageUtil mu = new MessageUtil();
        int i = this.resourceDao.updateResourceState(file_pk, fileState);
        if (i>0){
            mu.setM_istatus(1);
            mu.setM_strMessage("审核成功！");
            String article_pk = this.articleDao.getArticlePkByFilePk(file_pk);
            if(article_pk!=null&& !article_pk.equals("")&&!article_pk.equals("null")){
                //删除对应相关信息
                this.articleService.deleteArticleByPK(article_pk);
            }
        }else {
            mu.setM_istatus(0);
            mu.setM_strMessage("审核失败！");
        }
        return mu;
    }
}
