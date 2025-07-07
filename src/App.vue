<template>
  <main>
    <ElementNav />
    <Canvas
      v-model:canvas-elements="canvasElements"
      v-model:focused-element-index="focusedElementIndex"
      v-model:focused-element-ref="focusedElementRef"
      v-model:color="color"
      :save-canvas="saveCanvas"
    />
    <ClearCanvasButton v-model:canvas-elements="canvasElements" />
    <ElementMenu
      v-model:color="color"
      v-model:canvas-elements="canvasElements"
      v-bind:focused-element-index="focusedElementIndex"
    />
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import ElementMenu from "./components/PropertyMenu.vue";
import ElementNav from "./components/ElementMenu.vue";
import Canvas from "./components/Canvas.vue";
import ClearCanvasButton from "./components/ClearCanvasButton.vue";

import { CanvasElement } from "./utils/model";
import { saveCanvas } from "./utils/storage";

const canvasElements = ref<CanvasElement[]>([]);
const focusedElementIndex = ref<number | null>(null);
const focusedElementRef = ref<HTMLElement | null>(null);
const color = ref<string>("");

onMounted(() => {
  const clickListener = (e: MouseEvent) => {
    const menu = document.querySelector("menu");
    const nav = document.querySelector("nav");
    const clickedInsideMenu =
      menu?.contains(e.target as Node) || nav?.contains(e.target as Node);
    const clickedInsideFocused = focusedElementRef.value?.contains(
      e.target as Node
    );

    if (!clickedInsideMenu && !clickedInsideFocused) {
      focusedElementRef.value?.blur();

      if (typeof focusedElementIndex.value === "number") {
        canvasElements.value[focusedElementIndex.value].styles = {
          ...canvasElements.value[focusedElementIndex.value].styles,
          border: "",
        };
      }

      focusedElementIndex.value = null;
      focusedElementRef.value = null;
    }
  };

  document.addEventListener("click", clickListener);

  onUnmounted(() => {
    document.removeEventListener("click", clickListener);
  });
});
</script>

<style scoped>
main {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>
