import Vue from 'vue';
import Vuex from 'vuex';
import { Form, State } from '../types/types';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        selectedUser: {},
        users: []
    },
    mutations: {
        fetchUsers(state: State, users: Array<Form>) {
            state.users = users.sort((a: Form, b: Form) => a.id - b.id);
        },
        addUser(state: State, user: Form) {
            state.users.push(user);
        },
        setSelectedUser(state: State, user: Form) {
            state.selectedUser = user;
        },
        deleteUser(state: State, id: number) {
            state.users = state.users.filter(user => user.id !== id);
        },
        updateUser(state: State, user: Form) {
            const index = state.users.findIndex(userElement => userElement.id === user.id);
            state.users[index] = user;
            state.users = [...state.users];
        }
    }
});