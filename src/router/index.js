import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home';
import firebase from '@/firebase';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        meta: {
            authRequired: true
        },
        component: Home
    },
    {
        path: '/login',
        name: 'Log In',
        component: () => import('@/views/LogIn')
    },
    {
        path: '/wotd',
        name: 'Word of the Day',
        meta: {
            authRequired: true
        },
        component: () => import('@/views/WordOfTheDay')
    },
    {
        path: '/translator',
        name: 'Translator',
        meta: {
            authRequired: true
        }
        // component: () => import('@/views/Translator')
    },
    {
        path: '/quiz',
        name: 'Quiz Game',
        meta: {
            authRequired: true
        },
        component: () => import('@/views/Quiz')
    },
    {
        path: '/users',
        name: 'User Management',
        meta: {
            authRequired: true
        }
        // component: () => import('@/views/UserManagement')
    }
    // {
    //     path: '*',
    //     redirect: '/login',
    //     meta: {
    //         authRequired: true
    //     }
    // }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    const authRequired = to.matched.some(record => record.meta.authRequired);
    const currentUser = firebase.auth.currentUser;

    if (authRequired && !currentUser) next('/login');
    else next();
});

export default router;
