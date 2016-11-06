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
	
	@RequestMapping(value = "/registerUser", method=RequestMethod.GET)
	public String registerPage(HttpServletRequest req, HttpServletResponse resp, ModelMap model) {
		System.out.println("Entering the register controller 1");
		Map<String,String[]> parameters = req.getParameterMap();
		System.out.println(req.getParameter("email"));
		model.addAttribute("success","Logged in Succesfully");
		return "user/registration";
	}
	
	@RequestMapping(value = "/register", method=RequestMethod.GET)
	public String register(HttpServletRequest req, HttpServletResponse resp, ModelMap model) {
		System.out.println("Entering the register controller");
		Map<String,String[]> parameters = req.getParameterMap();
		System.out.println(parameters);
		model.addAttribute("success","Logged in Succesfully");
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
	
	public static void main(String args[]) {
		int n =2;
		int fibonacciResult[] = new int[n];
		
		if(n<2) {
			System.out.println("The number should be greater than 2");
			System.exit(0);
		}
		fibonacciResult[0]=0;
		fibonacciResult[1]=1;
		for(int i=2 ;i<n;i++) {
			fibonacciResult[i] = fibonacciResult[i-1] + fibonacciResult[i-2];
		}
		for(int i=0;i<n;i++) {
			System.out.print(fibonacciResult[i]+",");
		}
		
		
	}
}