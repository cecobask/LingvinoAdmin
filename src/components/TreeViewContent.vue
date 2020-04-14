<template>
    <div>
        <v-dialog v-model="jsonDialog[item.id]" scrollable max-width="70vw">
            <v-card>
                <v-toolbar dark color="teal darken-3">
                    <v-spacer/>
                    <v-toolbar-title class="font-weight-bold">{{jsonDialog[`${item.id}.key`]}}
                    </v-toolbar-title>
                    <v-spacer/>
                    <v-btn icon dark @click="triggerJsonDialog(false)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="white pb-0 pt-5">
                    <json-editor
                            v-if="jsonDialog[`${item.id}.value`]"
                            :obj-data="jsonDialog[`${item.id}.value`]"
                            v-model="jsonDialog[`${item.id}.value`]"
                            :options="{ confirmText: 'CONFIRM', cancelText: 'CANCEL' }"
                            class="fill-height ma-5"
                    />
                </v-card-text>
                <v-divider/>
                <v-card-actions class="grey lighten-3">
                    <v-btn dark color="teal" class="ma-auto" @click="performAction('updateRecords', jsonDialog)">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-menu v-model="actionMenu[item.id]">
            <template v-slot:activator="{ on }">
                <v-btn v-if="!item.id.endsWith('/last')" icon v-on="on" @click="clickedItem = item">
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
                            <v-btn icon dark @click="closeDialogs">
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
                                                  @click:append="triggerJsonDialog(true, field)"
                                                  v-model="clickedItem.children[index].value"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider/>
                        <v-card-actions>
                            <v-btn dark color="teal"
                                   class="ma-auto my-3"
                                   @click="performAction('updateRecords', clickedItem)"
                            >
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-list>
        </v-menu>
    </div>
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
                jsonDialog: {},
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
            performAction(action, data) {
                if (data[`${this.clickedItem.id}.key`]) {
                    this.$emit('crud', {
                        action: action,
                        data: {
                            key: data[`${this.clickedItem.id}.key`],
                            value: data[`${this.clickedItem.id}.value`]
                        }
                    });
                    this.triggerJsonDialog(false)
                } else {
                    this.$emit('crud', {
                        action: action,
                        data: data
                    });
                }
                this.closeDialogs();
            },
            triggerJsonDialog(boolean, jsonData) {
                this.closeDialogs();
                this.$set(this.jsonDialog, this.clickedItem.id, boolean);
                this.$set(this.jsonDialog, `${this.clickedItem.id}.key`,
                    jsonData ? `${this.clickedItem.id}/${jsonData.name}` : null);
                this.$set(this.jsonDialog, `${this.clickedItem.id}.value`,
                    jsonData ? JSON.parse(jsonData.value) : null);
            },
            closeDialogs() {
                this.$set(this.editDialog, this.clickedItem.id, false);
                this.$set(this.actionMenu, this.clickedItem.id, false);
            }
        }
    };
</script>

<style scoped>

</style>
