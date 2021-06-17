import Vue from 'vue';
import Vuex from 'vuex';
import { Form, State } from '../types/types';
import { comparatorLastName } from '../utils/utils';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        filterUsersByRole: [],
        paginatedUsers: [],
        selectedUser: {},
        users: []
    },
    mutations: {
        fetchUsers(state: State, users: Array<Form>): void {
            state.users = users.sort(comparatorLastName);
            state.filterUsersByRole = [...state.users];
            state.paginatedUsers = state.filterUsersByRole.slice(0,10);
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
            const indexUser: number = state.users.findIndex(userElement => userElement.id === user.id);
            state.users[indexUser] = user;
            state.users = [...state.users];
        },
        filteringRole(state: State, payload: any): void {
            const regex = new RegExp(payload.search.toLowerCase().trim());

            //if selectRole is in 'All', state.filterUsersByRole will copy the state.users' array value
            if(payload.selectRole === '') {
                state.filterUsersByRole = [...state.users];
            } else {

                //Filtering by role
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

            //Filtering filterUsersByRole with search value
            state.filterUsersByRole = state.filterUsersByRole.filter((user: Form) => {
                return (regex.test(user.lastname.toLowerCase())
                    || regex.test(user.firstname.toLowerCase()));
            }).sort(comparatorLastName);

            //for pagination
            const firstIndex: number = (payload.pageNumber * 10) - 10;
            const lastIndex: number = payload.pageNumber * 10;
            state.paginatedUsers = state.filterUsersByRole.slice(firstIndex, lastIndex);
        }
    }
});