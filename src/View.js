import * as R from "ramda";
import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import createElement from "virtual-dom/create-element";
import {
  toggleFormMsg,
  saveMealMsg,
  mealInputMsg,
  caloriesInputMsg,
  deleteMealMsg,
  editMealMsg
} from "./Update";

const {
  pre,
  div,
  h1,
  button,
  label,
  input,
  table,
  thead,
  tbody,
  th,
  td,
  tr,
  a,
  p
} = hh(h);

export default function view(model, dispatch) {
  const Header = h1({ className: "bb" }, "Calorie Counting App");

  function seeModel(model) {
    return pre(JSON.stringify(model, null, 2));
  }

  function formField(model, labelName, inputType, inputFunction) {
    const inputValue = model[inputType];
    return div({ className: "mh2 pa2" }, [
      label({ className: "pr2" }, labelName),
      input({ oninput: inputFunction, className: "br5", value: inputValue })
    ]);
  }

  function buttonGroup(model) {
    return div([
      button(
        {
          onclick: () => dispatch(toggleFormMsg(false)),
          className: "ma2 pa2 white dim bn bg-red br5"
        },
        "Cancel"
      ),
      button(
        {
          onclick: () => {
            dispatch(saveMealMsg);
          },
          className: "ma2 pa2 white dim bn bg-green br5"
        },
        "Save"
      )
    ]);
  }

  function mealForm(model, dispatch) {
    return div([
      formField(model, "Meal:", "description", e =>
        dispatch(mealInputMsg(e.target.value))
      ),
      formField(model, "Calories:", "calories", e =>
        dispatch(caloriesInputMsg(e.target.value))
      )
    ]);
  }

  function addMealButton(model, dispatch) {
    return button(
      {
        onclick: () => dispatch(toggleFormMsg(true)),
        className: "f3 br5 pa2 dim bg-blue bn white"
      },
      "Add Meal"
    );
  }

  function showFormLogic(model, dispatch) {
    if (model.showForm) {
      return div([mealForm(model, dispatch), buttonGroup(model, dispatch)]);
    }
    return addMealButton(model, dispatch);
  }

  //table
  const tableHeader = tr([th("Meals"), th("Calories")]);

  function mealRows() {
    const meals = R.map(meal => {
      return tr([
        td(meal.description),
        td({}, meal.calories),
        td([
          a(
            {
              onclick: () => dispatch(editMealMsg(meal)),
              className: "ph2 link underline-hover red"
            },
            "edit"
          ),
          a(
            {
              onclick: () => dispatch(deleteMealMsg(meal.id)),
              className: "ph2 link underline-hover red"
            },
            "delete"
          )
        ])
      ]);
    }, model.meals);

    return meals;
  }

  function mealsTotal() {
    const total = R.pipe(R.map(meal => meal.calories), R.sum)(model.meals);
    return tr([td("Total"), td({}, total)]);
  }

  mealsTotal();

  //table output
  function showTable() {
    if (model.meals.length > 0) {
      return mealsTable();
    }
    return p({ className: "i" }, "No meals to display...");
  }

  function mealsTable() {
    return table([tableHeader, mealRows(), mealsTotal()]);
  }

  function output(model) {
    return div([Header, showFormLogic(model, dispatch), showTable()]);
  }

  return output(model);
}
