h<template>
  <div class="Form">
    <div class="form-header">
      <h2 v-if="!userForm.id">Add User</h2>
      <h2 v-else>Edit User</h2>
      <div class="add-and-delete">
        <button @click="addUser(userForm)">Save</button>
        <button @click="deleteUser(userForm)">Delete</button>
      </div>
    </div>
    <div class="warnings">
      <p v-if="userForm.id !== 0 && !userForm.active" class="warning">The user is inactive!</p>
      <p v-if="invalidEmail" class="warning">Invalid Email!</p>
      <p v-if="hasEmptyField" class="warning">Fill all the fields except the Middle Name field(optional)</p>
      <p v-if="isEmailExist" class="warning">Email already exist!</p>
    </div>
    <form>
      <section>
        <label for="last-name">Last Name</label>
        <input type="text" id="last-name" v-model="userForm.lastname"/>
      </section>
      <section>
        <label for="first-name">First Name</label>
        <input type="text" id="first-name" v-model="userForm.firstname"/>
      </section>
      <section>
        <label for="middle-name">Middle Name</label>
        <input type="text" id="middle-name" v-model="userForm.middlename"/>
      </section>
      <section>
        <label for="nickname">Nickname</label>
        <input type="text" id="nickname" v-model="userForm.nickname"/>
      </section>
      <section>
        <label for="birthday">Birthday</label>
        <input type="date" id="birthday" v-model="userForm.birthdate"/>
      </section>
      <section>
        <label for="e-mail">Email</label>
        <input type="email" id="e-mail" v-model="userForm.email"/>
      </section>
      <section section="roles">
        <label for="role">Role</label>
        <div>
          <select name="role" id="role" @change="selectMultipleRole">
            <option value="Participant">Participant</option>
            <option value="Student">Student</option>
            <option value="Administrator">Administrator</option>
            <option value="Teacher">Teacher</option>
          </select>
          <ul>
<!--            List of Roles of the created user or the selected user-->
            <li v-for="oneRole in roles" v-bind:key="oneRole.role.id" @click="removeRole">{{ oneRole.role.name }}</li>
          </ul>
        </div>
      </section>
      <section>
        <p>Active</p>
        <label class="switch">
          <input type="checkbox" v-model="userForm.active" />
          <span class="slider"></span>
        </label>
      </section>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { bus } from '../main';
import gql from "graphql-tag";
import { capitalize } from '../utils/utils';
import { Form, Role } from '../types/types';

const userForm: Form = {
  lastname: '',
  firstname: '',
  middlename: '',
  nickname: '',
  birthdate: '',
  email: '',
  user_roles: [],
  active: false,
  id: 0
};

