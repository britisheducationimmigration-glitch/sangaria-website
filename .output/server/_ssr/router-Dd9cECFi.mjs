import { __toESM } from "../_runtime.mjs";
import { HeadContent, Link, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent, notFound, require_jsx_runtime, require_react, useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { __exportAll, changeAdminPassword, countries, defaultSiteSettings, ensureAdminRecord, getAdminRole, getSessionUser, loginAdmin, navLinks, posts, queryRows, resetAdminPassword, sendResetOtp, site, verifyOtpAndResetPassword, visaServices } from "./site-settings-DNyZ2OvY.mjs";
import { getCoachingContent, getPublicContent, submitEnquiry } from "./public-functions-CqsoBxoJ.mjs";
import { clsx } from "../_libs/clsx.mjs";
import { twMerge } from "../_libs/tailwind-merge.mjs";
import { Analytics } from "../_libs/vercel__analytics.mjs";
import { SpeedInsights } from "../_libs/vercel__speed-insights.mjs";
import { CircleCheck, GraduationCap, LoaderCircle, Mail, MapPin, Menu, MessageCircle, Phone, Send, X } from "../_libs/lucide-react.mjs";
import { Buffer as Buffer$1 } from "node:buffer";
// node_modules/.nitro/vite/services/ssr/assets/utils-Con6ahih.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** Public asset path. Keep this provider-neutral so images work on Preview and any host. */
function img(path, _w, _h) {
	return path;
}
// node_modules/.nitro/vite/services/ssr/assets/seo-AbIoUftx.js
var siteOrigin = "https://britisheducationandimmigration.com";
function createPageSeo({ title, description, path, type = "website" }) {
	const canonicalUrl = `${siteOrigin}${path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`}`;
	const uniqueDescription = description.replace(/\s+/g, " ").trim().slice(0, 160);
	return {
		meta: [
			{ title },
			{
				name: "description",
				content: uniqueDescription
			},
			{
				name: "robots",
				content: "index,follow"
			},
			{
				property: "og:type",
				content: type
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: uniqueDescription
			},
			{
				property: "og:url",
				content: canonicalUrl
			},
			{
				name: "twitter:title",
				content: title
			},
			{
				name: "twitter:description",
				content: uniqueDescription
			}
		],
		links: [{
			rel: "canonical",
			href: canonicalUrl
		}]
	};
}
// node_modules/.nitro/vite/services/ssr/assets/router-Dd9cECFi.js
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
	if (lower.includes("canad") || lower === "ca") return "CA";
	if (lower.includes("uk") || lower.includes("brit") || lower.includes("kingdom") || lower.includes("england")) return "UK";
	if (lower.includes("aus")) return "AU";
	if (lower.includes("usa") || lower.includes("united states") || lower.includes("america") || lower === "us") return "US";
	if (lower.includes("zeal") || lower === "nz") return "NZ";
	if (lower.includes("germ") || lower.includes("deutsch") || lower === "de") return "DE";
	if (lower.includes("eur") || lower.includes("schen") || lower === "eu") return "EU";
	if (lower.includes("ind")) return "IN";
	if (lower.includes("fran") || lower.includes("ital")) return "EU";
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
function SiteFooter({ settings }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "bg-forest-950 bg-grain text-forest-100",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-5 pt-12 pb-8 md:px-6 md:pt-20 md:pb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10 flex flex-col items-start justify-between gap-5 border-b border-white/10 pb-10 md:mb-16 md:gap-8 md:pb-16 md:flex-row md:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "max-w-2xl text-3xl font-extrabold leading-tight text-white md:text-6xl",
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
					className: "grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-[1.4fr_1fr_1fr_1.3fr] md:gap-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 md:col-span-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { light: true }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 max-w-xs text-sm leading-relaxed text-forest-100/70",
									children: site.tagline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex gap-3 md:mt-6",
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
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-xs font-bold uppercase tracking-[0.2em] text-coral-400 md:mb-4",
							children: "Explore"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-1.5 text-xs md:space-y-2.5 md:text-sm",
							children: [navLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: l.to,
								className: "block py-1 transition-colors hover:text-white md:py-0",
								children: l.label
							}) }, l.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/certificates",
								className: "block py-1 transition-colors hover:text-white md:py-0",
								children: "Certificates & partnerships"
							}) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-xs font-bold uppercase tracking-[0.2em] text-coral-400 md:mb-4",
							children: "Destinations"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5 text-xs md:space-y-2.5 md:text-sm",
							children: countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/countries/$slug",
								params: { slug: c.slug },
								className: "flex min-h-8 items-center py-1 transition-colors hover:text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
									flag: c.flag,
									code: c.code,
									country: c.name,
									className: "mr-2.5 h-3.5 w-5 shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name })]
							}) }, c.slug))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 md:col-span-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-3 text-xs font-bold uppercase tracking-[0.2em] text-coral-400 md:mb-4",
									children: "Visit our office"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex gap-3 text-xs leading-relaxed md:text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0 text-coral-400" }), site.address]
								}),
								settings.phones.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${p.startsWith("+") ? p : "+91" + p}`,
									className: "mt-2 flex min-h-8 items-center gap-3 text-xs transition-colors hover:text-white md:mt-3 md:text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4 text-coral-400" }),
										" ",
										p.startsWith("+") ? p : "+91 " + p
									]
								}, p)),
								settings.emails.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
									target: "_blank",
									rel: "noreferrer",
									className: "mt-2 flex min-h-8 items-start gap-3 break-all text-xs transition-colors hover:text-white md:mt-3 md:text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mt-0.5 size-4 shrink-0 text-coral-400" }),
										" ",
										email
									]
								}, email)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-forest-100/60 md:mt-3 md:text-sm",
									children: settings.officeHours
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-10 border-t border-white/10 pt-5 text-[10px] leading-relaxed text-forest-100/50 md:mt-16 md:pt-6 md:text-xs",
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
var headerLinks = [...navLinks, {
	to: "/certificates",
	label: "Certificates"
}];
function SiteHeader({ settings }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const headerRef = (0, import_react.useRef)(null);
	const [headerHeight, setHeaderHeight] = (0, import_react.useState)(69);
	(0, import_react.useEffect)(() => {
		const header = headerRef.current;
		if (!header) return;
		const updateHeight = () => setHeaderHeight(header.offsetHeight);
		updateHeight();
		const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateHeight);
		observer?.observe(header);
		window.addEventListener("resize", updateHeight);
		return () => {
			observer?.disconnect();
			window.removeEventListener("resize", updateHeight);
		};
	}, [
		open,
		settings.officeHours,
		settings.phones
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: { height: `${headerHeight}px` },
		"aria-hidden": "true"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		id: "site-main-header",
		ref: headerRef,
		className: "fixed top-0 left-0 right-0 z-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden bg-forest-950 text-[13px] text-forest-100 md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📍 Sangaria, Hanumangarh · ", settings.officeHours] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex gap-5",
					children: settings.phones.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `tel:${p.startsWith("+") ? p : "+91" + p}`,
						className: "hover:text-coral-400",
						children: p.startsWith("+") ? p : "+91 " + p
					}, p))
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-forest-900/10 bg-cream/95 backdrop-blur-xl shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3.5 sm:gap-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						onClick: () => setOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-1 xl:flex",
						children: headerLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
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
								href: `tel:${settings.phones[0].startsWith("+") ? settings.phones[0] : "+91" + settings.phones[0]}`,
								className: "group grid size-10 shrink-0 place-items-center rounded-full border border-forest-900/15 text-forest-900 transition-colors hover:border-coral-500 hover:bg-coral-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 active:bg-coral-600 sm:size-11",
								"aria-label": "Call us",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4 text-forest-900 transition-colors group-hover:text-white group-focus-visible:text-white group-active:text-white" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								className: "shrink-0 rounded-full bg-coral-500 px-3 py-2 text-xs font-bold text-white shadow-[3px_3px_0_0] shadow-forest-950 transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0] sm:px-5 sm:py-2.5 sm:text-sm",
								children: "Free Enquiry"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "grid size-10 shrink-0 place-items-center rounded-full bg-forest-900 text-white xl:hidden sm:size-11",
								onClick: () => setOpen((v) => !v),
								"aria-label": "Menu",
								"aria-expanded": open,
								"aria-controls": "mobile-site-nav",
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})
						]
					})
				]
			}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				id: "mobile-site-nav",
				className: "grid gap-1 border-t border-forest-900/10 bg-cream px-6 py-4 shadow-xl xl:hidden",
				children: [headerLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
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
	})] });
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
		className: "fixed right-5 bottom-20 sm:bottom-5 z-40 hidden sm:flex items-center gap-2 rounded-full bg-[#25D366] py-3.5 pr-5 pl-4 font-bold text-white shadow-xl shadow-black/20 transition hover:scale-105 cursor-pointer",
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
	const [whatsappUrl, setWhatsappUrl] = (0, import_react.useState)("");
	const [showSharePrompt, setShowSharePrompt] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (state !== "done" || !showSharePrompt) return;
		const handleKeyDown = (event) => {
			if (event.key === "Escape") setShowSharePrompt(false);
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [state, showSharePrompt]);
	async function onSubmit(e) {
		e.preventDefault();
		setState("sending");
		const data = new FormData(e.currentTarget);
		const name = String(data.get("name") ?? "").trim();
		const phone = String(data.get("phone") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const city = String(data.get("city") ?? "").trim();
		const interest = String(data.get("interest") ?? "").trim();
		const country = String(data.get("country") ?? "").trim();
		const message = String(data.get("message") ?? "").trim();
		const preferredDemoDate = source === "coaching" ? String(data.get("preferredDemoDate") ?? "").trim() : "";
		const preferredDemoTime = source === "coaching" ? String(data.get("preferredDemoTime") ?? "").trim() : "";
		const enquirySummary = [
			summary ?? "",
			preferredDemoDate ? "Preferred demo date: " + preferredDemoDate : "",
			preferredDemoTime ? "Preferred demo time: " + preferredDemoTime : ""
		].filter(Boolean).join("\n");
		const textLines = [
			"🎓 *New Website Enquiry - British Education & Immigration*",
			"",
			`👤 *Name:* ${name || "N/A"}`,
			`📞 *Phone:* ${phone || "N/A"}`,
			email ? `📧 *Email:* ${email}` : "",
			city ? `📍 *City:* ${city}` : "",
			interest ? `🎯 *Interest:* ${interest}` : "",
			country ? `🌍 *Preferred Country:* ${country}` : "",
			message ? `💬 *Message:* ${message}` : "",
			enquirySummary ? `📋 *Details:* ${enquirySummary}` : "",
			"",
			"Please guide me further. Thank you!"
		].filter(Boolean).join("\n");
		const waUrl = `https://wa.me/919772570478?text=${encodeURIComponent(textLines)}`;
		setWhatsappUrl(waUrl);
		try {
			await submitEnquiry({ data: {
				name,
				phone,
				email,
				city,
				interest,
				country,
				message,
				source,
				summary: enquirySummary
			} });
			setState("done");
			setShowSharePrompt(true);
		} catch {
			setState("error");
		}
	}
	if (state === "done") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-3xl p-8 sm:p-10 text-center", dark ? "bg-white/10 text-white" : "bg-forest-50 text-forest-900"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto size-14 text-emerald-500" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-2xl font-extrabold",
				children: "Enquiry Submitted!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-2 text-sm leading-relaxed max-w-md mx-auto", dark ? "text-forest-100/80" : "text-forest-900/70"),
				children: "Your details are saved. Our team will contact you soon."
			})
		]
	}), showSharePrompt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] grid place-items-center bg-forest-950/70 p-4 backdrop-blur-sm",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": `${source}-enquiry-confirmation-title`,
		"aria-describedby": `${source}-enquiry-confirmation-description`,
		onKeyDown: (event) => {
			if (event.key === "Escape") setShowSharePrompt(false);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl bg-white p-6 text-center text-forest-900 shadow-2xl sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto size-12 text-emerald-600" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					id: `${source}-enquiry-confirmation-title`,
					className: "mt-4 text-2xl font-extrabold",
					children: "Enquiry submitted successfully"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: `${source}-enquiry-confirmation-description`,
					className: "mt-2 text-sm leading-relaxed text-forest-900/70",
					children: "Your details are saved. Would you also like to share this pre-filled enquiry with us on WhatsApp?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatsappUrl,
						target: "_blank",
						rel: "noreferrer",
						onClick: () => {
							setShowSharePrompt(false);
							onSuccess?.();
						},
						className: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900 active:scale-[0.98]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-5" }), "Share on WhatsApp"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setShowSharePrompt(false);
							onSuccess?.();
						},
						className: "min-h-12 rounded-full border border-forest-900/15 bg-forest-50 px-5 py-3 text-sm font-bold text-forest-900 transition hover:bg-forest-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900 active:scale-[0.98]",
						children: "No thanks"
					})]
				})
			]
		})
	})] });
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
			source === "coaching" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: cn("rounded-2xl border p-4", dark ? "border-white/15 bg-white/5" : "border-forest-900/10 bg-forest-50"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: cn("px-1 text-sm font-bold", dark ? "text-white" : "text-forest-900"),
						children: "Preferred free demo slot"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mb-3 text-xs", dark ? "text-forest-100/70" : "text-forest-900/60"),
						children: "Choose a date and time window. Our team will confirm availability."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("grid gap-3", !compact && "sm:grid-cols-2"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: labelCls,
							htmlFor: `${source}-demo-date`,
							children: "Preferred date (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: `${source}-demo-date`,
							name: "preferredDemoDate",
							type: "date",
							min: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
							className: "field"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: labelCls,
							htmlFor: `${source}-demo-time`,
							children: "Time window"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: `${source}-demo-time`,
							name: "preferredDemoTime",
							defaultValue: "Flexible",
							className: "field",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Flexible" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "9:30 AM – 12:30 PM" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "4:00 PM – 7:30 PM" })
							]
						})] })]
					})
				]
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
				children: [state === "sending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4 transition group-hover:translate-x-1" }), state === "sending" ? "Sending…" : source === "coaching" ? "Request demo class" : "Send enquiry"]
			})
		]
	});
}
var POPUP_DONE_KEY = "bei-enquiry-popup-submitted";
var POPUP_DISMISSED_KEY = "bei-enquiry-popup-dismissed";
function hasInteractedWithPopup() {
	try {
		return window.sessionStorage.getItem(POPUP_DONE_KEY) === "1" || window.sessionStorage.getItem(POPUP_DISMISSED_KEY) === "1";
	} catch {
		return false;
	}
}
function markPopupSubmitted() {
	try {
		window.sessionStorage.setItem(POPUP_DONE_KEY, "1");
	} catch {}
}
function markPopupDismissed() {
	try {
		window.sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
	} catch {}
}
function EnquiryPopup() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const [enabled, setEnabled] = (0, import_react.useState)(true);
	const [delaySeconds, setDelaySeconds] = (0, import_react.useState)(8);
	const [interacted, setInteracted] = (0, import_react.useState)(() => hasInteractedWithPopup());
	const dialogRef = (0, import_react.useRef)(null);
	const closeButtonRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		getPublicContent().then((content) => {
			if (!active) return;
			setEnabled(content.settings.popupEnabled);
			setDelaySeconds(content.settings.popupDelaySeconds);
		}).catch(() => void 0);
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (interacted || !enabled || pathname.startsWith("/admin") || open) return;
		const safeDelay = Math.min(60, Math.max(3, Number(delaySeconds) || 8));
		const timer = window.setTimeout(() => setOpen(true), safeDelay * 1e3);
		return () => window.clearTimeout(timer);
	}, [
		interacted,
		enabled,
		delaySeconds,
		pathname,
		open
	]);
	const close = (0, import_react.useCallback)(() => {
		markPopupDismissed();
		setInteracted(true);
		setOpen(false);
	}, []);
	const handleSuccess = (0, import_react.useCallback)(() => {
		markPopupSubmitted();
		setInteracted(true);
		setOpen(false);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open || pathname.startsWith("/admin")) return;
		const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const previousBodyOverflow = document.body.style.overflow;
		const dialog = dialogRef.current;
		document.body.style.overflow = "hidden";
		closeButtonRef.current?.focus();
		const focusableElements = () => Array.from(dialog?.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])") ?? []).filter((element) => element.getClientRects().length > 0);
		function handleKeyDown(event) {
			if (event.key === "Escape") {
				event.preventDefault();
				close();
				return;
			}
			if (event.key !== "Tab") return;
			const focusable = focusableElements();
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (!first || !last) {
				event.preventDefault();
				dialog?.focus();
				return;
			}
			if (!dialog?.contains(document.activeElement)) {
				event.preventDefault();
				first.focus();
			} else if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = previousBodyOverflow;
			if (previouslyFocused?.isConnected) previouslyFocused.focus();
		};
	}, [
		open,
		close,
		pathname
	]);
	if (!open || pathname.startsWith("/admin") || interacted) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: dialogRef,
		className: "fixed inset-0 z-[60] grid place-items-center bg-forest-950/60 p-4 backdrop-blur-sm",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "enquiry-popup-title",
		"aria-describedby": "enquiry-popup-description",
		tabIndex: -1,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[1.5rem] bg-forest-900 p-5 text-white shadow-2xl sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					ref: closeButtonRef,
					type: "button",
					onClick: close,
					"aria-label": "Close enquiry form",
					className: "absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-coral-500/30 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.18em] text-coral-400",
					children: "Free profile evaluation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "enquiry-popup-title",
					className: "mt-3 pr-8 text-2xl font-extrabold sm:text-3xl",
					children: "Planning to study, work or settle abroad?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: "enquiry-popup-description",
					className: "mt-2 mb-6 text-sm text-forest-100/70",
					children: "Share your details and a counsellor will call within one working day."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, {
					source: "popup",
					dark: true,
					compact: true,
					onSuccess: handleSuccess
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
	alternateName: "British Education Sangaria",
	description: "Premier Study Visa Consultant & IELTS / PTE Coaching Institute in Sangaria, Hanumangarh, Rajasthan. Expert visa guidance for Canada, UK, Australia, USA, NZ & Europe.",
	url: "https://britisheducationandimmigration.com",
	logo: "https://britisheducationandimmigration.com/img/logo.png",
	image: "https://britisheducationandimmigration.com/img/hero.webp",
	telephone: ["+919772570478", "+919658018000"],
	email: "admin@britisheducationandimmigration.com",
	priceRange: "₹₹",
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
	areaServed: [
		{
			"@type": "City",
			name: "Sangaria"
		},
		{
			"@type": "City",
			name: "Hanumangarh"
		},
		{
			"@type": "City",
			name: "Sri Ganganagar"
		},
		{
			"@type": "City",
			name: "Mandi Dabwali"
		},
		{
			"@type": "State",
			name: "Rajasthan"
		},
		{
			"@type": "State",
			name: "Punjab"
		}
	],
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
		closes: "19:30"
	}
};
function businessTime(hour, minute, meridiem) {
	const value = Number(hour) % 12 + (meridiem.toUpperCase() === "PM" ? 12 : 0);
	return String(value).padStart(2, "0") + ":" + (minute || "00");
}
function schemaOpeningHours(label) {
	const match = label.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
	if (!match) return localBusinessSchema.openingHoursSpecification;
	return {
		...localBusinessSchema.openingHoursSpecification,
		opens: businessTime(match[1], match[2], match[3]),
		closes: businessTime(match[4], match[5], match[6])
	};
}
var Route$18 = createRootRoute({
	loader: async () => {
		try {
			return { settings: (await getPublicContent()).settings };
		} catch {
			return { settings: defaultSiteSettings };
		}
	},
	head: ({ loaderData }) => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "keywords",
				content: "study visa Sangaria, IELTS coaching Sangaria, PTE coaching Sangaria, immigration consultant Sangaria, Canada visa Hanumangarh, study abroad Rajasthan"
			},
			{
				name: "theme-color",
				content: "#123752"
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
				property: "og:image",
				content: "https://britisheducationandimmigration.com/img/hero.webp"
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
				name: "twitter:image",
				content: "https://britisheducationandimmigration.com/img/hero.webp"
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
				rel: "icon",
				href: "https://files.manuscdn.com/user_upload_by_module/session_file/310519664045228795/VqtFGwaGtbWyvcCS"
			},
			{
				rel: "apple-touch-icon",
				href: "https://files.manuscdn.com/user_upload_by_module/session_file/310519664045228795/VqtFGwaGtbWyvcCS"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Figtree:wght@400;600;700&display=swap"
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
			children: JSON.stringify({
				...localBusinessSchema,
				telephone: (loaderData?.settings.phones ?? defaultSiteSettings.phones).map((phone) => phone.startsWith("+") ? phone : "+91" + phone),
				email: (loaderData?.settings.emails ?? defaultSiteSettings.emails)[0],
				openingHoursSpecification: schemaOpeningHours(loaderData?.settings.officeHours ?? defaultSiteSettings.officeHours)
			})
		}]
	}),
	shellComponent: RootDocument,
	notFoundComponent: NotFound
});
function RootDocument({ children }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const isAdmin = pathname.startsWith("/admin");
	const { settings } = Route$18.useLoaderData();
	(0, import_react.useEffect)(() => {
		if (isAdmin || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
		const main = document.querySelector("main");
		if (!main) return;
		const sections = Array.from(main.querySelectorAll("section"));
		if (!sections.length) return;
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const section = entry.target;
				section.classList.add("is-scroll-visible");
				observer.unobserve(section);
			}
		}, { threshold: .01 });
		sections.forEach((section) => {
			section.classList.add("scroll-reveal");
			const rect = section.getBoundingClientRect();
			if (section.getClientRects().length > 0 && rect.top < window.innerHeight && rect.bottom > 0) section.classList.add("is-scroll-visible");
			else observer.observe(section);
			section.querySelectorAll(".grid > article, .grid > a").forEach((item, index) => {
				item.classList.add("scroll-reveal-item");
				item.style.setProperty("--scroll-reveal-order", String(Math.min(index, 5)));
			});
		});
		return () => {
			observer.disconnect();
			sections.forEach((section) => {
				section.classList.remove("scroll-reveal", "is-scroll-visible");
				section.querySelectorAll(".scroll-reveal-item").forEach((item) => {
					item.classList.remove("scroll-reveal-item");
					item.style.removeProperty("--scroll-reveal-order");
				});
			});
		};
	}, [isAdmin, pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { settings }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: isAdmin ? "admin-main" : "public-main",
				children
			}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, { settings }),
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
var $$splitComponentImporter$11 = () => import("./routes-sD7aONBO.mjs");
var Route$17 = createFileRoute("/")({
	loader: () => getPublicContent(),
	head: () => createPageSeo({
		title: "Study Visas & IELTS Coaching in Sangaria | British Education",
		description: "Get study visa guidance, IELTS/PTE coaching and free profile evaluation in Sangaria, Rajasthan. Compare destinations and explore next steps.",
		path: "/"
	}),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./admin-DejIoEfr.mjs");
var Route$16 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin · British Education and Immigration" }, {
		name: "robots",
		content: "noindex,nofollow,noarchive"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./certificates-_ZkLKbA_.mjs");
var Route$15 = createFileRoute("/certificates")({
	loader: () => getPublicContent(),
	head: () => createPageSeo({
		title: "Certificates & Partnerships | British Education Sangaria",
		description: "View our education partner authorisations, professional training and recognitions.",
		path: "/certificates"
	}),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./coaching-KQGt1trg.mjs");
var Route$14 = createFileRoute("/coaching")({
	head: () => createPageSeo({
		title: "IELTS & PTE Coaching in Sangaria | British Education",
		description: "Prepare for IELTS and PTE in small coaching batches in Sangaria. Check class timings, upcoming batches and book a free demo.",
		path: "/coaching"
	}),
	loader: () => getCoachingContent(),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./contact-Chi_gheS.mjs");
var Route$13 = createFileRoute("/contact")({
	validateSearch: (s) => ({ interest: typeof s.interest === "string" ? s.interest : void 0 }),
	head: () => createPageSeo({
		title: "Contact & Free Enquiry | British Education Sangaria",
		description: "Contact our Sangaria team for study visa counselling, IELTS/PTE coaching, PR guidance and a free profile evaluation.",
		path: "/contact"
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./eligibility-pwjbYXHW.mjs");
var Route$12 = createFileRoute("/eligibility")({
	head: () => createPageSeo({
		title: "Free Visa Profile Check | British Education Sangaria",
		description: "Take a quick preliminary visa profile check. Results are general guidance, not an immigration decision or approval guarantee.",
		path: "/eligibility"
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var siteUrl = "https://britisheducationandimmigration.com";
var staticPages = [
	[
		"/",
		"weekly",
		"1.0"
	],
	[
		"/countries",
		"weekly",
		"0.9"
	],
	[
		"/visas",
		"weekly",
		"0.9"
	],
	[
		"/eligibility",
		"monthly",
		"0.85"
	],
	[
		"/coaching",
		"weekly",
		"0.85"
	],
	[
		"/success-stories",
		"weekly",
		"0.8"
	],
	[
		"/certificates",
		"monthly",
		"0.6"
	],
	[
		"/updates",
		"weekly",
		"0.8"
	],
	[
		"/contact",
		"monthly",
		"0.7"
	]
];
function escapeXml(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}
function validSlug(value) {
	const slug = String(value ?? "");
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : "";
}
function dateOnly(value) {
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	const raw = String(value ?? "");
	if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
	const parsed = new Date(raw);
	return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}
var Route$11 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	let articleRows = [];
	try {
		articleRows = await queryRows("SELECT slug, updated_at FROM content_posts WHERE published = 1 ORDER BY publish_date DESC, id DESC");
	} catch {
		articleRows = [];
	}
	const articles = articleRows.length ? articleRows.map((row) => ({
		slug: row.slug,
		date: row.updated_at
	})) : posts.map((post) => ({
		slug: post.slug,
		date: post.date
	}));
	const entries = [...staticPages.map(([path, frequency, priority]) => ({
		path,
		frequency,
		priority
	})), ...countries.map((country) => ({
		path: "/countries/" + country.slug,
		frequency: "monthly",
		priority: "0.8"
	}))];
	const seen = new Set(entries.map((entry) => entry.path));
	for (const article of articles) {
		const slug = validSlug(article.slug);
		const path = slug ? "/updates/" + slug : "";
		if (!path || seen.has(path)) continue;
		seen.add(path);
		const lastmod = dateOnly(article.date);
		entries.push({
			path,
			frequency: "monthly",
			priority: "0.6",
			...lastmod ? { lastmod } : {}
		});
	}
	const body = [
		"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
		"<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
		...entries.map((entry) => [
			"  <url>",
			"    <loc>" + escapeXml(siteUrl + entry.path) + "</loc>",
			entry.lastmod ? "    <lastmod>" + escapeXml(entry.lastmod) + "</lastmod>" : "",
			"    <changefreq>" + entry.frequency + "</changefreq>",
			"    <priority>" + entry.priority + "</priority>",
			"  </url>"
		].filter(Boolean).join("\n")),
		"</urlset>"
	].join("\n");
	return new Response(body, { headers: {
		"Content-Type": "application/xml; charset=utf-8",
		"Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60"
	} });
} } } });
var $$splitComponentImporter$5 = () => import("./success-stories-CvbvAOmL.mjs");
var Route$10 = createFileRoute("/success-stories")({
	loader: () => getPublicContent(),
	head: () => createPageSeo({
		title: "Visa Success Stories | British Education Sangaria",
		description: "Read recent student and family visa stories from British Education and Immigration clients in Sangaria and nearby towns.",
		path: "/success-stories"
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./visas-DHDz47aP.mjs");
var Route$9 = createFileRoute("/visas")({
	head: () => createPageSeo({
		title: "Study, Visitor & Work Visa Services | British Education Sangaria",
		description: "Explore study, visitor, work and permanent residence guidance for Canada, the UK, Australia, New Zealand, the USA and Europe.",
		path: "/visas"
	}),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./countries.index-BGsrq2jg.mjs");
var Route$8 = createFileRoute("/countries/")({
	head: () => createPageSeo({
		title: "Study Destinations & Visa Fees | British Education Sangaria",
		description: "Compare study destinations, visa guidance, tuition ranges, living funds and intakes for international students.",
		path: "/countries"
	}),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./countries._slug-CPB5yQOj.mjs");
var Route$7 = createFileRoute("/countries/$slug")({
	loader: ({ params }) => {
		const country = countries.find((c) => c.slug === params.slug);
		if (!country) throw notFound();
		return { country };
	},
	head: ({ loaderData }) => {
		const isEuropeGuide = loaderData.country.slug === "europe";
		return createPageSeo({
			title: isEuropeGuide ? "Europe / Schengen Visitor Visa & Costs | British Education" : `${loaderData.country.name} Study Visa & Costs | British Education`,
			description: isEuropeGuide ? "Find Schengen short-stay visitor visa fees and guidance for tourism, family visits and business travel. For study plans, review the destination country’s study visa requirements." : `Review ${loaderData.country.name} visa fees, study costs, intakes and guidance from official sources. Get free counselling in Sangaria.`,
			path: `/countries/${loaderData.country.slug}`
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./updates.index-kTLEG19i.mjs");
var Route$6 = createFileRoute("/updates/")({
	loader: () => getPublicContent(),
	head: () => createPageSeo({
		title: "Visa & Study Abroad Updates | British Education Sangaria",
		description: "Browse visa policy updates, study abroad guides and IELTS/PTE articles from the British Education and Immigration team.",
		path: "/updates"
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./updates._slug-CF243IeS.mjs");
var Route$5 = createFileRoute("/updates/$slug")({
	loader: async ({ params }) => {
		const { posts } = await getPublicContent();
		const post = posts.find((p) => p.slug === params.slug);
		if (!post) throw notFound();
		return {
			post,
			posts
		};
	},
	head: ({ loaderData }) => createPageSeo({
		title: loaderData?.post ? `${loaderData.post.title} | British Education` : "Visa & Study Abroad Updates | British Education Sangaria",
		description: loaderData?.post?.excerpt || "Read visa policy updates and study abroad guidance from British Education and Immigration.",
		path: loaderData?.post?.slug ? `/updates/${loaderData.post.slug}` : "/updates",
		type: "article"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$4 = createFileRoute("/admin/oauth/callback")({ server: { handlers: { GET: async () => {
	return new Response(null, {
		status: 302,
		headers: { Location: "/admin" }
	});
} } } });
var Route$3 = createFileRoute("/admin/oauth/logout")({ server: { handlers: {
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
var Route$2 = createFileRoute("/admin/oauth/start")({ server: { handlers: {
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
			if (action === "send-otp") {
				const email = String(body.email || "").trim();
				const result = await sendResetOtp(email);
				return new Response(JSON.stringify(result), {
					status: result.ok ? 200 : 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			if (action === "verify-otp") {
				const email = String(body.email || "").trim();
				const otp = String(body.otp || "").trim();
				const newPassword = String(body.newPassword || "").trim();
				const result = await verifyOtpAndResetPassword(email, otp, newPassword);
				return new Response(JSON.stringify(result), {
					status: result.ok ? 200 : 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			if (action === "forgot") {
				const email = String(body.email || "").trim();
				const recoveryKey = String(body.recoveryKey || "").trim();
				const newPassword = String(body.newPassword || "").trim();
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
					error: "Unauthorized: Session expired"
				}), {
					status: 401,
					headers: { "Content-Type": "application/json" }
				});
				const oldPassword = String(body.oldPassword || "").trim();
				const newPassword = String(body.newPassword || "").trim();
				const result = await changeAdminPassword(user, oldPassword, newPassword);
				return new Response(JSON.stringify(result), {
					status: result.ok ? 200 : 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			const identifier = String(body.identifier || body.email || "").trim();
			const password = String(body.password || "").trim();
			const result = await loginAdmin(identifier, password);
			if (!result || !result.ok || !result.token) return new Response(JSON.stringify({
				ok: false,
				error: result?.error || "Invalid credentials"
			}), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const headers = new Headers({
				"Content-Type": "application/json",
				"Set-Cookie": `bei_admin_session=${result.token}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000; Path=/`
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
var Route$1 = createFileRoute("/certificates/image/$id")({ server: { handlers: { GET: async ({ request, params }) => {
	const id = Number(params.id);
	if (!Number.isSafeInteger(id) || id <= 0) return new Response("Not found", { status: 404 });
	try {
		const row = (await queryRows("SELECT image_data, image_mime_type, published FROM certificate_items WHERE id = ? LIMIT 1", [id]))[0];
		if (!row || !row.image_data) return new Response("Not found", { status: 404 });
		if (!Boolean(row.published)) {
			const user = await getSessionUser(request.headers);
			if (!(user && await ensureAdminRecord(user) && ["super_admin", "content_editor"].includes(await getAdminRole(user) || ""))) return new Response("Not found", { status: 404 });
		}
		const mimeType = [
			"image/webp",
			"image/jpeg",
			"image/png"
		].includes(String(row.image_mime_type)) ? String(row.image_mime_type) : "application/octet-stream";
		const bytes = Buffer.isBuffer(row.image_data) ? row.image_data : Buffer.from(row.image_data);
		const body = new ArrayBuffer(bytes.byteLength);
		new Uint8Array(body).set(bytes);
		return new Response(body, { headers: {
			"Content-Type": mimeType,
			"Cache-Control": Boolean(row.published) ? "public, max-age=31536000, immutable" : "private, no-store",
			"X-Content-Type-Options": "nosniff"
		} });
	} catch {
		return new Response("Not found", { status: 404 });
	}
} } } });
var Route = createFileRoute("/success-stories/media/$id")({ server: { handlers: { GET: async ({ request, params }) => {
	const id = Number(params.id);
	if (!Number.isSafeInteger(id) || id <= 0) return new Response("Not found", { status: 404 });
	try {
		const row = (await queryRows("SELECT photo_data, photo_mime_type, published, kind FROM success_stories WHERE id = ? LIMIT 1", [id]))[0];
		if (!row || row.kind !== "approval" || !row.photo_data) return new Response("Not found", { status: 404 });
		if (!Boolean(row.published)) {
			const user = await getSessionUser(request.headers);
			if (!(user && await ensureAdminRecord(user) && ["super_admin", "content_editor"].includes(await getAdminRole(user) || ""))) return new Response("Not found", { status: 404 });
		}
		const mimeType = [
			"image/webp",
			"image/jpeg",
			"image/png"
		].includes(String(row.photo_mime_type)) ? String(row.photo_mime_type) : "application/octet-stream";
		const bytes = Buffer$1.isBuffer(row.photo_data) ? row.photo_data : Buffer$1.from(row.photo_data);
		const body = new ArrayBuffer(bytes.byteLength);
		new Uint8Array(body).set(bytes);
		return new Response(body, { headers: {
			"Content-Type": mimeType,
			"Cache-Control": Boolean(row.published) ? "public, max-age=300, must-revalidate" : "private, no-store",
			"X-Content-Type-Options": "nosniff"
		} });
	} catch {
		return new Response("Not found", { status: 404 });
	}
} } } });
var IndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$18
});
var AdminRoute = Route$16.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$18
});
var CertificatesRoute = Route$15.update({
	id: "/certificates",
	path: "/certificates",
	getParentRoute: () => Route$18
});
var CoachingRoute = Route$14.update({
	id: "/coaching",
	path: "/coaching",
	getParentRoute: () => Route$18
});
var ContactRoute = Route$13.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$18
});
var EligibilityRoute = Route$12.update({
	id: "/eligibility",
	path: "/eligibility",
	getParentRoute: () => Route$18
});
var SitemapDotxmlRoute = Route$11.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$18
});
var SuccessStoriesRoute = Route$10.update({
	id: "/success-stories",
	path: "/success-stories",
	getParentRoute: () => Route$18
});
var VisasRoute = Route$9.update({
	id: "/visas",
	path: "/visas",
	getParentRoute: () => Route$18
});
var CountriesIndexRoute = Route$8.update({
	id: "/countries/",
	path: "/countries/",
	getParentRoute: () => Route$18
});
var CountriesSlugRoute = Route$7.update({
	id: "/countries/$slug",
	path: "/countries/$slug",
	getParentRoute: () => Route$18
});
var UpdatesIndexRoute = Route$6.update({
	id: "/updates/",
	path: "/updates/",
	getParentRoute: () => Route$18
});
var UpdatesSlugRoute = Route$5.update({
	id: "/updates/$slug",
	path: "/updates/$slug",
	getParentRoute: () => Route$18
});
var AdminOauthCallbackRoute = Route$4.update({
	id: "/oauth/callback",
	path: "/oauth/callback",
	getParentRoute: () => AdminRoute
});
var AdminOauthLogoutRoute = Route$3.update({
	id: "/oauth/logout",
	path: "/oauth/logout",
	getParentRoute: () => AdminRoute
});
var AdminOauthStartRoute = Route$2.update({
	id: "/oauth/start",
	path: "/oauth/start",
	getParentRoute: () => AdminRoute
});
var CertificatesImageIdRoute = Route$1.update({
	id: "/image/$id",
	path: "/image/$id",
	getParentRoute: () => CertificatesRoute
});
var SuccessStoriesMediaIdRoute = Route.update({
	id: "/media/$id",
	path: "/media/$id",
	getParentRoute: () => SuccessStoriesRoute
});
var AdminRouteChildren = {
	AdminOauthCallbackRoute,
	AdminOauthLogoutRoute,
	AdminOauthStartRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var CertificatesRouteChildren = { CertificatesImageIdRoute };
var CertificatesRouteWithChildren = CertificatesRoute._addFileChildren(CertificatesRouteChildren);
var SuccessStoriesRouteChildren = { SuccessStoriesMediaIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRouteWithChildren,
	CertificatesRoute: CertificatesRouteWithChildren,
	CoachingRoute,
	ContactRoute,
	EligibilityRoute,
	SitemapDotxmlRoute,
	SuccessStoriesRoute: SuccessStoriesRoute._addFileChildren(SuccessStoriesRouteChildren),
	VisasRoute,
	CountriesSlugRoute,
	UpdatesSlugRoute,
	CountriesIndexRoute,
	UpdatesIndexRoute
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultStaleReloadMode: "blocking"
	});
}
export { CountryFlag, EnquiryForm, Facebook, Instagram, Route$10, Route$13, Route$14, Route$15, Route$17, Route$18, Route$5, Route$6, Route$7, cn, img, router_exports };
