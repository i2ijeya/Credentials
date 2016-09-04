<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="f" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1">
<title>My Credentials - Secured</title>
<link href="bootstrap/css/bootstrap.css" rel="stylesheet"
	type="text/css">
<link href="bootstrap/css/bootstrap-theme.css" rel="stylesheet"
	type="text/css">
<!-- Custom styles for Sigining in -->
<link href="css/signin.css" rel="stylesheet">
<!-- HTML5 for IE backward compatibility -->
<!-- [if lt IE 9] 
          <script src="http://html5shim.googlecode.com/svn/trunk/html5.js" />
         <![endif]
  -->

<script type="text/javascript">
    document.getElementById("register_button").onclick = function () {
    	alert("hai");
        location.href = "/registration.html";
    };
</script>
</head>
<body>
	<div class="container">
		<div class="masthead">
			<img src="images/login/Healthcare-Collaborative-final-new-01.jpg"
				alt="header image">
		</div>
	</div>



	<div class="container">
		<div class="row">
			<div class="col-md-8">
				<form class="form-signin" action="/credential/login" method="post">
					<form:errors path="*" cssClass="errorblock" element="div"/>
					<h2 class="form-signin-heading">Sign In</h2>
					<input type="email" class="form-control"
						placeholder="Email address" required = autofocus name="email"> 
						<input name="password"
						type="password" class="form-control" placeholder="Password"
						required> <a href="/ExpenseProject/test"> Forgot
						Password </a>
					<button type="submit" class="btn btn-lg btn-primary btn-block" type="submit">Sign
						in</button>
				</form>
			</div>
			<div class="row">
				<div class="col-md-2">
					<form class="form-signin" action="/credential/register" method="get">
						<h2 class="form-signin-newuser">New User?</h2>
						<button type="submit" id="register_button" class="btn btn-mini">Register</button>
					</form>
				</div>
			</div>
		</div>
	</div>
	
	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="js/bootstrap.js"></script>
</body>
</html>