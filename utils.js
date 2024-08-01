export function checkScreenSize() {
    if (window.innerWidth < 768) {
        return 'tablet';
    }

    return 'desktop';
}

export function setupMenu() {
    const menuButton = document.querySelector('.menu-burger');

    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('active');
    });
}

export function setupBooking() {
    const searchButton = document.querySelector('.search-btn');

    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        searchButton.classList.toggle('active');
    });
}


