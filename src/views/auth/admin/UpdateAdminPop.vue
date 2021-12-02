<template>
    <com-form @register="register"></com-form>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useForm} from "/@/shared/components/Form/hooks/useForm";
import {isBoolean, isEmpty} from "/@/shared/utils/is";
import {getDictionaryCodeMapStore} from "/@/service/DictionaryService";
import {createAdmin, updateAdmin} from "/@/service/AdminService";

export default defineComponent({
    name: "UpdateAdminPop",
    props: {
        id: [Number, String],
        updateData: {
            type: Object,
            default: () => ({})
        }
    },
    async setup(props, {emit}) {

        const isCreate = isEmpty(props.id);
        // +----------------------------------------------------------------------
        // | 获取状态
        // +----------------------------------------------------------------------
        const STATE_MAP = await getDictionaryCodeMapStore('STATE');

        // +----------------------------------------------------------------------
        // | 表单
        // +----------------------------------------------------------------------
        const [register, {getFieldsValue, validate}] = useForm({
            size: 'large',
            labelWidth: 80,
            formModel: {...props.updateData},
            schemas: [
                {
                    label: '手机号码',
                    prop: 'mobile',
                    component: 'Input',
                    componentProps: {
                        maxLength: 11
                    }
                },
                {
                    label: '登录密码',
                    prop: 'password',
                    component: 'Input',
                    required: true,
                    componentProps: {
                        type: 'password'
                    }
                },
                {
                    label: '真实姓名',
                    prop: 'real_name',
                    component: 'Input',
                    required: true
                },
                {
                    label: '启用状态',
                    prop: 'state',
                    component: 'Radio',
                    defaultValue: STATE_MAP.VALID.value,
                    componentProps: {
                        type: 'button',
                        optionProp: {
                            label: 'name'
                        },
                        options: Object.values(STATE_MAP)
                    }
                },
                {
                    label: '员工备注',
                    prop: 'remark',
                    component: 'Input',
                    componentProps: {
                        type: 'textarea',
                        resize: 'none'
                    }
                },
                {
                    renderItem: 'button'
                }
            ]
        })

        // +----------------------------------------------------------------------
        // | 确认提交
        // +----------------------------------------------------------------------

        const ok = async () => {
            const validation = await validate();
            if (isBoolean(validation) && validation) {
                const updateData = await getFieldsValue();
                isCreate ? await createAdmin(updateData) : await updateAdmin({...updateData, id: props.id});
                return true;
            }
            return false;
        }
        return {
            register,
            ok
        }

    }
})

</script>