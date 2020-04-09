<template>
    <tree-view :data="wotds" @action="performAction" :title="title" :icon="icon"/>
</template>

<script>
    import { mapState } from 'vuex';
    import TreeView from '@/components/TreeView';
    import firebase from '@/firebase';

    export default {
        name: 'WordOfTheDay',
        components: { TreeView },
        computed: mapState(['wotds']),

        data() {
            return {
                title: 'WORD OF THE DAY',
                icon: '$wotd'
            };
        },

        mounted() {
            this.$store.dispatch('fetchWotds');
        },

        methods: {
            performAction({ action, data }) {
                console.log(action);
                switch (action) {
                    case 'update': {
                        for (const child in data.children) {
                            if (Object.prototype.hasOwnProperty.call(data.children, child)) {
                                const obj = data.children[child];
                                const objId = obj.children ? obj.id : obj.id.split('/last')[0];
                                const updatedValue = hasJsonStructure(obj.value) ? JSON.parse(obj.value) : obj.value;
                                firebase.database.ref(`wordOfTheDay/${objId}`)
                                    .set(updatedValue);
                            }
                        }
                    }
                }
            }
        }
    };

    function hasJsonStructure(str) {
        if (typeof str !== 'string') return false;
        try {
            const result = JSON.parse(str);
            const type = Object.prototype.toString.call(result);
            return type === '[object Object]'
                   || type === '[object Array]';
        }
        catch (err) {
            return false;
        }
    }
</script>

<style scoped></style>
