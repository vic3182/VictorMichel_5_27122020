const docHtml = document.getElementById("main");
fetch(`http://localhost:3000/api/cameras/${new URLSearchParams(window.location.search).get("id")}`)
  .then((response) => {
    /* Vérification connection serveur */
    if (response.ok)
      return response.json();
    else
      Promise.reject(response.status);
  })
  .then((data) => {
    /* titre page = nom produit */
    document.getElementById("title").innerHTML = `Orinoco - ${data.name}`; /* Permet de récupérer l'élément du DOM grâce à son ID */
    let lens; /* déclarer variable utilisées plus tard */
    let priceInEuro = (data.price / 100).toFixed(2); 
    /* Fonction ajout au local storage */
    function addToLocalStorage() { 
      let productQuantity = document.getElementById("quantity"); /* récupère endroit quantité */ 
      let productDetails = {  /* Affiche les détails du produit */  
        id: data._id, /* je déclare une variable qui contient id */
        preview: data.imageUrl,
        name: data.name,
        lensType: document.getElementById("customOptions").value,
        quantity: productQuantity.value,
        priceForAll: (priceInEuro * productQuantity.value).toFixed(2),
        pricePerUnit: priceInEuro,
      };
      localStorage[productDetails.lensType] = JSON.stringify(productDetails); /* converti la valeur en chaîne JSON */ 
      window.location.href = "panier.html"; /* le produit va dans le panier */
    }
    /* liste les différentes lentilles */
    data.lenses.forEach((lentille) => { /* for each : boucle */
      lens += `<option value="${lentille}">${lentille}</option>`; /* permet de mettre toute les options */
    });
    /* Ajout dans le html le produit selectionné et les informations relatives */
    docHtml.innerHTML += `
    <figure>
      <img alt="${data.name}" src="${data.imageUrl}"> 
      <figcaption>
        <h2>${data.name}</h2>
        <h3>${data.description}</h3> 
        <form>
          <label for="Exemplaire(s)">Exemplaire(s):</label>
          <input id="quantity" type="number" min="0" value="1"/>
          <label for="customOptions">Objectifs</label>
          <select id="customOptions">
            ${lens}   
          </select>        
          <h4>Prix total : <span id="priceForAll">${priceInEuro}</span> €</h4>
          <button id="btnAddToCart" type="button">Ajouter au panier</button>
        </form>   
      </figcaption>
    </figure>
    `;
    /* events listeners */
    document.getElementById("quantity").addEventListener("change", (event) => {  /* créér gestionnaire évenemment */
      document.getElementById("priceForAll").textContent = `${(priceInEuro * event.target.value).toFixed(2)}`; /* event targert : quantité value : désigne l'évènement créé, récupère la valeur de getelementbyID */
    });
    document.getElementById("btnAddToCart").addEventListener("click", function () {  /* rajouter fonction */ 
      addToLocalStorage();
    });
  });