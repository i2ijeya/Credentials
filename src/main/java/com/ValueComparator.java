package com;

import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

public class ValueComparator<K, V extends Comparable<V>> implements Comparator<Character> {
	
	Map<K, V> resultMap = new HashMap<K, V>();
	public ValueComparator(Map<K, V> resultMap) {
		this.resultMap.putAll(resultMap);
	}
	
	@Override
	public int compare(Character int1, Character int2) {
		return -resultMap.get(int1).compareTo(resultMap.get(int2));
	}
}