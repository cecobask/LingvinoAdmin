<template>
    <tree-view :data="pastWotds" :title="title" :icon="icon"/>
</template>

<script>
    import { mapState } from 'vuex';
    import TreeView from '@/components/TreeView';

    export default {
        name: 'WordOfTheDay',
        components: { TreeView },
        computed: mapState(['pastWotds']),

        data() {
            return {
                title: 'WORD OF THE DAY',
                icon: '$wotd'
            };
        },

        mounted() {
            this.$store.dispatch('fetchWotds');
        }
    };
</script>

<style scoped></style>
