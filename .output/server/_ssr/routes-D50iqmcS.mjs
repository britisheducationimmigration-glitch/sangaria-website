import { __toESM } from "../_runtime.mjs";
import { Link, require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { ArrowRight, Award, BadgeCheck, Headphones, MapPin, Timer } from "../_libs/lucide-react.mjs";
import { countries, faqs, visaServices } from "./db.server-CEhaHsNY.mjs";
import { CountryFlag, EnquiryForm, Route$13, img, site } from "./router-BZ0FCmGH.mjs";
import { Eyebrow } from "./Section-D80DXzE3.mjs";
import { ApprovalCard, PostCard, TestimonialCard } from "./Cards-DvfTXmeu.mjs";
import { ServiceIcon } from "./ServiceIcon-Bq0xIDoz.mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-D50iqmcS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
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
	const [selectedCountry, setSelectedCountry] = (0, import_react.useState)("canada");
	const [selectedVisa, setSelectedVisa] = (0, import_react.useState)("study");
	const [showAllTestimonials, setShowAllTestimonials] = (0, import_react.useState)(false);
	const [showAllTestimonialsMobile, setShowAllTestimonialsMobile] = (0, import_react.useState)(false);
	const visibleTestimonialsDesktop = showAllTestimonials ? testimonials : testimonials.slice(0, 3);
	const visibleTestimonialsMobile = showAllTestimonialsMobile ? testimonials : testimonials.slice(0, 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "block md:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative overflow-hidden bg-forest-900 bg-grain text-white px-5 pt-8 pb-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-forest-950/80 border border-white/20 px-3.5 py-1 text-[11px] font-bold text-coral-400 shadow-sm",
						children: "📍 Sangaria · Hanumangarh · Since Day 1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-5 text-[2.75rem] font-extrabold leading-[1.03] tracking-tight",
						children: [
							"Pack your bags.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative inline-block text-coral-500",
								children: ["We’ll handle", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 300 20",
									className: "absolute -bottom-1.5 left-0 w-full",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-forest-100/85",
						children: "Study visas, PR, work permits, tourist visas & IELTS/PTE coaching for Canada, UK, Australia, USA, NZ & Europe — right here in Sangaria."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 rounded-2xl bg-forest-950/90 border border-white/20 p-4 shadow-2xl overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] font-bold uppercase tracking-wide text-coral-400",
									children: "Visa & Country Finder"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-semibold text-white/70",
									children: "Free Check"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[10px] font-bold text-white/80 mb-1",
										children: "Country"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: selectedCountry,
											onChange: (e) => setSelectedCountry(e.target.value),
											className: "w-full rounded-xl bg-white text-forest-900 text-xs font-bold py-2.5 pl-2.5 pr-7 shadow-sm outline-none border border-forest-900/15 appearance-none truncate",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "canada",
													children: "🇨🇦 Canada"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "uk",
													children: "🇬🇧 UK"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "australia",
													children: "🇦🇺 Australia"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "usa",
													children: "🇺🇸 USA"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "new-zealand",
													children: "🇳🇿 NZ"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "germany",
													children: "🇩🇪 Germany"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "europe",
													children: "🇪🇺 Europe"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: " Other"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute right-2.5 top-2.5 text-[10px] text-forest-900/60",
											children: "▼"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[10px] font-bold text-white/80 mb-1",
										children: "Visa Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: selectedVisa,
											onChange: (e) => setSelectedVisa(e.target.value),
											className: "w-full rounded-xl bg-white text-forest-900 text-xs font-bold py-2.5 pl-2.5 pr-7 shadow-sm outline-none border border-forest-900/15 appearance-none truncate",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "study",
													children: "🎓 Study Visa"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "pr",
													children: "🏛️ PR / Immig."
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "work",
													children: "💼 Work Permit"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "tourist",
													children: "✈️ Tourist Visa"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "coaching",
													children: "📚 IELTS / PTE"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute right-2.5 top-2.5 text-[10px] text-forest-900/60",
											children: "▼"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/countries/$slug",
									params: { slug: selectedCountry },
									className: "w-full flex items-center justify-center gap-2 rounded-xl bg-coral-500 py-3 px-4 text-xs font-extrabold text-white shadow-md active:scale-98 transition text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate",
										children: [
											"Explore ",
											countries.find((c) => c.slug === selectedCountry)?.name ?? "Country",
											" Guide"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 shrink-0" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/eligibility",
										className: "flex-1 rounded-xl border border-white/30 bg-white/10 py-2.5 px-3 text-xs font-bold text-white text-center active:bg-white/20 transition truncate",
										children: "Eligibility Check →"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/contact",
										className: "rounded-xl border border-white/30 bg-white/10 py-2.5 px-3.5 text-xs font-bold text-white text-center active:bg-white/20 transition",
										children: "Contact"
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-7 grid grid-cols-2 gap-3.5",
						children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-white/5 border border-white/10 p-4 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-display text-2xl font-extrabold text-white",
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-[10px] uppercase tracking-wider text-forest-100/70",
								children: s.label
							})]
						}, s.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-8 w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img("/img/hero.webp", 640, 720),
								alt: "Student holding passport and university acceptance letter",
								width: 640,
								height: 720,
								className: "aspect-[4/3] w-full object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute top-3.5 right-3.5 grid size-16 place-items-center rounded-full border-2 border-dashed border-coral-400 bg-forest-950/90 text-center font-mono text-[9px] font-bold uppercase leading-tight tracking-wider text-coral-300 backdrop-blur shadow-lg",
								children: [
									"Visa",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Approved",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"✓"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-0 inset-x-0 bg-cream/95 backdrop-blur-md p-3.5 text-forest-900 border-t border-forest-900/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-forest-900/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BOARDING PASS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BEI · SANGARIA" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1.5 flex items-center justify-between font-display text-sm font-extrabold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["SNG ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-normal text-forest-900/60",
											children: "Sangaria"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-coral-500 font-mono text-xs",
											children: "- - ✈ - -"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["YYZ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-normal text-forest-900/60",
											children: "Toronto"
										})] })
									]
								})]
							})
						]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-[61px] z-30 overflow-x-auto bg-forest-950 py-3 px-4 scrollbar-none border-y border-white/10 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 w-max",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] font-bold uppercase tracking-wider text-coral-400 shrink-0",
							children: "JUMP:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#services-m",
							className: "shrink-0 rounded-full bg-forest-900/90 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500",
							children: "✈️ Services"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#destinations-m",
							className: "shrink-0 rounded-full bg-forest-900/90 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500",
							children: "🌍 Countries"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#coaching-m",
							className: "shrink-0 rounded-full bg-forest-900/90 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500",
							children: "📚 IELTS & PTE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#approvals-m",
							className: "shrink-0 rounded-full bg-forest-900/90 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500",
							children: "🎉 Visas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#reviews-m",
							className: "shrink-0 rounded-full bg-forest-900/90 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500",
							children: "⭐ Reviews"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#enquiry-m",
							className: "shrink-0 rounded-full bg-coral-500 px-3.5 py-1 text-xs font-bold text-white shadow-md",
							children: "🔴 Free Enquiry"
						})
					]
				})
			}),
			settings.approvalsMarqueeEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "overflow-hidden border-b border-forest-900/10 bg-coral-500 py-3.5 text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-sm font-bold",
					children: [...approvals, ...approvals].map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
								flag: a.flag,
								country: a.country,
								className: "shrink-0 inline-block rounded-[2px]",
								style: {
									width: "26px",
									height: "17px",
									minWidth: "26px",
									maxWidth: "26px"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								a.name,
								" — ",
								a.visa
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white/50",
								children: "✦"
							})
						]
					}, i))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "services-m",
				className: "px-5 py-20 border-b border-forest-900/10 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "What we do" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl font-extrabold text-forest-900",
						children: "Every visa handled by one team."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/visas",
						className: "text-xs font-bold text-coral-600 hover:underline shrink-0",
						children: "All visas →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4",
					children: visaServices.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/visas",
						hash: s.slug,
						className: "flex flex-col justify-between rounded-2xl p-4 shadow-sm border border-forest-900/10 transition overflow-hidden " + (i === 0 ? "bg-forest-900 text-white shadow-md border-transparent" : "bg-white text-forest-900 active:bg-forest-50"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-9 shrink-0 place-items-center rounded-xl " + (i === 0 ? "bg-coral-500 text-white" : "bg-forest-50 text-forest-700"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceIcon, {
										name: s.icon,
										className: "size-4"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs font-bold " + (i === 0 ? "text-white/40" : "text-forest-900/30"),
									children: ["0", i + 1]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 text-sm font-extrabold leading-snug",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-[11px] leading-relaxed line-clamp-3 " + (i === 0 ? "text-forest-100/75" : "text-forest-900/65"),
								children: s.summary
							})
						] })
					}, s.slug))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "destinations-m",
				className: "bg-sand/60 bg-dots px-5 py-20 border-b border-forest-900/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Destinations" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-extrabold text-forest-900",
							children: "Choose where your next chapter begins."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-forest-900/70",
							children: "Top study abroad countries with full guidance in Sangaria."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/countries/$slug",
						params: { slug: c.slug },
						className: "flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm border border-forest-900/10 active:bg-forest-900 active:text-white transition group overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
									code: c.code,
									flag: c.flag,
									country: c.name,
									className: "rounded shadow-sm shrink-0",
									style: {
										width: "36px",
										height: "24px",
										minWidth: "36px",
										maxWidth: "36px"
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs font-bold text-forest-900/40 group-active:text-white/40",
									children: c.code
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2.5 text-sm font-extrabold text-forest-900 group-active:text-white leading-tight",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-forest-900/65 group-active:text-white/70 line-clamp-2 leading-tight",
								children: c.headline
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3.5 pt-2 border-t border-forest-900/10 group-active:border-white/15 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold text-coral-600 group-active:text-coral-300",
								children: c.stats[0].value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 text-coral-500 group-active:text-coral-300" })]
						})]
					}, c.slug)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/eligibility",
						className: "flex flex-col justify-between rounded-2xl bg-coral-500 p-4 text-white shadow-md active:bg-coral-600 transition overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[9px] font-bold uppercase tracking-wider text-white/80",
								children: "NOT SURE?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 text-sm font-extrabold leading-tight",
								children: "Find Your Fit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-white/85 leading-tight",
								children: "Free 60-second profile assessment"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3.5 pt-2 border-t border-white/20 flex items-center justify-between font-bold text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Check now" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "coaching-m",
				className: "px-5 py-20 border-b border-forest-900/10 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl shadow-lg mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: img("/img/coaching.webp", 640, 420),
						alt: "IELTS and PTE coaching classroom",
						width: 640,
						height: 420,
						loading: "lazy",
						className: "aspect-[16/10] w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-3 right-3 rounded-xl bg-forest-900/90 backdrop-blur-md px-3.5 py-1.5 text-white shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-extrabold text-coral-400",
							children: "79+"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1.5 text-[10px] font-bold uppercase tracking-wider text-forest-100/80",
							children: "PTE Score"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "IELTS & PTE Coaching" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl font-extrabold text-forest-900",
						children: "Your score is your passport. Let’s raise it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs leading-relaxed text-forest-900/70",
						children: "Small batches, experienced trainers, a dedicated PTE computer lab and weekly mock tests — right here in Sangaria."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid grid-cols-2 gap-3.5",
						children: [
							{
								icon: Headphones,
								t: "Real PTE lab"
							},
							{
								icon: Timer,
								t: "Timed mocks"
							},
							{
								icon: Award,
								t: "Band feedback"
							},
							{
								icon: BadgeCheck,
								t: "Free demo class"
							}
						].map(({ icon: Icon, t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 rounded-xl bg-forest-50/70 p-3 text-xs font-semibold text-forest-900 shadow-sm border border-forest-900/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0 text-coral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: t
							})]
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/coaching",
						className: "mt-8 block w-full rounded-full bg-forest-900 py-4 text-center text-xs font-bold text-white transition active:bg-forest-800 shadow-md",
						children: "View batches & fees →"
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "bg-forest-900 bg-grain px-5 py-20 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
						light: true,
						children: "How it works"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl font-extrabold",
						children: "Four steps to your destination."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "grid grid-cols-2 gap-4",
					children: steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl border border-white/15 bg-white/5 p-4 shadow-sm flex flex-col justify-between overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl font-extrabold text-coral-400",
							children: s.n
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1.5 text-sm font-bold text-white leading-tight",
							children: s.title
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[11px] leading-tight text-forest-100/70",
							children: s.text
						})]
					}, s.n))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "approvals-m",
				className: "px-5 py-20 border-b border-forest-900/10 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Fresh approvals" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl font-extrabold text-forest-900",
						children: "Visas that landed this month."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/success-stories",
						className: "text-xs font-bold text-coral-600 hover:underline shrink-0",
						children: "See all →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4",
					children: approvals.slice(0, 4).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalCard, {
						a,
						i
					}, a.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "reviews-m",
				className: "bg-sand/60 px-5 py-20 border-b border-forest-900/10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Testimonials" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-extrabold text-forest-900",
							children: "Real students. Real visas."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-5",
						children: visibleTestimonialsMobile.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, {
							t,
							featured: i === 0
						}, t.name))
					}),
					testimonials.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setShowAllTestimonialsMobile(!showAllTestimonialsMobile),
						className: "mt-6 w-full rounded-full border border-forest-900/15 bg-white py-4 text-xs font-bold text-forest-900 shadow-sm active:bg-forest-50 transition",
						children: showAllTestimonialsMobile ? "Show Fewer Reviews ↑" : `Show More Reviews (${testimonials.length - 2}+ और देखें) ↓`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-5 py-20 border-b border-forest-900/10 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "News & Blog" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl font-extrabold text-forest-900",
						children: "Latest visa updates."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/updates",
						className: "text-xs font-bold text-coral-600 hover:underline shrink-0",
						children: "All articles →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5",
					children: posts.slice(0, 3).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, { p }, p.slug))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "enquiry-m",
				className: "px-5 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "FAQs" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-extrabold text-forest-900",
							children: "Questions we hear every day."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-forest-900/70",
							children: "Tap any question below to see full answer."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 space-y-3.5",
							children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "group rounded-2xl bg-white p-5 shadow-sm border border-forest-900/10 transition [&_summary::-webkit-details-marker]:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
									className: "flex cursor-pointer items-center justify-between gap-3 font-display text-[15px] font-bold text-forest-900 leading-snug",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f.q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-8 shrink-0 place-items-center rounded-full bg-forest-50 text-coral-600 transition group-open:rotate-45 text-sm font-bold shadow-xs",
										children: "+"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3.5 border-t border-forest-900/10 pt-3 text-xs leading-relaxed text-forest-900/75",
									children: f.a
								})]
							}, f.q))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 flex items-center gap-2 text-xs text-forest-900/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-coral-500 shrink-0" }),
								" ",
								site.address
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-forest-900 bg-grain p-6 text-white shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-extrabold",
							children: "Free Profile Evaluation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 mb-6 text-xs text-forest-100/70",
							children: "Share details — a counsellor calls you back within one working day."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, {
							source: "home-mobile",
							dark: true
						})
					]
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden md:block",
		children: [
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
							className: "mt-8 max-w-xl rounded-2xl bg-forest-950/80 border border-white/20 p-5 shadow-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs font-extrabold uppercase tracking-wider text-coral-400",
										children: "Quick Visa & Country Finder"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-white/60",
										children: "Free Profile Evaluation"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-white/80 mb-1",
										children: "Target Country"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: selectedCountry,
											onChange: (e) => setSelectedCountry(e.target.value),
											className: "w-full rounded-xl bg-white text-forest-900 text-sm font-bold py-2.5 pl-3 pr-8 shadow-sm outline-none border border-forest-900/15 appearance-none cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "canada",
													children: "🇨🇦 Canada"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "uk",
													children: "🇬🇧 United Kingdom"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "australia",
													children: "🇦🇺 Australia"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "usa",
													children: "🇺🇸 United States"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "new-zealand",
													children: "🇳🇿 New Zealand"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "germany",
													children: "🇩🇪 Germany"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "europe",
													children: "🇪🇺 Europe / Schengen"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "  Other"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute right-3 top-3 text-xs text-forest-900/60",
											children: "▼"
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-white/80 mb-1",
										children: "Visa Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: selectedVisa,
											onChange: (e) => setSelectedVisa(e.target.value),
											className: "w-full rounded-xl bg-white text-forest-900 text-sm font-bold py-2.5 pl-3 pr-8 shadow-sm outline-none border border-forest-900/15 appearance-none cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "study",
													children: "🎓 Study Visa"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "pr",
													children: "🏛️ PR / Immigration"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "work",
													children: "💼 Work Permit"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "tourist",
													children: "✈️ Tourist Visa"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "coaching",
													children: "📚 IELTS / PTE Coaching"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute right-3 top-3 text-xs text-forest-900/60",
											children: "▼"
										})]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/countries/$slug",
										params: { slug: selectedCountry },
										className: "flex-1 flex items-center justify-center gap-2 rounded-xl bg-coral-500 py-3 px-4 font-bold text-white shadow-md hover:bg-coral-600 transition",
										children: [
											"Explore ",
											countries.find((c) => c.slug === selectedCountry)?.name ?? "Country",
											" Guide ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/eligibility",
										className: "rounded-xl border border-white/30 bg-white/10 py-3 px-5 font-bold text-white hover:bg-white/20 transition",
										children: "Check Eligibility"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-10 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-forest-900/10 bg-forest-950 py-3.5 text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center justify-between px-6 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs font-bold uppercase tracking-widest text-coral-400",
							children: "JUMP TO:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-7 font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#services-desktop",
									className: "hover:text-coral-400 transition",
									children: "✈️ Services"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#destinations-desktop",
									className: "hover:text-coral-400 transition",
									children: "🌍 Countries"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#coaching-desktop",
									className: "hover:text-coral-400 transition",
									children: "📚 IELTS & PTE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#approvals-desktop",
									className: "hover:text-coral-400 transition",
									children: "🎉 Recent Visas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#reviews-desktop",
									className: "hover:text-coral-400 transition",
									children: "⭐ Reviews"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: "rounded-full bg-coral-500 px-5 py-2 text-xs font-bold text-white hover:bg-coral-600 transition shadow-sm",
							children: "🔴 Free Enquiry"
						})
					]
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
								className: "shrink-0 inline-block rounded-[3px]",
								style: {
									width: "28px",
									height: "18px",
									minWidth: "28px",
									maxWidth: "28px"
								}
							}),
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
				id: "services-desktop",
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
					className: "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3",
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
				id: "destinations-desktop",
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
							className: "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
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
											className: "rounded shadow-sm shrink-0",
											style: {
												width: "48px",
												height: "32px",
												minWidth: "48px",
												maxWidth: "48px"
											}
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
				id: "coaching-desktop",
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
				id: "approvals-desktop",
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
					className: "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
					children: approvals.slice(0, 4).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalCard, {
						a,
						i
					}, a.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "reviews-desktop",
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
							className: "mt-12 grid gap-6 md:grid-cols-3",
							children: visibleTestimonialsDesktop.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, {
								t,
								featured: i === 1
							}, t.name))
						}),
						testimonials.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowAllTestimonials(!showAllTestimonials),
								className: "rounded-full border border-forest-900/20 bg-white px-7 py-3.5 font-bold text-forest-900 shadow-sm transition hover:bg-forest-900 hover:text-white",
								children: showAllTestimonials ? "Show Fewer Reviews ↑" : `Show More Reviews (${testimonials.length - 3}+ और देखें) ↓`
							})
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
					className: "mt-12 grid gap-6 md:grid-cols-3",
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
		]
	})] });
}
export { Home as component };
