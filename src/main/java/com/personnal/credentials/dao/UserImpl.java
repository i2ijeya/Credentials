package com.personnal.credentials.dao;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import com.personnal.credentials.model.User;

public class UserImpl implements UserDAO{
	
	private SessionFactory sessionFactory;
	
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public void save(User user) {
		// TODO Auto-generated method stub
		Session session = this.sessionFactory.openSession();
		Transaction tx = session.beginTransaction();
		session.persist(user);
		tx.commit();
		session.close();
	}

	@Override
	public List<User> listUser() {
		// TODO Auto-generated method stub
		
		return null;
	}

	@Override
	public void insert(User user) {
		// TODO Auto-generated method stub
		Session session = this.sessionFactory.openSession();
		session.beginTransaction();
		
		session.save(user);
		session.getTransaction().commit();
		session.close();
		//Query query = session.createQuery("INSERT INTO ");
	}
}