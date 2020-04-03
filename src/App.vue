<template>
    <v-app>
        <app-navigation></app-navigation>

        <v-content transition="slide-x-transition" class="content">
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
import AppNavigation from '@/components/AppNavigation';

export default {
    name: 'App',
    components: {
        AppNavigation
    }
};
</script>

<style>
.content {
    background-size: cover;
    width: 100%;
    height: 100%;
    background: url('https://globalpartnersinhope.com/wp-content/uploads/2016/11/iStock_93232925_MEDIUM.jpg')
        no-repeat center;
}
</style>
