import React, { useState } from 'react'
import { List, Task } from '../types';
import {CSS} from "@dnd-kit/utilities";
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

interface ListContainerProps {
    list: List;
    tasks: Task[];
    onAddTask: (content: string) => void;
    onUpdateTask: (taskId: string, newContent: string) => void;
    onDeleteTask: (taskId: string) => void;
    onDeleteList: (listId: string) => void;
    onUpdateList: (listId: string, newTitle: string) => void;
}

function ListContainer(props: ListContainerProps) {
    const {list, tasks, onAddTask, onUpdateTask, onDeleteTask, onDeleteList, onUpdateList} = props;
    const [isEditing, setIsEditing] = useState(false);
    const [newTaskContent, setNewTaskContent] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleContent, setTitleContent] = useState(list.title);

    const {setNodeRef, attributes, listeners, transition, transform, isDragging} = useSortable({
        id: list.id,
        data: {
            type: "List",
            list
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const handleAddTask = () => {
        if (newTaskContent.trim()) {
            onAddTask(newTaskContent.trim());
            setNewTaskContent('');
            setIsEditing(false);
        }
    };

    const handleUpdateTitle = () => {
        if (titleContent.trim() && titleContent !== list.title) {
            onUpdateList(list.id, titleContent.trim());
        }
        setIsEditingTitle(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUpdateTitle();
        }
        if (e.key === 'Escape') {
            setTitleContent(list.title);
            setIsEditingTitle(false);
        }
    };

    const taskIds = tasks.map(task => task.id);

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className={`bg-white w-[280px] max-h-[calc(100vh-7rem)] rounded-xl flex flex-col shadow-md ${isDragging ? 'opacity-50' : ''}`}
        >
            <div 
                {...attributes} 
                {...listeners}
                className='flex justify-between items-center p-3 text-lg font-bold rounded-t-xl text-gray-700 bg-gray-50 border-b border-gray-200 shrink-0'
            >
                <div className="flex-1" onClick={() => !isDragging && setIsEditingTitle(true)}>
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={titleContent}
                            onChange={(e) => setTitleContent(e.target.value)}
                            onBlur={handleUpdateTitle}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-white px-2 py-1 text-lg font-bold text-gray-700 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500/30"
                            autoFocus
                        />
                    ) : (
                        <div className="cursor-pointer px-1">{list.title}</div>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteList(list.id);
                    }}
                    className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>
            </div>
            
            <div className='flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2' onClick={e => e.stopPropagation()}>
                <SortableContext items={taskIds}>
                    {tasks.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task}
                            onUpdateTask={onUpdateTask}
                            onDeleteTask={onDeleteTask}
                        />
                    ))}
                </SortableContext>
            </div>

            <div className='mt-auto p-2 border-t border-gray-200 shrink-0 bg-white' onClick={e => e.stopPropagation()}>
                {isEditing ? (
                    <div className='flex flex-col gap-2'>
                        <textarea
                            className='w-full bg-white p-2 rounded-md text-sm text-gray-700 resize-none outline-none focus:ring-2 focus:ring-blue-500/30 border border-gray-200'
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
        </div>
    )
}

export default ListContainer
