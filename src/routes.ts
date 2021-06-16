import Users from './components/Users.vue';

 export default [
     {path: '/users', component: Users, children: [{path: ':id', component: Users }]}
 ];