import React, { useState } from 'react'
import { Task } from '../types'
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities";

interface TaskCardProps {
    task: Task;
    onUpdateTask?: (taskId: string, newContent: string) => void;
}

function TaskCard({ task, onUpdateTask }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(task.content);

    const {setNodeRef, attributes, listeners, transition, transform, isDragging} = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task
        },
        disabled: isEditing
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1
    }

    const handleUpdateContent = () => {
        if (content.trim() && content !== task.content && onUpdateTask) {
            onUpdateTask(task.id, content.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUpdateContent();
        }
        if (e.key === 'Escape') {
            setContent(task.content);
            setIsEditing(false);
        }
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners} 
            className="bg-white p-2 rounded-md shadow-sm hover:bg-gray-50 cursor-grab text-gray-700 border border-gray-200"
            onClick={() => !isDragging && onUpdateTask && setIsEditing(true)}
        >
            {isEditing ? (
                <textarea
                    className="w-full bg-white rounded text-sm text-gray-700 resize-none outline-none focus:ring-2 focus:ring-blue-500/30"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={handleUpdateContent}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <div className="min-h-[20px]">{task.content}</div>
            )}
        </div>
    )
}

export default TaskCard 