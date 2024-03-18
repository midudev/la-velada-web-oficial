interface Contributor {
	avatar_url: string
	login: string
}

export async function showContributors($miduContainer: HTMLDivElement) {
	const url = "https://api.github.com/repos/midudev/la-velada-web-oficial/contributors"

	const response = await fetch(url)
	const contributors = (await response.json()) as Contributor[]

	for (let i = 0; i < contributors.length; i++) {
		setTimeout(() => {
			const { avatar_url, login } = contributors[i]
			const img = document.createElement("img")
			img.alt = login
			img.title = login
			img.classList.add("bubbles")
			if (login === "midudev") {
				img.setAttribute("id", "midu")
				img.src = `${avatar_url}&size=150`
			} else {
				img.src = `${avatar_url}&size=60`
				img.style.left = `${generateRandomNumber()}vw`
				const startRotation = Math.floor(Math.random() * (90 - -90 + 1)) + -45
				img.style.transform = `rotate(${startRotation}deg)`
			}
			img.addEventListener("animationend", () => {
				$miduContainer.removeChild(img)
			})
			$miduContainer.appendChild(img)
		}, i * 300)
	}
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
