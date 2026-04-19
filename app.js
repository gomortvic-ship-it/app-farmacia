let productos = [];
let timeoutBusqueda;

// Cargar productos
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    productos = data;
    console.log(`✅ ${productos.length} productos cargados`);
  });

// Buscador con debounce (más rápido)
document.getElementById("buscador").addEventListener("input", function() {
  clearTimeout(timeoutBusqueda);
  timeoutBusqueda = setTimeout(() => buscar(this.value), 200);
});

function buscar(texto) {
  const t = texto.toLowerCase().trim();
  if (t.length < 1) {
    document.getElementById("resultados").innerHTML = "";
    return;
  }

  const resultados = productos.filter(p =>
    p.PRODUCTO.toLowerCase().includes(t) ||
    p.CODIGO.includes(t)
  ).slice(0, 15);

  mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
  const div = document.getElementById("resultados");
  div.innerHTML = "";

  if (resultados.length === 0) {
    div.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  resultados.forEach(p => {
    const precio = parseFloat(p.PRECIO);
    const descSistema = parseFloat(p.DESCUENTO);
    const precio25 = (precio * 0.75).toFixed(2);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.PRODUCTO}</h3>
      <p><b>Código:</b> ${p.CODIGO}</p>
      <p><b>Precio:</b> $${precio.toFixed(2)}</p>
      <p><b>Descuento sistema:</b> $${descSistema.toFixed(2)}</p>
      <p class="precio-desc" id="desc-${p.CODIGO}" style="display:none; color:green; font-weight:bold;">
        💰 Con 25%: $${precio25}
      </p>
      <button onclick="toggleDescuento('${p.CODIGO}')">25% Desc.</button>
    `;
    div.appendChild(card);
  });
}

// Mostrar/ocultar descuento sin alert
function toggleDescuento(codigo) {
  const el = document.getElementById(`desc-${codigo}`);
  el.style.display = el.style.display === "none" ? "block" : "none";
}

// ─── LECTOR DE CÓDIGO DE BARRAS ───────────────────────────────────────────────

let scannerActivo = false;
let codeReader;

async function iniciarScanner() {
  if (scannerActivo) {
    detenerScanner();
    return;
  }

  // Cargar ZXing si no está cargado
  if (typeof ZXing === "undefined") {
    await cargarScript("https://unpkg.com/@zxing/library@latest/umd/index.min.js");
  }

  const contenedor = document.getElementById("scanner-container");
  contenedor.style.display = "block";
  scannerActivo = true;
  document.getElementById("btn-scanner").textContent = "⏹ Detener cámara";

  codeReader = new ZXing.BrowserMultiFormatReader();

  try {
    await codeReader.decodeFromVideoDevice(null, "video-scanner", (result, err) => {
      if (result) {
        const codigo = result.getText();
        document.getElementById("buscador").value = codigo;
        buscar(codigo);
        detenerScanner();
      }
    });
  } catch (err) {
    alert("No se pudo acceder a la cámara: " + err.message);
    detenerScanner();
  }
}

function detenerScanner() {
  if (codeReader) codeReader.reset();
  scannerActivo = false;
  document.getElementById("scanner-container").style.display = "none";
  document.getElementById("btn-scanner").textContent = "📷 Escanear código";
}

function cargarScript(url) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = url;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
