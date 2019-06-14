package net.xsysc.draft.util;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;
import us.codecraft.webmagic.selector.Html;
import us.codecraft.webmagic.selector.Selectable;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class KuaixiaopinPageProcessor implements PageProcessor {

    private Site site = Site.me().setCycleRetryTimes(3).setSleepTime(1000).setTimeOut(10000);
    private String domain = "http://www.kuaixiaopin.net";
    //private String initWebsite = "http://www.kuaixiaopin.net/htm/mimian/";
    private String initWebsite = "http://www.kuaixiaopin.net/";
    private String articleUrlPattern = "http://www.kuaixiaopin.net/htm/[a-z]+/[0-9][0-9][0-9][0-9]/[0-9][0-9][0-9][0-9]/\\d+.html";
    private Date deadline;
    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");


    public KuaixiaopinPageProcessor(String dateFormat){

        try {
            this.deadline = simpleDateFormat.parse(dateFormat);
        } catch (ParseException e) {
            this.deadline = new Date();
        }
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
            String author = html.xpath("//div[@class='list3']/text()").get();
            articleInfo.put("author",author.replace("来源：","").replaceAll("更新时间.*","").replace((char)160,' ').replace(" ",""));
            articleInfo.put("SOURCE_URL",page.getUrl().get());
            //文章内容
            Elements list2a = html.getDocument().getElementsByTag("div").select(".list2a");
            Elements images = list2a.select("img");
            Iterator<Element> imagesIterator = images.iterator();
            //document处理，替换img标签中src属性
            while(imagesIterator.hasNext()){
                Element e = imagesIterator.next();
                String imgUrl = e.attr("src");
                e.attr("src",imgDownloaderUtil.imgDownloader(domain+imgUrl,"kuaixiaopin"));
            }
            Iterator<Element> iterator = list2a.get(0).children().get(2).children().iterator();
            int index = 1;
            List<Map> content = new ArrayList<>();
            while(iterator.hasNext()){
                Map map = new HashMap();
                Element element = iterator.next();
                //element.toString();
                map.put("phraseNum",index);
                map.put("phrase",element.outerHtml());
                map.put("SOURCE_URL",page.getUrl().get());
                content.add(map);
                index++;
            }
            //----------------------------------------------------------分割-----------------------------------
            page.putField("operation","0");
            //文章信息
            page.putField("articleInfo",articleInfo);
            //文章内容
            page.putField("list",content);
        }else if(page.getUrl().toString().matches("http://www.kuaixiaopin.net/htm/[a-z]+/.*")){
            /*文章列表页处理
             * */
            try {
                boolean flag = true;
                Html html = page.getHtml();
                List<Selectable> list = html.xpath("//div[@class='list1gg']//li/text()").nodes();
                List<Selectable> pageList = html.xpath("//div[@class='list1gg']//li").nodes();
                List<String> urls = new ArrayList<>();
                List<Map> articleInfo = new ArrayList<>();
                for(int i=0;i<list.size();i++) {
                    String publishTime = list.get(i).get().trim();
                    if (deadline.before(sdf.parse(publishTime))) {
                        //文章信息抽取
                        Map map = new HashMap();
                        String imgUrl = pageList.get(i).xpath("//img/@src").get();
                        if(!imgUrl.equals("")){
                                    /*if(imgDownloader(imgUrl)==0){
                                        map.put("imgUrl",imgUrl.replace("http://www.linkshop.com.cn/upload/",""));
                                    }*/
                            map.put("imgUrl",imgDownloaderUtil.imgDownloader(domain+imgUrl,"kuaixiaopin"));
                        }
                        map.put("publish_time",simpleDateFormat.format(sdf.parse(publishTime)));
                        map.put("title",pageList.get(i).xpath("h3/a/text()").get());
                        map.put("summary",pageList.get(i).xpath("//p/text()").get());
                        map.put("source_url",pageList.get(i).xpath("h3/a").links().get());
                        map.put("source_website","中国快消品网");
                        articleInfo.add(map);
                        urls.add(pageList.get(i).xpath("h3/a").links().get());
                    }
                    else{
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
                    //下一页
                    List<Selectable> pages = html.xpath("//div[@class='list1ga']/li").nodes();
                    String nextPage = pages.get(pages.size()-4).links().get();
                    page.addTargetRequest(nextPage);
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }else if(page.getUrl().toString().matches(initWebsite)){
            /*文章首页处理
             * */
            List<String> links = page.getHtml().xpath("//div[@class='dpb']|//div[@class='dpb1']").links().all();
            links.remove(19);
            page.addTargetRequests(links);
            page.setSkip(true);
        }else{
            page.setSkip(true);
        }

    }
}
