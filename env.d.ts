/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="@sanity/astro/module" />

declare namespace App {
	interface Locals {
		locale: import('./src/i18n/locale').Locale
	}
}
