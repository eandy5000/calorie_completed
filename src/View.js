import * as R from "ramda";
import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import initModel from "./Model";
import {
  toggleFormMsg,
  mealUpdateMsg,
  caloriesUpdateMsg,
  saveMealMsg,
  deleteMealMsg,
  editMealMsg
} from "./Update";

const {
  pre,
  div,
  h1,
  button,
  form,
  label,
  input,
  table,
  th,
  tr,
  td,
  tbody,
  thead,
  a
} = hh(h);

const header = h1({ className: "bb" }, "Calories");

function mealForm(model, dispatch, validation) {
  return form([
    div({ className: "mv2" }, [
      label({ className: "pr2" }, "meal:"),
      input({
        oninput: e => dispatch(mealUpdateMsg(e.target.value)),
        type: "text",
        className: "br2",
        value: model.description
      })
    ]),
    div({ className: "mv2" }, [
      label({ className: "pr2" }, "calories:"),
      input({
        oninput: e => dispatch(caloriesUpdateMsg(e.target.value)),
        type: "text",
        className: "br2",
        value: model.calories
      })
    ]),
    div([
      button(
        {
          onclick: e => {
            e.preventDefault();
            dispatch(saveMealMsg);
          },
          className: "pa2 dim mh2 white bg-green bn br2"
        },
        "save"
      ),
      button(
        {
          onclick: () => dispatch(toggleFormMsg(false)),
          className: "pa2 dim mh2 white bg-red bn br2"
        },
        "cancel"
      )
    ])
  ]);
}

function formButtonLogic(model, dispatch) {
  const { showForm } = model;
  if (showForm) {
    return mealForm(model, dispatch);
  }
  return addMealButton(model, dispatch);
}

function addMealButton(model, dispatch) {
  return button(
    {
      onclick: () => dispatch(toggleFormMsg(true)),
      className: "f3 white bg-blue br1 pa2 bn dim"
    },
    "Add Meal"
  );
}

function seeModel(model) {
  return pre(JSON.stringify(model, null, 2));
}

const tableHeader = thead(tr([th("Meals"), th("Calories")]));

function mealRow(model, dispatch) {
  const meals = R.map(meal =>
    tr([
      td(meal.description),
      td({}, meal.calories),
      td([
        a(
          {
            onclick: e => {
              e.preventDefault();
              dispatch(editMealMsg(meal.id));
            },
            href: "#",
            className: "pr1 link underline-hover red"
          },
          "edit"
        ),
        a(
          {
            onclick: e => {
              e.preventDefault();
              dispatch(deleteMealMsg(meal.id));
            },
            href: "#",
            className: "pr1 link underline-hover red"
          },
          "delete"
        )
      ])
    ])
  )(model.meals);
  return meals;
}

function mealTotal(model) {
  const total = R.pipe(R.map(i => i.calories), R.sum)(model.meals);
  return tr([td("Total"), td({}, total)]);
}

function mealTable(model, dispatch) {
  return table([
    tableHeader,
    tbody([mealRow(model, dispatch), mealTotal(model)])
  ]);
}

export default function view(model, dispatch) {
  return div([
    header,
    formButtonLogic(model, dispatch),
    mealTable(model, dispatch)
  ]);
}
