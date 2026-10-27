import { Link, require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { Quote, Star } from "../_libs/lucide-react.mjs";
import { CountryFlag, cn } from "./router-DkOd6TGA.mjs";
// node_modules/.nitro/vite/services/ssr/assets/Cards-shUlojPa.js
var import_jsx_runtime = require_jsx_runtime();
function formatDate(d) {
	return (/* @__PURE__ */ new Date(`${d}T12:00:00Z`)).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "Asia/Kolkata"
	});
}
function ApprovalCard({ a, i = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border-2 border-dashed border-forest-900/20 bg-white p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
					flag: a.flag,
					country: a.country,
					className: "h-7 w-10 shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("rounded-md border-2 px-2 py-1 font-mono text-[10px] font-bold tracking-widest uppercase", i % 2 ? "border-forest-600 text-forest-600 rotate-[6deg]" : "border-coral-500 text-coral-600 rotate-[-8deg]"),
					children: "Approved"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-lg font-bold text-forest-900",
				children: a.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-forest-900/70",
				children: [
					a.country,
					" · ",
					a.visa
				]
			}),
			a.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-forest-900/50",
				children: a.note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 border-t border-forest-900/10 pt-3 font-mono text-[11px] text-forest-900/50",
				children: formatDate(a.date)
			})
		]
	});
}
function TestimonialCard({ t, featured }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: cn("flex h-full flex-col rounded-3xl p-7", featured ? "bg-coral-500 text-white" : "bg-white text-forest-900 ring-1 ring-forest-900/10"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: cn("size-8", featured ? "text-white/60" : "text-coral-500") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
				className: "mt-4 flex-1 text-[16.5px] leading-relaxed",
				children: [
					"“",
					t.quote,
					"”"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex gap-0.5",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-amber-400 text-amber-400" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: "mt-5 border-t border-forest-900/10 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display font-bold",
					children: t.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("text-xs", featured ? "text-white/70" : "text-forest-900/60"),
					children: [
						t.city,
						" · ",
						t.country,
						" (",
						t.visa,
						")"
					]
				})]
			})
		]
	});
}
function PostCard({ p }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex flex-col rounded-3xl bg-white p-7 ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:shadow-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs text-forest-900/50 font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-forest-50 px-3 py-1 font-bold text-forest-700",
					children: p.category
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.readMins, " min read"] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 font-display text-xl font-bold text-forest-900 group-hover:text-coral-600 transition",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/updates/$slug",
					params: { slug: p.slug },
					children: p.title
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 flex-1 text-sm text-forest-900/70 leading-relaxed",
				children: p.excerpt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center justify-between border-t border-forest-900/10 pt-4 text-xs text-forest-900/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(p.date) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-bold text-coral-600 group-hover:translate-x-1 transition",
					children: "Read article →"
				})]
			})
		]
	});
}
export { ApprovalCard, PostCard, TestimonialCard, formatDate };
