<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: 'Roboto', sans-serif;
            background-color: #f0f2f5;
        }
        .container {
            display: flex;
            max-width: 900px;
            width: 100%;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            overflow: hidden;
        }
        .image-section {
            flex: 1;
            background-image: url('images/background (2).jpeg');
            background-size: cover;
            background-position: center;
        }
        .form-section {
            flex: 1;
            padding: 40px;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .form-section h2 {
            margin-bottom: 20px;
            font-size: 28px;
            color: #333;
            text-align: center;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #555;
        }
        .form-group input[type="email"],
        .form-group input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
            font-size: 16px;
        }
        .form-group input[type="checkbox"] {
            margin-right: 10px;
        }
        .form-group .btn {
            width: 100%;
            padding: 12px;
            background: #007BFF;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .form-group .btn:hover {
            background: #0056b3;
        }
        .form-options {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 14px;
        }
        .form-options a {
            text-decoration: none;
            color: #007BFF;
        }
        .form-options a:hover {
            text-decoration: underline;
        }
        .social-login {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
        }
        .social-login button {
            width: 32%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            color: #fff;
        }
        .social-login .google {
            background: #dd4b39;
        }
        .social-login .facebook {
            background: #3b5998;
        }
        .social-login .twitter {
            background: #1da1f2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="image-section"></div>
        <div class="form-section">
            <h2>Log in</h2>
            <form>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <input type="checkbox" id="keep-logged-in">
                    <label for="keep-logged-in">Keep me logged in</label>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn">Log in now</button>
                </div>
                <div class="form-options">
                    <a href="#">Create new account</a>
                    <a href="#">Forgot password</a>
                </div>
                <div class="social-login">
                    <button class="google">Google</button>
                    <button class="facebook">Facebook</button>
                    <button class="twitter">Twitter</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
