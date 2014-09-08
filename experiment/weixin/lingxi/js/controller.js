(function(exports) {

	function Controller() {
		dom.init();
	};

	//////////////////////////scene1//////////////////////////
	exports.scene1 = function(data) {
		$('#searchEnter').click(searchURL);
		dom.scroll(1);
	}

	function searchURL() {
		var value = $('#input1')[0].value;
		if (value) {
			exports.scene2();
		} else {

		}
	}

	//////////////////////////scene2//////////////////////////
	exports.scene2 = function() {
		dom.bannerIn();
		testSheet(exports.scene3);
		dom.scroll(2);
	}


	function testSheet(callback) {
		// sheet.clear();
		var headSheet = $('#headSheet');
		if (!headSheet[0]) {
			var node = dom.sheet();
			sheet.init(node);
			var data2 = ['商品名', '商品类型', '均价', '半年内购买人数'];
			sheet.head(data2);
			setTimeout(function() {
				sheet.enter();
				$('#sheetEnter').click(callback);
			}, 1000);
		}
		var dataDiscription = {
			num: 11,
			buyers: 12223
		}; /////////};/////////}; 
		sheet.description(dataDiscription);

		var result = [];
		for (var i = 0; i < 1; i++) {
			result.push(['飞利浦', '剃须刀', parseInt(1000 * Math.random()), parseInt(7000 * Math.random()) + '人']);
		}
		sheet.lines(result);
	}

	//////////////////////////scene2//////////////////////////
	exports.scene3 = function() {
		testSelect();
		dom.scroll(3);
		// $('#selectEnter').click(testSelect);
	};

	var selectData = d3.range(100).map(function(d) {
		return 1 - d / 110 + Math.random() * 0.2;
	});

	function testSelect() {
		var node = dom.selections();
		selection.init(node);
		selection.wait();
		setTimeout(function() {
			selection.clear();
			selection.selection(selectData);
		}, 2000)
	}

	function testTest() {
		exports.scene1();
		exports.scene2();
		exports.scene3();
	}
	// testTest();
 exports.Controller = Controller;
})(window)