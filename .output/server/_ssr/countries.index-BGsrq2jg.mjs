import { __toESM } from "../_runtime.mjs";
import { Link, require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { countries } from "./site-settings-DNyZ2OvY.mjs";
import { ArrowRight, Check } from "../_libs/lucide-react.mjs";
import { CountryFlag } from "./router-Dd9cECFi.mjs";
import { PageHero } from "./Section-D80DXzE3.mjs";
// node_modules/.nitro/vite/services/ssr/assets/countries.index-BGsrq2jg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CountriesPage() {
	const [selectedSlugs, setSelectedSlugs] = (0, import_react.useState)([]);
	const [showComparison, setShowComparison] = (0, import_react.useState)(false);
	const [compareNotice, setCompareNotice] = (0, import_react.useState)("");
	const selectedCountries = countries.filter((country) => country.studyGuide).filter((country) => selectedSlugs.includes(country.slug));
	function toggleCompare(slug, name) {
		if (selectedSlugs.includes(slug)) {
			const next = selectedSlugs.filter((item) => item !== slug);
			setSelectedSlugs(next);
			setCompareNotice("");
			if (next.length < 2) setShowComparison(false);
			return;
		}
		if (selectedSlugs.length >= 3) {
			setCompareNotice("Compare up to three destinations at a time. Remove one to add another.");
			return;
		}
		setSelectedSlugs([...selectedSlugs, slug]);
		setCompareNotice(name + " added to your comparison.");
	}
	function openComparison() {
		if (selectedSlugs.length < 2) return;
		setShowComparison(true);
		window.setTimeout(() => document.getElementById("country-comparison")?.scrollIntoView({ block: "start" }), 0);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: "Destinations",
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Study abroad with a plan. ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-coral-500",
					children: "One team"
				}),
				" to guide your next step."
			] }),
			intro: "Explore destination guides, compare a shortlist, and talk with our team about the country you have in mind."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto mt-8 max-w-7xl px-6 pb-40 md:mt-10",
			"aria-label": "Compare study destinations",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-2xl text-sm text-forest-900/65",
						children: "Build a shortlist of two or three destinations. Compare cost estimates, visa funds and route conditions side by side."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-full bg-forest-50 px-3 py-1.5 font-mono text-xs font-bold text-forest-700",
						"aria-live": "polite",
						children: [selectedSlugs.length, " / 3 selected"]
					})]
				}),
				compareNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900",
					role: "status",
					children: compareNotice
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 md:grid-cols-2",
					children: countries.map((country) => {
						const selected = selectedSlugs.includes(country.slug);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "group grid overflow-hidden rounded-3xl bg-white ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0] hover:shadow-forest-900 lg:grid-cols-[1fr_auto]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/countries/$slug",
								params: { slug: country.slug },
								className: "block p-5 focus-visible:z-10 sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
										code: country.code,
										flag: country.flag,
										country: country.name,
										className: "h-8 w-12 shrink-0 shadow-sm sm:h-10 sm:w-14"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-4 text-2xl font-extrabold text-forest-900 sm:mt-5 sm:text-3xl",
										children: country.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-forest-900/65 sm:mt-2 sm:text-base",
										children: country.headline
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2",
										children: [
											country.visas.slice(0, 2).map((visa, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "max-w-full rounded-full bg-forest-50 px-2.5 py-1 text-[10px] font-semibold leading-tight text-forest-700 sm:hidden",
												children: visa
											}, "mobile-" + index)),
											country.visas.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-forest-50 px-2.5 py-1 text-[10px] font-semibold leading-tight text-forest-700 sm:hidden",
												children: [
													"+",
													country.visas.length - 2,
													" more"
												]
											}),
											country.visas.slice(0, 4).map((visa, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden max-w-full rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold leading-tight text-forest-700 sm:inline-flex",
												children: visa
											}, "desktop-" + index))
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-coral-600 sm:mt-5 sm:text-sm",
										children: ["View destination guide ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
											"aria-hidden": "true",
											className: "size-4 transition group-hover:translate-x-1"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-4 border-t-2 border-dashed border-forest-900/10 bg-cream p-4 lg:w-56 lg:border-t-0 lg:border-l-2 lg:p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-3 lg:grid-cols-1",
									children: country.stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-widest text-forest-900/50",
										children: stat.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display font-bold text-forest-900",
										children: stat.value
									})] }, stat.label))
								}), country.studyGuide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": selected,
									"aria-label": (selected ? "Remove " : "Add ") + country.name + (selected ? " from study comparison" : " to study comparison"),
									onClick: () => toggleCompare(country.slug, country.name),
									className: "flex min-h-11 w-fit self-start items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 lg:w-full lg:self-stretch " + (selected ? "border-forest-900 bg-forest-900 text-white hover:bg-forest-800" : "border-forest-900/15 bg-white text-forest-900 hover:border-coral-500 hover:bg-coral-50"),
									children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										"aria-hidden": "true",
										className: "size-4"
									}), " Selected"] }) : "＋ Compare study"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "max-w-48 text-xs leading-relaxed text-forest-900/60",
									children: "Visitor guide · study over 90 days uses a country-specific route."
								})]
							})]
						}, country.slug);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3 rounded-2xl border border-forest-900/10 bg-cream px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-extrabold text-forest-900",
						children: "Looking at another study destination?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-forest-900/65",
						children: "We guide students on study routes beyond the guides shown here. Tell us which country you’re considering."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contact",
						className: "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-forest-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-forest-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
						children: ["Ask our team ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							"aria-hidden": "true",
							className: "size-4"
						})]
					})]
				}),
				showComparison && selectedCountries.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "country-comparison",
					"aria-labelledby": "country-comparison-title",
					className: "mt-12 scroll-mt-28 rounded-[2rem] bg-forest-900 bg-grain p-5 text-white md:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-coral-400",
									children: "Study guide · side by side"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									id: "country-comparison-title",
									className: "mt-2 text-2xl font-extrabold md:text-3xl",
									children: "Compare your shortlist"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-2xl text-sm text-forest-100/70",
									children: "Compare tuition estimates, student visa charges, proof of funds, admissions and English requirements, work conditions, post-study routes and common intake windows. Each item links to official guidance."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowComparison(false),
								className: "min-h-11 rounded-full border border-white/25 px-4 py-2 text-xs font-bold text-white hover:bg-white/10",
								children: "Close comparison"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3",
							children: selectedCountries.map((country) => {
								const guide = country.studyGuide;
								if (!guide) return null;
								const facts = [
									{
										label: "Tuition estimate",
										value: guide.tuitionEstimate
									},
									{
										label: "Student visa fee",
										value: guide.studentVisaFee
									},
									{
										label: "Proof of funds",
										value: guide.proofOfFunds
									},
									{
										label: "Admission & English",
										value: guide.admissionAndEnglish
									},
									{
										label: "Work while studying",
										value: guide.workWhileStudying
									},
									{
										label: "Post-study option",
										value: guide.postStudyOption
									}
								];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "rounded-2xl bg-white p-5 text-forest-900 ring-1 ring-white/20",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 border-b border-forest-900/10 pb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
												code: country.code,
												flag: country.flag,
												country: country.name,
												className: "h-8 w-12 shrink-0 shadow-sm"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-xl font-extrabold",
												children: country.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-forest-900/55",
												children: ["Study destination · checked ", guide.lastVerified]
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "text-xs font-bold uppercase tracking-wider text-forest-900/55",
													children: "Common intake windows"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 flex flex-wrap gap-2",
													children: country.intakes.map((intake) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700",
														children: intake
													}, intake))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-xs leading-relaxed text-forest-900/60",
													children: guide.intakesNote
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
											className: "mt-4 space-y-3",
											children: facts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-cream p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "text-xs font-bold uppercase tracking-wider text-forest-900/55",
													children: fact.label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "mt-1 text-sm leading-relaxed text-forest-900/80",
													children: fact.value
												})]
											}, fact.label))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 border-t border-forest-900/10 pt-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-bold uppercase tracking-wider text-forest-900/55",
												children: "Official sources"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 flex flex-wrap gap-x-4 gap-y-1",
												children: guide.sources.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: source.url,
													target: "_blank",
													rel: "noreferrer",
													className: "inline-flex min-h-11 items-center gap-1 text-xs font-bold text-coral-600 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
													children: [
														source.label,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
															"aria-hidden": "true",
															className: "size-3"
														})
													]
												}, source.url))
											})]
										})
									]
								}, country.slug);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-forest-100/75",
							children: "Tuition estimates are for planning and vary by provider, programme and location. Proof-of-funds figures are visa evidence amounts, separate from tuition and actual living costs. Work and post-study routes depend on your visa, course and personal eligibility. Check linked official rules before making an application."
						})
					]
				})
			]
		}),
		selectedSlugs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-x-3 bottom-20 z-40 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl bg-forest-950 p-3 text-white shadow-xl ring-1 ring-white/15 sm:inset-x-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"aria-live": "polite",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[10px] font-bold uppercase tracking-wider text-coral-300",
					children: [selectedSlugs.length, " / 3 selected"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-white/75",
					children: selectedSlugs.length < 2 ? "Choose one more" : "Ready to compare"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setSelectedSlugs([]);
						setShowComparison(false);
						setCompareNotice("");
					},
					className: "min-h-11 rounded-full px-3 py-2 text-xs font-bold text-white/80 hover:bg-white/10",
					children: "Clear"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: selectedSlugs.length < 2,
					onClick: openComparison,
					className: "min-h-11 rounded-full bg-coral-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-coral-600 disabled:cursor-not-allowed disabled:opacity-50",
					children: [
						"Compare ",
						selectedSlugs.length,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							"aria-hidden": "true",
							className: "ml-1 inline size-3.5"
						})
					]
				})]
			})]
		})
	] });
}
export { CountriesPage as component };
