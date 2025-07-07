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
      @keydown="(e: KeyboardEvent) => onKeyDown({index: i, event:e})"
    >
      {{ el.content }}
    </component>
  </div>
</template>
<script setup lang="ts">
import { CanvasElement } from "@/utils/model";

const props = defineProps<{
  canvasElements: CanvasElement[];
  saveCanvas: (canvasElements: CanvasElement[]) => void;
  onFocus: ({ index, event }: { index: number; event: Event }) => void;
  onKeyDown: ({ index, event }: { index: number; event: Event }) => void;
}>();
function onDrop(e: DragEvent) {
  const draggedType = e.dataTransfer.getData("text/plain");

  if (draggedType === "h1") {
    props.canvasElements.push({
      type: "h1",
      content: "Title",
      styles: {},
      editable: true,
    });
    props.saveCanvas(props.canvasElements);
  }
}
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
