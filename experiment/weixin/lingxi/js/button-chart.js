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
			this.defaults.bgColor = option.bgColor||'#eee';
			this.defaults.color = option.color||'#333';

			this.main();
			return this;
		};

		Button.prototype.main = function() {
			var color = this.defaults.color;
			var mainNode = this.mainNode = $('<div></div>')
				.css(mainCss)
				.css('color',color);
			this.node.append(mainNode);
		}

		Button.prototype.text = function(text) {
			this.mainNode.text(text);
			return this;
		}

		Button.prototype.animateble = function() {
			this.node.css(animateNormal);
		};

//////////////////////rankable//////////////////////
		Button.prototype.rankable = function(callbacks) {
			this.rankUp = callbacks.up||function(){};
			this.rankDown = callbacks.down||function(){};

			var self = this;
			var percent = 20;
			this.statu = 1000;
			var height = this.height;
			var bgColor = this.defaults.bgColor;
			this.mainNode
			.css({
				'fontWeight':'bold',
				'width':(100 - percent) +'%',
				'lineHeight':height+'px',
				'height':height+'px',
				'float':'left',
				'color':'#333',
			})
			.css(animateNormal)
			.click(self.change.bind(this))

			var markNode = this.markNode = $('<div></div>')
			.css({
				'width': percent +'%',
				'height': 100 +'%',
				'lineHeight':height+'px',
				'float':'left',
				'background':'rgba(0,0,0,0.15)',
				'color':'#fff'
			});
			this.node.append(markNode);

			return this;
		};

		Button.prototype.none = function(){
			if(this.markNode){
				this.markNode.text('999');
			}
			this.statu = 1001;
			console.log(999999)
		};

    //升序排列
	  Button.prototype.up = function(){
	  	this.rankUp();
			this.markNode.text('▲');
			this.statu = 1;
		}
		//降序排列
	  Button.prototype.down = function(){
	  	this.rankDown();
			this.markNode.text('▼');
			this.statu = 0;
		};

		Button.prototype.change = function(){
			this.statu = (this.statu+1)%2;
			if(this.statu === 1){
				this.up();
			}else if(this.statu === 0){
				this.down();
			}
		};

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
			'background':'rgba(0,0,0,0.1)',
			'borderRadius': '0px',
			'fontWeight': 'normal',
			'textAlign': 'left',
			'height': '100%',
			'fontSize': '16px',
			'border': 'none',
			'margin': '0px 0px',
			'padding': '0px 0px 0px 30px',
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

		exports.Button = Button;
	})(window);