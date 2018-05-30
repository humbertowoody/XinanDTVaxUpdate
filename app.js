/**
 * Actualización de Catálogos de DTVax
 *
 * Nacubi Sistemas 2018
 */
const ClienteREST = require('node-rest-client').Client;
const moment = require('moment');
const sql = require('mssql');

// Configuración de conexión a Microsoft SQL Server
const config = {
  user: 'node',
  password: '12345678',
  server: 'localhost\\sqlexpress',
  database: 'dbSistema',
  encrypt: false,
}

// Número de Días de atraso en la información
const diasAtraso = 2;
// URL de conexión para la API de DTVax sin la fecha final.
const urlDtVax = 'http://www.dtvax.net:8081/ops/dtvaxOps?method=getUsersRecs&key=iLZJiGLY0hHWiSFG&recDate=';
// Datos de la base de datos
const tabla = 'tablaprueba';

/**
 * Declaración de functiones a emplear.
 * A continuación se hace la declaración de todas las funciones que se implementarán a lo largo
 * del programa. Posteriormente se hace la implementación.
 */

// Obtener un string con la fecha a utilizar.
function getStringFecha() {
  // Fecha con atraso calculado
  const fechaConAtraso = moment().subtract(diasAtraso, 'days');
  // Regresamos string con fecha en formato yy/mm/dd
  return fechaConAtraso.format('YY/MM/DD');
}

// Insertar datos a la base de datos
function insertarDB(datos) {
  // Conexión al servidor
  console.log('Conectando al servidor SQL...');
  sql.connect(config).then(() => {
    console.log('Correctamente conectado al servidor SQL.');
    const request = new sql.Request();
    // Para cada dato
    console.log('Inicia proceso de inserción...');
    datos.forEach((recaudo) => {
      // Construir el SQL
      let strQuery = 'INSERT INTO ' + tabla + ' (Fecha, recaudador, NoRecaudos, MontoRecaudado, MontoAforado) VALUES(';
      strQuery += '\''+ recaudo.Fecha +'\',';
      strQuery += '\''+ recaudo.recaudador +'\',';
      strQuery += '\''+ recaudo.NoRecaudos +'\',';
      strQuery += '\''+ recaudo.MontoRecaudado +'\',';
      strQuery += '\''+ recaudo.MontoAforado +'\'';
      strQuery += ')';
      // Ejecutar la consulta
      request.query(strQuery).catch((err) => {
        // Imprimir errores en consulta
        console.log('Request error: ' + err);
      });
    });
    console.log('Fin de proceso de inserción.');
  }).catch((err) => {
    // Imprimir errores en la conexión
    if (err) {
      console.log('SQL Connection Error: ' + err);
    }
  });
  console.log('Fin de proceso General.')
}

/**
 * Proceso general de funcionamiento.
 * Aquí se ejecuta el proceso general de funcionamiento para ejecutar todas las tareas
 * requeridas.
 */
console.log('Inicio de Proceso de Actualización de DTVax');
console.log('Fecha de ejecución: ' + moment().format('DD/MM/YYYY'));
console.log('Días de atraso para obtener los datos: ' + diasAtraso + ' días.')
// Cliente REST para los queries a la API
const cliente = new ClienteREST();
// Query principal
cliente.get(urlDtVax + getStringFecha(), (data) => {
  // Parsear datos a JSON
  const resultado = JSON.parse(data);
  // Verificamos que no haya error en la API
  if (resultado.success === true) {
    // Regresamos el array de datos
    insertarDB(resultado.detail);
  } else {
    // Arrojamos un error en caso de problema con query a API
    throw 'Hubo un error al realizar la consulta a DTVax, revise la URL, ' +
            'el status de la API o la conexión a Internet.';
  }
});
