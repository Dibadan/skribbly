import Mobilenav from '@/components/shared/Mobilenav'
import Sidebar from '@/components/shared/Sidebar'
import React from 'react'

const Root = ({children}: {children:React.ReactNode}) => {
  return (
        <main className='root'>
            <Sidebar/>
            <Mobilenav/>
            <div className='root-container'>
                <div className='wrapper'>
                    {children}    
                </div>    
            </div>    
        </main>
    )
}

export default Root