<template>
  <menu>
    <h3>Menu</h3>
    <label>Color</label>
    <input
      :value="props.color"
      @change="onColorInputChange"
      id="color-input"
      @input="emit('update:color', ($event.target as HTMLInputElement).value)"
    />
  </menu>
</template>

<script setup lang="ts">
import { CanvasElement } from "@/utils/model";
import { saveCanvas } from "@/utils/storage";

const props = defineProps<{
  color: string;
  focusedElementIndex: number;
  canvasElements: CanvasElement[];
}>();

const emit = defineEmits<{
  (e: "update:color", value: string): void;
  (e: "update:canvas-elements", value: CanvasElement[]);
}>();

function onColorInputChange(e: Event & { target: HTMLInputElement }) {
  if (typeof props.focusedElementIndex === "number") {
    props.canvasElements[props.focusedElementIndex].styles = {
      color: e.target.value,
    };
    emit("update:canvas-elements", props.canvasElements);
    saveCanvas(props.canvasElements);
  }
}
</script>

<style>
menu {
  background-color: gray;
  width: 20%;
}
</style>
