import { Link, require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { Check } from "../_libs/lucide-react.mjs";
import { countries, visaServices } from "./db.server-CEhaHsNY.mjs";
import { CountryFlag } from "./router-DnGTvCwZ.mjs";
import { PageHero } from "./Section-D80DXzE3.mjs";
import { ServiceIcon } from "./ServiceIcon-Bq0xIDoz.mjs";
// node_modules/.nitro/vite/services/ssr/assets/visas-Uuoz0jBg.js
var import_jsx_runtime = require_jsx_runtime();
function VisasPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: "Visa services",
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Study, visit, work or ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-coral-500",
					children: "settle"
				}),
				" — we file it right."
			] }),
			intro: "Every application is prepared by an experienced counsellor, double-checked, and tracked until the decision.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 flex flex-wrap gap-2",
				children: visaServices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `#${s.slug}`,
					className: "rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-forest-900",
					children: s.title
				}, s.slug))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl space-y-6 px-6 py-20",
			children: visaServices.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				id: s.slug,
				className: "grid scroll-mt-32 gap-8 rounded-[2rem] bg-white p-8 ring-1 ring-forest-900/10 md:grid-cols-[auto_1fr_1fr] md:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-16 place-items-center rounded-2xl " + (i % 2 ? "bg-forest-900 text-white" : "bg-coral-500 text-white"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceIcon, {
							name: s.icon,
							className: "size-7"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-extrabold text-forest-900",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-lg text-forest-900/70",
							children: s.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/contact",
							search: { interest: s.title },
							className: "mt-6 inline-flex rounded-full bg-forest-900 px-6 py-3 text-sm font-bold text-white hover:bg-forest-700",
							children: [
								"Enquire about ",
								s.title.toLowerCase(),
								" →"
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid content-start gap-3",
						children: s.points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-xl bg-cream px-4 py-3 font-medium text-forest-900",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-coral-500" }),
								" ",
								p
							]
						}, p))
					})
				]
			}, s.slug))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-sand/60 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-6",
				children: countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/countries/$slug",
					params: { slug: c.slug },
					className: "inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 font-display font-bold text-forest-900 ring-1 ring-forest-900/10 hover:bg-forest-900 hover:text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
						flag: c.flag,
						code: c.code,
						country: c.name,
						className: "h-4 w-6 shrink-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name })]
				}, c.slug))
			})
		})
	] });
}
export { VisasPage as component };
