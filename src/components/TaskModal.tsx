import{ useState } from 'react';
import { Task } from '../types';

interface TaskModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onUpdateTask: (taskId: string, newContent: string) => void;
    onDeleteTask: (taskId: string) => void;
}

function TaskModal({ task, isOpen, onClose, onUpdateTask, onDeleteTask }: TaskModalProps) {
    const [title, setTitle] = useState(task.content);
    const [description, setDescription] = useState(task.description || '');
    const [dueDate, setDueDate] = useState(task.dueDate || '');

    if (!isOpen) return null;

    const handleSave = () => {
        onUpdateTask(task.id, title);
        onClose();
    };

    const handleDelete = () => {
        onDeleteTask(task.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg w-full max-w-2xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Task Details</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

            
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                </div>

                
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        placeholder="Add a more detailed description..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskModal; 