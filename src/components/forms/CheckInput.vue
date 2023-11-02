<template>
  <div class="checkbox-group">
    <input type="checkbox" :id="id" :checked="value" @change="updateValue" />
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CheckInput",
  props: {
    value: Boolean,
    id: String,
    label: String,
  },
  methods: {
    updateValue(event: Event) {
      const target = event.target as HTMLInputElement;
      this.$emit("input", target.checked);
    },
  },
});
</script>

<style scoped>
.checkbox-group {
  margin-bottom: 15px;
}
</style>
