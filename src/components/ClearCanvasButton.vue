<template>
  <button class="clear-button" @click="clearCanvasElements">x</button>
</template>
<script setup lang="ts">
import { CanvasElement } from "@/utils/model";
import { clearCanvasFromStorage } from "@/utils/storage";

const props = defineProps<{ canvasElements: CanvasElement[] }>();
const emit = defineEmits(["update:canvasElements"]);
function clearCanvasElements() {
  clearCanvasFromStorage();
  emit("update:canvasElements", []);
}
</script>
<style scoped>
.clear-button {
  background-color: red;
  height: 30px;
  width: 30px;
  margin: 10px;
  border: solid 1px white;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 70%;
    transition: ease 0.4s;
  }
}
</style>
