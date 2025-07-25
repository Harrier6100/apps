export default [
    {
        path: '/physprops',
        name: 'PhyspropList',
        component: () => import('@/views/PhyspropList.vue')
    },
    {
        path: '/physprops/new',
        name: 'PhyspropCreate',
        component: () => import('@/views/PhyspropEdit.vue')
    },
    {
        path: '/physprops/:code',
        name: 'PhyspropUpdate',
        component: () => import('@/views/PhyspropEdit.vue')
    },
];