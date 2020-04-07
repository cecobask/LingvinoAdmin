<template>
    <v-container fluid>
        <v-row>
            <v-card width="400" class="ma-auto my-3 pa-3 card-color">
                <v-card-title class="justify-center mb-5">
                    <h1>Authenticate</h1>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field
                                v-model="email"
                                outlined
                                clearable
                                spellcheck="false"
                                label="Email"
                                color="teal darken-4"
                                background-color="grey lighten-5"
                                prepend-inner-icon="mdi-account-circle"
                                :rules="rules.email"
                        />
                        <v-text-field
                                v-model="password"
                                outlined
                                spellcheck="false"
                                :type="showPassword ? 'text' : 'password'"
                                label="Password"
                                color="teal darken-4"
                                background-color="grey lighten-5"
                                prepend-inner-icon="mdi-lock"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="showPassword = !showPassword"
                                :rules="rules.password"
                        />
                    </v-form>
                    <p class="red--text" v-if="authError">
                        {{ authError }}
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-btn
                            large
                            elevation="5"
                            class="teal darken-3 ma-auto white--text"
                            :disabled="!valid"
                            @click="login"
                    >
                        Log in
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'LogIn',
        data() {
            return {
                showPassword: false,
                email: '',
                password: '',
                valid: false,
                rules: {
                    email: [
                        v => !!v || 'E-mail is required',
                        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
                    ],
                    password: [v => !!v || 'Password is Required']
                }
            };
        },

        methods: {
            validate() {
                return this.$refs.form.validate();
            },
            clearForm() {
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
            },
            login() {
                if (this.validate()) {
                    this.$store.dispatch('loginAction', {
                        email: this.email,
                        password: this.password
                    });
                    this.$root.$emit('authenticated', false);
                    this.clearForm();
                }
            }
        },

        computed: mapState(['authError'])
    };
</script>

<style scoped>
    .card-color {
        background-color: rgba(224, 247, 250, 0.85) !important;
    }
</style>
