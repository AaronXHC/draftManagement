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

public class linkshopPageProcessor implements PageProcessor {

    private Site site = Site.me().setCycleRetryTimes(3).setSleepTime(1000).setTimeOut(10000)
            .addCookie("__utma","215185162.769525556.1556263337.1556263337.1556263337.1")
            .addCookie("__utmb","215185162.2.10.1556263337")
            .addCookie("__utmc","215185162")
            .addCookie("__utmt","1")
            .addCookie("__utmz","215185162.1556263337.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)")
            .addCookie("ASP.NET_SessionId","vl1r1r55uzilwf452zhvaryj")
            .addCookie("Hm_lpvt_bff185b4edab383ae926cb82db3d7718","1556267868")
            .addCookie("Hm_lvt_0fedaa1ba8d633a70069feadca9e8656","1553130574")
            .addCookie("Hm_lvt_bff185b4edab383ae926cb82db3d7718","1555576213,1556066331,1556180928,1556249158")
            .addCookie("Hm_lvt_c2a746d8cfa8dbf6c295593536e0c9b7","1553130440")
            .addCookie("acw_sc__v2","5cc2c359616c4246c4a850829045897958fb6029")
            .addCookie("acw_sc__v3","5cc2c35b47f9b153f3c3e75341ef5360d7b99cca")
            .addCookie("acw_tc","781bad2515543426189466915e746fa37058cd259d12eefffd5bb7dd5c1762")
            .addCookie("index_cookie","1")
            .addCookie("isfirstvisited","false")
            .addCookie("neiye_cookie","1")
            .addCookie("keys","");
    private String domain = "http://www.linkshop.com.cn";
    //private String initWebsite = "http://www.linkshop.com.cn/web/archives/2019/423697.shtml";
    private String initWebsite = "http://www.linkshop.com.cn/Web/News_Index.aspx?isAjax=1&action=zixun_zx&tab=zx&pageNo=1";
    private String articleUrlPattern = "http://www.linkshop.com.cn/web/archives/2019/\\d+.shtml";
    private int pageNum = 1;
    private String dateFormat;


    public linkshopPageProcessor(String dateFormat){
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
