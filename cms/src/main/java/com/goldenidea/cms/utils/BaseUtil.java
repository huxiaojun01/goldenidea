package com.goldenidea.cms.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.codec.digest.DigestUtils;

public class BaseUtil {

	/**
	 * 生成一个32位UUID
	 * 
	 * @return
	 */
	public static String makeUUIDPK() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

	/**
	 * 获取一个文件的md5值(可处理大文件)
	 * 
	 * @return md5 value
	 */
	public static String getMD5(File file) {
		FileInputStream fileInputStream = null;
		try {
			MessageDigest MD5 = MessageDigest.getInstance("MD5");
			fileInputStream = new FileInputStream(file);
			byte[] buffer = new byte[8192];
			int length;
			while ((length = fileInputStream.read(buffer)) != -1) {
				MD5.update(buffer, 0, length);
			}
			return new String(Hex.encodeHex(MD5.digest()));
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			try {
				if (fileInputStream != null) {
					fileInputStream.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 求一个字符串的md5值
	 * 
	 * @param target 字符串
	 * @return md5 value
	 */
	public static String MD5(String target) {
		return DigestUtils.md5Hex(target);
	}

	/**
	 * 得到项目路径
	 * 
	 * @return
	 * @throws Exception
	 */
	public String getProjectPath() throws Exception {
		// 获取到class的绝对路径
		String urls = this.getClass().getClassLoader().getResource("/") + "";
		// 截取需要的路径
		urls = urls.substring(6, urls.length() - 17);
		// 替换路径中的/为\\
		// urls = urls.replace("/", "\\");
		// 当路径中存在空格的时候，tomcat在获取的路径中会生成为%20，这时需要替换为“ ”

		String newUrl = urls.replace("%20", " ");
		return newUrl;
	}

	/**
	 * 获取项目路径 支持 windows 与 linux
	 * 
	 * @return
	 */
	public static String getRootPath() {
		String classPath = BaseUtil.class.getClassLoader().getResource("/").getPath();
		String rootPath = "";
		// windows下
		if ("\\".equals(File.separator)) {
			rootPath = classPath.substring(1, classPath.indexOf("/WEB-INF/classes"));
			rootPath = rootPath.replace("/", "\\");
		}
		// linux下
		if ("/".equals(File.separator)) {
			rootPath = classPath.substring(0, classPath.indexOf("/WEB-INF/classes"));
			rootPath = rootPath.replace("\\", "/");
		}
		return rootPath;
	}

	/**
	 * 截取文件名后缀
	 */
	public static String getExtention(String fileName) {
		int pos = fileName.lastIndexOf(".");
		return fileName.substring(pos + 1);
	}

	/**
	 * 获取6位随机数
	 * 
	 * @return
	 */
	public static int randomNum() {

		Random r = new Random();
		int num = r.nextInt(900000) + 100000;

		return num;
	}

	/**
	 * 组合菜单
	 * 
	 * @param parentId
	 * @param all
	 * @return
	 */
	public static List<Map<String, Object>> makeMenuTree(String parentId, List<Map<String, Object>> all) {
		List<Map<String, Object>> ls = new ArrayList<Map<String, Object>>();
		Map<String, Object> item = null;
		for (Map<String, Object> a : all) {
			if (a.get("moduleParent_id").toString().equals(parentId)) {
				item = new HashMap<String, Object>();
				item.put("title", a.get("moduleName"));
				item.put("img", a.get("moduleIco"));

				List<Map<String, Object>> child = BaseUtil.makeMenuTree(a.get("module_id").toString(), all);
				if (null != child && child.size() > 0) {
					item.put("sub", child);
				} else {
					item.put("url", a.get("moduleUrl"));
				}

				ls.add(item);
			}
		}

		return ls;
	}

}
