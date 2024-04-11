import ChatView from "@/components/ChatView.vue";
import HomeView from "@/components/HomeView.vue";
import ManageConnections from "@/components/ManageConnections.vue";
import MessangerView from "@/components/MessangerView.vue";
import ProfileSetting from "@/components/ProfileSetting.vue";
import SettingView from "@/components/SettingView.vue";
import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";

const routes = [
    {
        path: "/newsletter",
        component: () => import("@/components/NewsletterView.vue"),
    },
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
            {
                path: "connections",
                component: ManageConnections,
            },
        ],
    },
    {
        path: "/",
        component: HomeView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
