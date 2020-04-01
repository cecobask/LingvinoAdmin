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
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>$wotd</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Word of the Day</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>$translator</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Translator</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>$quiz</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Quiz Game</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Log out</v-list-item-title>
                    </v-list-item>
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
            drawer: false
        };
    }
};
</script>

<style scoped></style>
