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
        <img class='increment' src='./assets/images/icon-increment-quantity.svg'>
    `;
    btn.classList.add('increment-decrement');

    addOne(e); // Call your addOne function

    // Add event listeners for the dynamically added .increment and .decrement elements
    const decrementBtn = btn.querySelector('.decrement');
    const incrementBtn = btn.querySelector('.increment');

    if (decrementBtn) {
        decrementBtn.addEventListener('click', decrementQuantity);
    }

    if (incrementBtn) {
        incrementBtn.addEventListener('click', incrementQuantity);
    }

    // Remove the event listener from the main button to prevent further clicks
    btn.removeEventListener('click', handleClick);
}

// Increases quantity when plus img is clicked
function incrementQuantity(e) {
    e.stopPropagation(); // Stop event bubbling

    const btn = e.target.closest('.card-btn');
    const title = btn.dataset.title;

    if (cartObj[title]) {
        cartObj[title].quantity += 1;
    } else {
        cartObj[title] = { quantity: 1, price: btn.dataset.price };
    }

    // Update the quantity in the UI
    const itemIncrement = btn.querySelector('.item-increment');
    if (itemIncrement) {
        itemIncrement.innerText = cartObj[title].quantity;
    }

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

    // Update the quantity in the UI
    const itemIncrement = btn.querySelector('.item-increment');
    if (itemIncrement) {
        itemIncrement.innerText = 1;
    }

    cartNumber.innerText = Number(cartNumber.textContent) + 1;
    updateUI();
}

// Reset the button UI when quantity is 0
function resetButton(btn) {
    btn.style.backgroundColor = 'white';
    btn.classList.remove('increment-decrement');
    btn.innerHTML = `<img class='me-2' src='./assets/images/icon-add-to-cart.svg'>Add to Cart`;
    btn.addEventListener('click', handleClick); // Reattach event listener
}

// Update the cart UI
function updateUI() {
    items.innerHTML = ''; // Clear current items
    let totalQuantity = 0;

    for (const title in cartObj) {
        if (cartObj[title].quantity > 0) {
            const quantity = cartObj[title].quantity;
            const price = Number(cartObj[title].price).toFixed(2);
            totalQuantity += quantity;

            // Update the list in the cart
            items.innerHTML += `
                <li><b>${title}</b></li>
                <li><span class='text-main fw-bold me-3'>${quantity}x</span><span class='me-3'>@${price}</span><span>$${(quantity * price).toFixed(2)}</span></li>
            `;
        }
    }

    cartNumber.innerText = totalQuantity; // Update cart quantity number
}

