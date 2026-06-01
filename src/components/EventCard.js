import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, getMemberColor, formatTime } from '../constants';

export default function EventCard({ event }) {
  const color = getMemberColor(event.owner);
  const ownerLabel =
    event.owner === 'vocal_spectrum'
      ? 'Vocal Spectrum'
      : event.owner.charAt(0).toUpperCase() + event.owner.slice(1);

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        <View style={[styles.ownerBadge, { backgroundColor: color + '33', borderColor: color + '66' }]}>
          <Text style={[styles.ownerText, { color }]}>{ownerLabel}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaIcon}>🕐</Text>
        <Text style={styles.metaText}>
          {formatTime(event.start_time)}
          {event.end_time ? ` – ${formatTime(event.end_time)}` : ''}
        </Text>
      </View>

      {event.location ? (
        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>📍</Text>
          <Text style={styles.metaText}>{event.location}</Text>
        </View>
      ) : null}

      {event.notes ? (
        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>📝</Text>
          <Text style={[styles.metaText, styles.notes]}>{event.notes}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  ownerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  ownerText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 3,
  },
  metaIcon: {
    fontSize: 13,
    marginTop: 1,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textMuted,
    flex: 1,
  },
  notes: {
    fontStyle: 'italic',
  },
});
