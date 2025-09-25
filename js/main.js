// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const jsonPath = "./data/servicios.json";
  const storageKey = "servicios_data";

  // Cargar datos: si hay en localStorage usamos eso, si no, hacemos fetch y guardamos en localStorage
  function loadServicios() {
    const fromStorage = localStorage.getItem(storageKey);
    if (fromStorage) {
      try {
        const servicios = JSON.parse(fromStorage);
        renderAll(servicios);
        return Promise.resolve(servicios);
      } catch (e) {
        console.warn("JSON en localStorage inválido, recargando desde archivo.", e);
        localStorage.removeItem(storageKey);
      }
    }

    return fetch(jsonPath)
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(servicios => {
        // Guardamos copia en localStorage para que las compras persistan
        localStorage.setItem(storageKey, JSON.stringify(servicios));
        renderAll(servicios);
        return servicios;
      })
      .catch(err => {
        console.error("Error cargando servicios.json:", err);
        const errorBox = document.getElementById("servicios-error");
        if (errorBox) {
          errorBox.style.display = "block";
          errorBox.textContent = "No se pudieron cargar los servicios. Revisa la ruta del archivo data/servicios.json o abre con Live Server.";
        }
      });
  }

  // Guardar servicios en localStorage
  function saveServicios(servicios) {
    localStorage.setItem(storageKey, JSON.stringify(servicios));
  }

  // Función para renderizar lista, crud y detalle
  function renderAll(servicios) {
    renderLista(servicios);
    renderTablaCRUD(servicios);
    renderDetalleIfNeeded(servicios);
  }

  // Render lista de servicios (servicios.html)
  function renderLista(servicios) {
    const lista = document.getElementById("lista-servicios");
    const errorBox = document.getElementById("servicios-error");
    if (!lista) return;

    if (!Array.isArray(servicios) || servicios.length === 0) {
      lista.innerHTML = "<p>No hay servicios disponibles.</p>";
      return;
    }

    lista.innerHTML = servicios.map(s => {
      const enPromo = s.promocion === true && s.precio_promocion && s.precio_promocion < s.precio;
      let descuentoPct = 0;
      if (enPromo) descuentoPct = Math.round((1 - (s.precio_promocion / s.precio)) * 100);

      const precioHtml = enPromo
        ? `<p class="price"><span class="old-price">$${s.precio.toLocaleString()} COP</span> <span class="promo-price">$${s.precio_promocion.toLocaleString()} COP</span></p>`
        : `<p class="price"><span class="normal-price">$${s.precio.toLocaleString()} COP</span></p>`;

      const badge = enPromo ? `<div class="badge">-${descuentoPct}%</div>` : "";
      const agotadoHtml = s.cantidad <= 0 ? `<div class="agotado">Agotado</div>` : "";

      // Botón comprar en la tarjeta: si hay stock habilitado, si no, deshabilitado
      const comprarBtn = s.cantidad > 0
        ? `<button class="btn comprar-btn" onclick="comprarServicio(${s.id}, 1)">Comprar</button>`
        : `<button class="btn comprar-btn disabled" disabled>Agotado</button>`;

      return `
        <div class="card">
          ${badge}
          ${agotadoHtml}
          <img src="img/${s.id}.jpg" alt="${s.nombre}">
          <h3>${s.nombre}</h3>
          ${precioHtml}
          <p class="mini">Disponibles: <span id="cantidad-${s.id}">${s.cantidad}</span></p>
          <p>${s.descripcion}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <a class="btn" href="detalle.html?id=${s.id}">Ver detalle</a>
            ${comprarBtn}
          </div>
        </div>
      `;
    }).join("");

    if (errorBox) errorBox.style.display = "none";
  }

  // Render tabla CRUD
  function renderTablaCRUD(servicios) {
    const tabla = document.getElementById("tabla-servicios");
    if (!tabla) return;

    tabla.innerHTML = servicios.map(s => {
      const precioDisplay = (s.promocion && s.precio_promocion) ? `$${s.precio_promocion.toLocaleString()} COP` : `$${s.precio.toLocaleString()} COP`;
      return `
        <tr>
          <td>${s.id}</td>
          <td>${s.nombre}</td>
          <td>${precioDisplay}</td>
          <td>${s.estado}</td>
          <td>
            <button onclick="editarServicio(${s.id})">Editar</button>
            <button onclick="eliminarServicio(${s.id})">Eliminar</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  // Render detalle si estamos en detalle.html
  function renderDetalleIfNeeded(servicios) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const detalle = document.getElementById("detalle-servicio");
    if (!detalle || !id) return;

    const servicio = servicios.find(x => String(x.id) === String(id));
    if (!servicio) {
      detalle.innerHTML = "<p>Servicio no encontrado.</p>";
      return;
    }

    const enPromo = servicio.promocion === true && servicio.precio_promocion && servicio.precio_promocion < servicio.precio;
    let descuentoPct = 0;
    if (enPromo) descuentoPct = Math.round((1 - (servicio.precio_promocion / servicio.precio)) * 100);

    const precioHtml = enPromo
      ? `<p class="price"><span class="old-price">$${servicio.precio.toLocaleString()} COP</span> <span class="promo-price">$${servicio.precio_promocion.toLocaleString()} COP</span></p>`
      : `<p class="price"><span class="normal-price">$${servicio.precio.toLocaleString()} COP</span></p>`;

    const badge = enPromo ? `<div class="badge">-${descuentoPct}%</div>` : "";
    const agotadoHtml = servicio.cantidad <= 0 ? `<div class="agotado">Agotado</div>` : "";

    const comprarBtn = servicio.cantidad > 0
      ? `<button id="comprar-detalle" class="btn">Comprar</button>`
      : `<button id="comprar-detalle" class="btn disabled" disabled>Agotado</button>`;

    detalle.innerHTML = `
      <div class="detalle-card">
        ${badge}
        ${agotadoHtml}
        <img src="img/${servicio.id}.jpg" alt="${servicio.nombre}">
        <h2>${servicio.nombre}</h2>
        ${precioHtml}
        <p><strong>Estado:</strong> ${servicio.estado}</p>
        <p><strong>Disponibles:</strong> <span id="detalle-cantidad-${servicio.id}">${servicio.cantidad}</span></p>
        <p><strong>Descripción:</strong> ${servicio.descripcion}</p>
        <div style="margin-top:12px;">
          ${comprarBtn}
          <a class="btn" href="servicios.html" style="margin-left:8px;">Volver</a>
        </div>
      </div>
    `;

    // Agregar listener al botón comprar en detalle
    const btnDetalle = document.getElementById("comprar-detalle");
    if (btnDetalle && servicio.cantidad > 0) {
      btnDetalle.addEventListener("click", () => {
        comprarServicio(servicio.id, 1);
      });
    }
  }

  // Función pública para comprar (cantidadCompra por defecto 1)
  window.comprarServicio = function(id, cantidadCompra = 1) {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      alert("Error: datos de servicios no disponibles. Refresca la página.");
      return;
    }

    let servicios;
    try {
      servicios = JSON.parse(raw);
    } catch (e) {
      alert("Error leyendo datos locales.");
      return;
    }

    const idx = servicios.findIndex(s => Number(s.id) === Number(id));
    if (idx === -1) {
      alert("Servicio no encontrado.");
      return;
    }

    const servicio = servicios[idx];

    if (!servicio.cantidad || servicio.cantidad <= 0) {
      alert("Lo sentimos: este servicio está agotado.");
      // Re-render por si algo cambió
      renderAll(servicios);
      return;
    }

    // Reducir cantidad
    servicio.cantidad = servicio.cantidad - cantidadCompra;
    if (servicio.cantidad < 0) servicio.cantidad = 0;

    // Guardar y re-renderizar
    servicios[idx] = servicio;
    saveServicios(servicios);
    renderAll(servicios);

    // Mensaje de confirmación
    alert(`Compra exitosa: ${servicio.nombre}\nCantidad restante: ${servicio.cantidad}`);

    // Si estamos en detalle.html y la compra dejó 0, deshabilitar botón (ya hace re-render)
  };

  // --- CRUD simuladas (para compatibilidad) ---
  window.agregarServicio = function() {
    alert("Función para agregar un nuevo servicio (simulación).");
  };
  window.editarServicio = function(id) {
    alert("Editar servicio con ID: " + id);
  };
  window.eliminarServicio = function(id) {
    alert("Eliminar servicio con ID: " + id);
  };

  // --- Login simulado (no cambia) ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const usuario = document.getElementById("usuario").value;
      const password = document.getElementById("password").value;
      if (usuario === "admin" && password === "1234") {
        alert("Inicio de sesión correcto. Redirigiendo al panel...");
        window.location.href = "crud.html";
      } else {
        alert("Usuario o contraseña incorrectos.");
      }
    });
  }

  // Iniciar: cargar servicios (desde localStorage o fetch)
  loadServicios();
});
