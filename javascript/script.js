

/* CONSTANTES DE LAS APIS */
const urlSpaceX = "https://api.spacexdata.com/v4/launches/latest"
const urlSpaceflight = "https://api.spaceflightnewsapi.net/v4/articles/"
const urlNASA = "https://api.nasa.gov/planetary/apod" // api_key=
const apiKeyNasa = "u71T6CeALt0nvZFdXwHcTayhhgoGAbGR8yqyBJ8X"

/* CONSTANTES DEL DOM */
const carrusel = document.querySelector('.carousel-inner')

const parche = document.querySelector('#parche-lanzamiento')
const nombreLanz = document.querySelector('#nombre-lanzamiento')
const exitoLanz = document.querySelector('#exito-lanzamiento')
const fechaLanz = document.querySelector('#fecha-lanzamiento')
const titularesLanz = document.querySelector('#titulares-lanzamiento')


/* VARIABLE DE CONTROL */
let activaInsertada = false // controla que se haya añadido o no la diapositiva primaria


/* FUNCIONES PRIMARIAS  */

/**
 * Hace la llamada a una API y le pasa los datos devueltos a la función que se pasa
 * 
 * @param {String} url 
 * @param {String} parametros 
 * @param {function} funcion 
 * @param {String} ruta // ruta para leer de los datos (puede ser null)
 */
function obtenerDatos(url, parametros, funcion, ruta) {
  fetch(`${url}?${parametros}`)
    .then((res) => res.json())
    .then((data) => {
      if (ruta !== null) {
        data[ruta].map((elemento) => {
          funcion(elemento)
        })
      } else {
        data.map((elemento) => {
          funcion(elemento)
        })
      }
    })
}


//let datos = obtenerDatos(urlSpaceflight, "has_launch=true&summary_contains=Crew-5")
//console.log(datos)

/**
 * Obtiene tres imágenes destacadas de la NASA 
 */
function obtenerDestacadasNASA() {

  // parametros que le pasaré a la función
  let parametros = `api_key=${apiKeyNasa}&start_date=2023-04-17&end_date=2023-04-19`

  obtenerDatos(urlNASA, parametros, insertarDiapositiva, null)
}

/**
 * Obtiene el último lanzamiento de SpaceX
 */
function obtenerUltLanzamiento() {
  fetch(`https://api.spacexdata.com/v4/launches/latest`)
    .then((res) => res.json())
    .then((data) => {
      parche.src = data.links.patch.small
      nombreLanz.textContent = data.name
      exitoLanz.textContent = data.success ? "Lanzamiento existoso" : "Lanzamiento fallido"
      fechaLanz.textContent = parsearFecha(data.date_unix)

      generarTitulares(data.name)
    })
}

/**
 * Obtiene los titulares de un lanzamiento concreto que se le indique
 * 
 * @param {String} lanzamiento 
 */
function generarTitulares(lanzamiento) {
  let parametros = `has_launch=true&summary_contains=${lanzamiento}`

  obtenerDatos(urlSpaceflight, parametros, insertarTitular, 'results')

}

/**
 * Inserta las diapositivas en el carrusel
 * @param {Object} data 
 */
function insertarDiapositiva(data) {
  // creo el contenedor de la diapositiva
  let diapositiva = document.createElement('div')
  diapositiva.classList.add('carousel-item')
  // compruebo que ya exista la diapositiva inicial o activa
  if (!activaInsertada) {
    // en caso negativo, le añado la clase correspondiente
    diapositiva.classList.add('active')
    activaInsertada = true
  }

  // creo la imagen
  let imgDiapositiva = document.createElement('img')
  imgDiapositiva.classList.add('img-fluid', 'img-destacada')
  imgDiapositiva.src = data.hdurl

  // creo el contenedor del texto
  let textoBody = document.createElement('div')
  textoBody.classList.add('carousel-caption')

  // creo los dos textos: título y autor
  let titulo = document.createElement('h3')
  titulo.textContent = data.title
  let autor = document.createElement('p')
  autor.textContent = data.copyright

  // insertos los elementos en sus sitios
  textoBody.appendChild(titulo)
  textoBody.appendChild(autor)

  diapositiva.appendChild(imgDiapositiva)
  diapositiva.appendChild(textoBody)

  carrusel.appendChild(diapositiva)

}

/**
 * Inserta un titular en contenedor correspondiente
 * @param {Object} data 
 */
function insertarTitular(data) {
  // creo una columna
  let col = document.createElement('div')

  col.classList.add('col-sm-3')

  // creo el contenedor de la tarjeta
  let tarjeta = document.createElement('div')
  tarjeta.classList.add("card", "noticia", "shadow")

  // creo la imagen de la tarjeta
  let imagen = document.createElement('img')
  imagen.src = data.image_url
  imagen.classList.add('card-img-top')

  // creo el cuerpo del contenido
  let cuerpo = document.createElement('div')
  cuerpo.classList.add("card-body")

  // creo los textos 
  let titulo = document.createElement('h4')
  titulo.classList.add('card-title', 'titular')
  titulo.textContent = data.title

  let fecha = document.createElement('span')
  fecha.classList.add('card-text', 'badge', 'badge-primary')
  fecha.textContent = parsearFecha(data.published_at)

  let verMas = document.createElement('a')
  verMas.classList.add('btn', 'btn-link')
  verMas.href = data.url
  verMas.textContent = "Ver más"

  // inserto la tarjeta
  cuerpo.appendChild(imagen)
  cuerpo.appendChild(titulo)
  cuerpo.appendChild(fecha)
  cuerpo.appendChild(verMas)
  tarjeta.appendChild(cuerpo)
  col.appendChild(tarjeta)
  titularesLanz.appendChild(col)
}


/* FUNCIONES UTILITARIAS  */

/**
 * Crea una fecha predefinida a partir de una fecha en formato UNIX
 * 
 * @param {Int} unix 
 * @returns fecha en formato String
 */
function parsearFechaUnix(unix) {
  let fecha = new Date(unix * 1000)
  let meses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  let anyo = fecha.getFullYear()
  let mes = meses[fecha.getMonth()]
  let dia = fecha.getDate()

  return `${dia}-${mes}-${anyo}`

}

/**
 * Modifica el formato de la fecha
 * @param {String} fecha 
 */
function parsearFecha(fecha){
  let nuevaFecha = new Date(fecha)
  let meses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  let anyo = nuevaFecha.getFullYear()
  let mes = meses[nuevaFecha.getMonth()]
  let dia = nuevaFecha.getDate()

  return `${dia}-${mes}-${anyo}`
}


/* LLAMADA A FUNCIONES DE INICIO */

obtenerDestacadasNASA()
obtenerUltLanzamiento()