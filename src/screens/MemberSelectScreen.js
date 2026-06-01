import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, MEMBERS } from '../constants';

const HEADSHOTS = {
  jonny: require('../../assets/Jonny.jpg'),
  tim: require('../../assets/Tim.jpg'),
  chris: require('../../assets/Chris.jpg'),
  eric: require('../../assets/Eric.jpg'),
};

const LOGO = require('../../assets/Vocal Spectrum - Album by Vocal Spectrum Spotify 2025-09-02 at 9.16.38 AM.jpg');

export default function MemberSelectScreen({ onSelect, onMasterSchedule }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={onMasterSchedule} activeOpacity={0.85} style={styles.logoContainer}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>

      <Text style={styles.appName}>Vocal Spectrum</Text>
      <Text style={styles.subtitle}>2025 Convention Schedule · Tap logo for Master Schedule</Text>

      <Text style={styles.prompt}>Who are you?</Text>

      <View style={styles.grid}>
        {MEMBERS.map((member) => (
          <TouchableOpacity
            key={member.id}
            style={[styles.memberCard, { borderColor: member.color }]}
            onPress={() => onSelect(member.id)}
            activeOpacity={0.75}
          >
            <Image source={HEADSHOTS[member.id]} style={styles.headshot} resizeMode="cover" />
            <View style={[styles.nameBar, { backgroundColor: member.color }]}>
              <Text style={styles.memberLabel}>{member.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.footer}>Tap your photo to get started</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: COLORS.vocal_spectrum,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 32,
  },
  prompt: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 16,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
  },
  memberCard: {
    width: 160,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  headshot: {
    width: '100%',
    height: 160,
  },
  nameBar: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  memberLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  footer: {
    marginTop: 24,
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
