<template>
    <v-container fluid>
        <tree-view
                :data="translatorData"
                @action="performAction"
                :title="title"
                :icon="icon"
                ref="translatorTree"
        />
    </v-container>
</template>

<script>
    import { mapState } from 'vuex';
    import TreeView from '@/components/TreeView';
    import firebase from '@/firebase';

    export default {
        name: 'Translator',
        components: { TreeView },
        computed: mapState(['translatorData']),

        data() {
            return {
                title: 'USERS\'S TRANSLATOR COLLECTIONS',
                icon: '$translator'
            };
        },

        mounted() {
            this.$store.dispatch('fetchTranslatorData');
        },

        methods: {
            performAction({ action, data }) {
                switch (action) {
                    case 'update': {
                        if (data.key) {
                            firebase.database.ref(`users/${data.key}`)
                                .set(data.value);
                        } else {
                            for (const child in data.children) {
                                if (Object.prototype.hasOwnProperty.call(data.children, child)) {
                                    const obj = data.children[child];
                                    const objId = obj.children ? obj.id : obj.id.split('/last')[0];
                                    firebase.database.ref(`users/${objId}`)
                                        .set(obj.value)
                                }
                            }
                        }

                        this.$refs.translatorTree.snackbar.visible = true;
                        this.$refs.translatorTree.snackbar.text = 'Successfully updated the record/s.';
                        this.$store.dispatch('fetchTranslatorData');
                        break;
                    }
                    // case 'insert-dialog':
                    //     this.insertDialog = true;
                    //     break;
                    // case 'insert-wotd': {
                    //     this.insertDialog = false;
                    //     firebase.database.ref('wordOfTheDay/selection')
                    //         .push()
                    //         .set(data);
                    //     this.$refs.wotdTree.snackbar.visible = true;
                    //     this.$refs.wotdTree.snackbar.text = 'Successfully inserted a new WOTD selection entry.';
                    //     this.wotdNew = '';
                    //     this.$store.dispatch('fetchWotds');
                    //     break;
                    // }
                    case 'delete': {
                        data.forEach(element => {
                            const id = element.id.endsWith('/last') ? element.id.split('/last')[0] : element.id;
                            firebase.database.ref('users')
                                .child(id)
                                .remove();
                        });
                        this.$refs.translatorTree.snackbar.visible = true;
                        this.$refs.translatorTree.snackbar.text = 'Successfully deleted selection.';
                        this.$store.dispatch('fetchTranslatorData');
                        break;
                    }
                }
            }
        }
    };
</script>

<style scoped>

</style>
