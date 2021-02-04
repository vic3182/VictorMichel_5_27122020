const mainHtml = document.getElementById("main");
let totalPrice = 0;
const products = []; /* afficher les produits */
/* fontion retirer produit panier */
function removeProduct(lensType) {
  localStorage.removeItem(lensType);
  document.location.href = "panier.html";
}
/* pour chaque article dans le panier, l'afficher */
for (let i = 0; i < localStorage.length; i++) {
  let data = JSON.parse(localStorage.getItem(localStorage.key(i))); /* fait le tour du local storage, contient un des objets du panier */
  products.push(data.id);
  totalPrice += parseInt(data.priceForAll); /* rajoute le prix dans mon panier */
  sessionStorage.setItem("orderTotalPrice", totalPrice); /* récupère le prix total et met à jour */
  mainHtml.innerHTML += `
  <div>   
    <button class="remove" onclick="removeProduct('${data.lensType}')">Retirer</button> 
    <a href="produit.html?id=${data.id}">     
      <figure>
        <img alt="${data.name}" src="${data.preview}">
        <figcaption>
          <h2>${data.name}</h2>
          <p>Quantité : ${data.quantity}</p>
          <p>Lentilles : ${data.lensType}</p>
          <p>Prix : ${data.priceForAll} €</p>
        </figcaption>
      </figure>
    </a>
  </div>
  `;
}
document.getElementById("order");
/* si panier vide ne pas afficher le formulaire */
if (!localStorage.length) { /* boucle gestion d'erreur si considéré comme undefined */
  mainHtml.innerHTML = `<h2>Votre panier est vide :'( </h2>`;
  document.getElementById("form").remove(); /* on enlève le formulaire */
}
/* si panier non vide et donc btn-order affiché event listener au click pour passer les informations au serveur avec vérification de validité par regex (Expressio régulière)*/
if (document.getElementById("btn-order")) { /* si bouton affiché, création objet */
  document.getElementById("btn-order").addEventListener("click", function () {
    let formIsInvalid = "";
    let firstName = document.getElementById("first-name").value; /* validation pour envoyer dans le formulaire */
    let lastName = document.getElementById("last-name").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("mail").value;
    if (/[0-9]/.test(firstName) || /[§!@#$%^&*().?":{}|<>]/.test(firstName) || !firstName)
      formIsInvalid += "Votre prénom est invalide \n";
    if (/[0-9]/.test(lastName) || /[§!@#$%^&*().?":{}|<>]/.test(lastName) || !lastName)
      formIsInvalid += "Votre nom de famille est invalide \n";
    if (!address)
      formIsInvalid += "Votre adresse est invalide \n";
    if (/[0-9]/.test(city) || !city)
      formIsInvalid += "Votre ville est invalide \n";
    if (!/@/.test(email) || !email)
      formIsInvalid += "Votre mail est invalide \n";
    if (formIsInvalid)
      alert("Erreur : \n" + formIsInvalid); /* variable qui va changer selon les cas */
    else {
      let contact = { /* mettre dans un objet les infos du formulaire */
        lastName: lastName,
        firstName: firstName,
        address: address,
        city: city,
        email: email,
      };
      let toSend = { contact, products }; /* créer objet avec infos acheteur */
      toSend = JSON.stringify(toSend);
      fetch("http://localhost:3000/api/cameras/order", { method: "post", headers: { "Content-Type": "application/json" }, body: toSend })
        .then(function (response) {
          /* Si connection ok ajout orderId au local storage */
          if (response.ok) {
            response.json().then(function(responseData) {
              sessionStorage.setItem("orderId", responseData.orderId); /* données de session */
            });
            window.location.href = "confirm.html"
          } else
            Promise.reject(response.status);
        })
        /* Sinon log les erreurs dans la console */
        .catch(function (error) {
          console.log(error);
        });
    }
  });
}