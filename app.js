let productos = [];

fetch('data.json')
  .then(res => res.json())
  .then(data => productos = data);

document.getElementById("buscador").addEventListener("input", function() {
  let texto = this.value.toLowerCase();
  let resultados = productos.filter(p =>
    p.PRODUCTO.toLowerCase().includes(texto) ||
    p.CODIGO.includes(texto)
  );

  let divResultados = document.getElementById("resultados");
  divResultados.innerHTML = "";

  resultados.slice(0, 15).forEach(p => {
    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${p.PRODUCTO}</h3>
      <p><b>Código:</b> ${p.CODIGO}</p>
      <p><b>Precio:</b> $${p.PRECIO}</p>
      <p><b>Descuento sistema:</b> $${p.DESCUENTO}</p>
      <button onclick="descuento('${p.PRECIO}')">25% Desc.</button>
    `;

    divResultados.appendChild(card);
  });
});

function descuento(precio) {
  let final = precio * 0.75;
  alert("Precio con 25%: $" + final.toFixed(2));
}