export const routeMenus = {
    'top': [
        {
            label: '管理',
            subMenu: 'menu#1',
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
};