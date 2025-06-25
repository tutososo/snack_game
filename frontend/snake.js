/​**​*​**​*​**​*​**​*​**​*​**​*​**​* 画布与渲染设置 ​**​*​**​*​**​*​**​*​**​*​**​*​**​*/
// 获取HTML中的canvas元素，用于绘制游戏画面
const canvas = document.getElementById('game-canvas');
// 获取canvas的2D渲染上下文，用于绘制图形
const ctx = canvas.getContext('2d');
// 定义每个游戏格子的大小（像素）
const box = 20;
// 定义整个游戏画布的大小（像素）
const canvasSize = 400;

/​**​*​**​*​**​*​**​*​**​*​**​*​**​* 游戏状态变量 ​**​*​**​*​**​*​**​*​**​*​**​*​**​*/
let direction = 'RIGHT'; // 当前移动方向
let gameInterval;        // 游戏循环计时器
let isGameOver = false;  // 游戏结束标志
let username = '';       // 玩家用户名
let gameState = null;    // 后端返回的游戏状态对象

/​**​*​**​*​**​*​**​*​**​*​**​*​**​* 游戏初始化函数 ​**​*​**​*​**​*​**​*​**​*​**​*​**​*/
/​**​
 * 初始化游戏函数
 * 1. 获取用户名
 * 2. 验证用户名
 * 3. 向后端发送重置请求
 * 4. 设置初始游戏状态
 * 5. 启动游戏循环
 */
function initGame() {
    // 获取输入的用户名并去除前后空格
    username = document.getElementById('username-input').value.trim();
    
    // 检查用户名是否为空
    if (!username) {
        alert('请先输入用户名！');
        return;
    }
    
    // 发送重置请求到后端
    fetch('/api/reset', { method: 'POST' })
        .then(res => res.json())  // 解析JSON响应
        .then(state => {
            gameState = state;
            direction = 'RIGHT';
            isGameOver = false;
            document.getElementById('current-score').textContent = state.score;
            clearInterval(gameInterval);
            draw(); 
            // 启动新的游戏循环（每100ms执行一次）
            gameInterval = setInterval(gameStep, 100);
        });
}

/​**​*​**​*​**​*​**​*​**​*​**​*​**​* 游戏绘制函数 ​**​*​**​*​**​*​**​*​**​*​**​*​**​*/
/​**​
function draw() {
    // 设置背景颜色为深灰色
    ctx.fillStyle = '#222';
    // 填充整个画布
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // 如果没有游戏状态则返回
    if (!gameState) return;
    
    // 绘制蛇身
    for (let i = 0; i < gameState.snake.length; i++) {
        // 蛇头使用深绿色，蛇身使用浅绿色
        ctx.fillStyle = i === 0 ? '#4CAF50' : '#8BC34A';
        // 绘制蛇的每个部分（将逻辑坐标转换为像素坐标）
        ctx.fillRect(
            gameState.snake[i][0] * box,  // x坐标（逻辑坐标 * 格子大小）
            gameState.snake[i][1] * box,  // y坐标
            box,  // 宽度
            box   // 高度
        );
    }
    
    // 绘制食物
    ctx.fillStyle = '#FF5722'; // 橙色
    ctx.fillRect(
        gameState.food[0] * box, // 食物x坐标
        gameState.food[1] * box, // 食物y坐标
        box, 
        box
    );
}

/​**​*​**​*​**​*​**​*​**​*​**​*​**​* 键盘事件监听 ​**​*​**​*​**​*​**​*​**​*​**​*​**​*/
// 监听键盘按下事件，处理方向键输入
document.addEventListener('keydown', function (e) {
    // 左箭头键且当前不是向右移动（防止180度转向）
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    // 上箭头键且当前不是向下移动
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    // 右箭头键且当前不是向左移动
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    // 下箭头键且当前不是向上移动
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

/​**​*​**​*​**​*​**​*​**​*​**​*​**​* 按钮事件监听 ​**​*​**​*​**​*​**​*​**​*​**​*​**​*/
// "手动模式"按钮点击事件：开始新游戏
document.getElementById('manual-mode-btn').addEventListener('click', function() {
    initGame();
});

// "保存JSON"按钮点击事件：上传游戏数据到服务器
document.getElementById('save-json-btn').addEventListener('click', function() {
    // 检查游戏是否已结束
    if (!gameState || !isGameOver) {
        alert('请先结束游戏再保存！');
        return;
    }
    
    // 构造要上传的JSON数据
    const data = {
        username, // 用户名
        score: gameState.score, // 最终得分
        timestamp: new Date().toISOString() // 当前时间戳
    };
    
    // 创建一个隐藏表单用于提交数据
    const form = document.createElement('form');
    form.action = 'https://data.page/json/csv'; // 目标URL
    form.method = 'POST'; // 使用POST方法
    form.enctype = 'multipart/form-data'; // 表单编码类型
    form.target = '_blank'; // 在新窗口打开
    
    // 创建文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = 'file';
    
    // 创建一个包含JSON数据的Blob对象
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    
    // 使用DataTransfer对象模拟文件选择
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'game.json', {type: 'application/json'}));
    fileInput.files = dt.files;
    
    // 将文件输入添加到表单
    form.appendChild(fileInput);
    // 将表单添加到文档
    document.body.appendChild(form);
    
    // 自动提交表单
    form.submit();
    
    // 清理：1秒后移除表单
    setTimeout(() => {
        document.body.removeChild(form);
    }, 1000);
});

// "查看记录"按钮点击事件：在新窗口打开记录页面
document.getElementById('view-records-btn').addEventListener('click', function() {
    window.location.href = 'https://data.page/json/csv';
});

/​**​*​**​*​**​*​**​*​**​*​**​*​**​* 游戏主循环函数 ​**​*​**​*​**​*​**​*​**​*​**​*​**​*/
/​**​
 * 游戏步进函数
 * 1. 检查游戏是否结束
 * 2. 向后端发送移动请求
 * 3. 更新游戏状态
 * 4. 绘制新状态
 * 5. 检查游戏结束条件
 */
function gameStep() {
    // 如果游戏已结束则返回
    if (isGameOver) return;
    
    // 发送移动请求到后端
    fetch('/api/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }) // 发送当前方向
    })
        .then(res => res.json()) // 解析响应为JSON
        .then(state => {
            // 更新游戏状态
            gameState = state;
            // 更新分数显示
            document.getElementById('current-score').textContent = state.score;
            // 绘制新状态
            draw();
            
            // 检查游戏是否结束
            if (state.game_over) {
                // 设置游戏结束标志
                isGameOver = true;
                // 清除游戏循环计时器
                clearInterval(gameInterval);
                // 延迟显示游戏结束提示
                setTimeout(() => {
                    alert('游戏结束！您的分数：' + state.score);
                }, 100);
            }
        });
}