	/**
	 * author:周宁奕
	 * @example
	 *    var sheet = new Sheet()
	 */

	(function(exports) {
		var pageN = 1;

		function Sheet(node) {
			this.node = $(node);

			this.columnsN = 6;
			this.buttonHeads = [];
			this.gridCharts = [];

			this.defaults = {};
			this.defaults.rowH = 40;
			this.defaults.rowsN = 20;
		};

		////////////////////////////data////////////////////////////
		Sheet.prototype.dataHead = function(dataKeys) {
			this.dataKeys = dataKeys;
		};

		Sheet.prototype.dataLines = function(dataValuesAll) {
			this.dataValuesAll = dataValuesAll;
			this.datasN = this.dataValuesAll.length;

			this.maxes();
			pageN = Math.ceil(this.datasN / this.defaults.rowsN);
		};

		Sheet.prototype.data = function(data) {
			this.dataHead(data.keys);
			this.dataLines(data.values);
		};

		Sheet.prototype.sort = function(index, ki) {
			this.dataValuesAll = _.sortBy(this.dataValuesAll, function(d) {
				return ki * d[index];
			});
		};

		Sheet.prototype.maxes = function() {
			var columnsN = this.columnsN;
			this.maxList = [];
			this.minList = [];
			this.percentBolList = [];
			for (var i = 1; i < columnsN; i++) {
				this.maxList[i] = _.max(this.dataValuesAll, function(d) {
					return d[i];
				})[i];
				if (this.maxList[i] < 1) {
					this.percentBolList = true;
				} else {
					this.percentBolList = false;
				}
			}
		};

		//获得本页面的所需数据 把输入的数据取20个出来
		Sheet.prototype.dataPage = function(index) {
			var rowsN = this.defaults.rowsN;
			var datasN = this.datasN
			var dataAllCopy = _.clone(this.dataValuesAll);
			var min = Math.max((index - 1) * rowsN, 0);
			var max = Math.min(index * rowsN, datasN);
			this.dataValues = dataAllCopy.splice(min, max);
		};

		////////////////////////////综合////////////////////////////
		Sheet.prototype.update = function() {
			this.page(1);
			this.updateLines();
		};

		////////////////////////////////////初始化各个dom节点////////////////////////////////////
		Sheet.prototype.render = function() {
			this.node.empty();

			this.node.css('border', '1px solid #ddd');

			this.dataPage(1);
			this.head(this.dataKeys);
			this.firstLine();

			var nodeLinesH = this.defaults.rowsN * this.defaults.rowH + 'px';
			var nodeLines = this.nodeLines = $('<div id="nodeLines" class="list-group col-xs-12"></div>').css(linesCss)
				// .css('minHeight', nodeLinesH);

			this.node.append(nodeLines);
			this.lines();
			this.updateLines();
			this.updateFirstLine();

			this.pages();
			this.floatTag = new FloatTag(this.node);
			// this.even();
		};

		//初始化表头的dom节点
		Sheet.prototype.head = function(dataKeys) {
			var self = this;
			var rowH = this.defaults.rowH + 'px';
			var nodeHead = this.nodeHead = $('<ul class="list-group col-xs-12"></ul>')
				.css(lineCss)
				.css({
					'height': rowH,
					'lineHeight': rowH
				})
				.fadeIn();
			this.node.append(nodeHead);
			var columnsN = this.columnsN;
			for (var i = 0; i < columnsN; i++) {
				var name = dataKeys[i].name;
				var nodeHeadButton = $('<div class="btn col-xs-2"></div>');
				this.nodeHead.append(nodeHeadButton);

				///////这步和业务抽离的不大好
				var buttonHead = new Button(nodeHeadButton)
					.text(name)
					.none();
				if (i != 0) {
					var up = function(columni) {
						return function() {
							self.cleanHeadButton();
							self.sort(columni, 1);
							self.page(1);
						}
					}(i)
					var down = function(columni) {
						return function() {
							self.cleanHeadButton();
							self.sort(columni, -1);
							self.page(1);
						}
					}(i)
					buttonHead
						.rankable({
							down: down,
							up: up
						})
				}
				this.buttonHeads.push(buttonHead);
			}
		}

		//将headbutton中 排序指示部分清空
		Sheet.prototype.cleanHeadButton = function() {
			var buttonHeads = this.buttonHeads;
			for (var k in buttonHeads) {
				buttonHeads[k].none();
			}
		}

		Sheet.prototype.firstLine = function() {
			var nodeFisrtLine = $('<ul class="list-group col-xs-12"></ul>')
				.css(firstLineCss)
				.attr('id', 'firstLine')
				.fadeIn();

			this.node.append(nodeFisrtLine);
			this.nodeFisrtLine = nodeFisrtLine;

			// var node = this.textButton(nodeFisrtLine, '', 0).text('');
			// var node1 = node.clone().attr('id', 'headBotton1').text('');
			// var span1 = $('<span id="headSpan1"></span>').css({
			// 	'position': 'absolute',
			// 	'right': '0px',
			// 	'fontSize': '12px',
			// 	'color': '#999'
			// }).text(100);
			// var span0 = $('<span id="headSpan0"></span>').css({
			// 	'position': 'absolute',
			// 	'left': '10%',
			// 	'fontSize': '12px',
			// 	'color': '#999'
			// }).text(0);
			// node1.append(span0).append(span1);
			// nodeFisrtLine.append(node1);

			// var node2 = node.clone().attr('id', 'headBotton2').text('');
			// var span0 = $('<span id="headSpan0"></span>').css({
			// 	'position': 'absolute',
			// 	'left': '10%',
			// 	'fontSize': '12px',
			// 	'color': '#999'
			// }).text(0);
			// var span1 = $('<span id="headSpan1"></span>').css({
			// 	'position': 'absolute',
			// 	'left': '50%',
			// 	'fontSize': '12px',
			// 	'color': '#999'
			// }).text(100);
			// var span2 = $('<span id="headSpan2"></span>').css({
			// 	'position': 'absolute',
			// 	'left': '90%',
			// 	'fontSize': '12px',
			// 	'color': '#999'
			// }).text(100);
			// node2.append(span0).append(span1).append(span2);
			// nodeFisrtLine.append(node2);
		};

		Sheet.prototype.updateFirstLine = function() {
			var self = this;
			var value1 = self.maxList[1];
			if (this.percentBol) {
				value1 = parseFloat(value1 * 100).toFixed(2) + '%';
			} else {
				value1 = value1.toFixed(2);
			}
			var value2 = parseInt(self.maxList[2], 10)
			this.nodeFisrtLine.find('#headBotton1').find('#headSpan1').text(value1);
			this.nodeFisrtLine.find('#headBotton2').find('#headSpan2').text(value2);
		};

		Sheet.prototype.pages = function() {
			var nodePage = $('<ul id="pages" class="list-group col-xs-12"></ul>')
				.css({
					'position': 'relative',
					'-webkit-transition': 'all .3s ease-in-out',
					'textAlign': 'left',
					'marginBottom': '0px',
					'padding': '0px 10px',
					'margin': '0px 1px',
					'width': '100%',
					'height': '40px',
					'lineHeight': '40px',
					'background': '#fff'
				});

			this.node.append(nodePage);

			for (var k = 1; k < pageN + 1; k++) {
				this.pageButton(nodePage, k);
			}
		};

		Sheet.prototype.pageButton = function(node, value) {
			var self = this;
			var pageButton = $('<div></div>')
				.css({
					'position': 'relative',
					'top': '0px',
					'float': 'left',
					'-webkit-transition': 'all .3s ease-in-out',
					'textAlign': 'center',
					'padding': '0px 0px',
					'fontSize': '16px',
					'margin': '1px 1px',
					'background': 'rgba(50,50,50,0.1)',
					'borderRadius': '3px',
					'width': '30px',
					'height': '30px',
					'lineHeight': '30px',
					'cursor': 'pointer',
					'color': '#fff',
				})
				.text(value)
				.click(function(e) {
					self.page(value);
				});
			node.append(pageButton);
		};

		curExpandNode = '';

		var lineHtml = '<div class="list-group col-md-12 row"></div>';
		var expandHtml = '<div class="expand"></div>';
		var expandCss = {
			'height': '360px',
			'lineHeight': '360px',
		}
		var shrinkCss = {
			'height': '0px',
			'lineHeight': '0px',
			'background': '#fff',
		}

		var cleanCss = {
			'padding': '0px 0px"',
			'margin': '0px 0px'
		}

		Sheet.prototype.expand = function(node) {
			var self = this;
			var id = node.attr('id');
			$(curExpandNode).remove();

			curExpandNode = $(expandHtml)
				.css(cleanCss)
				.css(shrinkCss)
				.css(animateQuik)
				.click(function(e) {
					e.stopPropagation();
				})

			node.append(curExpandNode);
			setTimeout(function() {
				curExpandNode
					.css(expandCss);
				self.lineTabs(curExpandNode, id);
			}, 10);
		}

		Sheet.prototype.shrink = function() {
			$(curExpandNode).children().fadeOut();
			$(curExpandNode).css(shrinkCss);
		}

		/////////////////////////////////line/////////////////////////////////
		Sheet.prototype.lines = function(dataValues, callback) {
			if (!dataValues) {
				dataValues = this.dataValues;
			};
			var i = 0
			for (var index in dataValues) {
				var data = dataValues[index];
				this.line(data, index);
			}
		};

		//绘制一行的表
		Sheet.prototype.line = function(data, lineIndex) {
			var self = this;
			var compositeID = data[7];
			var lineNode = $('<ul title class="list-group col-md-12 row"></ul>')
				.css(lineCss)
				.css(animateNormal)
				.attr('select', 'false')
				.attr('id', compositeID)
				.hover(function(e) {
					if ($(this).attr('select') === 'false') {
						$(this).css('background', '#eee');
					}
				}, function() {
					if ($(this).attr('select') === 'false') {
						$(this).css('background', 'rgb(255, 255, 255)');
					}
				})
				.delegate('.col-xs-2', 'mouseover',
					function(e) {
						var node = $(this);
						var index = node.attr('index');
						var value = node.parent().data()[index];
						if (value) {
							var data = [
								['值', value]
							];
							self.floatTag.show(data, node);
						}
					}
				)
				.delegate('.col-xs-2', 'mouseout',
					function(e) {
						var node = $(this);
						self.floatTag.hide(data, node);
					}
				)
				.click(
					function(e) {
						var node = $(this);
						var type = node.attr('select');
						if (type == 'false') {
							self.nodeLines.children().css('opacity', 0.2);
							self.expand(node);
							node.css('opacity', 1)
								.css('background', '#eee')
								.attr('select', 'true');
						} else if (type == 'true') {
							self.shrink();
							self.nodeLines.children().css('opacity', 1)
								.css('background', 'rgb(255, 255, 255)');
							node.attr('select', 'false')
								.css('background', '#eee')
						}
					}
				)
				.attr('index', lineIndex)
				.data(_.clone(data));
			this.nodeLines.append(lineNode);

			var columnsN = this.columnsN;
			var gridCharts = this.gridCharts[lineIndex] = [];
			for (var i = 0; i < columnsN; i++) {
				var value = data[i]
				var d = [
					['值', value]
				];
				var nodeGrid = this.grid(lineNode, d, i);
				var gridChart = new Button(nodeGrid).bg('rgba(255,255,255,0)');
				var type = this.dataKeys[i].type;
				if (type == 'text') {
					gridChart.text(value);
				} else if (type == 'chartColumn') {
					var max = this.maxList[i];
					gridChart.chartColumn(value, max);
				} else if (type == 'textColor') {
					gridChart.textColor(value);
				}
				gridCharts.push(gridChart);
			}
		};

		Sheet.prototype.grid = function(container, data, i) {
			var rowH = this.defaults.rowH + 'px';
			var self = this;
			var nodeGrid = $('<div class="btn col-xs-2"></div>')
				.css(gridCss)
				.css({
					'lineHeight': rowH,
					'height': rowH,
				})
				.attr('index', i);
			container.append(nodeGrid);
			return nodeGrid;
		};

		Sheet.prototype.updateLines = function() {
			this.clean();
			this.shrink();
			var dataValues = this.dataValues;
			var columnsN = this.columnsN;
			for (var lineIndex in dataValues) {
				var data = dataValues[lineIndex];
				var lineNode = this.nodeLines.children()[lineIndex];
				lineNode = $(lineNode);
				lineNode.attr('id',data[7]);
				lineNode.data(data).css('opacity', 1);
				for (var i = 0; i < columnsN; i++) {
					var d = data[i];
					var max = this.maxList[i];
					this.gridCharts[lineIndex][i].value(d, max);
				}
			}
		};

		//换到某一页
		Sheet.prototype.page = function(index) {
			this.dataPage(index);
			this.updateLines();
		};

		Sheet.prototype.even = function() {
			var te = this.nodeLines.find('> :even')
				.css('background', '#dedede');
		};

		Sheet.prototype.clear = function() {
			var node = this.nodeLines;
			if (node) {
				node.find('ul').find('*').remove();
			}
		};

		Sheet.prototype.clean = function() {
			this.nodeLines.children().each(function(i, d) {
				$(d).css('opacity', '0');
				$(d).data([]);
			});
		}

		Sheet.prototype.lineTabs = function(node, id) {
			node.css({
				'padding': '0px 0px',
				'margin': '0px 0px'
			});
			var tabs =
				$(
					'<div class="tab">\
	<ul class="btn tabs col-xs-12"}>\
		<li class="col-xs-2"><a href="#">收益追踪</a></li>\
		<li class="col-xs-2"><a href="#">组合持仓</a></li>\
		<li class="col-xs-2"><a href="#">组合变化</a></li>\
	</ul>\
	<div class="tab_content list-group col-xs-12">\
		<div class="tabs_item">\
		<div id="income_chart" class="tabs_item_chart"></div>\
		</div>\
		<div class="tabs_item">\
		<div id="combine_sheet" class="tabs_item_chart"></div>\
		</div>\
		<div class="tabs_item">\
		<div id="combine_income_sheet" class="tabs_item_chart""></div>\
		</div>\
	</div>\
</div>');

			tabs.find('ul').css({
				'padding': '0px 0px',
				'margin': '0px 0px',
				'border': 'none',
			});
			tabs.find('.tab_content').css({
				'padding': '0px 0px',
				'margin': '0px 0px',
				'border': 'none',
				'background': '#fff',
				'overflow': 'scroll'
			});
			node.append(tabs);

			$('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');

			$('.tab ul.tabs li a').click(function(g) {
				var tab = $(this).closest('.tab');
				index = $(this).closest('li').index();
				tab.find('ul.tabs > li').removeClass('current');
				$(this).closest('li').addClass('current');

				var up = tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
				var dowm = tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();
				g.preventDefault();
			});

			$('#income_chart').css({
				background: '#fff'
			})
			$('#combine_sheet').css({
				background: '#fff'
			})
			$('#combine_income_sheet').css({
				background: '#fff'
			})
			$('#income_text').css({
				background: '#fff'
			})
			$('#combine_text').css({
				background: '#fff'
			})
			$('#combine_income_text').css({
				background: '#fff'
			})

			var self = this;
			setTimeout(function(){
			self.lineTab1($('#income_chart'), id);
			self.lineTab2($('#combine_sheet'), id);
			self.lineTab3($('#combine_income_sheet'), id);
		},150);
		}

		Sheet.prototype.lineTab1 = function(node, id) {
			/////////////////////???????? id 不能适应所有的情况， 接口好了要删除这行/////////////////////????????
			var now = new Date();
			var dataFrom = now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate();
			var dataTo = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
			var url = window.base + '/lx-web/rest/composite/' + id + '/record?from=' + dataFrom + '&to=' + dataTo;
			
			$.ajax({
				type: "GET",
				dataType: 'jsonp',
				url: url,
				success: function(data) {
					var chartData = [];
					for (var k in data) {
						var obj = data[k];
						var time = obj.recordDate;
						var timeArr = time.split('-');
						time = timeArr[1]+'.'+timeArr[2];
						var totalValue = obj.totalValue;
						chartData.push(['0', time, totalValue]);
					}
					var chartOption = {
						lineSize: 3,
						nodeRadius: 2,
						subtitle: "最大活跃度",
						lineColor: ['#f60', 'rgb(0,150,150)'],
						nodeColor: ['#f60', 'rgb(0,150,150)'],
						margin: [30, 10, 100, 60]
					};
					var chart = new Line(node, chartOption);
					chart.setSource(chartData, {
						line: 0,
						x: 1,
						value: 2
					});
					chart.render();
				},
				error: function(e) {
					console.log(e, '==')
				}
			});
		}

		Sheet.prototype.lineTab2 = function(node, id) {
			/////////////////////???????? id 不能适应所有的情况， 接口好了要删除这行/////////////////////????????
			var url = window.base + '/lx-web/rest/composite/' + id + '/stock';
			var dataHead =
				[{
						name: '股票名',
						type: 'text',
						key: function(obj) {
							return obj.stock.name
						}
					}, {
						name: '最新价',
						type: 'text',
						key: function(obj) {
							return obj.price
						}
					}, {
						name: '涨跌',
						type: 'text',
						key: function(obj) {
							return obj.stock.todayChange;
						}
					}, {
						name: '涨幅',
						type: 'text',
						key: function(obj) {
							return obj.stock.todayChangeRate;
						}
					}, {
						name: '占用资金',
						type: 'text',
						key: function(obj) {
							return obj.costPrice;
						}
					},{
						name: '收益率',
						type: 'text',
						key: function(obj) {
							return obj.floatReturnRate
						}
					},{
						name: '持仓比例',
						type: 'text',
						key: function(obj) {
							return obj.stockPosition;
						}
					}
				];
			$.ajax({
				type: "GET",
				dataType: 'jsonp',
				url: url,
				success: function(data) {
					var dataLines = [];
					for (var k = 0; k < data.length; k++) {
						var obj = data[k];
						var dataLine = []
						for (var j = 0; j < dataHead.length; j++) {
							var func = dataHead[j].key;
							dataLine[j] = func(obj);
						}
						dataLines.push(dataLine);
					}
					var table = new Table(node);
					table.dataHead(dataHead);
					table.dataLines(dataLines);
					table.render();
				},
				error: function(e) {
					console.log(e, '==')
				}
			});
		}
		Sheet.prototype.lineTab3 = function(node, id) {
			var lineN = 5;
			var url = window.base + '/lx-web/rest/composite/' + id + '/transaction?pn=1&ps=' + lineN;
			var dataHead =
				[{
						name: '日期',
						type: 'text',
						key: function(obj) {
							return obj.date
						}
					}, {
						name: '股票名',
						type: 'text',
						key: function(obj) {
							return obj.stock.name;
						}
					}, {
						name: '买入价',
						type: 'text',
						key: function(obj) {
							return obj.price;
						}
					},
					{
						name: '数量',
						type: 'text',
						key: function(obj) {
							return obj.amount;
						}
					} ,{
						name: '总值',
						type: 'text',
						key: function(obj) {
							return obj.totalValue
						}
					}
					// {name:'持仓比例',type:'text',key:function(obj){return obj.floatReturnRate}},
				];
			$.ajax({
				type: "GET",
				dataType: 'jsonp',
				url: url,
				success: function(data) {
					var dataLines = [];
					for (var k = 0; k < data.length; k++) {
						var obj = data[k];
						var dataLine = []
						for (var j = 0; j < dataHead.length; j++) {
							var func = dataHead[j].key;
							dataLine[j] = func(obj);
						}
						dataLines.push(dataLine);
					}
					var table = new Table(node);
					table.dataHead(dataHead);
					table.dataLines(dataLines);
					table.render();
				},
				error: function(e) {
					console.log(e, '==')
				}
			});
		}

		exports.Sheet = Sheet;

		//////////////////////css//////////////////////
		/*
		通过对象定义css,通过jquery的extend方法合并css
		 */

		var bottonCss = {};

		var animateQuik = {
			'-webkit-transition': 'all .1s ease-in-out',
			'-moz-transition': 'all .1s ease-in-out',
			'-ms-transition': 'all .1s ease-in-out',
			'-o-transition:': 'all .1s ease-in-out',
			'transition:': 'all .1s ease-in-out'
		};

		var animateNormal = {
			'-webkit-transition': 'all .3s ease-in-out',
			'-moz-transition': 'all .3s ease-in-out',
			'-ms-transition': 'all .3s ease-in-out',
			'-o-transition:': 'all .3s ease-in-out',
			'transition:': 'all .3s ease-in-out'
		};

		var animateSlow = {
			'-webkit-transition': 'all .9s ease-in-out',
			'-moz-transition': 'all .9s ease-in-out',
			'-ms-transition': 'all .9s ease-in-out',
			'-o-transition:': 'all .9s ease-in-out',
			'transition:': 'all .9s ease-in-out'
		};

		var linesCss = {
			'position': 'relative',
			'width': '100%',
			'padding': '0px 0px',
			'margin': '0px 0px',
		};


		var lineCss = {
			'border': 'none',
			'borderRadius': '2px',
			'cursor': 'pointer',
			'width': '100%',
			'margin': '0px 0px',
			'padding': '0px 0px',
			'verticalAlign': 'middle',
		};

		var headCss = $.extend(lineCss, {});

		var firstLineCss = {
			'position': 'relative',
			'marginBottom': '0px',
			'padding': '0px 0px',
			'margin': '0px 0px',
			'width': '100%',
			'height': '40px',
			'lineHeight': '1.2',
		}

		var lineHeadCss = {}

		var headCss = {
			'position': 'relative',
			'textAlign': 'left',
			'marginBottom': '0px',
			'padding': '0px 0px',
			'margin': '0px 0px',
			'width': '100%',
			'lineHeight': '1.2',
		};

		var gridCss = {
			'borderRadius': '2px',
			'position': 'relative',
			'textAlign': 'left',
			'marginBottom': '0px',
			'padding': '0px 0px',
			'margin': '0px 0px',
		}
	})(window);
