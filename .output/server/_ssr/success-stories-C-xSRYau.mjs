import { __toESM } from "../_runtime.mjs";
import { require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { Route$8, cn, img } from "./router-DkOd6TGA.mjs";
import { Eyebrow, PageHero } from "./Section-D80DXzE3.mjs";
import { ApprovalCard, TestimonialCard } from "./Cards-shUlojPa.mjs";
// node_modules/.nitro/vite/services/ssr/assets/success-stories-C-xSRYau.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuccessPage() {
	const { approvals, testimonials } = Route$8.useLoaderData();
	const all = ["All", ...Array.from(new Set(approvals.map((a) => a.country)))];
	const [filter, setFilter] = (0, import_react.useState)("All");
	const shown = filter === "All" ? approvals : approvals.filter((a) => a.country === filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: "Success stories",
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Stamped, approved, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-coral-500",
				children: "on their way."
			})] }),
			intro: "Every week, students and families from Sangaria, Hanumangarh and nearby towns receive their visas with us. Here are some of the latest."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-between gap-6 md:flex-row md:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Visa approvals" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-4xl font-extrabold text-forest-900",
					children: "Recent approvals"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: all.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFilter(c),
						className: cn("rounded-full px-4 py-2 text-sm font-bold transition", filter === c ? "bg-forest-900 text-white" : "bg-white text-forest-900 ring-1 ring-forest-900/10 hover:ring-forest-900"),
						children: c
					}, c))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: shown.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalCard, {
					a,
					i
				}, a.name + a.date))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: img("/img/family.webp", 1600, 640),
					alt: "Family travelling abroad",
					loading: "lazy",
					className: "h-[28rem] w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/50 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 mx-auto flex max-w-7xl items-center px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "max-w-lg font-display text-4xl font-extrabold text-white md:text-5xl",
						children: ["2,500+ families trusted us with their ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-coral-500",
							children: "biggest move."
						})]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Testimonials" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-4xl font-extrabold text-forest-900",
					children: "In their own words"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
					children: testimonials.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, {
						t,
						featured: i === 0 || i === 4
					}, t.name))
				})
			]
		})
	] });
}
export { SuccessPage as component };
