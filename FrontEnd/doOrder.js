// doOrder.js

async function addToOrder(itemName, price, quantity, itemId) {
  try {
    if (quantity < 1) {
      // Show pop-up message
      $('#match-message').text('Minimum quantity is 1 :)');
      $('#match-message').addClass('show-message');
      setTimeout(function () {
        $('#match-message').removeClass('show-message');
      }, 3000);
      return;
    }

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
      credentials: 'same-origin', // Include cookies in the request
    });

    if (response.ok) {
      const updatedOrder = await response.json();

      // Show pop-up message
      $('#match-message').text('Added to the cart!');
      $('#match-message').addClass('show-message');
      setTimeout(function () {
        $('#match-message').removeClass('show-message');
      }, 3000);

      // Update the cart display if needed
      // For example, you can call a function to update the cart UI
    } else {
      const errorData = await response.json();
      if (response.status === 401) {
        // Show pop-up message
        $('#match-message').text('You have to log in to your user before adding items to the cart!');
        $('#match-message').addClass('show-message');
        setTimeout(function () {
          $('#match-message').removeClass('show-message');
        }, 5000);
      } else {
        // Handle other error responses, if needed
        console.log('Failed to add item to order:', errorData.message);
      }
    }
  } catch (error) {
    // Handle any error that occurred during the request
    console.error('Error adding item to order:', error);
  }
}
async function deleteItem(itemName) {
  try {
    const response = await fetch('/orders/deleteItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemName }),
      credentials: 'same-origin', // Include cookies in the request
    });

    if (response.ok) {
      location.reload(); // Reload the page after successful deletion
    } else {
      console.error('Failed to delete item:', response.status);
      // Handle the error response
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    // Handle any error that occurred during the request
  }
}
