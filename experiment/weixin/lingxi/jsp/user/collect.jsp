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
				
				var url = "<c:url value='/rest/collect'/>"+"/"+userId+"/report";
		  		$.get(url, function(data) {
		  			var htmlSegment;
	 				for(var i =0; i<data.length; i++){
	 					htmlSegment = generateFollowAnalyst(data[i]);
	 					$('.tab-list.collect-view .list').append(htmlSegment);
	 				}
	 				
				});
				
				function generateFollowAnalyst(report){
					var temp = '<li><img src="<c:url value="/images"/>/'+report.pic+'"><h3>'+report.title+'<span  style="display:none" class="attention-btn text-center collected reportId="'+report.id+'">取消收藏</span></h3><div class="info"><span class="glyphicon glyphicon-user"></span>'
					temp += '<span>'+report.author+'</span><span>'+report.broker+'</span><span>'+report.createTime+'</span><span>类别:'+report.reportType+'</span></div><div class="detail">'+report.summary
					temp += '<div class="rate"><span class="total-rate">综合评分：' + report.score + '分</span><span>指标1：</span><span>指标2：</span><span>指标3：</span><span class="more-info"><a href="<c:url value="/report"/>/'+report.id+'">详细内容</a></span></div></li>'
					return temp;
				}
				
				$(".report-list").delegate(".addCollect","click",function(){
    	   			var element = $(this);
    	   			var reportId = element.attr("reportId")
    	  				$.ajax({
        				type: "POST",
        				contentType: "application/json",
       					dataType: "text",
       					url: "<c:url value='/rest/collect'/>",
        				data: JSON.stringify({reportId:reportId}), 
       					success: function (data) {
        					element.toggleClass("addCollect");
	        				element.toggleClass("collected");
	        				element.text("取消收藏");
						},
						error:function(data){
				   			if(data.status==401){
								toggleLoginDialog();
							}
			    		}
    				});
	    		});
	        
	    		$(".report-list").delegate(".collected","click",function(){
    	   			var element = $(this);
    	   			var reportId = element.attr("reportId")
    	   			$.ajax({
        				type: "DELETE",
        				contentType: "application/json",
        				dataType: "text",
        				url: "<c:url value='/rest/collect'/>",
    	    			data: JSON.stringify({reportId:reportId}), 
        				success: function (data) {
	        				element.toggleClass("addCollect");
	        				element.toggleClass("collected");
	        				element.text("+收藏");
					    }
    				});
	    		});
			})
		</script>
		<div class="tab-list collect-view">
			<ul class="tab">
				<li >
					投研报告
				</li>
			</ul>
			<div class="content">
				<ul class="list report-list">
					
				</ul>
				<ul class="footer"></ul>
			</div>
		</div>