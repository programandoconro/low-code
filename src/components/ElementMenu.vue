<template>
  <menu>
    <h3>Menu</h3>
    <label>Color</label>
    <input
      :value="props.color"
      @change="props.onColorInputChange"
      id="color-input"
      @input="emit('update:color', ($event.target as HTMLInputElement).value)"
    />
  </menu>
</template>

<script setup lang="ts">
const props = defineProps<{
  color: string;
  onColorInputChange: (e: Event & { target: HTMLInputElement }) => void;
}>();

const emit = defineEmits<{
  (e: "update:color", value: string): void;
}>();
</script>

<style>
menu {
  background-color: gray;
  width: 20%;
}
</style>
