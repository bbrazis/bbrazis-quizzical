import React from "react"
import ReactDOM from "react-dom/client"
import App from './App'
const root = document.getElementById('root')

ReactDOM.createRoot(root).render(<App />);

/* detect if using dark mode theme */
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.querySelector('.wrapper').classList.add('dark-mode')
}

/* watching for theme changes */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
    
    if(newColorScheme === "dark") {
        root.querySelector('.wrapper').classList.add('dark-mode')
    } else {
	    root.querySelector('.wrapper').classList.remove('dark-mode')
    }
});