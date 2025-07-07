import { CanvasElement } from "./model";

export const CANVAS_KEY = "canvas-elements";
export function saveCanvas(canvasElements: CanvasElement[]) {
  //TODO: use DB instead
  localStorage.setItem(CANVAS_KEY, JSON.stringify(canvasElements));
}

export function clearCanvasFromStorage() {
  localStorage.removeItem(CANVAS_KEY);
}

export function getCanvasElementsFromStore() {
  return localStorage.getItem(CANVAS_KEY);
}
