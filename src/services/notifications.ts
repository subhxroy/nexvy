import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return true;
}

export async function scheduleWorkoutReminder(
  hour: number,
  minute: number,
  daysOfWeek: number[]
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to Train',
      body: "You've got a workout waiting. Let's go!",
    },
    trigger: {
      weekday: daysOfWeek[0] ?? 2,
      hour,
      minute,
      repeats: true,
    },
  });
  return id;
}

export async function scheduleMealReminder(
  hour: number,
  minute: number
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Log Your Meal',
      body: "Don't forget to track your nutrition.",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
  return id;
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}
