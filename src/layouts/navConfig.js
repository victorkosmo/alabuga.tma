import { Home, User, Rocket, Settings } from 'lucide-vue-next';

/**
 * @typedef {Object} NavItem
 * @property {string} name - The name of the route.
 * @property {string} path - The URL path for the navigation link.
 * @property {string} label - The text label to display under the icon.
 * @property {Component} icon - The icon component to display.
 */

/**
 * Configuration for the bottom navigation bar.
 * @type {NavItem[]}
 */
export const navConfig = [
  {
    name: 'home',
    path: '/',
    label: 'Home',
    icon: Home,
  },
  {
    name: 'profile',
    path: '/profile',
    label: 'Profile',
    icon: User,
  },
  {
    name: 'checkMe',
    path: '/check-me',
    label: 'Check',
    icon: Rocket,
  },
  {
    name: 'telegram-data',
    path: '/telegram-data',
    label: 'TG Data',
    icon: Settings,
  },
];
