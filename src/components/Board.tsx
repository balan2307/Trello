import React, { useState } from "react";
import { List } from "../types";
import ListContainer from "./ListContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function Board() {
  const [lists, setLists] = useState<List[]>([]);

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

  function handleAddList() {
    setLists([
      ...lists,
      { id: crypto.randomUUID(), title: `Column ${lists.length + 1}` },
    ]);
  }
  return (
    <div className="fixed inset-0 flex flex-col overflow-y-hidden">
      <div className="flex-1 overflow-x-auto p-4">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
          <div className="flex gap-4 min-w-max pb-4">
            <SortableContext items={lists.map((list) => list.id)}>
              {lists.map((list) => (
                <ListContainer key={list.id} list={list} />
              ))}
            </SortableContext>
            
            <div className="flex items-center h-[100px]">
              <button
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={handleAddList}
              >
                Add List
              </button>
            </div>
          </div>

          {
            createPortal(
              <DragOverlay>
                {
                  activeList && <ListContainer list={activeList} />
                }
              </DragOverlay>,
              document.body
            )
          }
        </DndContext>
      </div>
    </div>
  );
}

export default Board;
