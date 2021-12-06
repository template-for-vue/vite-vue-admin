<template>
    <div>
        welcome
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Page} from "/@/router/page";

export default defineComponent({
    name: Page.DASHBOARD_WELCOME,
    async setup() {
        return {}
    }
})

</script>
