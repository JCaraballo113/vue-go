<template>
  <div class="container">
    <div class="row">
      <div class="row">
        <div class="col">
          <h1 class="mt-3">All Users</h1>
        </div>

        <hr />

        <table v-if="ready" class="table table-compact table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Active</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <router-link :to="`/admin/users/${user.id}`">
                  {{ user.last_name }}, {{ user.first_name }}
                </router-link>
              </td>
              <td>
                {{ user.email }}
              </td>
              <td v-if="user.active === 1">
                <span class="badge bg-success" @click="logUserOut(user.id)">Active</span>
              </td>
              <td v-else>
                <span class="badge bg-danger" @click="logUserOut(user.id)">Inactive</span>
              </td>
              <td v-if="user.token.id > 0">
                <a href="javascript:void(0);">
                  <span class="badge bg-success" @click="logUserOut(user.id)"
                    >Logged In</span
                  ></a
                >
              </td>
              <td v-else>
                <span class="badge bg-danger">Logged Out</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Security from "./security";
import notie from "notie";
import { store } from "@/store";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  active: number;
  token: {
    id: number;
  };
};

export default defineComponent({
  beforeMount() {
    Security.requireToken();
  },
  async setup() {
    if (store.token === "") return;
    const users = ref<User[]>([]);
    const ready = ref<boolean>(false);

    try {
      const { error, message, data } = await (
        await fetch(
          import.meta.env.VITE_APP_API_URL + "/admin/users",
          Security.requestOptions({})
        )
      ).json();
      const { users: fetchedUsers }: { users: User[] } = data ?? {};

      if (error) {
        notie.alert({
          type: "error",
          text: message,
        });
      } else {
        users.value = fetchedUsers;
        ready.value = true;
      }
    } catch (error: any) {
      notie.alert({
        type: "error",
        text: error,
      });
    }

    return {
      users,
      ready,
    };
  },
  methods: {
    async logUserOut(userId: number) {
      if (userId === parseInt(store.user.id ?? "")) return;
      notie.confirm({
        text: "Are you sure you want to log out this user?",
        submitText: "Log Out",
        submitCallback: async () => {
          const response = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/admin/log-user-out/${userId}`,
            Security.requestOptions({})
          );

          const { error, message } = await response.json();

          if (error) {
            this.$emit("error", message);
            return;
          }

          this.$emit("success", message);
          this.$emit("forceUpdate");
        },
      });
    },
  },
});
</script>
