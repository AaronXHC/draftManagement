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

public class ThirtySixKrPageProcessor implements PageProcessor {

    private Site site = Site.me().setCycleRetryTimes(3).setSleepTime(1000).setTimeOut(10000);
    //private String initWebsite = "http://www.linkshop.com.cn/web/archives/2019/422950.shtml";
    private String initWebsite = "https://36kr.com/pp/api/aggregation-entity?type=web_latest_article&per_page=10";
    private String articleUrlPattern = "https://36kr.com/p/\\d+";
    private String pageId = "";
    private String dateFormat;
    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");


    public ThirtySixKrPageProcessor(String dateFormat){
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
            //文章内容
            List<Selectable> nodes=html.xpath("//div[@class='common-width content articleDetailContent kr-rich-text-wrapper']/*").nodes();
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
                }
                map.put("SOURCE_URL",page.getUrl().get());
                content.add(map);
            }
            page.putField("operation","0");
            //文章信息
            page.putField("articleInfo",articleInfo);
            //文章内容
            page.putField("list",content);
        }else if(page.getUrl().toString().matches("https://36kr.com/pp/api/aggregation-entity\\?type=web_latest_article&per_page=10")||page.getUrl().toString().matches("https://36kr.com/pp/api/aggregation-entity\\?type=web_latest_article&per_page=10&b_id=\\d+")){
            /*文章列表页处理
             * */
            boolean flag = true;
            JSONObject jsonObject = JSONObject.parseObject(page.getRawText());
            JSONArray jsonArray = jsonObject.getJSONObject("data").getJSONArray("items");
            List<String> urls = new ArrayList<>();
            List<Map> articleInfo = new ArrayList<>();
            String  baseUrl = "https://36kr.com/p/";
            for(int i=0;i<jsonArray.size();i++){
                JSONObject post = ((JSONObject)jsonArray.get(i)).getJSONObject("post");
                if((baseUrl+post.get("id").toString()).matches(articleUrlPattern)){
                    /*判断文章发布日期
                     * */
                    try {
                        String publishDate = post.get("published_at").toString();
                        Date date = sdf.parse(publishDate);
                        Date dateAhead = simpleDateFormat.parse(dateFormat);
                        if(dateAhead.before(date)){
                            /*文章信息处理成List<Map>*/
                            String imgUrl = post.get("cover").toString();
                            Map map = new HashMap();
                            if(!imgUrl.equals("")){
                                map.put("imgUrl",imgDownloaderUtil.imgDownloader(imgUrl,"thirtySix"));
                            }
                            map.put("title",post.get("title").toString());
                            map.put("summary",post.get("summary").toString());
                            map.put("source_url",baseUrl+post.get("id").toString());
                            map.put("publish_time",simpleDateFormat.format(date));
                            map.put("source_website","36氪");
                            map.put("author",post.getJSONObject("user").getString("name"));
                            articleInfo.add(map);
                            urls.add(baseUrl+post.get("id").toString());
                        }else{
                            flag = false;
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }
                pageId = ((JSONObject)jsonArray.get(i)).getString("id");
            }
            if(articleInfo.size()>0){
                page.putField("operation","1");
                page.putField("articleInfo",articleInfo);
                page.addTargetRequests(urls);
            }else{
                page.setSkip(true);
            }
            if(flag){
                page.addTargetRequest(initWebsite+"&b_id="+pageId);
            }
        }else{
            page.setSkip(true);
        }


    }






}

