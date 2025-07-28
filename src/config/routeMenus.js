export const routeMenus = {
    'top': [
        {
            label: '管理',
            subMenu: 'menu#1',
        },
        {
            label: '品質',
            subMenu: 'menu#3',
        },
    ],
    'menu#1': [
        {
            label: 'アカウント管理',
            to: '/users',
            requiresAuth: true,
            roles: ['admin'],
            permissions: [''],
            showInMenu: true,
        },
    ],
    'menu#3': [
        {
            label: '物性マスタ',
            to: '/physprops',
            requiresAuth: true,
            roles: ['admin'],
            permissions: ['physprops:read'],
            showInMenu: true,
        },
    ],
};