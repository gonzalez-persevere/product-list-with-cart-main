import data from '../../data.json' with {type: 'json'};
const cardContainer = document.querySelector('.card-container');
data.forEach(item => {
    cardContainer.innerHTML += `<div class="card" style="width: 18rem;">
  <img src=${item.image.desktop} class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${item.name}</h5>
    <p class="card-text">${item.category}</p>
    <p class="card-text">${item.price}</p>
    <button class="btn btn-primary">Add to C</button>
  </div>
</div>`
})
