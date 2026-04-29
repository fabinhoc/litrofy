import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'vehicle/new', component: () => import('pages/VehicleFormPage.vue') },
      { path: 'vehicle/:id/edit', component: () => import('pages/VehicleFormPage.vue') },
      { path: 'vehicle/:id', component: () => import('pages/VehiclePage.vue') },
      { path: 'vehicle/:vehicleId/supply/new', component: () => import('pages/SupplyFormPage.vue') },
      { path: 'vehicle/:vehicleId/supply/:supplyId/edit', component: () => import('pages/SupplyFormPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
