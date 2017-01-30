package com.personnal.credentials.service;

import java.util.List;

import com.personnal.credentials.model.User;

public interface LoginService {
	public void registerUser(User user);
	public void updateUserDetails(User user);
	public User getUserByEmail(int email);
	public void disableUser(int email);
	public void save(User user);
	public List<User> listUser();
	public void insert(User user);
	
}
