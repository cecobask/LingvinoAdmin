<template>
    <v-container fluid>
        <v-row>
            <v-col class="ma-auto" sm="12" md="9" lg="9">
                <v-card>
                    <v-toolbar color="blue-grey darken-3" dark flat>
                        <v-icon class="mx-2">{{ icon }}</v-icon>
                        <v-toolbar-title>
                            {{ title }}
                        </v-toolbar-title>
                        <v-spacer/>
                        <v-icon class="mx-2" @click="performAction('add')">
                            mdi-plus-box
                        </v-icon>
                        <v-icon class="mx-2" v-if="selection.length" @click="performAction('delete', selection)">
                            mdi-delete
                        </v-icon>
                        <v-icon class="mx-2" @click="triggerMultiSelect">mdi-clipboard-check-multiple</v-icon>
                    </v-toolbar>
                    <v-card-text>
                        <v-treeview v-model="selection"
                                    selected-color="teal"
                                    selection-type="independent"
                                    open-on-click
                                    rounded
                                    :selectable="multiSelect"
                                    return-object
                                    hoverable
                                    :items="data"
                        >
                            <template v-slot:append="{ item }">
                                <v-menu v-model="actionMenu[item.name]">
                                    <template v-if="item.children" v-slot:activator="{ on }">
                                        <v-btn icon v-on="on" @click="clickedItem = item">
                                            <v-icon>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-dialog v-model="editDialog[item.id]" persistent scrollable max-width="600">
                                            <template v-slot:activator="{ on }">
                                                <v-list-item v-for="menuItem in menuItems"
                                                             :key="menuItem.title"
                                                             v-on="menuItem.title === 'Edit' ? on : ''"
                                                             @click="performAction(menuItem.title.toLowerCase(), item)"
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
                                                    <v-toolbar-title class="font-weight-bold">{{item.id}}
                                                    </v-toolbar-title>
                                                    <v-spacer/>
                                                    <v-btn icon dark @click="closeDialog()">
                                                        <v-icon>mdi-close</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-card-text>
                                                    <v-container>
                                                        <v-row v-for="field in item.children" :key="field.id">
                                                            <v-col>
                                                                <v-text-field :label="field.id"
                                                                              outlined
                                                                              spellcheck="false"
                                                                              type="text"
                                                                              color="teal darken-4"
                                                                              :value="field.value"
                                                                ></v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </v-container>
                                                </v-card-text>
                                                <v-divider/>
                                                <v-card-actions>
                                                    <v-btn dark color="teal" class="ma-auto" @click="closeDialog()">
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
                actionMenu: {},
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
            performAction(action, selection) {
                console.log(action);
                console.log(selection);
            },
            triggerMultiSelect() {
                this.multiSelect = !this.multiSelect;
                this.multiDelete = this.multiSelect;
                this.selection = [];
            },
            closeDialog() {
                this.$set(this.editDialog, this.clickedItem.id, false);
                this.$set(this.actionMenu, this.clickedItem.name, false);
            }
        }
    };
</script>

<style scoped>

</style>
