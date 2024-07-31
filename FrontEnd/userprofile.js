function submitForm(event) {
    event.preventDefault(); // מנע את שליחת הטופס הבסיסית (רענון הדף)
    
    //קבלת אלמנטים
    const form = document.getElementById('signInForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorContainer = document.querySelector('.error-message');

    const username = usernameInput.value;
    const password = passwordInput.value;

    errorContainer.textContent = '';

    // שלח את נתוני ההתחברות לשרת
    fetch('/users/signIn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // ציין שהתוכן הוא JSON
        },
        body: JSON.stringify({ // המר את נתוני ההתחברות ל-JSON
            username,
            password
        }),
        credentials: 'same-origin' // כלול את הקוקיז בבקשה
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); // הדפס את התגובה

            if (data.error) {
                // אם יש שגיאה, הצג את הודעת השגיאה
                errorContainer.textContent = data.error; 
            } else {
            // אם אין שגיאות, הפנה את המשתמש לדף הראשי
            window.location.href = '/';
            }
        })
        .catch(error => {
            // טיפול בשגיאות במקרה של כשלון במהלך הבקשה
            console.log(error); // Handle any error that occurred during the request
            errorContainer.textContent = 'An error occurred. Please try again.';
            errorContainer.style.color = 'red';
        });
}

// הוסף מאזין לאירוע הקלקה על כפתור הכניסה
document.getElementById('signInBtn').addEventListener('click', submitForm);
