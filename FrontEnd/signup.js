function submitForm() {
    const form = document.getElementById('signup-form');
    form.removeEventListener('submit', submitForm); // Remove the event listener temporarily

    const usernameInput = document.getElementById('username');
    const usernameError = document.getElementById('username-error');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        const username = usernameInput.value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Create an object with the form data
        const formData = {
            username: username,
            email: email,
            password: password
        };

        // Send the form data to the server
        fetch('/users/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Handle the response

                if (data.error) {
                    usernameError.textContent = data.error; // Display the error message
                    usernameError.style.display = 'block'; // Show the error message element
                    form.addEventListener('submit', submitForm); // Add back the event listener for future signups
                } else {
                    // Redirect to index.ejs
                    window.location.href = '/'; // Replace '/' with the actual URL of your index page
                }
            })
            .catch(error => {
                console.error(error); // Handle the error response
                form.addEventListener('submit', submitForm); // Add back the event listener for future signups
            });
    });

    // Re-add the event listener immediately
    form.addEventListener('submit', submitForm);
}