由于采用了Flask作为后端服务器，前端的 index.html 文件中涉及到与后端（如 /api/reset、/api/step 等接口）的 AJAX（fetch）请求。

如果直接用浏览器本地打开 index.html 文件，这些请求无法正确发送到 Flask 服务器，导致游戏无法正常运行。

请访问：http://60.205.234.85/