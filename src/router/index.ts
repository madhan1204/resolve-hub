import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import Start from '../views/Start.vue';
import About from '../views/About.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import AdminTabsPage from '../views/AdminTabsPage.vue';
// import AdminPage from '../views/AdminPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Start },
  { path: '/about', component: About },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      { path: '', redirect: '/tabs/home' },
      { path: 'home', component: () => import('@/views/HomePage.vue') },
      { path: 'citizens', component: () => import('@/views/CitizensPage.vue') },
      { path: 'profile', component: () => import('@/views/ProfilePage.vue') }
    ]
  },
  {
    path: '/tab/',
    component: AdminTabsPage,
    children: [
      { path: '', redirect: '/tab/adminhome' },
      { path: 'adminhome', component: () => import('../views/AdminPage.vue') },
      { path: 'adcitizens', component: () => import('../views/AdCitizensPage.vue') },
      { path: 'adprofile', component: () => import('../views/AdProfilePage.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router;
