<template>
    <div class="page-login">
        <div class="login-section login-left">
            <div class="login-logo -enter-x">
                <span class="login-logo__text">TKE ADMIN</span>
            </div>
            <div class="login-notice">
                <img class="login-notice__image -enter-x" src="../../assets/image/login-box-bg.svg" alt="background">
                <p class="login-notice__text-1 -enter-x">后台管理系统</p>
                <p class="login-notice__text-2 -enter-x">欢迎您的使用!</p>
            </div>
        </div>
        <div class="login-section login-right">
            <div class="login-form login-password" v-show="loginType === loginTypeEnum.ACCOUNT">
                <com-form @register="register">
                    <template #header>
                        <h3 class="login-form-title enter-x">账号登陆</h3>
                    </template>
                    <template #codeRender>
                        <div class="login-code" :style="`background:url(${captcha})`" @click.stop="getCaptcha"></div>
                    </template>
                    <template #buttons>
                        <el-button class="login-button" type="primary" @click.stop="handleLogin">登 陆</el-button>
                    </template>
                </com-form>
                <div class="enter-x">
                    <el-divider>其他登录方式</el-divider>
                    <ul class="login-other-list">
                        <li class="login-other-item" @click.stop="handleLoginTypeChange(loginTypeEnum.BARCODE)">
                            <com-icon name="work-wx" size="36"></com-icon>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="login-form login-barcode" v-show="loginType === loginTypeEnum.BARCODE">
                <h3 class="login-form-title enter-x">扫码登录</h3>
                <div class="login-barcode__image enter-x" id="wxLoginBarcode"></div>
                <el-button class="login-button login-button__barcode enter-x" size="large"
                           @click.stop="handleLoginTypeChange(loginTypeEnum.ACCOUNT)">返 回
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, ref} from 'vue';
import {useForm} from "/@/shared/components/Form/hooks/useForm";
import {FormSchema} from "/@/shared/components/Form/types/form";
import {useWxLogin} from "/@/shared/hooks/web/useWxLogin";
import {useRouter} from "/@/shared/hooks/web/useRouter";
import {loginBarcodeStyle} from "/@/views/login/loginBarcodeStyle";
import {isBoolean} from "/@/shared/utils/is";
import {Page} from "/@/router/page";
import {captchaApi} from "/@/api/LoginApi";
import {login} from "/@/service/LoginService";

export default defineComponent({
    name: "Login",
    setup() {

        // +----------------------------------------------------------------------
        // | 获取验证码
        // +----------------------------------------------------------------------
        let captchaSn = '';
        const captcha = ref('');
        const getCaptcha = async () => {
            const {image, sn} = await captchaApi();
            captchaSn = sn;
            captcha.value = image;
        }

        onBeforeMount(async () => {
            await getCaptcha();
        });

        // +----------------------------------------------------------------------
        // | 登录类型
        // +----------------------------------------------------------------------

        enum loginTypeEnum {
            ACCOUNT = 1,
            BARCODE = 2
        }

        const loginType = ref(loginTypeEnum.ACCOUNT);
        const {createBarcode} = useWxLogin();
        const {getOrigin, getRedirect, navigateTo} = useRouter();
        const handleLoginTypeChange = (type) => {
            if (type === loginTypeEnum.BARCODE) {
                createBarcode({
                    id: 'wxLoginBarcode',
                    redirect_uri: window.encodeURIComponent(getOrigin()),
                    state: 'WX_WORK_LOGIN',
                    href: loginBarcodeStyle
                })
            }
            loginType.value = type;
        }

        // +----------------------------------------------------------------------
        // | 登录表单
        // +----------------------------------------------------------------------

        const schemas: FormSchema[] = [
            {
                prop: 'mobile',
                component: "Input",
                placeholder: '请输入手机号码',
                rules: [{required: true, message: '手机号码不能为空'}],
                componentProps: {
                    maxLength: 11
                }
            },
            {
                prop: 'password',
                component: "Input",
                placeholder: "请输入密码",
                rules: [{required: true, message: '密码不能为空'}],
                componentProps: {
                    type: 'password'
                }
            },
            {
                prop: 'code',
                component: "Input",
                placeholder: "请输入验证码",
                rules: [{required: true, message: '验证码不能为空'}],
                appendRender: 'codeRender'
            },
            {
                renderItem: 'buttons'
            }
        ];
        const [register, {getFieldsValue, validate}] = useForm({
            colProps: {
                class: "enter-x"
            },
            size: 'large',
            schemas
        });
        const handleLogin = async () => {
            try {
                const validation = await validate();
                if (isBoolean(validation) && validation) {
                    const loginData = await getFieldsValue();
                    await login({...loginData, sn: captchaSn});
                    return navigateTo(getRedirect() || Page.DASHBOARD_WELCOME);
                }
            } finally {
                await getCaptcha();
            }
        }

        return {
            register,
            loginType,
            loginTypeEnum,
            handleLoginTypeChange,
            handleLogin,
            getCaptcha,
            captcha
        }
    }
})

