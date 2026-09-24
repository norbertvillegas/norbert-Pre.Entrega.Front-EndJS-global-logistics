(function () {
  var carrusel = document.querySelector("[data-resenas-carrusel]");
  if (!carrusel) {
    return;
  }

  var grid = carrusel.querySelector(".resenas__grid");
  var tarjetas = grid.querySelectorAll(".resena-card");
  var btnAnterior = carrusel.querySelector("[data-resenas-anterior]");
  var btnSiguiente = carrusel.querySelector("[data-resenas-siguiente]");
  var indicador = carrusel.querySelector("[data-resenas-indicador]");
  var contenedorPuntos = carrusel.querySelector("[data-resenas-puntos]");
  var indiceInicio = 0;
  var consultaDesktop = window.matchMedia("(min-width: 48rem)");

  function pasoVisible() {
    return consultaDesktop.matches ? 3 : 1;
  }

  function indicesDeInicio() {
    var paso = pasoVisible();
    var inicios = [];
    var i = 0;
    while (i < tarjetas.length) {
      inicios.push(i);
      i += paso;
    }
    return inicios;
  }

  function alinearIndice(indice) {
    var inicios = indicesDeInicio();
    if (inicios.indexOf(indice) !== -1) {
      return indice;
    }
    var paso = pasoVisible();
    return Math.floor(indice / paso) * paso;
  }

  function indicePaginaActual() {
    var inicios = indicesDeInicio();
    return inicios.indexOf(indiceInicio);
  }

  function actualizarTarjetas() {
    var paso = pasoVisible();
    tarjetas.forEach(function (tarjeta, indice) {
      var visible = indice >= indiceInicio && indice < indiceInicio + paso;
      tarjeta.classList.toggle("resena-card--oculta", !visible);
      tarjeta.setAttribute("aria-hidden", visible ? "false" : "true");
    });
  }

  function actualizarIndicador() {
    var inicios = indicesDeInicio();
    var pagina = indicePaginaActual() + 1;
    var totalPaginas = inicios.length;

    if (pasoVisible() === 1) {
      indicador.textContent =
        "Reseña " + (indiceInicio + 1) + " de " + tarjetas.length;
    } else {
      indicador.textContent = "Grupo " + pagina + " de " + totalPaginas;
    }
  }

  function actualizarBotones() {
    var inicios = indicesDeInicio();
    var pagina = indicePaginaActual();
    btnAnterior.disabled = pagina <= 0;
    btnSiguiente.disabled = pagina >= inicios.length - 1;
  }

  function actualizarPuntos() {
    var inicios = indicesDeInicio();
    var paginaActiva = indicePaginaActual();
    contenedorPuntos.innerHTML = "";

    inicios.forEach(function (inicio, indice) {
      var punto = document.createElement("button");
      punto.type = "button";
      punto.className = "resenas__punto";
      if (indice === paginaActiva) {
        punto.classList.add("resenas__punto--activo");
      }
      punto.setAttribute("aria-label", "Ir al grupo " + (indice + 1));
      punto.addEventListener("click", function () {
        indiceInicio = inicio;
        refrescar();
      });
      contenedorPuntos.appendChild(punto);
    });
  }

  function refrescar() {
    actualizarTarjetas();
    actualizarIndicador();
    actualizarBotones();
    actualizarPuntos();
  }

  btnAnterior.addEventListener("click", function () {
    var inicios = indicesDeInicio();
    var pagina = indicePaginaActual();
    if (pagina > 0) {
      indiceInicio = inicios[pagina - 1];
      refrescar();
    }
  });

  btnSiguiente.addEventListener("click", function () {
    var inicios = indicesDeInicio();
    var pagina = indicePaginaActual();
    if (pagina < inicios.length - 1) {
      indiceInicio = inicios[pagina + 1];
      refrescar();
    }
  });

  consultaDesktop.addEventListener("change", function () {
    indiceInicio = alinearIndice(indiceInicio);
    refrescar();
  });

  indiceInicio = 0;
  refrescar();
})();
