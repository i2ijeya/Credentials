package com.personnal.credentials.controller;

import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class LoginController {

	public LoginController() {
		System.out.println("Login Controller Cons");
	}
	
	@RequestMapping(value = "/register", method=RequestMethod.GET)
	public String registerPage(HttpServletRequest req, HttpServletResponse resp, ModelMap model) {
		System.out.println("Entering the controller Login");
		Map<String,String[]> parameters = req.getParameterMap();
		model.addAttribute("success","Logged in Succesfully");
		return "user/registration";
	}
	
	@RequestMapping(value = "/login", method=RequestMethod.POST)
	public String loginVerify(HttpServletRequest req, HttpServletResponse resp, ModelMap model) {
		System.out.println("Entering the controller Login");
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
}