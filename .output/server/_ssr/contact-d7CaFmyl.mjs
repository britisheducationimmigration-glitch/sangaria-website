import { require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "../_libs/lucide-react.mjs";
import { EnquiryForm, Facebook, Instagram, Route$10, site } from "./router-BZ0FCmGH.mjs";
import { PageHero } from "./Section-D80DXzE3.mjs";
// node_modules/.nitro/vite/services/ssr/assets/contact-d7CaFmyl.js
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const { interest } = Route$10.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "Contact",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Let’s talk about ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-coral-500",
			children: "your plans."
		})] }),
		intro: "Drop an enquiry, call, WhatsApp or walk into our Sangaria office — your first counselling session is free."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative z-10 mx-auto mt-8 grid max-w-7xl gap-8 px-6 pb-24 lg:-mt-12 lg:grid-cols-[1.3fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-forest-900/10 md:p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-extrabold text-forest-900",
					children: "Send an enquiry"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-8 text-forest-900/60",
					children: "We reply within one working day."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, {
					source: "contact",
					defaultInterest: interest
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[2rem] bg-forest-900 bg-grain p-8 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-1 size-5 shrink-0 text-coral-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold",
								children: "Office"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-forest-100/75",
								children: site.address
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mt-1 size-5 shrink-0 text-coral-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold",
								children: "Call us"
							}), site.phones.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:+91${p}`,
								className: "block text-forest-100/75 hover:text-white",
								children: ["+91 ", p]
							}, p))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mt-1 size-5 shrink-0 text-coral-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold",
								children: "Hours"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-forest-100/75",
								children: site.hours
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mt-1 size-5 shrink-0 text-coral-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold",
								children: "Email us"
							}), site.emails.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
								target: "_blank",
								rel: "noreferrer",
								className: "block break-all text-sm text-forest-100/75 hover:text-white",
								children: email
							}, email))] })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `https://wa.me/${site.whatsapp}`,
							target: "_blank",
							rel: "noreferrer",
							className: "flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " WhatsApp"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: site.mapUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "flex items-center gap-2 rounded-full bg-coral-500 px-5 py-3 text-sm font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), " Get directions"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: site.instagram,
							target: "_blank",
							rel: "noreferrer",
							className: "flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold hover:bg-coral-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" }), " Instagram"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: site.facebook,
							target: "_blank",
							rel: "noreferrer",
							className: "flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold hover:bg-coral-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "size-4" }), " Facebook"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: "Office location map",
				src: `https://www.google.com/maps?q=${site.latitude},${site.longitude}&z=17&output=embed`,
				className: "h-72 w-full rounded-[2rem] border-0 ring-1 ring-forest-900/10",
				loading: "lazy"
			})]
		})]
	})] });
}
export { ContactPage as component };
