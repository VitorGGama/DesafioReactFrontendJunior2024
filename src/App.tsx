import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, useLocation } from 'react-router-dom';
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
  const [filter, setFilter] = useState('todos');

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

  const filteredTasks = tasks.filter(task => {
    if (filter === 'todos') return true;
    if (filter === 'ativos') return !task.completed;
    if (filter === 'completos') return task.completed;
    return true;
  });

  return (
    <Router>
      <section className="todoapp">
        <header className="header">
          <h1>Tarefas</h1>
          <input
            className="new-todo"
            placeholder="O que precisa ser feito?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newTaskTitle.trim()) {
                addTask(newTaskTitle.trim());
                setNewTaskTitle('');
              }
            }}
          />
        </header>
        <section className="main">
          <ul className="todo-list">
            {filteredTasks.map(task => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <label>{task.title}</label>
                  <button className="destroy" onClick={() => removeTask(task.id)} />
                </div>
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
              <Link to="/" className={filter === 'todos' ? 'selected' : ''} onClick={() => setFilter('todos')}>
                Todos
              </Link>
            </li>
            <li>
              <Link to="/ativos" className={filter === 'ativos' ? 'selected' : ''} onClick={() => setFilter('ativos')}>
                Ativos
              </Link>
            </li>
            <li>
              <Link to="/completos" className={filter === 'completos' ? 'selected' : ''} onClick={() => setFilter('completos')}>
                Completos
              </Link>
            </li>
          </ul>
          <button className="clear-completed" onClick={clearCompleted}>
            Limpar completados
          </button>
        </footer>
      </section>
    </Router>
  );
};

export default App;
