package net.xsysc.draft.util;

/**
 * Created by syy on 2018/9/25.
 *
 */

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;

public class HttpRequest {
    private static Logger logger= LoggerFactory.getLogger(HttpRequest.class);
    private static String acceptStr = "accept";
    private static String connectionStr = "connection";
    private static String keepAliveStr = "Keep-Alive";
    private static String mozillaStr = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)";
    private static String userAgentStr = "user-agent";
    private static  String CHARTSET="utf-8";


    /**
     * 向指定URL发送GET方法的请求
     * @param url
     * 发送请求的URL
     * @param param
     * 请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return URL 所代表远程资源的响应结果
     */
    public static String sendGet(String url, String param) {
        String result = "";
        BufferedReader in = null;
        try {
            String urlNameString = url + "?" + param;
            URL realUrl = new URL(urlNameString);
            // 打开和URL之间的连接
            URLConnection connection = realUrl.openConnection();
            // 设置通用的请求属性
            connection.setRequestProperty(acceptStr, "*/*");
            connection.setRequestProperty(connectionStr, keepAliveStr);
            connection.setRequestProperty(userAgentStr,mozillaStr);
            // 设置文件字符集:
            connection.setRequestProperty("Charset", CHARTSET);
            // 建立实际的连接
            connection.connect();
            // 获取所有响应头字段
            Map<String, List<String>> map = connection.getHeaderFields();
            // 遍历所有的响应头字段
            for (Map.Entry<String, List<String>> me : map.entrySet()) {
                logger.info("{}--->{}",me.getKey(),me.getValue());
            }
            // 定义 BufferedReader输入流来读取URL的响应
            in = new BufferedReader(new InputStreamReader(
                    connection.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
            logger.error("发送GET请求出现异常！{}" , e.getMessage());
        }
        // 使用finally块来关闭输入流
        finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                logger.error(e2.getMessage());
            }
        }
        return result;
    }

    /**
     * 向指定 URL 发送POST方法的请求
     * @param url
     * 发送请求的 URL
     * @param param
     * 请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return 所代表远程资源的响应结果
     */
    public static String sendPost(String url, String param) {
        OutputStreamWriter out = null;
        BufferedReader in = null;
        String result = "";
        try {
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            URLConnection conn = realUrl.openConnection();
            // 设置通用的请求属性
            conn.setRequestProperty(acceptStr, "*/*");
            conn.setRequestProperty(connectionStr, keepAliveStr);
            conn.setRequestProperty(userAgentStr, mozillaStr);
            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            // 获取URLConnection对象对应的输出流
            out = new OutputStreamWriter(conn
                    .getOutputStream(), CHARTSET);
            // 发送请求参数
            out.write(param);
            // flush输出流的缓冲
            out.flush();
            // 定义BufferedReader输入流来读取URL的响应
            in = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(),CHARTSET));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
            logger.error("发送 POST 请求出现异常！{}",e.getMessage());
        }
        //使用finally块来关闭输出流、输入流
        finally{
            try{
                if(out!=null){
                    out.close();
                }
                if(in!=null){
                    in.close();
                }
            }
            catch(IOException ex){
                logger.error(ex.getMessage());
            }
        }
        return result;
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) {
//        String url="http://172.16.100.194:8000/taxpredif/";
//        String param="prid=1&ycyf=201704&tjyf=201703&swjg=20150205&ysbhs=841871359.53&wsbhs=136775580.43&bysftk=428226072.6&tqsftk=32938688.26&jmse=4906619689.69&sssr=816748550.18&sssr_tq=32938688.26&xznsrhs=79000&xznsrhs_sr=11111111111&zxnsrhs=10000&%20&zxnsrhs_rksr=10000000&zxnsrhs_qcruksr=7056595916.75&model_lin=1&model_rf=1";
//        String re=sendPost(url,param);
//        JSONObject jsonObject = JSONObject.parseObject(re);
//        RevenueModelResult revenueModelResult= JSON.parseObject(re,RevenueModelResult.class);
//        System.out.println("aaaa");
        String path = System.getProperty("user.dir");
        System.out.println(path);
        System.out.println();
    }
}