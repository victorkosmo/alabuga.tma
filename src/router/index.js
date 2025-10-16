// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useTelegramStore } from '../stores/telegram';
import Home from '../features/homePanel/homePanelView.vue';
import ErrorPage from '../pages/error.vue';
import TmaShell from '../layouts/tmaShell.vue';
import CampaignPage from '@/features/campaignPage/campaignPageView.vue';
import missionSubmitForm from '@/features/missionSubmitForm/missionSubmitFormView.vue';
import missionsPanelView from '@/features/missionsPanel/missionsPanelView.vue';
import storeItemsPanelView from '@/features/storeItemsPanel/storeItemsPanelView.vue';
import settingsPageView from '@/features/settingsPage/settingsPageView.vue';
import progressPanelView from '@/features/progressPanel/progressPanelView.vue';

const routes = [
    {
        path: '/',
        component: TmaShell,
        children: [
            { path: '', name: 'missions', component: missionsPanelView },
            { path: 'progress', name : 'progress', component: progressPanelView},
            { path: 'store', name: 'store', component: storeItemsPanelView },
            { path: 'events', name: 'events', component: Home },
            { path: '/campaign/:id', name: 'Campaign', component: CampaignPage }
        ]
    },
    { path: '/campaign/:campaignId/mission/:missionId/submit', name: 'Завершить миссию', component: missionSubmitForm },
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
