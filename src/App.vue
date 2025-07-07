<template>
  <main>
    <ElementNav />
    <Canvas
      :canvas-elements="canvasElements"
      :save-canvas="saveCanvas"
      v-on:focus="onFocus"
      v-on:key-down="onKeyDown"
    />

    <button class="clear-button" @click="clearCanvasElements">x</button>
    <ElementMenu :color="color" @color-input-change="onColorInputChange" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import ElementMenu from "./components/PropertyMenu.vue";
import ElementNav from "./components/ElementMenu.vue";
import { CanvasElement } from "./utils/model";
import Canvas from "./components/Canvas.vue";
import {
  clearCanvasFromStorage,
  getCanvasElementsFromStore,
  saveCanvas,
} from "./utils/storage";

const canvasElements = ref<CanvasElement[]>([]);
const focusedElementIndex = ref<number | null>();
const focusedElementRef = ref<HTMLElement | null>();
const color = ref<string>("");

function onColorInputChange(e: Event & { target: HTMLInputElement }) {
  if (typeof focusedElementIndex.value === "number") {
    canvasElements.value[focusedElementIndex.value].styles = {
      color: e.target.value,
    };
    saveCanvas(canvasElements.value);
  }
}

function clearCanvasElements() {
  clearCanvasFromStorage();
  canvasElements.value = [];
}

function onFocus({ index, event }: { index: number; event: Event }) {
  color.value = "";
  focusedElementIndex.value = index;
  canvasElements.value = canvasElements.value.map((ele, i) => {
    return {
      ...ele,
      styles: { ...ele.styles, border: index === i ? "solid 1px white" : "" },
    };
  });
  focusedElementRef.value = event.target as HTMLElement;
}

function onKeyDown({ event, index }: { event: KeyboardEvent; index: number }) {
  if (event.key === "Enter") {
    const target = event.target as HTMLElement;
    canvasElements.value[index].content = target.innerText;
    saveCanvas(canvasElements.value);
    event.preventDefault(); // prevent newline
    (event.target as HTMLElement).blur();
  }
}

onMounted(() => {
  //TODO: use DB instead
  const canvasElementsFromStore = getCanvasElementsFromStore();
  if (canvasElementsFromStore) {
    canvasElements.value = JSON.parse(canvasElementsFromStore).map(
      (val: CanvasElement) => ({
        ...val,
        styles: { ...val.styles, border: "" },
      })
    );
  }
});
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
      // Blur and remove border
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
