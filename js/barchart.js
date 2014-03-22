var fill = d3.scale.category20();
	
var w = 325;
var h = 400;
	var padding = 0;
	var leftpadding = 0;
	
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	
	var barchart = d3.select("#barchart")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
		
	xScale = d3.scale.linear()
		.domain([0, 10])
		.range([leftpadding, w - padding]);

	barchart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")");
		
function updateBarchart(dataset) {
		
			var barPadding = h / dataset.length / (3 + dataset.length);

			xScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) { return d[1]; })])
				.range([leftpadding, w - padding]);

			yScale = d3.scale.linear()
				.domain([0, dataset.length])
				.range([0, h]);

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
				.style("fill", function(d, i) { return fill(i); });
			
			rects.exit()
				.transition()
				.duration(1000)
				.attr("width", 0)							
				.remove();

			// names
			var names = barchart.selectAll("text.name")
				.data(dataset, function(d) { return d[0]; });
				
			names.enter().append("text")
				.attr("class", "name")
				.attr("text-anchor", "right")
				.attr("x", -100)
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
					return 6;
				})
				.text(function(d, i) {
					return d[0];
				});
			
			names.exit().remove();
				
			barchart.select("g")
				.data(dataset)
				.transition()
				.duration(1000)
				.attr("transform", "translate(0," + (h - 20) + ")");
}