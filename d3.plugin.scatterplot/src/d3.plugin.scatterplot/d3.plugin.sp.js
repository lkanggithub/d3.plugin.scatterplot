function TimeScatterPlot(conf) {
	var data={field:null,value:null};
    var dataDomain={};
    var normDomain=[0.0,1.0];
    var normFunc={};
    var axisVars={x:null,y:null};
    var time=[[1,366]];
	var colorRange=['rgb(153,216,201)','rgb(35,139,69)','rgb(247,252,185)','rgb(240,59,32)','rgb(254,153,41)','rgb(127,205,187)','rgb(37,52,148)'];
    var scaledColor=d3.scale.linear()
	.domain([1,61,121,181,241,366])
	.range(colorRange);

    function chart(selection){
        selection.each(function(){
        	var dom = d3.select(this);
            var margin = {top:10,right:30,bottom:30,left:30};
            var width=conf.width;
            var height=conf.height;
            width = width - margin.left - margin.right;
            height = height - margin.top - margin.bottom;
            var xScale = d3.scale.linear()
            	.domain(normDomain)
            	.range([ 0, width ]); 
            var yScale = d3.scale.linear()
            	.domain(normDomain)
            	.range([ height, 0 ]);
            var className=conf.className;
            if($('div.'+className+'>svg').length==0){
	            var svg = dom.append('svg')
	            	.attr('width', width + margin.right + margin.left)
	            	.attr('height', height + margin.top + margin.bottom);
	            var main = svg.append('g')
	            	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	            	.attr('width', width)
	            	.attr('height', height)
	            	.attr('class','ui_main');
	            var xAxis = d3.svg.axis()
	            	.scale(xScale)
	            	.orient('bottom');
	            var yAxis = d3.svg.axis()
	            	.scale(yScale)
	            	.orient('left');
	            main.append('g')
	            	.attr('transform', 'translate(0,' + height + ')')
	            	.attr('class','ui_xAxis')
	            	.call(xAxis);
	            main.append('g')
	            	.attr('transform', 'translate(0,0)')
	            	.attr('class','ui_yAxis')
	            	.call(yAxis);
	            main.append('g')
	            	.attr('class','ui_dots');
	            dom.select('.ui_dots').selectAll('circle')
					.data(data.value.filter(function(d,i,arr){
						return d[0]!='null'&&d[data.field.indexOf(axisVars.x)+1]!='null'&&d[data.field.indexOf(axisVars.y)+1]!='null';
					}),function(d,i){
						return [d[0],d[data.field.indexOf(axisVars.x)+1],d[data.field.indexOf(axisVars.y)+1]];
					})
					.enter()
					.append("circle")
					.attr("cy",function(d){
						var _v = Number(d[data.field.indexOf(axisVars.y)+1]);
						return yScale(normFunc[axisVars.y](_v));
					})
					.attr("cx",function(d){
						var _v = Number(d[data.field.indexOf(axisVars.x)+1]);
						return xScale(normFunc[axisVars.x](_v));
					})
					.attr('r',2.5)
					.style("fill", function(d){return scaledColor(d3.time.dayOfYear(new Date(parseInt(d[0])))+1);})
					.on('mouseover',function(){
						d3.select(this).attr('r',6.5);
						d3.select(this).classed('sp_circle_highlight',true);
					})
					.on('mouseout',function(){
						d3.select(this).attr('r',2.5);
						d3.select(this).classed('sp_circle_highlight',false);
					})
					.append("title")
						.text(function(d){return new Date(parseInt(d[0])) + ' ' + d[data.field.indexOf(axisVars.x)+1]+' '+d[data.field.indexOf(axisVars.y)+1];});
	            //class method
	    		updateData = function() {
	                var d3_update = d3.select('.ui_dots').selectAll('circle')
						.data(data.value.filter(function(d,i,arr){
							return d[0]!='null'&&d[data.field.indexOf(axisVars.x)+1]!='null'&&d[data.field.indexOf(axisVars.y)+1]!='null';
						}),function(d,i){
							return [d[0],d[data.field.indexOf(axisVars.x)+1],d[data.field.indexOf(axisVars.y)+1]];
						});
					d3_update
						.attr("cy",function(d){
							var _v = Number(d[data.field.indexOf(axisVars.y)+1]);
							return yScale(normFunc[axisVars.y](_v));
						})
						.attr("cx",function(d){
							var _v = Number(d[data.field.indexOf(axisVars.x)+1]);
							return xScale(normFunc[axisVars.x](_v));
						})
						.attr('r',2.5)
						.style("fill", function(d){return scaledColor(d3.time.dayOfYear(new Date(parseInt(d[0])))+1);})
						.selectAll('title')
	                		.text(function(d){return new Date(parseInt(d[0])) + ' ' + d[data.field.indexOf(axisVars.x)+1]+' '+d[data.field.indexOf(axisVars.y)+1];});               
	                var d3_enter=d3_update.enter();
	                d3_enter.append("circle") 
						.attr("cy",function(d){
							var _v = Number(d[data.field.indexOf(axisVars.y)+1]);
							return yScale(normFunc[axisVars.y](_v));
						})
						.attr("cx",function(d){
							var _v = Number(d[data.field.indexOf(axisVars.x)+1]);
							return xScale(normFunc[axisVars.x](_v));
						})
						.attr('r',2.5).style("fill", function(d){return scaledColor(d3.time.dayOfYear(new Date(parseInt(d[0])))+1);})
						.on('mouseover',function(){
							d3.select(this).attr('r',6.5);
							d3.select(this).classed('sp_circle_highlight',true);
						})
						.on('mouseout',function(){
							d3.select(this).attr('r',2.5);
							d3.select(this).classed('sp_circle_highlight',false);
						})
						.append("title")
							.text(function(d){return new Date(parseInt(d[0])) + ' ' + d[data.field.indexOf(axisVars.x)+1]+' '+d[data.field.indexOf(axisVars.y)+1];});
	                var d3_exit=d3_update.exit();
	                d3_exit.remove();
	                filterByTime();
	            };
	            filterByTime = function(){
	            	d3.select('.ui_dots').selectAll('circle').transition().style('visibility','visible');
	            	d3.select('.ui_dots').selectAll('circle')
	            	.select(function(d,i){
	            		var _filter=true;
	            		$.each(time,function(_idx,interval){
	            			var startTime=parseInt(interval[0]);
	            			var endTime=parseInt(interval[1]);
	            			var t=d3.time.dayOfYear(new Date(parseInt(d[0])))+1;
	            			if(t>=startTime && t<=endTime){
	            				_filter=false;
	            				return false;
	            			}
	            		});
	            		if(_filter==true){
	            			return this;
	            		}
	            	})
	            	.transition()
	                .style('visibility','hidden');
	            };
	            updateColor = function(){
	            	d3.select('.ui_dots').selectAll('circle').style("fill", function(d){return scaledColor(d3.time.dayOfYear(new Date(parseInt(d[0])))+1);})
	            };
	            resize = function(){
		            width = window.innerWidth;
		            height = window.innerHeight;
		            width = width - margin.left - margin.right;
		            height = height - margin.top - margin.bottom;
		            svg.attr("width", width).attr("height", height);
	            };

            }
        });
    };
    
    chart.data = function(args) {
        if (!arguments.length) return data;
        data.field=args.fields;
        data.value=args.value;
        axisVars=args.axisFilter;
        time=args.timeFilter;
        $.each(data.field,function(_idx,_field){
        	var _data = data.value.map(function(value,index){return parseFloat(value[_idx+1]);});
        	dataDomain[_field]=d3.extent(_data);
        	normFunc[_field]=d3.scale.linear().domain(dataDomain[_field]).range(normDomain);
        });
        if (typeof updateData === 'function') updateData();
        return chart;
    };
    chart.axis = function(args){
    	if (!arguments.length) return axisVars;
        var x4Update=false;
        var y4Update=false;
    	if('x' in args && 'y' in args){
    		if (typeof updateData === 'function') updateData();
    	}
        return chart;
    };
    chart.time = function(args){
    	if(!arguments.length) return time;
    	time=args;
        if (typeof filterByTime === 'function') filterByTime();
        return chart;
    };
    chart.color = function(args){
        if (!arguments.length) return scaledColor;
        var _domain=args.domain;
        var _range=args.range;
        scaledColor=d3.scale.linear()
    	.domain(_domain)
    	.range(_range);
        colorRange=_range;
        if (typeof updateColor === 'function') updateColor();
        return chart;
    };
    chart.size = function(args){
        if (!arguments.length) return scaledColor;
        if (typeof resize === 'function') resize();
    	return chart;
    };

    return chart;
}