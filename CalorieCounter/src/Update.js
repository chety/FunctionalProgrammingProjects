import * as R from "ramda";

const MESSAGES = {
	SHOW_FORM: "SHOW_FORM",
	FIELDS_CHANGED: "FIELDS_CHANGED",
	SAVE_MEAL: "SAVE_MEAL",
	DELETE_MEAL: "DELETE_MEAL",
	UPDATE_MEAL: "UPDATE_MEAL",
};

export function showFormMessage(showForm) {
	return {
		type: MESSAGES.SHOW_FORM,
		payload: showForm,
	};
}

export function fieldsChanged(field, value) {
	return {
		type: MESSAGES.FIELDS_CHANGED,
		payload: {
			field,
			value,
		},
	};
}

export function deleteMeal(id) {
	return {
		type: MESSAGES.DELETE_MEAL,
		payload: id,
	};
}

export function updateMealMessage(editId) {
	return {
		type: MESSAGES.UPDATE_MEAL,
		editId,
	};
}

export const saveMeal = {
	type: MESSAGES.SAVE_MEAL,
};

function update(action, model) {
	const { payload } = action;

	switch (action.type) {
		case MESSAGES.SHOW_FORM:
			return {
				...model,
				showForm: payload,
				description: "",
				calories: 0,
				editId: null,
			};
		case MESSAGES.FIELDS_CHANGED:
			const { field, value } = payload;
			return {
				...model,
				[field]: value,
			};

		case MESSAGES.SAVE_MEAL:
			return model.editId !== null ? updateMeal(model) : addMeal(model);

		case MESSAGES.DELETE_MEAL: {
			const meals = R.filter((meal) => meal.id !== payload, model.meals);
			return {
				...model,
				meals,
			};
		}

		case MESSAGES.UPDATE_MEAL:
			const { editId } = action;
			const { description, calories } = R.find(
				(meal) => meal.id === editId,
				model.meals
			);
			return {
				...model,
				description,
				calories,
				editId,
				showForm: true,
			};
	}
	return model;
}

function addMeal(model) {
	const { nextId, description, calories } = model;
	const meal = { id: nextId, description, calories };
	const meals = [...model.meals, meal];
	return {
		...model,
		meals,
		description: "",
		calories: 0,
		showForm: false,
		nextId: nextId + 1,
	};
}

function updateMeal(model) {
	const { editId, description, calories } = model;
	const meals = model.meals.map((meal) => {
		if (meal.id === editId) {
			return {
				...meal,
				description,
				calories,
			};
		}
		return meal;
	});

	return {
		...model,
		meals,
		description: "",
		calories: 0,
		showForm: false,
		editId: null,
	};
}

export default update;
