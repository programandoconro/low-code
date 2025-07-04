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
        @focus="(e: Event) => onFocus({ index: i, element: el, event: e })"
        :style="el.styles"
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
import { onMounted, onUnmounted, ref } from "vue";
const CANVAS_KEY = "canvas-elements";
type CanvasElement = {
  type: HTMLElement["tagName"];
  content: string;
  styles: Partial<CSSStyleDeclaration>;
  editable: true;
};

const canvasElements = ref<CanvasElement[]>([]);
const focusedElementIndex = ref<number | null>();
const focusedElementRef = ref<HTMLElement | null>();

function onColorInputChange(e: Event & { target: HTMLInputElement }) {
  if (typeof focusedElementIndex.value === "number") {
    canvasElements.value[focusedElementIndex.value].styles = {
      color: e.target.value,
    };
    saveCanvas();
  }
}

function clearCanvas() {
  localStorage.removeItem(CANVAS_KEY);
  canvasElements.value = [];
}

function onDragStart(e: DragEvent) {
  e.dataTransfer.effectAllowed = "all";
  e.dataTransfer.setData("text/plain", "h1");
}

function onFocus({
  index,
  element,
  event,
}: {
  index: number;
  element: CanvasElement;
  event: Event;
}) {
  focusedElementIndex.value = index;
  canvasElements.value = canvasElements.value.map((ele, i) => {
    return {
      ...ele,
      styles: { ...ele.styles, border: index === i ? "solid 1px white" : "" },
    };
  });
  focusedElementRef.value = event.target as HTMLElement;
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
    saveCanvas();
  }
}

function saveCanvas() {
  //TODO: use DB instead
  localStorage.setItem(CANVAS_KEY, JSON.stringify(canvasElements.value));
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent newline
    (e.target as HTMLElement).blur();
  }
}

onMounted(() => {
  //TODO: use DB instead
  const canvasElementsFromStore = localStorage.getItem(CANVAS_KEY);
  if (canvasElementsFromStore) {
    canvasElements.value = JSON.parse(canvasElementsFromStore);
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
