<template>
  <main>
    <nav>
      <div
        class="h1"
        id="h1"
        ref="h1Ele"
        draggable="true"
        @dragstart="onDragStart"
      >
        h1
      </div>
    </nav>
    <div
      id="canvas"
      class="canvas"
      ref="canvasRef"
      @dragenter.prevent
      @dragover.prevent
      @drop="onDrop"
      @drop.prevent
      @keydown="onKeyDown"
    >
      <component
        v-for="(el, i) in canvasElements"
        :key="i"
        :is="el.type"
        contenteditable="true"
      >
        {{ el.content }}
      </component>
    </div>

    <button class="clear-button" @click="clearCanvas">x</button>
    <menu>
      <h3>Menu</h3>
      <label>Color</label>
      <input @change="onColorInputChange" id="color-input" />
    </menu>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const CANVAS_KEY = "canvas-elements";

const canvasRef = ref<HTMLElement | null>();
const focusedElement = ref<HTMLElement | null>();
const canvasElements = ref([]);

function onColorInputChange(e: Event) {
  focusedElement.value.style.color = (e.target as HTMLInputElement).value;
}

function clearCanvas() {
  canvasRef.value.innerHTML = null;
  localStorage.removeItem(CANVAS_KEY);
}

function onDragStart(e: DragEvent) {
  e.dataTransfer.effectAllowed = "all";
  e.dataTransfer.setData("text/plain", "h1");
}

function onDrop(e: DragEvent) {
  const draggedType = e.dataTransfer.getData("text/plain");

  if (draggedType === "h1") {
    canvasElements.value.push({
      type: "h1",
      content: "Title",
      styles: {},
      editable: true,
    });
    localStorage.setItem(CANVAS_KEY, JSON.stringify(canvasElements.value));
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent newline
    (e.target as HTMLElement).blur();
  }
}

onMounted(() => {
  const canvasElementsFromStore = localStorage.getItem(CANVAS_KEY);
  if (canvasElementsFromStore) {
    canvasElements.value = JSON.parse(canvasElementsFromStore);
  }
});
</script>

<style scoped>
main {
  display: flex;
  height: 100vh;
  width: 100%;
}

nav {
  background-color: gray;
  width: 20%;
}

.h1 {
  border: 1px solid whitesmoke;
  text-align: center;
  padding: 10px;
  margin: 10px;
  cursor: grab;
}

.canvas {
  width: 60%;
  background-color: black;
  border: 2px dashed white;
  margin: 10px 0px 10px 10px;
  padding: 10px;
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
menu {
  background-color: gray;
  width: 20%;
}
</style>
