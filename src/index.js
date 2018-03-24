import initModel from "./Model";
import update from "./Update";
import view from "./View";
// import App from "./App";

import * as R from "ramda";
import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { pre } = hh(h);

const node = document.getElementById("app");

App(initModel, update, view, node);

function App(model, update, view, node) {
  let currentModel = model;
  let currentView = view(currentModel, dispatch);
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
