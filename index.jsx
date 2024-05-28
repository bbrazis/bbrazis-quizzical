import React from "react"
import ReactDOM from "react-dom/client"
import App from './App'
const root = document.getElementById('root')
const wrapper = document.querySelector('wrapper')

ReactDOM.createRoot(root).render(<App />);

/* detect if using dark mode theme */
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    wrapper.classList.add('dark-mode')
}

/* watching for theme changes */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
    
    if(newColorScheme === "dark") {
        wrapper.classList.add('dark-mode')
    } else {
	    wrapper.classList.remove('dark-mode')
    }
});