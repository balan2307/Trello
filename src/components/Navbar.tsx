

interface NavbarProps {
    onReset: () => void;
}

function Navbar({ onReset }: NavbarProps) {
    return (
        <div className="flex items-center justify-between bg-white px-6 py-2 shadow-md">
            <h1 className="text-xl font-bold text-gray-700">Trello Clone</h1>
            <button 
                onClick={onReset}
                className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
            >
                Reset Board
            </button>
        </div>
    )
}

export default Navbar 