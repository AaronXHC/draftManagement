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

public class YicaiPageProcessor implements PageProcessor {

    private Site site = Site.me().setCycleRetryTimes(3).setSleepTime(1000).setTimeOut(10000);
    private String domain = "https://www.yicai.com";
    //private String initWebsite = "https://www.yicai.com/news/100170537.html";
    private String initWebsite = "https://www.yicai.com/api/ajax/getjuhelist?action=news&page=1&pagesize=10";
    private String articleUrlPattern = "https://www.yicai.com/news/\\d+.html";
    private int pageNum = 1;
    private String dateFormat;
    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");


    public YicaiPageProcessor(String dateFormat){
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
            //文章头部信息已在列表页处理好
            //文章内容
            List<Selectable> nodes=html.xpath("//div[@class='m-txt']/*").nodes();
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
                    map.put("phrase",nodes.get(i).get().replaceAll("src=\"(.*?)\"","src=\""+imgDownloaderUtil.imgDownloader(nodes.get(i).xpath("//img/@src").get(),"yicai")+"\""));
                }
                map.put("SOURCE_URL",page.getUrl().get());
                content.add(map);
            }
            /*if(html.xpath("//div[@class='m-txt']/div[@class='statement']").get()!=null){
                Map map = new HashMap();
                map.put("phraseNum",content.size()+1);
                map.put("phrase",html.xpath("//div[@class='m-txt']/div[@class='statement']").get());
                map.put("SOURCE_URL",page.getUrl().get());
                content.add(map);
            }*/
            page.putField("operation","0");
            //文章信息
            page.putField("articleInfo",articleInfo);
            //文章内容
            page.putField("list",content);
        }else if(page.getUrl().toString().matches("https://www.yicai.com/api/ajax/getjuhelist\\?action=news&page=\\d+&pagesize=10")){
            /*文章列表页处理
             * */
            boolean flag = true;
            JSONArray jsonArray = JSONArray.parseArray(page.getRawText());
            List<String> urls = new ArrayList<>();
            List<Map> articleInfo = new ArrayList<>();
            for(int i=0;i<jsonArray.size();i++){
                if((domain+((JSONObject)jsonArray.get(i)).get("url").toString()).matches(articleUrlPattern)){
                    /*判断文章发布日期
                     * */
                    try {
                        String publishDate = ((JSONObject)jsonArray.get(i)).get("pubDate").toString();
                        Date date = simpleDateFormat.parse(publishDate);
                        Date dateAhead = simpleDateFormat.parse(dateFormat);
                        if(dateAhead.before(date)){
                            /*文章信息处理成List<Map>*/
                            String imgUrl = ((JSONObject)jsonArray.get(i)).get("originPic").toString();
                            Map map = new HashMap();
                            if(!imgUrl.equals("")){
                                    /*if(imgDownloader(imgUrl)==0){
                                        map.put("imgUrl",imgUrl.replace("http://www.linkshop.com.cn/upload/",""));
                                    }*/
                                map.put("imgUrl",imgDownloaderUtil.imgDownloader("http:".concat(imgUrl),"yicai"));
                            }
                            map.put("title",((JSONObject)jsonArray.get(i)).get("NewsTitle").toString());
                            map.put("keyword",((JSONObject)jsonArray.get(i)).get("ChannelName").toString());
                            map.put("summary",((JSONObject)jsonArray.get(i)).get("NewsNotes").toString());
                            map.put("author",((JSONObject)jsonArray.get(i)).get("NewsAuthor").toString().equals("")?"第一财经":((JSONObject)jsonArray.get(i)).get("NewsAuthor").toString());
                            map.put("publish_time",((JSONObject)jsonArray.get(i)).get("pubDate").toString());
                            map.put("source_url",(domain+((JSONObject)jsonArray.get(i)).get("url").toString()));
                            map.put("source_website","第一财经");
                            articleInfo.add(map);
                            urls.add((domain+((JSONObject)jsonArray.get(i)).get("url").toString()));
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
                String articleListUrl = "https://www.yicai.com/api/ajax/getjuhelist?action=news&page="+pageNum+"&pagesize=10";
                page.addTargetRequest(articleListUrl);
            }
        }else{
            page.setSkip(true);
        }

    }






}
