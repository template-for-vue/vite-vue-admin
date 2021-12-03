import {createApp} from 'vue'
import App from './App.vue'
import router, {setupRouter} from './router';
import 'virtual:svg-icons-register';
import {setupElementPlus} from "/@/shared/element-plus";
import {setupCache} from "/@/shared/cache";
import '/@/assets/style/index.scss';

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
