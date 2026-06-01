import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { parseScheduleCommand } from '../lib/claudeApi';
import { addEvent, findAndDeleteEvent } from '../lib/supabase';
import { useToast } from './Toast';

export default function AIPromptBar({ selectedMember }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const showToast = useToast();

  const handleSubmit = async () => {
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
        if (
          ownerRequested !== 'vocal_spectrum' &&
          ownerRequested !== selectedMember
        ) {
          showToast("⚠️ You can only add your own events or Vocal Spectrum events.");
          return;
        }
        await addEvent(result.event);
        const ownerLabel =
          ownerRequested === 'vocal_spectrum'
            ? 'Vocal Spectrum'
            : ownerRequested.charAt(0).toUpperCase() + ownerRequested.slice(1);
        showToast(`✅ Event added to ${ownerLabel}`);
        return;
      }

      if (result.action === 'remove') {
        const ownerRequested = result.search.owner;
        if (
          ownerRequested &&
          ownerRequested !== 'vocal_spectrum' &&
          ownerRequested !== selectedMember
        ) {
          showToast("⚠️ You can only remove your own events or Vocal Spectrum events.");
          return;
        }
        const deleted = await findAndDeleteEvent(result.search);
        if (deleted) {
          showToast(`🗑️ Removed "${deleted.title}"`);
        } else {
          showToast('⚠️ No matching event found to remove.');
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          placeholder="Add or remove an event..."
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
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendIcon}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendIcon: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 2,
  },
});
