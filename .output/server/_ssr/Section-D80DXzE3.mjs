import { require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { cn } from "./router-DnGTvCwZ.mjs";
// node_modules/.nitro/vite/services/ssr/assets/Section-D80DXzE3.js
var import_jsx_runtime = require_jsx_runtime();
function Eyebrow({ children, light }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.18em]", light ? "border-white/20 text-coral-400" : "border-forest-900/15 text-coral-600"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-coral-500" }), children]
	});
}
function PageHero({ eyebrow, title, intro, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative overflow-hidden bg-forest-900 bg-grain text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "animate-rise",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
						light: true,
						children: eyebrow
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 max-w-4xl animate-rise text-5xl font-extrabold leading-[0.95] [animation-delay:80ms] md:text-7xl",
					children: title
				}),
				intro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-2xl animate-rise text-lg text-forest-100/80 [animation-delay:160ms]",
					children: intro
				}),
				children
			]
		})
	});
}
export { Eyebrow, PageHero };
