import { __toESM } from "../_runtime.mjs";
import { Link, require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { getSupportedVideoEmbedUrl } from "./video-0JgGSTnq.mjs";
import { Quote, Star } from "../_libs/lucide-react.mjs";
import { CountryFlag, cn } from "./router-Dd9cECFi.mjs";
// node_modules/.nitro/vite/services/ssr/assets/Cards-jSvl4-wr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
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
			a.photoSrc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-5 -mt-5 mb-4 flex max-h-80 min-h-48 items-center justify-center overflow-hidden bg-forest-50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: a.photoSrc,
					alt: a.mediaAlt || "Student visa approval",
					loading: "lazy",
					decoding: "async",
					className: "max-h-80 w-full object-contain"
				})
			}),
			a.videoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalVideo, {
				url: a.videoUrl,
				title: a.name
			}),
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
function TestimonialCard({ t, featured, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: cn("flex h-full flex-col", compact ? "rounded-2xl p-4" : "rounded-3xl p-7", featured ? "bg-coral-500 text-white" : "bg-white text-forest-900 ring-1 ring-forest-900/10"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: cn(compact ? "size-5" : "size-8", featured ? "text-white/60" : "text-coral-500") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
				className: cn("flex-1 leading-relaxed", compact ? "mt-3 text-xs" : "mt-4 text-[16.5px]"),
				children: [
					"“",
					t.quote,
					"”"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex gap-0.5", compact ? "mt-3" : "mt-5"),
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn(compact ? "size-3" : "size-4", "fill-amber-400 text-amber-400") }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: cn("border-t border-forest-900/10", compact ? "mt-auto pt-3" : "mt-5 pt-4"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("font-display font-bold", compact && "text-xs"),
					children: t.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("text-xs", featured ? "text-white/70" : "text-forest-900/60", compact && "text-[10px] leading-snug"),
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
function ApprovalVideo({ url, title }) {
	const embedUrl = getSupportedVideoEmbedUrl(url);
	const containerRef = (0, import_react.useRef)(null);
	const [nearViewport, setNearViewport] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const container = containerRef.current;
		if (!container) return;
		if (!("IntersectionObserver" in window)) {
			setNearViewport(true);
			return;
		}
		const observer = new IntersectionObserver(([entry]) => setNearViewport(entry.isIntersecting), { rootMargin: "180px 0px" });
		observer.observe(container);
		return () => observer.disconnect();
	}, []);
	if (!embedUrl) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: "-mx-5 -mt-5 mb-4 aspect-video overflow-hidden bg-gradient-to-br from-forest-950 to-forest-700",
		children: nearViewport ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			src: embedUrl,
			title: title + " visa approval video",
			loading: "lazy",
			referrerPolicy: "strict-origin-when-cross-origin",
			allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
			allowFullScreen: true,
			className: "h-full w-full border-0"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-full place-items-center px-4 text-center text-xs font-semibold text-white/80",
			"aria-label": title + " visa approval video",
			children: "Student success video"
		})
	});
}
export { ApprovalCard, PostCard, TestimonialCard, formatDate };
