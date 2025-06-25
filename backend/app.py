from flask import Flask, request, jsonify
from snake_core import SnakeGame

app = Flask(__name__)
game = SnakeGame()

# 需要将 URL 路径与处理函数映射起来
# 验证后端服务是否正常运行
@app.route('/')
def index():
    return 'Snake Game Backend Running'

@app.route('/api/reset', methods=['POST'])
def api_reset():
    global game
    game.reset()
    return jsonify(game.get_state())

@app.route('/api/step', methods=['POST'])
def api_step():
    global game
    data = request.get_json()
    direction = data.get('direction')
    game.step(direction)
    return jsonify(game.get_state())

@app.route('/api/state', methods=['GET'])
def api_state():
    global game
    return jsonify(game.get_state())

if __name__ == '__main__':
    app.run(debug=True)