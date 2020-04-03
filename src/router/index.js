import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Log In',
        component: () => import('@/views/LogIn')
    }
    // {
    //     path: '/wotd',
    //     name: 'Word of the Day',
    //     component: () => import('@/views/WordOfTheDay')
    // },
    // {
    //     path: '/translator',
    //     name: 'Translator',
    //     component: () => import('@/views/Translator')
    // },
    // {
    //     path: '/quiz',
    //     name: 'Quiz Game',
    //     component: () => import('@/views/QuizGame')
    // },
    // {
    //     path: '/users',
    //     name: 'User Management',
    //     component: () => import('@/views/UserManagement')
    // }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
