<template>
  <div class="container">
    <div class="row">
      <div class="col mt-5">
        <h1>Login</h1>
        <hr />
        <FormTag
          method="post"
          action="/login"
          ref="loginForm"
          @onFormSubmit="submitHandler"
          name="loginForm"
          event="onFormSubmit"
        >
          <template v-slot:formInputs>
            <TextInput
              label="Email"
              name="email"
              required
              v-model="email"
              placeholder="Email"
            />
            <TextInput
              label="Password"
              name="password"
              required
              v-model="password"
              placeholder="Password"
              type="password"
            />
            <input type="submit" class="btn btn-primary" value="Login" />
          </template>
        </FormTag>
        <hr />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import Cookies from "js-cookie";
import notie from "notie";
import TextInput from "./forms/TextInput.vue";
import FormTag from "./forms/FormTag.vue";
import { store } from "../store";
import router from "../router";
import Security from "./security";

export default defineComponent({
  components: {
    TextInput,
    FormTag,
  },
  setup() {
    const email = ref("");
    const password = ref("");

    const submitHandler = async () => {
      try {
        const payload = {
          email: email.value,
          password: password.value,
        };

        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/users/login`,
          Security.requestOptions(payload)
        );
        const { data, error, message } = await response.json();

        if (error) {
          notie.alert({
            type: "error",
            text: message,
          });
        } else {
          store.token = data.token.token;
          store.user = {
            id: data.user.id,
            email: data.user.email,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
          };

          // save info to cookie
          Cookies.set("_site_data", JSON.stringify(data), { expires: 1 });
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    };

    return {
      email,
      password,
      submitHandler,
    };
  },
});
</script>
<style></style>
