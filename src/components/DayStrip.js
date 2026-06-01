import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, WEEK_DAYS } from '../constants';

export default function DayStrip({ selectedDate, onDayPress }) {
  const scrollRef = useRef(null);
  const selectedIndex = WEEK_DAYS.findIndex((d) => d.date === selectedDate);

  useEffect(() => {
    if (scrollRef.current && selectedIndex >= 0) {
      scrollRef.current.scrollTo({ x: selectedIndex * 64, animated: true });
    }
  }, [selectedIndex]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {WEEK_DAYS.map((day) => {
          const isSelected = day.date === selectedDate;
          return (
            <TouchableOpacity
              key={day.date}
              onPress={() => onDayPress(day.date)}
              activeOpacity={0.7}
              style={[styles.dayButton, isSelected && styles.dayButtonActive]}
            >
              <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
                {day.dayName}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>
                {day.dayNum}
              </Text>
              <Text style={[styles.month, isSelected && styles.monthActive]}>
                {day.month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 6,
  },
  dayButton: {
    width: 56,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
  },
  dayButtonActive: {
    backgroundColor: COLORS.vocal_spectrum,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  dayNameActive: {
    color: '#fff',
  },
  dayNum: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  dayNumActive: {
    color: '#fff',
  },
  month: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  monthActive: {
    color: 'rgba(255,255,255,0.85)',
  },
});
