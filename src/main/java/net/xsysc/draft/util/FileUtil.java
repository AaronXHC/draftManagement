package net.xsysc.draft.util;

import java.io.File;

/**
 * Created by syy on 2018/10/26.
 */
public class FileUtil {
    /**
     * 重命名文件
     * @param fileName
     * @return
     */
    public static String reName(String fileName){
        String ext =fileName.substring(fileName.lastIndexOf(".") + 1);
        SnowflakeIdWorker snowflakeIdWorker=new SnowflakeIdWorker(0,0);
        String newFileName=snowflakeIdWorker.nextId()+"."+ext;
        return newFileName;
    }
    /**
     * 创建文件
     * @param filePath
     * @param fileName
     * @return
     */
    public static File creatFile(String filePath, String fileName) {
        File folder = new File(filePath);
        //文件夹路径不存在
        if (!folder.exists() && !folder.isDirectory()) {
            folder.mkdirs();
        }
        //对文件重新明明
        File file = new File(filePath +File.separator+ fileName);
        return file;
    }
    public static void delteFile(File file){
        File [] filearray=	file.listFiles();
        if(filearray!=null){
            for(File f:filearray){
                if(f.isDirectory()){
                    delteFile(f);
                }else{
                    f.delete();
                }
            }
            file.delete();
        }
    }
    public static void main(String [] agrs){
        File file=new File("D:\\tax\\analysis");
        delteFile(file);
        System.out.println();

    }

}
