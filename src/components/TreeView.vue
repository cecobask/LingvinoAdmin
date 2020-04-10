<template>
    <v-container fluid>
        <v-row>
            <v-col class="ma-auto" sm="12" md="9" lg="9">
                <v-card>
                    <v-toolbar color="blue-grey darken-3" dark flat>
                        <v-icon class="mx-2">{{ icon }}</v-icon>
                        <v-toolbar-title>{{ title }}</v-toolbar-title>
                        <v-spacer/>
                        <v-icon class="mx-2" @click="expanded = []">mdi-collapse-all</v-icon>
                        <v-icon class="mx-2" @click="triggerMultiSelect">mdi-clipboard-check-multiple</v-icon>
                        <v-divider class="mx-5 grey" vertical/>
                        <v-icon class="mx-2" @click="insertRecord">mdi-plus-box</v-icon>
                        <v-icon class="mx-2" v-if="selection.length" @click="deleteRecords">mdi-delete</v-icon>
                        <v-icon class="mx-2" @click="search.visible = !search.visible">mdi-magnify</v-icon>
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
                                    style="max-height: 70vh"
                        >
                            <template v-slot:append="{ item }">
                                <v-menu v-model="actionMenu[item.id]">
                                    <template v-if="item.children" v-slot:activator="{ on }">
                                        <v-btn icon v-on="on" @click="clickedItem = item">
                                            <v-icon>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-dialog v-if="clickedItem" v-model="editDialog[item.id]" persistent scrollable
                                                  max-width="600">
                                            <template v-slot:activator="{ on }">
                                                <v-list-item v-for="menuItem in menuItems"
                                                             :key="menuItem.title"
                                                             v-on="menuItem.title === 'Edit' ? on : ''"
                                                             @click="menuItem.title === 'Delete' ? deleteRecords(item) : ''"
                                                >
                                                    <v-list-item-icon class="mx-0">
                                                        <v-icon>{{menuItem.icon}}</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title class="ps-2">{{menuItem.title}}
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </template>

                                            <v-card>
                                                <v-toolbar dark color="teal darken-3">
                                                    <v-spacer/>
                                                    <v-toolbar-title class="font-weight-bold">{{item.name}}
                                                    </v-toolbar-title>
                                                    <v-spacer/>
                                                    <v-btn icon dark @click="closeDialog()">
                                                        <v-icon>mdi-close</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-card-text>
                                                    <v-container>
                                                        <v-row v-for="(field, index) in item.children" :key="field.id">
                                                            <v-col v-if="clickedItem.children[index]">
                                                                <v-text-field v-if="clickedItem.children[index].label"
                                                                              :label="field.label"
                                                                              outlined
                                                                              spellcheck="false"
                                                                              type="text"
                                                                              color="teal darken-4"
                                                                              v-model="clickedItem.children[index].value"
                                                                ></v-text-field>
                                                                <v-text-field v-else
                                                                              :label="field.name"
                                                                              outlined
                                                                              spellcheck="false"
                                                                              type="text"
                                                                              color="teal darken-4"
                                                                              v-model="clickedItem.children[index].value"
                                                                ></v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </v-container>
                                                </v-card-text>
                                                <v-divider/>
                                                <v-card-actions>
                                                    <v-btn dark color="teal"
                                                           class="ma-auto"
                                                           @click="updateRecords"
                                                    >
                                                        Save
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
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
    export default {
        name: 'TreeView',
        props: ['data', 'title', 'icon'],

        data() {
            return {
                selection: [],
                multiSelect: false,
                multiDelete: false,
                editDialog: {},
                clickedItem: null,
                expanded: [],
                search: {
                    visible: false,
                    text: null
                },
                actionMenu: {},
                snackbar: {
                    visible: false,
                    text: 'Success'
                },
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

        methods: {
            triggerMultiSelect() {
                this.multiSelect = !this.multiSelect;
                this.multiDelete = this.multiSelect;
                this.selection = [];
            },
            closeDialog() {
                this.$set(this.editDialog, this.clickedItem.id, false);
                this.$set(this.actionMenu, this.clickedItem.id, false);
            },
            updateRecords() {
                this.$emit('action',{ action: 'update', data: this.clickedItem })
                this.closeDialog()
            },
            insertRecord() {
                this.$emit('action', { action: 'insert-dialog' })
            },
            deleteRecords(record) {
                this.$emit('action', { action: 'delete', data: record ? [record] : this.selection })
            },
            handleExpanded(expanded) {
                this.expanded = expanded;
            }
        }
    };
</script>

<style scoped>

</style>
