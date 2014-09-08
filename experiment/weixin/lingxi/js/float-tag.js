(function(exports) {
	function FloatTag(node, option) {
		this.node = $(node);

		this.defaults = {};
		option = option||{};
		this.defaults.width = (option.width) ? option.width : 240;
		this.defaults.gridH = (option.gridH) ? option.gridH : 40;
		this.defaults.bgColor = (option.bgColor) ? option.bgColor : '#fff';
		this.defaults.colorLow = (option.colorLow) ? option.colorLow : '#aaa';
		this.defaults.colorHigh = (option.colorHigh) ? option.colorHigh : 'rgb(250,150,50)';
		this.defaults.liN = 1;

		this.init();
	};

	FloatTag.prototype.init = function() {
		var width = this.defaults.width;
		var liN = this.defaults.liN;

		var floatNode = $('<ul></ul>')
			.css({
				'webkit-transition': 'all .2s ease-in-out',
				'position': 'fixed',
				'width': width,
				'left': '0px',
				'top': '120px',
			})
			.hide()
			.append(this.triangle());

			for(var i =0;i<liN;i++){
				floatNode.append(this.li());
			}

		this.floatNode = floatNode;
		this.node.append(floatNode)
	};

	FloatTag.prototype.li = function() {
		var bgColor = this.defaults.bgColor;
		var colorLow = this.defaults.colorLow;
		var colorHigh = this.defaults.colorHigh;

		var gridH = this.defaults.gridH + 'px';
		var li = $('<li></li>')
			.css({
				'width': '100 %',
				'height': gridH,
				'background': bgColor,
				'color': bgColor,
				'opacity': 0.99,
				'boxShadow': '2px 2px 4px rgba(0,0,0,0.4)',
			});

		var nodeKey = $('<div></div>')
			.css({
				'position': 'relavant',
				'color': colorLow,
				'float': 'left',
				'width': '40%',
				'height': gridH,
				'lineHeight': gridH,
				'textAlign': 'center',
				'fontSize': '15px',
			})
		var nodeValue = nodeKey.clone().css({
			'width': '60%',
			'fontWeight': 'bold',
			'color': colorHigh,
		});

		li.append(nodeKey);
		li.append(nodeValue);
		return li;
	};

	FloatTag.prototype.triangle = function() {
		var gridH = parseInt(this.defaults.gridH / 4) + 'px';
		var bgColor = this.defaults.bgColor;
		var tri = $('<div></div>')
			.css({
				'width': '0',
				'borderTop': gridH + ' solid transparent',
				'borderRight': gridH + ' solid transparent',
				'borderBottom': gridH + ' solid ' + bgColor,
				'borderLeft': gridH + ' solid transparent',
				'margin': '0 auto',
				'height': gridH,
			});
		return tri;
	};

	FloatTag.prototype.show = function(arr, node) {
		var scrollTop = $(document).scrollTop();
		var left = node.offset().left;
		var top = node.offset().top - scrollTop;
		var width = node.width();
		var height = node.height();
		var x = left;
		var y = parseInt(top + height / 2) + parseInt(this.defaults.gridH / 4);

		this.floatNode
			.css('left', x + 'px')
			.css('top', y + 'px')
			.show();

		var nodes = this.floatNode.children('li');

		for (var i in arr) {
			var divs = nodes.eq(i).find('div');
			$(divs[0]).text(arr[i][0] + ':');
			$(divs[1]).text(arr[i][1]);
		};
	};

	FloatTag.prototype.hide = function() {
		this.floatNode.hide();
	};
	
	exports.FloatTag = FloatTag;
})(window);
