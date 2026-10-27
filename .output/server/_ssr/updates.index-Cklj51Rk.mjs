import { __toESM } from "../_runtime.mjs";
import { require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { Route$4, cn } from "./router-BDXX3wob.mjs";
import { PageHero } from "./Section-D80DXzE3.mjs";
import { PostCard } from "./Cards-CiTVj0NG.mjs";
// node_modules/.nitro/vite/services/ssr/assets/updates.index-Cklj51Rk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var categories = [
	"All",
	"Visa News",
	"Study Abroad",
	"IELTS & PTE",
	"Immigration"
];
function UpdatesPage() {
	const { posts } = Route$4.useLoaderData();
	const [cat, setCat] = (0, import_react.useState)("All");
	const shown = cat === "All" ? posts : posts.filter((p) => p.category === cat);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "News & Blog",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Visa rules change. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-coral-500",
			children: "We keep you posted."
		})] }),
		intro: "Policy updates, study-abroad guides and IELTS/PTE tips from our counsellors."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-6 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCat(c),
					className: cn("rounded-full px-4 py-2 text-sm font-bold transition", cat === c ? "bg-coral-500 text-white" : "bg-white text-forest-900 ring-1 ring-forest-900/10 hover:ring-forest-900"),
					children: c
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
				children: shown.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, { p }, p.slug))
			}),
			shown.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-forest-900/60",
				children: "No articles in this category yet."
			})
		]
	})] });
}
export { UpdatesPage as component };
