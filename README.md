<a name="readme-top"></a>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<a href="https://github.com/midudev/la-velada-web-oficial">
  <img width="300px" src="./public/img/drawn-x-logo.webp" alt="Logo" width="800" />
</a>

## Web oficial de La Velada IV

La Velada IV es una competición de boxeo que enfrenta a streamers, creadores de contenido y otras celebridades sobre un ring.\
[Diseño de Figma](https://www.figma.com/file/7uUHCJ7YhJEoB24EZ00lXC/240405-LVDA-IV?type=design&node-id=0-1&mode=design&t=CUK9cH8DXhKXx31U-0) · [Reportar error](https://github.com/midudev/la-velada-web-oficial/issues) · [Sugerir algo](https://github.com/midudev/la-velada-web-oficial/issues)

</div>

<details>
<summary>Tabla de contenidos</summary>

- [Web oficial de La Velada IV](#web-oficial-de-la-velada-iv)
- [Características principales](#características-principales)
  - [Capturas de pantalla de la web de La Velada IV:](#capturas-de-pantalla-de-la-web-de-la-velada-iv)
- [Para empezar](#para-empezar)
  - [Prerequisitos](#prerequisitos)
  - [Instalación](#instalación)
- [Contribuir al proyecto](#contribuir-al-proyecto)
  - [Contribuir desde Stackblitz](#contribuir-desde-stackblitz)
- [🛠️ Stack](#️-stack)

</details>

## Características principales

- **Detalles del evento**: Obtén información detallada sobre la fecha, hora, ubicación y artistas participantes.
- **Compra de boletos**: Permite a los usuarios dirigirlos a la compra de boletos fácilmente.
- **Redes sociales**: Conoce las redes oficiales donde podrás informarte sobre el evento.

### Capturas de pantalla de la web de La Velada IV

![Captura de pantalla en móvil](./public/img/github/Mobile_README.png)
![Captura de pantalla en ordenador](./public/img/github/Desktop_README.png)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Para empezar

### Prerequisitos

- NVM (recomendado para asegurar versión de Node) ver [documentación oficial](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

  ```sh
  nvm use
  # o
  nvm use <version>
  ```
> Si quieres automatizar el proceso, puedes crear un script siguiendo la [documentación oficial](https://github.com/nvm-sh/nvm?tab=readme-ov-file#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

<details>
	<summary>Pequeño script de automatización</summary>
	
- For Linux/MacOS:
	```sh
	# .bashrc | .zshrc | cualquier archivo de configuración
	# pequeño script para cambiar de version al entrar al directorio
	cd() {
  builtin cd "$@"
		if [[ -f .nvmrc ]]; then
			nvm use > /dev/null
			# Si quieres que te diga la versión
			nvm use
		fi
	}
	```

- For Windows:
	```powershell
	# $PROFILE
	function Change-Node-Version {
		param($path)
		& Set-Location $path
		$pwd = pwd
		if ( Test-Path "$pwd\\.nvmrc" ) {
			$version = Get-Content .nvmrc
			nvm use $version
		}
	}
	New-Alias -Name cd -Value Change-Node-Version -Force -Option AllScope
	```
 </details>

- PNPM (es nuestra recomendación por su eficiencia y rapidez)

  ```sh
  npm install -g pnpm
  ```

- o NPM

  ```sh
  npm install npm@latest -g
  ```

### Instalación

1. Clona el repositorio

   ```sh
   git clone https://github.com/midudev/la-velada-web-oficial.git
   ```

2. Instala los paquetes de NPM

   ```sh
   pnpm install
   ```

3. Ejecuta el proyecto

   ```sh
   pnpm run dev
   ```

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Contribuir al proyecto

Las contribuciones son lo que hacen que la comunidad de código abierto sea un lugar increíble para aprender, inspirar y crear. ¡Cualquier contribución que hagas es **muy apreciada**!

Si tienes alguna sugerencia que podría mejorar el proyecto, por favor haz un [_fork_](https://github.com/midudev/la-velada-web-oficial/fork) del repositorio y crea una [_pull request_](https://github.com/midudev/la-velada-web-oficial/pulls). También puedes simplemente abrir un [_issue_](https://github.com/midudev/la-velada-web-oficial/issues) con la etiqueta "enhancement".

Aquí tienes una guía rápida:

1. Haz un [_fork_](https://github.com/midudev/la-velada-web-oficial/fork) del Proyecto
2. Clona tu [_fork_](https://github.com/midudev/la-velada-web-oficial/fork) (`git clone <URL del fork>`)
3. Añade el repositorio original como remoto (`git remote add upstream <URL del repositorio original>`)
4. Crea tu Rama de Funcionalidad (`git switch -c feature/CaracteristicaIncreible`)
5. Realiza tus Cambios (`git commit -m 'Add: alguna CaracterísticaIncreible'`)
6. Haz Push a la Rama (`git push origin feature/CaracteristicaIncreible`)
7. Abre una [_pull request_](https://github.com/midudev/la-velada-web-oficial/pulls)

Por favor, consulta nuestra [guía de contribución](https://github.com/midudev/la-velada-web-oficial/blob/master/CONTRIBUTING.md) para saber cómo puedes empezar de la mejor manera y siguiendo [buenas prácticas](https://github.com/midudev/la-velada-web-oficial/blob/main/CONTRIBUTING.md#buenas-prácticas-).

### Contribuir desde Stackblitz

Si quieres contribuir de una manera mas sencilla, puedes iniciar este proyecto desde _Stackblitz_ usando tu cuenta de GitHub:

[![Abrir en Stackblitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/midudev/la-velada-web-oficial)

**¡Gracias a todos los colaboradores que han hecho posible este proyecto!**

[![Contribuidores](https://contrib.rocks/image?repo=midudev/la-velada-web-oficial)](https://github.com/midudev/la-velada-web-oficial/graphs/contributors)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## 🛠️ Stack

- [![Astro][astro-badge]][astro-url] - The web framework for content-driven websites.
- [![Typescript][typescript-badge]][typescript-url] - JavaScript with syntax for types.
- [![Tailwind CSS][tailwind-badge]][tailwind-url] - A utility-first CSS framework for rapidly building custom designs.
- [![@midudev/tailwind-animations][animations-badge]][animations-url] - Easy peasy animations for your Tailwind project.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

[astro-url]: https://astro.build/
[typescript-url]: https://www.typescriptlang.org/
[tailwind-url]: https://tailwindcss.com/
[animations-url]: https://tailwindcss-animations.vercel.app/
[astro-badge]: https://img.shields.io/badge/Astro-fff?style=for-the-badge&logo=astro&logoColor=bd303a&color=352563
[typescript-badge]: https://img.shields.io/badge/Typescript-007ACC?style=for-the-badge&logo=typescript&logoColor=white&color=blue
[tailwind-badge]: https://img.shields.io/badge/Tailwind-ffffff?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8
[animations-badge]: https://img.shields.io/badge/@midudev/tailwind-animations-ff69b4?style=for-the-badge&logo=node.js&logoColor=white&color=blue
[contributors-shield]: https://img.shields.io/github/contributors/midudev/la-velada-web-oficial.svg?style=for-the-badge
[contributors-url]: https://github.com/midudev/la-velada-web-oficial/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/midudev/la-velada-web-oficial.svg?style=for-the-badge
[forks-url]: https://github.com/midudev/la-velada-web-oficial/network/members
[stars-shield]: https://img.shields.io/github/stars/midudev/la-velada-web-oficial.svg?style=for-the-badge
[stars-url]: https://github.com/midudev/la-velada-web-oficial/stargazers
[issues-shield]: https://img.shields.io/github/issues/midudev/la-velada-web-oficial.svg?style=for-the-badge
[issues-url]: https://github.com/midudev/la-velada-web-oficial/issues
