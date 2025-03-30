import React, { useState } from 'react'
import { List, Task } from '../types';
import {CSS} from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

interface ListContainerProps {
    list: List;
    tasks: Task[];
    onAddTask: (content: string) => void;
}

function ListContainer(props:ListContainerProps) {
    const {list, tasks, onAddTask} = props;
    const [isEditing, setIsEditing] = useState(false);
    const [newTaskContent, setNewTaskContent] = useState('');

    const {setNodeRef ,attributes ,listeners ,transition ,transform ,isDragging} = useSortable({
        id:list.id,
        data:{
            type:"list",
            list
        }
    });

    const style={
        transition,
        transform:CSS.Transform.toString(transform)
    }

    const handleAddTask = () => {
        if (newTaskContent.trim()) {
            onAddTask(newTaskContent.trim());
            setNewTaskContent('');
            setIsEditing(false);
        }
    };

    const TaskContent = () => (
        <>
            <div className='flex p-2 text-lg font-bold cursor-grab rounded-md text-gray-700'>
                {list.title}
            </div>
            
            <div className='flex-1 overflow-y-auto p-2 flex flex-col gap-2'>
                {tasks.map(task => (
                    <div key={task.id} className='bg-white p-2 rounded-md shadow-sm hover:bg-gray-50 cursor-pointer text-gray-700 border border-gray-200'>
                        {task.content}
                    </div>
                ))}
            </div>

            <div className='footer p-2 border-t border-gray-200'>
                {isEditing ? (
                    <div className='flex flex-col gap-2'>
                        <textarea
                            className='w-full bg-white p-2 rounded-md text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200'
                            placeholder='Enter a title for this card...'
                            value={newTaskContent}
                            onChange={(e) => setNewTaskContent(e.target.value)}
                            rows={3}
                            autoFocus
                        />
                        <div className='flex items-center gap-2'>
                            <button
                                className='bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-600'
                                onClick={handleAddTask}
                            >
                                Add card
                            </button>
                            <button
                                className='text-gray-500 hover:text-gray-700'
                                onClick={() => {
                                    setIsEditing(false);
                                    setNewTaskContent('');
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        className='flex w-full items-center gap-2 rounded-md p-2 hover:bg-gray-100 text-sm text-gray-600'
                        onClick={() => setIsEditing(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                        <span>Add a card</span>
                    </button>
                )}
            </div>
        </>
    );

    if(isDragging){
        return (
            <div ref={setNodeRef} style={style} className='bg-white w-[250px] h-[500px] rounded-md max-h-[500px] flex flex-col opacity-40 shadow-md'>
                <TaskContent />
            </div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className='bg-white w-[250px] h-[500px] rounded-md max-h-[500px] flex flex-col shadow-md'>
            <TaskContent />
        </div>
    )
}

export default ListContainer
