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
        fetchUsers(state: State, users: Array<Form>): void {
            state.users = users.sort((a: Form, b: Form) => a.id - b.id);
        },
        addUser(state: State, user: Form): void {
            state.users.push(user);
        },
        setSelectedUser(state: State, user: Form): void {
            state.selectedUser = user;
        },
        deleteUser(state: State, id: number): void {
            state.users = state.users.filter(user => user.id !== id);
        },
        updateUser(state: State, user: Form): void {
            const index: number = state.users.findIndex(userElement => userElement.id === user.id);
            state.users[index] = user;
            state.users = [...state.users];
        }
    }
});