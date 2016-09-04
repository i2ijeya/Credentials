package com;

import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class StringRepeat {

	

	public static void main(String args[]) {
		String input = "bbbaaaassssasssdddaaassb";
		Map<Character,Integer> result = new HashMap<Character,Integer>();
		for(char inputChar : input.toCharArray()) {
			if(result.containsKey(inputChar)) {
				result.put(inputChar, result.get(inputChar) + 1);
			}
			else {
				result.put(inputChar,1);
			}
		}
		System.out.println(result);
		
		Comparator<Character> comparator = new ValueComparator(result);
		TreeMap<Character, Integer> sortedMap = new TreeMap<Character, Integer>(comparator);
		sortedMap.putAll(result);
		System.out.println(sortedMap);
		
	}

	private static void compareTo() {
		// TODO Auto-generated method stub
		
	}
}
