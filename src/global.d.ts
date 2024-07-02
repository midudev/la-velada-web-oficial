declare global {
	interface Window {
		toast: (options: ToastOptions) => void
	}
}

export {}
