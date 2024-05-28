const root = document.getElementById('root')

/* detect if using dark mode theme */
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.classList.add('dark-mode')
}

/* watching for theme changes */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
    
    if(newColorScheme === "dark") {
        root.classList.add('dark-mode')
    } else {
        root.classList.remove('dark-mode')
    }
});