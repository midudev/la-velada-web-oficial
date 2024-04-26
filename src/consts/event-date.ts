export const EVENT_TIMESTAMP = 1720886400000 as const

/*
 Mapeo de Abreviaturas de Zonas Horarias

 Este objeto proporciona abreviaturas para zonas horarias globales, facilitando la gestión y visualización de información de tiempo en diversas regiones. Incluye zonas horarias para América del Norte, Europa, Asia, Australia, África y Sudamérica, además de otras zonas globales significativas.

 Cada entrada vincula un identificador de zona horaria IANA con su abreviatura común.

 Fuente de algunos datos de zona horaria: https://www.healthstream.com/hlchelp/Administrator/Classes/HLC_Time_Zone_Abbreviations.htm

*/
export const timeZoneAbbreviations: { [key: string]: string } = {
	// North America, including specific zones for Mexico
	"America/New_York": "ET", // Eastern Time
	"America/Chicago": "CT", // Central Time
	"America/Denver": "MT", // Mountain Time
	"America/Phoenix": "MST", // Mountain Time (no DST)
	"America/Los_Angeles": "PT", // Pacific Time
	"America/Anchorage": "AKST", // Alaska Time
	"America/Honolulu": "HST", // Hawaii Time
	"America/Mexico_City": "CST", // Central Standard Time (Mexico)
	"America/Chihuahua": "MST", // Mountain Standard Time (Mexico)
	"America/Mazatlan": "MST", // Mountain Standard Time (Mexico Pacific Coast)
	"America/Merida": "CST", // Central Standard Time (Mexico)
	"America/Monterrey": "CST", // Central Standard Time (Mexico)
	"America/Tijuana": "PST", // Pacific Standard Time (Mexico)
	"America/Cancun": "EST", // Eastern Standard Time (Mexico)

	// Europe
	"Europe/London": "GMT", // British Time (GMT/BST)
	"Europe/Berlin": "CET", // Central European Time
	"Europe/Paris": "CET", // Central European Time (France)
	"Europe/Moscow": "MSK", // Moscow Time
	"Europe/Athens": "EET", // Eastern European Time

	// Asia
	"Asia/Tokyo": "JST", // Japan Standard Time
	"Asia/Hong_Kong": "HKT", // Hong Kong Time
	"Asia/Singapore": "SGT", // Singapore Time
	"Asia/Calcutta": "IST", // Indian Standard Time
	"Asia/Bangkok": "ICT", // Indochina Time
	"Asia/Shanghai": "CST", // China Standard Time
	"Asia/Seoul": "KST", // Korea Standard Time

	// Australia
	"Australia/Sydney": "AEDT", // Australian Eastern Daylight Time
	"Australia/Adelaide": "ACDT", // Australian Central Daylight Time
	"Australia/Perth": "AWST", // Australian Western Time
	"Australia/Brisbane": "AEST", // Australian Eastern Standard Time (no DST)

	// Africa
	"Africa/Johannesburg": "SAST", // South African Standard Time
	"Africa/Cairo": "EET", // Eastern European Time (Egypt)
	"Africa/Lagos": "WAT", // West Africa Time

	// South America, for countries with one time zone we use the country code to improve readability
	"America/Sao_Paulo": "BRT", // Brasilia Time
	"America/Buenos_Aires": "ARG", // Argentine Time
	"America/Lima": "PE", // Peruvian Time
	"America/Bogota": "COL", // Colombian Time
	"America/Caracas": "VE", // Venezuelan Standard Time
	"America/Montevideo": "UY", // Uruguayan Time
	"America/Santiago": "CL", // Chilean Time

	// Additional Global Time Zones
	"Pacific/Auckland": "NZDT", // New Zealand Daylight Time
	"Atlantic/Reykjavik": "GMT", // Iceland Time
	"Pacific/Fiji": "FJT", // Fiji Time
	"Pacific/Tongatapu": "TOT", // Tonga Time
	"Etc/UTC": "UTC", // Coordinated Universal Time
	"America/St_Johns": "NST", // Newfoundland Time
	"Asia/Kathmandu": "NPT", // Nepal Time
	"Asia/Yerevan": "AMT", // Armenia Time
	"Asia/Baku": "AZT", // Azerbaijan Time
	"Asia/Karachi": "PKT", // Pakistan Standard Time
} as const
