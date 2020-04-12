<template>
    <v-container fluid>
        <tree-view :data="wotds" @action="performAction" :title="title" :icon="icon" ref="wotdTree"/>
        <v-dialog v-model="insertDialog" max-width="600">
            <v-card>
                <v-toolbar dark color="teal darken-3">
                    <v-spacer/>
                    <v-toolbar-title class="font-weight-bold">Add new WOTD selection record</v-toolbar-title>
                    <v-spacer/>
                    <v-btn icon dark @click="insertDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="wotdNew"
                                              label="Word*"
                                              required
                                              outlined
                                              spellcheck="false"
                                              type="text"
                                              color="teal darken-4"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small class="mx-3">* indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-btn dark color="teal"
                           class="ma-auto"
                           @click="performAction({ action: 'insert-wotd', data: wotdNew })"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import { mapState } from 'vuex';
    import TreeView from '@/components/TreeView';
    import firebase from '@/firebase';

    export default {
        name: 'WordOfTheDay',
        components: { TreeView },
        computed: mapState(['wotds']),

        data() {
            return {
                title: 'WORD OF THE DAY',
                icon: '$wotd',
                insertDialog: false,
                wotdNew: ''
            };
        },

        mounted() {
            this.$store.dispatch('fetchWotds');
        },

        methods: {
            performAction({ action, data }) {
                switch (action) {
                    case 'update': {
                        if (data.key) {
                            firebase.database.ref(`wordOfTheDay/${data.key}`).set(data.value);
                        } else {
                            for (const child in data.children) {
                                if (Object.prototype.hasOwnProperty.call(data.children, child)) {
                                    const obj = data.children[child];
                                    const objId = obj.children ? obj.id : obj.id.split('/last')[0];
                                    firebase.database.ref(`wordOfTheDay/${objId}`).set(obj.value);
                                }
                            }
                        }

                        this.$refs.wotdTree.snackbar.visible = true;
                        this.$refs.wotdTree.snackbar.text = 'Successfully updated the record/s.';
                        this.$store.dispatch('fetchWotds');
                        break;
                    }
                    case 'insert-dialog':
                        this.insertDialog = true;
                        break;
                    case 'insert-wotd': {
                        this.insertDialog = false;
                        firebase.database.ref('wordOfTheDay/selection')
                            .push()
                            .set(data);
                        this.$refs.wotdTree.snackbar.visible = true;
                        this.$refs.wotdTree.snackbar.text = 'Successfully inserted a new WOTD selection entry.';
                        this.wotdNew = '';
                        this.$store.dispatch('fetchWotds');
                        break;
                    }
                    case 'delete': {
                        data.forEach(element => {
                            const id = element.id.endsWith('/last') ? element.id.split('/last')[0] : element.id;
                            firebase.database.ref('wordOfTheDay')
                                .child(id)
                                .remove();
                        });
                        this.$refs.wotdTree.snackbar.visible = true;
                        this.$refs.wotdTree.snackbar.text = 'Successfully deleted selection.';
                        this.$store.dispatch('fetchWotds');
                        break;
                    }
                }
            }
        }
    };
</script>

<style scoped></style>
