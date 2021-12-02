export const userInfo = {
    real_name: "王力宏",
    mobile: "18888888888",
    ticket: "63d53c671b5b1089a81dca8c1955da39"
}

export const menu = [
    {
        id: 1,
        pid: 0,
        rule_title: '权限',
        rule_code: '/auth',
        rule_icon: 'auth',
        rule_type: 1,
        children: [
            {
                id: 2,
                pid: 1,
                rule_code: '/auth/admin',
                rule_title: '员工列表',
                rule_type: 1
            }
        ]
    }
]

export const auth = {
    '/auth': '权限',
    '/auth/admin': '员工列表'
}

export const authRoleOption = [{"id": 1, "role_name": "测试工程师", "state": 1}]

export const dictionary = {
    "STATE": {
        "VALID": {"value": 1, "name": "正常", "status": "success"},
        "INVALID": {"value": 2, "name": "禁用", "status": "info"}
    },
    "JUDGE": {
        "YES": {"value": 1, "name": "是", "status": "warning"},
        "NO": {"value": 2, "name": "否", "status": "info"}
    },
    "AUTH_TYPE": {
        "MENU": {"value": 1, "name": "菜单", "status": "success"},
        "ACTION": {"value": 2, "name": "功能", "status": "primary"}
    },
    "ORDER_STATUS": {
        "WAIT_PAY": {"value": 10, "name": "待支付", "status": "warning"},
        "FINISH": {"value": 20, "name": "已完成", "status": "success"},
        "CANCEL": {"value": 30, "name": "已取消", "status": "info"}
    },
    "BARCODE_ORDER_TYPE": {
        "WX_GROUP_PUBLISH": {"value": 10, "name": "微信群发布"},
        "WX_GROUP_TOP": {"value": 11, "name": "微信群置顶"},
        "WX_GROUP_VIEW": {"value": 12, "name": "微信群查看"},
        "NAME_CARD_PUBLISH": {"value": 20, "name": "名片发布"},
        "NAME_CARD_TOP": {"value": 21, "name": "名片置顶"},
        "NAME_CARD_VIEW": {"value": 22, "name": "名片查看"}
    },
    "VERIFY_STATE": {
        "WAITING": {"value": 1, "name": "待审核", "status": "warning"},
        "PASS": {"value": 2, "name": "已通过", "status": "success"},
        "REJECT": {"value": 3, "name": "已驳回", "status": "info"}
    },
    "LOG_TYPE": {"HANDLE": {"value": 1, "name": "操作日志"}, "LOGIN": {"value": 2, "name": "登陆日志"}}
}

export const adminList = [
    {
        "id": 5,
        "real_name": "容柒",
        "mobile": "17777777777",
        "login_times": 0,
        "remark": "",
        "state": 1,
        "is_supper": 2,
        "roles": [1]
    }, {
        "id": 4,
        "real_name": "林向东",
        "mobile": "18888888888",
        "login_times": 0,
        "remark": "测试",
        "state": 2,
        "is_supper": 2,
        "roles": []
    }, {
        "id": 2,
        "real_name": "胡超林",
        "mobile": "18950333666",
        "login_times": 56,
        "remark": "超级权限",
        "state": 1,
        "is_supper": 1,
        "roles": []
    }, {
        "id": 1,
        "real_name": "王比安",
        "mobile": "13559987987",
        "login_times": 42,
        "remark": "超级权限",
        "state": 1,
        "is_supper": 1,
        "roles": []
    }];