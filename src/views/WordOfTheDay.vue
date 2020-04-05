<template>
    <v-container fluid>
        <v-row>
            <v-col class="display-2 font-weight-bold white--text text-center">
                Word of the Day
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col>
                <json-view :data="wotds" v-on:selected="itemSelected" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'WordOfTheDay',

    mounted() {
        this.$store.dispatch('fetchWotds');
    },

    computed: mapState(['wotds']),

    methods: {
        itemSelected(key, value, path) {
            console.log(key);
            console.log(value);
            console.log(path);
        }
    }
};
</script>

<style scoped></style>
