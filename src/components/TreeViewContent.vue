<template>
            <v-menu v-model="actionMenu[item.id]">
                <template v-slot:activator="{ on }">
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
                                         @click="menuItem.title === 'Delete' ? performAction('deleteRecords', item) : ''"
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
                                <v-btn icon dark @click="closeDialog">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-card-text class="grey lighten-4 pb-0 pt-5">
                                    <v-row v-for="(field, index) in item.children" :key="field.id">
                                        <v-col>
                                            <v-text-field v-once
                                                          :label="field.name === field.value ? 'value' : field.name"
                                                          outlined
                                                          :spellcheck="false"
                                                          type="text"
                                                          color="teal darken-4"
                                                          background-color="white"
                                                          :append-icon="field.json ? 'mdi-code-json' : null"
                                                          @click:append="performAction('jsonEdit', field.value)"
                                                          v-model="clickedItem.children[index].value"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                            </v-card-text>
                            <v-divider/>
                            <v-card-actions>
                                <v-btn dark color="teal"
                                       class="ma-auto"
                                       @click="performAction('updateRecords', clickedItem)"
                                >
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-list>
            </v-menu>
</template>

<script>
    export default {
        name: 'TreeViewContent',
        props: ['item'],
        data() {
            return {
                clickedItem: null,
                actionMenu: {},
                editDialog: {},
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
            }
        },

        methods: {
            performAction(action, data) {
                this.$emit('crud', { action: action, data: data });
                this.closeDialog();
            },
            closeDialog() {
                this.$set(this.editDialog, this.clickedItem.id, false);
                this.$set(this.actionMenu, this.clickedItem.id, false);
            }
        }
    };
</script>

<style scoped>

</style>
