function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = document.getElementById('signInForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorContainer = document.querySelector('.error-message');

    const username = usernameInput.value;
    const password = passwordInput.value;

    fetch('/users/signIn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        }),
        credentials: 'same-origin' // Include cookies in the request
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Handle the response

            if (data.error) {
                errorContainer.textContent = data.error; // Display the error message
            } else {
                // Redirect to the user profile page
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.log(error); // Handle any error that occurred during the request
        });
}

document.getElementById('signInBtn').addEventListener('click', submitForm);
