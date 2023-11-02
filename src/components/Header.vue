<template lang="">
  <nav class="navbar navbar-expand-lg navbar-light bg-light"> <router-link
  class="navbar-brand" to="/">Navbar</router-link> <button class="navbar-toggler"
  type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav"
  aria-expanded="false" aria-label="Toggle navigation"> <span
  class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse"
  id="navbarNav"> <ul class="navbar-nav me-auto mb-2 mg-lg-0"> <li class="nav-item
  active"> <router-link class="nav-link" to="/"
  activeClass="active-link">Home</router-link> </li> <li class="nav-item"> <router-link
  class="nav-link" to="/books">Books</router-link> </li> <li v-if="store.token !== ''"
  class="nav-item dropdown"> <a class="nav-link dropdown-toggle" href="#"
  id="navBarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Admin
  </a> <ul class="dropdown-menu" aria-labelledby="navBarDropdown"> <li><router-link
  class="dropdown-item" to="/admin/users">Manage Users</router-link></li> <li><router-link
  class="dropdown-item" to="/admin/users/0">Add User</router-link></li> <li><router-link
  class="dropdown-item" to="/admin/books">Manage Books</router-link></li> <li><router-link
  class="dropdown-item" :to="{name: 'BookEdit', params:{bookId:0}}">Add
  Book</router-link></li> </ul> </li> <li class="nav-item"> <router-link v-if="store.token
  == ''" class="nav-link" to="/login" activeClass="active-link">Login</router-link> <a
  v-else class="nav-link" activeClass="active-link" href="javascript:void(0);"
  @click="logout">Logout</a> </li> </ul> <span class="navbar-text">
  {{ store.user.first_name ?? "" }}
  </span> </div> </nav>
</template>
<script lang="ts">
import Cookies from "js-cookie";
import { store } from "../store";
import router from "../router";
import Security from "./security";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      store,
    };
  },
  methods: {
    async logout() {
      try {
        const { error, message } = await (
          await fetch(
            `${import.meta.env.VITE_APP_API_URL}/users/logout`,
            Security.requestOptions({})
          )
        ).json();

        if (error) {
          console.log(message);
          return;
        }
        store.token = "";
        store.user = {};
        Cookies.remove("_site_data");

        router.push("/login");
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
<style lang="css">
.active-link {
  color: purple;
}
</style>
