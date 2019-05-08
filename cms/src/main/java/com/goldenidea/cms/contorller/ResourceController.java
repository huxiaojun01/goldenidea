package com.goldenidea.cms.contorller;

import com.goldenidea.cms.service.ResourceService;
import com.goldenidea.cms.utils.MessageUtil;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

@RequestMapping("/resourceController")
@RestController
public class ResourceController {
    @Value("${file.storage}")
    private String fileStorage;
    @Resource
    ResourceService resourceService;

    @RequestMapping("/addResource.do")
    MessageUtil addResource(@RequestBody Map<String, Object> resource) {
        return this.resourceService.addResource(resource);
    }

    @RequestMapping("/deleteResourceByPK.do")
    MessageUtil deleteResourceByPK(String file_pk) {
        return this.resourceService.deleteResourceByPK(file_pk);
    }

    @RequestMapping("/getResourceListPaging.do")
    MessageUtil getResourceListPaging(Integer page, Integer pageRows) {
        return this.resourceService.getResourceListPaging(page, pageRows);
    }

    @RequestMapping("/download.do")
    public void download(String fileUrl, String fileName, HttpServletResponse resp) {
        resp.setContentType("application/octet-stream; charset=utf-8");
        try {
            resp.setHeader("Content-Disposition", "attachment; filename=" + fileName);//以附件方式下载，防止浏览器直接打开
            IOUtils.copy(new FileInputStream(new File(fileStorage+fileUrl)), resp.getOutputStream());
        } catch (UnsupportedEncodingException e1) {
            e1.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/updateResourceState.do")
    MessageUtil updateResourceState(String file_pk, String fileState){
        return this.resourceService.updateResourceState(file_pk, fileState);
    }

}
