interface Contributor {
	avatar_url: string
	login: string
}

export async function showContributors($miduContainer: HTMLDivElement) {
	async function loadContributors() {
		const contributorsLocalStorage = localStorage.getItem("contributors")
		const contributors: Contributor[] = contributorsLocalStorage
			? JSON.parse(contributorsLocalStorage)
			: await getContributors()

		// maps for the contributors for save types Contributors
		const contributorsMap = contributors.map((contributor: Contributor) => {
			return {
				avatar_url: contributor.avatar_url,
				login: contributor.login,
				/* add more data here */
			}
		})
		contributorsLocalStorage ||
			localStorage.setItem("contributors", JSON.stringify(contributorsMap))
		return await contributors
	}
	function convertImgUrlToBase64(name: string, url: string) {
		const img = new Image()
		img.src = url
		img.crossOrigin = "Anonymous"
		img.onload = function () {
			const canvas = document.createElement("canvas")
			const ctx = canvas.getContext("2d")
			canvas.width = img.width
			canvas.height = img.height
			ctx?.drawImage(img, 0, 0)
			const dataURL = canvas.toDataURL("image/png")
			localStorage.setItem(name, dataURL)
		}
	}
	const contributors = await loadContributors()
	for (let i = 0; i < contributors.length; i++) {
		setTimeout(() => {
			const { avatar_url, login } = contributors[i]
			const img = document.createElement("img")
			img.alt = login
			img.title = login
			img.classList.add("bubbles")
			if (login === "midudev") {
				const localStorageItem = localStorage.getItem(login)
				img.setAttribute("id", "midu")
				img.src = localStorageItem
					? localStorageItem || `${avatar_url}&size=150`
					: `${avatar_url}&size=60`
				// convert img url to base64 and save in localstorage
				convertImgUrlToBase64(login, img.src)
			} else {
				const localStorageItem = localStorage.getItem(login)
				img.src = localStorageItem
					? localStorageItem || `${avatar_url}&size=60`
					: `${avatar_url}&size=60`
				img.style.left = `${generateRandomNumber()}vw`
				const startRotation = Math.floor(Math.random() * (90 - -90 + 1)) + -45
				img.style.transform = `rotate(${startRotation}deg)`
				convertImgUrlToBase64(login, img.src)
			}
			img.addEventListener("animationend", () => {
				$miduContainer.removeChild(img)
			})
			$miduContainer.appendChild(img)
		}, i * 300)
	}
}

export async function getContributors() {
	const url = "https://api.github.com/repos/midudev/la-velada-web-oficial/contributors"
	const response = await fetch(url)

	const linkHeader = response.headers.get("link")
	const pageCount = linkHeader ? Number(linkHeader.match(/page=(\d+)>; rel="last"/)?.[1] || "1") : 1
	const randomPage = Math.floor(Math.random() * pageCount) + 1
	const randomPageUrl = `${url}?page=${randomPage}`
	const randomPageResponse = await fetch(randomPageUrl)

	const contributors = (await randomPageResponse.json()) as Contributor[]

	return contributors
}

export function checkAndRemoveContainer($miduContainer: HTMLDivElement) {
	if ($miduContainer.childElementCount === 0) {
		$miduContainer.remove()
		return
	}

	setTimeout(() => {
		checkAndRemoveContainer($miduContainer)
	}, 1000)
}

function generateRandomNumber() {
	return Math.floor(Math.random() * 91) + 5
}
