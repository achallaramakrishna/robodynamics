<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Content</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            display: flex;
            height: 100vh;
        }
        .video-section {
            flex: 3;
            background-color: #333;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            position: relative;
        }
        .loading {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid #fff;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .content-section {
            flex: 1;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow-y: auto;
        }
        .content-section h2 {
            margin-top: 0;
        }
        .content-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            cursor: pointer;
        }
        .content-item:last-child {
            border-bottom: none;
        }
        .content-item:hover {
            background-color: #f0f0f0;
        }
        .content-item span {
            flex: 1;
        }
        .content-item .duration {
            margin-left: 10px;
            color: #888;
        }
        .nav-bar {
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
            background-color: #fff;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
            position: absolute;
            bottom: 0;
            width: 100%;
        }
        .nav-bar a {
            color: #333;
            text-decoration: none;
            padding: 10px;
        }
        .nav-bar a:hover {
            background-color: #f0f0f0;
        }
        .notes-section {
            padding: 20px;
        }
        .notes-section input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .notes-section button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .notes-section button:hover {
            background-color: #0056b3;
        }
        .upload-btn {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
        }
        .upload-btn:hover {
            background-color: #0056b3;
        }
        .video-upload {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="video-section">
            <div class="loading"></div>
            <div class="video-upload">
                <input type="onbstructionavoiding.mp4" id="videoUpload" accept="video/*" style="display: none;">
                <label for="videoUpload" class="upload-btn">Upload Video</label>
            </div>
        </div>
        <div class="content-section">
            <h2>Course Content</h2>
            <div class="content-item">
                <span>Introduction to Robotics</span>
                <span class="duration">5 min</span>
            </div>
            <div class="content-item">
                <span>Basic Electronics</span>
                <span class="duration">10 min</span>
            </div>
            <div class="content-item">
                <span>Getting Started with Arduino</span>
                <span class="duration">8 min</span>
            </div>
            <div class="content-item">
                <span>Using Sensors</span>
                <span class="duration">7 min</span>
            </div>
            <div class="content-item">
                <span>Introduction to Motors</span>
                <span class="duration">6 min</span>
            </div>
            <div class="content-item">
                <span>Building Simple Robot: Part 1</span>
                <span class="duration">12 min</span>
            </div>
            <div class="content-item">
                <span>Building Simple Robot: Part 2</span>
                <span class="duration">15 min</span>
            </div>
            <div class="content-item">
                <span>Final Project and Presentation</span>
                <span class="duration">20 min</span>
            </div>
        </div>
    </div>
    <div class="nav-bar">
        <a href="#">Overview</a>
        <a href="#">Notes</a>
        <a href="#">Announcements</a>
        <a href="#">Reviews</a>
        <a href="#">Learning Tools</a>
    </div>
    <div class="notes-section">
        <input type="text" placeholder="Create a new note at 0:00">
        <button>Add Note</button>
    </div>
</body>
</html>
