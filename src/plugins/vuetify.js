import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import WOTDIcon from '@/components/icons/WOTDIcon';
import TranslatorIcon from '@/components/icons/TranslatorIcon';
import QuizIcon from '@/components/icons/QuizIcon';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        values: {
            wotd: { component: WOTDIcon },
            translator: { component: TranslatorIcon },
            quiz: { component: QuizIcon }
        }
    }
});
