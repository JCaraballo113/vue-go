<template>
  <div class="mb-3">
    <label class="form-label" :for="name">{{ label }}</label>
    <input
      class="form-control"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :id="name"
      :required="required"
      @input="$emit('update:modelValue', ($event.target as any).value)"
    />
    <div class="form-text">{{ help }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextInput",
  props: {
    modelValue: String,
    type: {
      type: String,
      default: "text",
    },
    name: String,
    placeholder: String,
    label: String,
    required: {
      type: Boolean,
      default: false,
    },
    help: {
      type: String,
      default: "",
    },
  },
});
</script>

<style scoped></style>
