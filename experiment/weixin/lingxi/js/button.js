	/**
	 * @ 周宁奕 2014.07
	 * @example
	 * requrie jquery bootstrap
	 *    var sheet = new Sheet()
	 */

	(function(exports) {
		function Button(node, option) {
			this.node = $(node).css({
				'margin': '0px 0px',
				'padding': '0px 0px',
				'border': 'none',
				'height': '40px',
				'lineHeight': '40px',
			});
			this.height = 40;

			option = option || {};
			this.defaults = {};
			this.defaults.bgColor = option.bgColor || 'rgba(0,0,0,0.1)';
			this.defaults.color = option.color || '#333';
			this.type = '';

			this.main();
			return this;
		};

		Button.prototype.main = function() {
			var color = this.defaults.color;
			var bgColor = this.defaults.bgColor;
			var mainNode = this.mainNode = $('<div></div>')
				.css(mainCss)
				.css('background', bgColor)
				.css('color', color);
			this.node.append(mainNode);
		}

		Button.prototype.text = function(text) {
			this.mainNode
				.css({
					'padding': '0px 0px 0px 10%',
					'fontWeight':'bold'
				})
				.text(text);

			this.type = 'text';
			return this;
		}

		Button.prototype.textColor = function(text) {
			text = parseFloat(text);
			var color = text>0?'#f93':'#3a5';
			this.mainNode
				.css({
					'padding': '0px 0px 0px 10%',
					'color':color,
					'fontWeight':'bold'
				})
				.text(text);

			this.type = 'textColor';
			return this;
		}

		Button.prototype.bg = function(bgColor) {
			this.mainNode.css({
				'background': bgColor,
			});
			return this;
		}

		Button.prototype.animateble = function() {
			this.node.css(animateNormal);
		};

		//////////////////////rankable//////////////////////

		Button.prototype.rankable = function(callbacks) {
			this.node.hover(function(){
				$(this).css('opacity', 0.8);
			},function(){
				$(this).css('opacity', 1);
			});
			this.rankUp = callbacks.up || function() {};
			this.rankDown = callbacks.down || function() {};

			var self = this;
			var percent = 20;
			this.statu = 1000;
			var height = this.height;
			var bgColor = this.defaults.bgColor;
			this.mainNode
				.css({
					'fontWeight': 'bold',
					'width': (100 - percent) + '%',
					'lineHeight': height + 'px',
					'height': height + 'px',
					'float': 'left',
					'color': '#333',
				})
				.css(animateNormal)
				.click(self.change.bind(this))

			var markNode = this.markNode = $('<div></div>')
				.css({
					'width': percent + '%',
					'height': 100 + '%',
					'lineHeight': height + 'px',
					'float': 'left',
					'background': 'rgba(0,0,0,0.1)',
					'color': '#fff'
				});
			this.node.append(markNode);

			return this;
		};

		Button.prototype.none = function() {
			if (this.markNode) {
				this.markNode.text('');
			}
			this.statu = 1001;
			return this;
		};

		//升序排列
		Button.prototype.up = function() {
			this.rankUp();
			this.markNode.text('▲');
			this.statu = 1;
		}
		//降序排列
		Button.prototype.down = function() {
			this.rankDown();
			this.markNode.text('▼');
			this.statu = 0;
		};

		Button.prototype.change = function() {
			var statu = this.statu;
			if (statu > 100) {
				this.down();
				return;
			}
			this.statu = (this.statu + 1) % 2;
			if (this.statu === 1) {
				this.up();
			} else if (this.statu === 0) {
				this.down();
			}
		};

		Button.prototype.content = function() {
			var content =
				$('<div id="content" class="content">' +
					'<div class="menu">' +
					'<p id="sales50">仅销量前50</p>' +
					'<p id=>仅销量前100</p>' +
					'<p id="sales150">仅销量前150</p>' +
					'<p id="sales200">仅销量前200</p>' +
					'</div>' +
					'</div>')
				.css('zIndex', '100000');

			// rankBotton.append(content);
			// setTimeout(function() {
			// 	$(rankBotton).find('#content').fadeOut('fast');
			// }, 10);
		}

		Button.prototype.value = function(value, max) {
			var type = this.type;
			if (type == 'text') {
				this.text(value);
			} else if (type == 'chartColumn') {
				this.chartColumnValue(value, max);
			}else if (type == 'textColor') {
				this.textColor(value);
			}
		}

		//////////////////////chart//////////////////////
		Button.prototype.chartColumn = function(value, max) {
			var valueFormat = format(value);
			this.type = 'chartColumn';

			var mainNode = this.mainNode;
			var node = mainNode.find('#lineChart');
			var ki = (max === 0) ? 0 : value / max;
			var percentage = parseInt(ki * 80) + '%';
			var textNode = $('<div id="textNode" class="btn col-xs-2" ></div>')
			.css({
				'padding':0,
				'width':'20%',
				'lineHeight': '40px',
				'height': '40px',
				'verticalAlign':'middle',
				'textAlign':'right',
				'color':'#f93'
			}).text(valueFormat);
			mainNode.append(textNode);

			var node = $('<div id="lineChart" class="btn col-xs-2" ></div>')
				.css({
					'left': '0px',
					'background': 'transparent',
					'width': '80%',
					'borderRadius': '0px',
					'padding': '0px 0px',
					'margin': '0px 0px',
					'lineHeight': '3',
					'border': 'none',
					'textAlign': 'left',
					'height': '40px',
				});
			mainNode.append(node);

			var column = $('<div id="column"></div>')
				.css(columnCss)
				.css(animateNormal)
				.css({
					'width': percentage,
				});

			node.append(column);

			var self = this;
		}

		Button.prototype.chartColumnValue = function(value, max) {
			var ki = (max === 0) ? 0 : value / max;
			var percentage = parseInt(ki * 80) + '%';
			this.mainNode.find('#lineChart').find('#column').css('width', percentage);
			this.mainNode.find('#textNode').text(format(value));
		}


		Button.prototype.chartColumn2 = function(value, max) {

			var node = $(container).find('#lineChart2');
			var level = 100;
			var delta = (value - level);


			var color = (delta < 0) ? 'rgb(230,120,160)' : 'rgb(120,200,240)';
			var width = (delta < 0) ? parseInt(-delta / (level) * 50) : parseInt(delta / (max - level) * 50);
			var left = (delta < 0) ? 50 - width : 50;

			if (node[0]) {
				node.find('#basic').find('#column').css({
					'left': left + '%',
					'width': width + '%',
					'background': color,
					'webkit-transition': 'all .7s ease-in-out',
				});
			} else {
				var node = $('<button id="lineChart2" class="btn col-xs-2" type="button"></button>')
					.css({
						'background': 'transparent',
						'borderRadius': '0px',
						'padding': '0px 0px',
						'margin': '0px 0px',
						'lineHeight': '3',
						'border': 'none',
						'textAlign': 'left',
						'height': '40px',
					});
				container.append(node);

				var basic = $('<div id="basic"></div>')
					.css({
						'pointerEvents': 'none',
						'position': 'absolute',
						'top': '15px',
						'left': '10%',
						'width': '80%',
						'height': '10px',
						'background': 'rgba(240,240,240,0.4)',
						'lineHeight': '100px',
						'overflow': 'hidden'
					});
				node.append(basic);

				var column = $('<div id="column"></div>')
					.css({
						'webkit-transition': 'all .7s ease-in-out',
						'position': 'absolute',
						'top': '0%',
						'left': left + '%',
						'width': width + '%',
						'height': '100%',
						'background': color,
						'lineHeight': '100px',
					});
				basic.append(column);
			}
			var self = this;
			node.hover(
				function(e) {
					var scrollTop = $(document).scrollTop();
					var left = $(this).offset().left;
					var top = $(this).offset().top - scrollTop;
					var width = $(this).width();
					var height = $(this).height();
					var x = parseInt(left + width / 2);
					var y = parseInt(top + height / 2);

					var data = $(this).parent().data();
					var value = (data[2]).toFixed(2);

					var arr = [
						['数值', value]
					];
					self.floatTag.show(arr, $(this));
				},
				function(e) {
					self.floatTag.hide();
				}
			)
		}

		//////////////////////css//////////////////////
		/*
		通过对象定义css,通过jquery的extend方法合并css
		 */
		var animateNormal = {
			'-webkit-transition': 'all .3s ease-in-out',
			'-o-transition:': 'all .3s ease-in-out',
			'transition:': 'all .3s ease-in-out'
		};

		var mainCss = {
			'borderRadius': '0px',
			'fontWeight': 'normal',
			'textAlign': 'left',
			'height': '100%',
			'fontSize': '16px',
			'border': 'none',
			'margin': '0px 0px',
		}
		var markCss = {
			'borderRadius': '0px',
			'fontWeight': 'normal',
			'textAlign': 'left',
			'height': '100%',
			'fontSize': '14px',
			'border': 'none',
			'margin': '0px 0px',
			'lineHeight': '1.2'
		}
		var columnCss = {
			'position': 'absolute',
			'top': '15px',
			'left': '10%',
			'pointerEvents': 'none',
			'height': '10px',
			'background': '#f93',
			'lineHeight': '100px',
		}

		function format(value){
			return (value/10000).toFixed(1)+'万';
		}
		exports.Button = Button;
	})(window);
