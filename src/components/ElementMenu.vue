<template>
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
</template>

<script setup lang="ts">
function onDragStart(e: DragEvent) {
  e.dataTransfer.effectAllowed = "all";
  e.dataTransfer.setData("text/plain", "h1");
}
</script>
<style scoped>
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
</style>
