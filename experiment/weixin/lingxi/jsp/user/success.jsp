<%@page import="org.springframework.security.core.context.*"%>
<%@page import="org.springframework.security.core.userdetails.UserDetails"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style type="text/css"> 
 h2 {
 	background-color:#a1a1a1;
 	margin-top:0px;
 	padding:20px;
 	color:#fff;
 	font-size:16pt;
 	font-family:"Microsoft YaHei";
 	font-weight:bold;
 }
 
 dl {
 	margin-bottom:0px;
 }
 
 dt {
 	color:#f7941d;
 	height:40px;
 	padding-left:20px;
 	font-family:"Microsoft YaHei";
 	font-size:16pt;
 	border-bottom: 1px solid #e1e1e1;
 }
 
 dd{
 	padding-left:20px;
 	border-bottom: 1px solid #e1e1e1;
 }
 
 dd th{
 	color:#111;
 	font-size:14pt;
 	font-weight:bold;
 	min-width:100px;
 	padding-right:10px;
 }
 
 dd td{
 	font-size:12pt;
 	padding-right:20px;
 }
 
 .positive{
 	color:#ed1c24 !important;
 }
</style>

<h2>自选股</h2>
<dl>
	<dd>
		<table class="mystock">
			<thead>
				<tr>
					<th>
						名称
					</th>
					<th>
						最新
					</th>
					<th>
						涨跌
					</th>
					<th>
						涨幅
					</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</dd>
</dl>

<%
Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
boolean isLogin =false;
String username="";
String contextPath = request.getContextPath();
Integer userId=0;
if (principal instanceof UserDetails) {
	UserDetails ud = (UserDetails)principal;
    username = ud.getUsername();   
    isLogin=true;
    userId= (Integer)session.getAttribute("userId");
} else {
    username = principal.toString();
}
%>

<script type="text/javascript">
var userId = <%=userId%>;
var myStockUrl = '/lx-web/rest/mystock/' + userId;

$.get(myStockUrl, function(data) {
	
	$.each(data,function(){
		var template = '<tr><td>' + this.stock.name + '</td><td>' + this.stock.price + '</td><td>'
						+ this.stock.todayChange + '</td><td>' + this.stock.todayChangeRate*100 
						+ '%</td></tr>';
		$('table.mystock tbody').append(template);
	});
});

</script>


