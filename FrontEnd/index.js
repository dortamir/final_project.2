window.addEventListener('DOMContentLoaded', () => {
    fetch('/check-login')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                // אם המשתמש מחובר
                // כאן אפשר לגשת למידע של המשתמש ולהשתמש בו לפי הצורך   
                console.log('User is logged in:', data.user);
            } else {
                // אם המשתמש לא מחובר
                console.log('User is not logged in');
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
        });
});

