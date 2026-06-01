import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, MEMBERS } from '../constants';
import { parseScheduleCommand } from '../lib/claudeApi';
import { addEvent, findAndDeleteEvent } from '../lib/supabase';
import { useToast } from '../components/Toast';

export default function AddEventScreen({ onHome }) {
  const insets = useSafeAreaInsets();
  const showToast = useToast();
  const [selectedMember, setSelectedMember] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMember) { showToast('⚠️ Please select who you are first'); return; }
    const command = text.trim();
    if (!command || loading) return;
    setText('');
    setLoading(true);
    try {
      const result = await parseScheduleCommand(command, selectedMember);

      if (result.action === 'error') {
        showToast(`⚠️ ${result.message}`);
        return;
      }

      if (result.action === 'add') {
        const ownerRequested = result.event.owner;
        if (ownerRequested !== 'vocal_spectrum' && ownerRequested !== selectedMember) {
          showToast('⚠️ You can only add your own events or Vocal Spectrum events.');
          return;
        }
        await addEvent(result.event);
        const ownerLabel = ownerRequested === 'vocal_spectrum'
          ? 'Vocal Spectrum'
          : ownerRequested.charAt(0).toUpperCase() + ownerRequested.slice(1);
        showToast(`✅ Event added to ${ownerLabel}`);
        setText('');
        return;
      }

      if (result.action === 'remove') {
        const ownerRequested = result.search.owner;
        if (ownerRequested && ownerRequested !== 'vocal_spectrum' && ownerRequested !== selectedMember) {
          showToast('⚠️ You can only remove your own events or Vocal Spectrum events.');
          return;
        }
        const deleted = await findAndDeleteEvent(result.search);
        if (deleted) {
          showToast(`🗑️ Removed "${deleted.title}"`);
        } else {
          showToast('⚠️ No matching event found.');
        }
        return;
      }

      showToast('⚠️ Could not understand that command.');
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onHome} style={styles.homeButton} activeOpacity={0.7}>
          <Text style={styles.homeIcon}>⌂</Text>
          <Text style={styles.homeLabel}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add / Remove Event</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Who are you */}
        <Text style={styles.sectionLabel}>Who are you?</Text>
        <View style={styles.memberRow}>
          {MEMBERS.map((m) => (
            <TouchableOpacity
              key={m.id}
              onPress={() => setSelectedMember(m.id)}
              style={[
                styles.memberChip,
                selectedMember === m.id && { backgroundColor: m.color, borderColor: m.color },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.memberChipText, selectedMember === m.id && styles.memberChipTextActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Instructions */}
        <Text style={styles.sectionLabel}>What would you like to do?</Text>
        <View style={styles.examples}>
          <Text style={styles.exampleTitle}>Examples:</Text>
          <Text style={styles.example}>• "Add dinner Tuesday at 7pm at Tony's"</Text>
          <Text style={styles.example}>• "Add a Vocal Spectrum warm-up Friday at 8am in Room 204"</Text>
          <Text style={styles.example}>• "Remove the AIC Significant's Luncheon on Thursday"</Text>
          <Text style={styles.example}>• "Remove my rehearsal on Wednesday"</Text>
        </View>
      </View>

      {/* Prompt bar */}
      <View style={[styles.promptBar, { paddingBottom: insets.bottom + 12 }]}>
        <TextInput
          style={styles.input}
          placeholder="Type your request in plain English..."
          placeholderTextColor={COLORS.textMuted}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
          editable={!loading}
          multiline={false}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.sendButton, loading && { opacity: 0.6 }]}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.sendIcon}>➤</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  },
  homeIcon: { fontSize: 16, color: COLORS.text },
  homeLabel: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  placeholder: { width: 70 },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 20,
  },
  memberRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  memberChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  memberChipText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  memberChipTextActive: {
    color: '#fff',
  },
  examples: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  example: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  promptBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.vocal_spectrum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { color: '#fff', fontSize: 18, marginLeft: 2 },
});
