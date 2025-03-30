import React from 'react'
import { List } from '../types';
import {CSS} from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

interface ListContainerProps {
    list:List;
}


function ListContainer(props:ListContainerProps) {

    const {list} = props;

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

    if(isDragging){
        return <div ref={setNodeRef} style={style} className='bg-[#333333] text-white
         w-[250px] h-[500px] rounded-md max-h-[500px] flex flex-col
         opacity-40'></div>
    }



  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className='bg-[#333333] text-white w-[250px] h-[500px] rounded-md max-h-[500px] flex flex-col'>
        <div className='flex p-2 text-lg font-bold cursor-grab rounded-md'>
        {list.title}
        </div>
        
        <div className='flex flex-grow'>

            Content

        </div>

        
      
    </div>
  )
}

export default ListContainer
