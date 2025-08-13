/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
const lineConfig = {
  type: 'line',
  data: {
    labels: ['Hito 1', 'Hito 2', 'Hito 3', 'Hito 4', 'Hito 5', 'Hito 6', 'Hito 7'],
    datasets: [
      {
        label: 'Serie 1',
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: [43, 48, 40, 54, 67, 73, 70],
        fill: false,
      },
      {
        label: 'Serie 2',
        fill: false,
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: '#7e3af2',
        borderColor: '#7e3af2',
        data: [24, 50, 64, 74, 52, 51, 65],
      },
    ],
  },
  options: {
    responsive: true,
    /**
     * Default legends are ugly and impossible to style.
     * See examples in charts.html to add your own legends
     *  */
    legend: {
      display: false,
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Month',
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value',
        },
      },
    },
  },
}

// change this to the id of your chart element in HMTL
const lineCtx = document.getElementById('line')
window.myLine = new Chart(lineCtx, lineConfig)

// Procesa los datos de la tabla para armar los datos de la gráfica agrupando por día
document.addEventListener('DOMContentLoaded', function () {
  // Recolecta los votos por producto y fecha (agrupando por día)
  const rows = document.querySelectorAll('tbody tr');
  const votosPorProducto = {};
  rows.forEach(row => {
    const tds = row.querySelectorAll('td');
    if (tds.length < 2) return;
    const producto = tds[0].innerText.trim();
    let fecha = tds[1].innerText.trim();
    // Agrupa por día (extrae solo la parte de la fecha)
    if (fecha.includes(' ')) fecha = fecha.split(' ')[0];
    if (fecha.includes('T')) fecha = fecha.split('T')[0];
    if (!votosPorProducto[producto]) votosPorProducto[producto] = {};
    votosPorProducto[producto][fecha] = (votosPorProducto[producto][fecha] || 0) + 1;
  });

  // Encuentra los dos productos con más votos
  const productosOrdenados = Object.entries(votosPorProducto)
    .map(([producto, fechas]) => [producto, Object.values(fechas).reduce((a, b) => a + b, 0)])
    .sort((a, b) => b[1] - a[1])
    .map(x => x[0]);
  const top1 = productosOrdenados[0];
  const top2 = productosOrdenados[1];

  // Junta todas las fechas únicas y ordénalas
  const fechasSet = new Set();
  [top1, top2].forEach(prod => {
    if (votosPorProducto[prod]) {
      Object.keys(votosPorProducto[prod]).forEach(f => fechasSet.add(f));
    }
  });
  const fechas = Array.from(fechasSet).sort();

  // Prepara los datos para la gráfica
  const datos1 = fechas.map(f => votosPorProducto[top1]?.[f] || 0);
  const datos2 = fechas.map(f => votosPorProducto[top2]?.[f] || 0);

  // Actualiza la gráfica de líneas
  if (window.myLine) {
    window.myLine.data.labels = fechas;
    window.myLine.data.datasets[0].label = top1 || 'Producto 1';
    window.myLine.data.datasets[0].data = datos1;
    window.myLine.data.datasets[1].label = top2 || 'Producto 2';
    window.myLine.data.datasets[1].data = datos2;
    window.myLine.update();
  }
});
