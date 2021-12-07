<template>
    <div>
        <com-description @register="register">
            <template #emailLabelSlot>自定义email标题</template>
            <template #emailContentSlot>自定义email内容</template>
            <template #extra>
                <el-button type="primary">状态设置</el-button>
            </template>
        </com-description>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Page} from "/@/router/page";
import {useDescription} from "/@/shared/components/Description/hooks/useDescription";

export default defineComponent({
    name: Page.DASHBOARD_WELCOME,
    async setup() {

        const schema = [
            {
                prop: 'username',
                label: '用户名'
            },
            {
                prop: 'nickname',
                label: '昵称',
            },
            {
                prop: 'mobile',
                label: '联系电话',
                format(data) {
                    return `086-${data['mobile']}`
                }
            },
            {
                prop: 'email',
                label: '邮箱',
                renderLabel: 'emailLabelSlot',
                renderContent: 'emailContentSlot'
            },
            {
                prop: 'address',
                label: '地址'
            }
        ];
        const dataSource = {
            username: 'test',
            nickname: '昵称特别的长的情况',
            age: '123',
            mobile: '18950386766',
            email: '190848757@qq.com',
            address: '厦门市思明区',
            sex: '男',
            tag: 'orange',
        }
        const [register] = useDescription({
            title:'用户信息',
            schema,
            dataSource
        })

        return {
            register
        }
    }
})

</script>
