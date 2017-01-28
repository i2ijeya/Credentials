package com.personnal.credentials.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.personnal.credentials.model.User;
import com.personnal.credentials.service.LoginService;

@Controller
public class LoginController implements ApplicationContextAware{
	private ApplicationContext applicationContext;  
	public LoginController() {
		System.out.println("Login Controller Cons");
	}
	
	@RequestMapping(value = "/registerUser", method=RequestMethod.GET)
	public String registerPage1(HttpServletRequest req, HttpServletResponse resp, ModelMap model) {
		System.out.println("Entering the register controller 1");
		Map<String,String[]> parameters = req.getParameterMap();
		System.out.println(req.getParameter("email"));
		model.addAttribute("success","Logged in Succesfully");
		return "hello";
	}
	
	@RequestMapping(value = "/register", method=RequestMethod.GET)
	public String register(HttpServletRequest req, HttpServletResponse resp, ModelMap model) {
		System.out.println("Application Context is set !!! "+ applicationContext);
		LoginService loginService = (LoginService) applicationContext.getBean("loginService");
		System.out.println("Entering the register controller");
		System.out.println(req.getParameter("email") + " - "+ req.getParameter("password"));
		User user = new User();
		user.setEmail(req.getParameter("email"));
		user.setPassword(req.getParameter("password"));
		loginService.addUser(user);
		return "hello";
	}
	
	@RequestMapping(value = "/registerPage", method=RequestMethod.GET)
	public String registerPage(HttpServletRequest req, HttpServletResponse resp, ModelMap model) {
		System.out.println("Entering the register controller");

		return "user/registration";
	}
	
	@RequestMapping(value = "/login", method=RequestMethod.POST)
	public String loginVerify(HttpServletRequest req, HttpServletResponse resp, ModelMap model) {
		System.out.println("Entering the login controller");
		Map<String,String[]> parameters = req.getParameterMap();
		System.out.println(req.getParameter("email"));
		model.addAttribute("mail_id",req.getParameter("email"));
		return "hello";
	}
	
	@RequestMapping("/validate")
	@ResponseBody
	public String validateRange(@RequestParam("id") String id) {

	    boolean check = false; //[validate the id];
	    if(!check){
	        return "The id selected is out of Range, please select another id within range";
	    }
		return id;
	}

	public boolean isValidUser() {
		boolean validUser = false;
		
		return validUser;
	}
	
	@Override
	@Autowired
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		// TODO Auto-generated method stub
		this.applicationContext =  applicationContext;
		System.out.println("Application Context is set !!! "+ applicationContext);
	}
}