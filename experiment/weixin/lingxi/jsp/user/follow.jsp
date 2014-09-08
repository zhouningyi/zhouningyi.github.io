<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page import="com.lx.common.Constants"%>
<%@page import="com.lx.web.model.user.User"%>
<%
	User user = (User)request.getAttribute(Constants.COMMAND);
	Integer userId = user.getId();
%>
		<script type = 'text/javascript'>
			$(function(){
				var userId = <%=userId %>;
				
				var typeList = ["analyst","broker","composite"];
				var currentType =typeList[0];
				var url = "<c:url value='/rest/follow'/>"+"/"+userId+"/"+currentType;
		  		$.get(url, function(data) {
		  			var htmlSegment;
	 				for(var i =0; i<data.length; i++){
	 					htmlSegment = generateFollowAnalyst(data[i]);
	 					$('.tab-list.follow-view .list').append(htmlSegment);
	 				}
	 				
				});
				
				function generateFollowItem(data, type){
					switch(type){
						case typeList[0]:
							return generateFollowAnalyst(data)
							break;
						case typeList[1]:
							return generateFollowBroker(data)
							break;
						case typeList[2]:
							return generateFollowComposite(data)
							break;
						default:
							return "";
						
					}
				}
				
				function generateFollowAnalyst(data){
					var analyst = data.analyst;
					var temp = '<li class="rank-detail">'
					temp += '<div class="person-show"><a target="_blank" href="analyst/1"><img alt="'+analyst.name+'" src="/lx-web/images/person.jpg" class="person-photo"></a></div>'
					temp += '<div class="person-info">'
					temp += '<a target="_blank" href="analyst/1"><strong>'+analyst.name+'</strong></a><span">'+analyst.broker.name+'</span>'
					temp += '<span class="attention-btn text-center followed" analystId="'+analyst.id+'">取消关注</span>'
					temp += '<ul class="info-list">'
					temp += '<li><span>粉丝数：</span><b>'+analyst.fansNumber+'</b></li><li><span>积分：</span><b>'+analyst.score+'</b></li><li><span>等级：</span><b>'+analyst.band+'</b></li><li><span>评论：</span><b>'+analyst.comment+'</b></li><li><span>关注：</span><b>'+analyst.followNumber+'</b></li>'
					temp += '</ul></div><div class="clearfix"></div></li>';
					return temp;
				}
				
				function generateFollowBroker(data){
					var broker = data;
					var tempHtml = '<li class="rank-detail"><div class="person-show"><span class="attention-num">'+broker.ranking+'</span>'
					+'<a href="broker/'+ broker.id +'" target="_blank"><img class="person-photo" src="images/1473cfe4924113f8d7809257.jpg!topic.png"  alt="'+broker.name+'" /></a></div><div class="person-info">'
					+'<a href="broker/'+ broker.id +'" target="_blank"><strong>'
					+broker.name+'</strong></a>'+'<span class="attention-btn text-center followed" brokerId="'+broker.id+'">取消关注</span><ul class="info-list">'
					+'<li><span>总评分：</span><b>'+broker.ranking+'</b></li>'			
					+'<li><span>名次变化：</span><b class="ranking-num"><i class="icons icon-add"></i>'+broker.sequenceChange+'</b></li>'			
					+'</ul></div><div class="clearfix"></div></li>';
		
					return tempHtml;
				}
				
				function generateFollowComposite(data){
					return "Composite template<br/>";
				}
				
				$(document).delegate(".addFollow","click",function(){
    	   			var element = $(this);
	    	   		var analystId = element.attr("analystId")
    		   		$.ajax({
        				type: "POST",
        				contentType: "application/json",
        				dataType: "text",
        				url: "<c:url value='/rest/follow'/>",
	    	    		data: JSON.stringify({analystId:analystId}), 
    	    			success: function (data) {
	    	    			element.toggleClass("addFollow");
	        				element.toggleClass("followed");
	        				element.text("取消关注");
				    	},
				    	error:function(data){
				    		if(data.status==401){
								toggleLoginDialog();
							}
					    }
    				});
	        	});
	        
	        	$(document).delegate(".followed","click",function(){
    	   			var element = $(this);
	    	   		var analystId = element.attr("analystId")
    		   		$.ajax({
        				type: "DELETE",
        				contentType: "application/json",
        				dataType: "text",
        				url: "<c:url value='/rest/follow'/>",
	    	    		data: JSON.stringify({analystId:analystId}), 
    	    			success: function (data) {
	    	    			element.toggleClass("addFollow");
	        				element.toggleClass("followed");
	        				element.text("+关注");
				    	}
    				});
	     	   });
	     	   
	     	   $(".tab-list.follow-view .tab li").on("click",function(){
    	   			var element = $(this);
    	   			if(element.hasClass("active")){
    	   				return;
    	   			}
	    	   		var type ;
	    	   		$(typeList).each(function(index,item){
	    	   			if(element.hasClass(item)){
	    	   				type = item;
	    	   			}
	    	   		})
	    	   		var root = $('.tab-list.follow-view .list');
	    	   		if(type){
	    	   			var url = "<c:url value='/rest/follow'/>"+"/"+userId+"/"+type;
    		   			$.get(url, function(data) {
    		   				if(currentType == type){
    		   					var htmlSegment;
	 							for(var i =0; i<data.length; i++){
	 								htmlSegment = generateFollowItem(data[i],type);
	 								root.append(htmlSegment);
	 							}
    		   				}
		  					
						});
	    	   		}
	    	   		$(".tab-list.follow-view .tab li").removeClass("active");
					element.addClass("active");
					root.empty();
	    	   		currentType = type;
	     	   });
			})
		</script>
		<div class="tab-list follow-view">
			<ul class="tab">
				<li class="composite">
					产品组合
				</li>
				<li class="analyst active">
					分析师
				</li>
				<li class="broker">
					机构
				</li>
			</ul>
			<div class="content">
				<ul class="list">
					
				</ul>
				<ul class="footer"></ul>
			</div>
		</div>