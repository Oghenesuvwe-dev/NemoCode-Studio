import React from 'react';

interface Task {
    id: string;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    assignee?: string;
}

const MOCK_TASKS: Task[] = [
    { id: '1', title: 'Initialize Project', status: 'done', assignee: 'Manager' },
    { id: '2', title: 'Setup Database', status: 'done', assignee: 'DevOps' },
    { id: '3', title: 'Create API Endpoints', status: 'in-progress', assignee: 'Coder' },
    { id: '4', title: 'Implement Frontend', status: 'todo', assignee: 'Coder' },
    { id: '5', title: 'Write Tests', status: 'todo', assignee: 'Reviewer' },
];

const KanbanBoard: React.FC = () => {
    const columns = {
        todo: MOCK_TASKS.filter(t => t.status === 'todo'),
        'in-progress': MOCK_TASKS.filter(t => t.status === 'in-progress'),
        done: MOCK_TASKS.filter(t => t.status === 'done'),
    };

    return (
        <div className="flex h-full p-4 space-x-4 bg-[#0d1117] overflow-x-auto">
            {Object.entries(columns).map(([status, tasks]) => (
                <div key={status} className="flex-1 min-w-[250px] flex flex-col bg-[#161b22] rounded-lg border border-gray-800">
                    <div className="p-3 border-b border-gray-800 font-semibold text-gray-300 uppercase text-xs tracking-wider flex justify-between items-center">
                        {status.replace('-', ' ')}
                        <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full text-xs">{tasks.length}</span>
                    </div>
                    <div className="p-2 flex-1 overflow-y-auto space-y-2">
                        {tasks.map(task => (
                            <div key={task.id} className="bg-[#21262d] p-3 rounded border border-gray-700 shadow-sm hover:border-blue-500 cursor-pointer transition-colors">
                                <div className="text-sm text-gray-200 mb-2">{task.title}</div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${task.assignee === 'Manager' ? 'bg-blue-900 text-blue-300' :
                                            task.assignee === 'Coder' ? 'bg-red-900 text-red-300' :
                                                task.assignee === 'DevOps' ? 'bg-yellow-900 text-yellow-300' :
                                                    'bg-green-900 text-green-300'
                                        }`}>
                                        {task.assignee}
                                    </span>
                                    <span className="text-xs text-gray-500">#{task.id}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
