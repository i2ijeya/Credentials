/**
 * 
 */
package com.personnal.credentials.util;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * @author Jeyamurugan
 *
 */
public class EncryptPassword {
	
	private String salt = "LongStringForExtraSecurity@#$!%^&*(*)1234567890";

	public String encryptedPassword(String actualPassword) {
		
        MessageDigest messageDigest=null;
        try {
            messageDigest = MessageDigest.getInstance("SHA");
            messageDigest.update((actualPassword + salt).getBytes());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        String encryptedPassword = (new BigInteger(messageDigest.digest())).toString(16);
        return encryptedPassword;
	}
}