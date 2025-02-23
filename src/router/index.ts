import AssignmentView from "@/components/AssignmentView.vue";
import DashboardView from "@/components/DashboardView.vue";
import GitView from "@/components/GitView.vue";
import HomeView from "@/components/HomeView.vue";
import LoginView from "@/components/LoginView.vue";
import ManageConnections from "@/components/ManageConnections.vue";
import ProfileSetting from "@/components/ProfileSetting.vue";
import RegisterView from "@/components/RegisterView.vue";
import SettingView from "@/components/SettingView.vue";
import WelcomeView from "@/components/WelcomeView.vue";
import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import DashboardAssignmentView from "@/components/DashboardAssignmentView.vue";
import MicrosoftView from "@/components/MicrosoftView.vue";

const routes = [
    {
        path: "/a/:id",
        component: AssignmentView,
    },
    {
        path: "/dashboard",
        component: DashboardView,
        children: [
            {
                path: "a/:id",
                component: DashboardAssignmentView,
            },
        ],
    },
    {
        path: "/welcome",
        component: WelcomeView,
    },
    {
        path: "/auth/login",
        component: LoginView,
    },
    {
        path: "/auth/signup",
        component: RegisterView,
    },
    {
        path: "/git",
        component: GitView,
    },
    {
        path: "/newsletter",
        component: () => import("@/components/NewsletterView.vue"),
    },
    {
        path: "/home",
        component: HomeView,
    },
    {
        path: "/calendar",
        component: () => import("@/components/CalendarView.vue"),
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
    {
        path: "/mic",
        component: MicrosoftView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
