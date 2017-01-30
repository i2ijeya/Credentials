package com.personnal.credentials.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.personnal.credentials.dao.UserDAO;
import com.personnal.credentials.model.User;

@Service
public class LoginServiceImpl implements LoginService{
	private UserDAO userDao;

	public UserDAO getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDAO userDao) {
		this.userDao = userDao;
	}
	
	@Override
	@Transactional
	public void registerUser(User user) {
		System.out.println("Saving User details to DB");
		this.userDao.registerUser(user);
		System.out.println("Record Inserted");
	}

	@Override
	@Transactional
	public void updateUserDetails(User user) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public User getUserByEmail(int email) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@Transactional
	public void disableUser(int email) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void save(User user) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public List<User> listUser() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@Transactional
	public void insert(User user) {
		// TODO Auto-generated method stub
		
	}

}
