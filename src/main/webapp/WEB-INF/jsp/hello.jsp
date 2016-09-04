<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

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
			<p class="divide-text">Welcome : ${mail_id} </p>
		</div>
	</div>

	<br>
	

</body>
</html>