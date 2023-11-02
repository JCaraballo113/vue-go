<script setup lang="ts">
import FormTag from "./forms/FormTag.vue";
import TextInput from "./forms/TextInput.vue";
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="row">
        <div class="col">
          <h1 class="mt-3">User</h1>
          <hr />
          <FormTag @userEditEvent="submitHandler" name="userForm" event="userEditEvent">
            <template v-slot:formInputs>
              <TextInput
                v-model="user.first_name"
                type="text"
                required
                label="First Name"
                :value="user.first_name"
                name="first-name"
              />
              <TextInput
                v-model="user.last_name"
                type="text"
                required
                label="Last Name"
                :value="user.last_name"
                name="last-name"
              />
              <TextInput
                v-model="user.email"
                type="email"
                required
                label="Email"
                :value="user.email"
                name="email"
              />
              <TextInput
                v-if="newUser"
                v-model="user.password"
                type="password"
                :value="user.password"
                label="Password"
                name="password"
              />

              <TextInput
                v-else
                v-model="user.password"
                type="password"
                :value="user.password"
                label="Password"
                name="password"
                help="Leave empty to keep existing password"
              />

              <div class="form-check">
                <input
                  v-model="user.active"
                  class="form-check-input"
                  type="radio"
                  id="user-active"
                  :value="1"
                />
                <label class="form-check-label" for="user-active">Active</label>
              </div>

              <div class="form-check">
                <input
                  v-model="user.active"
                  class="form-check-input"
                  type="radio"
                  id="user-active-two"
                  :value="0"
                />
                <label class="form-check-label" for="user-active-two">Inactive</label>
              </div>

              <hr />
              <div class="float-start">
                <input type="submit" class="btn btn-primary me-2" value="Save" />
                <RouterLink to="/admin/users" class="btn btn-outline-secondary">
                  Cancel
                </RouterLink>
              </div>

              <div class="float-end">
                <a
                  v-if="!currentUser && !newUser"
                  class="btn btn-danger"
                  href="javascript:void(0);"
                  @click="confirmDelete(user.id)"
                  >Delete</a
                >
              </div>
              <div class="clearfix"></div>
            </template>
          </FormTag>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import notie from "notie";

import Security from "./security";
import { store } from "../store";

export default defineComponent({
  async beforeMount() {
    Security.requireToken();

    if (!this.newUser) {
      // editing an existing user
      const { data, error, message } = await (
        await fetch(
          `${import.meta.env.VITE_APP_API_URL}/admin/users/${this.$route.params.userId}`,
          Security.requestOptions({})
        )
      ).json();

      if (error) {
        this.$emit("error", message);
      } else {
        this.user = data.user;
        // we want password to be empty for existing users
        this.user.password = "";
      }
    }
  },
  data() {
    return {
      user: {
        id: 0,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        active: 0,
      },
    };
  },
  methods: {
    async submitHandler() {
      try {
        const payload = {
          id: parseInt(String(this.$route.params.userId), 10),
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          email: this.user.email,
          password: this.user.password,
          active: this.user.active,
        };

        const { error, message } = await (
          await fetch(
            `${import.meta.env.VITE_APP_API_URL}/admin/users/save`,
            Security.requestOptions(payload)
          )
        ).json();

        if (error) {
          this.$emit("error", message);
        } else {
          notie.alert({
            type: "success",
            text: "Changes saved!",
          });
          this.$router.push("/admin/users");
        }
      } catch (error: any) {
        this.$emit("error", error);
      }
    },
    confirmDelete(id: number) {
      notie.confirm({
        text: "Are you sure you want to delete this user?",
        submitText: "Delete",
        submitCallback: async () => {
          const payload = {
            id,
          };

          const { error, message } = await (
            await fetch(
              `${import.meta.env.VITE_APP_API_URL}/admin/users/delete`,
              Security.requestOptions(payload)
            )
          ).json();

          if (error) {
            this.$emit("error", message);
          } else {
            this.$emit("success", "User deleted!");
            this.$router.push("/admin/users");
          }
        },
      });
    },
  },
  computed: {
    currentUser() {
      return (
        parseInt(String(this.$route.params.userId), 10) ===
        parseInt(store.user.id || "0", 10)
      );
    },
    newUser() {
      return parseInt(String(this.$route.params.userId), 10) <= 0;
    },
  },
});
</script>
