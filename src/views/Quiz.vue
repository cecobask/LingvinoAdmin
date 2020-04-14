<template>
    <v-container fluid>
        <tree-view
                :data="quizData.formatted"
                @action="performAction"
                :title="title"
                :icon="icon"
                ref="quizTree"
        />
        <v-dialog v-model="insertDialog" max-width="70vw" max-height="90vh" scrollable>
            <v-card>
                <v-toolbar dark color="teal darken-3">
                    <v-spacer/>
                    <v-toolbar-title class="font-weight-bold">Add new quiz records</v-toolbar-title>
                    <v-spacer/>
                    <v-btn icon dark @click="closeJsonDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="grey lighten-4">
                    <v-container>
                        <v-row align="center" justify="center" class="mb-3">
                            <v-btn-toggle v-model="jsonType" mandatory class="mx-3">
                                <v-menu offset-x right close-on-click>
                                    <template v-slot:activator="{ on }">
                                        <v-btn large @click="dbPath='topics'">
                                            Topic/s
                                            <v-icon right>mdi-source-branch</v-icon>
                                        </v-btn>
                                        <v-btn large v-on="on">
                                            Question/s
                                            <v-icon right>mdi-help</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item
                                                v-for="(item, index) in topics"
                                                :key="index"
                                                @click="dbPath=`topics/${item}`"
                                        >
                                            <v-list-item-title>{{ item | capitalize }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-btn-toggle>
                        </v-row>
                        <v-row>
                            <v-json-editor
                                    v-model="newJson"
                                    :plus="false"
                                    :options="jsonOptions"
                                    @error="onJsonError"
                                    height="55vh"
                            />
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="teal"
                           class="ma-auto white--text my-3"
                           :disabled="newJson === undefined"
                           @click="performAction({ action: 'insertQuizData', data: newJson })"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import TreeView from '@/components/TreeView';
    import { mapState } from 'vuex';
    import firebase from '@/firebase';
    import VJsonEditor from 'v-jsoneditor';

    export default {
        name: 'Quiz',
        components: {
            TreeView,
            VJsonEditor
        },
        computed: mapState(['quizData']),

        data() {
            return {
                title: 'QUIZ GAME',
                icon: '$quiz',
                insertDialog: false,
                jsonType: undefined,
                dbPath: '',
                newJson: undefined,
                topics: [],
                jsonOptions: {
                    mainMenuBar: false,
                    mode: 'code'
                }
            };
        },

        mounted() {
            this.$store.dispatch('fetchQuizData');
        },

        methods: {
            performAction({ action, data }) {
                switch (action) {
                    case 'update': {
                        if (data.key) {
                            firebase.database.ref(`quizGame/${data.key}`)
                                .set(data.value, (err) => {
                                    if (!err) this.showSnackbar('Successfully updated the record/s.');
                                });
                        } else {
                            for (const child in data.children) {
                                if (Object.prototype.hasOwnProperty.call(data.children, child)) {
                                    const obj = data.children[child];
                                    const objId = obj.children ? obj.id : obj.id.split('/last')[0];
                                    firebase.database.ref(`quizGame/${objId}`)
                                        .set(obj.value, (err) => {
                                            if (!err) this.showSnackbar('Successfully updated the record/s.');
                                        });
                                }
                            }
                        }
                        break;
                    }
                    case 'insert-dialog':
                        this.insertDialog = true;
                        firebase.database.ref('quizGame/topics')
                            .once('value')
                            .then(topicsSnapshot => {
                                topicsSnapshot.forEach(topic => {
                                        this.topics.push(topic.key);
                                    }
                                );
                            });
                        break;
                    case 'delete': {
                        data.forEach(element => {
                            const id = element.id.endsWith('/last') ? element.id.split('/last')[0] : element.id;
                            firebase.database.ref('quizGame')
                                .child(id)
                                .remove();
                        });
                        this.$refs.quizTree.snackbar.visible = true;
                        this.$refs.quizTree.snackbar.text = 'Successfully deleted selection.';
                        this.$store.dispatch('fetchQuizData');
                        break;
                    }
                    case 'insertQuizData': {
                        const updateData = {};
                        for (const [topicLang, questionsObj] of Object.entries(data)) {
                            for (const [questionId, questionAttr] of Object.entries(questionsObj)) {
                                updateData[topicLang + '/' + questionId] = questionAttr;
                            }
                        }
                        firebase.database.ref(`quizGame/${this.dbPath}`)
                            .update(this.dbPath === 'topics' ? data : updateData, (err) => {
                                if (!err) this.showSnackbar('Successfully inserted the JSON data.');
                            });
                    }
                }
            },
            showSnackbar(text) {
                this.$refs.quizTree.snackbar.visible = true;
                this.$refs.quizTree.snackbar.text = text;
                this.$store.dispatch('fetchQuizData');
            },
            onJsonError() {
                this.newJson = undefined;
            },
            closeJsonDialog() {
                this.insertDialog = false;
                this.newJson = {};
            }
        }
    };
</script>

<style scoped>

</style>
