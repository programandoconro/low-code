<template>
  <div
    id="canvas"
    class="canvas"
    @dragenter.prevent
    @dragover.prevent
    @drop="onDrop"
    @drop.prevent
  >
    <component
      v-for="(el, i) in canvasElements"
      :key="i"
      :is="el.type"
      contenteditable="true"
      @focus="(e: Event) => onFocus({ index: i, event: e })"
      :style="el.styles"
      @keydown="(e: KeyboardEvent) => onKeyDown({ index: i, event: e })"
    >
      {{ el.content }}
    </component>
  </div>
</template>

<script setup lang="ts">
import { CanvasElement } from "@/utils/model";
import { getCanvasElementsFromStore } from "@/utils/storage";
import { onMounted } from "vue";

const props = defineProps<{
  canvasElements: CanvasElement[];
  saveCanvas: (canvasElements: CanvasElement[]) => void;
  focusedElementIndex: number | null;
  focusedElementRef: HTMLElement | null;
  color: string;
}>();

const emit = defineEmits<{
  (e: "update:focused-element-index", value: number): void;
  (e: "update:focused-element-ref", value: HTMLElement): void;
  (e: "update:canvas-elements", value: CanvasElement[]): void;
  (e: "update:color", value: string): void;
}>();

function onFocus({ index, event }: { index: number; event: Event }) {
  emit("update:color", "");
  emit("update:focused-element-index", index);
  emit("update:focused-element-ref", event.target as HTMLElement);

  const updated = props.canvasElements.map((ele, i) => ({
    ...ele,
    styles: {
      ...ele.styles,
      border: i === index ? "solid 1px white" : "",
    },
  }));

  emit("update:canvas-elements", updated);
}

function onDrop(e: DragEvent) {
  const draggedType = e.dataTransfer?.getData("text/plain");

  if (draggedType === "h1") {
    const updated: CanvasElement[] = [
      ...props.canvasElements,
      {
        type: "h1",
        content: "Title",
        styles: {},
        editable: true,
      },
    ];
    props.saveCanvas(updated);
    emit("update:canvas-elements", updated);
  }
}

function onKeyDown({ event, index }: { event: KeyboardEvent; index: number }) {
  if (event.key === "Enter") {
    const target = event.target as HTMLElement;
    const updated = props.canvasElements.map((el, i) =>
      i === index ? { ...el, content: target.innerText } : el
    );
    event.preventDefault();
    target.blur();
    props.saveCanvas(updated);
    emit("update:canvas-elements", updated);
  }
}

onMounted(() => {
  const canvasElementsFromStore = getCanvasElementsFromStore();
  if (canvasElementsFromStore) {
    const updated = JSON.parse(canvasElementsFromStore).map(
      (val: CanvasElement) => ({
        ...val,
        styles: { ...val.styles, border: "" },
      })
    );
    emit("update:canvas-elements", updated);
  }
});
</script>

<style scoped>
.canvas {
  width: 60%;
  background-color: black;
  border: 2px dashed white;
  margin: 10px 0px 10px 10px;
  padding: 10px;
}
</style>
