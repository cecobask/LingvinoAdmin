<template>
    <v-container>
        <v-dialog v-model="passwordDialog.visible" max-width="40vw">
            <v-card>
                <v-toolbar dark color="teal darken-3">
                    <v-spacer/>
                    <v-toolbar-title class="font-weight-bold">Choose a new account password</v-toolbar-title>
                    <v-spacer/>
                    <v-btn icon dark @click="resolveDialog('password', false)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="grey lighten-4">
                    <v-container>
                        <v-text-field v-model="passwordDialog.password"
                                      label="New Password*"
                                      required
                                      outlined
                                      spellcheck="false"
                                      type="password"
                                      background-color="white"
                                      color="teal darken-4"
                                      class="mt-3"
                        />
                    </v-container>
                    <small class="mx-3">* indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="teal"
                           class="ma-auto my-3 white--text"
                           :disabled="!passwordDialog.password"
                           @click="resolveDialog('password', true)"
                    >
                        Update
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="userDialog.visible" max-width="45vw">
            <v-card>
                <v-toolbar dark color="teal darken-3">
                    <v-spacer/>
                    <v-toolbar-title class="font-weight-bold">Create a new email / password account</v-toolbar-title>
                    <v-spacer/>
                    <v-btn icon dark @click="resolveDialog('user', false)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="grey lighten-4">
                    <v-container>
                        <v-form ref="userForm" class="mt-3" v-model="userDialog.valid" lazy-validation>
                            <v-text-field
                                    v-model="userDialog.email"
                                    outlined
                                    clearable
                                    :spellcheck="false"
                                    label="Email"
                                    color="teal darken-4"
                                    background-color="white"
                                    prepend-inner-icon="mdi-account-circle"
                                    :rules="userDialog.rules.email"
                            />
                            <v-text-field
                                    v-model="userDialog.password"
                                    outlined
                                    :spellcheck="false"
                                    :type="userDialog.showPassword ? 'text' : 'password'"
                                    label="Password"
                                    color="teal darken-4"
                                    background-color="white"
                                    prepend-inner-icon="mdi-lock"
                                    :append-icon="userDialog.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="userDialog.showPassword = !userDialog.showPassword"
                                    :rules="userDialog.rules.password"
                            />
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="teal"
                           class="ma-auto my-3 white--text"
                           :disabled="!userDialog.valid || !userDialog.password.length || !userDialog.email.length"
                           @click="resolveDialog('user', true)"
                    >
                        Create
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card max-width="90vw" class="my-3 elevation-10">
            <v-toolbar color="blue-grey darken-3" dark flat>
                <v-icon class="mx-2">$userManagement</v-icon>
                <v-toolbar-title>User Management</v-toolbar-title>
                <v-spacer/>
                <v-tooltip top color="success">
                    <template #activator="{ on }">
                        <v-icon class="mx-2" @click="openDialog('user')" v-on="on">
                            mdi-plus-box
                        </v-icon>
                    </template>
                    <span>Add new user</span>
                </v-tooltip>
                <v-tooltip top color="success">
                    <template #activator="{ on }">
                        <v-icon class="mx-2" @click="search.visible = !search.visible" v-on="on">
                            mdi-magnify
                        </v-icon>
                    </template>
                    <span>Search the user database</span>
                </v-tooltip>
            </v-toolbar>
            <v-card-text>
                <v-text-field
                        v-model="search.text"
                        v-if="search.visible"
                        label="Search the user database..."
                        flat
                        solo-inverted
                        hide-details
                        clearable
                        clear-icon="mdi-close-circle-outline"
                        class="mb-3"
                />
                <v-data-table :headers="headers"
                              :items="accounts"
                              :items-per-page="10"
                              :search="search.text"
                >
                    <template v-slot:item.email="{ item }">
                        <span :class="item.disabled ? 'grey--text' : ''">{{item.email}}</span>
                    </template>
                    <template v-slot:item.providerData="{ item }">
                        <v-icon v-for="(icon, index) in providerIcons(item)" :key="index" class="mx-1">{{icon}}</v-icon>
                    </template>
                    <template v-slot:item.metadata.creationTime="{ item }">
                        <span>{{item.metadata.creationTime | formattedDate}}</span>
                    </template>
                    <template v-slot:item.metadata.lastSignInTime="{ item }">
                        <span>{{item.metadata.lastSignInTime | formattedDate}}</span>
                    </template>
                    <template v-slot:item.options="{ item }">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" icon class="">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="openDialog('password', item.uid)">
                                    <v-list-item-title>Update password</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="disableEnableAccount(item)">
                                    <v-list-item-title>
                                        {{item.disabled ? 'Enable account' : 'Disable account'}}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="deleteAccount(item)">
                                    <v-list-item-title>Delete account</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-snackbar v-model="snackbar.visible" multi-line>
            {{ snackbar.text }}
            <v-btn color="pink" text @click="snackbar.visible = false">
                Close
            </v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
    import firebase from '@/firebase';

    export default {
        name: 'UserManagement',
        data() {
            return {
                accounts: [],
                search: {
                    visible: false,
                    text: null
                },
                headers: [
                    {
                        text: 'Email',
                        align: 'start',
                        value: 'email'
                    },
                    {
                        text: 'Auth Providers',
                        value: 'providerData',
                        sortable: false
                    },
                    {
                        text: 'Created',
                        value: 'metadata.creationTime',
                        sort: (a, b) => {
                            return Date.parse(a) - Date.parse(b);
                        }
                    },
                    {
                        text: 'Signed In',
                        value: 'metadata.lastSignInTime',
                        sort: (a, b) => {
                            return Date.parse(a) - Date.parse(b);
                        }
                    },
                    {
                        text: 'User UID',
                        value: 'uid'
                    },
                    {
                        value: 'options',
                        sortable: false,
                        align: 'end'
                    }
                ],
                passwordDialog: {
                    password: '',
                    visible: false,
                    resolve: null,
                    reject: null,
                    uid: ''
                },
                userDialog: {
                    visible: false,
                    valid: false,
                    email: '',
                    password: '',
                    showPassword: false,
                    rules: {
                        email: [
                            v => !!v || 'E-mail is required',
                            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                            v => !this.accounts.some(account => account.email === v) ||
                                 'Account with this email already exists.'
                        ],
                        password: [
                            v => !!v || 'Password is required',
                            v => v.length >= 6 || 'Password must be at least 6 characters long.'
                        ]
                    }
                },
                snackbar: {
                    visible: false,
                    text: ''
                }
            };
        },
        mounted() {
            this.getAllAccounts();
        },
        methods: {
            getAllAccounts() {
                const loader = this.$loading.show();
                const getAllAccounts = firebase.functions.httpsCallable('userManagement');
                getAllAccounts({ action: 'getAllAccounts' })
                    .then(result => {
                        this.accounts = result.data.users;
                        loader.hide();
                    });
            },
            disableEnableAccount(account) {
                const loader = this.$loading.show();
                const updateAccount = firebase.functions.httpsCallable('userManagement');
                updateAccount({
                    action: 'updateAccount',
                    uid: account.uid,
                    updateField: { disabled: !account.disabled }
                })
                    .then(result => {
                        this.accounts = result.data.allUsers.users;
                        this.showSnackbar(
                            `Successfully ${result.data.updatedUser.disabled ? 'disabled' : 'enabled'} the account.`
                        );
                        loader.hide();
                    });
            },
            deleteAccount(account) {
                const loader = this.$loading.show();
                const deleteAccount = firebase.functions.httpsCallable('userManagement');
                deleteAccount({
                    action: 'deleteAccount',
                    uid: account.uid
                })
                    .then(result => {
                        this.accounts = result.data.allUsers.users;
                        this.showSnackbar('Successfully deleted the account.');
                        loader.hide();
                    });
            },
            openDialog(dialogName, uid) {
                switch (dialogName) {
                    case 'password':
                        this.passwordDialog.visible = true;
                        this.passwordDialog.uid = uid;
                        return new Promise((resolve, reject) => {
                            this.passwordDialog.resolve = resolve;
                            this.passwordDialog.reject = reject;
                        });
                    case 'user':
                        this.userDialog.visible = true;

                }
            },
            resolveDialog(dialogName, result) {
                switch (dialogName) {
                    case 'password':
                        this.passwordDialog.resolve(result);
                        this.passwordDialog.visible = false;
                        this.passwordDialog.password = '';
                        if (result) this.updateAccountPassword(this.passwordDialog.uid);
                        break;
                    case 'user':
                        this.userDialog.visible = false;
                        if (result) this.createAccount(this.userDialog.email, this.userDialog.password);
                        else this.clearForm();
                }
            },
            updateAccountPassword(uid) {
                const loader = this.$loading.show();
                const updateAccount = firebase.functions.httpsCallable('userManagement');
                updateAccount({
                    action: 'updateAccount',
                    uid: uid,
                    updateField: { password: this.passwordDialog.password }
                })
                    .then(result => {
                        this.accounts = result.data.allUsers.users;
                        this.showSnackbar('Successfully updated the account\'s password.');
                        loader.hide();
                    });
            },
            providerIcons(user) {
                return user.providerData.map(provider => {
                    switch (provider.providerId) {
                        case 'google.com':
                            return '$google';
                        case 'facebook.com':
                            return '$facebook';
                        default:
                            return '$email';
                    }
                });
            },
            showSnackbar(text) {
                this.snackbar.visible = true;
                this.snackbar.text = text;
            },
            clearForm() {
                this.userDialog.email = '';
                this.userDialog.password = '';
                this.$refs.userForm.resetValidation();
            },
            validate() {
                return this.$refs.userForm.validate();
            },
            createAccount(email, password) {
                if (this.validate()) {
                    const loader = this.$loading.show();
                    const createAccount = firebase.functions.httpsCallable('userManagement');
                    createAccount({
                        action: 'createAccount',
                        userObject: {
                            email: email,
                            password: password
                        }
                    })
                        .then(result => {
                            this.accounts = result.data.allUsers.users;
                            this.showSnackbar('Successfully created user account.');
                            this.clearForm();
                            loader.hide();
                        });
                }
            }
        },
        filters: {
            formattedDate: function(dateString) {
                const date = new Date(Date.parse(dateString));
                const day = date.getDate()
                                .toString().length === 1 ? '0' + date.getDate() : date.getDate();
                const month = date.getMonth()
                                  .toString().length === 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
                const year = date.getFullYear();
                const hours = date.getHours()
                                  .toString().length === 1 ? '0' + date.getHours() : date.getHours();
                const minutes = date.getMinutes()
                                    .toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes();
                const seconds = date.getSeconds()
                                    .toString().length === 1 ? '0' + date.getSeconds() : date.getSeconds();

                if (dateString) return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} GMT`;
            }
        }
    };
</script>

<style scoped>

</style>
