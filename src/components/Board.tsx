import React, { useState } from "react";
import { List, Task } from "../types";
import ListContainer from "./ListContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Navbar from "./Navbar";
import AddList from "./AddList";

function Board() {
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeList,setActiveList]=useState<List|null>(null);

  const sensors=useSensors(useSensor(PointerSensor ,{
    activationConstraint:{
      distance:3,
    }
  }));

  function handleDragStart(event:DragStartEvent){
    if(event.active.data.current?.type==="list"){
      setActiveList(event.active.data.current.list);
      return
    }
  }

  function handleDragEnd(event:DragEndEvent){
    const {active,over}=event;
    if(!over) return

    const sourceListId=active.id;
    const destinationListId=over.id;

    if(sourceListId===destinationListId) return;

    const sourceListIndex=lists.findIndex((list)=>list.id===sourceListId);
    const destinationListIndex=lists.findIndex((list)=>list.id===destinationListId);

    const updateLists= arrayMove(lists, sourceListIndex, destinationListIndex);
    setLists(updateLists);
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

  return (
    <div className="fixed inset-0 flex flex-col">
      <Navbar />

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto p-4 bg-[#E2E4E9]">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
          <div className="flex gap-4 min-w-max pb-4">
            <SortableContext items={lists.map((list) => list.id)}>
              {lists.map((list) => (
                <ListContainer 
                  key={list.id} 
                  list={list} 
                  tasks={tasks.filter(task => task.listId === list.id)}
                  onAddTask={(content) => handleAddTask(list.id, content)}
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
