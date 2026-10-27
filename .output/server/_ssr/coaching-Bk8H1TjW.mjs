import { require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { bandScoreTable, coachingCourses } from "./db.server-BhNUs5Hf.mjs";
import { BookOpen, Check, Headphones, Mic, PenLine } from "../_libs/lucide-react.mjs";
import { EnquiryForm, Route$11, img } from "./router-BDXX3wob.mjs";
import { Eyebrow, PageHero } from "./Section-D80DXzE3.mjs";
// node_modules/.nitro/vite/services/ssr/assets/coaching-Bk8H1TjW.js
var import_jsx_runtime = require_jsx_runtime();
var modules = [
	{
		icon: Headphones,
		name: "Listening",
		tip: "Note-completion & map tasks with real accents"
	},
	{
		icon: BookOpen,
		name: "Reading",
		tip: "Skimming, scanning & True/False/Not Given"
	},
	{
		icon: PenLine,
		name: "Writing",
		tip: "Task 1 reports, Task 2 essays, PTE summaries"
	},
	{
		icon: Mic,
		name: "Speaking",
		tip: "Cue cards, Read Aloud & Describe Image"
	}
];
function CoachingPage() {
	const { batches } = Route$11.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: "IELTS & PTE Preparation",
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Score higher. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-coral-500",
				children: "Fly sooner."
			})] }),
			intro: "Expert-led IELTS and PTE coaching in Sangaria with small batches, a real-exam computer lab and weekly mock tests.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#batches",
					className: "rounded-full bg-coral-500 px-7 py-4 font-bold shadow-[4px_4px_0_0] shadow-black/40",
					children: "See upcoming batches"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#demo",
					className: "rounded-full border border-white/25 px-7 py-4 font-bold hover:bg-white hover:text-forest-900",
					children: "Book a free demo"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-2",
			children: coachingCourses.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-[2rem] p-10 " + (i === 0 ? "bg-white ring-1 ring-forest-900/10" : "bg-forest-900 text-white"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-6xl font-extrabold",
							children: c.test
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: i === 0 ? "text-forest-900/60" : "text-forest-100/70",
							children: c.tagline
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-coral-500 px-4 py-1.5 text-sm font-bold text-white",
							children: c.duration
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 space-y-3",
						children: c.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-5 shrink-0 text-coral-500" }),
								" ",
								f
							]
						}, f))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap justify-between gap-3 border-t-2 border-dashed pt-6 text-sm " + (i === 0 ? "border-forest-900/10" : "border-white/15"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🕘 ", c.batch] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-coral-500",
							children: c.target
						})]
					})
				]
			}, c.test))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-sand/60 py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "All four modules" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-4xl font-extrabold text-forest-900",
						children: "What you’ll master"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
						children: modules.map(({ icon: Icon, name, tip }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl bg-cream p-7 ring-1 ring-forest-900/10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-8 text-coral-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-5 text-xl font-bold text-forest-900",
									children: name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-forest-900/65",
									children: tip
								})
							]
						}, name))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "batches",
			className: "mx-auto grid max-w-7xl scroll-mt-28 gap-12 px-6 py-20 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Upcoming batches" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-4xl font-extrabold text-forest-900",
					children: "Pick a time that suits you"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-forest-900/10",
					children: batches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 border-b border-forest-900/10 px-6 py-5 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display font-bold text-forest-900",
							children: [
								b.batch,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 rounded-full bg-forest-50 px-2 py-1 text-[10px] uppercase tracking-wide text-forest-700",
									children: b.program
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-forest-900/60",
							children: [
								b.time,
								" · starts ",
								b.starts
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full px-3 py-1 text-xs font-bold " + (b.seats <= 4 ? "bg-coral-100 text-coral-600" : "bg-forest-50 text-forest-700"),
							children: [b.seats, " seats left"]
						})]
					}, b.id))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Score converter" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-4xl font-extrabold text-forest-900",
					children: "IELTS ⇄ PTE ⇄ CLB"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "mt-8 w-full overflow-hidden rounded-3xl bg-white text-left ring-1 ring-forest-900/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-forest-900 text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-display",
								children: "IELTS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-display",
								children: "PTE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-6 py-4 font-display",
								children: "Canada CLB"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: bandScoreTable.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-forest-900/10 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-6 py-3.5 font-bold text-forest-900",
								children: r.ielts
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-6 py-3.5",
								children: r.pte
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-6 py-3.5 text-forest-900/70",
								children: r.clb
							})
						]
					}, r.ielts)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-forest-900/50",
					children: "Approximate equivalence for guidance only."
				})
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "demo",
			className: "mx-auto max-w-7xl scroll-mt-28 px-6 pb-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid overflow-hidden rounded-[2rem] bg-forest-900 text-white lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: img("/img/coaching.webp", 800, 700),
					alt: "Students in coaching class",
					loading: "lazy",
					className: "h-full min-h-64 w-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-grain p-8 md:p-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-extrabold",
							children: "Book a free demo class"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 mb-8 text-forest-100/70",
							children: "Try a class and take a free diagnostic mock test."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, {
							source: "coaching",
							defaultInterest: "IELTS Coaching",
							dark: true,
							compact: true
						})
					]
				})]
			})
		})
	] });
}
export { CoachingPage as component };
