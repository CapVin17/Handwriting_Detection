"use client"
const Navbar = () => {
  return <div>
    <header className='bg-gray-100 text-gray-900'>
        <div className='container mx-auto flex justify-between items-center py-4 px-6'>
            <h1 className='font-bold text-xl flex items-center'>
                <span className='text-indigo-600'>
                ZEKO
                </span>
                <span className='ml-2 text-sm text-gray-500'>
                    AI
                </span>
            </h1>
            <div>
                <button className='p-2'>
                    <svg xmlns='https://w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5.121 17.804A10 10 0 1118.804 5.121M12 7v5l3 3'/>
                    </svg>
                </button>
            </div>
        </div>
    </header>
  </div>
}

export default Navbar