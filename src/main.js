import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store';
import VueApollo from "vue-apollo";

import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const link = new HttpLink({
  uri: 'https://becoming-mako-95.hasura.app/v1/graphql',
  fetch,
  headers: {
    'x-hasura-admin-secret': 'vqCPGz3kvKZrzscfNDa43qs4I5GlAyB7CVWgk5k7iZgUbH3yi36MHZlJXjAidF8T'
  }
});
const client = new ApolloClient({
  link: link,
  fetchOptions: {
    mode: 'no-cors',
  },
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
}).$mount('#app')
