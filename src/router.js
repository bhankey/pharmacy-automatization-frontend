import { createWebHistory, createRouter } from "vue-router";
import Login from "./views/Login.vue";
import Pharmacies from "@/views/Pharmacies";
import Users from "@/views/Users"
import Sales from "@/views/Sales"

// lazy-loaded
const ProfilePage = () => import("./views/Profile.vue")
const routes = [
    {
        path:"/sales",
        name: "sales",
        component: Sales,
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/profile",
        name: "profile",
        // lazy-loaded
        component: ProfilePage,
    },
    {
        path: "/pharmacies",
        name: "pharmacies",
        // lazy-loaded
        component: Pharmacies,
    },
    {
        path: "/users",
        name: "users",
        // lazy-loaded
        component: Users,
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/home'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');
    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
        next('/login');
    } else {
        next();
    }
});

export default router;

