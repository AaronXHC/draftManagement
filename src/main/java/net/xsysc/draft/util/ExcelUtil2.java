package net.xsysc.draft.util;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;


public class ExcelUtil2 {


    /**
     * 默认列宽
     * 默认日期格式
     */

    public static final int COLUMN_WIDTH = 17;
    public static void setExcelSheet(List<Map<String, Object>> list, String title, String[][] headName, SXSSFWorkbook sxssfworkbook, CellStyle[] style) {

        //创建表格
        SXSSFSheet sheet = sxssfworkbook.createSheet();
        //产生表格标题行
        Map<String, Object> map = list.get(0);

        int minBytes = COLUMN_WIDTH;
        int[] arrColWidth = new int[headName.length];
        // 产生表格标题行,以及设置列宽
        String[] properties = new String[headName.length];
        String[] headers = new String[headName.length];
        int ii = 0;
        for (int a = 0; a < headName.length; a++) {
            String fieldName = headName[a][1];
            properties[ii] = fieldName;
            String colName = headName[a][0];
            headers[ii] = colName;
            int bytes = fieldName.getBytes().length;
            arrColWidth[ii] = bytes < minBytes ? minBytes : bytes;
            sheet.setColumnWidth((short) ii, (short) (arrColWidth[ii] * 256));
            ii++;
        }
        //遍历集合数据，产生数据行
        int rowIndex = 0;
        for (Map<String, Object> obj : list) {
            if (rowIndex == 65535 || rowIndex == 0) {
                if (rowIndex != 0) sheet = sxssfworkbook.createSheet();//如果数据超过了，则在第二页显示
                //表名 rowIndex=0
                SXSSFRow titleRow = sheet.createRow(0);
                SXSSFCell titleCell = titleRow.createCell((short) 0);
                String t=title.substring(0,title.lastIndexOf("."));
                titleCell.setCellValue(t);
                titleCell.setCellStyle(style[0]);
                CellRangeAddress range = new CellRangeAddress(0, 0, 0, headName.length - 1);
                sheet.addMergedRegion(range);

                //列头 rowIndex =1
                SXSSFRow headerRow = sheet.createRow(1);
                for (short i = 0; i < headers.length; i++) {
                    SXSSFCell headerCell = headerRow.createCell(i);
                    headerCell.setCellValue(headers[i]);
                    headerCell.setCellStyle(style[1]);
                }
                rowIndex = 2;//数据内容从 rowIndex=2开始
            }

            SXSSFRow dataRow = sheet.createRow(rowIndex);
            for (short i = 0; i < properties.length; i++) {
                SXSSFCell newCell = dataRow.createCell(i);
                Object val = obj.get(properties[i]);
                String o = val == null ? "" : val.toString();
                String cellValue;
                if (o == null) {
                    cellValue = "";
                } else {
                    cellValue = o;
                }
                newCell.setCellValue(cellValue);
                newCell.setCellStyle(style[2]);
            }
            rowIndex++;
        }
    }

    public static String getStringCellValue(Cell cell) {
        if (cell == null) {
            return "";
        }
        CellType type = cell.getCellTypeEnum();
        String str;
        if (CellType.NUMERIC.equals(type)) {
            str = Double.toString(cell.getNumericCellValue());
        } else if (CellType.STRING.equals(type)) {
            str = cell.getStringCellValue();
        } else {
            str = "";
        }
        return str;
    }
    /**
     * 根据文件不同后缀，创建不同的workBook
     * @param file
     * @return
     */
//    public static Workbook createWorkBook(MultipartFile file) throws IOException {
//        String originalFilename = file.getOriginalFilename();
//        Workbook workbook = null;
//        if (originalFilename.endsWith(SUFFIX_2003)) {
//            workbook = new HSSFWorkbook(file.getInputStream());
//        } else if (originalFilename.endsWith(SUFFIX_2007)) {
//            workbook = new XSSFWorkbook(file.getInputStream());
//        }
//        return workbook;
//    }

}
