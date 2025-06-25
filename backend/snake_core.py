import random  # 导入随机模块，用于生成食物位置

class SnakeGame:
    """
    贪吃蛇游戏类，包含游戏的核心逻辑
    """
    def __init__(self, width=20, height=20):
        """
        初始化游戏
        参数:
        width: 游戏区域宽度（格子数，默认为20）
        height: 游戏区域高度（格子数，默认为20）
        """
        self.width = width
        self.height = height
        self.reset()

    def reset(self):
        """
        重置游戏状态，开始新游戏
        """
        self.snake = [(self.width // 2, self.height // 2)]
        self.direction = 'RIGHT'
        self.food = self.spawn_food()
        self.score = 0
        self.game_over = False

    def spawn_food(self):
        """
        在游戏区域随机生成一个食物位置
        返回: 食物的坐标元组(x, y)
        """
        while True:
            # 随机生成一个位置
            pos = (random.randint(0, self.width-1), random.randint(0, self.height-1))
            # 确保食物不会出现在蛇身上
            if pos not in self.snake:
                return pos

    def step(self, direction):
        if self.game_over:
            return
            
        # 方向合法性判断：
        # 1. 方向不为空
        # 2. 不能与当前方向相反（防止蛇反向移动）
        if direction:
            if (direction == 'UP' and self.direction != 'DOWN') or \
               (direction == 'DOWN' and self.direction != 'UP') or \
               (direction == 'LEFT' and self.direction != 'RIGHT') or \
               (direction == 'RIGHT' and self.direction != 'LEFT'):
                self.direction = direction  # 更新当前方向
        
        # 获取蛇头当前位置
        head = self.snake[0]
        move = {
            'UP': (0, -1),
            'DOWN': (0, 1),
            'LEFT': (-1, 0),
            'RIGHT': (1, 0)
        }
        
        # 计算蛇头的新位置
        new_head = (head[0] + move[self.direction][0], head[1] + move[self.direction][1])
        
        # 碰撞检测：
        # 1. 是否撞墙（超出游戏区域边界）
        # 2. 是否撞到自己身体（新位置在蛇身上）
        if (not 0 <= new_head[0] < self.width) or (not 0 <= new_head[1] < self.height) or (new_head in self.snake):
            self.game_over = True  # 游戏结束
            return
        
        # 将新位置添加到蛇头
        self.snake.insert(0, new_head)
        
        # 检查是否吃到食物
        if new_head == self.food:
            # 吃到食物，增加分数
            self.score += 1
            # 生成新食物
            self.food = self.spawn_food()
        else:
            # 没吃到食物，移除蛇尾（保持长度不变）
            self.snake.pop()

    def get_state(self):
        """
        获取当前游戏状态
        
        返回:
        包含当前游戏状态的字典
        """
        return {
            'snake': self.snake,
            'food': self.food,
            'score': self.score,
            'game_over': self.game_over,
            'width': self.width,
            'height': self.height
        }