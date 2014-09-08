<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
    <title>user view</title>
    <link href="<c:url value='/css/tab-list.css'/>" rel="stylesheet" type="text/css" media="all"></link>
    <link href="<c:url value='/css/report.css'/>" rel="stylesheet" type="text/css" media="all"></link>
    <link href="<c:url value='/css/list.css'/>" rel="stylesheet" type="text/css" media="all"></link>
    <style type="text/css">  
   	 	.profile h3{
   	 		display: inline-block;
   	 		color:black;
   	 	}
   	 	
   	 	.profile .label{
   	 		color:black;
   	 		float:none;
   	 		font-weight:normal;
   	 	}
   	 	
   	 	.profile .description{
   	 		color:#f7bb53;
   	 	}
   	 	
   	 	.profile .thumbnails{
   	 		margin-top:20px;
   	 		margin-left:20px;
   	 		width:100px;
   	 		height:100px;
   	 		float:left;
   	 	}
   	 	
   	 	.profile .details{
   	 		margin-left:50px;
   	 		float:left;
   	 		width:450px;
   	 	}
   	 	
   	 	.profile .notes{
   	 		background:white;
   	 		padding:10px;
   	 		margin-left:20px;
   	 		border-radius:5px;
   	 	}
   	 	
   	 	.profile .description{
   	 		margin:0 20px;
   	 		width:50px;
   	 		display:inline-block;
   	 	}
   	 	
   	 	.profile .label {
   	 		width:50px;
   	 		display:inline-block;
   	 		text-align:left;
   	 	}
   	 	
    	.profile {
    		height:150px;
    		width:1200px;
    		background-color:#ebf9ff;
    		margin-top:30px;
    		margin-bottom:30px;
    		margin-left:200px;
    	} 
    	
    	.user-nav {
    		margin-left:200px;
    		width:140px;
    		float:left;
    	}
    	
    	.main-content {
    		float:left;
    		border:1px solid #a1a1a1;
    		width:1030px;
    		margin-left:30px;
    	}
    	
    	.follow-view{
    		width:100%;
    		margin-top:10px;
    	}
    	
    	.follow-view .rank-detail{
    		margin-top:20px;
    	}
    	
    	.follow-view .person-info {
    		width:900px;
    	}
    	
    	.follow-view ul.list .rank-detail {
    		margin: 10px 5px;
		}
    	
    	.follow-view ul.list .rank-detail a {
    		text-decoration: none;
		}
		
		.collect-view{
    		width:100%;
    		margin-top:10px;
    	}
    	
    	.collect-view ul.list.report-list li{
    		margin-top:20px;
    	}
    	
    	.tab-list.collect-view ul.list.report-list a {
			color:#555;
		}
    	
    	.addFollow, .followed{
        	cursor:pointer;
        	margin-left:20px;
        }
       	
        .person-info span.followed{
        	background-color:grey;
        }
        
        .collect-view span.attention-btn{
			margin-left:20px;
			display:inline-block;
			background:#28bbf2;
			color:#fff;
			width:70px;
			height:25px;
			border-radius:5px;
			font-weight:bold;
			line-height:25px;
		}
        
        .collect-view .addCollect, .collected{
        	cursor:pointer;
        }
        	
        .collect-view span.collected{
        	background-color:grey;
        }
		
		.modal h4{
			color:#555;
		}
		
		.modal label {
			margin-top:7px;
		}
    </style>
</head>
<body>

	<jsp:include page="../header.jsp" flush="true"/> 

  	<!-- S Fixed navbar -->
  	<jsp:include page="../nav.jsp" flush="true"/> 
  	<!-- E Fixed navbar -->
	<div style="height: 95px;"></div>
	<div class="profile">
		<div>
			<img class="thumbnails">
		</div>
		<div class="details">
			<h3>杨亮</h3><span class="notes">个性签名：这家伙很懒，什么都没有留下</span>
			<div>
				<span class="label">优势行业:</span>
				<span class="description">制造业</span>
			</div>
			<div>
				<span class="label">总评分：</span>
				<span class="description">1.0分</span>
				<span class="label">排名：</span>
				<span class="description">1</span>						
				<span class="label">指标1：</span>
				<span class="description">2.0</span>
				<span class="label">指标2：</span>
				<span class="description">3.0</span>
				<span class="label">指标3：</span>
				<span class="description">4.0</span>
			</div>
			<div>
				<span class="label">研报：</span>
				<span class="description">5篇</span>						
				<span class="label">粉丝：</span>
				<span class="description">0</span>
			</div>
		</div>
		<div class="details">
			<h3>我的资金池</h3>
			<div>
				<span class="label">总资产:</span>
				<span class="description">${composite.totalValue/10000}万</span>
				<span class="label">现金:</span>
				<span class="description">${composite.cash}</span>
				<span class="label">股票仓位:</span>
				<span class="description">${composite.stockPosition*100}%</span>
			</div>
			<div>
				<span class="label">总盈亏：</span>
				<span class="description">${composite.totalReturn}</span>
				<span class="label">历史收益率：</span>
				<span class="description">${composite.totalReturnRate*100}%</span>						
			</div>
		</div>
	</div>
	<div class="user-nav">
	    <ul class="nav nav-pills nav-stacked" role="tablist" style="max-width: 300px;">
	      <li role="presentation" class="active profit"><a href="#">持仓盈亏</a></li>
	      <li role="presentation"><a href="#" class="stocks">自选股</a></li>
	      <li role="presentation"><a href="#" class="collect">收藏</a></li>
	      <li role="presentation"><a href="#" class="follow">关注</a></li>
	    </ul>
  	</div>
  	<div class="main-content">
  		
  	</div>
  	<jsp:include page="../commonJs.jsp" flush="true"/>  
  	<script>
  		//show profit when loaded
	  	var url = '1/composite';
  		$.get(url, function(data) {
	 		$('.main-content').html(data);
	 		$(this).parents("li").addClass('active');
		});
  		$('.profit').click(function(){
  			$(this).addClass('active');
			 var url = '1/composite';
			 $.get(url, function(data) {
		 		$('.main-content').html(data);
			});
			
			$(".user-nav li").removeClass('active'); 
			$(this).parents("li").addClass('active');
		});
		$('.stocks').click(function(){
			 var url = 'success';
			 $.get(url, function(data) {
		 		$('.main-content').html(data);
			});
			$(".user-nav li").removeClass('active');
			$(this).parents("li").addClass('active');
		});
		$('.collect').click(function(){
			 var url = '1/collect';
			 $.get(url, function(data) {
		 		$('.main-content').html(data);
			});
			 $(".user-nav li").removeClass('active');
			 $(this).parents("li").addClass('active');
		});
		$('.follow').click(function(){
			 var url = '1/follow';
			 $.get(url, function(data) {
		 		$('.main-content').html(data);
			});
			 $(".user-nav li").removeClass('active');
			 $(this).parents("li").addClass('active');
		});
		
  	</script>
</body>
