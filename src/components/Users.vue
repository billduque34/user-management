<template>
  <div class="Users">
    <div class="user-name-add">
      <p>Users</p>
      <router-link to="/">
        <button @click="addUser">Add</button>
      </router-link>
    </div>
    <div class="user-list">
      <div class="role-list">
        <label for="filter-role">Role</label>
        <select id="filter-role" v-model="selectRole">
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
          <div v-for="user in paginatedUsers" v-bind:key="user.id" class="user-name">
            <router-link v-bind:to="`/users/${user.id}`">
              <p @click="userClick(user)">{{`${user.lastname}, ${user.firstname}`}}</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button @click="pageNumberIncAndDec">Previous Page</button>
      <p>{{ pageNumber }}</p>
      <button @click="pageNumberIncAndDec">Next Page</button>
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
      selectRole: '',
      search: '',
      id: this.$route.params.id,
      pageNumber: 1
    }
  },
  methods: {
    pageNumberIncAndDec({ target }: any) {
      if(target.innerHTML === 'Previous Page' && this.pageNumber > 1) {
        this.pageNumber--;
      }

      const numberOfPages = Math.floor((this.$store.state.filterUsersByRole.length-  1)/ 10);
      console.log(numberOfPages);
      if(target.innerHTML === 'Next Page' && numberOfPages >= this.pageNumber) {
        this.pageNumber++;
      }
    },
    userClick(user: Form): void {
      //the chosen user from users list will be stored to the state.selectedUser to fill the form
      this.$store.commit('setSelectedUser', user);
      bus.$emit('selectedUserClicked');
    },
    addUser(): void {
      //a callback function will run which has a 'addUserClicked' event name from Form.vue
      bus.$emit('addUserClicked');
    },
    triggerFilter() {
      this.$store.commit({
        type: 'filteringRole',
        selectRole: this.selectRole,
        search: this.search,
        pageNumber: this.pageNumber
      });
    }
  },

  //rerenders when paginatedUsers' value changes
  computed: {
    ...mapState(['paginatedUsers'])
  },

  //if there are changes to search, selectRole or pageNumber's value, this functions will 'react'
  watch: {
    search() {
      this.pageNumber = 1;
      this.triggerFilter();
    },
    selectRole() {
      this.pageNumber = 1;
      this.triggerFilter();
    },
    pageNumber() {
      this.triggerFilter();
    }
  },

  //fetch the list of users from the user table when the component is mounted
  apollo: {
    user: {
        query() {
          return gql`query getUsers {
                 user {
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
        update(data) {
          //fetched data(list of users) will be stored in the state.users from store
          this.$store.commit('fetchUsers', data.user);
        }
    },

    //fetch user data when this.id has a numeric value
    fetch_user: {
      query() {
        return gql`query getUser($id: Int!) {
                 user(where: { id: { _eq: $id }}) {
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
          id: this.id
        }
      },
      update(data) {
        if(!data.user.length) {
          bus.$emit('userDoesNotExist');
          return;
        }
        this.$store.commit('setSelectedUser', data.user[0]);
      }
    }
  },
  created() {
    bus.$on('updateClicked', () => {
      this.triggerFilter();
    });

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
    max-height: 820px;
  }

  .user-name-add > a> button {
    margin-left: 10px;
    padding: 10px 15px;
    font-size: 15px;
    border-radius: 7px;
    font-weight: bold;
    background-color: #019c01;
    color: white;
    border: 3px solid darkgreen;
    cursor: pointer;
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
    cursor: pointer;
  }

  .user-name-add {
    width: 100%;
    align-items: center;
  }

  .user-name-add > a > button {
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

  .user-name a {
    text-decoration: none;
    color: black;
  }

  .pagination {
    margin: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination > p {
    padding: 0 30px;
    font-size: 20px;
    font-weight: bold;
  }

  .pagination > button {
    padding: 7px 15px;
    background-color: #1686dc;
    border: 3px solid #3f3fe3;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }
</style>