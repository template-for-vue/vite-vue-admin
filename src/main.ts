import {createApp} from 'vue'
import App from './App.vue'
import router, {setupRouter} from './router';
import 'virtual:svg-icons-register';
import {setupElementPlus} from "/@/shared/element-plus";
import {setupCache} from "/@/shared/cache";
import '/@/assets/style/index.scss';
import {setupDirectives} from "/@/shared/directives";
import {setupErrorHandler} from 'vue-error-recorder';
const app = createApp(App);

//setup cache
setupCache();
//setup element plus
setupElementPlus(app);
// setup Router
setupRouter(app);
// setup directive
setupDirectives(app);
// setup error handler
setupErrorHandler(app);

router.isReady().then(() => {
    app.mount('#app');
});
