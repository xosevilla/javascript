﻿QUnit.module('Algorithms - Get crossing rectangles. This method finds rectangles having sides intersections. It does not finds completly ovellaped rectangles. This method is used for searching overlaped lables.');

QUnit.test("primitives.common.getCrossingRectangles", function (assert) {
	function GetPlacementMarker(placement, label, color) {
		var div = jQuery("<div></div>");

		div.append(label);
		div.css(placement.getCSS());
		div.css({
			"background": color,
			visibility: "visible",
			position: "absolute",
			font: "Areal",
			"font-size": "12px",
			"border-style": "solid",
			"border-color": "black",
			"border-width": "2px",
			"opacity": "0.5"
		});

		return div;
	}

	function ShowLayout(fixture, rects, width, height, title) {
		var titlePlaceholder = jQuery("<div style='visibility:visible; position: relative; line-height: 40px; text-align: left; font: Areal; font-size: 14px; width: 640px; height:40px;'></div>");
		titlePlaceholder.append(title);
		fixture.append(titlePlaceholder);

		var placeholder = jQuery("<div style='visibility:visible; position: relative; font: Areal; font-size: 12px;'></div>");
		placeholder.css({
			width: width,
			height: height
		});
		for (var index = 0; index < rects.length; index += 1) {
			var rect = rects[index];
			var label = rect.context;

			var div = GetPlacementMarker(rect, label, "grey");
			placeholder.append(div);
		}

		fixture.append(placeholder);
	}

	function getSize(rects) {
		var result = new primitives.common.Rect(0, 0, 0, 0);
		for (var index = 0; index < rects.length; index += 1) {
			var rect = rects[index];
			result.addRect(rect);
		}
		return result;
	}

	function getRectangles(items) {
		var result = [];
		for (var index = 0; index < items.length; index += 1) {
			var item = items[index];
			var rect = new primitives.common.Rect(item[0], item[1], item[2], item[3]);
			rect.context = index;
			result.push(rect);
		}
		return result;
	}

	function getCrossingRectangles(rects) {
		var result = [];
		for (var index = 0, len = rects.length; index < len - 1; index += 1) {
			var firstRect = rects[index];
			for (var index2 = index + 1; index2 < len; index2 += 1) {
				secondRect = rects[index2];

				if (firstRect.overlaps(secondRect)) {
					result.push([index, index2]);
				}
			}
		}
		return result;
	}

	function TestLayout(title, items) {
		var rects = getRectangles(items);
		var paletteItem = new primitives.common.PaletteItem({
			lineColor: "#000000",
			lineWidth: "2",
			fillColor: "#faebd7",
			lineType: primitives.common.LineType.Solid,
			opacity: 1
		});

		var result = [];
		primitives.common.getCrossingRectangles(this, rects, function (rect1, rect2) {
			var crossing = [rect1.context, rect2.context];
			crossing.sort(function (a, b) { return a - b;});
			result.push(crossing);

			if (rect1.context == rect2.context) {
				throw "Self crossing is not considered as a valid result";
			}
		});
		result.sort(function (a, b) {
			if (a[0] == b[0]) {
				return a[1] - b[1];
			} else {
				return a[0] - b[0];
			}
		});

		var size = getSize(rects);
		ShowLayout(jQuery("#qunit-fixture"), rects, size.width, size.height, title);

		jQuery("#qunit-fixture").css({
			position: "relative",
			left: "0px",
			top: "0px",
			height: "Auto"
		});

		var expected = getCrossingRectangles(rects);
		assert.deepEqual(result, expected, title);
	};

	TestLayout("Single rectangle", [
		[0, 0, 100, 100]
	]);

	TestLayout("Two disconnected rectangles", [
		[0, 0, 80, 80],
		[100, 0, 80, 80]
	]);

	TestLayout("Two aligned disconnected rectangles", [
		[0, 0, 80, 80],
		[80, 100, 80, 80]
	]);

	TestLayout("Two aligned disconnected rectangles", [
		[0, 100, 80, 80],
		[80, 0, 80, 80]
	]);

	TestLayout("Two overlapping rectangles", [
	[0, 0, 100, 100],
	[50, 50, 100, 100]
	]);

	TestLayout("Two overlapping rectangles", [
		[0, 50, 100, 100],
		[50, 0, 100, 100]
	]);

	TestLayout("E shape rectangles on right", [
		[0, 0, 50, 350],
		[50, 0, 50, 50],
		[50, 100, 50, 50],
		[50, 200, 50, 50],
		[50, 300, 50, 50]
	]);

	TestLayout("E shape rectangles on left", [
		[50, 0, 50, 350],
		[0, 0, 50, 50],
		[0, 100, 50, 50],
		[0, 200, 50, 50],
		[0, 300, 50, 50]
	]);


	TestLayout("5 rectangles", [
		[0, 0, 100, 100],
		[150, 0, 100, 100],
		[0, 150, 100, 100],
		[150, 150, 100, 100],
		[50, 50, 150, 150]
	]);

	TestLayout("Window", [
		[100, 0, 150, 150],
		[100, 200, 150, 150],
		[0, 100, 150, 150],
		[200, 100, 150, 150]
	]);

	TestLayout("Window 2", [
		[0, 0, 150, 50],
		[0, 50, 50, 50],
		[100, 50, 50, 50],
		[0, 100, 150, 50],
		[0, 150, 50, 50],
		[100, 150, 50, 50],
		[0, 200, 150, 50]
	]);

	TestLayout("Dumbbell", [
		[0, 0, 60, 60],
		[80, 0, 60, 60],
		[50, 20, 40, 20]
	]);

	TestLayout("Horizontal overlay", [
		[0, 0, 60, 60],
		[10, 0, 60, 60],
		[20, 0, 60, 60],
		[30, 0, 60, 60],
		[40, 0, 60, 60],
		[50, 0, 60, 60]
	]);

	TestLayout("Vertical overlay", [
	[0, 0, 60, 60],
	[0, 10, 60, 60],
	[0, 20, 60, 60],
	[0, 30, 60, 60],
	[0, 40, 60, 60],
	[0, 50, 60, 60]
	]);

	function TestPerformance(title, items, useBruteForce) {

		var rects = getRectangles(items);

		if (useBruteForce) {
			getCrossingRectangles(rects);
		} else {
			var result = [];
			primitives.common.getCrossingRectangles(this, rects, function (rect1, rect2) {
				result.push([rect1.context, rect2.context]);
			});
		}
		assert.ok(true, title);
	};

	var demoLabels = [[28, 5, 154, 130], [220, 8, 120, 124], [506, 65, 100, 10], [788, 65, 100, 10], [950, 65, 100, 10], [950, 76, 100, 10], [1062, 76, 100, 10], [1062, 87, 100, 10],
		[1062, 98, 100, 10], [950, 90.75, 100, 10], [950, 105.5, 100, 10], [1062, 105.5, 100, 10], [950, 116.5, 100, 10], [950, 127.5, 100, 10], [788, 138.5, 100, 10], [950, 138.5, 100, 10],
		[950, 149.5, 100, 10], [950, 160.5, 100, 10], [950, 171.5, 100, 10], [950, 182.5, 100, 10], [788, 193.5, 100, 10], [950, 193.5, 100, 10], [950, 204.5, 100, 10], [950, 215.5, 100, 10],
		[788, 226.5, 100, 10], [950, 226.5, 100, 10], [1062, 226.5, 100, 10], [950, 237.5, 100, 10], [1062, 237.5, 100, 10], [1062, 248.5, 100, 10], [1062, 259.5, 100, 10], [950, 267, 100, 10],
		[1062, 267, 100, 10], [788, 278, 100, 10], [950, 278, 100, 10], [788, 289, 100, 10], [788, 300, 100, 10], [788, 311, 100, 10], [950, 311, 100, 10], [950, 322, 100, 10],
		[950, 333, 100, 10], [378, 262, 244, 144], [788, 329, 100, 10], [788, 340.5, 100, 10], [950, 340.5, 100, 10], [950, 351.5, 100, 10], [788, 351.5, 100, 10],
		[788, 362.5, 100, 10], [378, 416, 244, 144], [788, 483, 100, 10], [950, 483, 100, 10], [788, 494, 100, 10], [950, 494, 100, 10], [1062, 494, 100, 10],
		[950, 505, 100, 10], [950, 516, 100, 10], [950, 527, 100, 10], [788, 534.5, 100, 10], [950, 534.5, 100, 10], [950, 545.5, 100, 10], [1062, 545.5, 100, 10],
		[950, 556.5, 100, 10], [788, 567.5, 100, 10], [950, 567.5, 100, 10], [788, 578.5, 100, 10], [788, 589.5, 100, 10], [506, 597, 100, 10], [788, 597, 100, 10],
		[950, 597, 100, 10], [1062, 597, 100, 10], [1062, 608, 100, 10], [950, 615.5, 100, 10], [1062, 615.5, 100, 10], [1062, 626.5, 100, 10], [1062, 637.5, 100, 10],
		[950, 648.5, 100, 10], [1062, 648.5, 100, 10], [1062, 659.5, 100, 10], [950, 659.5, 100, 10], [950, 670.5, 100, 10], [950, 681.5, 100, 10], [950, 692.5, 100, 10],
		[950, 703.5, 100, 10], [1062, 703.5, 100, 10], [1062, 714.5, 100, 10], [1062, 725.5, 100, 10], [788, 722, 100, 10], [950, 722, 100, 10], [950, 733, 100, 10],
		[1062, 733, 100, 10], [788, 744, 100, 10], [950, 744, 100, 10], [950, 755, 100, 10], [950, 766, 100, 10], [1062, 766, 100, 10], [950, 777, 100, 10], [950, 788, 100, 10],
		[788, 799, 100, 10], [950, 799, 100, 10], [950, 810, 100, 10], [950, 821, 100, 10], [1062, 821, 100, 10], [950, 832, 100, 10], [1062, 832, 100, 10], [1062, 843, 100, 10],
		[1062, 854, 100, 10], [1062, 865, 100, 10], [1174, 865, 100, 10], [950, 843, 100, 10], [788, 872.5, 100, 10], [950, 872.5, 100, 10], [1062, 872.5, 100, 10],
		[1062, 883.5, 100, 10], [1174, 883.5, 100, 10], [1174, 894.5, 100, 10], [1062, 894.5, 100, 10], [950, 883.5, 100, 10], [950, 894.5, 100, 10], [950, 905.5, 100, 10],
		[1062, 905.5, 100, 10], [1062, 916.5, 100, 10], [950, 927.5, 100, 10], [1062, 927.5, 100, 10], [1062, 938.5, 100, 10], [1062, 949.5, 100, 10], [1062, 960.5, 100, 10],
		[1062, 971.5, 100, 10], [1062, 982.5, 100, 10], [1062, 993.5, 100, 10], [1062, 1004.5, 100, 10], [1062, 1015.5, 100, 10], [1062, 1026.5, 100, 10], [950, 1037.5, 100, 10],
		[1062, 1037.5, 100, 10], [950, 1048.5, 100, 10], [1062, 1048.5, 100, 10], [1062, 1059.5, 100, 10], [950, 1059.5, 100, 10], [788, 883.5, 100, 10], [506, 1070.5, 100, 10],
		[788, 1070.5, 100, 10], [950, 1070.5, 100, 10], [788, 1081.5, 100, 10], [788, 1092.5, 100, 10], [950, 1092.5, 100, 10], [788, 1103.5, 100, 10], [506, 1114.5, 100, 10],
		[788, 1114.5, 100, 10], [950, 1114.5, 100, 10], [950, 1125.5, 100, 10], [950, 1136.5, 100, 10], [950, 1147.5, 100, 10], [950, 1158.5, 100, 10], [788, 1166, 100, 10],
		[950, 1166, 100, 10], [950, 1177, 100, 10], [950, 1188, 100, 10], [788, 1199, 100, 10], [950, 1199, 100, 10], [788, 1210, 100, 10], [950, 1210, 100, 10], [950, 1221, 100, 10],
		[950, 1232, 100, 10], [788, 1243, 100, 10], [950, 1243, 100, 10], [1062, 1243, 100, 10], [1062, 1254, 100, 10], [950, 1261.5, 100, 10], [1062, 1261.5, 100, 10], [950, 1272.5, 100, 10],
		[950, 1283.5, 100, 10], [1062, 1283.5, 100, 10], [1062, 1294.5, 100, 10], [788, 1294.5, 100, 10], [950, 1294.5, 100, 10], [788, 1305.5, 100, 10], [506, 1125.5, 100, 10],
		[506, 1136.5, 100, 10], [220, 1256, 120, 124], [506, 1313, 100, 10], [788, 1313, 100, 10], [378, 1328.5, 244, 144], [788, 1395.5, 100, 10], [788, 1406.5, 100, 10],
		[950, 1406.5, 100, 10], [950, 1417.5, 100, 10], [950, 1428.5, 100, 10], [950, 1439.5, 100, 10], [788, 1417.5, 100, 10], [378, 1482.5, 244, 144], [788, 1549.5, 100, 10],
		[950, 1549.5, 100, 10], [950, 1560.5, 100, 10], [788, 1560.5, 100, 10], [506, 1632, 100, 10], [788, 1632, 100, 10], [788, 1643, 100, 10], [788, 1654, 100, 10],
		[506, 1661.5, 100, 10], [788, 1661.5, 100, 10], [950, 1661.5, 100, 10], [1062, 1661.5, 100, 10], [950, 1672.5, 100, 10], [950, 1683.5, 100, 10], [950, 1694.5, 100, 10],
		[950, 1705.5, 100, 10], [950, 1716.5, 100, 10], [1062, 1716.5, 100, 10], [788, 1724, 100, 10], [950, 1724, 100, 10], [950, 1735, 100, 10], [788, 1746, 100, 10], [950, 1746, 100, 10],
		[950, 1757, 100, 10], [950, 1768, 100, 10], [950, 1779, 100, 10], [950, 1790, 100, 10], [788, 1757, 100, 10], [506, 1779, 100, 10], [788, 1779, 100, 10], [788, 1790, 100, 10],
		[788, 1801, 100, 10], [950, 1801, 100, 10], [950, 1812, 100, 10], [950, 1823, 100, 10], [950, 1834, 100, 10], [788, 1812, 100, 10], [506, 1845, 100, 10], [788, 1845, 100, 10],
		[950, 1845, 100, 10], [950, 1856, 100, 10], [788, 1856, 100, 10], [788, 1867, 100, 10], [950, 1867, 100, 10], [788, 1878, 100, 10], [788, 1889, 100, 10], [220, 1832, 120, 124],
		[506, 1889, 100, 10], [506, 1900, 100, 10], [788, 1900, 100, 10], [788, 1911, 100, 10], [788, 1922, 100, 10], [506, 1911, 100, 10], [506, 1922, 100, 10], [506, 1933, 100, 10],
		[506, 1944, 100, 10], [506, 1955, 100, 10], [506, 1966, 100, 10], [506, 1977, 100, 10], [506, 1988, 100, 10], [506, 1999, 100, 10], [220, 1966, 120, 124], [506, 2023, 100, 10],
		[788, 2023, 100, 10], [950, 2023, 100, 10], [950, 2034, 100, 10], [950, 2045, 100, 10], [788, 2052.5, 100, 10], [950, 2052.5, 100, 10], [788, 2063.5, 100, 10], [788, 2074.5, 100, 10],
		[788, 2085.5, 100, 10], [788, 2096.5, 100, 10], [506, 2104, 100, 10], [788, 2104, 100, 10], [788, 2115, 100, 10], [788, 2126, 100, 10], [788, 2137, 100, 10], [950, 2137, 100, 10],
		[788, 2148, 100, 10], [788, 2159, 100, 10], [506, 2137, 100, 10], [506, 2170, 100, 10], [788, 2170, 100, 10], [788, 2181, 100, 10], [788, 2192, 100, 10],
		[378, 2185.5, 244, 144], [788, 2252.5, 100, 10], [788, 2263.5, 100, 10], [788, 2274.5, 100, 10], [950, 2274.5, 100, 10], [950, 2285.5, 100, 10], [950, 2296.5, 100, 10],
		[788, 2304, 100, 10], [950, 2304, 100, 10], [950, 2315, 100, 10], [788, 2315, 100, 10], [788, 2326, 100, 10], [788, 2337, 100, 10], [788, 2348, 100, 10], [950, 2348, 100, 10],
		[788, 2359, 100, 10], [788, 2370, 100, 10], [440, 2339.5, 120, 124], [788, 2396.5, 100, 10], [950, 2396.5, 100, 10], [660, 2412, 244, 144], [950, 2479, 100, 10],
		[1062, 2479, 100, 10], [1062, 2490, 100, 10], [1062, 2501, 100, 10], [1062, 2512, 100, 10], [1062, 2523, 100, 10], [950, 2504.75, 100, 10], [950, 2530.5, 100, 10],
		[1062, 2530.5, 100, 10], [1062, 2541.5, 100, 10], [950, 2541.5, 100, 10], [950, 2552.5, 100, 10], [1062, 2552.5, 100, 10], [1062, 2563.5, 100, 10], [1062, 2574.5, 100, 10],
		[1062, 2585.5, 100, 10], [1062, 2596.5, 100, 10], [1062, 2607.5, 100, 10], [950, 2563.5, 100, 10], [788, 2571, 100, 10], [950, 2571, 100, 10], [950, 2582, 100, 10],
		[950, 2593, 100, 10], [950, 2604, 100, 10], [950, 2615, 100, 10], [950, 2626, 100, 10], [950, 2637, 100, 10], [1062, 2637, 100, 10], [788, 2582, 100, 10], [506, 2490.875, 100, 10],
		[506, 2523.75, 100, 10], [506, 2556.625, 100, 10], [506, 2589.5, 100, 10], [788, 2589.5, 100, 10], [506, 2600.5, 100, 10], [220, 2551, 120, 124], [506, 2608, 100, 10],
		[506, 2619, 100, 10], [788, 2619, 100, 10], [788, 2630, 100, 10], [788, 2641, 100, 10], [378, 2634.5, 244, 144], [788, 2701.5, 100, 10], [788, 2712.5, 100, 10],
		[506, 2784, 100, 10], [788, 2784, 100, 10], [788, 2795, 100, 10], [950, 2795, 100, 10], [788, 2806, 100, 10], [788, 2817, 100, 10], [788, 2828, 100, 10], [506, 2795, 100, 10],
		[220, 2685, 120, 124], [220, 2819, 120, 124], [506, 2876, 100, 10], [788, 2876, 100, 10], [950, 2876, 100, 10], [950, 2887, 100, 10], [950, 2898, 100, 10], [950, 2909, 100, 10],
		[788, 2887, 100, 10], [788, 2898, 100, 10], [788, 2909, 100, 10], [788, 2920, 100, 10], [506, 2931, 100, 10], [788, 2931, 100, 10], [950, 2931, 100, 10], [1062, 2931, 100, 10],
		[1062, 2942, 100, 10], [950, 2949.5, 100, 10], [1062, 2949.5, 100, 10], [1062, 2960.5, 100, 10], [1062, 2971.5, 100, 10], [950, 2982.5, 100, 10], [1062, 2982.5, 100, 10],
		[1062, 2993.5, 100, 10], [1062, 3004.5, 100, 10], [1062, 3015.5, 100, 10], [950, 3026.5, 100, 10], [1062, 3026.5, 100, 10], [1062, 3037.5, 100, 10], [1062, 3048.5, 100, 10],
		[1062, 3059.5, 100, 10], [950, 3048.5, 100, 10], [950, 3070.5, 100, 10], [1062, 3070.5, 100, 10], [1062, 3081.5, 100, 10], [1062, 3092.5, 100, 10], [950, 3103.5, 100, 10],
		[1062, 3103.5, 100, 10], [950, 3114.5, 100, 10], [1062, 3114.5, 100, 10], [1062, 3125.5, 100, 10], [788, 3122, 100, 10], [950, 3122, 100, 10], [950, 3133, 100, 10],
		[950, 3144, 100, 10], [950, 3155, 100, 10], [950, 3166, 100, 10], [950, 3177, 100, 10], [788, 3188, 100, 10], [950, 3188, 100, 10], [950, 3199, 100, 10], [788, 3210, 100, 10],
		[950, 3210, 100, 10], [1062, 3210, 100, 10], [1062, 3221, 100, 10], [1062, 3232, 100, 10], [1062, 3243, 100, 10], [950, 3250.5, 100, 10], [1062, 3250.5, 100, 10], [1062, 3261.5, 100, 10],
		[1062, 3272.5, 100, 10], [1062, 3283.5, 100, 10], [1062, 3294.5, 100, 10], [950, 3305.5, 100, 10], [1062, 3305.5, 100, 10], [1062, 3316.5, 100, 10], [1062, 3327.5, 100, 10],
		[1062, 3338.5, 100, 10], [1062, 3349.5, 100, 10], [950, 3360.5, 100, 10], [1062, 3360.5, 100, 10], [1062, 3371.5, 100, 10], [1062, 3382.5, 100, 10], [1062, 3393.5, 100, 10],
		[1062, 3404.5, 100, 10], [1062, 3415.5, 100, 10], [950, 3377, 100, 10], [950, 3393.5, 100, 10], [950, 3410, 100, 10], [950, 3426.5, 100, 10], [1062, 3426.5, 100, 10],
		[788, 3285.8333333333335, 100, 10], [788, 3361.6666666666665, 100, 10], [788, 3437.5, 100, 10], [950, 3437.5, 100, 10], [950, 3448.5, 100, 10], [506, 3459.5, 100, 10],
		[788, 3459.5, 100, 10], [950, 3459.5, 100, 10], [788, 3470.5, 100, 10], [788, 3481.5, 100, 10], [950, 3481.5, 100, 10], [788, 3492.5, 100, 10], [950, 3492.5, 100, 10],
		[1062, 3492.5, 100, 10], [1062, 3503.5, 100, 10], [950, 3503.5, 100, 10], [788, 3511, 100, 10], [950, 3511, 100, 10], [788, 3522, 100, 10], [506, 3533, 100, 10], [788, 3533, 100, 10],
		[788, 3544, 100, 10], [950, 3544, 100, 10], [950, 3555, 100, 10], [950, 3566, 100, 10], [950, 3577, 100, 10], [950, 3588, 100, 10], [950, 3599, 100, 10], [788, 3606.5, 100, 10],
		[950, 3606.5, 100, 10], [1062, 3606.5, 100, 10], [1062, 3617.5, 100, 10], [1062, 3628.5, 100, 10], [1062, 3639.5, 100, 10], [1062, 3650.5, 100, 10], [1062, 3661.5, 100, 10],
		[1062, 3672.5, 100, 10], [1062, 3683.5, 100, 10], [1062, 3694.5, 100, 10], [950, 3654.25, 100, 10], [950, 3702, 100, 10], [1062, 3702, 100, 10], [1062, 3713, 100, 10],
		[1062, 3724, 100, 10], [1062, 3735, 100, 10], [1062, 3746, 100, 10], [1062, 3757, 100, 10], [950, 3768, 100, 10], [1062, 3768, 100, 10], [950, 3779, 100, 10],
		[1062, 3779, 100, 10], [1062, 3790, 100, 10], [788, 3790, 100, 10], [950, 3790, 100, 10], [950, 3801, 100, 10], [788, 3812, 100, 10], [950, 3812, 100, 10], [1062, 3812, 100, 10],
		[950, 3823, 100, 10], [1062, 3823, 100, 10], [950, 3834, 100, 10], [950, 3845, 100, 10], [950, 3856, 100, 10], [1062, 3856, 100, 10], [950, 3867, 100, 10], [1062, 3867, 100, 10],
		[1174, 3867, 100, 10], [950, 3878, 100, 10], [788, 3889, 100, 10], [950, 3889, 100, 10], [1062, 3889, 100, 10], [950, 3900, 100, 10], [1062, 3900, 100, 10], [1062, 3911, 100, 10],
		[1062, 3922, 100, 10], [1062, 3933, 100, 10], [1062, 3944, 100, 10], [950, 3911, 100, 10], [950, 3922, 100, 10], [788, 3933, 100, 10], [950, 3933, 100, 10], [950, 3944, 100, 10],
		[788, 3944, 100, 10], [788, 3955, 100, 10], [950, 3955, 100, 10], [1062, 3955, 100, 10], [1062, 3966, 100, 10], [1062, 3977, 100, 10], [1062, 3988, 100, 10], [1062, 3999, 100, 10],
		[1062, 4010, 100, 10], [1062, 4021, 100, 10], [1062, 4032, 100, 10], [1062, 4043, 100, 10], [1174, 4043, 100, 10], [950, 4050.5, 100, 10], [1062, 4050.5, 100, 10], [1062, 4061.5, 100, 10],
		[950, 4072.5, 100, 10], [1062, 4072.5, 100, 10], [1174, 4072.5, 100, 10], [950, 4083.5, 100, 10], [1062, 4083.5, 100, 10], [1062, 4094.5, 100, 10], [1062, 4105.5, 100, 10],
		[1062, 4116.5, 100, 10], [1062, 4127.5, 100, 10], [1062, 4138.5, 100, 10], [1062, 4149.5, 100, 10], [1062, 4160.5, 100, 10], [1062, 4171.5, 100, 10], [1062, 4182.5, 100, 10],
		[1062, 4193.5, 100, 10], [1062, 4204.5, 100, 10], [950, 4215.5, 100, 10], [1062, 4215.5, 100, 10], [1062, 4226.5, 100, 10], [1062, 4237.5, 100, 10], [1062, 4248.5, 100, 10],
		[950, 4237.5, 100, 10], [950, 4259.5, 100, 10], [1062, 4259.5, 100, 10], [1062, 4270.5, 100, 10], [1062, 4281.5, 100, 10], [1062, 4292.5, 100, 10], [1062, 4303.5, 100, 10],
		[1062, 4314.5, 100, 10], [1062, 4325.5, 100, 10], [1062, 4336.5, 100, 10], [1062, 4347.5, 100, 10], [1062, 4358.5, 100, 10], [1062, 4369.5, 100, 10], [950, 4270.5, 100, 10],
		[950, 4281.5, 100, 10], [950, 4292.5, 100, 10], [788, 4167.75, 100, 10], [788, 4380.5, 100, 10], [950, 4380.5, 100, 10], [1062, 4380.5, 100, 10], [950, 4391.5, 100, 10],
		[950, 4402.5, 100, 10], [950, 4413.5, 100, 10], [1062, 4413.5, 100, 10], [950, 4424.5, 100, 10], [950, 4435.5, 100, 10], [788, 4391.5, 100, 10], [506, 4435.5, 100, 10],
		[788, 4435.5, 100, 10], [788, 4446.5, 100, 10], [950, 4446.5, 100, 10], [950, 4457.5, 100, 10], [1062, 4457.5, 100, 10], [950, 4468.5, 100, 10], [788, 4479.5, 100, 10],
		[950, 4479.5, 100, 10], [788, 4490.5, 100, 10], [506, 4501.5, 100, 10], [788, 4501.5, 100, 10], [950, 4501.5, 100, 10], [950, 4512.5, 100, 10], [950, 4523.5, 100, 10],
		[950, 4534.5, 100, 10], [950, 4545.5, 100, 10], [950, 4556.5, 100, 10], [950, 4567.5, 100, 10], [950, 4578.5, 100, 10], [950, 4589.5, 100, 10], [788, 4597, 100, 10],
		[950, 4597, 100, 10], [1062, 4597, 100, 10], [950, 4608, 100, 10], [950, 4619, 100, 10], [950, 4630, 100, 10], [950, 4641, 100, 10], [1062, 4641, 100, 10], [950, 4652, 100, 10],
		[1062, 4652, 100, 10], [950, 4663, 100, 10], [950, 4674, 100, 10], [950, 4685, 100, 10], [788, 4696, 100, 10], [950, 4696, 100, 10], [950, 4707, 100, 10], [788, 4707, 100, 10],
		[788, 4718, 100, 10], [950, 4718, 100, 10], [788, 4729, 100, 10], [950, 4729, 100, 10], [950, 4740, 100, 10], [950, 4751, 100, 10], [950, 4762, 100, 10], [950, 4773, 100, 10],
		[950, 4784, 100, 10], [1062, 4784, 100, 10], [1062, 4795, 100, 10], [1062, 4806, 100, 10], [950, 4795, 100, 10], [788, 4806, 100, 10], [950, 4806, 100, 10], [788, 4817, 100, 10],
		[788, 4828, 100, 10], [788, 4839, 100, 10], [788, 4850, 100, 10], [788, 4861, 100, 10], [788, 4872, 100, 10], [506, 4883, 100, 10], [788, 4883, 100, 10], [788, 4894, 100, 10],
		[788, 4905, 100, 10], [788, 4916, 100, 10], [788, 4927, 100, 10], [788, 4938, 100, 10], [788, 4949, 100, 10], [788, 4960, 100, 10], [788, 4971, 100, 10], [506, 4982, 100, 10],
		[788, 4982, 100, 10], [950, 4982, 100, 10], [1062, 4982, 100, 10], [950, 4993, 100, 10], [950, 5004, 100, 10], [788, 4993, 100, 10], [788, 5004, 100, 10], [788, 5015, 100, 10],
		[950, 5015, 100, 10], [950, 5026, 100, 10], [950, 5037, 100, 10], [788, 5029.75, 100, 10], [788, 5044.5, 100, 10], [950, 5044.5, 100, 10], [788, 5055.5, 100, 10],
		[788, 5066.5, 100, 10], [950, 5066.5, 100, 10], [788, 5077.5, 100, 10], [950, 5077.5, 100, 10], [950, 5088.5, 100, 10], [1062, 5088.5, 100, 10], [506, 5088.5, 100, 10],
		[788, 5088.5, 100, 10], [788, 5099.5, 100, 10], [950, 5099.5, 100, 10], [788, 5110.5, 100, 10], [950, 5110.5, 100, 10], [788, 5121.5, 100, 10], [950, 5121.5, 100, 10],
		[950, 5132.5, 100, 10], [950, 5143.5, 100, 10], [788, 5136.25, 100, 10], [788, 5151, 100, 10], [950, 5151, 100, 10], [950, 5162, 100, 10], [788, 5173, 100, 10], [950, 5173, 100, 10],
		[950, 5184, 100, 10], [950, 5195, 100, 10], [788, 5184, 100, 10], [788, 5195, 100, 10], [788, 5206, 100, 10], [788, 5217, 100, 10], [788, 5228, 100, 10], [506, 5099.5, 100, 10],
		[220, 5178.5, 120, 124], [506, 5235.5, 100, 10], [788, 5235.5, 100, 10], [506, 5246.5, 100, 10], [506, 5257.5, 100, 10], [506, 5268.5, 100, 10], [788, 5268.5, 100, 10],
		[506, 5279.5, 100, 10], [506, 5290.5, 100, 10], [506, 5301.5, 100, 10], [506, 5312.5, 100, 10], [506, 5323.5, 100, 10]];

	TestPerformance("Performance of getCrossingRectangles", demoLabels, false);
	TestPerformance("Performance of brute force test function", demoLabels, true);
});