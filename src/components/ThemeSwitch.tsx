import { useState,useEffect } from "react";

import { FaRegSun, FaRegMoon } from "react-icons/fa";

const ThemeSwitch = () => {
    

    
    
    const [darkMode,setDarkMode]=useState<string>('light')
    
    useEffect(() => {
        if (darkMode === 'light') {
            document.documentElement.classList.remove('dark')
        }
        else { 
            document.documentElement.classList.add('dark')
        }
    }, [darkMode])
    
    return (
      
            
      <button onClick={() => setDarkMode(darkMode === 'light' ? 'dark' : 'light')} className="btn btn-primary">
          {darkMode==='dark'?<FaRegSun />:<FaRegMoon />}</button>

  )
}

export default ThemeSwitch