import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        selectedUser: {},
        users: [],
        filteredUsers: []
    },
    mutations: {
        fetchUsers(state, users) {
            state.users = users.sort((a, b) => a.id - b.id);
        },
        addUser(state, user) {
            state.users.push(user);
        },
        setSelectedUser(state, user) {
            state.selectedUser = user;
        },
        deleteUser(state, id) {
            state.users = state.users.filter(user => user.id !== id);
        },
        updateUser(state, user) {
            const index = state.users.findIndex(userElement => userElement.id === user.id);
            state.users[index] = user;
            state.users = [...state.users];
        }
    }
});