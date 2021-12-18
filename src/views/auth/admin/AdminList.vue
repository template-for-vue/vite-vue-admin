<template>
    <div class="page-admin-list">
        <com-table @register="register">
            <template #button>
                <el-button type="primary" @click="handleUpdatePop({})">新增员工</el-button>
            </template>
        </com-table>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useTable} from "/@/shared/components/Table/hooks/useTable";
import {FormProps} from "/@/shared/components/Form/types/form";
import {getDictionaryValueMapStore, getDictionaryValueStore} from "/@/service/DictionaryService";
import {selectAdminInfoApi, selectAdminPageApi, updateAdminForDeleteApi} from "/@/api/AdminApi";
import {selectAuthRoleOptionApi} from "/@/api/AuthRoleApi";
import {Page} from "/@/router/page";
import {listToMap} from "/@/shared/components/Table/utils/array";
import {TableCol, TableProps} from "/@/shared/components/Table/types/table";
import {isNotEmpty} from "/@/shared/utils/is";
import {useDialog} from "/@/shared/components/hook/dialog/useDialog";
import UpdateAdminPop from "/@/views/auth/admin/UpdateAdminPop.vue";

export default defineComponent({
    name: Page.AUTH_ADMIN_LIST,
    async setup() {
        // +----------------------------------------------------------------------
        // | 获取常量
        // +----------------------------------------------------------------------
        const STATE_MAP = await getDictionaryValueMapStore('STATE');
        const STATE_MAP_INVALID_VALUE = await getDictionaryValueStore('STATE', 'INVALID');
        // +----------------------------------------------------------------------
        // | 获取数据
        // +----------------------------------------------------------------------
        const [roleList, dataSource] = await Promise.all([
            selectAuthRoleOptionApi(),
            selectAdminPageApi({})
        ]);
        const roleListMap = listToMap(roleList, 'id');

        // +----------------------------------------------------------------------
        // | 表单属性
        // +----------------------------------------------------------------------
        const form: FormProps = {
            schemas: [
                {
                    prop: 'state',
                    component: 'Select',
                    placeholder: '状态',
                    componentProps: {
                        optionProp: {
                            label: 'name'
                        },
                        options: [
                            {name: '状态不限', value: ''},
                            ...Object.values(STATE_MAP)
                        ]
                    }
                },
                {
                    prop: 'role_id',
                    component: 'Select',
                    placeholder: '角色',
                    componentProps: {
                        optionProp: {
                            label: 'role_name',
                            value: 'id'
                        },
                        options: [
                            {id: '', role_name: '角色不限'},
                            ...roleList
                        ]
                    }
                },
                {
                    prop: 'value',
                    component: 'Input',
                    placeholder: '手机号码 / 真实姓名',
                    componentProps: {
                        clearable: true
                    }
                },
                {
                    prop: 'keyword',
                    defaultValue: 'mobile,real_name',
                    hidden: true
                }
            ]
        }

        // +----------------------------------------------------------------------
        // | TABLE属性
        // +----------------------------------------------------------------------
        const columns: TableCol[] = [
            {
                label: '序号',
                type: 'index'
            },
            {
                label: '手机号码',
                prop: 'mobile'
            },
            {
                label: '姓名',
                prop: 'real_name'
            },
            {
                label: '角色',
                prop: 'role',
                format: ({roles}) => {
                    return roles?.map((role_id: any) => {
                        return roleListMap[role_id].role_name
                    })?.join('/');
                }
            },
            {
                label: '状态',
                prop: 'state',
                type: 'tag',
                statusMap: STATE_MAP
            },
            {
                label: '登陆次数',
                prop: 'login_times'
            },
            {
                label: '操作',
                type: 'button',
                buttons: [
                    {
                        text: '编辑',
                        click: async ({id}) => {
                            await handleUpdatePop({id})
                        }
                    },
                    {
                        text: '删除',
                        pop: true,
                        vif: ({state}) => state == STATE_MAP_INVALID_VALUE,
                        click: async ({id}) => {
                            await updateAdminForDeleteApi({id});
                            await handleReset();
                        }
                    }
                ]
            },
        ]
        const header = {title: '员工列表'}
        const tableProps: TableProps = {header, form, columns, dataSource}
        tableProps.vColumnAuth = ['mobile', 'real_name', 'state', 'role', 'login_times']
        tableProps.vButtonAuth = []
        const [register, {handleReset}] = useTable(tableProps, selectAdminPageApi);

        const {createDialog} = useDialog();
        const Dialog = createDialog(UpdateAdminPop);
        const handleUpdatePop = async ({id}: any) => {
            const isEdit = isNotEmpty(id);
            const updateData = isEdit ? await selectAdminInfoApi({id}) : {};
            const title = isEdit ? '编辑管理员' : '新增管理员';
            await Dialog
                .setAttrs({title})
                .setProps({id, updateData})
                .setOk(async () => {
                    await handleReset();
                    return true;
                })
                .open();
        }

        return {
            register,
            handleUpdatePop
        }
    }
})

</script>

