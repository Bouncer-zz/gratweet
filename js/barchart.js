var fill = d3.scale.category20();
	
var w = 400;
var h = $('#barchart').height();
	var padding = 20;
	var leftpadding = 100;
	
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	
	var barchart = d3.select("#barchart")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
		
	xScale = d3.scale.linear()
		.domain([0, 10])
		.range([leftpadding, w - padding]);

	xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(5);

	barchart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
		
function updateBarchart(dataset) {
		
			var barPadding = h / dataset.length / (3 + dataset.length);

			xScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) { return d[1]; })])
				.range([leftpadding, w - padding]);

			yScale = d3.scale.linear()
				.domain([0, dataset.length])
				.range([0, h - 25]);

			xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(5);

			var rects = barchart.selectAll("rect")
				.data(dataset, function(d) { return d[0]; });

			// bars
			rects.enter().append("rect")
				.attr("width", 0)
				.style("fill", function(d, i) { return fill(i); });

			rects.sort(function(a, b) {
					return d3.descending(a[1], b[1]);
				})
				.transition()
				.duration(1000)
				.attr("x", function(d, i) {
					return leftpadding;
				})
				.attr("width", function(d) {
					return xScale(d[1]) - leftpadding;
				})
				.attr("y", function(d, i) {
					return yScale(i) + barPadding;
				})
				.attr("height", h / dataset.length - barPadding * 2)
			
			rects.exit()
				.transition()
				.duration(1000)
				.attr("width", 0)							
				.remove();

			// values
			var values = barchart.selectAll("text.value")
				.data(dataset, function(d) { return d[0]; });
				
			values.enter().append("text")
				.attr("class", "value")
				.attr("x", leftpadding - 20);

			values.sort(function(a, b) {
					return d3.descending(a[1], b[1]);
				})
				.transition()
				.duration(1000)
				.text(function(d) {
					return Math.round(d[1]);
				})
				.attr("x", function(d) {
					return xScale(d[1]) - 30;
				})
				.attr("y", function(d, i) { 
					return yScale(i) + (h / dataset.length / 2) + 6;
				});
				
			values.exit()
				.remove();

			// names
			var names = barchart.selectAll("text.name")
				.data(dataset, function(d) { return d[0]; });
				
			names.enter().append("text")
				.attr("class", "name")
				.attr("text-anchor", "right")
				.attr("x", -10)
				.text(function(d, i) {
					return d[0];
				});

			names.sort(function(a, b) {
					return d3.descending(a[1], b[1]);
				})
				.transition()
				.duration(1000)
				.attr("y", function(d, i) { 
					return yScale(i) + (h / dataset.length / 2) + 6;
				})
				.attr("x", function(d) {
					return 0;
				})
				.text(function(d, i) {
					return d[0];
				});
			
			names.exit().remove();
				
			barchart.select("g")
				.data(dataset)
				.transition()
				.duration(1000)
				.attr("transform", "translate(0," + (h - 20) + ")")
				.call(xAxis);
}