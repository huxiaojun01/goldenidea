package com.goldenidea.cms.contorller;

import com.goldenidea.cms.utils.DateUtil;
import com.goldenidea.cms.utils.MessageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Date;
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