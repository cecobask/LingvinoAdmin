<template>
    <span>
        <v-navigation-drawer
            color="teal darken-4"
            app
            v-model="drawer"
            absolute
            temporary
            dark
        >
            <v-list nav dense>
                <v-list-item-group>
                    <template v-for="(item, index) in drawerItems">
                        <v-list-item :key="index" :to="item.route">
                            <v-list-item-icon>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                                {{ item.title }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app color="teal darken-4" dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-spacer class="hidden-md-and-up" />
            <v-toolbar-title>
                <router-link
                    to="/"
                    style="color: white; text-decoration: none; font-weight: bold"
                >
                    {{ appTitle }}
                </router-link>
            </v-toolbar-title>
            <v-spacer class="hidden-sm-and-down" />
            <v-btn class="hidden-sm-and-down" to="/login" text>LOG IN</v-btn>
        </v-app-bar>
    </span>
</template>

<script>
export default {
    name: 'AppNavigation',
    data() {
        return {
            appTitle: process.env.VUE_APP_TITLE,
            drawer: false,
            drawerItems: [
                {
                    title: 'Home',
                    icon: 'mdi-home',
                    route: '/'
                },
                {
                    title: 'Word of the day',
                    icon: '$wotd',
                    route: '/wotd'
                },
                {
                    title: 'Translator',
                    icon: '$translator',
                    route: '/translator'
                },
                {
                    title: 'Quiz game',
                    icon: '$quiz',
                    route: '/quiz'
                },
                {
                    title: 'Sign out',
                    icon: 'mdi-logout',
                    route: '/logout'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
