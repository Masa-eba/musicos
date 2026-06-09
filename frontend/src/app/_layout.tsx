import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/shared/theme/design';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.background },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSubtle,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarStyle: {
            height: 68,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
        <Tabs.Screen name="graph" options={{ title: 'Graph' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </>
  );
}
