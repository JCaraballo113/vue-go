<template>
  <form
    autocomplete="off"
    :method="method"
    :action="action"
    :ref="name"
    :event="event"
    class="needs-validation"
    novalidate
    @submit.prevent="onSubmit"
  >
    <slot name="formInputs"></slot>
  </form>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormTag",
  props: {
    action: {
      type: String,
    },
    method: {
      type: String,
    },
    event: {
      type: String,
      default: "submit",
    },
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    onSubmit() {
      const form: any = this.$refs[this.$props.name];
      if (form.checkValidity()) {
        this.$emit(this.$props.event);
      }
      form.classList.add("was-validated");
    },
  },
});
</script>
<style></style>
