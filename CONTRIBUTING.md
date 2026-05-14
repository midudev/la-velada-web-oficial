# CONTRIBUTING.md

## Bienvenido a 'La velada del año 5' 🌌

¡Estamos encantados de que estés interesado en contribuir a nuestro proyecto! Este documento te guiará a través de los pasos necesarios para aportar tu valioso trabajo a 'La velada del año 5', un proyecto desarrollado con Astro. Queremos hacer de este proceso algo sencillo y transparente, así que aquí tienes una guía paso a paso.

### Primeros pasos 🚀

1. **Familiarízate con Astro JS**: Si aún no lo has hecho, asegúrate de entender cómo funciona Astro JS. Puedes encontrar mucha información útil en [la documentación oficial de Astro](https://docs.astro.build).

2. **Configura tu entorno de desarrollo**: Recomendamos utilizar `pnpm` como gestor de paquetes por su eficiencia y rapidez. Si no tienes `pnpm` instalado, puedes hacerlo ejecutando `npm install -g pnpm`.

### Cómo contribuir 🛠

#### 1. Configura tu entorno

- **Fork el repositorio**: Haz un "fork" del proyecto a tu cuenta de GitHub para tener tu propia copia. Para hacer esto, haz clic en el botón "Fork" en la parte superior derecha de la página del repositorio en GitHub. Esto creará una copia del repositorio en tu cuenta de GitHub.

- **Clona tu fork**: Después de hacer un fork, clona el repositorio a tu máquina local. Para hacerlo, copia la URL de tu fork haciendo clic en el botón verde "Code" y luego ejecuta `git clone <URL del fork>` en tu terminal.

- **Añade el repositorio original como remoto**: Para mantener tu fork actualizado con los cambios del repositorio original, agrega el repositorio original como un remoto. Puedes hacerlo ejecutando `git remote add upstream <URL del repositorio original>`.

- **Asegúrate de usar la versión de Node correcta**: Para ello, `nvm use` o `nvm use <version>`, si no usas `nvm`, asegúrate de descargar la versión detallada en `.node-version` o `.nvmrc`.

- **Instala las dependencias**: Navega hasta el directorio del proyecto clonado y ejecuta `pnpm install` para instalar todas las dependencias necesarias.

#### 2. Trabaja en tus cambios

- **Sincroniza el fork**: Puedes hacerlo desde `github.com/tu-usuario/tu-repositorio-de-la-velada` y haciendo click en `Sync fork`. También puedes hacerlo desde la terminal `gh repo sync -b main` o `git switch main && git fetch upstream && git merge upstream/la-velada-vi`. Más información en la [documentación oficial de GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)
- **Crea una nueva rama**: Antes de empezar a trabajar en tus cambios, crea una nueva rama utilizando `git switch -c nombre-de-tu-rama`.
- **Desarrolla tus cambios**: Implementa tus cambios o mejoras en tu rama local. Asegúrate de seguir las prácticas y estándares de código del proyecto.
- **Prueba tus cambios**: Ejecuta `pnpm run dev` para iniciar el servidor de desarrollo de Astro y revisa tus cambios en el navegador.

#### 3. Envía tus cambios

- **Commit de tus cambios**: Una vez estés satisfecho con tus cambios, haz commit de ellos con un mensaje claro y descriptivo.
- **Push a tu fork**: Haz push de tu rama con los cambios a tu fork en GitHub utilizando `git push origin nombre-de-tu-rama`.
- **Crea un Pull Request (PR)**: En GitHub, ve a tu fork de 'La velada del año 5' y haz clic en "Pull request" para iniciar uno. Asegúrate de describir claramente qué cambios has realizado y por qué son necesarios o útiles para el proyecto.

### Buenas prácticas 🌟

- **Revisa los issues abiertos** antes de abrir una PR, si crees que puedes solucionarlo y no hay ninguna otra PR ya abierta, usa `#numero-de-la-issue` en tu commit para que se añada a la issue. No está demás dejar algún comentario para que se sepa que PR está siendo usada para la issue.
- **Revisa los PRs abiertos** para asegurarte de que no estás trabajando en algo que ya está en progreso. Siempre puedes ayudar en PRs ya abiertas, aportando cambios, comentarios, revisiones, etc..
- **Mantén tus commits limpios y descriptivos**.
- **Sigue las convenciones de código del proyecto**.
- **Actualiza tu rama con frecuencia** para mantenerla al día con la rama principal del proyecto.
- **Participa en las discusiones** de tu PR si hay comentarios o sugerencias.
- **Uso de objetos y typos globales** como `new Date` -> `new window.Date`, `NodeListOf` -> `globalThis.NodeListOf`, `NodeJS` -> `globalThis.NodeJS`. En caso de no saber que usar, referenciad en [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) o en la documentación del framework [Astro](https://docs.astro.build/en/guides/typescript/#extending-window-and-globalthis)

### ¿Necesitas ayuda? 🆘

Si tienes alguna pregunta o necesitas ayuda, no dudes en abrir un "issue" en el repositorio. Nuestro equipo y la comunidad estarán encantados de ayudarte.

¡Gracias por contribuir a 'La velada del año 5'! Juntos estamos construyendo algo increíble. 🚀
