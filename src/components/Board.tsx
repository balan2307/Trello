import { useState } from "react";
import { List, Task } from "../types";
import ListContainer from "./ListContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Navbar from "./Navbar";
import AddList from "./AddList";
import TaskCard from "./TaskCard";
import { DragOverEvent } from "@dnd-kit/core";
import useLocalStorage from "../hooks/useLocalStorage";

function Board() {
  const [lists, setLists] = useLocalStorage<List[]>("kanban-lists", []);
  const [tasks, setTasks] = useLocalStorage<Task[]>("kanban-tasks", []);
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

    if (activeType === "List") {
      const sourceListId = active.id;
      const destinationListId = overId;

      if (sourceListId === destinationListId) return;
      const sourceListIndex = lists.findIndex((list: List) => list.id === sourceListId);
      const destinationListIndex = lists.findIndex((list: List) => list.id === destinationListId);
      const updatedLists = arrayMove(lists as List[], sourceListIndex, destinationListIndex);
      setLists(updatedLists);
    }

    if (activeType === "Task") {
      const activeTaskId = active.id;
      const overTaskId = overId;

      if (activeTaskId === overTaskId) return;

      const activeIndex = tasks.findIndex((t: Task) => t.id === activeTaskId);
      const overIndex = tasks.findIndex((t: Task) => t.id === overTaskId);
      const updatedTasks = arrayMove(tasks as Task[], activeIndex, overIndex);
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
    setTasks(tasks.map((task: Task) => 
      task.id === taskId ? { ...task, content: newContent } : task
    ));
  };

  function handleDragOver(event: DragOverEvent) {
    const {active, over} = event;
    if(!over) return; 

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((prevTasks: Task[]) => {
        const activeIndex = prevTasks.findIndex((t) => t.id === activeTaskId);
        const overIndex = prevTasks.findIndex((t) => t.id === overTaskId);

        const updatedTasks = [...prevTasks];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          listId: updatedTasks[overIndex].listId
        };

        return arrayMove(updatedTasks, activeIndex, overIndex);
      });
    }

    const isOverList = over.data.current?.type === "List";
    if (isActiveTask && isOverList) {
      setTasks((prevTasks: Task[]) => {
        const activeIndex = prevTasks.findIndex((t) => t.id === activeTaskId);
        const updatedTasks = [...prevTasks];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          listId: over.id.toString()
        };
        
        return arrayMove(updatedTasks, activeIndex, activeIndex);
      });
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks: Task[]) => prevTasks.filter((task: Task) => task.id !== taskId));
  };

  const handleReset = () => {
    setLists([]);
    setTasks([]);
  };

  const handleDeleteList = (listId: string) => {
    setLists((prevLists: List[]) => prevLists.filter(list => list.id !== listId));
    setTasks((prevTasks: Task[]) => prevTasks.filter(task => task.listId !== listId));
  };

  const handleUpdateList = (listId: string, newTitle: string) => {
    setLists((prevLists: List[]) => 
      prevLists.map(list => 
        list.id === listId ? { ...list, title: newTitle } : list
      )
    );
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <Navbar onReset={handleReset} />

    
      <div className="flex-1 overflow-x-auto p-4 bg-[#E2E4E9]">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver} sensors={sensors}>
          <div className="flex gap-4 min-w-max pb-4">
            <SortableContext items={lists.map((list: List) => list.id)}>
              {lists.map((list: List) => (
                <ListContainer 
                  key={list.id}
                  list={list}
                  tasks={tasks.filter((task: Task) => task.listId === list.id)}
                  onAddTask={(content) => handleAddTask(list.id, content)}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onDeleteList={handleDeleteList}
                  onUpdateList={handleUpdateList}
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
                  tasks={tasks.filter((task: Task) => task.listId === activeList.id)}
                  onAddTask={(content) => handleAddTask(activeList.id, content)}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onDeleteList={handleDeleteList}
                  onUpdateList={handleUpdateList}
                />
              )}
              {activeTask && (
                <TaskCard 
                  task={activeTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
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
