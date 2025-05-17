import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Calendar, ClipboardList } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const tasks: Task[] = [
  { id: 1, title: 'Prepare fields for rice planting', assignee: 'John Doe', dueDate: '2024-03-20', status: 'in-progress' },
  { id: 2, title: 'Irrigation system maintenance', assignee: 'Jane Smith', dueDate: '2024-03-22', status: 'pending' },
  { id: 3, title: 'Harvest wheat in Field B', assignee: 'Mike Johnson', dueDate: '2024-03-25', status: 'completed' },
];

// Weekly schedule
const schedule = [
  { day: 'Monday', task: 'Soil preparation', assignee: 'John Doe' },
  { day: 'Tuesday', task: 'Seed sowing', assignee: 'Jane Smith' },
  { day: 'Wednesday', task: 'Fertilizer application', assignee: 'Mike Johnson' },
  { day: 'Thursday', task: 'Irrigation check', assignee: 'John Doe' },
  { day: 'Friday', task: 'Pest control', assignee: 'Jane Smith' },
  { day: 'Saturday', task: 'Growth monitoring', assignee: 'Mike Johnson' },
  { day: 'Sunday', task: 'Rest day', assignee: 'All workers' },
];

// Worker assignments
const workers = [
  { name: 'John Doe', role: 'Field Supervisor', currentTask: 'Soil preparation' },
  { name: 'Jane Smith', role: 'Irrigation Specialist', currentTask: 'Seed sowing' },
  { name: 'Mike Johnson', role: 'Harvest Manager', currentTask: 'Fertilizer application' },
];

export function TeamCollaboration() {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('tasks');

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Team Collaboration</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setActiveSection('tasks')}
            className={`p-6 rounded-lg shadow transition flex items-center ${
              activeSection === 'tasks' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white hover:shadow-lg'
            }`}
          >
            <ClipboardList className="h-6 w-6 text-blue-500 mr-3" />
            <div className="text-left">
              <h3 className="font-semibold">Task Management</h3>
              <p className="text-sm text-gray-600">Organize and track farm tasks</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('schedule')}
            className={`p-6 rounded-lg shadow transition flex items-center ${
              activeSection === 'schedule' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white hover:shadow-lg'
            }`}
          >
            <Calendar className="h-6 w-6 text-blue-500 mr-3" />
            <div className="text-left">
              <h3 className="font-semibold">Team Schedule</h3>
              <p className="text-sm text-gray-600">View and manage work schedules</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('workers')}
            className={`p-6 rounded-lg shadow transition flex items-center ${
              activeSection === 'workers' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white hover:shadow-lg'
            }`}
          >
            <Users className="h-6 w-6 text-blue-500 mr-3" />
            <div className="text-left">
              <h3 className="font-semibold">Worker Assignments</h3>
              <p className="text-sm text-gray-600">Manage worker roles and tasks</p>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeSection === 'tasks' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Tasks</h2>
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="border rounded-lg p-4 hover:shadow transition">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{task.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Assigned to: {task.assignee}</p>
                      <p>Due: {task.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'schedule' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Day</th>
                    <th className="border border-gray-300 px-4 py-2">Task</th>
                    <th className="border border-gray-300 px-4 py-2">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">{item.day}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.task}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.assignee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'workers' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Worker Assignments</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Worker Name</th>
                    <th className="border border-gray-300 px-4 py-2">Role</th>
                    <th className="border border-gray-300 px-4 py-2">Current Task</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">{worker.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{worker.role}</td>
                      <td className="border border-gray-300 px-4 py-2">{worker.currentTask}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
