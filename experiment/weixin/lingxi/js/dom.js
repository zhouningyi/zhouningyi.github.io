var jquery = require('./lib/jquery-2.0.3.min.js');
var bootstrap = require('./lib/bootstrap.min.js');

exports.init = function (){
	exports.containers = {};

	exports.body();

	exports.page();
	exports.banner();
	
	// exports.progress();
	exports.title();
	exports.search();
	// exports.sheet();
} ;

exports.body = function(){
	$('body').css({
		'-webkit-transition': 'all .4s ease-in-out',
		'background':'#2069a0',
		'top':'0px',
		'margin':'0px',
		'padding':'0px',
		'height':'200%',
		'textAlign':'center'
	});
}

exports.page = function(){
	var div = $('<div></div>')
	.css({
		'-webkit-transition': 'all .3s ease-in-out',
		'position':'absolute',
		'left':'20%',
		'top':'0%',
		'width':'60%',
		'height':'100%',
	})
	.attr('id','page');

var shit = $('<div id="shit"> </div>')
	.css({
		'width':'100%',
		'height':'50%',
		'-webkit-transition': 'all .5s ease-in-out',
	})
	div.append(shit);

	exports.page = exports.containers['page'] = div;
	$('body').append(div);
};


exports.banner = function(){
	var nav = $(
		'<nav id="banner" class="navbar navbar-default navbar-fixed-top" role="navigation">'+
	  '<div id="bannerDiv" class="container">'+
	  '</div>'+
  	'</nav>');

	$('body').append(nav);

	$('#banner')
		.css({
			'-webkit-transition': 'all 0.85s ease-in-out',
		'top':'0%',
		'left':'0%',
		'width':'100%',
		'height':'50%',
		'border': '0px solid rgba(0,0,0,0)',
		'backgroundImage': 'linear-gradient(to bottom, #002940 0%, #2069a0 100%)',
		'opacity':0.9
	});

	var div = $('#bannerDiv')
	.css({
		'padding':'0px 0px',
		'margin':'0px 0px',
		'height':'100%',
		'border': '0px solid rgba(0,0,0,0)',
	})
	;
	exports.banner = exports.containers['banner'] = div;
	exports.bannerNode = exports.containers['bannerNode'] = nav;
};

exports.bannerIn = function(){
		exports.bannerNode
		.css({
		'top':'0%',
		'left':'0%',
		'width':'100%',
		'height':'30%',
		'border': '0px solid rgba(0,0,0,0)',
	});
$("#shit").css('height','35%');
$("#banderTitle").css('color','#fff');
$("#banderWord").css('color','#fff');
$('body').css({
'background':'#fff',
});
}

exports.title = function(){
	var titleText = '人群优选';
	var helpText = '搜 索 框 粘 贴 商 品 URL -> 选 择 商 品 型 号  -> 选 择 客 户 标 签  -> DMP 自 动 定 投 广 告'
	var div = $(
		'<div>'+
		  '<h1 id="banderTitle" style="text-align:left; font-size:70px; font-weight:bold; color:rgba(255,255,255,0.8)">'+ titleText+ '</h1>'+
	    '<h4 id="banderWord" style="text-align:left; font-weight:normal; color:rgba(255,255,255,1)">'+ helpText+ '</h4>'+
	  '</div>')
	.css({
	'-webkit-transition': 'all .15s ease-in-out',
	'-webkit-transition': 'color ease-in-out 1.9s ',
	'position':'absolute',
	'left':'20%',
	'marginBottom':'0px',
	'verticalAlign':'bottom',
	'bottom':0,
})
	exports.containers['title'] = div;
	exports.banner.append(div);
};


exports.search = function(){
var div = $(
	'<div id="search">'+
	  // '<div class="col-md-1"></div>'+
      '<div class="input-group col-md-12">'+
        '<input id="input1" type="text" class="form-control">'+
          '<span id="span1" class="input-group-btn">'+
            '<button id="searchEnter" class="btn btn-warning" type="button">添加商品</button>'+
          '</span>'+
        '</div>'+
      '</div>'+
  '</div>'
  );
div.css({
	'-webkit-transition': 'all .7s ease-in-out',
	// 'position':'relative',
	'top':'0%',
	'width':'100%',
	'marginBottom': '50px',
});
$('#searchEnter').css({'background':'#f90'});
	exports.containers['search'] = div;
	exports.page.append(div);
}

exports.sheet = function() {
	var node = exports.containers['sheet'];
	if (!node) {
		var node = $('<div></div>')
			.css({
				'-webkit-transition': 'all .2s ease-in-out',
				// 'position': 'relative',
				'marginBottom': '50px',
				'width': '100%',
				// 'display':'float'
			});
		exports.containers['sheet'] = node;
		exports.page.append(node);
		return node.last();
	} else {
		return node;
	}
}

exports.selections = function() {
	var node = exports.containers['selection'];
	if (!node) {
		var node = $('<div></div>')
			.css({
				'-webkit-transition': 'all .2s ease-in-out',
				'position': 'relative',
				'marginBottom': '50px',
				'width': '100%',
			})
			.attr('id', 'selection');
		exports.containers['selection'] = node;
		exports.page.append(node);
		return node;
	} else {
		return node;
	}
}


exports.scroll = function(index){
	var offset = 20;
	var position = 0;
	if(index ===2){
		position = $('#search').offset().top - $('#banner').height() -offset;
	}else if(index ===3){
		var node = $('#selection');
		if(node){
			// position = $('#selection').offset().top - $('#banner').height() -offset;
		}
	}
	$('body').scrollTop(position);
}
// exports.progress = function(){
// var div = $(
// '<div class="progress">'+
//   '<div class="progress-bar progress-bar-striped active"  role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%">'+
//     '<span class="sr-only">45% Complete</span>'+
//   '</div>'+
// '</div>'
// )
// 	exports.containers['progress'] = div;
//  exports.mainDiv.append(div);
// }


