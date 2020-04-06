<template>
    <v-container fluid>
        <v-row>
            <v-col class="display-2 font-weight-bold white--text text-center">
                Word of the Day
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col class="ma-auto" sm="12" md="9" lg="9">
                <v-treeview class="rounded white pa-3 my-3" v-model="selection" selected-color="teal"
                            selection-type="independent" open-on-click rounded selectable return-object hoverable
                            :items="pastWotds"></v-treeview>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'WordOfTheDay',

        data() {
            return {
                selection: []
            };
        },

        mounted() {
            this.$store.dispatch('fetchWotds');
        },

        computed: mapState(['pastWotds']),

        methods: {}
    };
</script>

<style scoped>
    .rounded {
        border-radius: 10px;
    }
</style>
