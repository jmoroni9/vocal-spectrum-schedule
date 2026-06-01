import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, MEMBERS } from '../constants';

const HEADSHOTS = {
  jonny: require('../../assets/Jonny.jpg'),
  tim: require('../../assets/Tim.jpg'),
  chris: require('../../assets/Chris.jpg'),
  eric: require('../../assets/Eric.jpg'),
};

export default function Header({ selectedMember, onHome }) {
  const insets = useSafeAreaInsets();
  const memberColor = MEMBERS.find((m) => m.id === selectedMember)?.color ?? COLORS.textMuted;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity onPress={onHome} style={styles.homeButton} activeOpacity={0.7}>
        <Text style={styles.homeIcon}>⌂</Text>
        <Text style={styles.homeLabel}>Home</Text>
      </TouchableOpacity>

      <View style={styles.titleRow}>
        <Text style={styles.musicNote}>♪</Text>
        <Text style={styles.title}>Vocal Spectrum</Text>
      </View>

      <View style={[styles.memberBadge, { borderColor: memberColor }]}>
        <Image
          source={HEADSHOTS[selectedMember]}
          style={[styles.headshot, { borderColor: memberColor }]}
          resizeMode="cover"
        />
        <Text style={[styles.memberName, { color: memberColor }]}>
          {selectedMember.charAt(0).toUpperCase() + selectedMember.slice(1)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
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
    gap: 6,
  },
  musicNote: {
    fontSize: 20,
    color: COLORS.vocal_spectrum,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  headshot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  memberName: {
    fontSize: 13,
    fontWeight: '600',
  },
});
