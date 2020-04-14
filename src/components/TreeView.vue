<template>
    <v-container>
        <v-card max-width="90vw" class="ma-auto elevation-10">
            <v-toolbar color="blue-grey darken-3" dark flat>
                <v-icon class="mx-2">{{ icon }}</v-icon>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer/>
                <v-tooltip top color="success">
                    <template #activator="{ on }">
                        <v-icon class="mx-2" @click="expanded = []" v-on="on">
                            mdi-collapse-all
                        </v-icon>
                    </template>
                    <span>Collapse all nodes</span>
                </v-tooltip>
                <v-tooltip top color="success">
                    <template #activator="{ on }">
                        <v-icon class="mx-2" @click="triggerMultiSelect" v-on="on">
                            mdi-clipboard-check-multiple
                        </v-icon>
                    </template>
                    <span>Select multiple nodes</span>
                </v-tooltip>
                <v-divider class="mx-5 grey" vertical/>
                <v-tooltip v-if="icon !== '$translator'" top color="success">
                    <template #activator="{ on }">
                        <v-icon class="mx-2" @click="insertRecord" v-on="on">
                            mdi-plus-box
                        </v-icon>
                    </template>
                    <span>Add new record</span>
                </v-tooltip>
                <v-tooltip top color="success" v-if="selection.length">
                    <template #activator="{ on }">
                        <v-icon class="mx-2" @click="performAction({ action: 'deleteRecords' })" v-on="on">
                            mdi-delete
                        </v-icon>
                    </template>
                    <span>Delete selected nodes</span>
                </v-tooltip>
                <v-tooltip top color="success">
                    <template #activator="{ on }">
                        <v-icon class="mx-2" @click="search.visible = !search.visible" v-on="on">
                            mdi-magnify
                        </v-icon>
                    </template>
                    <span>Search the database</span>
                </v-tooltip>
            </v-toolbar>
            <v-snackbar v-model="snackbar.visible" multi-line>
                {{ snackbar.text }}
                <v-btn color="pink" text @click="snackbar.visible = false">
                    Close
                </v-btn>
            </v-snackbar>
            <v-card-text>
                <v-text-field
                        v-model="search.text"
                        v-if="search.visible"
                        label="Search the database..."
                        flat
                        solo-inverted
                        hide-details
                        clearable
                        clear-icon="mdi-close-circle-outline"
                        class="mb-3"
                ></v-text-field>
                <v-treeview v-model="selection"
                            :open="expanded"
                            @update:open="handleExpanded"
                            selected-color="teal"
                            selection-type="independent"
                            open-on-click
                            rounded
                            :selectable="multiSelect"
                            return-object
                            hoverable
                            :items="data"
                            :search="search.text"
                            class="overflow-y-auto"
                            style="max-height: 72vh"
                >
                    <template v-slot:append="{ item }">
                        <tree-view-content v-if="item" :item="item" @crud="performAction"/>
                    </template>
                </v-treeview>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
    import TreeViewContent from '@/components/TreeViewContent';

    export default {
        name: 'TreeView',
        components: { TreeViewContent },
        props: ['data', 'title', 'icon'],

        data() {
            return {
                selection: [],
                multiSelect: false,
                multiDelete: false,
                expanded: [],
                search: {
                    visible: false,
                    text: null
                },
                snackbar: {
                    visible: false,
                    text: 'Success'
                }
            };
        },

        methods: {
            triggerMultiSelect() {
                this.multiSelect = !this.multiSelect;
                this.multiDelete = this.multiSelect;
                this.selection = [];
            },
            handleExpanded(expanded) {
                this.expanded = expanded;
            },
            performAction({ action, data }) {
                switch (action) {
                    case 'updateRecords':
                        this.$emit('action', {
                            action: 'update',
                            data: data
                        });
                        break;
                    case 'deleteRecords':
                        this.$emit('action', {
                            action: 'delete',
                            data: data ? [data] : this.selection
                        });
                        this.selection = [];
                        break;
                }
            },
            insertRecord() {
                this.$emit('action', { action: 'insert-dialog' });
            }
        }
    };
</script>

<style scoped>

</style>