export default Vue.extend({
  name: "Form",
  data() {
    return {
      userForm: {...userForm},
      isEmailExist: false,
      invalidEmail: false,
      hasEmptyField: false
    }
  },

  //if the value of store.state.selectedUser changes, handler function will run
  watch: {
    "$store.state.selectedUser": {
      handler(): void {
        const selectedUser = this.$store.state.selectedUser;
        this.userForm = {...selectedUser};
        this.userForm.user_roles = [...selectedUser.user_roles];
      }
    }
  },

  //rerenders when users and roles change value
  computed: {
    users(): Form {
      return this.$store.state.users;
    },
    roles(): Array<Role> {
      return this.userForm.user_roles;
    }
  },
  methods: {
    removeRole({target}: any): void {
      const index = this.userForm.user_roles.findIndex(ele => ele.role.name === target.innerHTML);
      this.userForm.user_roles.splice(index, 1);
    },
    selectMultipleRole({target}: any): void {
      const role = target.value;
      //checks if a chosen role exist in the user's array of roles
      const isRoleExist = this.userForm.user_roles.find(ele => ele.role.name === role);
      let roleObj;

      //end the function if it exists
      if (isRoleExist) {
        return;
      }

      switch (role) {
        case 'Participant':
          roleObj = {role: {name: role, id: 1}};
          break;
        case 'Teacher':
          roleObj = {role: {name: role, id: 2}};
          break;
        case 'Student':
          roleObj = {role: {name: role, id: 3}};
          break;
        default:
          roleObj = {role: {name: role, id: 4}};
      }

      this.userForm.user_roles.push(roleObj);
    },
    addUser(user: Form): void {
      this.isEmailExist = false;
      this.invalidEmail = false;
      this.hasEmptyField = false;
      //if the id exist, it will instead update the user information
      if (user.id !== 0) {
        this.updateUserData(user);
        return;
      }

      const users = this.$store.state.users;

      //checks if all the property(except middlename) is truthy
      for (let prop in user) {
        const regex = new RegExp(/.*@.*\..*(\..*)?/);
        //it makes the middlename optional
        if(prop === 'middlename') {
          user[prop] = capitalize(user[prop]);
          continue;
        }

        if(prop === 'id') {
          continue;
        }

        //checks if value of every property are not an empty string
        if (user[prop] === "") {
          this.hasEmptyField = true;
          return;
        }

        //checks if email has the right format
        if(prop === 'email') {
          if(!regex.test(user[prop])) {
            this.invalidEmail = true;
            return;
          }
        }

        //to skip the capitalization if property is an email key or the type of the value of a key is an object or boolean
        if(prop === 'email' || typeof user[prop] === 'object' || typeof user[prop] === 'boolean') {
          continue;
        }

        //Trim the whitespace and capitalize the first letter
        user[prop] = capitalize(user[prop]);
      }

      //checks if there is a duplicate email
      const isDuplicateEmail = users.find(userElement => userElement.email === user.email);
      if (isDuplicateEmail) {
        this.isEmailExist = true;
        return;
      }

      //add the newly created user info to the db
      console.log('Let\'s add');
      this.addUserToDB(user);
      this.resetForm();
      this.isEmailExist = false;
      this.invalidEmail = false;
      this.hasEmptyField = false;
    },

    deleteUser(user: Form): void {
      this.deleteUserFromDB(user);
      this.resetForm();
    },
    resetForm(): void {
      const form: any = document.querySelector('form');
      form.reset();
      userForm.user_roles = [];
      this.userForm = {...userForm};
    },
    async addUserToDB(user: Form): Promise<void> {
      console.log('Adding to the db...');
      //add the user info to the user table and returns an ID
      const userId = await this.$apollo.mutate({
        mutation: gql`mutation addUser($email: String!,
                                       $firstname: String!,
                                       $active: Boolean!,
                                       $birthdate: date!
                                       $lastname: String!,
                                       $middlename: String!,
                                       $nickname: String!) {
                insert_user(objects: {
                   firstname: $firstname
                   email: $email
                   active: $active
                   birthdate: $birthdate
                   lastname: $lastname
                   middlename: $middlename
                   nickname: $nickname
                   }) {
                      returning {
                        id
                      }
                }

        }`,
        variables: {
          firstname: user.firstname,
          email: user.email,
          active: user.active,
          birthdate: user.birthdate,
          lastname: user.lastname,
          middlename: user.middlename,
          nickname: user.nickname
        }
      });
      //if an id exists, it will add all the roles to the user_role table
      if (userId && user.user_roles.length !== 0) {
        await user.user_roles.forEach((role: Role) => {
          this.$apollo.mutate({
            mutation: gql`mutation addRole ($role_id: Int!,
                                   $user_id: Int!) {
            insert_user_role(objects: {
              role_id: $role_id
              user_id: $user_id
              }) {
                affected_rows
              }
          }`,
            variables: {
              role_id: role.role.id,
              user_id: userId.data.insert_user.returning[0].id
            }
          });
        });

        //adds a property 'id' to the user passed in the parameter
        user.id = userId.data.insert_user.returning[0].id;
        this.$store.commit('addUser', user);
      }
    },
    async updateUserData(user: Form): Promise<void> {
      await this.$apollo.mutate({
        mutation: gql`mutation updateUser ($email: String!,
                                           $firstname: String!,
                                           $active: Boolean!,
                                           $birthdate: date!
                                           $lastname: String!,
                                           $middlename: String!,
                                           $nickname: String!,
                                           $id: Int!) {
          update_user(where: {id: {_eq: $id }} _set: {
                   firstname: $firstname
                   email: $email
                   active: $active
                   birthdate: $birthdate
                   lastname: $lastname
                   middlename: $middlename
                   nickname: $nickname
                   }) {
                     affected_rows
          }
        }`,
        variables: {
          firstname: user.firstname,
          email: user.email,
          active: user.active,
          birthdate: user.birthdate,
          lastname: user.lastname,
          middlename: user.middlename,
          nickname: user.nickname,
          id: user.id
        }
      });
      await this.addRole(user);
      await this.deleteRole(user);
      this.$store.commit('updateUser', user);
    },
    async addRole(user): Promise<void> {
      const prevRole = this.$store.state.selectedUser.user_roles;
      const currentRole = user.user_roles;

      //add the role that exist in currentRole but not in prevRole by comparing
      for (let i = 0; i <= currentRole.length - 1; i++) {
        for (let j = 0; j <= prevRole.length - 1; j++) {
          if (currentRole[i].role.id === prevRole[j].role.id) {
            break;
          }

          //if it is done comparing the element(role) in the outer loop, it means there is match which will be inserted to the database
          if (j === prevRole.length - 1) {
            await this.$apollo.mutate({
              mutation: gql`mutation addRole ($role_id: Int!,
                                   $user_id: Int!) {
            insert_user_role(objects: {
              role_id: $role_id
              user_id: $user_id
              }) {
                affected_rows
              }
          }`,
              variables: {
                role_id: currentRole[i].role.id,
                user_id: user.id
              }
            });
          }
        }
      }
    },
    async deleteRole(user): Promise<void> {
      const prevRole = this.$store.state.selectedUser.user_roles;
      const currentRole = user.user_roles;

      //remove the role that exist in prevRole but not in currentRole by comparing
      for (let i = 0; i <= prevRole.length - 1; i++) {
        for (let j = 0; j <= currentRole.length - 1; j++) {
          if (prevRole[i].role.id === currentRole[j].role.id) {
            break;
          }

          //if no matching role at the end of the iteration of the inner loop, it will be deleted to the db
          if (j === currentRole.length - 1) {
            await this.$apollo.mutate({
              mutation: gql`mutation deleteRole ($role_id: Int!,
                                   $user_id: Int!) {
            delete_user_role(where: {
              role_id: {_eq: $role_id},
              user_id: {_eq: $user_id}
              }) {
                affected_rows
              }
          }`,
              variables: {
                role_id: prevRole[i].role.id,
                user_id: user.id
              }
            });
          }
        }
      }
    },
    async deleteUserFromDB(user): Promise<void> {
      const roles = user.user_roles;

      //deleting all of the roles first in the user_role table using the selected user_id to avoid error from the db
      for (let i = 0; i <= roles.length - 1; i++) {
        await this.$apollo.mutate({
          mutation: gql`mutation deleteRole ($role_id: Int!,
                                  $user_id: Int!) {
           delete_user_role(where: {
             role_id: {_eq: $role_id},
             user_id: {_eq: $user_id}
             }) {
               affected_rows
             }
         }`,
          variables: {
            role_id: roles[i].role.id,
            user_id: user.id
          }
        });
      }

      //deleting the row from user table using the selected user_id
      await this.$apollo.mutate({
        mutation: gql`mutation deleteRole ($id: Int!) {
            delete_user(where: {
              id: {_eq: $id}
              }) {
                affected_rows
              }
          }`,
        variables: {
          id: user.id,
        }
      });
      this.$store.commit('deleteUser', user.id);
    }
  },
  created() {
    //linked to the addUser() event handler from User.vue
    bus.$on('addUserClicked', (): void => {
      this.resetForm();
    });
  }
});
</script>

