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
                        <v-list-item :key="index">
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
            <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
            <v-spacer class="hidden-sm-and-down" />
            <v-btn class="hidden-sm-and-down" text>LOG IN</v-btn>
            <v-btn class="hidden-sm-and-down" text>REGISTER</v-btn>
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
                { title: 'Home', icon: 'mdi-home' },
                { title: 'Word of the day', icon: '$wotd' },
                { title: 'Translator', icon: '$translator' },
                { title: 'Quiz game', icon: '$quiz' },
                { title: 'Sign out', icon: 'mdi-logout' }
            ]
        };
    }
};
</script>

<style scoped></style>
