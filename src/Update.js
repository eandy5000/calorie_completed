import * as R from "ramda";
const MSG = {
  TOGGLE_FORM: "TOGGLE_FORM",
  MEAL_INPUT: "MEAL_INPUT",
  CALORIES_INPUT: "CALORIES_INPUT",
  SAVE_MEAL: "SAVE_MEAL",
  DELETE_MEAL: "DELETE_MEAL",
  EDIT_ID: "EDIT_ID"
};

export const saveMealMsg = { type: MSG.SAVE_MEAL };

export function editMealMsg(editId) {
  return {
    type: MSG.EDIT_ID,
    editId
  };
}

export function deleteMealMsg(id) {
  return {
    type: MSG.DELETE_MEAL,
    id
  };
}

export function toggleFormMsg(showForm) {
  return {
    type: MSG.TOGGLE_FORM,
    showForm
  };
}

export function mealUpdateMsg(description) {
  return {
    type: MSG.MEAL_INPUT,
    description
  };
}

export function caloriesUpdateMsg(calories) {
  return {
    type: MSG.CALORIES_INPUT,
    calories
  };
}

export default function update(msg, model) {
  const { showForm, description, calories, id, editId } = msg;
  switch (msg.type) {
    case MSG.TOGGLE_FORM:
      return { ...model, showForm, description: "", calories: 0 };
    case MSG.MEAL_INPUT:
      return { ...model, description };
    case MSG.CALORIES_INPUT:
      return { ...model, calories };
    case MSG.SAVE_MEAL:
      const updateModel = model.editId !== null ? edit(msg, model) : add(model);
      return updateModel;
    case MSG.DELETE_MEAL:
      const meals = R.filter(meal => meal.id !== id, model.meals);
      return { ...model, meals };
    case MSG.EDIT_ID:
      const editMeal = R.find(meal => meal.id === editId, model.meals);
      return {
        ...model,
        showForm: true,
        description: editMeal.description,
        calories: editMeal.calories,
        editId
      };
    default:
      return model;
  }
}

function add(model) {
  console.log("add");
  const { description, calories, nextId, id } = model;
  const meal = {
    id: nextId,
    description: validDescription(description),
    calories: validCalories(calories)
  };
  const meals = [...model.meals, meal];
  return {
    ...model,
    meals,
    nextId: nextId + 1,
    description: "",
    calories: 0,
    showForm: false
  };
}

function edit(msg, model) {
  console.log("edit");
  const { description, calories, editId } = model;
  const meals = R.map(meal => {
    if (meal.id === editId) {
      return { ...meal, description, calories };
    }
    return meal;
  }, model.meals);

  return {
    ...model,
    showForm: false,
    meals,
    editId: null,
    calories: 0,
    description: ""
  };
}

function validDescription(text) {
  if (!text) {
    return "unspecified";
  }
  return text;
}

function validCalories(calorieEntry) {
  const validEntry = R.pipe(parseInt, R.defaultTo(0))(calorieEntry);
  return validEntry;
}
