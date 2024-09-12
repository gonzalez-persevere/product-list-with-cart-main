import data from '../../data.json' with {type: 'json'};
const cardContainer = document.querySelector('.card-container');
const cartNumber = document.querySelector('.cart-number');
const items = document.querySelector('.items');
const empty = document.querySelectorAll('.empty');
const cartObj = {};

data.forEach(item => {
    // Creates a card for all the items in the json file
    cardContainer.innerHTML += `<div class="card border-0" style="width: 18rem;">
    <div class='img-container'>
  <img src=${item.image.desktop} class="card-img-top" alt="...">
  <div class="btn rounded-pill w-75 card-btn" data-title='${item.name}' data-price=${item.price}><img class='me-2' src='./assets/images/icon-add-to-cart.svg'>Add to Cart</div>
  </div>
  <div class="card-body">
  <p class="card-text mt-3">${item.category}</p>
    <h5 class="card-title">${item.name}</h5>
    <p class="card-text">$${(item.price).toFixed(2)}</p>
  </div>
</div>`
})

// Attach the event listener to all .card-btn buttons
document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', handleClick);
});

// Define the main button click event listener
function handleClick(e) {
    let btn = e.target.closest('.card-btn'); // The clicked button
    btn.style.backgroundColor = 'hsl(14, 86%, 42%)';
    btn.innerHTML = `
        <img class='decrement' src='./assets/images/icon-decrement-quantity.svg'> 
        <span class='text-white item-increment'>1</span> 
        <img class='increment' src='./assets/images/icon-increment-quantity.svg'>`;
    btn.classList.add('increment-decrement');

    addOne(e); // Call your addOne function

    // Add event listeners for the dynamically added .increment and .decrement elements
    const decrementBtn = btn.querySelector('.decrement');
    const incrementBtn = btn.querySelector('.increment');

    // Event listeners for the + and - images
        decrementBtn.addEventListener('click', decrementQuantity);
        incrementBtn.addEventListener('click', incrementQuantity);

    // Remove the event listener from the main button to prevent further clicks
    btn.removeEventListener('click', handleClick);
}

// Increases quantity when plus img is clicked
function incrementQuantity(e) {
    e.stopPropagation(); // Stop event bubbling

    const btn = e.target.closest('.card-btn');
    const title = btn.dataset.title;

        cartObj[title].quantity += 1; 

    // Update the quantity in the UI
    const itemIncrement = btn.querySelector('.item-increment');

        itemIncrement.innerText = cartObj[title].quantity;

    updateUI();
}

// Decreases quantity when minus img is clicked
function decrementQuantity(e) {
    e.stopPropagation(); // Stop event bubbling

    const btn = e.target.closest('.card-btn');
    const title = btn.dataset.title;

    if (cartObj[title] && cartObj[title].quantity > 0) {
        cartObj[title].quantity -= 1;
        if (cartObj[title].quantity === 0) {
            delete cartObj[title]; // Remove from cart if quantity is 0
            resetButton(btn); // Reset button UI
        }

        // Update the quantity in the UI
        const itemIncrement = btn.querySelector('.item-increment');
        if (itemIncrement) {
            itemIncrement.innerText = cartObj[title].quantity || '|'; // Use '|' if quantity is 0
        }
    }

    updateUI();
}

// Adds the item when it is first selected
function addOne(e) {
    const btn = e.target.closest('.card-btn');
    const title = btn.dataset.title;

    // Takes empty cart image off
    empty.forEach(item => item.classList.add('d-none'));

    cartObj[title] = { quantity: 1, price: btn.dataset.price };

    cartNumber.innerText = Number(cartNumber.textContent) + 1;
    updateUI();
}

// Update the cart UI
function updateUI() {
    items.innerHTML = ''; // Clear current items
    let totalQuantity = 0;
    let totalPrice = 0;
    let cartIsEmpty = true; // Flag to check if cart is empty

    for (const title in cartObj) {
        if (cartObj[title].quantity > 0) {
            cartIsEmpty = false; // There are items in the cart

            const quantity = cartObj[title].quantity;
            const price = Number(cartObj[title].price);
            totalQuantity += quantity;
            totalPrice += quantity * price;

            // Update the list in the cart with an "X" button to remove the item
            items.innerHTML += `
                <li class='d-flex justify-content-between mt-3'>
                    <b>${title}</b>
                    <button class="remove-item btn btn-outline-danger fw-bold" data-title="${title}">X</button>
                </li>
                <li>
                    <span class='text-main fw-bold me-3'>${quantity}x</span>
                    <span class='me-3'>@${price.toFixed(2)}</span>
                    <span>$${(quantity * price).toFixed(2)}</span>
                </li>
            `;
        }
    }

    // Add Order Total and Confirm Order button
    items.innerHTML += ` <div class='confirm'>
        <li class="mt-2 border-top pt-2 d-flex justify-content-between">
            <b>Order Total:</b>
            <span class='fw-bold fs-4'>$${totalPrice.toFixed(2)}</span>
        </li>
        <li class="mt-2 text-center">
        <img src='./assets/images/icon-carbon-neutral.svg'> 
            <span>This is a <b>carbon-neutral</b> delivery<span>
        </li>
        <li class="mt-2">
            <button class="btn w-100 bg-main text-light rounded-pill" id="confirm-order-btn">Confirm Order</button>
        </li>
        </div>
    `;

      // Add event listener for the Confirm Order button
      document.querySelector('#confirm-order-btn').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.querySelector('#orderModal'));
        document.querySelector('#modal-total-price').innerText = totalPrice.toFixed(2); // Update modal with total price
        modal.show();
    });

    // Update cart quantity number
    cartNumber.innerText = totalQuantity;

    // Show or hide the empty cart indicator
    if (cartIsEmpty) {
        empty.forEach(item => item.classList.remove('d-none'));
        document.querySelector('.confirm').classList.add('d-none')
    } else {
        empty.forEach(item => item.classList.add('d-none'));
        document.querySelector('.confirm').classList.remove('d-none')
    }


    // Add event listeners to the "X" buttons for removing items
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}


// Function to remove an item from the cart
function removeItem(e) {
    const title = e.target.dataset.title;

    // Remove item from cart object
    if (cartObj[title]) {
        delete cartObj[title];

        // Reset button to its initial state
        const btn = document.querySelector(`.card-btn[data-title="${title}"]`);
        if (btn) {
            resetButton(btn);
        }

        updateUI(); // Update the UI to reflect changes
    }
}

// Reset the button UI to its initial state
function resetButton(btn) {
    btn.style.backgroundColor = 'white';
    btn.classList.remove('increment-decrement');
    btn.innerHTML = `<img class='me-2' src='./assets/images/icon-add-to-cart.svg'>Add to Cart`;
    btn.addEventListener('click', handleClick); // Reattach event listener
}