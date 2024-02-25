import Mobilenav from '@/components/shared/Mobilenav'
import Sidebar from '@/components/shared/Sidebar'
import { Toaster } from '@/components/ui/toaster'
import React from 'react'

const Root = ({children}: {children:React.ReactNode}) => {
  return (
        <main className='root'>
            <Sidebar/>
            <Mobilenav/>
            <div className='root-container bg-customBackground'>
                <div className='wrapper'>
                    {children}    
                </div>    
            </div>   
            <Toaster/> 
        </main>
    )
}

export default Root