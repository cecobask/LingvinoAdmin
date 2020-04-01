<template>
    <v-container fluid fill-height class="home-hero">
        <v-layout justify-center align-center column pa-5>
            <div class="display-2 font-weight-black white--text text-center">
                Manage application users, words of the day,
                <br />
                translator and quiz game data.
            </div>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'Home'
};
</script>

<style scoped>
.home-hero {
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    background: url('https://globalpartnersinhope.com/wp-content/uploads/2016/11/iStock_93232925_MEDIUM.jpg')
        no-repeat center;
}
</style>
