<a name="readme-top"></a>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<a href="https://www.infolavelada.com/" target="_blank" rel="noopener noreferrer">
  <img width="300px" src="https://github.com/user-attachments/assets/9cb3d500-8b37-400a-a983-6a6d1a9356a2" alt="Logo" />
</a>

## Web oficial de La Velada VI

La Velada VI es una competición de boxeo que enfrenta a streamers, creadores de contenido y otras celebridades sobre un ring. Organizada por Ibai Llanos en el Estadio La Cartuja de Sevilla. [Reportar error](https://github.com/midudev/la-velada-web-oficial/issues) · [Sugerir algo](https://github.com/midudev/la-velada-web-oficial/issues)

</div>

<details>
<summary>Tabla de contenidos</summary>

- [Web oficial de La Velada VI](#web-oficial-de-la-velada-vi)
- [Características principales](#características-principales)
- [Para empezar](#para-empezar)
  - [Prerequisitos](#prerequisitos)
  - [Instalación](#instalación)
  - [Base de datos local](#base-de-datos-local)
  - [Autenticación Twitch](#autenticación-twitch-opcional)
- [Testing](#testing)
- [Contribuir al proyecto](#contribuir-al-proyecto)
  - [Contribuir desde Stackblitz](#contribuir-desde-stackblitz)
- [Stack](#️-stack)

</details>

## Características principales

- **10 combates y 20+ luchadores**: Información detallada de cada combate, reglas, y perfiles de luchadores.
- **Sistema de predicciones**: Los usuarios pueden votar por su luchador favorito en cada combate con autenticación vía Twitch.
- **Resultados en tiempo real**: Las barras de predicción se actualizan con los votos de la comunidad.
- **Rate limiting**: Protección de la API contra abuso (60 GET/min, 10 POST/min por IP) con persistencia en SQLite.
- **Cache multi-capa**: Cliente (localStorage 15s) → Servidor (memoria 30s) → Base de datos.
- **Detalles del evento**: Fecha, hora, ubicación, artistas participantes y sponsors.
- **Redes sociales**: Redes oficiales del evento.

### Capturas de pantalla de la web de La Velada VI

![Captura de pantalla](https://github.com/user-attachments/assets/9c63299b-db80-49e5-a566-2b99405230e3)

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
	<summary>Script de automatización</summary>

- En Linux/MacOS:
	```sh
	# .bashrc | .zshrc | cualquier archivo de configuración
	cd() {
  builtin cd "$@"
		if [[ -f .nvmrc ]]; then
			nvm use > /dev/null
			nvm use
		fi
	}
	```

- En Windows:

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

	- PNPM (recomendado por eficiencia y rapidez)

  ```sh
  npm install -g pnpm
  ```

### Instalación

1. Clona el repositorio

   ```sh
   git clone https://github.com/midudev/la-velada-web-oficial.git
   ```

2. Instala los paquetes

   ```sh
   pnpm install
   ```

3. Ejecuta el proyecto

   ```sh
   pnpm dev
   ```

### Base de datos local

El proyecto usa [Turso](https://turso.tech/) (SQLite) para las predicciones. Para desarrollo local:

```sh
# Inicializar la base de datos local
pnpm db:init

# Poblar con datos de ejemplo
pnpm db:seed

# Verificar que funciona
pnpm db:check
```

Esto crea un archivo `local.db` con las tablas de predicciones y rate limiting.

### Autenticación Twitch (opcional)

Para habilitar el login con Twitch y el sistema de votaciones:

1. Accede a la [consola de Twitch](https://dev.twitch.tv/) y crea una aplicación
2. Configura la OAuth Redirect URL: `http://localhost:4321/api/auth/callback/twitch`
3. Genera un hash aleatorio: `openssl rand -hex 32`
4. Crea `.env.local` basado en [.env.demo](.env.demo) con tus credenciales

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Testing

El proyecto cuenta con tests unitarios (Vitest) y E2E (Playwright):

```sh
# Tests unitarios
pnpm test              # Ejecutar una vez
pnpm test:watch        # Modo watch
pnpm test:coverage     # Con cobertura

# Tests E2E (requiere servidor corriendo)
pnpm test:e2e          # Ejecutar todos
pnpm test:e2e:ui       # Con interfaz visual
```

| Tipo | Framework | Tests | Cobertura |
|------|-----------|-------|-----------|
| Unit | Vitest + happy-dom | 57 | countdown, predictions, rate-limiter, boxers, dom-selector, get-predictions-for-page |
| E2E | Playwright | 37 | landing, combates, luchador, navegacion |
| **Total** | | **94** | |

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Contribuir al proyecto

Las contribuciones son lo que hacen que la comunidad de código abierto sea un lugar increíble para aprender, inspirar y crear. ¡Cualquier contribución que hagas es **muy apreciada**!

Si tienes alguna sugerencia que podría mejorar el proyecto, por favor haz un [_fork_](https://github.com/midudev/la-velada-web-oficial/fork) del repositorio y crea una [_pull request_](https://github.com/midudev/la-velada-web-oficial/pulls). También puedes simplemente abrir un [_issue_](https://github.com/midudev/la-velada-web-oficial/issues) con la etiqueta "enhancement".

Guía rápida:

1. Haz un [_fork_](https://github.com/midudev/la-velada-web-oficial/fork) del Proyecto
2. Clona tu [_fork_](https://github.com/midudev/la-velada-web-oficial/fork) (`git clone <URL del fork>`)
3. Anade el repositorio original como remoto (`git remote add upstream <URL del repositorio original>`)
4. Crea tu Rama de Funcionalidad (`git switch -c feature/CaracteristicaIncreible`)
5. Realiza tus Cambios (`git commit -m 'Add: alguna CaracteristicaIncreible'`)
6. Haz Push a la Rama (`git push origin feature/CaracteristicaIncreible`)
7. Abre una [_pull request_](https://github.com/midudev/la-velada-web-oficial/pulls)

Por favor, consulta nuestra [guía de contribución](https://github.com/midudev/la-velada-web-oficial/blob/master/CONTRIBUTING.md) para saber cómo puedes empezar de la mejor manera y siguiendo [buenas prácticas](https://github.com/midudev/la-velada-web-oficial/blob/main/CONTRIBUTING.md#buenas-prácticas-).

### Contribuir desde Stackblitz

Si quieres contribuir de una manera más sencilla, puedes iniciar este proyecto desde _Stackblitz_ usando tu cuenta de GitHub:

[![Abrir en Stackblitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/midudev/la-velada-web-oficial)

**¡Gracias a todos los colaboradores que han hecho posible este proyecto!**

[![Contribuidores](https://contrib.rocks/image?repo=midudev/la-velada-web-oficial&max=500&columns=20)](https://github.com/midudev/la-velada-web-oficial/graphs/contributors)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## 🛠️ Stack

- [![Astro][astro-badge]][astro-url] - The web framework for content-driven websites.
- [![Typescript][typescript-badge]][typescript-url] - JavaScript with syntax for types.
- [![Tailwind CSS][tailwind-badge]][tailwind-url] - A utility-first CSS framework for rapidly building custom designs.
- [![@midudev/tailwind-animations][animations-badge]][animations-url] - Easy peasy animations for your Tailwind project.
- [![Turso][turso-badge]][turso-url] - SQLite for production. Edge database.
- [![Vitest][vitest-badge]][vitest-url] - Next generation testing framework.
- [![Playwright][playwright-badge]][playwright-url] - Reliable end-to-end testing.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

[astro-url]: https://astro.build/
[typescript-url]: https://www.typescriptlang.org/
[tailwind-url]: https://tailwindcss.com/
[animations-url]: https://tailwindcss-animations.vercel.app/
[turso-url]: https://turso.tech/
[vitest-url]: https://vitest.dev/
[playwright-url]: https://playwright.dev/
[astro-badge]: https://img.shields.io/badge/Astro-fff?style=for-the-badge&logo=astro&logoColor=bd303a&color=352563
[typescript-badge]: https://img.shields.io/badge/Typescript-007ACC?style=for-the-badge&logo=typescript&logoColor=white&color=blue
[tailwind-badge]: https://img.shields.io/badge/Tailwind-ffffff?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8
[animations-badge]: https://img.shields.io/badge/@midudev/tailwind-animations-ff69b4?style=for-the-badge&logo=node.js&logoColor=white&color=blue
[turso-badge]: https://img.shields.io/badge/Turso-121212?style=for-the-badge&logo=turso&logoColor=4FF8D2
[vitest-badge]: https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white
[playwright-badge]: https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white
[contributors-shield]: https://img.shields.io/github/contributors/midudev/la-velada-web-oficial.svg?style=for-the-badge
[contributors-url]: https://github.com/midudev/la-velada-web-oficial/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/midudev/la-velada-web-oficial.svg?style=for-the-badge
[forks-url]: https://github.com/midudev/la-velada-web-oficial/network/members
[stars-shield]: https://img.shields.io/github/stars/midudev/la-velada-web-oficial.svg?style=for-the-badge
[stars-url]: https://github.com/midudev/la-velada-web-oficial/stargazers
[issues-shield]: https://img.shields.io/github/issues/midudev/la-velada-web-oficial.svg?style=for-the-badge
[issues-url]: https://github.com/midudev/la-velada-web-oficial/issues
