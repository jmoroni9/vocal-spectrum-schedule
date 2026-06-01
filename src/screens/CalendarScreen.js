import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DayStrip from '../components/DayStrip';
import EventCard from '../components/EventCard';
import { COLORS, WEEK_DAYS } from '../constants';
import { fetchEvents, subscribeToEvents } from '../lib/supabase';

export default function CalendarScreen({ tabId }) {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(WEEK_DAYS[0].date);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchEvents();
      setAllEvents(data);
    } catch (e) {
      console.warn('Failed to load events:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsubscribe = subscribeToEvents(load);
    return unsubscribe;
  }, [load]);

  const visibleEvents = allEvents.filter((e) => {
    if (e.date !== selectedDate) return false;
    if (tabId === 'vocal_spectrum') return e.owner === 'vocal_spectrum';
    return e.owner === tabId || e.owner === 'vocal_spectrum';
  });

  const selectedDay = WEEK_DAYS.find((d) => d.date === selectedDate);
  const dayLabel = selectedDay
    ? `${selectedDay.dayName}, ${selectedDay.month} ${selectedDay.dayNum}`
    : '';

  return (
    <View style={styles.container}>
      <DayStrip selectedDate={selectedDate} onDayPress={setSelectedDate} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.vocal_spectrum} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor={COLORS.vocal_spectrum}
            />
          }
        >
          <Text style={styles.dayHeading}>{dayLabel}</Text>

          {visibleEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>No events scheduled</Text>
              <Text style={styles.emptyHint}>Use the prompt bar below to add one</Text>
            </View>
          ) : (
            visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  dayHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  emptyHint: {
    fontSize: 13,
    color: COLORS.border,
  },
});
