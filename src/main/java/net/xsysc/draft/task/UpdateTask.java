
package net.xsysc.draft.task;

import lombok.extern.slf4j.Slf4j;
import net.xsysc.draft.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import us.codecraft.webmagic.Spider;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;


@Service
@Slf4j
public class UpdateTask {
    @Autowired
    net.xsysc.draft.util.oraclePipeLineUtil oraclePipeLineUtil;


    //@Scheduled(cron = "10 09 * * * ?")
    public void testEeoCrawler() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:00");
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR_OF_DAY, -16);
        date=calendar.getTime();
        String dateString = simpleDateFormat.format(date);
        System.out.println(dateString);
        System.out.println("Mission started -------------------------------------------------------------");
        eeoPageProcessor eeoPageProcessor = new eeoPageProcessor(dateString);
        Spider.create(eeoPageProcessor).addUrl(eeoPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(3).run();
    }


    //@Scheduled(cron = "10 51 * * * ?")
    public void testLinkCrawler() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:00");
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR_OF_DAY, -4);
        date=calendar.getTime();
        String dateString = simpleDateFormat.format(date);
        System.out.println(dateString);
        System.out.println("Mission started -------------------------------------------------------------");
        linkshopPageProcessor linkshopPageProcessor = new linkshopPageProcessor(dateString);
        Spider.create(linkshopPageProcessor).addUrl(linkshopPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(2).run();
    }

    //@Scheduled(cron = "10 48 * * * ?")
    public void testYiCaiCrawler() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:00");
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR_OF_DAY, -4);
        date=calendar.getTime();
        String dateString = simpleDateFormat.format(date);
        System.out.println(dateString);
        System.out.println("Mission started -------------------------------------------------------------");
        YicaiPageProcessor yicaiPageProcessor = new YicaiPageProcessor(dateString);
        Spider.create(yicaiPageProcessor).addUrl(yicaiPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(2).run();
    }

    //@Scheduled(cron = "10 28 * * * ?")
    public void test36KrCrawler() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:00");
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR_OF_DAY, -33);
        date=calendar.getTime();
        String dateString = simpleDateFormat.format(date);
        System.out.println(dateString);
        System.out.println("Mission started -------------------------------------------------------------");
        ThirtySixKrPageProcessor thirtySixKrPageProcessor = new ThirtySixKrPageProcessor(dateString);
        Spider.create(thirtySixKrPageProcessor).addUrl(thirtySixKrPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(2).run();
    }


    //@Scheduled(cron = "10 39 * * * ?")
    public void testHuxiuCrawler() {
        System.out.println("Mission started -------------------------------------------------------------");
        HuxiuPageProcessor huxiuPageProcessor = new HuxiuPageProcessor();
        Spider.create(huxiuPageProcessor).addUrl(huxiuPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(2).run();
    }


    //@Scheduled(cron = "0 0 0/4 * * ?")
    //@Scheduled(cron = "10 55 * * * ?")
    public void Crawler() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:00");
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR_OF_DAY, -24);
        date=calendar.getTime();
        String dateString = simpleDateFormat.format(date);
        System.out.println(dateString);
        System.out.println("Mission started -------------------------------------------------------------");
        linkshopPageProcessor linkshopPageProcessor = new linkshopPageProcessor(dateString);
        Spider.create(linkshopPageProcessor).addUrl(linkshopPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(3).run();
        eeoPageProcessor eeoPageProcessor = new eeoPageProcessor(dateString);
        Spider.create(eeoPageProcessor).addUrl(eeoPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(3).run();
        KuaixiaopinPageProcessor kuaixiaopinPageProcessor = new KuaixiaopinPageProcessor(dateString);
        Spider.create(kuaixiaopinPageProcessor).addUrl(kuaixiaopinPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(3).run();
        YicaiPageProcessor yicaiPageProcessor = new YicaiPageProcessor(dateString);
        Spider.create(yicaiPageProcessor).addUrl(yicaiPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(3).run();
        ThirtySixKrPageProcessor thirtySixKrPageProcessor = new ThirtySixKrPageProcessor(dateString);
        Spider.create(thirtySixKrPageProcessor).addUrl(thirtySixKrPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(3).run();
        HuxiuPageProcessor huxiuPageProcessor = new HuxiuPageProcessor();
        Spider.create(huxiuPageProcessor).addUrl(huxiuPageProcessor.getInitWebsite()).addPipeline(oraclePipeLineUtil).thread(3).run();
    }

}