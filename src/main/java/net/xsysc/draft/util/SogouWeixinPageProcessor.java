package net.xsysc.draft.util;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;
import us.codecraft.webmagic.selector.Html;
import us.codecraft.webmagic.selector.Selectable;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class SogouWeixinPageProcessor implements PageProcessor {

    private Site site = Site.me().setCycleRetryTimes(3).setSleepTime(1000).setTimeOut(10000);
    private String domain = "http://www.linkshop.com.cn";
    //private String initWebsite = "http://www.linkshop.com.cn/web/archives/2019/423697.shtml";
    private String initWebsite = "http://www.linkshop.com.cn/Web/News_Index.aspx?isAjax=1&action=zixun_zx&tab=zx&pageNo=1";
    private String articleUrlPattern = "http://www.linkshop.com.cn/web/archives/2019/\\d+.shtml";
    private int pageNum = 1;
    private String dateFormat;


    public SogouWeixinPageProcessor(String dateFormat){
        this.dateFormat = dateFormat;
    }
    public String getInitWebsite() {
        return initWebsite;
    }

    @Override
    public Site getSite() {
        return site;
    }


    @Override
    public void process(Page page) {

        if(page.getUrl().toString().matches(articleUrlPattern)){

            /*文章内容抽取
            * */
            Html html = page.getHtml();
            Map articleInfo = new HashMap();
            //文章头部
            articleInfo.put("author",html.xpath("//span[@class='author']/text()").get());
            articleInfo.put("SOURCE_URL",page.getUrl().get());
            articleInfo.put("publish_time",html.xpath("//span[@class='time']/text()").get());
            //文章内容
            List<Selectable> nodes=html.xpath("//article[@class='page']//section/*").nodes();
            List<Map> content = new ArrayList<>();
            //段落抽取
            /*直接存P标签，如果是图片则下载图片，替换路径
             * */
            for (int i=0;i<nodes.size();i++) {
                Map map = new HashMap();
                if(nodes.get(i).xpath("//img").get()==null){
                    map.put("phraseNum",i+1);
                    map.put("phrase",nodes.get(i).get());
                }else{
                    //对图片的处理
                    map.put("phraseNum",i+1);
                    map.put("phrase",nodes.get(i).get().replaceAll("src=\"(.*?)\"","src=\""+imgDownloaderUtil.imgDownloader(nodes.get(i).xpath("//img/@src").get(),"linkshop")+"\""));
                    /*if(imgDownloader(nodes.get(i).xpath("//img/@src").get())==0){
                        map.put("phrase",nodes.get(i).get().replace("http://www.linkshop.com.cn/upload/","/"));
                    }else{
                        map.put("phrase",nodes.get(i).get());
                    }*/
                }
                map.put("SOURCE_URL",page.getUrl().get());
                content.add(map);
            }
            page.putField("operation","0");
            //文章信息
            page.putField("articleInfo",articleInfo);
            //文章内容
            page.putField("list",content);
        }else if(page.getUrl().toString().matches("http://www.linkshop.com.cn/Web/News_Index.aspx\\?isAjax=1&action=zixun_zx&tab=zx&pageNo=\\d+")){
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            /*文章列表页处理
            * */
            boolean flag = true;
            JSONObject jsonObject = JSONObject.parseObject(page.getRawText());
            if((Integer) jsonObject.get("flag")==1){
                JSONArray jsonArray = jsonObject.getJSONArray("Data");
                List<String> urls = new ArrayList<>();
                List<Map> articleInfo = new ArrayList<>();
                for(int i=0;i<jsonArray.size();i++){
                    if((domain+((JSONObject)jsonArray.get(i)).get("APage").toString()).matches(articleUrlPattern)){
                        /*判断文章发布日期
                        * */
                        try {
                            String publishDate = ((JSONObject)jsonArray.get(i)).get("updatetime").toString();
                            Date date = sdf.parse(publishDate);
                            Date dateAhead = simpleDateFormat.parse(dateFormat);
                            if(dateAhead.before(date)){
                                /*文章信息处理成List<Map>*/
                                String imgUrl = ((JSONObject)jsonArray.get(i)).get("PicUrl").toString();
                                Map map = new HashMap();
                                if(!imgUrl.equals("")){
                                    /*if(imgDownloader(imgUrl)==0){
                                        map.put("imgUrl",imgUrl.replace("http://www.linkshop.com.cn/upload/",""));
                                    }*/
                                    map.put("imgUrl",imgDownloaderUtil.imgDownloader(imgUrl,"linkshop"));
                                }
                                map.put("title",((JSONObject)jsonArray.get(i)).get("Title").toString());
                                map.put("keyword",((JSONObject)jsonArray.get(i)).get("Key").toString());
                                map.put("summary",((JSONObject)jsonArray.get(i)).get("abstract").toString());
                                map.put("source_url",(domain+((JSONObject)jsonArray.get(i)).get("APage").toString()));
                                map.put("source_website","联商网");
                                articleInfo.add(map);
                                urls.add((domain+((JSONObject)jsonArray.get(i)).get("APage").toString()));
                            }else{
                                flag = false;
                            }
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                    }
                }
                if(articleInfo.size()>0){
                    page.putField("operation","1");
                    page.putField("articleInfo",articleInfo);
                    page.addTargetRequests(urls);
                }else{
                    page.setSkip(true);
                }
                if(flag){
                    pageNum++;
                    String articleListUrl = "http://www.linkshop.com.cn/Web/News_Index.aspx?isAjax=1&action=zixun_zx&tab=zx&pageNo="+pageNum;
                    page.addTargetRequest(articleListUrl);
                }
            }
        }else{
            page.setSkip(true);
        }

        /*page.getHtml().xpath("//span[@data-cid]");*/

    }






}
