import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store';
import VueApollo from "vue-apollo";
import VueRouter from 'vue-router';
import Routes from './routes';

import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: Routes,
  //mode 'history' for reloading when the route parameter id changes
  mode: 'history'
});

const link = new HttpLink({
  uri: 'https://becoming-mako-95.hasura.app/v1/graphql',
  fetch,
  headers: {
    'x-hasura-admin-secret': 'vqCPGz3kvKZrzscfNDa43qs4I5GlAyB7CVWgk5k7iZgUbH3yi36MHZlJXjAidF8T'
  }
});
// @ts-ignore
const client = new ApolloClient({
  link: link,
  // fetchOptions: {
  //   mode: 'no-cors',
  // },
  cache: new InMemoryCache({
    addTypename: true
  })
});

const apolloProvider = new VueApollo({
  defaultClient: client,
})

Vue.use(VueApollo);

Vue.config.productionTip = false

export const bus = new Vue();

new Vue({
  apolloProvider,
  store: store,
  render: h => h(App),
  router: router
}).$mount('#app')
