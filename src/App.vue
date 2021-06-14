<template>
  <div id="app">
    <header>
      <h1>User Management</h1>
    </header>
    <main>
      <Users/>
      <Form/>
    </main>
  </div>
</template>

<script>
import Form from "./components/Form";
import Users from "./components/Users";

export default {
  name: 'App',
  components: {
    Form,
    Users
  }
}
</script>

<style>
  * {
    font-family: 'Arial';
  }

  #app {
    background-color: #d4e7f8;
    padding-bottom: 25px;
    border: 2px solid black;
  }

  #app > header {
    text-align: center;
    background-color: #2196F3;
    padding: 20px 0;
    margin-bottom: 40px;
    border-bottom: 2px solid black;
  }

  #app > main {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
    height: 100%;
  }
</style>
