package net.xsysc.draft.controller;

import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import net.xsysc.draft.service.marketingCMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/cms")
@Slf4j
public class marketingCMSController {

    @Autowired
    marketingCMSService marketingCMSService;



    @GetMapping("/CmsList")
    public String marketingCmsList(HttpServletRequest request, Model model) {
        return "marketingCMS/cmsList";
    }


    @GetMapping("/CmsContent")
    public String marketingCmsContent(HttpServletRequest request, Model model) {
        return "marketingCMS/CmsContent";
    }

    @RequestMapping("/articleList")
    @ResponseBody
    public PageInfo articleList(HttpServletRequest request, Model model) {

        Map params=new HashMap();
        int pageNum = Integer.parseInt(request.getParameter("pageNum"));
        String CJSJS = request.getParameter("CJSJS");
        String CJSJE = request.getParameter("CJSJE");
        String KEYWORD = request.getParameter("KEYWORD");
        params.put("pageNum",pageNum);
        params.put("CJSJS",CJSJS);
        params.put("CJSJE",CJSJE);
        params.put("KEYWORD",KEYWORD);
        return marketingCMSService.selectArticleInfo(params);
    }

    @RequestMapping("/articleContent")
    @ResponseBody
    public Map articleContent(HttpServletRequest request, Model model) {
        Map params=new HashMap();
        String id = request.getParameter("id");
        params.put("ID", id);
        return marketingCMSService.selectArticleContent(params);
    }







}
