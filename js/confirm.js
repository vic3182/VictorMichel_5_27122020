/* Affichage prix total + id commande */
document.getElementById("main").innerHTML += ` <h2>Pour votre commande d'un montant de : ${sessionStorage.getItem(
  "orderTotalPrice"
)}€ </h2><p>Votre identifiant de commande est le n° ${sessionStorage.getItem("orderId")}</p>`;
/* Effacement local et session storage */
localStorage.clear();
sessionStorage.clear();