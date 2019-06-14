package net.xsysc.draft.util;
import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

public class imgDownloaderUtil {


    public static String imgDownloader(String imgUrl,String dirName){
        String[]  urlArray=imgUrl.split("/");
        Date now = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MMdd");

        String year = simpleDateFormat.format(now).split("-")[0];
        String date = simpleDateFormat.format(now).split("-")[1];
        String imgName = urlArray[urlArray.length-1];
        CloseableHttpClient client = HttpClients.createDefault();
        try{
            HttpGet get = new HttpGet(imgUrl);
            HttpResponse response = client.execute(get);
            HttpEntity entity = response.getEntity();
            InputStream in = entity.getContent();
            String dir = System.getProperty("os.name").contains("Windows")?"E:/cmsResources/img/"+dirName+"/"+year+"/"+date:"/mnt/cmsResources/img/"+dirName+"/"+year+"/"+date;
            //String dir = "E:\\workspace\\resources\\"+dirName+"\\"+year+"\\"+date;
            //File file = new File(dir);
            System.out.println(dir);
            File file = new File(dir);
            if(!file.exists()){
                file.mkdirs();
            }
            try {
                FileOutputStream fout = new FileOutputStream(file.getPath()+"/"+imgName);

                int l = -1;
                byte[] tmp = new byte[1024];
                while ((l = in.read(tmp)) != -1) {
                    fout.write(tmp, 0, l);
                }
                fout.flush();
                fout.close();
            } catch (IOException e){
                e.printStackTrace();
                return imgUrl;
            }finally {
                // 关闭低层流。
                in.close();
            }
            client.close();
            return "/img/"+dirName+"/"+year+"/"+date+"/"+imgName;
        }catch(Exception e1){
            System.out.println("下载图片出错"+imgUrl);
            return imgUrl;
        }
    }

    public static JSONObject imgUpload(MultipartFile file){
        JSONObject jsonObject = new JSONObject();
        if(file.isEmpty()){
            jsonObject.put("uploaded",0);
            jsonObject.put("error",new JSONObject().put("message","所选图片不存在！"));
        }else{

            String dir = System.getProperty("os.name").contains("Windows")?"E:/cmsResources/img/draft/":"/mnt/cmsResources/img/draft/";
            File f = new File(dir);
            if(!f.exists()){
                f.mkdirs();
            }
            try {
                InputStream in = file.getInputStream();
                String originalFilename = file.getOriginalFilename();
                String fileName = System.currentTimeMillis()+originalFilename.substring(originalFilename.lastIndexOf("."));
                FileOutputStream fout = new FileOutputStream(f.getPath()+"/"+fileName);
                int l = -1;
                byte[] tmp = new byte[1024];
                while ((l = in.read(tmp)) != -1) {
                    fout.write(tmp, 0, l);
                }
                fout.flush();
                fout.close();
                in.close();
                jsonObject.put("uploaded",1);
                jsonObject.put("fileName",fileName);
                jsonObject.put("url","/img/draft/"+fileName);
            } catch (IOException e){
                e.printStackTrace();
                jsonObject.put("uploaded",0);
                jsonObject.put("error",new JSONObject().put("message","上传图片时发生错误！"));
            }
        }
        return jsonObject;

    }
}
