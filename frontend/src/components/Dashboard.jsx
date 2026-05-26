import React, { useState, useEffect } from 'react';
import { 
  ListTodo, Plus, Search, LogOut, Calendar, AlertCircle, Trash2, Edit3, 
  ChevronLeft, ChevronRight, Loader2, CheckCircle2, CircleDot, ClipboardList, 
  BarChart3, User, Clock, AlertTriangle, Layers
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // If null, we are creating a task
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalStage, setModalStage] = useState('todo');
  const [modalPriority, setModalPriority] = useState('medium');
  const [modalDueDate, setModalDueDate] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [taskToDelete, setTaskToDelete] = useState(null); // Custom confirmation modal state

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-blue-200 text-blue-600 bg-blue-50/50' },
    { id: 'in_progress', title: 'In Progress', color: 'border-amber-200 text-amber-600 bg-amber-50/50' },
    { id: 'review', title: 'Under Review', color: 'border-purple-200 text-purple-600 bg-purple-50/50' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-200 text-emerald-600 bg-emerald-50/50' }
  ];

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      let query = [];
      if (searchTerm) query.push(`search=${encodeURIComponent(searchTerm)}`);
      if (priorityFilter) query.push(`priority=${encodeURIComponent(priorityFilter)}`);
      
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      const response = await fetch(`${API_URL}/tasks${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch tasks');
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchTerm, priorityFilter]);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setModalTitle('');
    setModalDescription('');
    setModalStage('todo');
    setModalPriority('medium');
    setModalDueDate('');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setModalTitle(task.title);
    setModalDescription(task.description || '');
    setModalStage(task.stage);
    setModalPriority(task.priority);
    setModalDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    
    const payload = {
      title: modalTitle,
      description: modalDescription,
      stage: modalStage,
      priority: modalPriority,
      dueDate: modalDueDate || null
    };

    try {
      const url = editingTask ? `${API_URL}/tasks/${editingTask.id}` : `${API_URL}/tasks`;
      const method = editingTask ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Operation failed');

      setSuccessMsg(editingTask ? 'Task updated successfully!' : 'Task created successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      const response = await fetch(`${API_URL}/tasks/${taskToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete task');

      setSuccessMsg('Task deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setTaskToDelete(null);
    }
  };

  const handleMoveStage = async (task, direction) => {
    const stageFlow = ['todo', 'in_progress', 'review', 'completed'];
    const currentIndex = stageFlow.indexOf(task.stage);
    let nextIndex = currentIndex + direction;
    
    if (nextIndex < 0 || nextIndex >= stageFlow.length) return;
    const nextStage = stageFlow[nextIndex];

    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: nextStage }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to move task');

      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const todoCount = tasks.filter(t => t.stage === 'todo').length;
  const inProgressCount = tasks.filter(t => t.stage === 'in_progress').length;
  const reviewCount = tasks.filter(t => t.stage === 'review').length;
  const completedCount = tasks.filter(t => t.stage === 'completed').length;
  const pendingCount = todoCount + inProgressCount;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden relative pb-12">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center transition-transform hover:scale-105">
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              TaskManager
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Workspace Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-slate-100 border border-slate-200/80 px-4 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">{user.name || 'User'}</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 active:bg-red-200 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8 relative z-10">
        
        {/* Banner with Greeting & Add Task Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back, <span className="text-indigo-600 font-black">{user.name || 'User'}</span>!
            </h2>
            <p className="text-slate-500 text-sm mt-1">Here is a quick snapshot of your active tasks workspace.</p>
          </div>
          
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer text-sm shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4.5 h-4.5" />
            Create Task
          </button>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-semibold">{successMsg}</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs font-semibold animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
              <p className="text-3xl font-black text-slate-900">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Pending</span>
              <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Review</span>
              <p className="text-3xl font-black text-purple-600">{reviewCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
              <p className="text-3xl font-black text-emerald-600">{completedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dynamic Filtering Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 flex flex-col md:flex-row items-center gap-4 justify-between shadow-sm">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto justify-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">Priority Filter:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full sm:w-44 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="high">🔥 High</option>
              <option value="medium">⚡ Medium</option>
              <option value="low">🌱 Low</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="h-64 w-full flex items-center justify-center gap-3 flex-col bg-white border border-slate-200/80 rounded-3xl shadow-sm">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Syncing Workspace...</p>
          </div>
        ) : (
          /* Kanban Board Columns */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {columns.map(col => {
              const columnTasks = tasks.filter(t => t.stage === col.id);
              
              return (
                <div key={col.id} className="flex flex-col gap-4 bg-slate-100/60 border border-slate-200/60 rounded-3xl p-4 self-stretch min-h-[500px]">
                  
                  {/* Column Header */}
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.id === 'todo' ? 'bg-blue-500' : col.id === 'in_progress' ? 'bg-amber-500' : col.id === 'review' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
                      <h3 className="font-bold text-sm tracking-wide text-slate-800 uppercase">{col.title}</h3>
                    </div>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg text-xs font-black">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Tasks Container */}
                  <div className="flex flex-col gap-4 flex-1 overflow-y-auto max-h-[600px] scrollbar-thin">
                    {columnTasks.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider min-h-[150px]">
                        No Tasks
                      </div>
                    ) : (
                      columnTasks.map(task => {
                        const priorityColor = 
                          task.priority === 'high' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                          task.priority === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          'bg-emerald-50 text-emerald-600 border-emerald-200';

                        return (
                          <div 
                            key={task.id} 
                            className="bg-white border border-slate-200/80 hover:border-slate-300 p-5 rounded-2xl shadow-sm transition-all hover:scale-[1.01] hover:shadow-md group text-left space-y-4"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${priorityColor}`}>
                                {task.priority}
                              </span>
                              
                              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleOpenEditModal(task)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                                  title="Edit Task"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => setTaskToDelete(task)}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h4 className="font-bold text-base text-slate-900 tracking-tight break-words">{task.title}</h4>
                              {task.description && (
                                <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed break-words">{task.description}</p>
                              )}
                            </div>

                            {/* Info & Navigation Footer */}
                            <div className="flex flex-col gap-3.5 pt-3 border-t border-slate-100 text-xs text-slate-400">
                              {task.dueDate && (
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                  <span className="font-bold text-[10px]">
                                    {new Date(task.dueDate).toLocaleDateString(undefined, { 
                                      year: 'numeric', month: 'short', day: 'numeric' 
                                    })}
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center justify-between gap-2 mt-1">
                                <button
                                  disabled={col.id === 'todo'}
                                  onClick={() => handleMoveStage(task, -1)}
                                  className="flex items-center justify-center p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:border-slate-300 transition-all cursor-pointer"
                                  title="Move Left"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>

                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">Stage</span>

                                <button
                                  disabled={col.id === 'completed'}
                                  onClick={() => handleMoveStage(task, 1)}
                                  className="flex items-center justify-center p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:shadow-lg hover:shadow-indigo-600/10 transition-all cursor-pointer"
                                  title="Move Right"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-lg w-full bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 transition-all">
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CircleDot className="w-5 h-5 text-indigo-600 animate-pulse" />
                {editingTask ? 'Edit Task Details' : 'Create New Task'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 text-xs font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <p className="font-semibold text-left">{modalError}</p>
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-5 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Configure JWT validation"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Task Description</label>
                <textarea
                  placeholder="Detail the actions needed..."
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm resize-none shadow-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Priority Level</label>
                  <select
                    value={modalPriority}
                    onChange={(e) => setModalPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm cursor-pointer shadow-sm"
                  >
                    <option value="low">🌱 Low</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="high">🔥 High</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Board Stage</label>
                  <select
                    value={modalStage}
                    onChange={(e) => setModalStage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm cursor-pointer shadow-sm"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Under Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Due Date (Optional)</label>
                <input
                  type="date"
                  value={modalDueDate}
                  onChange={(e) => setModalDueDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-700 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm cursor-pointer shadow-sm"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold px-5 py-3 rounded-2xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Task</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Custom Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-sm w-full bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 text-center transition-all animate-fadeIn">
            <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Delete Task?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{taskToDelete.title}"</span>? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTask}
                className="flex-1 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold py-3 rounded-2xl shadow-lg shadow-rose-600/15 hover:shadow-rose-600/25 transition-all cursor-pointer text-xs"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
