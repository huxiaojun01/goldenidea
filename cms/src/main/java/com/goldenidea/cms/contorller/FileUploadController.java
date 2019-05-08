package com.goldenidea.cms.contorller;

import com.goldenidea.cms.utils.DateUtil;
import com.goldenidea.cms.utils.MessageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;

@RestController
public class FileUploadController {
    @Value("${file.storage}")
    private String fileStorage;

    /**
     * 多文件上传(单文件去掉数组即可)
     *
     * @param multipartFiles 文件
     * @param path           路径名称 例如: photo
     * @return
     */
    @PostMapping("/upload.do")
    public MessageUtil upload(@RequestParam("file") MultipartFile[] multipartFiles, @RequestParam("filePath") String path) {
        MessageUtil mu = new MessageUtil();
        String urls = "";
        try {
            for (MultipartFile multipartFile : multipartFiles) {
                String relativePath = getFilePath(path, multipartFile.getOriginalFilename());
                multipartFile.transferTo(Paths.get(relativePath));
                int lastIndexOf = relativePath.lastIndexOf("/");
                String fileName = relativePath.substring(lastIndexOf+1);
                urls += path + "/" +fileName + ",";
            }
            mu.setM_istatus(1);
            mu.setM_strMessage("上传成功！");
            mu.setM_object(urls.substring(0, urls.length() - 1));
            return mu;
        } catch (IOException e) {
            e.printStackTrace();
        }
        mu.setM_istatus(0);
        mu.setM_strMessage("上传失败！");
        return mu;
    }

    @RequestMapping("uploadFile.do")
    public MessageUtil uploadFile(HttpServletRequest req, String dirPath) throws IOException {
        MessageUtil mu = new MessageUtil();
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(req.getSession().getServletContext());
        // 判断 request 是否有文件上传,即多部分请求
        if (multipartResolver.isMultipart(req)) {
            // 转换成多部分request
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) req;
            // 取得request中的所有文件名
            Iterator<String> iter = multiRequest.getFileNames();
            while (iter.hasNext()) {
                // 取得上传文件
                MultipartFile mfile = multiRequest.getFile(iter.next());
                if (mfile != null) {
                    // 取得当前上传文件的文件名称
                    String myFileName = mfile.getOriginalFilename();
                    // 如果名称不为“”,说明该文件存在，否则说明该文件不存在
                    if (myFileName.trim() != "") {
                        String relativePath = getFilePath(dirPath, myFileName);
                        mfile.transferTo(Paths.get(relativePath));
                        int lastIndexOf = relativePath.lastIndexOf("/");
                        String fileName = relativePath.substring(lastIndexOf+1);
                        String urls = dirPath + "/" +fileName + ",";
                        mu.setM_istatus(1);
                        mu.setM_strMessage("上传成功！");
                        mu.setM_object(urls.substring(0, urls.length() - 1));
                        return mu;
                    }
                }
            }
        }
        mu.setM_istatus(0);
        mu.setM_strMessage("上传失败！");
        return mu;
    }

    /**
     * 生成获取文件路径
     *
     * @param path
     * @param fileName
     * @return
     */
    private String getFilePath(String path, String fileName) {
        String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
        String dateTime = DateUtil.date2String(new Date(), "yyyyMMddhhmmssSSS");
        String[] paths = path.split("/");
        String filePath = fileStorage;
        for (String p : paths) {
            if (!StringUtils.isEmpty(p)) {
                filePath += p + "/";
            }
        }
        File file = new File(filePath);
        if (!file.exists()) {
            file.mkdirs();
        }
        return String.format("%s%s%s.%s", filePath, dateTime, getRandom(6), suffix);
    }

    /**
     * 获取<code>length</code>位随机数
     *
     * @param length
     * @return
     */
    private String getRandom(int length) {
        String val = "";
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            val += random.nextInt(10);
        }
        return val;
    }


}