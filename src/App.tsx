import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router,  Link, } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string) => {
    const newTask = { id: uuidv4(), title, completed: false };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const startEditingTask = (id: string, title: string) => {
    setEditingTaskId(id);
    setEditingTaskTitle(title);
  };

  const saveEditedTask = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, title: editingTaskTitle } : task));
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <Router>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="O que precisa ser feito?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => {
              if ( e.key === 'Enter' && newTaskTitle.trim()) {
                addTask(newTaskTitle.trim());
                setNewTaskTitle('');
              }
            }}
          />
        </header>
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={(e) => {
              const { checked } = e.target;
              setTasks(tasks.map(task => ({ ...task, completed: checked })));
            }}
            checked={tasks.length > 0 && tasks.every(task => task.completed)}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {filteredTasks.map(task => (
              <li
                key={task.id}
                className={`${task.completed ? 'completed' : ''} ${editingTaskId === task.id ? 'editing' : ''}`}
              >
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <label onDoubleClick={() => startEditingTask(task.id, task.title)}>
                    {task.title}
                  </label>
                  <button className="destroy" onClick={() => removeTask(task.id)} />
                </div>
                {editingTaskId === task.id && (
                  <input
                    className="edit"
                    value={editingTaskTitle}
                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                    onBlur={() => saveEditedTask(task.id)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        saveEditedTask(task.id);
                      }
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count">
            <strong>{tasks.filter(task => !task.completed).length}</strong> itens restantes
          </span>
          <ul className="filters">
            <li>
              <Link to="/" className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>
                Todos
              </Link>
            </li>
            <li>
              <Link to="/active" className={filter === 'active' ? 'selected' : ''} onClick={() => setFilter('active')}>
                Ativos
              </Link>
            </li>
            <li>
              <Link to="/completed" className={filter === 'completed' ? 'selected' : ''} onClick={() => setFilter('completed')}>
                Completos
              </Link>
            </li>
          </ul>
          {tasks.some(task => task.completed) && (
            <button className="clear-completed" onClick={clearCompleted}>
              Limpar completos
            </button>
          )}
        </footer>
      </section>
    </Router>
  );
};

export default App;
