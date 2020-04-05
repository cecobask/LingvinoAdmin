<template>
    <span>
        <v-navigation-drawer
            app
            color="teal darken-4"
            v-if="userLoggedIn"
            v-model="drawer"
            disable-route-watcher
            :mini-variant="$vuetify.breakpoint.smAndDown"
            temporary
            dark
        >
            <v-list nav dense>
                <v-list-item-group>
                    <template v-for="item in drawerItems">
                        <v-list-item
                            :key="item.route"
                            :to="item.route"
                            @click="drawer = false"
                        >
                            <v-list-item-icon>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                                {{ item.title }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                    <v-list-item @click="logout">
                        <v-list-item-icon>
                            <v-icon>mdi-logout-variant</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Log out
                        </v-list-item-title>
                    </v-list-item>
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
            <v-btn
                v-if="!userLoggedIn"
                class="hidden-sm-and-down"
                to="/login"
                outlined
                replace
            >
                <v-icon class="pr-2">mdi-login-variant</v-icon>
                Log in
            </v-btn>
            <v-btn
                v-else
                class="hidden-sm-and-down"
                @click="logout"
                outlined
                replace
            >
                <v-icon class="pr-2">mdi-logout-variant</v-icon>
                Log out
            </v-btn>
        </v-app-bar>
    </span>
</template>

<script>
export default {
    name: 'AppNavigation',
    data() {
        return {
            appTitle: 'Lingvino Admin',
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
                    title: 'User management',
                    icon: '$userManagement',
                    route: '/users'
                }
            ]
        };
    },

    methods: {
        logout() {
            this.$store.dispatch('logoutAction');
        }
    },

    computed: {
        userLoggedIn() {
            return this.$store.getters.user;
        }
    },

    mounted() {
        this.$root.$on('authenticated', bool => {
            this.drawer = bool;
        });
    }
};
</script>
