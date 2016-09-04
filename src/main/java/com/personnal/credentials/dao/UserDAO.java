/**
 * 
 */
package com.personnal.credentials.dao;

import java.util.List;

import com.personnal.credentials.model.User;

/**
 * @author Jeyamurugan
 *
 */
public interface UserDAO {
	public void save(User user);
	public List<User> listUser();
}
