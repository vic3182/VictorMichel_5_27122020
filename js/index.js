const docHtml = document.getElementById("main"); /* Recuperer la div avec l'ID 'Main' du DOM */

fetch("http://localhost:3000/api/cameras") /* Envoie une requete vers l'URL dans la string (le Back) */

  .then((response) => { /* Gestion d'erreur pour la reponse ou non des donnees */
    /* Vérification connection serveur */
    if (response.ok) /* Si recois une reponse bonne de la requete */
      return response.json(); /* La fonction renvoie la reponse en JSON. */
    else
      Promise.reject(response.status); /* Refuse la reponse de la requete si le statut n'est pas celui demandé */
  })
  /* Si connection ok pour chaque produit l'afficher */
  .then((data) => { 
    data.forEach((objet) => { /* Je boucle dans ma reponse pour en retirer les informations */
      let priceInEuro = objet.price / 100; 
      /* Insertion dans le front du HTML */ 
      docHtml.innerHTML += `
        <a href="produit.html?id=${objet._id}">  
          <figure class="product-container">
            <img src="${objet.imageUrl}" alt="${objet.name}" class="product-preview">
            <figcaption>
              <h2>${objet.name}</h2>
              <h3>${priceInEuro.toFixed(2)} €</h3> 
            </figcaption>
          </figure>
        </a>
      `;
    });
  })
  /* Sinon log les erreurs dans la console */
  .catch(function(error) {
    console.log(error);
});