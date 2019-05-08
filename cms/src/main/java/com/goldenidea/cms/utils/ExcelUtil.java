package com.goldenidea.cms.utils;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFCellUtil;
import org.apache.poi.ss.util.CellRangeAddress;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class ExcelUtil {
    /**
     * 生成excel表格
     *
     * @param name 生成文件的表头标题
     * @param dataList    写入的数据
     * @param excelHeader 标题
     * @param filedNames  标题对应的字段名
     * @return
     * @author huxiaojun
     */
    public static HSSFWorkbook createExcel(String name, List<Map<String, Object>> dataList, String[] excelHeader, String[] filedNames) {
        // 声明一个工作簿
        HSSFWorkbook wb = new HSSFWorkbook();
        // 生成一个表格
        HSSFSheet sheet = wb.createSheet("sheet1");
        // 生成一种样式
        HSSFCellStyle style = wb.createCellStyle();
        String color = "D9D9D9";    //此处得到的color为16进制的字符串
        //转为RGB码
        int r = Integer.parseInt((color.substring(0, 2)), 16);   //转为16进制
        int g = Integer.parseInt((color.substring(2, 4)), 16);
        int b = Integer.parseInt((color.substring(4, 6)), 16);
        //自定义cell颜色
        HSSFPalette palette = wb.getCustomPalette();
        //这里的9是索引
        palette.setColorAtIndex((short) 9, (byte) r, (byte) g, (byte) b);
        //   HSSFCellStyle style2 = wb.createCellStyle();
        //  style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style.setFillForegroundColor((short) 9);

        // 设置样式IndexedColors.GREY_25_PERCENT.getIndex()
        //  style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        // 生成一种字体
        HSSFFont font = wb.createFont();
        // 设置字体
        font.setFontName("宋体");
        // 设置字体大小
        font.setFontHeightInPoints((short) 10);
        // 字体加粗
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        // 在样式中引用这种字体
        style.setFont(font);//XSSF
        // 生成并设置另一个样式
        HSSFCellStyle style2 = wb.createCellStyle();
        //    style2.setFillForegroundColor(HSSFColor.YELLOW.i);

        String color1 = "FFFFFF";    //此处得到的color为16进制的字符串
        //转为RGB码
        int r1 = Integer.parseInt((color1.substring(0, 2)), 16);   //转为16进制
        int g1 = Integer.parseInt((color1.substring(2, 4)), 16);
        int b1 = Integer.parseInt((color1.substring(4, 6)), 16);
        //自定义cell颜色
        HSSFPalette palette1 = wb.getCustomPalette();
        //这里的10是索引
        palette1.setColorAtIndex((short) 10, (byte) r1, (byte) g1, (byte) b1);
        //   HSSFCellStyle style2 = wb.createCellStyle();
        //  style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style2.setFillForegroundColor((short) 10);

        style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style2.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style2.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        // 生成另一种字体2
        HSSFFont font2 = wb.createFont();
        // 设置字体
        font2.setFontName("宋体");
        // 设置字体大小
        font2.setFontHeightInPoints((short) 10);
        // 字体加粗
        // font2.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        // 在样式2中引用这种字体
        style2.setFont(font2);

        //第一行表头字段，合并单元格时字段跨几列就将该字段重复几次
        String name1 = name;
        String[] excelHeader0 = {name1};
        //{0,2,0,0}->{起始行，截止行，起始列，截止列}
        String[] headnum0 = {"0,1,0," + (excelHeader.length - 1)};
        HSSFRow row = sheet.createRow(0);
        sheet.setDefaultRowHeight((short) 360);// 设置行高
        for (int i = 0; i < excelHeader0.length; i++) {
            //sheet.autoSizeColumn(i, true);// 根据字段长度自动调整列的宽度
            HSSFCell cell = row.createCell(i);
            cell.setCellValue(excelHeader0[i]);
            cell.setCellStyle(style);
            for (int j = 0; j < excelHeader.length; j++) {
                sheet.setColumnWidth(j, 4200);    // 设置列宽
            }
        }
        // 动态合并单元格
        for (int i = 0; i < headnum0.length; i++) {
            // sheet.autoSizeColumn(i, true);
            String[] temp = headnum0[i].split(",");
            Integer startrow = Integer.parseInt(temp[0]);
            Integer overrow = Integer.parseInt(temp[1]);
            Integer startcol = Integer.parseInt(temp[2]);
            Integer overcol = Integer.parseInt(temp[3]);
            sheet.addMergedRegion(new CellRangeAddress(startrow, overrow, startcol, overcol));
            //Region region0 = new Region(0, (short) 0, 1, (short) 6);
            //MenuServiceImpl.setRegionStyle(sheet, region0, style);
            for (int i1 = startrow; i1 <= overrow; i1++) {
                HSSFRow row1 = HSSFCellUtil.getRow(i1, sheet);
                for (int j = startcol; j <= overcol; j++) {
                    HSSFCell cell = HSSFCellUtil.getCell(row1, (short) j);
                    cell.setCellStyle(style);
                }
            }
        }

        //第三行表头字段
        String[] excelHeader2 = excelHeader;
        row = sheet.createRow(2);
        for (int i = 0; i < excelHeader2.length; i++) {
            HSSFCell cell = row.createCell(i);
            cell.setCellValue(excelHeader2[i]);
            cell.setCellStyle(style);
        }

        //第四行起-数据填充
        Iterator<Map<String, Object>> it = dataList.iterator();
        int i = 0;
        while (it.hasNext()) {
            Map<String, Object> mp = it.next();
            row = sheet.createRow(i + 3);
            i++;
            // 导入对应列的数据
            int column = 0; //列数
            for (String key : filedNames) {
                HSSFCell cell = row.createCell(column);
                cell.setCellValue(new HSSFRichTextString(mp.get(key).toString()));
                cell.setCellStyle(style2);
                column++;
            }
        }
        return wb;
    }

}
