import  { useState } from 'react'

interface AddListProps {
    onAddList: (title: string) => void;
}

function AddList({ onAddList }: AddListProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');

    const handleSubmit = () => {
        if (title.trim()) {
            onAddList(title.trim());
            setTitle('');
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-gray-100 w-[250px] rounded-md p-2">
                <input
                    type="text"
                    className="w-full bg-white p-2 rounded-md text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                    placeholder="Enter list title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />
                <div className="flex items-center gap-2 mt-2">
                    <button
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-600"
                        onClick={handleSubmit}
                    >
                        Add List
                    </button>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                            setIsEditing(false);
                            setTitle('');
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            className="bg-gray-100/80 text-gray-600 p-2 rounded-md hover:bg-gray-200 flex items-center gap-2"
            onClick={() => setIsEditing(true)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Add List
        </button>
    );
}

export default AddList; 