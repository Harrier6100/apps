export const permissionActions = {
    'users': {
        label: 'アカウント管理',
        actions: {
            read: 'users:read',
            create: 'users:create',
            update: 'users:update',
            remove: 'users:remove',
        },
    },
    'physprops': {
        label: '物性マスタ',
        actions: {
            read: 'physprops:read',
            create: 'physprops:create',
            update: 'physprops:update',
            remove: 'physprops:remove',
        },
    },
    'physpropSpecs': {
        label: '物性規格マスタ',
        actions: {
            read: 'physpropSpecs:read',
            create: 'physpropSpecs:create',
            update: 'physpropSpecs:update',
            remove: 'physpropSpecs:remove',
        },
    },
};