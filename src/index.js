import initModel from "./Model";
import update from "./Update";
import view from "./View";
import App from "./App";

const node = document.getElementById("app");

App(initModel, update, view, node);
