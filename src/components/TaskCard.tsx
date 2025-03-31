import React, { useState } from 'react'
import { Task } from '../types'
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities";
import TaskModal from './TaskModal';

interface TaskCardProps {
    task: Task;
    onUpdateTask?: (taskId: string, newContent: string) => void;
    onDeleteTask?: (taskId: string) => void;
}

function TaskCard({ task, onUpdateTask, onDeleteTask }: TaskCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {setNodeRef, attributes, listeners, transition, transform, isDragging} = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task
        },
        disabled: isModalOpen
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1
    }

    const handleClick = (e: React.MouseEvent) => {
        if (!isDragging) {
            e.stopPropagation();
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div 
                ref={setNodeRef} 
                style={style} 
                {...attributes} 
                {...listeners} 
                className="overflow-x-auto overflow-y-hidden bg-white p-2 rounded-md shadow-sm hover:bg-gray-50 cursor-grab text-gray-700 border border-gray-200"
                onClick={handleClick}
            >
                <div className="min-h-[20px]">{task.content}</div>
                {task.dueDate && (
                    <div className="mt-2 text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                )}
            </div>

            {onUpdateTask && onDeleteTask && (
                <TaskModal
                    task={task}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                />
            )}
        </>
    )
}

export default TaskCard 