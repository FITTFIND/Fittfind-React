import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const WINDOW_WIDTH = width;
export const WINDOW_HEIGHT = height;
export const STATUSBAR_HEIGHT = 20;
export const SPECIALITY_ITEMS = [
  'Muscle gain',
  'Weight loss',
  'Toning'
];
export const NAVBAR_MARGIN_TOP = 30;
export const NAVBAR_MARGIN_HORIZONTAL = 15;
export const OPEN_MENU_OFFSET = WINDOW_WIDTH * 6 / 7;
export const NAVBAR_HEIGHT = 40;
export const NOTIFICATION_HEIGHT = 50;
export const MENU_ITEMS = [
  'Profile',
  'Personal trainer',
  'Schedule',
  'Favorites',
  'Messages',
  'Settings'
];
export const SETTINGS_ITEM = [
  'Invite Friends',
  'Payment',
  'Help',
  'Terms of service',
  'Privacy policy',
  'Log out'
];
export const US_VIRGINIA_DOMAIN = 'ec2-54-89-104-168.compute-1.amazonaws.com';
export const EU_FRANNKFURT_DOMAIN = 'ec2-35-156-60-55.eu-central-1.compute.amazonaws.com';
export const SCENE_NAMES = {
  CLIENT: 'ClientScene',
  TRAINER: 'TrainerScene',
  FAVORITE: 'FavoritesScene',
  MESSAGE: 'MessagesScene',
  PERSONALTRAINER: 'PersonalTrainerScene',
  TRAINER_PROFILE: 'TRAINER_PROFILE_SCENE',
  CHAT: 'CHAT_SCENE',
  BOOKING: 'BookingScene',
  PAYMENT: 'PaymentScene',
  SETTINGS: 'SettingsScene',
  SCHEDULE: 'ScheduleScene',
};
