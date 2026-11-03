import { Link, require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { EnquiryForm, Route$3 } from "./router-DkOd6TGA.mjs";
import { PostCard, formatDate } from "./Cards-shUlojPa.mjs";
// node_modules/.nitro/vite/services/ssr/assets/updates._slug-DGXmzugH.js
var import_jsx_runtime = require_jsx_runtime();
function PostPage() {
	const { post, posts } = Route$3.useLoaderData();
	const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl px-6 pt-16 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/updates",
				className: "text-sm font-bold text-coral-600",
				children: "← All updates"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex items-center gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-forest-50 px-3 py-1 font-bold text-forest-700",
					children: post.category
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-forest-900/50",
					children: [
						formatDate(post.date),
						" · ",
						post.readMins,
						" min read"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 text-4xl font-extrabold leading-tight text-forest-900 md:text-5xl",
				children: post.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xl text-forest-900/70",
				children: post.excerpt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 space-y-6 border-t border-forest-900/10 pt-10 text-lg leading-relaxed text-forest-900/85",
				children: post.body.map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: para }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-14 rounded-[2rem] bg-forest-900 bg-grain p-8 text-white",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-extrabold",
						children: "Have a question about this update?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 mb-6 text-forest-100/70",
						children: "Ask our counsellor — free."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, {
						source: `blog-${post.slug}`,
						dark: true,
						compact: true
					})
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-6 pb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-8 text-3xl font-extrabold text-forest-900",
			children: "More updates"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 md:grid-cols-3",
			children: more.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, { p }, p.slug))
		})]
	})] });
}
export { PostPage as component };
