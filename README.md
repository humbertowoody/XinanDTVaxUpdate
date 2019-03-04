# Actualización de Catálogos de DTVax

Este es un software que actualiza los catálogos locales con los proporcionados por DTVax mediante la API proporcionada por el servicio.

## Contenido

- [Actualización de Catálogos de DTVax](#actualizaci%C3%B3n-de-cat%C3%A1logos-de-dtvax)
  - [Contenido](#contenido)
  - [Stack Tecnológico](#stack-tecnol%C3%B3gico)
    - [JavaScript](#javascript)
  - [Configuración](#configuraci%C3%B3n)
  - [Instalación](#instalaci%C3%B3n)
  - [Funcionamiento](#funcionamiento)

## Stack Tecnológico

El software emmplea el siguiente stack:

- NodeJS >= 8
- NPM >= 5
- Microsoft SQL Server

### JavaScript

Para consultar los paquetes específicos de JavaScript, se pueden consultar los módulos que se encuentran en el archivo `package.json`, el cual cuenta con una lista que **no debe modificarse** de forma manual.

## Configuración

La aplicación permite configurar el funcionamiento mediante la modificación de un par de variables globales definidas al inicio del documento, de la siguiente manera:

```js
// Configuración de conexión a Microsoft SQL Server
const config = {
  user: "node",
  password: "12345678",
  server: "192.168.1.11\\sqlexpress",
  database: "dbSistema",
  encrypt: false
};

// Número de Días de atraso en la información
const diasAtraso = 2;
// URL de conexión para la API de DTVax sin la fecha final.
const urlDtVax =
  "http://www.dtvax.net:8081/ops/dtvaxOps?method=getUsersRecs&key={{LLAVE DE ACCESO API}}&recDate=";
// Datos de la base de datos
const tabla = "MovRecaudacionesDTVax";
```

En general, podemos definir cada variable de la siguiente manera:

- `config` es un objeto que contiene los datos de _configuración_ para la base de datos.
- `diasAtraso` es una variable que especifica los días de atraso que habrá al calcular la fecha de actualización de las tablas.
- `urlDtVax` es una constante con el _templete_ construído de la URL para acceder a la API de DTVax dónde se especifica cuál es el método a invocar, la llave de la API y, al final, una variable que permite filtrar por fecha y a la cual, posteriormente, se le _añadirá_, la fecha con el atraso especificado en `diasAtraso`.
  - La llave de acceso a la API es proporcionada por DTVax y por seguridad debe ser almacenada en un lugar seguro.
- `tabla` es una variable que representa el nombre de la tabla dentro de la base de datos donde se insertarán los datos de forma automatizada.

## Instalación

Para que el programa pueda ejecutarse correctamente, el cliente que lo vaya a ejecutar debe contar con `node` y `npm` instalado. Una vez descargado el código fuente (este repo), deberá ejecutarse el comando:

`npm install`

El cual, toma la lista de _dependencias_ del `package.json` y las descarga a la carpeta `node_modules` para que se puedan utilizar desde el `app.js`.

## Funcionamiento

El programa se encuentra en su totalidad dentro del archivo `app.js`, y cada pequeño fragmento del mismo se encuentra docmuentado de forma total para comprender que realiza cada pequeña línea de código.

En general, el programa emplea un cliente _REST_ para acceder a la API de DTVax, descarga los catálogos con `x` días de atraso (una variable global definida en el encabezado del documento), y los inserta, mediante la conexión con el servidor de base de datos (Microsoft SQL Server) a la tabla definida.

---

Hecho en México con ❤️ por Humberto Alcocer.

2018.
