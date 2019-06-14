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

public class eeoPageProcessor implements PageProcessor {

    private Site site = Site.me().setCycleRetryTimes(3).setSleepTime(1000).setTimeOut(10000);
    private String initWebsite = "http://www.eeo.com.cn";
    //private String initWebsite = "http://www.eeo.com.cn/2019/0411/353153.shtml";
    private String articleUrlPattern = "http://www.eeo.com.cn/[0-9][0-9][0-9][0-9]/[0-9][0-9][0-9][0-9]/\\d+.shtml";
    //private String articleUrlPattern = "http://www.eeo.com.cn/2019/031[5-8]/\\d+.shtml";
    private StringBuffer allcid = new StringBuffer();
    private int pageNum = 0;
    private String dateFormat;
    //private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    public eeoPageProcessor(String dateFormat){
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

        if(page.getUrl().toString().equals(initWebsite)){
            //*首页文章url抽取,文章信息解析
            //*
            List<Selectable> nodes=page.getHtml().xpath("//ul[@id='index_list_1'or@id='index_list_2']//a").nodes();
            List<Map> articleInfo = new ArrayList<Map>();
            List<String> urls = new ArrayList<String>();
            for (Selectable node:nodes) {
                if(node.links().get().matches(articleUrlPattern)){
                    Map map = new HashMap();
                    map.put("title",node.xpath("span/text()").get());
                    map.put("keyword",node.xpath("div/text()").get());
                    map.put("summary",node.xpath("p/text()").get());
                    map.put("source_url",node.links().get());
                    map.put("source_website","经济观察网");
                    articleInfo.add(map);
                    urls.add(node.links().get());
                }

            }
            page.putField("operation","1");
            page.putField("articleInfo",articleInfo);
            page.addTargetRequests(urls);
            //文章列表页URL参数解析
            List<String> allcidList=page.getHtml().getDocument().getElementsByAttribute("data-cid").eachAttr("data-cid");
            for(int i=0;i<allcidList.size();i++){
                allcid.append(allcidList.get(i)+",");
            }
            allcid.deleteCharAt(allcid.length()-1);
            String articleListUrl = "https://app.eeo.com.cn/?app=article&controller=article&action=getindexshuju&catid=1&allcid="+allcid.toString()+"&page="+pageNum;
            page.addTargetRequest(articleListUrl);
        }else if(page.getUrl().toString().matches(articleUrlPattern)){
            /*文章内容抽取
             * */
            Html html = page.getHtml();
            //文章头部
            String publishTime = html.xpath("//div[@class='xd-b-b']/p/span/text()").toString();
            /*try {
                Date dateAhead = sdf.parse(dateFormat);
                Date publishDate = sdf.parse(publishTime);
                if(dateAhead.before(publishDate)){
                    Map articleInfo = new HashMap();
                    articleInfo.put("publish_time",publishTime);
                    articleInfo.put("author",html.xpath("//div[@class='xd-b-b']/p/text()").toString());
                    articleInfo.put("SOURCE_URL",page.getUrl().get());
                    //文章配图
                    String imgUrl = html.xpath("//div[@class='xd-nr']/div[@class='xd-xd-xd-newsimg']/img/@src").get() == null ? "":html.xpath("//div[@class='xd-nr']/div[@class='xd-xd-xd-newsimg']/img/@src").get();
                    if(!imgUrl.equals("")){
                        articleInfo.put("imgUrl",imgDownloaderUtil.imgDownloader(imgUrl,"eeo"));
                    }
                    //文章内容
                    List<Selectable> nodes=html.xpath("//div[@class='xd-nr']/div[@class='xx_boxsing']/p").nodes();
                    List<Map> content = new ArrayList<Map>();
                    //段落抽取
                    *//*直接存P标签，如果是图片则下载图片，替换路径
                     * *//*
                    for (int i=0;i<nodes.size();i++) {
                        Map map = new HashMap();
                        if(nodes.get(i).xpath("//img").get()==null){
                            map.put("phraseNum",i+1);
                            map.put("phrase",nodes.get(i).get());
                        }else{
                            //对图片的处理
                            nodes.get(i).xpath("img/@src").replace("http://upload.eeo.com.cn/","");
                            map.put("phraseNum",i+1);
                            map.put("phrase",nodes.get(i).get().replaceAll("src=\"(.*?)\"","src=\""+imgDownloaderUtil.imgDownloader(nodes.get(i).xpath("//img/@src").get(),"eeo")+"\""));
                        }
                        map.put("SOURCE_URL",page.getUrl().get());
                        content.add(map);
                    }
                    page.putField("operation","0");
                    //文章信息
                    page.putField("articleInfo",articleInfo);
                    //文章内容
                    page.putField("list",content);
                }else{
                    page.setSkip(true);
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }*/
            Map articleInfo = new HashMap();
            articleInfo.put("publish_time",publishTime);
            articleInfo.put("author",html.xpath("//div[@class='xd-b-b']/p/text()").toString());
            articleInfo.put("SOURCE_URL",page.getUrl().get());
            //文章配图
            String imgUrl = html.xpath("//div[@class='xd-nr']/div[@class='xd-xd-xd-newsimg']/img/@src").get() == null ? "":html.xpath("//div[@class='xd-nr']/div[@class='xd-xd-xd-newsimg']/img/@src").get();
            if(!imgUrl.equals("")){
                articleInfo.put("imgUrl",imgDownloaderUtil.imgDownloader(imgUrl,"eeo"));
            }
            //文章内容
            List<Selectable> nodes=html.xpath("//div[@class='xd-nr']/div[@class='xx_boxsing']/p").nodes();
            List<Map> content = new ArrayList<Map>();
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
                    nodes.get(i).xpath("img/@src").replace("http://upload.eeo.com.cn/","");
                    map.put("phraseNum",i+1);
                    map.put("phrase",nodes.get(i).get().replaceAll("src=\"(.*?)\"","src=\""+imgDownloaderUtil.imgDownloader(nodes.get(i).xpath("//img/@src").get(),"eeo")+"\""));
                }
                map.put("SOURCE_URL",page.getUrl().get());
                content.add(map);
            }
            page.putField("operation","0");
            //文章信息
            page.putField("articleInfo",articleInfo);
            //文章内容
            page.putField("list",content);

            /*page.putField("SOURCE_URL",page.getUrl().get());*/
           /* Map articleContent = new HashMap();
            articleContent.put("list",content);
            articleContent.put("SOURCE_URL",page.getUrl().get());
            page.putField("articleContent",articleContent);*/
        }else if(page.getUrl().toString().matches("https://app.eeo.com.cn/\\?app=article&controller=article&action=getindexshuju&catid=1&allcid="+allcid.toString()+"&page=\\d+")){
            try {
                boolean flag = true;
                String rawText = page.getRawText();
                JSONObject jsonObject = JSONObject.parseObject(rawText.substring(1,rawText.length()-2));
                JSONArray jsonArray = jsonObject.getJSONArray("msg");
                Date dateAhead = sdf.parse(dateFormat);
                List<String> urls = new ArrayList<>();
                List<Map> articleInfo = new ArrayList<Map>();
                for(int i=0;i<jsonArray.size();i++){
                    long timestamp = Long.parseLong(((JSONObject)jsonArray.get(i)).get("published").toString())*1000;
                    Date publishDate = new Date(timestamp);
                    if(((JSONObject)jsonArray.get(i)).get("url").toString().matches(articleUrlPattern)&&dateAhead.before(publishDate)){
                        Map map = new HashMap();
                        map.put("title",((JSONObject)jsonArray.get(i)).get("title"));
                        map.put("keyword",((JSONObject)jsonArray.get(i)).get("name"));
                        map.put("summary",((JSONObject)jsonArray.get(i)).get("description"));
                        map.put("source_url",((JSONObject)jsonArray.get(i)).get("url").toString());
                        map.put("source_website","经济观察网");
                        articleInfo.add(map);
                        urls.add(((JSONObject)jsonArray.get(i)).get("url").toString());
                    }else{
                        flag = false;
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
                    String articleListUrl = "https://app.eeo.com.cn/?app=article&controller=article&action=getindexshuju&catid=1&allcid="+allcid.toString()+"&page="+pageNum;
                    page.addTargetRequest(articleListUrl);
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }else {
            page.setSkip(true);
        }

        /*page.getHtml().xpath("//span[@data-cid]");*/

    }
}
