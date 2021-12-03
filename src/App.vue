<template>
    <el-config-provider :locale="locale" :button="button">
        <router-view></router-view>
    </el-config-provider>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ElConfigProvider} from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';

export default defineComponent({
    components: {ElConfigProvider},
    setup() {
        return {
            locale: zhCn,
            button: {autoInsertSpace: false}
        }
    }
})

</script>
