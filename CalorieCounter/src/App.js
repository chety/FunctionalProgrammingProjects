import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

function app(initModel, update, view, node) {
	let model = initModel;
	let currentView = view(dispatch, model);
	let rootNode = createElement(currentView);
	node.appendChild(rootNode);

	function dispatch(msg) {
		model = update(msg, model);
		const updatedView = view(dispatch, model);
		const pathces = diff(currentView, updatedView);
		rootNode = patch(rootNode, pathces);
		currentView = updatedView;
	}
}

export default app;
