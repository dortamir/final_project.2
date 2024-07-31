function submitForm() {
    const form = document.getElementById('signup-form');
    form.removeEventListener('submit', submitForm);

    const usernameInput = document.getElementById('username');
    const usernameError = document.getElementById('username-error');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // מנע את שליחת הטופס הבסיסית (רענון הדף)

        // קבלת נתוני הטופס
        const username = usernameInput.value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // יצירת אובייקט עם נתוני הטופס
        const formData = {
            username: username,
            email: email,
            password: password
        };

        // שלח את נתוני הטופס לשרת
        fetch('/users/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data); // הדפס את התגובה

                if (data.error) {
                    usernameError.textContent = data.error; // הצג את הודעת השגיאה
                    usernameError.style.display = 'block'; // הצג את אלמנט השגיאה
                    form.addEventListener('submit', submitForm); // הוסף מחדש את מאזין האירועים למניעת שגיאות עתידיות
                } else {
                    // אם אין שגיאות, הפנה את המשתמש לדף הראשי
                    window.location.href = '/'; // החלף '/' בכתובת המתאימה לדף הראשי
                }
            })
            .catch(error => {
                // טיפול בשגיאות במקרה של כשלון במהלך הבקשה
                console.error(error); // הדפס שגיאה 
                form.addEventListener('submit', submitForm); // הוסף מחדש את מאזין האירועים למניעת שגיאות עתידיות
            });
    });

    // הוסף מחדש את מאזין האירועים מיד לאחר מכן
    form.addEventListener('submit', submitForm);
}