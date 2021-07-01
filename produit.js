 // Variable pour aller chercher les informations à afficher dans le localStorage et parser
const ted= JSON.parse(localStorage.getItem('teddiesList'));

// Recherche de l'objet local correspondant à l'id du teddy passée en URL sur page index
//var selected =  ted.find(which => which._id === (window.location.search.substring(7)));
var selected =  ted.find(which => which._id === new URLSearchParams(document.location.search.substring(1)).get('teddy'));

fetch('http://localhost:3000/api/teddies')
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    // Stockage en local des listes de produits récupérés via l'API, s'il n'est pas déjà présent
    if(localStorage.getItem("teddiesList") === null) {
    const localTeddies = localStorage.setItem("teddiesList", JSON.stringify(value));
    }
    //teddyReceiveUrl(value);
    createTeddy(value);
    teddyColors(value);
  })
  .catch(function(err) {
    // Une erreur est survenue
  });

  function createTeddy() {
    const mainContainer = document.getElementById('products')
    mainContainer.insertAdjacentHTML('beforeend', `
      <div class="teddy col-12 col-lg-6">
        <div class="product-image main-color">
            <img src="${selected.imageUrl}" alt="Teddy" class="img-fluid p-3">
        </div>
      </div>
      <div class="teddy col-12 col-lg-6 main-color ms-3 d-flex">
        <div class="product-desc d-flex flex-column">
            <h2 class="fw-bold text-center pt-2">${selected.name}</h2>
            <p class="fs-5 p-2">${selected.description}</p>
            <h5 class="text-bold p-2 font-lg font-bold">Choisissez une couleur pour votre teddy :</h5>
            <div class="container colors-container">
              <div class="d-flex m-auto justify-content-around" id="productColors">
              </div>
            </div>
            <label class="m-2 fs-5 selectQuantity">Quantité : 
            <select id="tedQuantity">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            </select>
            </label>
            <button id="productPrice" class="w-full bg-secondary text-white fw-bold rounded p-2 m-2" type="button">Ajouter au panier pour 
            <span>${selected.price/100} €</span>
            </button>
        </div>
      </div>
        `)
        // Ecoute du bouton d'envoi de commande
        productPrice.addEventListener('click', function(e) {
          var urlParams = new URLSearchParams(window.location.search);
          var qty = document.getElementById('tedQuantity');
          var choosenColor = document.getElementsByName('colorChoice');
          // Boucle pour détecter quelle couleur est checked
          var valeur;
            for(var i = 0; i < choosenColor.length; i++){
            if(choosenColor[i].checked){
            valeur = choosenColor[i].value;
            urlParams.set("color", choosenColor[i].id); 
            }
          }
          // Envoi des paramètres en URL
          if (urlParams.has("price") && urlParams.has("quantity")) { 
            // Récupération des paramètres existants et ajouts des nouveaux
              urlParams.set("price", parseInt(urlParams.get('price'), 10)+qty.value*((selected.price/100)));
              urlParams.set("quantity", parseInt(qty.value,10)+parseInt(urlParams.get('quantity'), 10));
              window.location.search = urlParams;
          }
          else { 
          urlParams.set("price", (qty.value*(selected.price/100)));
          urlParams.set("quantity", qty.value);
          window.location.search = urlParams;
          }

          var qtyAdd = urlParams.get("quantity");
          var priceAdd = urlParams.get("price");
          var colorAdd = urlParams.get("color");
          const basketAdd = localStorage.setItem("basket", JSON.stringify(value));
          
      });

      var oParametre = {};

if (window.location.search.length > 1) {
  for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
    aItKey = aCouples[nKeyId].split("=");
    oParametre[unescape(aItKey[0])] = aItKey.length > 1 ? unescape(aItKey[1]) : "";
  }
  console.log(oParametre);
}
// Ecoute du choix de la quantité
tedQuantity.addEventListener('change', function(e){
  const tedPrice = document.getElementById('productPrice');
  tedPrice.textContent = `Ajouter au panier pour ${(selected.price/100)*e.target.value} €`;
});
};/////// Fin de create Teddy //////

// Créations des boutons de choix de couleurs en fonction du teddy séléctionné
const teddyColors = ted => {
  const colorContainer = document.getElementById('productColors')
  for(let i = 0; i < selected.colors.length; i++) {
  let color = selected.colors;
    colorContainer.insertAdjacentHTML('beforeend', `
      <input type="radio" class="color-option btn-check" name="colorChoice" id="${color[i]}" autocomplete="off" checked>
      <label class="btn scale-up fs-4" for="${color[i]}" style="background-color: ${color[i]}; width:8rem; height:5rem">${color[i]}</label>
        `)
    }
}


function teddySendColorChoice() {
 document.querySelectorAll('.btn.color-choice').addEventListener("click", function(e) {
  e.target.setAttribute('selected', "");
  console.log(document.querySelectorAll('.btn.color-choice'));
});
};