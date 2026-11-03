import { __toESM } from "../_runtime.mjs";
import { require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { ExternalLink } from "../_libs/lucide-react.mjs";
import { Route$15 } from "./router-Dd9cECFi.mjs";
import { PageHero } from "./Section-D80DXzE3.mjs";
// node_modules/.nitro/vite/services/ssr/assets/certificates-_ZkLKbA_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CertificatesPage() {
	const { certificates } = Route$15.useLoaderData();
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("All");
	const categories = Array.from(new Set(certificates.filter((item) => item.published).map((item) => item.category))).sort();
	const visibleCertificates = certificates.filter((item) => item.published && (activeCategory === "All" || item.category === activeCategory)).sort((a, b) => a.sortOrder - b.sortOrder);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "Our credentials",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Partnerships, training & ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-coral-400",
			children: "recognition."
		})] }),
		intro: "Explore the partner authorisations, professional training and recognitions that support our work. Tap any image to open it at full size."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16",
		"aria-label": "Certificates and recognitions",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex flex-wrap gap-2",
				"aria-label": "Filter certificates",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": activeCategory === "All",
					onClick: () => setActiveCategory("All"),
					className: "min-h-11 rounded-full border px-4 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 " + (activeCategory === "All" ? "border-forest-900 bg-forest-900 text-white" : "border-forest-900/15 bg-white text-forest-900 hover:bg-forest-50"),
					children: "All credentials"
				}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": activeCategory === category,
					onClick: () => setActiveCategory(category),
					className: "min-h-11 rounded-full border px-4 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 " + (activeCategory === category ? "border-forest-900 bg-forest-900 text-white" : "border-forest-900/15 bg-white text-forest-900 hover:bg-forest-50"),
					children: category
				}, category))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: visibleCertificates.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "overflow-hidden rounded-3xl bg-white p-4 ring-1 ring-forest-900/10 transition hover:shadow-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.imageSrc,
						target: "_blank",
						rel: "noreferrer",
						"aria-label": "Open full size image: " + item.title,
						className: "group block rounded-2xl bg-cream p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid aspect-[3/4] w-full min-h-0 place-items-center overflow-hidden rounded-xl bg-white sm:aspect-[4/3]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.imageSrc,
								alt: item.altText,
								loading: "lazy",
								decoding: "async",
								className: "certificate-image-enhanced block h-full w-full min-h-0 min-w-0 object-contain"
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-32 flex-col px-1 pb-1 pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold uppercase tracking-[0.14em] text-coral-600",
								children: item.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-lg font-extrabold leading-snug text-forest-900",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-forest-900/60",
								children: item.issuer
							}),
							item.credentialDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-forest-900/50",
								children: item.credentialDate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: item.imageSrc,
								target: "_blank",
								rel: "noreferrer",
								className: "mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-xs font-bold text-coral-600 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
								children: ["View full size ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
									"aria-hidden": "true",
									className: "size-3.5"
								})]
							})
						]
					})]
				}, item.id))
			}),
			visibleCertificates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-cream p-8 text-center text-sm text-forest-900/60",
				children: "No credentials in this category yet."
			})
		]
	})] });
}
export { CertificatesPage as component };
