import data from '../../data.json' with {type: 'json'};
const cardContainer = document.querySelector('.card-container');
const cartNumber = document.querySelector('.cart-number');
let itemArray = [];

data.forEach(item => {
    cardContainer.innerHTML += `<div class="card border-0" style="width: 18rem;">
    <div class='img-container'>
  <img src=${item.image.desktop} class="card-img-top" alt="...">
  <button class="btn rounded-pill w-75 card-btn"><img class='me-2' src='./assets/images/icon-add-to-cart.svg' data-title=${item.name} data-price=${item.price}>Add to Cart</button>
  </div>
  <div class="card-body">
  <p class="card-text mt-3">${item.category}</p>
    <h5 class="card-title">${item.name}</h5>
    <p class="card-text">${item.price}</p>
  </div>
</div>`
})

document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
        btn.style.backgroundColor = 'hsl(14, 86%, 42%)';
        btn.innerHTML = `<img class='decrement' src='./assets/images/icon-decrement-quantity.svg'> <span class='text-white item-increment'>|</span> <img class='increment' src='./assets/images/icon-increment-quantity.svg'>`
        btn.classList.add('increment-decrement')

       document.querySelector('.increment').addEventListener('click', (e) => {
               let number = Number(cartNumber.textContent) + 1;
               
            cartNumber.innerText = number;
            document.querySelector('.item-increment').innerText = number
        })
        
        document.querySelector('.decrement').addEventListener('click', (e) => {
            
            if(Number(cartNumber.textContent) < 1) return
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
 
