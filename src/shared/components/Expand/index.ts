import type { App } from 'vue';
import ComExpand from '/@/shared/components/Expand/ComExpand.vue';

ComExpand.install = (app: App): void => {
    app.component(ComExpand.name, ComExpand);
};

export default ComExpand;


