import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EventCard from '../components/EventCard';
import { COLORS, WEEK_DAYS } from '../constants';
import { fetchEvents, subscribeToEvents } from '../lib/supabase';

const LOGO = require('../../assets/Vocal Spectrum - Album by Vocal Spectrum Spotify 2025-09-02 at 9.16.38 AM.jpg');

export default function MasterScheduleScreen({ onHome }) {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchEvents();
      setEvents(data.filter((e) => e.owner === 'vocal_spectrum'));
    } catch (e) {
      console.warn(e.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeToEvents(load);
    return unsub;
  }, [load]);

  const eventsByDay = WEEK_DAYS.map((day) => ({
    ...day,
    events: events.filter((e) => e.date === day.date),
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onHome} style={styles.homeButton} activeOpacity={0.7}>
          <Text style={styles.homeIcon}>⌂</Text>
          <Text style={styles.homeLabel}>Home</Text>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Image source={LOGO} style={styles.logo} resizeMode="cover" />
          <Text style={styles.title}>Master Schedule</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.vocal_spectrum} />
        }
      >
        <Text style={styles.weekLabel}>June 29 – July 5, 2025 · BHS Convention</Text>

        {eventsByDay.map((day) => (
          <View key={day.date} style={styles.daySection}>
            <View style={styles.dayHeader}>
              <View style={styles.dayPill}>
                <Text style={styles.dayName}>{day.dayName}</Text>
                <Text style={styles.dayNum}>{day.dayNum} {day.month}</Text>
              </View>
            </View>

            {day.events.length === 0 ? (
              <View style={styles.emptyDay}>
                <Text style={styles.emptyText}>No group events</Text>
              </View>
            ) : (
              day.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 70,
  },
  homeIcon: {
    fontSize: 16,
    color: COLORS.text,
  },
  homeLabel: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.vocal_spectrum,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  placeholder: {
    minWidth: 70,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingVertical: 16, paddingBottom: 40 },
  weekLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  daySection: {
    marginBottom: 8,
  },
  dayHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  dayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.vocal_spectrum,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  dayNum: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  emptyDay: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.border,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
});
