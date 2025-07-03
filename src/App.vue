<template>
  <main>
    <nav>
      <div class="h1" id="h1" ref="h1Ele" draggable="true">h1</div>
    </nav>
    <div dropzone="copy" id="canvas" class="canvas">canvas</div>
  </main>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const h1 = document.getElementById("h1");
  const canvas = document.getElementById("canvas");
  const storedCanvas = localStorage.getItem("canvas");
  if (storedCanvas) {
    canvas.innerHTML = storedCanvas;
  }

  h1.addEventListener("dragstart", (e) => {
    console.log("dragstart");
    e.dataTransfer.effectAllowed = "all";
    e.dataTransfer.setData("text/plain", "h1");
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    canvas.addEventListener(eventName, (e) => {
      console.log(eventName);
      e.preventDefault();
    });
  });

  canvas.addEventListener("drop", function (e) {
    console.log("dropped");

    const draggedType = e.dataTransfer.getData("text/plain");

    if (draggedType === "h1") {
      const newH1 = document.createElement("h1");
      newH1.innerText = "Title";
      newH1.contentEditable = true;
      this.appendChild(newH1);
      storeCanvasInnerHtml();
    }
    e.preventDefault();
  });

  canvas.addEventListener("input", () => {
    console.log("inputting");
    storeCanvasInnerHtml();
  });
  function storeCanvasInnerHtml() {
    localStorage.setItem("canvas", document.getElementById("canvas").innerHTML);
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
  width: 30%;
}

.h1 {
  border: 1px solid whitesmoke;
  text-align: center;
  padding: 10px;
  margin: 10px;
  cursor: grab;
}

.canvas {
  width: 70%;
  background-color: black;
  border: 2px dashed white;
}
</style>
