	/**
	 * author:周宁奕
	 * @example
	 *    var sheet = new Sheet()
	 */

define(function(require, exports, module) {
		function Table(node) {
			this.node = $(node);

			this.columnsN = 0;
			this.buttonHeads = [];
			this.gridCharts = [];

			this.defaults = {};
			this.defaults.rowH = 40;
			this.defaults.rowsN = 20;
		};

		////////////////////////////data////////////////////////////
		Table.prototype.dataHead = function(dataKeys) {
			this.dataKeys = dataKeys;
			this.columnsN = this.dataKeys.length;
			this.defaults.columnsN = dataKeys.length;
		};

		Table.prototype.dataLines = function(dataValuesAll) {
			this.dataValuesAll = dataValuesAll;
			this.datasN = this.dataValuesAll.length;
		};

		Table.prototype.data = function(data) {
			this.dataHead(data.keys);
			this.dataLines(data.values);
		};

		////////////////////////////////////初始化各个dom节点////////////////////////////////////
		Table.prototype.render = function() {
			this.node.empty();
			var table = this.table = $('<table class="table-simple"></table>');
			this.head(this.dataKeys);
			this.lines(this.dataValuesAll);
			this.node.append(table);
		};

		//初始化表头的dom节点
		Table.prototype.head = function(dataKeys) {
			var tr = $('<tr class="tr-simple"></tr>');
			for(var k in dataKeys){
				var key = dataKeys[k].name;
				var grid = $('<th class="th-simple">'+key+'</th>');
				tr.append(grid);
			}
			this.table.append(tr);
		}

		/////////////////////////////////line/////////////////////////////////
		Table.prototype.lines = function(dataValues) {
			for(var k in dataValues){
				dataValue = dataValues[k];
				this.line(dataValue);
			}
		}
		Table.prototype.line = function(dataValue) {
			var tr = $('<tr class="tr-simple"></tr>');
			for(var k in dataValue){
				var key = dataValue[k];
				var grid = $('<td class="td-simple">'+key+'</td>');
				tr.append(grid);
			}
			this.table.append(tr);
		};

  module.exports = Table;
});
