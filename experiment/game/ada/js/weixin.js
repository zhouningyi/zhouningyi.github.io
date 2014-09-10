  //http://www.baidufe.com/item/f07a3be0b23b4c9606bb.html
  //https://github.com/zxlie/WeixinApi

  define(function(require, exports, module) {

    var wxData = {
      "appId": "", // 服务号可以填写appId
      "imgUrl": 'http://open-wedding.qiniudn.com/share.png',
      "link": document.url,//'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0e4914441f529c5c&redirect_uri=http%3A%2F%2Flenovowx.duapp.com&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
      "desc": "赢千元机皇联想A916 “联联”看大作战",
      "title": "有奖连连看"
    };

    WeixinApi.ready(function(Api) {
      // 分享的回调
      var wxCallbacks = {
        // 分享操作开始之前
        ready: function() {
          // 你可以在这里对分享的数据进行重组
          // alert("准备分享");
        },
        // 分享被用户自动取消
        cancel: function(resp) {
          // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
          // alert("分享被取消，msg=" + resp.err_msg);
        },
        // 分享失败了
        fail: function(resp) {
          // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
          // alert("分享失败，msg=" + resp.err_msg);
        },
        // 分享成功
        confirm: function(resp) {
          // ServletInsertShare
        //@陆扬才 提交中奖信息;
        var url = base + '/ServletInsertShare?openid=' + idObj.openid + '&uuid=' + idObj.uuid;
        $.ajax({
          type: "GET",
          url: url, 
          cache: false,
          dataType: 'jsonp',
          success: function(json) {
          },
          error: function(e) {
          }
        });
          // 分享成功了，我们是不是可以做一些分享统计呢？
          // alert("分享成功，msg======" + resp.err_msg);
        },
        // 整个分享过程结束
        all: function(resp, shareTo) {
          // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
          // alert("分享" + (shareTo ? "到" + shareTo : "") + "结束，msg=" + resp.err_msg);
        }
      };

      // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
      Api.shareToFriend(wxData, wxCallbacks);

      // 点击分享到朋友圈，会执行下面这个代码
      Api.shareToTimeline(wxData, wxCallbacks);

      // 点击分享到腾讯微博，会执行下面这个代码
      Api.shareToWeibo(wxData, wxCallbacks);

      // iOS上，可以直接调用这个API进行分享，一句话搞定
      Api.generalShare(wxData, wxCallbacks);
    });

  });
