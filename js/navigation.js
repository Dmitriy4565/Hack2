document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    let activeFound = false;
    
    navLinks.forEach(link => {
        const linkUrl = new URL(link.href);
        if (linkUrl.pathname === currentPath && !activeFound) {
            link.classList.add('active');
            activeFound = true;
        } else {
            link.classList.remove('active');
        }
    });
});