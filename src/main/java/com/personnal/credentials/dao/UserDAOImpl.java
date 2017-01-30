package com.personnal.credentials.dao;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.personnal.credentials.model.User;

@Repository
public class UserDAOImpl implements UserDAO{
	private static final Logger logger = LoggerFactory.getLogger(UserDAOImpl.class);

	private SessionFactory sessionFactory;
	
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	public Session getCurrentSession() {
		return this.sessionFactory.getCurrentSession();
	}

	@Override
	public void save(User user) {
		// TODO Auto-generated method stub
		Session session = getCurrentSession();
		Transaction tx = session.beginTransaction();
		session.persist(user);
		tx.commit();
		session.close();
	}

	@Override
	public void insert(User user) {
		// TODO Auto-generated method stub
		Session session = getCurrentSession();
		session.beginTransaction();
		
		session.save(user);
		session.getTransaction().commit();
		session.close();
		//Query query = session.createQuery("INSERT INTO ");
	}

	@Override
	public void registerUser(User user) {
		Session session = getCurrentSession();
		session.beginTransaction();
		
		session.save(user);
		session.getTransaction().commit();
		session.close();
	}

	@Override
	public void updateUserDetails(User user) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public User getUserByEmail(int email) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void disableUser(int email) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<User> listUser() {
		// TODO Auto-generated method stub
		return null;
	}


}