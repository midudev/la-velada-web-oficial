interface ToastOptions {
	title?: string
	message?: string
	type?: string
	location?: string
	icon?: boolean
	theme?: string
	dismissible?: boolean
}

interface Window {
	toast: (options: ToastOptions) => void
}
