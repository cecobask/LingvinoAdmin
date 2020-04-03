<template>
    <v-container fluid fill-height class="home">
        <v-row no-gutters>
            <v-col class="display-2 font-weight-bold white--text text-center">
                Manage the following services:
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col v-for="service in services" :key="service" sm="6" md="3">
                <v-card
                    dark
                    hover
                    class="ma-auto my-3 pa-3"
                    width="250"
                    height="400"
                >
                    <v-img :src="service.icon" />
                    <v-divider class="mt-3" />
                    <v-card-title class="justify-center">
                        {{ service.title }}
                    </v-card-title>
                    <v-card-text>
                        {{ service.description }}
                    </v-card-text>
                </v-card>
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
                    description: 'Add new words. Manage existing ones.'
                },
                {
                    title: 'Translator',
                    icon: '/assets/translator.svg',
                    description: 'TBA'
                },
                {
                    title: 'Quiz Game',
                    icon: '/assets/quiz.svg',
                    description:
                        'Add new quiz questions and topics. Manage existing ones.'
                },
                {
                    title: 'User Management',
                    icon: '/assets/user-management.svg',
                    description: 'Revoke user access. Delete users.'
                }
            ]
        };
    }
};
</script>

<style scoped>
.home {
    background-size: cover;
    width: 100%;
    height: 100%;
    background: url('https://globalpartnersinhope.com/wp-content/uploads/2016/11/iStock_93232925_MEDIUM.jpg')
        no-repeat center;
}
</style>
