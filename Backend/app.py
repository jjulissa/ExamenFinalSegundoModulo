from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite peticiones desde el frontend

tasks = []
next_id = 1

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    priority = request.args.get('priority')
    if priority:
        filtered = [t for t in tasks if t['priority'] == priority]
        return jsonify(filtered)
    return jsonify(tasks)


@app.route('/api/tasks', methods=['POST'])
def add_task():
    global next_id
    data = request.get_json()
    title = data.get('title', '').strip()
    if not title:
        return jsonify({'error': 'El título es obligatorio'}), 400
    task = {
        'id': next_id,
        'title': title,
        'priority': data.get('priority', 'baja')
    }
    tasks.append(task)
    next_id += 1
    return jsonify(task), 201


@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t['id'] != task_id]
    return jsonify({'status': 'deleted'})

if __name__ == '__main__':
    app.run(debug=True)
