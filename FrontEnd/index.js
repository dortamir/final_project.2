window.addEventListener('DOMContentLoaded', () => {
    fetch('/check-login')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                // User is logged in
                // You can access the user data from data.user and use it as needed
                console.log('User is logged in:', data.user);
            } else {
                // User is not logged in
                console.log('User is not logged in');
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
        });
});

