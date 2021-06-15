<template>
  <div class="Users">
    <div class="user-name-add">
      <p>Users</p>
      <button @click="addUser">Add</button>
    </div>
    <div class="user-list">
      <div class="role-list">
        <label for="filter-role">Role</label>
        <select id="filter-role" v-model="filterRole">
          <option value="">All</option>
          <option  value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Administrator">Administrator</option>
          <option value="Participant">Participant</option>
        </select>
      </div>
      <input type="search" placeholder="Search" v-model="search"/>
      <div>
        <div class="users">

<!--          display the list of users which has click function-->
          <div v-for="user in users" v-bind:key="user.id" class="user-name">
            <p @click="userClick(user)">{{`${user.lastname}, ${user.firstname}`}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Form } from '../types/types';
import { bus } from '@/main';
import { mapState } from 'vuex';
import gql from 'graphql-tag'
import Vue from 'vue';

export default Vue.extend({
  name: "Users",
  data() {
    return {
      filterRole: '',
      search: ''
    }
  },
  methods: {
    userClick(user: Form): void {
      //the chosen user from users list will be stored to the state.selectedUser to fill the form
      this.$store.commit('setSelectedUser', user);
    },
    addUser(): void {
      //a callback function will run which has a 'addUserClicked' event name from Form.vue
      bus.$emit('addUserClicked');
    }
  },

  //rerenders when users' value changes
  computed: {
    ...mapState(['users'])
  },

  //fetch the list of users from the user table when the component is mounted or search or filterRole's value changes
  apollo: {
    user: {
        query() {
          return gql`query filterList ($search: String!, $role: String!){
                 user(where: {user_roles: {role: {name: {_iregex: $role}}}, _or: [{firstname: {_iregex: $search}},{lastname: {_iregex: $search}}]}) {
                  lastname
                  firstname
                  middlename
                  birthdate
                  nickname
                  email
                  active
                  id
                  user_roles {
                    role {
                      id
                      name
                    }
                  }
          }
        }`
        },
        variables() {
          return {
            search: this.search,
            role: this.filterRole
          }
        },
        update(data) {
          //fetched data(list of users) will be stored in the state.users from store
          this.$store.commit('fetchUsers', data.user);
        }
      }
  }
});
</script>

<style scoped>
  * {
    font-size: 18px;
  }

  .Users, .user-list {
    display: flex;
    flex-direction: column;
  }

  .Users {
    background-color: #a2ccee;
    padding: 5px 20px 20px 20px;
    border-radius: 10px;
    border: 2px solid black;
    width: 80%;
    max-height: 740px;
  }

  .user-name-add > button {
    margin-left: 10px;
    padding: 10px 15px;
    font-size: 15px;
    border-radius: 7px;
    font-weight: bold;
    background-color: #019c01;
    color: white;
    border: 3px solid darkgreen;
  }

  .user-name-add, .role-list {
    display: flex;
    justify-content: space-between;
  }

  .user-name-add > p {
    font-size: 30px;
    font-weight: bold;
  }

  .user-name-add {
    margin-bottom: 20px;
  }

  .role-list {
    margin-bottom: 20px;
    align-items: center;
  }

  .role-list > select {
    width: 90%;
    height: 40px;
  }

  .user-name-add {
    width: 100%;
    align-items: center;
  }

  .user-name-add > button {
    padding: 10px 30px;
    font-size: 15px;
  }

  input[type='search'] {
    margin-bottom: 20px;
    height: 40px;
    padding-left: 10px;
  }

  .users {
    box-sizing: border-box;
    background-color: #f8f4ea;
    width: 100%;
    height: 500px;
    margin: 0 auto;
    border: 2px solid black;
    overflow-y: auto;
  }

  .user-name {
    text-align: center;
    padding: 10px 0;
    border-bottom: 1px solid black;
    background-color: #f8e5a9;
  }
</style>