import data from '../../data.json' with {type: 'json'};
const cardContainer = document.querySelector('.card-container');
const cartNumber = document.querySelector('.cart-number');
const items = document.querySelector('.items');
const empty = document.querySelectorAll('.empty');
let itemArray = [];
let cartObj = {}

data.forEach(item => {
    cardContainer.innerHTML += `<div class="card border-0" style="width: 18rem;">
    <div class='img-container'>
  <img src=${item.image.desktop} class="card-img-top" alt="...">
  <button class="btn rounded-pill w-75 card-btn" data-title=${item.name} data-price=${item.price}><img class='me-2' src='./assets/images/icon-add-to-cart.svg'>Add to Cart</button>
  </div>
  <div class="card-body">
  <p class="card-text mt-3">${item.category}</p>
    <h5 class="card-title">${item.name}</h5>
    <p class="card-text">$${(item.price).toFixed(2)}</p>
  </div>
</div>`
})

document.querySelectorAll('.card-btn').forEach(btn => {

    btn.addEventListener('mouseenter', (e) => {
        btn.style.backgroundColor = 'hsl(14, 86%, 42%)';
        btn.innerHTML = `<img class='decrement' src='./assets/images/icon-decrement-quantity.svg'> <span class='text-white item-increment'>|</span> <img class='increment' src='./assets/images/icon-increment-quantity.svg'>`
        btn.classList.add('increment-decrement')

        // Increment
        document.querySelector('.increment').addEventListener('click', (e) => {
             items.innerHTML = ``
            empty.forEach(item => item.classList.add('d-none'))
            
            if(Object.keys(cartObj).includes(e.target.parentElement.dataset.title)){
                cartObj[e.target.parentElement.dataset.title] = {...cartObj[e.target.parentElement.dataset.title], quantity: cartObj[e.target.parentElement.dataset.title].quantity + 1, price: e.target.parentElement.dataset.price}
            } else {
                
                cartObj[e.target.parentElement.dataset.title] = {...cartObj[e.target.parentElement.dataset.title], quantity: 1, price: e.target.parentElement.dataset.price}
            }
            let number = Number(cartNumber.textContent) + 1;

            cartNumber.innerText = number;
            for (const property in cartObj) {
                document.querySelector('.item-increment').innerText = cartObj[property].quantity;
                items.innerHTML += `<li><b>${property}</b></li>`
                items.innerHTML += `<li><span class='text-main fw-bold me-3'>${cartObj[property].quantity}x</span><span class='me-3'>@${Number(cartObj[property].price).toFixed(2)}</span><span>$${(cartObj[property].quantity * Number(cartObj[property].price)).toFixed(2)}</span></li>`
              }
            
            
        })

        // Decrement
        document.querySelector('.decrement').addEventListener('click', (e) => {

            if (Number(cartNumber.textContent) < 1) return
            let number = Number(cartNumber.textContent) - 1;

            cartNumber.innerText = number;
            document.querySelector('.item-increment').innerText = number
        })
    })
})

document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('mouseleave', (e) => {
        btn.style.backgroundColor = 'white';
        btn.innerHTML = `<img class='me-2' src='./assets/images/icon-add-to-cart.svg' >Add to Cart`
        btn.classList.remove('increment-decrement')
    })
})