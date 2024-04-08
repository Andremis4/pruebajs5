async function traerhistorico() {
  const url = "https://mindicador.cl/api";
  const moneda = "dolar";
  const fetching = await fetch(`${url}/${moneda}`);
  const datos = await fetching.json();
  const serie = datos.serie
    .map((serie, i) => {
      if (i < 10) {
        return serie;
      }
    })
    .filter((serie) => {
      if (serie !== undefined) {
        return serie;
      }

      /* return serie[0].value != undefined; */
    });

  let fechas = [];
  let precio = [];
  for (let i = 0; serie.length > i; i++) {
    /*  la T significa Tiempo, voy a cortar para solo mostrar fecha y eliminar el tiempo */
    const fechasplit = serie[i].fecha.split("T");
    fechas.push(fechasplit[0]);
    precio.push(serie[i].valor);
  }

  const datasets = [
    {
      label: "Precio histórico",
      borderColor: "rgb(255, 99, 132)",
      data: precio,
    },
  ];

  return [fechas, datasets];
}

const cargando = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const input = document.querySelector(".input");
const select = document.querySelector(".select");
const button = document.querySelector(".buscar");
const span = document.querySelector(".resultado");
const canvas = document.getElementById("myChart");
const multiplicacion = document.querySelector(".multiplicacion");
let grafico;

let graficoCargado = false;

/* Aqui esta el spiner */
const spiner = document.querySelector(".spiner");
const imagen = `<div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
<div class="wheel"></div>
<div class="hamster">
  <div class="hamster__body">
    <div class="hamster__head">
      <div class="hamster__ear"></div>
      <div class="hamster__eye"></div>
      <div class="hamster__nose"></div>
    </div>
    <div class="hamster__limb hamster__limb--fr"></div>
    <div class="hamster__limb hamster__limb--fl"></div>
    <div class="hamster__limb hamster__limb--br"></div>
    <div class="hamster__limb hamster__limb--bl"></div>
    <div class="hamster__tail"></div>
  </div>
</div>
<div class="spoke"></div>
</div>`;
async function borrar() {
  spiner.innerHTML = "";
}

async function buscarCotizacion() {
  try {
    const url = "https://mindicador.cl/api";
    const monto = parseFloat(input.value);
    const moneda = select.value;
    const fetching = await fetch(`${url}/${moneda}`);
    const datos = await fetching.json();

    return [datos, monto];
  } catch (error) {
  } finally {
  }
}

button.addEventListener("click", async () => {
  /*  aqui tomas el spinner y le das tiempo */
  spiner.innerHTML = imagen;
  cargando(10000);
  const resultado = await buscarCotizacion();
  await borrar();

  const renderizar = async () => {
    if (graficoCargado == false) {
      graficoCargado = true;
    } else {
      grafico.destroy();
    }

    const data = await traerhistorico();

    const config = {
      type: "line",
      data: {
        labels: data[0],
        datasets: data[1],
      },
    };

    canvas.style.backgroundColor = "white";
    grafico = new Chart(canvas, config);
  };
  renderizar();

  const valoringresado = resultado[1];
  const serie = resultado[0].serie;
  const valoractualizado = parseFloat(serie[0].valor);

  span.innerHTML = `El valor al día es ${valoractualizado}`;
  multiplicacion.innerHTML = `El total es $ ${
    valoringresado * valoractualizado
  }`;
});