<style scoped>
.Form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #a2ccee;
  padding: 5px 20px 20px 20px;
  border-radius: 10px;
  border: 2px solid black;
  width: 80%;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.add-and-delete > button {
  margin-left: 10px;
  padding: 10px 15px;
  font-size: 15px;
  border-radius: 7px;
  font-weight: bold;
}

.add-and-delete button:first-child {
  background-color: #019c01;
  color: white;
  border: 3px solid darkgreen;
}

.add-and-delete button:last-child {
  background-color: #bf0000;
  color: white;
  border: 3px solid #4e0101;
}

form {
  background-color: #f8f4ea;
  border: 2px solid black;
  padding: 25px 0;

}

section {
  display: grid;
  grid-template-columns: 180px 1fr;
  padding: 10px 20px;
}

section > input {
  width: 90%;
  height: 25px;
}

.warning {
  background-color: #f8e7b3;
  padding: 20px 50px;
  font-size: 20px;
  border: 10px solid #e2e23e;
  box-sizing: border-box;
}

ul {
  padding: 0;
  height: 80px;
}

li {
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  margin-bottom: 10px;
  list-style-type: none;
  padding: 5px 0;
  width: 130px;
  background-color: #f3ddbb;
  font-size: 12px;
  border-radius: 20px;
  border: 2px solid black;
  cursor: pointer;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d70404;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #03bf03;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>