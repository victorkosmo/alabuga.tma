import { Rocket, Settings, Crosshair, Vault } from 'lucide-vue-next';

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
    label: 'События',
    icon: Rocket,
  },
  {
    name: 'missions',
    path: '/missions',
    label: 'Миссии',
    icon: Crosshair,
  },
  {
    name: 'store',
    path: '/store',
    label: 'Магазин',
    icon: Vault,
  },
  {
    name: 'setings',
    path: '/settings',
    label: 'Профиль',
    icon: Settings,
  },
];
