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

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;800&family=Roboto:wght@100;300;500;700;900&display=swap');

  * {
    font-family: 'Roboto', sans-serif;
  }

  #app {
    background-color: #d4e7f8;
    padding-bottom: 25px;
    border: 2px solid black;
  }

  #app > header {
    text-align: center;
    background-color: #80bdef;
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
