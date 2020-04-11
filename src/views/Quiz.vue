<template>
    <tree-view
            :data="quizData"
            @action="performAction"
            :title="title"
            :icon="icon"
            ref="quizTree"
    />
</template>

<script>
    import TreeView from '@/components/TreeView';
    import { mapState } from 'vuex';
    import firebase from '@/firebase';
    import { hasJsonStructure } from '@/helpers';

    export default {
        name: 'Quiz',
        components: { TreeView },
        computed: mapState(['quizData']),

        data() {
            return {
                title: 'QUIZ GAME',
                icon: '$quiz',
                insertDialog: false
            };
        },

        mounted() {
            this.$store.dispatch('fetchQuizData');
        },

        methods: {
            performAction({ action, data }) {
                switch (action) {
                    case 'update': {
                        for (const child in data.children) {
                            if (Object.prototype.hasOwnProperty.call(data.children, child)) {
                                const obj = data.children[child];
                                const objId = obj.children ? obj.id : obj.id.split('/last')[0];
                                const updatedValue = hasJsonStructure(obj.value) ? JSON.parse(obj.value) : obj.value;
                                firebase.database.ref(`quizGame/topics/${objId}`)
                                    .set(updatedValue);
                            }
                        }
                        this.$refs.quizTree.snackbar.visibility = true;
                        this.$refs.quizTree.snackbar.text = 'Successfully updated the record/s.';
                        this.$store.dispatch('fetchQuizData');
                        break;
                    }
                    case 'insert-dialog':
                        this.insertDialog = true;
                        break;
                    // case 'insert-wotd': {
                    // this.insertDialog = false;
                    // firebase.database.ref('wordOfTheDay/selection')
                    //     .push()
                    //     .set(data);
                    // this.$refs.wotdTree.snackbar.visibility = true;
                    // this.$refs.wotdTree.snackbar.text = 'Successfully inserted a new WOTD selection entry.';
                    // this.wotdNew = '';
                    // this.$store.dispatch('fetchWotds')
                    // break;
                    // }
                    case 'delete': {
                        data.forEach(element => {
                            const id = element.id.endsWith('/last') ? element.id.split('/last')[0] : element.id;
                            firebase.database.ref('quizGame/topics')
                                .child(id)
                                .remove();
                        });
                        this.$refs.quizTree.snackbar.visibility = true;
                        this.$refs.quizTree.snackbar.text = 'Successfully deleted selection.';
                        this.$store.dispatch('fetchQuizData');
                        break;
                    }
                }
            }
        }
    };
</script>

<style scoped>

</style>
