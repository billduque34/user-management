import Vue from 'vue';
import Vuex from 'vuex';
import { Form, State } from '../types/types';

Vue.use(Vuex);

// @ts-ignore
// @ts-ignore
// @ts-ignore
export const store = new Vuex.Store({
    state: {
        selectedUser: {},
        filterUsersByRole: [],
        filterUsersWithSearch: [],
        users: []
    },
    mutations: {
        fetchUsers(state: State, users: Array<Form>): void {
            state.users = users.sort((a: Form, b: Form) => a.id - b.id);
            state.filterUsersByRole = [...state.users];
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
        },
        filteringRole(state: State, payload: any): void {
            const regex = new RegExp(payload.search.toLowerCase());

            if(payload.selectRole === '') {
                state.filterUsersByRole = [...state.users];
            } else {
                state.filterUsersByRole = state.users.filter(user => {
                    let isIncluded: boolean = false;
                    for(let i=0; i<=user.user_roles.length-1; i++) {
                        if(user.user_roles[i].role.name === payload.selectRole) {
                            isIncluded = true;
                            break;
                        }
                    }
                    return isIncluded;
                });
            }

            state.filterUsersByRole = state.filterUsersByRole.filter((user: Form) => {
                return (regex.test(user.lastname.toLowerCase())
                    || regex.test(user.firstname.toLowerCase()));
            });
        }
    }
});