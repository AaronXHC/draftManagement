package net.xsysc.draft.util;

import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;
import us.codecraft.webmagic.selector.Html;
import us.codecraft.webmagic.selector.Selectable;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class HuxiuPageProcessor implements PageProcessor {

    private Site site = Site.me().setCycleRetryTimes(3).setSleepTime(1000).setTimeOut(10000);
    private String initWebsite = "https://www.huxiu.com/";
    //private String initWebsite = "https://www.huxiu.com/article/299024.html";
    private String articleUrlPattern = "https://www.huxiu.com/article/\\d+.html";

    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

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
            List<Selectable> nodes=html.xpath("//div[@class='article-content-wrap']/*").nodes();
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
                    map.put("phrase",nodes.get(i).get().replaceAll("src=\"(.*?)\"","src=\""+imgDownloaderUtil.imgDownloader(nodes.get(i).xpath("//img/@src").get().split("\\?")[0],"huxiu")+"\""));
                }
                map.put("SOURCE_URL",page.getUrl().get());
                content.add(map);
            }
            //----------------------------------------------------------分割-----------------------------------
            page.putField("operation","0");
            //文章信息
            page.putField("articleInfo",articleInfo);
            //文章内容
            page.putField("list",content);
        }else if(page.getUrl().toString().matches("https://www.huxiu.com/channel/\\d+.html")){
            /*文章列表页处理
             * */
            Date date = new Date();
            Calendar calendar = Calendar.getInstance();
            List<Selectable> nodes = page.getHtml().xpath("//div[@class='mod-info-flow']/div").nodes();
            List<String> urls = new ArrayList<>();
            List<Map> articleInfo = new ArrayList<>();
            for (Selectable node:nodes) {
                Map map = new HashMap();
                calendar.setTime(date);
                String time = node.xpath("//span[@class='time']/text()").get();
                Pattern p = Pattern.compile("[^0-9]");
                Matcher m = p.matcher(time);
                if(time.contains("分钟")){
                    String imgUrl = node.xpath("//div[@class='mod-thumb pull-left']/a/img/@data-original").get().split("\\?")[0];
                    if(!imgUrl.equals("")){
                        map.put("imgUrl",imgDownloaderUtil.imgDownloader(imgUrl,"huxiu"));
                    }
                    String minutes = m.replaceAll("");
                    calendar.add(Calendar.MINUTE,(-Integer.parseInt(minutes)));
                    map.put("publish_time",simpleDateFormat.format(calendar.getTime()));
                    map.put("title",node.xpath("//h2//a/text()").get());
                    map.put("summary",node.xpath("//div[@class='mob-sub']/text()").get());
                    map.put("author",node.xpath("//span[@class='author-name']/text()").get());
                    map.put("source_url",node.xpath("//h2//a").links().get());
                    map.put("source_website","虎嗅网");
                    articleInfo.add(map);
                    //**文章链接
                    urls.add(node.xpath("//h2//a").links().get());
                }else if(time.contains("小时")){
                    String hours = m.replaceAll("");
                    if(Integer.parseInt(hours)<4){
                        String imgUrl = node.xpath("//div[@class='mod-thumb pull-left']/a/img/@data-original").get().split("\\?")[0];
                        if(!imgUrl.equals("")){
                            map.put("imgUrl",imgDownloaderUtil.imgDownloader(imgUrl,"huxiu"));
                        }
                        calendar.add(Calendar.HOUR_OF_DAY,(-Integer.parseInt(hours)));
                        map.put("publish_time",simpleDateFormat.format(calendar.getTime()));
                        map.put("title",node.xpath("//h2//a/text()").get());
                        map.put("summary",node.xpath("//div[@class='mob-sub']/text()").get());
                        map.put("author",node.xpath("//span[@class='author-name']/text()").get());
                        map.put("source_url",node.xpath("//h2//a").links().get());
                        map.put("source_website","虎嗅网");
                        articleInfo.add(map);
                        //**文章链接
                        urls.add(node.xpath("//h2//a").links().get());
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
        }else if(page.getUrl().toString().matches(initWebsite)){
            /*文章首页处理
             * */
            List<String> links = page.getHtml().xpath("//ul[@class='header-column header-column1 header-column-zx menu-box']/li/a[@class='transition']").links().all();
            page.addTargetRequests(links);
            page.setSkip(true);
        }else{
            page.setSkip(true);
        }

    }
}
