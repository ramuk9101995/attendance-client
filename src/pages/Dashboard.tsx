import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../hooks/useAuth';
import { useTodayAttendance, useCheckIn, useCheckOut } from '../hooks/useAttendance';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { format } from 'date-fns';
import { CreateTaskData, Task, UpdateTaskData } from '../types';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const { data: todayAttendance, isLoading: attendanceLoading } = useTodayAttendance();
  const { mutate: checkIn, isPending: checkingIn } = useCheckIn();
  const { mutate: checkOut, isPending: checkingOut } = useCheckOut();
  const { data: tasksData, isLoading: tasksLoading } = useTasks();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'medium',
  });

  const attendance = todayAttendance?.data?.attendance;
  const tasks = tasksData?.data?.tasks || [];

  const handleCheckIn = () => {
    checkIn(undefined);
  };

  const handleCheckOut = () => {
    checkOut(undefined);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTask(newTask, {
      onSuccess: () => {
        setNewTask({ title: '', description: '', priority: 'medium' });
        setShowTaskForm(false);
      },
    });
  };

  const handleUpdateTaskStatus = (taskId: string, status: UpdateTaskData['status']) => {
    updateTask({ id: taskId, data: { status } });
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.full_name}</p>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Attendance Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Today's Attendance</h2>
          {attendanceLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="space-y-4">
              {attendance ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Check-in Time</p>
                    <p className="text-lg font-semibold text-green-700">
                      {format(new Date(attendance.check_in_time), 'h:mm a')}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${attendance.check_out_time ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <p className="text-sm text-gray-600">Check-out Time</p>
                    <p className={`text-lg font-semibold ${attendance.check_out_time ? 'text-blue-700' : 'text-gray-500'}`}>
                      {attendance.check_out_time ? format(new Date(attendance.check_out_time), 'h:mm a') : 'Not checked out'}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    {!attendance.check_out_time && (
                      <button onClick={handleCheckOut} disabled={checkingOut} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                        {checkingOut ? 'Checking out...' : 'Check Out'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">You haven't checked in today</p>
                  <button onClick={handleCheckIn} disabled={checkingIn} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition">
                    {checkingIn ? 'Checking in...' : 'Check In'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Tasks</h2>
            <button onClick={() => setShowTaskForm(!showTaskForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              {showTaskForm ? 'Cancel' : 'New Task'}
            </button>
          </div>

          {showTaskForm && (
            <form onSubmit={handleCreateTask} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Create Task</button>
              </div>
            </form>
          )}

          {tasksLoading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No tasks yet. Create your first task!</div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task: Task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>{task.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {task.status !== 'completed' && (
                      <>
                        <button onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')} className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">In Progress</button>
                        <button onClick={() => handleUpdateTaskStatus(task.id, 'completed')} className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">Complete</button>
                      </>
                    )}
                    <button onClick={() => handleDeleteTask(task.id)} className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}