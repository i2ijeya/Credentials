<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!--  %@ page import="java.util.List" %>  -->

<!DOCTYPE html SYSTEM "about:legacy-compat">
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HC_App</title>
<link href="bootstrap/css/bootstrap.css" rel="stylesheet"
	type="text/css" >
<link href="bootstrap/css/bootstrap-theme.css" rel="stylesheet"
	type="text/css">
<link href="css/input-box.css" rel="stylesheet" type="text/css">
<link href="css/signin.css" rel="stylesheet">
<!-- HTML5 for IE backward compatibility -->
<!-- [if lt IE 9] 
          <script src="http://html5shim.googlecode.com/svn/trunk/html5.js" />
         <![endif]
  -->

<link href="css/navbar-fixed-top.css" rel="stylesheet" type="text/css">
</head>

<body>

	<nav class="navbar navbar-default navbar-fixed-top">
	<div class="container">
		<div class="navbar-header">
			<a href="#" class="navbar-brand"><img src="${pageContext.request.contextPath}/images/showimage.gif"></a>
		</div>
	</div>
	</nav>
	<div class="divide-nav">
		<div class="container">
			<p class="divide-text">New User</p>
		</div>
	</div>

	<br>
	<div class="container">
		<div class="row">
			<div class="col-md-4">
				<form class="form-signin">
					<h2 class="form-signin-heading">Sign In</h2>
					<input type="email" class="form-control"
						placeholder="Email address"> 
						<input type="password" class="form-control" placeholder="Password" required> 
						<a href="/ExpenseProject/test"> Forgot Password </a>
						<button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
				</form>			
				
			</div>
			<div class="col-md-4">
				<form class="form-signin" action="/credential/registerUser" method="get">
					<h2 class="form-signin-heading">Register Here</h2>
					<input type="text" class="form-control"
						placeholder="Name" style="margin-bottom: 10px;" required>
						
						<input type="email" class="form-control" name="email"
						placeholder="Email-Id" style="margin-bottom: 10px;" required>
					<input
						type="password" class="form-control" placeholder="New Password" name="new_password"
						required>
					<input
						type="password" class="form-control" placeholder="Retype Password" name="retype_password"
						required>
					<input
						type="text" class="form-control" placeholder="Phone" name="phone"
						required>
					<br>
					<button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
				</form>
			</div>
			
			<div class="col-md-4">
				<form class="form-signin">
					<h2 class="form-signin-heading">Having Issues</h2>
					<p align="center"> Contact me @+1-612-483-9246 </p>
					
				</form>
			</div>
		</div>
	</div>

</body>
</html>