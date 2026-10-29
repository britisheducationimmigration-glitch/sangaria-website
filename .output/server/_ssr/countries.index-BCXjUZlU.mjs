import { Link, require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { ArrowRight } from "../_libs/lucide-react.mjs";
import { countries } from "./db.server-CEhaHsNY.mjs";
import { CountryFlag } from "./router-BZ0FCmGH.mjs";
import { PageHero } from "./Section-D80DXzE3.mjs";
// node_modules/.nitro/vite/services/ssr/assets/countries.index-BCXjUZlU.js
var import_jsx_runtime = require_jsx_runtime();
function CountriesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "Destinations",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Seven destinations. ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-coral-500",
				children: "One team"
			}),
			" that knows them all."
		] }),
		intro: "Compare post-study work rights, costs and intakes — then let us build the strongest possible file for the country you choose."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto mt-8 max-w-7xl px-6 pb-24 md:mt-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 md:grid-cols-2",
			children: countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/countries/$slug",
				params: { slug: c.slug },
				className: "group grid overflow-hidden rounded-3xl bg-white ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0] hover:shadow-forest-900 sm:grid-cols-[1fr_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
							code: c.code,
							flag: c.flag,
							country: c.name,
							className: "h-10 w-14 shrink-0 shadow-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-5 text-3xl font-extrabold text-forest-900",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-forest-900/65",
							children: c.headline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex flex-wrap gap-2",
							children: c.visas.slice(0, 4).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700",
								children: v
							}, v))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-row justify-between gap-4 border-t-2 border-dashed border-forest-900/10 bg-cream p-6 sm:w-48 sm:flex-col sm:border-t-0 sm:border-l-2",
					children: [c.stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-forest-900/50",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-bold text-forest-900",
						children: s.value
					})] }, s.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "hidden size-6 text-coral-500 transition group-hover:translate-x-1 sm:block" })]
				})]
			}, c.slug))
		})
	})] });
}
export { CountriesPage as component };
