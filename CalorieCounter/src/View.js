import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import {
	showFormMessage,
	fieldsChanged,
	saveMeal,
	deleteMeal,
	updateMealMessage,
} from "./Update";
import * as R from "ramda";

const {
	pre,
	div,
	h1,
	button,
	form,
	label,
	input,
	table,
	tr,
	th,
	td,
	thead,
	tbody,
	i,
} = hh(h);

function generateNumberFieldProps(labelText) {
	if (labelText !== "Calories") {
		return null;
	}
	return {
		type: "number",
		min: 0,
	};
}

function fieldSet(labelText, value, oninput) {
	return div([
		label({ className: "db mb1" }, labelText),
		input({
			value,
			oninput,
			required: true,
			className: "pa2 input-reset ba w-100 mb2",
			...generateNumberFieldProps(labelText),
		}),
	]);
}
function buttonSet(dispatch) {
	return div([
		button(
			{
				className: "f3 pv2 ph3 bg-blue white bn mr2 dim",
				type: "submit",
			},
			"Save"
		),
		button(
			{
				className: "f3 pv2 ph3 bg-light-gray bn dim",
				type: "button",
				onclick: () => dispatch(showFormMessage(false)),
			},
			"Cancel"
		),
	]);
}

function formView(dispatch, model) {
	const { calories, description, showForm, nextId } = model;
	return showForm
		? form(
				{
					className: "w-100 mv2",
					onsubmit: (e) => {
						e.preventDefault();
						dispatch(saveMeal);
					},
				},
				[
					fieldSet("Description", description, (e) =>
						dispatch(fieldsChanged("description", e.target.value))
					),
					fieldSet("Calories", calories || "", (e) =>
						dispatch(
							fieldsChanged("calories", Number(e.target.value))
						)
					),
					buttonSet(dispatch),
				]
		  )
		: button(
				{
					className: "f3 pv2 ph3 bg-blue white bn mr2 dim",
					onclick: () => dispatch(showFormMessage(true)),
				},
				"Add Meal"
		  );
}
function cell(tag, className, value) {
	return tag({ className }, value);
}

const tableHeader = thead(
	tr([
		cell(th, "pa2 tl", "Meal"),
		cell(th, "pa2 tr", "Calories"),
		cell(th, "", ""),
	])
);

function totalRow(meals) {
	const totalCalories = R.pipe(
		R.map((meal) => meal.calories),
		R.sum
	)(meals);
	return tr({ className: "bt b" }, [
		cell(td, "pa2 tr", "Total:"),
		cell(td, "pa2 tr", totalCalories),
		cell(td, "", ""),
	]);
}

function mealRow(dispatch, meal) {
	const { id, description, calories } = meal;
	return tr({ className: "stripe-dark" }, [
		cell(td, "tl", description),
		cell(td, "pa2 tr", calories),
		cell(td, "pa2 tr", [
			i({
				className: "ph1 fa fa-trash-o pointer",
				onclick: () => dispatch(deleteMeal(id)),
			}),
			i({
				className: "ph1 fa fa-pencil-square-o pointer",
				onclick: () => dispatch(updateMealMessage(id)),
			}),
		]),
	]);
}

function mealsBody(meals, dispatch) {
	const rows = meals.map((meal) => mealRow(dispatch, meal));
	return tbody([rows, totalRow(meals)]);
}

function tableView(dispatch, meals) {
	if (meals.length === 0) {
		return div({ className: "mv2 i black-50" }, "No meals to display...");
	}
	return table({ className: "mv2 w-100 collapse" }, [
		tableHeader,
		mealsBody(meals, dispatch),
	]);
}

function view(dispatch, model) {
	return div({ className: "mw6 center" }, [
		h1({ className: "f2 pv2 bb" }, "Calorie Counter"),
		formView(dispatch, model),
		tableView(dispatch, model.meals),
		pre(JSON.stringify(model, null, 4)),
	]);
}

export default view;
