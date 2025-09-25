// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useTelegramStore } from '../stores/telegram';
import Home from '../features/homePanel/homePanelView.vue';
import Profile from '../pages/profile.vue';
import Info from '../pages/info.vue';
import TelegramData from '../pages/telegramData.vue';
import CheckMe from '../pages/checkMe.vue';
import ErrorPage from '../pages/error.vue';
import TmaShell from '../layouts/tmaShell.vue';
import CampaignPage from '@/features/campaignPage/campaignPageView.vue';

const routes = [
    {
        path: '/',
        component: TmaShell,
        children: [
            { path: '', name: 'home', component: Home },
            { path: 'profile', name: 'profile', component: Profile },
            { path: 'info', name: 'info', component: Info },
            { path: 'check-me', name: 'checkMe', component: CheckMe },
            { path: 'telegram-data', name: 'telegram-data', component: TelegramData },
        ]
    },
    { path: '/campaign/:id', name: 'Campaign', component: CampaignPage },
    { path: '/error', name: 'error', component: ErrorPage },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || '/'),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const telegramStore = useTelegramStore();

    // If initialization has not been completed, run it.
    if (!telegramStore.isInitialized) {
        await telegramStore.initialize();
    }

    // After initialization, allow all navigation.
    // App.vue will handle showing the error screen if something went wrong.
    next();
});

export default router;
