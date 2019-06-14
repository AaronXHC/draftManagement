package net.xsysc.draft.controller;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import net.xsysc.draft.service.WorkWechatService;
import net.xsysc.draft.service.draftService;
import net.xsysc.draft.util.imgDownloaderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/draft")
@Slf4j
public class draftController {

    @Autowired
    draftService draftService;
    @Autowired
    WorkWechatService workWechatService;


    @GetMapping("/addArticle")
    public String addArticle(HttpServletRequest request, Model model) {
        return "draftManagement/addArticle";
    }

    @GetMapping("/Content")
    public String draftContent(HttpServletRequest request, Model model) {
        return "draftManagement/draftContent";
    }

    @GetMapping("/History")
    public String HistoryContent(HttpServletRequest request, Model model) {
        return "draftManagement/historyContent";
    }


    @GetMapping("/DraftList")
    public String marketingCmsList(HttpServletRequest request, Model model) {
        return "draftManagement/draftList";
    }


    @ResponseBody
    @RequestMapping(value="/imgUpload",method = RequestMethod.POST)
    public JSONObject imgUpload(@RequestParam("upload") MultipartFile file) {
        return imgDownloaderUtil.imgUpload(file);
    }

    @ResponseBody
    @RequestMapping(value="/insertDRAFT_INFO",method = RequestMethod.POST)
    public int insertDRAFT_INFO(HttpServletRequest request) {
        return draftService.insertDRAFT_INFO_CONTENT(request.getParameterMap());
    }


    @RequestMapping("/draftList")
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
        return draftService.selectDraftInfo(params);
    }

    @RequestMapping("/draftContent")
    @ResponseBody
    public Map articleContent(HttpServletRequest request, Model model) {
        Map params=new HashMap();
        String id = request.getParameter("id");
        params.put("ID", id);
        return draftService.selectDraftContent(params);
    }

    @RequestMapping("/historyContent")
    @ResponseBody
    public Map historyContent(HttpServletRequest request, Model model) {
        Map params=new HashMap();
        String id = request.getParameter("ID");
        String modified_stamp = request.getParameter("MODIFIED_STAMP");
        params.put("ID", id);
        params.put("MODIFICATION_FLAG", 1);
        params.put("MODIFIED_STAMP", modified_stamp);
        return draftService.selectHistoryContent(params);
    }

    @RequestMapping("/insertUsageRecord")
    @ResponseBody
    public List<Map> insertUsageRecord(HttpServletRequest request, Model model) {
        Map map = new HashMap();
        map.put("ID",request.getParameter("ID"));
        map.put("USE_TIME",request.getParameter("USE_TIME"));
        map.put("CONTENT_USE",request.getParameter("CONTENT_USE"));
        map.put("USERID",request.getParameter("USERID"));
        map.put("exists",request.getParameter("exists"));
        return draftService.insertUsageRecord(map);
    }


    @RequestMapping("/reEditDraft")
    @ResponseBody
    public int reEditDraft(HttpServletRequest request, Model model) {
        Map map = new HashMap();
        map.put("ID",request.getParameter("ID"));
        map.put("TITLE",request.getParameter("TITLE"));
        map.put("SUMMARY",request.getParameter("SUMMARY"));
        map.put("CONTENT",request.getParameter("CONTENT"));
        map.put("KEYWORD",request.getParameter("KEYWORD"));
        map.put("USERID",request.getParameter("USERID"));
        return draftService.reEditDraft(map);
    }








}
