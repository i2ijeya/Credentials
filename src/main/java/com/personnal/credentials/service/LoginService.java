package com.personnal.credentials.service;

import com.personnal.credentials.dao.UserDAO;
import com.personnal.credentials.model.User;

public class LoginService {
	private UserDAO userDao;

	public UserDAO getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDAO userDao) {
		this.userDao = userDao;
	}
	
	public void addUser(User user) {
		System.out.println("Saving User details to DB");
		getUserDao().insert(user);
		System.out.println("Record Inserted");
	}
		 
/*	public List<User> fetchAllUser() {
		return getPersonDao().selectAll();
	}*/
	
}
