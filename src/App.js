import createElement from "virtual-dom/create-element";
import { h, diff, patch } from "virtual-dom";
import hh from "hyperscript-helpers";

const { div, pre } = hh(h);

export default function App(model, update, view, node) {
  let currentModel = model;
  let currentView = view(model, dispatch);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    currentModel = update(msg, currentModel);
    const updatedView = view(currentModel, dispatch);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}
