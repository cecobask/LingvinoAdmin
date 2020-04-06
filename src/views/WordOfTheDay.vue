<template>
    <v-container fluid>
        <v-row>
            <v-col class="ma-auto" sm="12" md="9" lg="9">
                <v-card>
                    <v-toolbar color="blue-grey darken-3" dark flat>
                        <v-icon class="mx-2">$wotd</v-icon>
                        <v-toolbar-title>
                            WORD OF THE DAY
                        </v-toolbar-title>
                        <v-spacer/>
                        <v-icon class="mx-2" v-if="multiDelete" @click="performAction('delete', selection)">mdi-delete
                        </v-icon>
                        <v-icon class="mx-2" @click="triggerMultiSelect">mdi-clipboard-check-multiple</v-icon>
                    </v-toolbar>
                    <v-card-text>
                        <v-treeview v-model="selection" selected-color="teal"
                                    selection-type="independent" open-on-click rounded :selectable="multiSelect"
                                    return-object
                                    hoverable
                                    :items="pastWotds">
                            <template v-slot:append="{ item }">
                                <v-menu>
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon v-on="on">
                                            <v-icon>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item v-for="menuItem in menuItems" :key="menuItem.title"
                                                     @click="performAction(menuItem.title.toLowerCase(), item)">
                                            <v-list-item-icon class="mx-0">
                                                <v-icon>{{menuItem.icon}}</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-title class="ps-2">{{menuItem.title}}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </template>
                        </v-treeview>
                    </v-card-text>
                </v-card>
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
                selection: [],
                multiSelect: false,
                multiDelete: false,
                menuItems: [
                    {
                        title: 'Delete',
                        icon: 'mdi-delete'
                    },
                    {
                        title: 'Edit',
                        icon: 'mdi-square-edit-outline'
                    }
                ]
            };
        },

        mounted() {
            this.$store.dispatch('fetchWotds');
        },

        computed: mapState(['pastWotds']),

        methods: {
            performAction(action, selection) {
                console.log(action);
                console.log(selection);
            },
            triggerMultiSelect() {
                this.multiSelect = !this.multiSelect;
                this.multiDelete = this.multiSelect;
                this.selection = [];
            }
        }
    };
</script>

<style scoped></style>
