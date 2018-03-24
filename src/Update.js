import * as R from "ramda";

const MSG = {
  TOGGLE_FORM: "TOGGLE_FORM",
  SAVE_MEAL: "SAVE_MEAL",
  MEAL_INPUT: "MEAL_INPUT",
  CALORIES_INPUT: "CALORIES_INPUT",
  DELETE_MEAL: "DELETE_MEAL",
  EDIT_MEAL: "EDIT_MEAL"
};

export const saveMealMsg = { type: MSG.SAVE_MEAL };

export function editMealMsg(editMeal) {
  return {
    type: MSG.EDIT_MEAL,
    editMeal
  };
}

export function deleteMealMsg(deleteId) {
  return {
    type: MSG.DELETE_MEAL,
    deleteId
  };
}

export function caloriesInputMsg(calories) {
  return {
    type: MSG.CALORIES_INPUT,
    calories
  };
}

export function mealInputMsg(description) {
  return {
    type: MSG.MEAL_INPUT,
    description
  };
}

export function toggleFormMsg(showingForm) {
  return {
    type: MSG.TOGGLE_FORM,
    showForm: showingForm
  };
}

export default function update(msg, model) {
  switch (msg.type) {
    case MSG.TOGGLE_FORM:
      return { ...model, showForm: msg.showForm };
    case MSG.SAVE_MEAL:
      const addOrEdit = model.editId === null ? add(model) : edit(model, msg);
      return addOrEdit;
    case MSG.MEAL_INPUT:
      return { ...model, description: msg.description };
    case MSG.CALORIES_INPUT:
      return { ...model, calories: msg.calories };
    case MSG.DELETE_MEAL:
      const deleteArr = R.filter(meal => meal.id !== msg.deleteId, model.meals);
      return {
        ...model,
        meals: deleteArr
      };
    case MSG.EDIT_MEAL:
      return {
        ...model,
        description: msg.editMeal.description,
        calories: msg.editMeal.calories,
        editId: msg.editMeal.id,
        showForm: true
      };
    default:
      return model;
  }
}

//update helper functions
function add(model) {
  const meal = {
    id: model.nextId,
    description: validDescription(model.description),
    calories: validCalories(model.calories)
  };

  const meals = [...model.meals, meal];

  return {
    ...model,
    meals,
    description: "",
    calories: 0,
    nextId: model.nextId + 1,
    showForm: false
  };
}

function edit(model, msg) {
  const editedMeals = R.map(meal => {
    const changedMeal = {
      id: model.editId,
      description: validDescription(model.description),
      calories: validCalories(model.calories)
    };
    if (meal.id === model.editId) {
      return changedMeal;
    }
    return meal;
  }, model.meals);

  return {
    ...model,
    meals: editedMeals,
    editId: null,
    showForm: false,
    calories: 0,
    description: ""
  };
}

function validDescription(input) {
  if (!input) {
    return "unspecified";
  }
  return input;
}

function validCalories(cal) {
  return R.pipe(parseInt, R.defaultTo(0))(cal);
}
