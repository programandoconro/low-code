export type CanvasElement = {
  type: HTMLElement["tagName"];
  content: string;
  styles: Partial<CSSStyleDeclaration>;
  editable: true;
};
