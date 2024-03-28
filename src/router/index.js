import ChatView from "@/components/ChatView.vue";
import HomeView from "@/components/HomeView.vue";
import MessangerView from "@/components/MessangerView.vue";
import ProfileSetting from "@/components/ProfileSetting.vue";
import SettingView from "@/components/SettingView.vue";

import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/home",
        component: HomeView,
    },
    {
        path: "/m",
        component: MessangerView,
        children: [
            {
                path: ":id",
                component: ChatView,
            },
        ],
    },
    {
        path: "/setting",
        component: SettingView,
        children: [
            {
                path: "profile",
                component: ProfileSetting,
            },
        ],
    },
    {
        path: "/",
        component: HomeView,
    },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

export default router;
