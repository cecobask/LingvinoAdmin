<template>
    <v-container fluid>
        <v-row>
            <v-card width="400" class="ma-auto my-3 pa-3 card-color">
                <v-card-title class="justify-center mb-5">
                    <h1>Authenticate</h1>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                            outlined
                            clearable
                            label="Email"
                            color="teal darken-4"
                            prepend-inner-icon="mdi-account-circle"
                        />
                        <v-text-field
                            outlined
                            :type="showPassword ? 'text' : 'password'"
                            label="Password"
                            color="teal darken-4"
                            prepend-inner-icon="mdi-lock"
                            :append-icon="
                                showPassword ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            @click:append="showPassword = !showPassword"
                        />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        large
                        elevation="5"
                        class="teal darken-3 ma-auto white--text"
                    >
                        Log in
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'LogIn',
    data() {
        return {
            showPassword: false
        };
    }
};
</script>

<style scoped>
.card-color {
    background-color: rgba(224, 247, 250, 0.85) !important;
}
</style>
