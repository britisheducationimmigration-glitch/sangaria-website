import { __toESM } from "../_runtime.mjs";
import { HeadContent, Link, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent, notFound, require_jsx_runtime, require_react, useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { TSS_SERVER_FUNCTION, createServerFn, getServerFnById } from "./ssr.mjs";
import { __exportAll, changeAdminPassword, countries, getSessionUser, loginAdmin, resetAdminPassword, visaServices } from "./db.server-BhNUs5Hf.mjs";
import { clsx } from "../_libs/clsx.mjs";
import { twMerge } from "../_libs/tailwind-merge.mjs";
import { Analytics } from "../_libs/vercel__analytics.mjs";
import { SpeedInsights } from "../_libs/vercel__speed-insights.mjs";
import { CircleCheck, GraduationCap, LoaderCircle, Mail, MapPin, Menu, MessageCircle, Phone, Send, X } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-CsxL3qfE.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
// node_modules/.nitro/vite/services/ssr/assets/utils-Con6ahih.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** Public asset path. Keep this provider-neutral so images work on Preview and any host. */
function img(path, _w, _h) {
	return path;
}
// node_modules/.nitro/vite/services/ssr/assets/public-functions-pUi3ZGtm.js
function stringValue(value, max = 5e3) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function validateEnquiry(data) {
	const input = data ?? {};
	const result = {
		name: stringValue(input.name, 120),
		phone: stringValue(input.phone, 40),
		email: stringValue(input.email, 190),
		city: stringValue(input.city, 120),
		interest: stringValue(input.interest, 160),
		country: stringValue(input.country, 120),
		message: stringValue(input.message, 5e3),
		source: stringValue(input.source, 160),
		summary: stringValue(input.summary, 5e3)
	};
	if (result.name.length < 2) throw new Error("Please enter your name");
	if (result.phone.replace(/\D/g, "").length < 10) throw new Error("Please enter a valid phone number");
	if (result.email && !/^\S+@\S+\.\S+$/.test(result.email)) throw new Error("Please enter a valid email");
	return result;
}
var submitEnquiry = createServerFn({ method: "POST" }).validator(validateEnquiry).handler(createSsrRpc("a03d07227db12b383826e0fa92b2c8222ca6b2e11bcc485b1098bb2038a9a187"));
var getPublicContent = createServerFn({ method: "GET" }).handler(createSsrRpc("e2f4072ad03877a5d70f323d6a752ff07a9debb302d3a482a2babe9a67cb65a4"));
var getCoachingContent = createServerFn({ method: "GET" }).handler(createSsrRpc("7558011d2551df00f141c4ee6621ab3738add90204213d6627b39f265f6df042"));
// node_modules/.nitro/vite/services/ssr/assets/router-DkOd6TGA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Instagram(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": true,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "2",
				y: "2",
				width: "20",
				height: "20",
				rx: "5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "17.5",
				y1: "6.5",
				x2: "17.51",
				y2: "6.5"
			})
		]
	});
}
function Facebook(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": true,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
	});
}
var EMOJI_TO_CODE = {
	"🇨🇦": "CA",
	"🇬🇧": "UK",
	"🇦🇺": "AU",
	"🇺🇸": "US",
	"🇳🇿": "NZ",
	"🇩🇪": "DE",
	"🇪🇺": "EU",
	"🇮🇳": "IN"
};
var NAME_TO_CODE = {
	canada: "CA",
	uk: "UK",
	"united kingdom": "UK",
	britain: "UK",
	australia: "AU",
	usa: "US",
	"united states": "US",
	us: "US",
	"new zealand": "NZ",
	germany: "DE",
	europe: "EU",
	schengen: "EU",
	"europe / schengen": "EU",
	france: "FR",
	italy: "IT",
	india: "IN"
};
function resolveCountryCode(input) {
	if (!input) return "";
	const trimmed = input.trim();
	if (EMOJI_TO_CODE[trimmed]) return EMOJI_TO_CODE[trimmed];
	const lower = trimmed.toLowerCase();
	if (NAME_TO_CODE[lower]) return NAME_TO_CODE[lower];
	if (trimmed.length === 2 && /^[a-zA-Z]{2}$/.test(trimmed)) return trimmed.toUpperCase();
	return "";
}
function CountryFlag({ code, flag, country, className, ...props }) {
	const resolved = (code || resolveCountryCode(flag) || resolveCountryCode(country) || "").toUpperCase();
	if (resolved === "CA") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block overflow-hidden rounded-[3px] shadow-sm align-middle", className),
		title: country || "Canada",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 640 480",
			className: "w-full h-full block",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#d80027",
					d: "M0 0h160v480H0zm480 0h160v480H480z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#f0f0f0",
					d: "M160 0h320v480H160z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#d80027",
					d: "m320 75 19 46 41-11-20 44 48 10-38 31 16 43-44-12-14 39-8-2-8 2-14-39-44 12 16-43-38-31 48-10-20-44 41 11 19-46 6 120h6z"
				})
			]
		})
	});
	if (resolved === "UK" || resolved === "GB") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block overflow-hidden rounded-[3px] shadow-sm align-middle", className),
		title: country || "United Kingdom",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 640 480",
			className: "w-full h-full block",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#012169",
					d: "M0 0h640v480H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					stroke: "#fff",
					strokeWidth: "60",
					d: "m0 0 640 480M640 0 0 480"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					stroke: "#c8102e",
					strokeWidth: "40",
					d: "m0 0 640 480M640 0 0 480"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					stroke: "#fff",
					strokeWidth: "100",
					d: "M320 0v480M0 240h640"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					stroke: "#c8102e",
					strokeWidth: "60",
					d: "M320 0v480M0 240h640"
				})
			]
		})
	});
	if (resolved === "AU") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block overflow-hidden rounded-[3px] shadow-sm align-middle", className),
		title: country || "Australia",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 640 480",
			className: "w-full h-full block",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#00008b",
					d: "M0 0h640v480H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#012169",
						d: "M0 0h320v240H0z"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						stroke: "#fff",
						strokeWidth: "30",
						d: "m0 0 320 240M320 0 0 240"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						stroke: "#c8102e",
						strokeWidth: "20",
						d: "m0 0 320 240M320 0 0 240"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						stroke: "#fff",
						strokeWidth: "50",
						d: "M160 0v240M0 120h320"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						stroke: "#c8102e",
						strokeWidth: "30",
						d: "M160 0v240M0 120h320"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "160",
					cy: "360",
					r: "32",
					fill: "#fff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "480",
					cy: "90",
					r: "14",
					fill: "#fff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "540",
					cy: "180",
					r: "14",
					fill: "#fff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "480",
					cy: "390",
					r: "16",
					fill: "#fff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "420",
					cy: "220",
					r: "14",
					fill: "#fff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "510",
					cy: "260",
					r: "10",
					fill: "#fff"
				})
			]
		})
	});
	if (resolved === "US" || resolved === "USA") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block overflow-hidden rounded-[3px] shadow-sm align-middle", className),
		title: country || "United States",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 640 480",
			className: "w-full h-full block",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#b22234",
					d: "M0 0h640v480H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#fff",
					d: "M0 37h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#3c3b6e",
					d: "M0 0h260v259H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					fill: "#fff",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "40",
							cy: "40",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "90",
							cy: "40",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "140",
							cy: "40",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "190",
							cy: "40",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "230",
							cy: "40",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "65",
							cy: "80",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "115",
							cy: "80",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "165",
							cy: "80",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "210",
							cy: "80",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "40",
							cy: "120",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "90",
							cy: "120",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "140",
							cy: "120",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "190",
							cy: "120",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "230",
							cy: "120",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "65",
							cy: "160",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "115",
							cy: "160",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "165",
							cy: "160",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "210",
							cy: "160",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "40",
							cy: "200",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "90",
							cy: "200",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "140",
							cy: "200",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "190",
							cy: "200",
							r: "8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "230",
							cy: "200",
							r: "8"
						})
					]
				})
			]
		})
	});
	if (resolved === "NZ") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block overflow-hidden rounded-[3px] shadow-sm align-middle", className),
		title: country || "New Zealand",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 640 480",
			className: "w-full h-full block",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#00247d",
					d: "M0 0h640v480H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#012169",
						d: "M0 0h320v240H0z"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						stroke: "#fff",
						strokeWidth: "30",
						d: "m0 0 320 240M320 0 0 240"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						stroke: "#c8102e",
						strokeWidth: "20",
						d: "m0 0 320 240M320 0 0 240"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						stroke: "#fff",
						strokeWidth: "50",
						d: "M160 0v240M0 120h320"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						stroke: "#c8102e",
						strokeWidth: "30",
						d: "M160 0v240M0 120h320"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "480",
					cy: "100",
					r: "16",
					fill: "#fff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "480",
					cy: "100",
					r: "12",
					fill: "#cc142b"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "550",
					cy: "190",
					r: "14",
					fill: "#fff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "550",
					cy: "190",
					r: "10",
					fill: "#cc142b"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "480",
					cy: "380",
					r: "18",
					fill: "#fff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "480",
					cy: "380",
					r: "14",
					fill: "#cc142b"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "410",
					cy: "230",
					r: "14",
					fill: "#fff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "410",
					cy: "230",
					r: "10",
					fill: "#cc142b"
				})
			]
		})
	});
	if (resolved === "DE") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block overflow-hidden rounded-[3px] shadow-sm align-middle", className),
		title: country || "Germany",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 640 480",
			className: "w-full h-full block",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#000",
					d: "M0 0h640v160H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#dd0000",
					d: "M0 160h640v160H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#ffce00",
					d: "M0 320h640v160H0z"
				})
			]
		})
	});
	if (resolved === "EU") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block overflow-hidden rounded-[3px] shadow-sm align-middle", className),
		title: country || "Europe / Schengen",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 640 480",
			className: "w-full h-full block",
			xmlns: "http://www.w3.org/2000/svg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#003399",
				d: "M0 0h640v480H0z"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				fill: "#ffcc00",
				children: Array.from({ length: 12 }).map((_, i) => {
					const angle = i * 30 * Math.PI / 180;
					const cx = 320 + 130 * Math.sin(angle);
					const cy = 240 - 130 * Math.cos(angle);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx,
						cy,
						r: "12"
					}, i);
				})
			})]
		})
	});
	if (resolved === "IN") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block overflow-hidden rounded-[3px] shadow-sm align-middle", className),
		title: country || "India",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 640 480",
			className: "w-full h-full block",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#ff9933",
					d: "M0 0h640v160H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#fff",
					d: "M0 160h640v160H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#138808",
					d: "M0 320h640v160H0z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "320",
					cy: "240",
					r: "45",
					fill: "none",
					stroke: "#000080",
					strokeWidth: "7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "320",
					cy: "240",
					r: "10",
					fill: "#000080"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-forest-900/10 text-forest-900", className),
		...props,
		children: flag || country || code || "🌐"
	});
}
var site = {
	name: "British Education and Immigration",
	short: "British Education",
	tagline: "Study, work & settle abroad — guided from Sangaria to the world.",
	phones: ["9658018000", "9772570478"],
	emails: ["admissions@britisheducationandimmigration.com", "support@britisheducationandimmigration.com"],
	whatsapp: "919772570478",
	address: "Near Open Book Library, Bhagatpura Road, Sangaria, Hanumangarh, Rajasthan – 335063",
	mapQuery: "29.798547,74.464214",
	latitude: 29.798547,
	longitude: 74.464214,
	mapUrl: "https://www.google.com/maps/search/?api=1&query=29.798547,74.464214",
	hours: "Mon – Sat · 9:30 AM – 6:30 PM",
	instagram: "https://www.instagram.com/british_education_and_immigrat/",
	facebook: "https://www.facebook.com/BritishEducationAndImmigration"
};
var navLinks = [
	{
		to: "/countries",
		label: "Countries"
	},
	{
		to: "/visas",
		label: "Visas"
	},
	{
		to: "/eligibility",
		label: "Eligibility Check"
	},
	{
		to: "/coaching",
		label: "IELTS & PTE"
	},
	{
		to: "/success-stories",
		label: "Success Stories"
	},
	{
		to: "/updates",
		label: "News & Blog"
	}
];
function Logo({ light = false, className }) {
	const [imgError, setImgError] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("flex min-w-0 items-center gap-2 sm:gap-2.5", className),
		children: [!imgError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/img/logo.png",
			fetchPriority: "high",
			onError: () => setImgError(true),
			alt: "British Education & Immigration",
			className: "size-10 shrink-0 rounded-xl bg-white object-contain p-0.5 shadow-[3px_3px_0_0] shadow-forest-950/50 sm:size-11"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-forest-800 to-forest-950 text-coral-400 shadow-[3px_3px_0_0] shadow-forest-950/50 sm:size-11 ring-1 ring-white/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-6 text-coral-400" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("block truncate font-display text-[14px] font-extrabold tracking-tight sm:text-[17px]", light ? "text-white" : "text-forest-900"),
				children: "British Education"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("block truncate text-[9px] font-semibold uppercase tracking-[0.18em] sm:text-[10.5px] sm:tracking-[0.22em]", light ? "text-coral-400" : "text-coral-600"),
				children: "& Immigration"
			})]
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "bg-forest-950 bg-grain text-forest-100",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-6 pt-20 pb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-16 flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-16 md:flex-row md:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "max-w-2xl text-4xl font-extrabold text-white md:text-6xl",
						children: ["Your visa story ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-coral-500",
							children: "starts here."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/contact",
						className: "rounded-full bg-coral-500 px-7 py-4 font-bold text-white shadow-[4px_4px_0_0] shadow-black/40 transition hover:-translate-y-1",
						children: "Book free counselling →"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { light: true }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-xs text-sm leading-relaxed text-forest-100/70",
								children: site.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: site.instagram,
									target: "_blank",
									rel: "noreferrer",
									"aria-label": "Instagram",
									className: "grid size-10 place-items-center rounded-full bg-white/10 hover:bg-coral-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: site.facebook,
									target: "_blank",
									rel: "noreferrer",
									"aria-label": "Facebook",
									className: "grid size-10 place-items-center rounded-full bg-white/10 hover:bg-coral-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "size-4" })
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-4 text-xs font-bold uppercase tracking-[0.2em] text-coral-400",
							children: "Explore"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2.5 text-sm",
							children: navLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: l.to,
								className: "hover:text-white",
								children: l.label
							}) }, l.to))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-4 text-xs font-bold uppercase tracking-[0.2em] text-coral-400",
							children: "Destinations"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2.5 text-sm",
							children: countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/countries/$slug",
								params: { slug: c.slug },
								className: "hover:text-white flex items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
									flag: c.flag,
									code: c.code,
									country: c.name,
									className: "mr-2.5 h-3.5 w-5 shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name })]
							}) }, c.slug))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-4 text-xs font-bold uppercase tracking-[0.2em] text-coral-400",
								children: "Visit our office"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex gap-3 text-sm leading-relaxed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0 text-coral-400" }), site.address]
							}),
							site.phones.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:+91${p}`,
								className: "mt-3 flex items-center gap-3 text-sm hover:text-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4 text-coral-400" }),
									" +91 ",
									p
								]
							}, p)),
							site.emails.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
								target: "_blank",
								rel: "noreferrer",
								className: "mt-3 flex items-start gap-3 break-all text-sm hover:text-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mt-0.5 size-4 shrink-0 text-coral-400" }),
									" ",
									email
								]
							}, email)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-forest-100/60",
								children: site.hours
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-16 border-t border-white/10 pt-6 text-xs text-forest-100/50",
					children: [
						"© ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							suppressHydrationWarning: true,
							children: (/* @__PURE__ */ new Date()).getFullYear()
						}),
						" ",
						site.name,
						". Visa decisions are made solely by the respective embassies and immigration authorities."
					]
				})
			]
		})
	});
}
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden bg-forest-950 text-[13px] text-forest-100 md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📍 Sangaria, Hanumangarh · ", site.hours] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex gap-5",
					children: site.phones.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `tel:+91${p}`,
						className: "hover:text-coral-400",
						children: ["+91 ", p]
					}, p))
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-forest-900/10 bg-cream/85 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3.5 sm:gap-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						onClick: () => setOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-1 lg:flex",
						children: navLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.to,
							className: "rounded-full px-3.5 py-2 text-[14.5px] font-medium text-forest-900/80 transition hover:bg-forest-900/5 hover:text-forest-900",
							activeProps: { className: "!bg-forest-900 !text-white" },
							children: l.label
						}, l.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `tel:+91${site.phones[0]}`,
								className: "grid size-10 shrink-0 place-items-center rounded-full border border-forest-900/15 text-forest-900 transition hover:bg-forest-900 hover:text-white sm:size-11",
								"aria-label": "Call us",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								className: "shrink-0 rounded-full bg-coral-500 px-3 py-2 text-xs font-bold text-white shadow-[3px_3px_0_0] shadow-forest-950 transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0] sm:px-5 sm:py-2.5 sm:text-sm",
								children: "Free Enquiry"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "grid size-10 shrink-0 place-items-center rounded-full bg-forest-900 text-white lg:hidden sm:size-11",
								onClick: () => setOpen((v) => !v),
								"aria-label": "Menu",
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})
						]
					})
				]
			}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "grid gap-1 border-t border-forest-900/10 px-6 py-4 lg:hidden",
				children: [navLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					onClick: () => setOpen(false),
					className: "rounded-xl px-4 py-3 font-display text-lg font-semibold text-forest-900 hover:bg-forest-900/5",
					children: l.label
				}, l.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/contact",
					onClick: () => setOpen(false),
					className: "rounded-xl px-4 py-3 font-display text-lg font-semibold text-coral-600",
					children: "Contact us"
				})]
			})]
		})]
	});
}
function WhatsAppButton() {
	const [enabled, setEnabled] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		getPublicContent().then((content) => setEnabled(content.settings.whatsappEnabled)).catch(() => void 0);
	}, []);
	if (!enabled) return null;
	const text = encodeURIComponent("Hello British Education and Immigration, I would like to know more about visas.");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: `https://wa.me/${site.whatsapp}?text=${text}`,
		target: "_blank",
		rel: "noreferrer",
		"aria-label": "Chat on WhatsApp",
		className: "fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3.5 pr-5 pl-4 font-bold text-white shadow-xl shadow-black/20 transition hover:scale-105",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline",
			children: "WhatsApp us"
		})]
	});
}
/**
* The single enquiry form used across the site. Submissions are validated by the
* managed server function and saved to the project database.
*/
function EnquiryForm({ source, defaultInterest, defaultCountry, summary, dark = false, compact = false, onSuccess }) {
	const [state, setState] = (0, import_react.useState)("idle");
	async function onSubmit(e) {
		e.preventDefault();
		setState("sending");
		const data = new FormData(e.currentTarget);
		try {
			await submitEnquiry({ data: {
				name: String(data.get("name") ?? ""),
				phone: String(data.get("phone") ?? ""),
				email: String(data.get("email") ?? ""),
				city: String(data.get("city") ?? ""),
				interest: String(data.get("interest") ?? ""),
				country: String(data.get("country") ?? ""),
				message: String(data.get("message") ?? ""),
				source,
				summary: summary ?? ""
			} });
			setState("done");
			onSuccess?.();
		} catch {
			setState("error");
		}
	}
	if (state === "done") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-3xl p-10 text-center", dark ? "bg-white/10 text-white" : "bg-forest-50 text-forest-900"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto size-14 text-coral-500" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-2xl font-extrabold",
				children: "Enquiry received!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-2", dark ? "text-forest-100/80" : "text-forest-900/70"),
				children: "Our counsellor will call you within one working day. For instant help, click below to chat on WhatsApp."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://wa.me/919772570478?text=Hello%20British%20Education%2C%20I%20just%20submitted%20an%20enquiry%20on%20your%20website%20and%20would%20like%20to%20connect.",
				target: "_blank",
				rel: "noreferrer",
				className: "mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:brightness-105",
				children: "Chat with Counsellor on WhatsApp →"
			})
		]
	});
	const labelCls = cn("label", dark && "!text-forest-100/70");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		name: "enquiry",
		method: "POST",
		"data-netlify": "true",
		"netlify-honeypot": "bot-field",
		onSubmit,
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "hidden",
				name: "form-name",
				value: "enquiry"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "hidden",
				name: "source",
				value: source
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "hidden",
				name: "summary",
				value: summary ?? ""
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Don’t fill this out: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { name: "bot-field" })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("grid gap-4", !compact && "sm:grid-cols-2"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelCls,
					htmlFor: `${source}-name`,
					children: "Full name *"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `${source}-name`,
					name: "name",
					required: true,
					className: "field",
					placeholder: "Your name"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelCls,
					htmlFor: `${source}-phone`,
					children: "Phone / WhatsApp *"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `${source}-phone`,
					name: "phone",
					required: true,
					type: "tel",
					pattern: "[0-9+\\s-]{10,15}",
					className: "field",
					placeholder: "10-digit mobile"
				})] })]
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelCls,
					htmlFor: `${source}-email`,
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `${source}-email`,
					name: "email",
					type: "email",
					className: "field",
					placeholder: "you@example.com"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelCls,
					htmlFor: `${source}-city`,
					children: "City"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `${source}-city`,
					name: "city",
					className: "field",
					placeholder: "e.g. Sangaria"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("grid gap-4", !compact && "sm:grid-cols-2"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelCls,
					htmlFor: `${source}-interest`,
					children: "I’m interested in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: `${source}-interest`,
					name: "interest",
					defaultValue: defaultInterest ?? "",
					className: "field",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select a service"
						}),
						visaServices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s.title }, s.slug)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "IELTS Coaching" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "PTE Coaching" })
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelCls,
					htmlFor: `${source}-country`,
					children: "Preferred country"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: `${source}-country`,
					name: "country",
					defaultValue: defaultCountry ?? "",
					className: "field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Not decided yet"
					}), countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c.name }, c.slug))]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: labelCls,
				htmlFor: `${source}-message`,
				children: "Message"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: `${source}-message`,
				name: "message",
				rows: compact ? 2 : 4,
				className: "field resize-none",
				placeholder: "Tell us about your education, test scores or travel plans"
			})] }),
			state === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-coral-600",
				children: "Couldn’t send right now — please call or WhatsApp us."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				disabled: state === "sending",
				className: "group flex items-center justify-center gap-2 rounded-full bg-coral-500 px-7 py-4 font-bold text-white shadow-[4px_4px_0_0] shadow-forest-950 transition hover:-translate-y-0.5 disabled:opacity-70",
				children: [state === "sending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4 transition group-hover:translate-x-1" }), state === "sending" ? "Sending…" : "Send enquiry"]
			})
		]
	});
}
function EnquiryPopup() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const [delay, setDelay] = (0, import_react.useState)(8);
	const [enabled, setEnabled] = (0, import_react.useState)(true);
	const [hasSeen, setHasSeen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		getPublicContent().then((content) => {
			if (!active) return;
			setEnabled(content.settings.popupEnabled);
			setDelay(content.settings.popupDelaySeconds);
		}).catch(() => void 0);
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (window.sessionStorage.getItem("bei-enquiry-seen")) {
			setHasSeen(true);
			return;
		}
		if (!enabled || pathname.startsWith("/admin")) return;
		const timer = window.setTimeout(() => setOpen(true), delay * 1e3);
		return () => window.clearTimeout(timer);
	}, [
		delay,
		enabled,
		pathname
	]);
	if (!open || pathname.startsWith("/admin") || hasSeen) return null;
	function close() {
		sessionStorage.setItem("bei-enquiry-seen", "1");
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[60] grid place-items-center bg-forest-950/60 p-4 backdrop-blur-sm",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Free profile evaluation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[1.5rem] bg-forest-900 p-5 text-white shadow-2xl sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: close,
					"aria-label": "Close enquiry form",
					className: "absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-coral-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.18em] text-coral-400",
					children: "Free profile evaluation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 pr-8 text-2xl font-extrabold sm:text-3xl",
					children: "Planning to study, work or settle abroad?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 mb-6 text-sm text-forest-100/70",
					children: "Share your details and a counsellor will call within one working day."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, {
					source: "popup",
					dark: true,
					compact: true,
					onSuccess: close
				})
			]
		})
	});
}
var styles_default = "/assets/styles.css";
var localBusinessSchema = {
	"@context": "https://schema.org",
	"@type": "EducationalOrganization",
	name: "British Education and Immigration",
	url: "https://britisheducationandimmigration.com",
	logo: "https://britisheducationandimmigration.com/img/hero.png",
	image: "https://britisheducationandimmigration.com/img/hero.png",
	telephone: ["+919658018000", "+919772570478"],
	address: {
		"@type": "PostalAddress",
		streetAddress: "Near Open Book Library, Bhagatpura Road",
		addressLocality: "Sangaria",
		addressRegion: "Rajasthan",
		postalCode: "335063",
		addressCountry: "IN"
	},
	geo: {
		"@type": "GeoCoordinates",
		latitude: 29.798547,
		longitude: 74.464214
	},
	openingHoursSpecification: {
		"@type": "OpeningHoursSpecification",
		dayOfWeek: [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		],
		opens: "09:30",
		closes: "18:30"
	}
};
var Route$14 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Study Visa & IELTS Coaching in Sangaria | British Education" },
			{
				name: "keywords",
				content: "study visa Sangaria, IELTS coaching Sangaria, PTE coaching Sangaria, immigration consultant Sangaria, Hanumangarh study visa"
			},
			{
				name: "description",
				content: "Trusted study visa consultant and IELTS/PTE coaching in Sangaria, Hanumangarh. 2,500+ visas approved for Canada, UK, Australia, USA, New Zealand & Europe. Visit Bhagatpura Road office."
			},
			{
				name: "theme-color",
				content: "#0b3326"
			},
			{
				name: "geo.region",
				content: "IN-RJ"
			},
			{
				name: "geo.placename",
				content: "Sangaria"
			},
			{
				name: "geo.position",
				content: "29.798547;74.464214"
			},
			{
				name: "ICBM",
				content: "29.798547, 74.464214"
			},
			{
				property: "og:site_name",
				content: "British Education and Immigration"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:title",
				content: "Study Visa & IELTS Coaching in Sangaria | British Education"
			},
			{
				property: "og:description",
				content: "Study visa, PR, tourist visa and IELTS/PTE coaching in Sangaria, Rajasthan. Free profile evaluation."
			},
			{
				property: "og:image",
				content: "https://britisheducationandimmigration.com/img/hero.png"
			},
			{
				property: "og:locale",
				content: "en_IN"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Study Visa & IELTS Coaching in Sangaria | British Education"
			},
			{
				name: "twitter:description",
				content: "Trusted visa consultancy and IELTS/PTE coaching in Sangaria, Hanumangarh."
			},
			{
				name: "twitter:image",
				content: "https://britisheducationandimmigration.com/img/hero.png"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.json"
			},
			{
				rel: "preload",
				as: "image",
				href: "/img/hero.webp",
				type: "image/webp"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify(localBusinessSchema)
		}]
	}),
	shellComponent: RootDocument,
	notFoundComponent: NotFound
});
function RootDocument({ children }) {
	const isAdmin = useRouterState({ select: (state) => state.location.pathname }).startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppButton, {}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryPopup, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Analytics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeedInsights, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-3xl place-items-center px-6 py-32 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-sm text-coral-600",
				children: "ERROR 404 · PAGE NOT FOUND"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-5xl font-extrabold text-forest-900",
				children: "This page missed its flight."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-8 rounded-full bg-forest-900 px-6 py-3 font-bold text-white",
				children: "Back to home"
			})
		]
	});
}
var $$splitComponentImporter$10 = () => import("./routes-DT0-fvIy.mjs");
var Route$13 = createFileRoute("/")({
	loader: () => getPublicContent(),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin-Bn5gpg9o.mjs");
var Route$12 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin · British Education and Immigration" }, {
		name: "robots",
		content: "noindex,nofollow,noarchive"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./coaching-CEZOmDsF.mjs");
var Route$11 = createFileRoute("/coaching")({
	head: () => ({ meta: [{ title: "IELTS & PTE Coaching in Sangaria · British Education and Immigration" }] }),
	loader: () => getCoachingContent(),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./contact-CBVMcndE.mjs");
var Route$10 = createFileRoute("/contact")({
	validateSearch: (s) => ({ interest: typeof s.interest === "string" ? s.interest : void 0 }),
	head: () => ({ meta: [{ title: "Contact & Free Enquiry · British Education and Immigration" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./eligibility-DTWMc11K.mjs");
var Route$9 = createFileRoute("/eligibility")({
	head: () => ({ meta: [{ title: "Free Visa Eligibility Checker · British Education and Immigration" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./success-stories-C-xSRYau.mjs");
var Route$8 = createFileRoute("/success-stories")({
	loader: () => getPublicContent(),
	head: () => ({ meta: [{ title: "Visa Approvals & Testimonials · British Education and Immigration" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./visas-Dvy1NMbD.mjs");
var Route$7 = createFileRoute("/visas")({
	head: () => ({ meta: [{ title: "Visa Services · British Education and Immigration" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./countries.index-DJQALLnJ.mjs");
var Route$6 = createFileRoute("/countries/")({
	head: () => ({ meta: [{ title: "Study & Visa Destinations · British Education and Immigration" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./countries._slug-P4Cx0PPo.mjs");
var Route$5 = createFileRoute("/countries/$slug")({
	loader: ({ params }) => {
		const country = countries.find((c) => c.slug === params.slug);
		if (!country) throw notFound();
		return { country };
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.country.name} Visa & Study · British Education and Immigration` }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./updates.index-CK37J1rG.mjs");
var Route$4 = createFileRoute("/updates/")({
	loader: () => getPublicContent(),
	head: () => ({ meta: [{ title: "Visa News & Blog · British Education and Immigration" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./updates._slug-DGXmzugH.mjs");
var Route$3 = createFileRoute("/updates/$slug")({
	loader: async ({ params }) => {
		const { posts } = await getPublicContent();
		const post = posts.find((p) => p.slug === params.slug);
		if (!post) throw notFound();
		return {
			post,
			posts
		};
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.post.title} · British Education and Immigration` }, {
		name: "description",
		content: loaderData?.post.excerpt
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$2 = createFileRoute("/admin/oauth/callback")({ server: { handlers: { GET: async () => {
	return new Response(null, {
		status: 302,
		headers: { Location: "/admin" }
	});
} } } });
var Route$1 = createFileRoute("/admin/oauth/logout")({ server: { handlers: {
	GET: async () => {
		const headers = new Headers({ Location: "/admin" });
		headers.append("Set-Cookie", "webdev_app_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/");
		headers.append("Set-Cookie", "bei_admin_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/");
		return new Response(null, {
			status: 302,
			headers
		});
	},
	POST: async () => {
		const headers = new Headers({
			"Content-Type": "application/json",
			"Set-Cookie": "bei_admin_session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/"
		});
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers
		});
	}
} } });
var Route = createFileRoute("/admin/oauth/start")({ server: { handlers: {
	GET: async () => {
		return new Response(null, {
			status: 302,
			headers: { Location: "/admin" }
		});
	},
	POST: async ({ request }) => {
		try {
			const body = await request.json();
			const action = String(body.action || "login");
			if (action === "forgot") {
				const email = String(body.email || "");
				const recoveryKey = String(body.recoveryKey || "");
				const newPassword = String(body.newPassword || "");
				const result = await resetAdminPassword(email, recoveryKey, newPassword);
				return new Response(JSON.stringify(result), {
					status: result.ok ? 200 : 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			if (action === "change") {
				const user = await getSessionUser(request.headers);
				if (!user) return new Response(JSON.stringify({
					ok: false,
					error: "Unauthorized"
				}), {
					status: 401,
					headers: { "Content-Type": "application/json" }
				});
				const oldPassword = String(body.oldPassword || "");
				const newPassword = String(body.newPassword || "");
				const result = await changeAdminPassword(user, oldPassword, newPassword);
				return new Response(JSON.stringify(result), {
					status: result.ok ? 200 : 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			const identifier = String(body.identifier || "");
			const password = String(body.password || "");
			const result = await loginAdmin(identifier, password);
			if (!result.ok || !result.token) return new Response(JSON.stringify({
				ok: false,
				error: result.error || "Invalid credentials"
			}), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const headers = new Headers({
				"Content-Type": "application/json",
				"Set-Cookie": `bei_admin_session=${result.token}; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/`
			});
			return new Response(JSON.stringify({
				ok: true,
				user: result.user
			}), {
				status: 200,
				headers
			});
		} catch (cause) {
			const message = cause instanceof Error ? cause.message : "Server error occurred";
			return new Response(JSON.stringify({
				ok: false,
				error: message
			}), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AdminRoute = Route$12.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$14
});
var CoachingRoute = Route$11.update({
	id: "/coaching",
	path: "/coaching",
	getParentRoute: () => Route$14
});
var ContactRoute = Route$10.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$14
});
var EligibilityRoute = Route$9.update({
	id: "/eligibility",
	path: "/eligibility",
	getParentRoute: () => Route$14
});
var SuccessStoriesRoute = Route$8.update({
	id: "/success-stories",
	path: "/success-stories",
	getParentRoute: () => Route$14
});
var VisasRoute = Route$7.update({
	id: "/visas",
	path: "/visas",
	getParentRoute: () => Route$14
});
var CountriesIndexRoute = Route$6.update({
	id: "/countries/",
	path: "/countries/",
	getParentRoute: () => Route$14
});
var CountriesSlugRoute = Route$5.update({
	id: "/countries/$slug",
	path: "/countries/$slug",
	getParentRoute: () => Route$14
});
var UpdatesIndexRoute = Route$4.update({
	id: "/updates/",
	path: "/updates/",
	getParentRoute: () => Route$14
});
var UpdatesSlugRoute = Route$3.update({
	id: "/updates/$slug",
	path: "/updates/$slug",
	getParentRoute: () => Route$14
});
var AdminRouteChildren = {
	AdminOauthCallbackRoute: Route$2.update({
		id: "/oauth/callback",
		path: "/oauth/callback",
		getParentRoute: () => AdminRoute
	}),
	AdminOauthLogoutRoute: Route$1.update({
		id: "/oauth/logout",
		path: "/oauth/logout",
		getParentRoute: () => AdminRoute
	}),
	AdminOauthStartRoute: Route.update({
		id: "/oauth/start",
		path: "/oauth/start",
		getParentRoute: () => AdminRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	CoachingRoute,
	ContactRoute,
	EligibilityRoute,
	SuccessStoriesRoute,
	VisasRoute,
	CountriesSlugRoute,
	UpdatesSlugRoute,
	CountriesIndexRoute,
	UpdatesIndexRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent"
	});
}
export { CountryFlag, EnquiryForm, Facebook, Instagram, Route$10, Route$11, Route$13, Route$3, Route$4, Route$5, Route$8, cn, createSsrRpc, img, router_exports, site };
