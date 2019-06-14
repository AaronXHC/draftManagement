package net.xsysc.draft.controller;

import lombok.extern.slf4j.Slf4j;
import net.xsysc.draft.service.WorkWechatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("/workWeChat")
@Slf4j
public class WorkWechatController {

    @Autowired
    WorkWechatService workWechatService;


    @RequestMapping("/getuserinfo")
    @ResponseBody
    public Map getuserinfo(HttpServletRequest request, Model model) {
        String code = request.getParameter("code");
        return workWechatService.getuserinfo(code);
    }

}
