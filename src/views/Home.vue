<template>
    <v-container fluid fill-height>
        <v-row no-gutters>
            <v-col class="display-2 font-weight-bold white--text text-center">
                Manage the following services:
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col
                v-for="service in services"
                :key="service.route"
                md="6"
                lg="3"
            >
                <v-hover v-slot:default="{ hover }">
                    <v-card
                        dark
                        class="ma-auto my-3 pa-5 card-color"
                        width="300"
                        height="420"
                        :elevation="hover ? 20 : 5"
                        :class="{ 'on-hover': hover }"
                        style="cursor: pointer"
                        :to="service.route"
                    >
                        <v-avatar tile color="teal darken-2" size="260">
                            <img
                                :alt="service.title"
                                :src="service.icon"
                                class="pa-5"
                            />
                        </v-avatar>
                        <v-divider class="mt-3 teal" />
                        <v-card-title class="justify-center font-weight-bold">
                            {{ service.title }}
                        </v-card-title>
                        <v-card-text>
                            {{ service.description }}
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            services: [
                {
                    title: 'Word of the Day',
                    icon: '/assets/wotd.svg',
                    description: 'Add new words. Manage existing ones.',
                    route: '/wotd'
                },
                {
                    title: 'Translator',
                    icon: '/assets/translator.svg',
                    description: 'TBA',
                    route: '/translator'
                },
                {
                    title: 'Quiz Game',
                    icon: '/assets/quiz.svg',
                    description:
                        'Add new quiz questions and topics. Manage existing ones.',
                    route: '/quiz'
                },
                {
                    title: 'User Management',
                    icon: '/assets/user-management.svg',
                    description: 'Revoke user access. Delete users.',
                    route: '/users'
                }
            ]
        };
    }
};
</script>

<style scoped>
.card-color {
    background-color: rgba(38, 50, 56, 0.85) !important;
}
</style>
