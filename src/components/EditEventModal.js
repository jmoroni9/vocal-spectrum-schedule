import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, WEEK_DAYS } from '../constants';
import { updateEvent, deleteEventById } from '../lib/supabase';
import { useToast } from './Toast';

export default function EditEventModal({ visible, event, onClose }) {
  const showToast = useToast();

  const [title, setTitle] = useState(event?.title ?? '');
  const [date, setDate] = useState(event?.date ?? WEEK_DAYS[0].date);
  const [startTime, setStartTime] = useState(formatTimeForInput(event?.start_time));
  const [endTime, setEndTime] = useState(formatTimeForInput(event?.end_time));
  const [location, setLocation] = useState(event?.location ?? '');
  const [notes, setNotes] = useState(event?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reset fields when event changes
  React.useEffect(() => {
    if (event) {
      setTitle(event.title ?? '');
      setDate(event.date ?? WEEK_DAYS[0].date);
      setStartTime(formatTimeForInput(event.start_time));
      setEndTime(formatTimeForInput(event.end_time));
      setLocation(event.location ?? '');
      setNotes(event.notes ?? '');
    }
  }, [event?.id]);

  function formatTimeForInput(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${suffix}`;
  }

  function parseTime(val) {
    if (!val) return null;
    const clean = val.trim().toUpperCase();
    const match = clean.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)?$/);
    if (!match) return null;
    let h = parseInt(match[1], 10);
    const m = match[2] ? parseInt(match[2], 10) : 0;
    const meridiem = match[3];
    if (meridiem === 'PM' && h < 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  }

  const handleSave = async () => {
    if (!title.trim()) { showToast('⚠️ Please enter a title'); return; }
    if (!startTime.trim()) { showToast('⚠️ Please enter a start time'); return; }
    const parsedStart = parseTime(startTime);
    if (!parsedStart) { showToast('⚠️ Invalid time — try "2:00 PM"'); return; }

    setSaving(true);
    try {
      await updateEvent(event.id, {
        title: title.trim(),
        date,
        start_time: parsedStart,
        end_time: endTime ? parseTime(endTime) : null,
        location: location.trim() || null,
        notes: notes.trim() || null,
      });
      showToast('✅ Event updated!');
      onClose();
    } catch (e) {
      showToast(`❌ ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteEventById(event.id);
              showToast(`🗑️ Deleted "${event.title}"`);
              onClose();
            } catch (e) {
              showToast(`❌ ${e.message}`);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (!event) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Edit Event</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.label}>Day</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
              {WEEK_DAYS.map((d) => (
                <TouchableOpacity
                  key={d.date}
                  onPress={() => setDate(d.date)}
                  style={[styles.dayChip, date === d.date && styles.dayChipActive]}
                >
                  <Text style={[styles.dayChipText, date === d.date && styles.dayChipTextActive]}>
                    {d.dayName} {d.dayNum}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Start Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 2:00 PM"
                  placeholderTextColor={COLORS.textMuted}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>End Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="optional"
                  placeholderTextColor={COLORS.textMuted}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Convention Center Room 204"
              placeholderTextColor={COLORS.textMuted}
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Any extra details..."
              placeholderTextColor={COLORS.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={saving || deleting}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteButton, deleting && styles.buttonDisabled]}
              onPress={handleDelete}
              disabled={saving || deleting}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>{deleting ? 'Deleting...' : '🗑️ Delete Event'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeBtn: { padding: 4 },
  closeText: { fontSize: 18, color: COLORS.textMuted },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: { flex: 1 },
  dayScroll: { marginBottom: 4 },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
    marginRight: 8,
  },
  dayChipActive: {
    backgroundColor: COLORS.vocal_spectrum,
    borderColor: COLORS.vocal_spectrum,
  },
  dayChipText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600' },
  dayChipTextActive: { color: '#fff' },
  saveButton: {
    backgroundColor: COLORS.vocal_spectrum,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  deleteButton: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  deleteButtonText: { color: '#ef4444', fontSize: 15, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
});
