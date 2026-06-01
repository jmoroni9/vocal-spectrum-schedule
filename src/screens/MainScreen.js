import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import AIPromptBar from '../components/AIPromptBar';
import AddEventModal from '../components/AddEventModal';
import Header from '../components/Header';
import TopTabBar from '../components/TopTabBar';
import { COLORS } from '../constants';
import CalendarScreen from './CalendarScreen';

export default function MainScreen({ selectedMember, onHome }) {
  const [activeTab, setActiveTab] = useState(selectedMember);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <View style={styles.container}>
      <Header selectedMember={selectedMember} onHome={onHome} />
      <TopTabBar activeTab={activeTab} onTabPress={setActiveTab} />
      <View style={styles.content}>
        <CalendarScreen key={activeTab} tabId={activeTab} />
      </View>
      <AIPromptBar selectedMember={selectedMember} />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <AddEventModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        selectedMember={selectedMember}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.vocal_spectrum,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 32,
  },
});
