import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ToastProvider } from './src/components/Toast';
import MemberSelectScreen from './src/screens/MemberSelectScreen';
import MainScreen from './src/screens/MainScreen';
import MasterScheduleScreen from './src/screens/MasterScheduleScreen';
import { COLORS } from './src/constants';

export default function App() {
  // screen: null = member select, 'master' = master schedule, string = member id
  const [screen, setScreen] = useState(null);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar style="light" />
        <View style={styles.root}>
          {screen === null && (
            <MemberSelectScreen
              onSelect={(memberId) => setScreen(memberId)}
              onMasterSchedule={() => setScreen('master')}
            />
          )}
          {screen === 'master' && (
            <MasterScheduleScreen onHome={() => setScreen(null)} />
          )}
          {screen !== null && screen !== 'master' && (
            <MainScreen
              selectedMember={screen}
              onHome={() => setScreen(null)}
            />
          )}
        </View>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
