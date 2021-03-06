primitives.orgdiagram.DrawBackgroundAnnotationTask = function (getGraphics, createTransformTask, applyLayoutChangesTask,
	backgroundAnnotationOptionTask, navigationFamilyTask, alignDiagramTask) {
	var _graphics,
		_positions,
		_transform;

	function process() {
		var annotations = backgroundAnnotationOptionTask.getAnnotations(),
			navigationFamily;

		_graphics = getGraphics();
		_graphics.reset("placeholder", primitives.common.Layers.BackgroundAnnotation);

		if (annotations.length > 0) {
			_positions = alignDiagramTask.getItemsPositions();
			_transform = createTransformTask.getTransform();

			navigationFamily = navigationFamilyTask.getNavigationFamily();

			drawAnnotations(annotations, _positions, navigationFamily);
		}

		return false;
	}

	function drawAnnotations(annotations, positions, navigationFamily) {
		var panel,
			index, len,
			index2, len2,
			index3, len3,
			shape,
			defaultConfig,
			rects, rect,
			itemsHash, item,
			properties, property,
			annotationConfig, treeItemPosition;

		for (index = 0, len = annotations.length; index < len; index += 1) {
			annotationConfig = annotations[index];

			if (annotationConfig.items != null && annotationConfig.items.length > 0) {
				shape = new primitives.common.MergedRectangles(_graphics);
				shape.transform = _transform;
				defaultConfig = new primitives.orgdiagram.BackgroundAnnotationConfig();
				properties = ["opacity", "lineWidth", "borderColor", "fillColor", "lineType"];
				for (index3 = 0, len3 = properties.length; index3 < len3; index3 += 1) {
					property = properties[index3];
					shape[property] = annotationConfig.hasOwnProperty(property) ? annotationConfig[property] : defaultConfig[property];
				}
				panel = _graphics.activate("placeholder", primitives.common.Layers.BackgroundAnnotation);

				rects = [];
				itemsHash = {};
				for (index2 = 0, len2 = annotationConfig.items.length; index2 < len2; index2 += 1) {
					item = annotationConfig.items[index2];
					treeItemPosition = alignDiagramTask.getItemPosition(item);
					if (treeItemPosition != null) {
						itemsHash[item] = true;
						rect = new primitives.common.Rect(treeItemPosition.actualPosition);
						rect.offset(annotationConfig.offset);
						rects.push(rect);

						if (annotationConfig.includeChildren) {
							navigationFamily.loopChildren(this, item, function (childItemId, childItem) {
								if (!itemsHash[childItemId]) {
									itemsHash[childItemId] = true;
									treeItemPosition = alignDiagramTask.getItemPosition(childItemId);
									rect = new primitives.common.Rect(treeItemPosition.actualPosition);
									rect.offset(annotationConfig.offset);
									rects.push(rect);
								}
							}); //ignore jslint
						}
					}
				}
				shape.draw(rects);
			}
		}
	}

	return {
		process: process
	};
};