</script>

<style lang="scss" scoped>
.page-login {
    display: flex;
    padding: 8px 68px;
    height: 100vh;
    background: var(--color-white);

    .login-code {
        width: 102px;
        height: 36px;
        background: #000 no-repeat center center;
        background-size: cover;
        cursor: pointer;
    }
}

.page-login:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-left: -43%;
    background-image: url("../../assets/image/login-bg.svg");
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: auto 100%;
}

.login-section {
    display: flex;
    width: 50%;
}

.login-left {
    height: 100%;
    margin-right: 16px;
}

.login-logo {
    display: flex;
    align-items: center;
    position: absolute;
    top: 12px;
    padding-left: 8px;
    height: 80px;
    width: 60%;
}

.login-logo-image {
    width: 48px;
}

.login-logo__text {
    margin-left: 8px;
    font-size: 24px;
    color: var(--color-white);
    font-weight: 700;
    transition: all .5s;
}

.login-notice {
    position: relative;
    margin-top: auto;
    margin-bottom: auto;
    color: var(--color-white);
}

.login-notice__image {
    width: 360px;
    margin-top: -64px;
}

.login-notice__text-1 {
    margin-top: 52px;
    font-size: 30px;
    line-height: 36px;
}

.login-notice__text-2 {
    margin-top: 20px;
}

.login-right {
    height: auto;
    justify-content: center;
}

.login-form-title {
    padding-left: 12px;
    font-size: 30px;
    margin-bottom: 22px;
    color: rgba(0, 0, 0, .65);
}

.login-form {
    width: 420px;
    padding-bottom: 20px;
    border-radius: 4px;
    margin-top: auto;
    margin-bottom: auto;
}

.login-barcode {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 280px;

    .login-form-title {
        padding-left: 0;
        margin-bottom: 22px;
    }
}

.login-barcode__image {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 280px;
    height: 280px;
    background: #fff url("../../assets/image/loading.gif") no-repeat center -20px;
    background-size: cover;

    iframe {
        position: absolute;
        top: 0;
        height: 310px;
    }
}

.login-barcode__notice {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 16px 0;
    text-align: center;

    &:before {
        content: '';
        position: relative;
        top: 50%;
        width: 38px;
        border-top: 1px solid #f0f0f0;
        transform: translateY(50%);
    }

    &:after {
        position: relative;
        top: 50%;
        width: 38px;
        border-top: 1px solid #f0f0f0;
        transform: translateY(50%);
        content: '';
    }

    span {
        padding: 0 12px;
        font-size: 12px;
        color: rgba(0, 0, 0, .45);
    }
}

.login-button__barcode {
    margin-top: 30px;
}

.login-button {
    width: 100%;

    span {
        font-size: 16px;
    }
}

.login-other-list {
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-other-item {
    cursor: pointer;
}

@media (max-width: 1200px) {
    .page-login {
        padding: 0;
        background: linear-gradient(180deg, #1c3faa, #1c3faa);
    }
    .page-login:before {
        display: none;
    }
    .login-left {
        display: none;
    }
    .login-right {
        width: 100%;
        padding: 0 14px;
    }
    .login-form {
        width: 420px;
        padding: 32px 32px 20px;
        background: #fff;
    }
    .login-form-title {
        text-align: center;
    }
}

</style>