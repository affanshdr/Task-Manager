import React from 'react'
// import Image from ../../assets/images/..png

const NavbarLayout = ({children}) => {
    return (
        <div className='flex items-center justify-between top-0 left-0 w-screen h-20 bg-amber-600 text-4xl px-10'>
                <h1>NoTuDo</h1>
                <a href="/signup">Sign Up</a>
        </div>
    )
}

export default NavbarLayout;

