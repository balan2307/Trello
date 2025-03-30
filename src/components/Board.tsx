import React, { useState } from "react";
import { List, Task } from "../types";
import ListContainer from "./ListContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Navbar from "./Navbar";
import AddList from "./AddList";
import TaskCard from "./TaskCard";
import { DragOverEvent } from "@dnd-kit/core";

function Board() {
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeList, setActiveList] = useState<List|null>(null);
  const [activeTask, setActiveTask] = useState<Task|null>(null);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    }
  }));

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "List") {
      setActiveList(event.active.data.current.list);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function handleDragEnd(event: DragEndEvent) {

    setActiveList(null);
    setActiveTask(null);

    const {active, over} = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overId = over.id;

    // Handle list reordering
    if (activeType === "List") {
      const sourceListId = active.id;
      const destinationListId = overId;

      if (sourceListId === destinationListId) return;

      const sourceListIndex = lists.findIndex((list) => list.id === sourceListId);
      const destinationListIndex = lists.findIndex((list) => list.id === destinationListId);

      const updatedLists = arrayMove(lists, sourceListIndex, destinationListIndex);
      setLists(updatedLists);
    }

    // Handle task reordering
    if (activeType === "Task") {
      const activeTaskId = active.id;
      const overTaskId = overId;

      if (activeTaskId === overTaskId) return;

      const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);
      const overIndex = tasks.findIndex((t) => t.id === overTaskId);

      const updatedTasks = arrayMove(tasks, activeIndex, overIndex);
      setTasks(updatedTasks);
    }

    setActiveList(null);
    setActiveTask(null);
  }

  const handleAddTask = (listId: string, content: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      content,
      listId
    };
    setTasks([...tasks, newTask]);
  };

  function handleAddList(title: string) {
    setLists([
      ...lists,
      { id: crypto.randomUUID(), title },
    ]);
  }

  const handleUpdateTask = (taskId: string, newContent: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, content: newContent } : task
    ));
  };

  function handleDragOver(event: DragOverEvent) {
    const {active, over } = event;
    if(!over) return; 

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    
    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if(!isActiveTask)  return

    if(isActiveTask && isOverTask){
    setTasks((tasks)=>{
      const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);
      const overIndex = tasks.findIndex((t) => t.id === overTaskId);

    
        tasks[activeIndex].listId = tasks[overIndex].listId;
       
      
      const newTasks = arrayMove(tasks, activeIndex, overIndex);
      return newTasks;
    })
      
    }

    const isOverList = over.data.current?.type === "List";
    if(isActiveTask && isOverList){

      setTasks((tasks)=>{
        const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);
        const overIndex = tasks.length - 1;
        tasks[activeIndex].listId = over.id.toString();
        return arrayMove(tasks, activeIndex, overIndex);
      })

    }
    
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      <Navbar />

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto p-4 bg-[#E2E4E9]">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}  sensors={sensors}>
          <div className="flex gap-4 min-w-max pb-4">
            <SortableContext items={lists.map((list) => list.id)}>
              {lists.map((list) => (
                <ListContainer 
                  key={list.id}
                  list={list}
                  tasks={tasks.filter(task => task.listId === list.id)}
                  onAddTask={(content) => handleAddTask(list.id, content)}
                  onUpdateTask={handleUpdateTask}
                />
              ))}
            </SortableContext>
            
            <div className="flex justify-start h-min">
              <AddList onAddList={handleAddList} />
            </div>
          </div>

          {createPortal(
            <DragOverlay>
              {activeList && (
                <ListContainer 
                  list={activeList}
                  tasks={tasks.filter(task => task.listId === activeList.id)}
                  onAddTask={(content) => handleAddTask(activeList.id, content)}
                  onUpdateTask={handleUpdateTask}
                />
              )}
              {activeTask && (
                <TaskCard 
                  task={activeTask}
                  onUpdateTask={handleUpdateTask}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
}

export default Board;
