import { Link, require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { countries, faqs, visaServices } from "./db.server-BhNUs5Hf.mjs";
import { ArrowRight, Award, BadgeCheck, Headphones, MapPin, Timer } from "../_libs/lucide-react.mjs";
import { CountryFlag, EnquiryForm, Route$13, img, site } from "./router-BDXX3wob.mjs";
import { Eyebrow } from "./Section-D80DXzE3.mjs";
import { ApprovalCard, PostCard, TestimonialCard } from "./Cards-CiTVj0NG.mjs";
import { ServiceIcon } from "./ServiceIcon-Bq0xIDoz.mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-CEk5lggN.js
var import_jsx_runtime = require_jsx_runtime();
var stats = [
	{
		value: "2,500+",
		label: "Visas approved"
	},
	{
		value: "98%",
		label: "Success ratio"
	},
	{
		value: "7",
		label: "Destinations"
	},
	{
		value: "7.0",
		label: "Avg. IELTS band"
	}
];
var steps = [
	{
		n: "01",
		title: "Free counselling",
		text: "Visit our Sangaria office or call — we assess your profile honestly."
	},
	{
		n: "02",
		title: "Test preparation",
		text: "IELTS or PTE coaching in small batches until you hit your target score."
	},
	{
		n: "03",
		title: "Admission & file",
		text: "University offers, SOP, funds and a complete, embassy-ready visa file."
	},
	{
		n: "04",
		title: "Visa & departure",
		text: "Biometrics, interview prep, forex, tickets and pre-departure briefing."
	}
];
function Home() {
	const { approvals, posts, testimonials, settings } = Route$13.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative overflow-hidden bg-forest-900 bg-grain text-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl items-center gap-14 px-6 pt-16 pb-24 lg:grid-cols-[1.15fr_1fr] lg:pt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "animate-rise",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
							light: true,
							children: "Sangaria · Hanumangarh · Since day one"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-7 animate-rise text-[3.4rem] font-extrabold leading-[0.92] [animation-delay:80ms] sm:text-7xl xl:text-[5.6rem]",
						children: [
							"Pack your bags.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative inline-block text-coral-500",
								children: ["We’ll handle", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 300 20",
									className: "absolute -bottom-2 left-0 w-full",
									"aria-hidden": true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M2 15 Q 75 2 150 10 T 298 6",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "5",
										strokeLinecap: "round"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"the visa."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-8 max-w-xl animate-rise text-lg leading-relaxed text-forest-100/80 [animation-delay:160ms]",
						children: [
							"Study visas, PR, work permits, tourist visas and IELTS / PTE coaching for Canada, UK, Australia, USA, New Zealand, Germany and Europe — all under one roof at ",
							site.name,
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/eligibility",
							className: "flex items-center gap-2 rounded-full bg-coral-500 px-7 py-4 font-bold shadow-[4px_4px_0_0] shadow-black/40 transition hover:-translate-y-1",
							children: ["Check my eligibility ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: "rounded-full border border-white/25 px-7 py-4 font-bold transition hover:bg-white hover:text-forest-900",
							children: "Talk to a counsellor"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-14 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4",
						children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-display text-3xl font-extrabold text-white",
							children: s.value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-xs uppercase tracking-wider text-forest-100/60",
							children: s.label
						})] }, s.label))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto w-full max-w-md lg:max-w-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-4 rotate-3 rounded-[2.5rem] bg-coral-500/90" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: img("/img/hero.webp", 720, 860),
							alt: "Student holding passport and university acceptance letter at the airport",
							width: 720,
							height: 860,
							className: "relative aspect-[6/7] w-full rounded-[2rem] object-cover shadow-2xl"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute -bottom-10 -left-4 w-[78%] rounded-2xl bg-cream p-4 text-forest-900 shadow-2xl sm:-left-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-forest-900/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Boarding pass" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BEI · 2026" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between font-display",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-3xl font-extrabold",
										children: "SNG"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-forest-900/60",
										children: "Sangaria"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 px-3 text-center text-coral-500",
										children: "- - ✈ - -"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-extrabold",
											children: "YYZ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-forest-900/60",
											children: "Toronto"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-6 -right-3 grid size-28 animate-stamp place-items-center rounded-full border-[3px] border-dashed border-coral-500 bg-forest-950/80 text-center font-mono text-[11px] font-bold uppercase leading-tight tracking-widest text-coral-400 backdrop-blur [animation-delay:600ms] sm:-right-6",
							children: [
								"Visa",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Approved",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"✓"
							]
						})
					]
				})]
			})
		}),
		settings.approvalsMarqueeEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "overflow-hidden border-y border-forest-900/10 bg-coral-500 py-4 text-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg font-bold",
				children: [...approvals, ...approvals].map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
							flag: a.flag,
							country: a.country,
							className: "h-4 w-6 shrink-0 inline-block"
						}),
						" ",
						a.name,
						" — ",
						a.visa,
						" approved ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/50",
							children: "✦"
						})
					]
				}, i))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-between gap-6 md:flex-row md:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "What we do" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 max-w-2xl text-4xl font-extrabold text-forest-900 md:text-5xl",
					children: "Every kind of visa, handled by one trusted team."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/visas",
					className: "font-bold text-coral-600 hover:underline",
					children: "All visa services →"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
				children: visaServices.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/visas",
					hash: s.slug,
					className: "group relative overflow-hidden rounded-3xl p-8 transition hover:-translate-y-1 " + (i === 0 ? "bg-forest-900 text-white" : "bg-white ring-1 ring-forest-900/10 hover:ring-forest-900"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-14 place-items-center rounded-2xl " + (i === 0 ? "bg-coral-500" : "bg-forest-50 text-forest-700"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceIcon, {
								name: s.icon,
								className: "size-6"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-6 text-2xl font-bold",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 " + (i === 0 ? "text-forest-100/75" : "text-forest-900/65"),
							children: s.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "absolute top-8 right-8 font-mono text-xs opacity-40",
							children: ["0", i + 1]
						})
					]
				}, s.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-sand/60 bg-dots py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Destinations" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 max-w-3xl text-4xl font-extrabold text-forest-900 md:text-5xl",
						children: "Choose where your next chapter begins."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
						children: [countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/countries/$slug",
							params: { slug: c.slug },
							className: "group relative flex flex-col rounded-3xl bg-cream p-6 ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:bg-forest-900 hover:text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
										code: c.code,
										flag: c.flag,
										country: c.name,
										className: "h-10 w-14 shrink-0 shadow-sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-2xl font-bold text-forest-900/20 group-hover:text-white/20",
										children: c.code
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-6 text-2xl font-bold",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm opacity-70",
									children: c.headline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-5 border-t-2 border-dashed border-forest-900/15 group-hover:border-white/20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-end justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[10px] uppercase tracking-widest opacity-60",
										children: c.stats[0].label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										children: c.stats[0].value
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-5 text-coral-500 transition group-hover:translate-x-1" })]
								})
							]
						}, c.slug)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/eligibility",
							className: "flex flex-col justify-between rounded-3xl bg-coral-500 p-6 text-white transition hover:-translate-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs uppercase tracking-widest",
								children: "Not sure?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-6 font-display text-2xl font-extrabold leading-tight",
								children: "Find the country that fits your profile in 60 seconds →"
							})]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: img("/img/coaching.webp", 760, 560),
					alt: "IELTS and PTE coaching classroom",
					width: 760,
					height: 560,
					loading: "lazy",
					className: "aspect-[19/14] w-full rounded-[2rem] object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute -right-4 -bottom-6 rounded-2xl bg-forest-900 p-5 text-white shadow-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl font-extrabold text-coral-500",
						children: "79+"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider text-forest-100/70",
						children: "Top PTE score this month"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "IELTS & PTE Coaching" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-4xl font-extrabold text-forest-900 md:text-5xl",
					children: "Your score is your passport. Let’s raise it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-lg text-forest-900/70",
					children: "Small batches, experienced trainers, a dedicated PTE computer lab and weekly mock tests — right here in Sangaria."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 grid gap-4 sm:grid-cols-2",
					children: [
						{
							icon: Headphones,
							t: "Real-exam PTE lab"
						},
						{
							icon: Timer,
							t: "Weekly timed mocks"
						},
						{
							icon: Award,
							t: "Band-score feedback"
						},
						{
							icon: BadgeCheck,
							t: "Free demo class"
						}
					].map(({ icon: Icon, t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-2xl bg-white p-4 font-semibold ring-1 ring-forest-900/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-coral-500" }),
							" ",
							t
						]
					}, t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/coaching",
					className: "mt-8 inline-flex rounded-full bg-forest-900 px-7 py-4 font-bold text-white transition hover:bg-forest-700",
					children: "View batches & fees →"
				})
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-forest-900 bg-grain py-24 text-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
						light: true,
						children: "How it works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 max-w-2xl text-4xl font-extrabold md:text-5xl",
						children: "Four steps from Sangaria to your dream destination."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-14 grid gap-6 md:grid-cols-4",
						children: steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "relative rounded-3xl border border-white/10 bg-white/5 p-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-6xl font-extrabold text-coral-500/90",
									children: s.n
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 text-xl font-bold",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-forest-100/70",
									children: s.text
								})
							]
						}, s.n))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-between gap-6 md:flex-row md:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Fresh approvals" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-4xl font-extrabold text-forest-900 md:text-5xl",
					children: "Visas that landed this month."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/success-stories",
					className: "font-bold text-coral-600 hover:underline",
					children: "See all success stories →"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: approvals.slice(0, 4).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalCard, {
					a,
					i
				}, a.name))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-sand/60 py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Testimonials" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 max-w-2xl text-4xl font-extrabold text-forest-900 md:text-5xl",
						children: "Real students. Real families. Real visas."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-5 md:grid-cols-3",
						children: testimonials.slice(0, 3).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, {
							t,
							featured: i === 1
						}, t.name))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-between gap-6 md:flex-row md:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "News & Blog" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-4xl font-extrabold text-forest-900 md:text-5xl",
					children: "Latest visa updates."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/updates",
					className: "font-bold text-coral-600 hover:underline",
					children: "All articles →"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 md:grid-cols-3",
				children: posts.slice(0, 3).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, { p }, p.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "enquiry",
			className: "mx-auto grid max-w-7xl gap-12 px-6 pb-28 lg:grid-cols-[1fr_1.1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "FAQs" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-4xl font-extrabold text-forest-900",
					children: "Questions we hear every day."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 divide-y divide-forest-900/10 rounded-3xl bg-white ring-1 ring-forest-900/10",
					children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "group p-6 [&_summary::-webkit-details-marker]:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-bold text-forest-900",
							children: [f.q, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-8 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition group-open:rotate-45",
								children: "+"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-forest-900/70",
							children: f.a
						})]
					}, f.q))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 flex items-center gap-2 text-sm text-forest-900/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-coral-500" }),
						" ",
						site.address
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[2rem] bg-forest-900 bg-grain p-8 text-white md:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl font-extrabold",
						children: "Get a free profile evaluation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 mb-8 text-forest-100/70",
						children: "Share a few details — a counsellor calls you back within one working day."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, {
						source: "home",
						dark: true
					})
				]
			})]
		})
	] });
}
export { Home as component };
