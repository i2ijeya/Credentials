package com.personnal.credentials.service;

import java.util.List;

import com.personnal.credentials.model.User;

public interface LoginServiceImpl {
	public void addPerson(User p);
	public void updatePerson(User p);
	public List<User> listPersons();
	public User getUserByEmail(int id);
	public void removeUser(int id);	
}
