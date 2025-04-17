# Deep Trails

[![NPM version](https://img.shields.io/npm/v/deep-trails)](https://www.npmjs.com/package/deep-trails)
[![License: MIT](https://img.shields.io/badge/license-MIT-red.svg)](./LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/gadiel-h/deep-trails)](https://github.com/gadiel-h/deep-trails/issues)
[![Stars](https://img.shields.io/github/stars/gadiel-h/deep-trails)](https://github.com/gadiel-h/deep-trails/stargazers)


Deep Trails es una librería diseñada para recorrer estructuras de datos de forma profunda y controlada, ofreciendo una gran flexibilidad y seguridad contra ciclos y errores. Su API simple y personalizable permite integrarla fácilmente en proyectos que requieren recorrer objetos, arrays, maps o sets con alta precisión.



## Características

- **Recorrido profundo:** Itera recursivamente sobre objetos, arrays, maps y sets.
- **Control personalizado:** Permite especificar opciones como iterar o no clvaes, agregar índices como claves en sets y excluir tipos específicos.
- **Prevención de ciclos:** Utiliza un `WeakSet` para evitar referencias circulares.
- **Funcionalidades extendidas:** Incluye una función de ayuda (`deepIterate.help`) para diagnosticar información de cada iteración.
- **Sin dependencias externas:** Ideal para proyectos que requieren mantener el código ligero y modular.



## Instalación

### Con NPM

Instala Deep Trails mediante NPM:

```bash
npm install deep-trails
```


### Desde GitHub

Clona el repositorio:

```bash
git clone https://github.com/gadiel-h/deep-trails.git
```



## Uso

Deep Trails se utiliza llamando a la función `deepIterate`, la cual recibe el objeto a recorrer, una función de callback y opciones de configuración.



### Ejemplo básico

```javascript
import { deepIterate } from 'deep-trails';

const obj = {
  a: new Map([
    [ { z: 27 }, true ]
  ]),
  b: {
    c: [ 9, 7, 3 ],
    d: new Set([ null, NaN, undefined ])
  }
};

const options = {
  iterateKeys: false,       // Confirma si se deben iterar las claves (si es posible).
  addIndexInSet: true,      // Añade índices en sets como claves en lugar de usar los valores de los elementos.
  doNotIterate: {
    keyTypes: new Set(),    // Tipos de claves (que sean objetos) que no se van a iterar.
    objectTypes: new Set()  // Tipos de valores (que sean objetos) que no se van a iterar.
  }
};

const visited = new WeakSet(); // Puedes añadir objetos aquí para no iterarlos.
const path = []; // Se recomienda no modificar la ruta.

// Recorre el objeto y ejecuta el callback en cada iteración.
deepIterate(obj, (key, value, path) => {
  // Coloca aquí la lógica para cada iteración.
  // Puedes detener la iteración haciendo un return.
  const { strPath, strValue, valueType } = deepIterate.help(key, value, path, obj);
  console.log(`${strPath}: ${valueType} = ${strValue}`);
}, options, visited, path);

```


### Opciones de configuración

- **iterateKeys (boolean)**: Determina si se deben iterar las claves cuando sea posible.

- **addIndexInSet (boolean)**: Si es true, en los sets se usará un índice como clave en lugar del valor.

- **doNotIterate (Object)**: Permite especificar sets o arrays con constructores (funciones o nombres):

  - **keyTypes**: Lista de constructores de claves que no se iterarán.

  - **objectTypes**: Lista de constructores de valores que no se iterarán.




### Otras funciones útiles

Deep Trails también ofrece otras funciones (accesibles desde "index.js") que además de ayudar internamente, pueden ser útiles:

- **[typeOf](./lib/utils/typeOf.js)**: Detecta el tipo de un valor usando el operador `typeof` y la función `Object.prototype.toString.call`
- **[stringifySimple, stringifyPath](./lib/utils/stringify.js)**: Convierte rutas (arrays) y otros valores a string para mostrarlos de forma sencilla.
- **[pathUtils](./lib/utils/paths.js)**: Guarda, modifica u obtén valores en objetos respecto a una ruta dentro de un objeto.




## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar Deep Trails o reportar algún problema, crea un issue o envía un pull request.




## Licencia

Este proyecto se distribuye bajo la licencia MIT.
