import {createApp} from 'vue'
import App from './App.vue'
import router, {setupRouter} from './router';
import 'virtual:svg-icons-register';

import '/@/assets/style/index.scss';
import {setupElementPlus} from "/@/shared/element-plus";
import {setupCache} from "/@/shared/cache";

const app = createApp(App);

//setup cache
setupCache();
//setup element plus
setupElementPlus(app);
// setup Router
setupRouter(app);

router.isReady().then(() => {
    app.mount('#app');
});
