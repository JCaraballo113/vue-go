<template>
  <div class="mb-3">
    <label :for="name" class="form-label">{{ label }}</label>
    <select
      class="form-select"
      :multiple="multiple"
      :id="name"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
      :value="modelValue"
    >
      <option disabled value="">Choose...</option>
      <option v-for="item in items" :key="item.value" :value="item.value">
        {{ item.text }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { SelectItem } from "../types";

export default defineComponent({
  name: "SelectInput",
  props: {
    items: Array<SelectItem>,
    name: String,
    required: Boolean,
    label: String,
    multiple: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: [Number, String],
      default: "",
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      selected: null,
    };
  },
});
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
</style>
