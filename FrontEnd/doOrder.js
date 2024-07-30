// פונקציה להוספת פריט להזמנה
async function addToOrder(itemName, price, quantity, itemId) {
  try {
    // בדיקת כמות מינימלית של פריט
    if (quantity < 1) {
      // הצגת הודעה אם הכמות נמוכה מ-1
      $('#match-message').text('Minimum quantity is 1 :)');
      $('#match-message').addClass('show-message');
      setTimeout(function () {
        $('#match-message').removeClass('show-message');
      }, 3000);
      return;
    }

    // שליחת בקשה לשרת להוספת פריט
    const response = await fetch('/orders/addToOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemName,
        price,
        quantity,
      }),
      credentials: 'same-origin', // כלול קוקיז בבקשה
    });

    // טיפול בתגובה מהשרת
    if (response.ok) {
      const updatedOrder = await response.json();

      // הצגת הודעה בהצלחה
      $('#match-message').text('Added to the cart!');
      $('#match-message').addClass('show-message');
      setTimeout(function () {
        $('#match-message').removeClass('show-message');
      }, 3000);

      
    // עדכון התצוגה של עגלת הקניות אם צריך
    // ניתן לקרוא לפונקציה לעדכון UI של העגלה כאן
    } else {
      const errorData = await response.json();
      if (response.status === 401) {
        // הצגת הודעה אם המשתמש לא מחובר
        $('#match-message').text('You have to log in to your user before adding items to the cart!');
        $('#match-message').addClass('show-message');
        setTimeout(function () {
          $('#match-message').removeClass('show-message');
        }, 5000);
      } else {
        // טיפול בשגיאות אחרות אם יש צורך
        console.log('Failed to add item to order:', errorData.message);
      }
    }
  } catch (error) {
    // טיפול בשגיאות בקוד
    console.error('Error adding item to order:', error);
  }
}

// פונקציה למחיקת פריט מההזמנה
async function deleteItem(itemName) {
  try {
    // שליחת בקשה לשרת למחיקת פריט
    const response = await fetch('/orders/deleteItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemName }),
      credentials: 'same-origin', // כלול קוקיז בבקשה
    });

    // טיפול בתגובה מהשרת
    if (response.ok) {
      location.reload(); // רענון הדף לאחר מחיקה מוצלחת
    } else {
      console.error('Failed to delete item:', response.status);
      // טיפול בתגובה שגויה אם יש צורך
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    // טיפול בשגיאות בקוד
  }
}
