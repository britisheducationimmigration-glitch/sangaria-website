import { __toESM } from "../_runtime.mjs";
import { Link, require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { countries, site, visaServices } from "./site-settings-DNyZ2OvY.mjs";
import { defaultCashflowData } from "./cashflow-i4Ureh_B.mjs";
import { getPublicCashflow } from "./public-functions-CqsoBxoJ.mjs";
import { ArrowLeft, ArrowRight, Award, BadgeCheck, Headphones, HeartHandshake, MapPin, MessageCircle, Pause, Plane, Play, RotateCcw, ShieldCheck, Timer, X, Zap } from "../_libs/lucide-react.mjs";
import { CountryFlag, EnquiryForm, Route$17, img } from "./router-Dd9cECFi.mjs";
import { ApprovalCard, PostCard, TestimonialCard } from "./Cards-jSvl4-wr.mjs";
import { Eyebrow } from "./Section-D80DXzE3.mjs";
import { ServiceIcon } from "./ServiceIcon-Bq0xIDoz.mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-sD7aONBO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BoardingPassGenerator() {
	const [name, setName] = (0, import_react.useState)("");
	const [origin, setOrigin] = (0, import_react.useState)("Sangaria (SNG)");
	const [customOrigin, setCustomOrigin] = (0, import_react.useState)("");
	const [dest, setDest] = (0, import_react.useState)("Toronto, Canada (YYZ)");
	const [customDest, setCustomDest] = (0, import_react.useState)("");
	const [visa, setVisa] = (0, import_react.useState)("Study Visa");
	const [customVisa, setCustomVisa] = (0, import_react.useState)("");
	const [intake, setIntake] = (0, import_react.useState)("Winter / Jan 2027");
	const [customIntake, setCustomIntake] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const displayOrigin = origin === "CUSTOM" ? customOrigin.trim() || "Custom City" : origin;
	const orgCode = origin === "CUSTOM" ? customOrigin.trim().slice(0, 3).toUpperCase() || "ORG" : origin.includes("(") ? origin.split("(")[1].replace(")", "") : "SNG";
	const displayDest = dest === "CUSTOM" ? customDest.trim() || "Dream Destination" : dest;
	const destCode = dest === "CUSTOM" ? customDest.trim().slice(0, 3).toUpperCase() || "DST" : dest.includes("(") ? dest.split("(")[1].replace(")", "") : "YYZ";
	const displayVisa = visa === "CUSTOM" ? customVisa.trim() || "Global Career" : visa;
	const displayIntake = intake === "CUSTOM" ? customIntake.trim() || "2027 Intake" : intake;
	const year = displayIntake.match(/202[6-9]/)?.[0] || "2027";
	const passName = name.trim().toUpperCase() || "PASSENGER";
	const shareText = `✈️ My Future Flight Boarding Pass:\n👤 Passenger: ${passName}\n📍 Origin: ${displayOrigin}\n🌍 Destination: ${displayDest}\n🎯 Visa Goal: ${displayVisa}\n📅 Intake: ${displayIntake}\n\n🏛️ British Education & Immigration, Sangaria\n👉 Check eligibility: https://britisheducationandimmigration.com`;
	const shareWA = () => {
		window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
	};
	const handleMakeReal = () => {
		setOpen(false);
		window.location.href = "/contact";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "boarding-pass-section",
		className: "relative overflow-hidden bg-forest-950 py-16 px-4 sm:px-6 border-y border-white/10 text-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-5xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-forest-900 border border-white/15 px-3.5 py-1 text-xs font-semibold text-coral-400 mb-3 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "size-3.5" }), " Virtual Flight Pass · Sangaria to World"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-3xl sm:text-4xl font-extrabold tracking-tight",
						children: ["Design Your ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-gradient-to-r from-amber-300 via-amber-100 to-coral-400 bg-clip-text text-transparent",
							children: "2027 Boarding Pass"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs sm:text-sm text-forest-100/75",
						children: "Fill details or type your own city below to generate your personalized international boarding pass."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl bg-forest-900/95 border border-white/15 p-6 sm:p-8 shadow-2xl backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-white/85 mb-1.5",
							children: "Passenger Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Enter passenger name",
							className: "w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-2.5 text-sm font-semibold text-white placeholder-white/40 focus:outline-none focus:border-coral-400"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-bold text-white/85 mb-1.5 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-coral-400" }), " Origin City"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: origin,
										onChange: (e) => setOrigin(e.target.value),
										className: "w-full rounded-xl bg-forest-950 border border-white/20 px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Sangaria (SNG)",
												children: "📍 Sangaria (SNG)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Hanumangarh (HNM)",
												children: "📍 Hanumangarh (HNM)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Sri Ganganagar (SGNR)",
												children: "📍 Sri Ganganagar (SGNR)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Bathinda (BTI)",
												children: "📍 Bathinda (BTI)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Delhi NCR (DEL)",
												children: "📍 Delhi NCR (DEL)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Amritsar (ATQ)",
												children: "📍 Amritsar (ATQ)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "CUSTOM",
												children: "✏️ Other City (Type your city...)"
											})
										]
									}),
									origin === "CUSTOM" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: customOrigin,
										onChange: (e) => setCustomOrigin(e.target.value),
										placeholder: "Type departure city (e.g. Abohar, Sirsa)...",
										className: "mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-bold text-white/85 mb-1.5 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "size-3.5 text-coral-400" }), " Dream Destination"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: dest,
										onChange: (e) => setDest(e.target.value),
										className: "w-full rounded-xl bg-forest-950 border border-white/20 px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Toronto, Canada (YYZ)",
												children: "🇨🇦 Toronto, Canada (YYZ)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Vancouver, Canada (YVR)",
												children: "🇨🇦 Vancouver, Canada (YVR)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "London, UK (LHR)",
												children: "🇬🇧 London, UK (LHR)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Melbourne, Australia (MEL)",
												children: "🇦🇺 Melbourne, Australia (MEL)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Sydney, Australia (SYD)",
												children: "🇦🇺 Sydney, Australia (SYD)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "New York, USA (JFK)",
												children: "🇺🇸 New York, USA (JFK)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Berlin, Germany (BER)",
												children: "🇩🇪 Berlin, Germany (BER)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Auckland, NZ (AKL)",
												children: "🇳🇿 Auckland, NZ (AKL)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "CUSTOM",
												children: "✏️ Other Destination (Type city...)"
											})
										]
									}),
									dest === "CUSTOM" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: customDest,
										onChange: (e) => setCustomDest(e.target.value),
										placeholder: "Type destination city (e.g. Calgary, Dublin)...",
										className: "mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-white/85 mb-1.5",
										children: "Visa Category"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: visa,
										onChange: (e) => setVisa(e.target.value),
										className: "w-full rounded-xl bg-forest-950 border border-white/20 px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Study Visa",
												children: "🎓 Study Visa"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Permanent Residency (PR)",
												children: "🏛️ Permanent Residency (PR)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Work Permit",
												children: "💼 Work Permit"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Spouse Visa",
												children: "💍 Spouse Open Work Permit"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Tourist Visa",
												children: "✈️ Tourist Visa"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "CUSTOM",
												children: "✏️ Other Visa (Type custom...)"
											})
										]
									}),
									visa === "CUSTOM" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: customVisa,
										onChange: (e) => setCustomVisa(e.target.value),
										placeholder: "Type your visa goal...",
										className: "mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-white/85 mb-1.5",
										children: "Target Intake"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: intake,
										onChange: (e) => setIntake(e.target.value),
										className: "w-full rounded-xl bg-forest-950 border border-white/20 px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Winter / Jan 2027",
												children: "❄️ Winter / Jan 2027"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Spring / May 2027",
												children: "🌸 Spring / May 2027"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Fall / Sept 2027",
												children: "🍁 Fall / Sept 2027"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Winter / Jan 2028",
												children: "❄️ Winter / Jan 2028"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Immediate 2026",
												children: "⚡ Immediate 2026"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "CUSTOM",
												children: "✏️ Other Intake (Type year...)"
											})
										]
									}),
									intake === "CUSTOM" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: customIntake,
										onChange: (e) => setCustomIntake(e.target.value),
										placeholder: "Type intake (e.g. Fall 2027)...",
										className: "mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4 border-t border-white/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setOpen(true),
								className: "w-full flex items-center justify-center gap-2 rounded-2xl bg-coral-500 hover:bg-coral-600 py-3.5 px-6 text-sm font-extrabold text-white shadow-xl transition active:scale-[0.98] cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✨ Generate My Boarding Pass ➔" })
							})
						})
					]
				})
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/85 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-lg rounded-3xl bg-forest-900 border border-white/20 p-5 shadow-2xl max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-white/10 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-extrabold text-white",
							children: "✨ Your Boarding Pass is Ready!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOpen(false),
							className: "rounded-full p-1.5 text-white/70 hover:text-white transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-cream text-forest-950 shadow-2xl border border-forest-900/15 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-forest-900 px-4 py-2.5 text-white flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-black",
								children: "BRITISH EDUCATION & IMMIGRATION"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-coral-500 px-2 py-0.5 font-mono text-[9px] font-bold uppercase",
								children: "OFFICIAL PASS"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 sm:p-5 bg-[#fffdf7]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-3 border-b border-forest-900/10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[9px] font-bold text-forest-900/60 uppercase",
												children: "ORIGIN"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-3xl font-black text-forest-900 leading-none mt-0.5",
												children: orgCode
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] font-semibold text-forest-900/75 mt-0.5",
												children: displayOrigin.split("(")[0]
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[8px] font-mono font-bold text-coral-600 uppercase",
													children: "NON-STOP"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 text-coral-500 my-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-0.5 bg-coral-400 border-dashed" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "size-4 transform rotate-90" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-0.5 bg-coral-400 border-dashed" })
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[9px] text-forest-900/60 font-bold",
													children: ["BEI · ", year]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[9px] font-bold text-forest-900/60 uppercase",
													children: "DESTINATION"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-3xl font-black text-forest-900 leading-none mt-0.5",
													children: destCode
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] font-semibold text-forest-900/75 mt-0.5",
													children: displayDest.split(",")[0]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2.5 py-3 text-xs border-b border-forest-900/10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[9px] font-mono text-forest-900/60 uppercase",
											children: "Passenger"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-forest-900 truncate block text-sm",
											children: passName
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[9px] font-mono text-forest-900/60 uppercase",
											children: "Visa Goal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-forest-900 truncate block",
											children: displayVisa
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[9px] font-mono text-forest-900/60 uppercase",
											children: "Intake"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-forest-900 truncate block",
											children: displayIntake
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[9px] font-mono text-forest-900/60 uppercase",
											children: "Flight / Seat"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-forest-900 truncate block",
											children: [
												"BEI-",
												year,
												" · 01A"
											]
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-3 flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-[2px] h-6 opacity-80",
											"aria-hidden": true,
											children: [
												12,
												24,
												8,
												16,
												26,
												6,
												20,
												14,
												26,
												10,
												22,
												16,
												12,
												26,
												8,
												18,
												22,
												10
											].map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bg-forest-950",
												style: {
													width: i % 3 === 0 ? "2.5px" : "1.5px",
													height: `${h}px`
												}
											}, i))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[8px] text-forest-900/60 tracking-widest mt-0.5",
											children: [
												"BEI-",
												orgCode,
												"-",
												destCode,
												"-",
												year
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border-2 border-dashed border-coral-500 bg-coral-50 px-2.5 py-1 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] font-black uppercase text-coral-600 block leading-tight",
											children: "VISA APPROVED"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[8px] font-bold text-forest-900/70 block",
											children: "Sangaria Office"
										})]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: shareWA,
								className: "w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 px-4 text-xs font-bold text-white shadow-lg transition active:scale-[0.98] cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Share Pass on WhatsApp Status" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setOpen(false),
								className: "w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-2.5 px-3 text-xs font-semibold text-white transition active:scale-[0.98] cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5 text-coral-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Change / Edit Details" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleMakeReal,
								className: "w-full flex items-center justify-center gap-2 rounded-xl bg-coral-500 hover:bg-coral-600 py-3 px-4 text-xs font-extrabold text-white shadow-md transition active:scale-[0.98] cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Make This Flight Real ➔ Book Free Counselling" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
							})
						]
					})
				]
			})
		})]
	});
}
function FamilyCashflowPlanner() {
	const [data, setData] = (0, import_react.useState)(defaultCashflowData);
	const [selectedSlug, setSelectedSlug] = (0, import_react.useState)("canada");
	(0, import_react.useEffect)(() => {
		let active = true;
		getPublicCashflow().then((saved) => {
			if (active && Array.isArray(saved) && saved.length > 0) setData(saved);
		}).catch(() => {});
		return () => {
			active = false;
		};
	}, []);
	const country = data.find((c) => c.slug === selectedSlug) || data[0];
	const handleDownloadPDF = () => {
		const printWindow = window.open("", "_blank", "width=850,height=900");
		if (!printWindow) {
			alert("Please allow popups to print/download the summary.");
			return;
		}
		const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${country.name} Cashflow Budget - British Education Sangaria</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #081c15; margin: 0; padding: 20px; font-size: 13px; line-height: 1.4; }
            .header { border-bottom: 2px solid #e11d48; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
            .brand-title { font-size: 20px; font-weight: 800; color: #081c15; margin: 0; text-transform: uppercase; }
            .brand-sub { font-size: 11px; color: #555; margin-top: 4px; }
            .country-badge { background: #081c15; color: white; padding: 6px 14px; border-radius: 9999px; font-weight: 800; font-size: 14px; display: inline-block; margin-bottom: 12px; }
            .summary-box { background: #fdf2f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 12px 16px; margin-bottom: 18px; }
            .total-val { font-size: 22px; font-weight: 900; color: #e11d48; margin-top: 2px; }
            .rule-note { font-size: 11px; color: #4b5563; margin-top: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #081c15; color: white; text-align: left; padding: 8px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-size: 11.5px; vertical-align: top; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .stage-badge { font-weight: 800; color: #e11d48; font-size: 13px; }
            .amount { font-weight: 800; font-size: 13px; color: #081c15; }
            .refund { color: #047857; font-weight: 700; font-size: 10.5px; }
            .footer { margin-top: 25px; border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 10.5px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="brand-title">British Education & Immigration</h1>
              <div class="brand-sub">Near Open Book Library, Bhagatpura Road, Sangaria (Rajasthan) · Phone: +91 9772570478</div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #666;">
              Official Session 2026/2027<br>
              Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric"
		})}
            </div>
          </div>

          <div class="country-badge">${country.flag} ${country.name} Study Visa — Family Cashflow Roadmap</div>
          
          <div class="summary-box">
            <span style="font-size: 10px; font-weight: 700; color: #e11d48; text-transform: uppercase; letter-spacing: 0.05em;">Estimated 1st-year planning total</span>
            <div class="total-val">${country.totalEstimateINR}</div>
            <div class="rule-note"><strong>Visa and budget guidance:</strong> ${country.officialRuleNote}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 16%;">Stage & Time</th>
                <th style="width: 32%;">Expense Title & Detail</th>
                <th style="width: 24%;">Approx. Budget Amount (INR / Forex)</th>
                <th style="width: 28%;">Paid Directly To & Refund</th>
              </tr>
            </thead>
            <tbody>
              ${country.stages.map((st) => `
                <tr>
                  <td><span class="stage-badge">Stage 0${st.stageNumber}</span><br><span style="color:#666; font-size:10px;">${st.timeline}</span></td>
                  <td><strong>${st.title}</strong><br><span style="color:#555; font-size:10.5px;">${st.description}</span></td>
                  <td><span class="amount">${st.inrEstimate}</span><br><span style="color:#e11d48; font-size:10px; font-weight:700;">${st.officialCost}</span></td>
                  <td><strong>${st.paidTo}</strong><br><span class="refund">✓ ${st.refundableInfo}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Transparency Notice: Student pays fees directly to college/embassy accounts. Zero hidden charges. For counselling: +91 9772570478.</p>
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          <\/script>
        </body>
      </html>
    `;
		printWindow.document.open();
		printWindow.document.write(htmlContent);
		printWindow.document.close();
	};
	const handleWhatsAppShare = () => {
		let msg = `✈️ *British Education & Immigration, Sangaria*\n`;
		msg += `📋 *Family Visa Budget & Cashflow Planner*\n\n`;
		msg += `🌍 *Destination Country:* ${country.name} ${country.flag}\n`;
		msg += `💰 *Estimated planning total:* ${country.totalEstimateINR}\n`;
		msg += `📌 *Visa and budget guidance:* ${country.officialRuleNote}\n\n`;
		msg += `--- *STAGE-BY-STAGE EXPENSES* ---\n`;
		country.stages.forEach((st) => {
			msg += `\n*Stage 0${st.stageNumber}: ${st.title}*\n`;
			msg += `⏱️ When: ${st.timeline}\n`;
			msg += `💵 Approx: ${st.inrEstimate} (${st.officialCost})\n`;
			msg += `🏛️ Paid to: ${st.paidTo}\n`;
			msg += `🛡️ Refund: ${st.refundableInfo}\n`;
		});
		msg += `\n📞 *Office Contact / WhatsApp:* +91 9772570478\n`;
		msg += `📍 Near Open Book Library, Bhagatpura Road, Sangaria (Raj.)\n`;
		msg += `👉 Website: https://britisheducationandimmigration.com`;
		window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto mt-8 w-full rounded-3xl bg-forest-900 p-5 text-white sm:p-8 md:w-[calc(100%-3rem)] max-w-7xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-between gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-coral-400",
						children: "Transparent Financial Roadmap"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl sm:text-3xl font-extrabold tracking-tight mt-1",
						children: "Family Cashflow Planner"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-sm text-forest-100/70 mt-1 max-w-xl",
						children: "Estimated payment stages plus any funds you may need to show. Totals are planning estimates."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-fit shrink-0 gap-2 sm:ml-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleDownloadPDF,
						className: "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📄" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Summary" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleWhatsAppShare,
						className: "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-bold text-white transition hover:brightness-105 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💬" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WhatsApp" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 overflow-x-auto py-4 scrollbar-none",
				children: data.map((c) => {
					const isActive = c.slug === selectedSlug;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSelectedSlug(c.slug),
						className: `flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${isActive ? "bg-coral-500 text-white shadow-md" : "bg-white/10 text-white/80 ring-1 ring-white/10 hover:bg-white/20"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.flag }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name })]
					}, c.slug);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-wider text-coral-400 font-bold",
					children: "Estimated First-year Budget"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xl sm:text-2xl font-black text-white",
					children: country.totalEstimateINR
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-forest-100/80 sm:max-w-md leading-relaxed border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4 pt-2 sm:pt-0",
					children: ["💡 ", country.officialRuleNote]
				})]
			}),
			country.officialSources?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "-mt-2 mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-bold text-coral-300",
					children: "Official sources:"
				}), country.officialSources.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: source.url,
					target: "_blank",
					rel: "noreferrer",
					className: "text-white/75 underline decoration-white/30 underline-offset-2 hover:text-white",
					children: source.label
				}, source.url))]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4",
				children: country.stages.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-white/10 p-3.5 sm:p-4 ring-1 ring-white/10 flex flex-col justify-between hover:bg-white/15 transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-1 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs font-extrabold text-coral-400",
								children: ["0", st.stageNumber]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80",
								children: st.timeline
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-extrabold text-xs sm:text-sm text-white line-clamp-2 leading-tight",
							children: st.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-forest-100/60 mt-1 line-clamp-2",
							children: ["Paid to: ", st.paidTo]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 pt-2 border-t border-white/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm font-black text-coral-300",
								children: st.inrEstimate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-white/50 font-mono mt-0.5",
								children: st.officialCost
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[9px] text-emerald-400 mt-1 line-clamp-1",
								children: ["✓ ", st.refundableInfo]
							})
						]
					})]
				}, st.stageNumber))
			})
		]
	});
}
function CertificateCarousel({ certificates, id }) {
	const featured = (0, import_react.useMemo)(() => certificates.filter((item) => item.published && item.homepageFeatured).sort((a, b) => a.sortOrder - b.sortOrder), [certificates]);
	const [visibleCount, setVisibleCount] = (0, import_react.useState)(1);
	const [pageIndex, setPageIndex] = (0, import_react.useState)(0);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [reducedMotion, setReducedMotion] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const media = window.matchMedia("(min-width: 768px)");
		const update = () => setVisibleCount(media.matches ? 3 : 1);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);
	(0, import_react.useEffect)(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReducedMotion(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);
	const pages = [];
	for (let index = 0; index < featured.length; index += visibleCount) pages.push(featured.slice(index, index + visibleCount));
	(0, import_react.useEffect)(() => {
		setPageIndex(0);
	}, [visibleCount]);
	(0, import_react.useEffect)(() => {
		if (reducedMotion || paused || pages.length < 2) return;
		const timer = window.setInterval(() => setPageIndex((current) => (current + 1) % pages.length), 7e3);
		return () => window.clearInterval(timer);
	}, [
		pages.length,
		paused,
		reducedMotion
	]);
	if (!featured.length) return null;
	const currentPage = Math.min(pageIndex, pages.length - 1);
	const visible = pages[currentPage] ?? pages[0];
	const changePage = (direction) => setPageIndex((current) => (current + direction + pages.length) % pages.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id,
		"aria-label": "Our certificates and training",
		"aria-roledescription": "carousel",
		className: "border-b border-forest-900/10 bg-sand/60 px-5 py-14 md:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl",
			onMouseEnter: () => setPaused(true),
			onMouseLeave: () => setPaused(false),
			onFocusCapture: () => setPaused(true),
			onBlurCapture: (event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Our credentials" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-2xl font-extrabold text-forest-900 md:text-4xl",
							children: "Partners, training & recognition."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm leading-relaxed text-forest-900/65",
							children: "A selection of our partner authorisations, professional training and recognitions."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/certificates",
						className: "inline-flex min-h-11 items-center gap-2 text-sm font-bold text-coral-600 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
						children: ["View all certificates ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							"aria-hidden": "true",
							className: "size-4"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-3",
					"aria-live": paused ? "polite" : "off",
					children: visible.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/certificates",
						"aria-label": `View ${item.title} in the certificates gallery`,
						className: "block min-w-0 rounded-2xl bg-white p-3 ring-1 ring-forest-900/10 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 sm:p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid aspect-[4/3] min-h-0 w-full place-items-center overflow-hidden rounded-xl bg-cream p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.imageSrc,
								alt: item.altText,
								loading: "lazy",
								decoding: "async",
								className: "certificate-image-enhanced block h-full w-full min-h-0 min-w-0 object-contain"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-1 pb-1 pt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold uppercase tracking-[0.14em] text-coral-600",
									children: item.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 font-display text-base font-bold leading-snug text-forest-900",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-forest-900/60",
									children: item.issuer
								})
							]
						})]
					}, item.id))
				}),
				pages.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-forest-900/60",
						"aria-live": "polite",
						children: [
							"Showing ",
							currentPage + 1,
							" of ",
							pages.length,
							" certificate groups"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => changePage(-1),
								"aria-label": "Show previous certificates",
								className: "grid size-11 place-items-center rounded-full border border-forest-900/20 bg-white text-forest-900 hover:bg-forest-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
									"aria-hidden": "true",
									className: "size-4"
								})
							}),
							!reducedMotion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPaused((current) => !current),
								"aria-label": paused ? "Resume certificate rotation" : "Pause certificate rotation",
								className: "grid size-11 place-items-center rounded-full border border-forest-900/20 bg-white text-forest-900 hover:bg-forest-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
								children: paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									"aria-hidden": "true",
									className: "size-4"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
									"aria-hidden": "true",
									className: "size-4"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => changePage(1),
								"aria-label": "Show next certificates",
								className: "grid size-11 place-items-center rounded-full border border-forest-900/20 bg-white text-forest-900 hover:bg-forest-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									"aria-hidden": "true",
									className: "size-4"
								})
							})
						]
					})]
				})
			]
		})
	});
}
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
var rotatingWords = [
	{
		text: "the visa.",
		icon: "✈️"
	},
	{
		text: "Canada PR.",
		icon: "🇨🇦"
	},
	{
		text: "Study Permits.",
		icon: "🎓"
	},
	{
		text: "UK Degrees.",
		icon: "🇬🇧"
	},
	{
		text: "IELTS 7.5+.",
		icon: "📚"
	}
];
var homeJumpSections = [
	{
		id: "services",
		icon: "✈️",
		desktopLabel: "Services",
		mobileLabel: "Services"
	},
	{
		id: "destinations",
		icon: "🌍",
		desktopLabel: "Countries",
		mobileLabel: "Countries"
	},
	{
		id: "coaching",
		icon: "📚",
		desktopLabel: "IELTS & PTE",
		mobileLabel: "IELTS & PTE"
	},
	{
		id: "approvals",
		icon: "🎉",
		desktopLabel: "Recent Visas",
		mobileLabel: "Visas"
	},
	{
		id: "certificates",
		icon: "🏅",
		desktopLabel: "Certificates",
		mobileLabel: "Certificates"
	},
	{
		id: "reviews",
		icon: "⭐",
		desktopLabel: "Reviews",
		mobileLabel: "Reviews"
	}
];
function Home() {
	const { approvals, posts, testimonials, certificates, settings } = Route$17.useLoaderData();
	const homepageApprovals = approvals.filter((story) => story.homepageFeatured !== false);
	const homepageTestimonials = testimonials.filter((story) => story.homepageFeatured !== false);
	const [selectedCountry, setSelectedCountry] = (0, import_react.useState)("canada");
	const [selectedVisa, setSelectedVisa] = (0, import_react.useState)("study");
	const [showAllTestimonials, setShowAllTestimonials] = (0, import_react.useState)(false);
	const [showAllTestimonialsMobile, setShowAllTestimonialsMobile] = (0, import_react.useState)(false);
	const [wordIndex, setWordIndex] = (0, import_react.useState)(0);
	const [fade, setFade] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let transitionTimer;
		const rotationTimer = window.setInterval(() => {
			setFade(false);
			transitionTimer = window.setTimeout(() => {
				setWordIndex((current) => (current + 1) % rotatingWords.length);
				setFade(true);
			}, 250);
		}, 3e3);
		return () => {
			window.clearInterval(rotationTimer);
			if (transitionTimer !== void 0) window.clearTimeout(transitionTimer);
		};
	}, []);
	const [isMobileSticky, setIsMobileSticky] = (0, import_react.useState)(false);
	const [isDesktopSticky, setIsDesktopSticky] = (0, import_react.useState)(false);
	const [headerOffset, setHeaderOffset] = (0, import_react.useState)(68);
	const [desktopJumpHeight, setDesktopJumpHeight] = (0, import_react.useState)(52);
	const mobileRef = (0, import_react.useRef)(null);
	const desktopRef = (0, import_react.useRef)(null);
	const desktopBarRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleScroll = () => {
			const headerEl = document.getElementById("site-main-header");
			const h = headerEl ? headerEl.offsetHeight : 68;
			setHeaderOffset(h);
			if (mobileRef.current) {
				const rect = mobileRef.current.getBoundingClientRect();
				setIsMobileSticky(rect.top <= h);
			}
			if (desktopRef.current) {
				const rect = desktopRef.current.getBoundingClientRect();
				setIsDesktopSticky(rect.top <= h);
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleScroll);
		handleScroll();
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const bar = desktopBarRef.current;
		if (!bar) return;
		const measure = () => setDesktopJumpHeight(Math.max(52, Math.ceil(bar.getBoundingClientRect().height)));
		measure();
		const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
		observer?.observe(bar);
		window.addEventListener("resize", measure);
		return () => {
			observer?.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, []);
	const visibleJumpSections = homeJumpSections.filter((section) => {
		if (section.id === "approvals") return homepageApprovals.length > 0;
		if (section.id === "certificates") return certificates.some((certificate) => certificate.published && certificate.homepageFeatured);
		if (section.id === "reviews") return homepageTestimonials.length > 0;
		return true;
	});
	const visibleTestimonialsDesktop = showAllTestimonials ? homepageTestimonials : homepageTestimonials.slice(0, 3);
	const visibleTestimonialsMobile = showAllTestimonialsMobile ? homepageTestimonials : homepageTestimonials.slice(0, 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "block lg:hidden bg-cream text-forest-900",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block animate-rise",
								children: "Pack your bags."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative inline-block animate-rise [animation-delay:100ms]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-gradient-to-r from-amber-300 via-amber-100 to-coral-400 bg-clip-text text-transparent [-webkit-background-clip:text] font-extrabold",
									children: "We’ll handle"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 300 20",
									className: "absolute -bottom-2 left-0 w-full overflow-visible",
									"aria-hidden": true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M2 15 Q 75 2 150 10 T 298 6",
										fill: "none",
										stroke: "#c4515d",
										strokeWidth: "5",
										strokeLinecap: "round",
										style: {
											strokeDasharray: 320,
											strokeDashoffset: 0,
											animation: "penDraw 1.3s cubic-bezier(0.2, 0.7, 0.2, 1) forwards"
										}
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-2 h-[1.15em] overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2 transition-all duration-300 transform " + (fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white",
										children: rotatingWords[wordIndex].text
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-block text-2xl animate-bounce",
										children: rotatingWords[wordIndex].icon
									})]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-forest-100/85",
						children: "Study visas, PR, work permits, tourist visas & IELTS/PTE coaching for Canada, UK, Australia, USA, NZ & Europe — right here in Sangaria."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 rounded-3xl bg-forest-950/90 border border-white/20 p-4 shadow-2xl overflow-hidden",
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
										htmlFor: "mobile-country",
										className: "block text-[10px] font-bold text-white/80 mb-1",
										children: "Country"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "mobile-country",
											"aria-label": "Select Country",
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
													children: "Other"
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
										htmlFor: "mobile-visa",
										className: "block text-[10px] font-bold text-white/80 mb-1",
										children: "Visa Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "mobile-visa",
											"aria-label": "Select Visa Type",
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
									className: "w-full flex items-center justify-center gap-2 rounded-xl bg-coral-500 py-3 px-4 text-xs font-extrabold text-white shadow-lg active:scale-98 transition text-center",
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
						children: settings.trustStats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-sand border-b border-forest-900/10 py-8 px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-white p-5 shadow-sm border border-forest-900/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-widest text-coral-600 font-bold block mb-2",
						children: "Why Choose Us"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-3.5 mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-8 rounded-full bg-forest-50 flex items-center justify-center text-forest-900 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-coral-500" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-bold text-forest-900",
									children: "Direct University Tie-ups"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-forest-900/65",
									children: "Official representation across Canada, UK & Australia."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-8 rounded-full bg-forest-50 flex items-center justify-center text-forest-900 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4 text-coral-500" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-bold text-forest-900",
									children: "100% Transparent Process"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-forest-900/65",
									children: "No hidden charges, direct fee payment to colleges."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-8 rounded-full bg-forest-50 flex items-center justify-center text-forest-900 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartHandshake, { className: "size-4 text-coral-500" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-bold text-forest-900",
									children: "Pre-Visa & Post-Arrival Support"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-forest-900/65",
									children: "Assistance with accommodation, forex & airport pickup."
								})] })]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: mobileRef,
				className: "h-[46px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: isMobileSticky ? { top: `${headerOffset}px` } : void 0,
					className: `${isMobileSticky ? "fixed left-0 right-0 z-40 shadow-xl bg-forest-950/95 backdrop-blur-md" : "relative bg-forest-950"} overflow-x-auto py-2.5 px-4 scrollbar-none border-y border-white/10`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 w-max",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] font-bold uppercase tracking-wider text-coral-400 shrink-0",
								children: "JUMP:"
							}),
							visibleJumpSections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `#${section.id}-m`,
								className: "shrink-0 rounded-full bg-forest-900 border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-sm active:bg-coral-500",
								children: [
									section.icon,
									" ",
									section.mobileLabel
								]
							}, section.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#enquiry-m",
								className: "shrink-0 rounded-full bg-coral-500 px-3.5 py-1 text-xs font-bold text-white shadow-md",
								children: "🔴 Free Enquiry"
							})
						]
					})
				})
			}),
			settings.approvalsMarqueeEnabled && homepageApprovals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "overflow-hidden border-b border-forest-900/10 bg-coral-500 py-3.5 text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-sm font-bold",
					children: [...homepageApprovals, ...homepageApprovals].map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
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
						className: "flex flex-col justify-between rounded-3xl p-4 shadow-sm border border-forest-900/10 transition overflow-hidden hover:shadow-md " + (i === 0 ? "bg-gradient-to-br from-forest-900 to-forest-950 text-white shadow-md border-transparent" : "bg-white text-forest-900 active:bg-forest-50"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-9 shrink-0 place-items-center rounded-2xl shadow-sm " + (i === 0 ? "bg-coral-500 text-white" : "bg-forest-50 text-forest-700"),
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
							children: "Explore listed study destinations or ask us about others. Europe / Schengen is visitor guidance."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/countries/$slug",
						params: { slug: c.slug },
						className: "flex flex-col justify-between rounded-3xl bg-white p-4 shadow-sm border border-forest-900/10 active:bg-forest-900 active:text-white hover:bg-forest-900 hover:text-white transition group overflow-hidden hover:shadow-md",
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
									className: "font-mono text-xs font-bold text-forest-900/40 group-active:text-white/40 group-hover:text-white/40",
									children: c.code
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2.5 text-sm font-extrabold text-forest-900 group-active:text-white group-hover:text-white leading-tight",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-forest-900/65 group-active:text-white/70 group-hover:text-white/70 line-clamp-2 leading-tight",
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
						className: "flex flex-col justify-between rounded-3xl bg-coral-500 p-4 text-white shadow-md active:bg-coral-600 transition overflow-hidden",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardingPassGenerator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "coaching-m",
				className: "px-5 py-20 border-b border-forest-900/10 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-3xl shadow-lg mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: img("/img/coaching.webp", 640, 420),
						alt: "IELTS and PTE coaching classroom",
						width: 640,
						height: 420,
						loading: "lazy",
						className: "aspect-[16/10] w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-3 right-3 rounded-2xl bg-forest-900/90 backdrop-blur-md px-3.5 py-1.5 text-white shadow-md",
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
							className: "flex items-center gap-2 rounded-2xl bg-forest-50/70 p-3 text-xs font-semibold text-forest-900 shadow-sm border border-forest-900/10",
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
						className: "rounded-3xl border border-white/15 bg-white/5 p-4 shadow-sm flex flex-col justify-between overflow-hidden",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FamilyCashflowPlanner, {}),
			homepageApprovals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "approvals-m",
				className: "px-5 py-20 border-b border-forest-900/10 bg-white",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Fresh approvals" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-extrabold text-forest-900",
							children: "Visas that landed this month."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-4",
						children: homepageApprovals.slice(0, 4).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalCard, {
							a,
							i
						}, a.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/success-stories",
						className: "mt-6 flex min-h-12 w-full items-center justify-center rounded-full border border-forest-900/15 bg-white px-4 py-3 text-sm font-bold text-forest-900 hover-contrast-cta shadow-sm transition hover:bg-forest-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900",
						children: "See all visa stories →"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateCarousel, {
				certificates,
				id: "certificates-m"
			}),
			homepageTestimonials.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "reviews-m",
				className: "bg-sand/60 px-5 py-12 border-b border-forest-900/10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Testimonials" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-extrabold text-forest-900",
							children: "Real students. Real visas."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: visibleTestimonialsMobile.length > 1 ? "grid grid-cols-2 gap-4" : "grid gap-4",
						children: visibleTestimonialsMobile.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, {
							t,
							featured: i === 0,
							compact: true
						}, t.name))
					}),
					homepageTestimonials.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setShowAllTestimonialsMobile(!showAllTestimonialsMobile),
						className: "mt-6 w-full rounded-full border border-forest-900/15 bg-white py-4 text-xs font-bold text-forest-900 hover-contrast-cta shadow-sm transition hover:bg-forest-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900 active:bg-forest-900 active:text-white",
						children: showAllTestimonialsMobile ? "Show Fewer Reviews ↑" : `Show More Reviews (${homepageTestimonials.length - 2}+ और देखें) ↓`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/success-stories",
						className: "mt-3 flex min-h-12 w-full items-center justify-center rounded-full border border-forest-900/15 bg-white px-4 py-3 text-sm font-bold text-forest-900 hover-contrast-cta shadow-sm transition hover:bg-forest-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900",
						children: "View all testimonials →"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-5 py-20 border-b border-forest-900/10 bg-white",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "News & Blog" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-extrabold text-forest-900",
							children: "Latest visa updates."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/updates",
							className: "text-xs font-bold text-coral-600 hover:underline shrink-0",
							children: "All articles →"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-5",
						children: posts.slice(0, 3).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, { p }, p.slug))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/updates",
							className: "flex min-h-11 w-full items-center justify-center rounded-full border border-forest-900/15 bg-white py-4 text-xs font-bold text-forest-900 hover-contrast-cta shadow-sm transition hover:bg-forest-900 hover:text-white active:bg-forest-50",
							children: "View all articles →"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "enquiry-m",
				className: "px-5 py-20 pb-32",
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
							children: settings.faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "group rounded-3xl bg-white p-5 shadow-sm border border-forest-900/10 transition [&_summary::-webkit-details-marker]:hidden",
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
					className: "rounded-3xl bg-forest-900 bg-grain p-6 text-white shadow-xl",
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest-950/95 backdrop-blur-md border-t border-white/15 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "tel:+919772570478",
						className: "flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 py-2.5 text-xs font-bold text-white border border-white/15 active:scale-95 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📞" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Call Now" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "https://wa.me/919772570478?text=Hi%20British%20Education%20Sangaria,%20I%20want%20to%20know%20more%20about%20Study%20Visas.",
						target: "_blank",
						rel: "noreferrer",
						className: "flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:brightness-105 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💬" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WhatsApp" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#enquiry-m",
						className: "flex-1 flex items-center justify-center gap-1 rounded-xl bg-coral-500 hover:bg-coral-600 py-2.5 text-xs font-extrabold text-white shadow-md active:scale-95 transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Free Enquiry ➔" })
					})
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden lg:block bg-cream text-forest-900",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden bg-forest-900 bg-grain text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							className: "mt-7 animate-rise text-4xl sm:text-6xl lg:text-[4.2rem] xl:text-[4.8rem] font-extrabold leading-[1.08] [animation-delay:80ms]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block",
									children: "Pack your bags."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative inline-block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-gradient-to-r from-coral-400 via-amber-200 to-coral-400 bg-clip-text text-transparent",
										children: "We’ll handle"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
										viewBox: "0 0 300 20",
										className: "absolute -bottom-2.5 left-0 w-full animate-pulse",
										"aria-hidden": true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M2 15 Q 75 2 150 10 T 298 6",
											fill: "none",
											stroke: "#c4515d",
											strokeWidth: "5",
											strokeLinecap: "round"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center gap-3 whitespace-nowrap min-h-[1.25em] pb-1 overflow-visible",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-3 transition-all duration-300 transform " + (fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white",
											children: rotatingWords[wordIndex].text
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-block text-3xl lg:text-4xl xl:text-5xl animate-bounce",
											children: rotatingWords[wordIndex].icon
										})]
									})
								})
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
							className: "mt-7 max-w-xl rounded-3xl border border-white/15 bg-forest-950/85 p-5 shadow-xl sm:p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4 flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs font-bold uppercase tracking-wide text-coral-400",
										children: "Visa & Country Finder"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-white/75",
										children: "Free Check"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "desktop-country",
											className: "mb-1 block text-xs font-bold text-white/80",
											children: "Country"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												id: "desktop-country",
												"aria-label": "Select Country",
												value: selectedCountry,
												onChange: (event) => setSelectedCountry(event.target.value),
												className: "w-full appearance-none truncate rounded-xl border border-forest-900/15 bg-white py-3 pl-3 pr-8 text-sm font-bold text-forest-900 shadow-sm",
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
														children: "🇳🇿 New Zealand"
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
														children: "Other / not sure"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												className: "pointer-events-none absolute right-3 top-3.5 text-xs text-forest-900/60",
												children: "▼"
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "desktop-visa",
											className: "mb-1 block text-xs font-bold text-white/80",
											children: "Visa type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												id: "desktop-visa",
												"aria-label": "Select Visa Type",
												value: selectedVisa,
												onChange: (event) => setSelectedVisa(event.target.value),
												className: "w-full appearance-none truncate rounded-xl border border-forest-900/15 bg-white py-3 pl-3 pr-8 text-sm font-bold text-forest-900 shadow-sm",
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
														children: "📚 IELTS / PTE"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												className: "pointer-events-none absolute right-3 top-3.5 text-xs text-forest-900/60",
												children: "▼"
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap gap-2",
									children: [
										selectedCountry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/countries/$slug",
											params: { slug: selectedCountry },
											className: "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400",
											children: [
												"Explore ",
												countries.find((country) => country.slug === selectedCountry)?.name ?? "Country",
												" Guide ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
													"aria-hidden": "true",
													className: "size-4 shrink-0"
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/countries",
											className: "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400",
											children: ["Browse destinations ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												"aria-hidden": "true",
												className: "size-4 shrink-0"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/eligibility",
											className: "inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400",
											children: "Eligibility check"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/contact",
											className: "inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400",
											children: "Contact"
										})
									]
								})
							]
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-6 px-6 pb-16 sm:grid-cols-4",
					children: settings.trustStats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-display text-3xl font-extrabold text-white",
						children: s.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-xs uppercase tracking-wider text-forest-100/60",
						children: s.label
					})] }, s.label))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-sand border-b border-forest-900/10 py-12 px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl rounded-[2.5rem] bg-white p-8 shadow-sm border border-forest-900/10 flex flex-col md:flex-row items-center justify-between gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs uppercase tracking-widest text-coral-600 font-bold block mb-1",
						children: "Why Choose Us"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-2xl font-extrabold text-forest-900",
						children: "Your future is safe with verified experts."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 max-w-4xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-900 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-coral-500" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold text-forest-900",
									children: "Direct University Tie-ups"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-forest-900/65 mt-0.5",
									children: "Official representation across Canada, UK & Australia."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-900 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-5 text-coral-500" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold text-forest-900",
									children: "100% Transparent Process"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-forest-900/65 mt-0.5",
									children: "No hidden charges, direct fee payment to colleges."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-900 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartHandshake, { className: "size-5 text-coral-500" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold text-forest-900",
									children: "Pre-Visa & Post-Arrival"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-forest-900/65 mt-0.5",
									children: "Assistance with accommodation, forex & airport pickup."
								})] })]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: desktopRef,
				style: isDesktopSticky ? { height: desktopJumpHeight + "px" } : void 0,
				className: "min-h-[52px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: desktopBarRef,
					style: isDesktopSticky ? { top: headerOffset + "px" } : void 0,
					className: isDesktopSticky ? "fixed left-0 right-0 z-40 border-b border-forest-900/10 bg-forest-950/95 py-2.5 text-white shadow-xl backdrop-blur-md" : "relative border-b border-forest-900/10 bg-forest-950 py-2.5 text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-3 text-xs xl:justify-between xl:px-6 xl:text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 font-mono text-[11px] font-bold uppercase tracking-widest text-coral-400",
								children: "JUMP TO:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-semibold xl:gap-x-5",
								children: visibleJumpSections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `#${section.id}-desktop`,
									className: "whitespace-nowrap transition hover:text-coral-400",
									children: [
										section.icon,
										" ",
										section.desktopLabel
									]
								}, section.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								className: "shrink-0 whitespace-nowrap rounded-full bg-coral-500 px-4 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-coral-600 lg:px-5 lg:text-xs",
								children: "🔴 Free Enquiry"
							})
						]
					})
				})
			}),
			settings.approvalsMarqueeEnabled && homepageApprovals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "overflow-hidden border-y border-forest-900/10 bg-coral-500 py-4 text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg font-bold",
					children: [...homepageApprovals, ...homepageApprovals].map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
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
						className: "group relative overflow-hidden rounded-[2.5rem] p-8 transition hover:-translate-y-1 " + (i === 0 ? "bg-forest-900 text-white shadow-xl" : "bg-white ring-1 ring-forest-900/10 hover:ring-forest-900 shadow-sm"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-14 place-items-center rounded-2xl " + (i === 0 ? "bg-coral-500 text-white" : "bg-forest-50 text-forest-700"),
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
								className: "group relative flex flex-col rounded-[2.5rem] bg-cream p-6 ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:bg-forest-900 hover:text-white shadow-sm",
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
										className: "mt-6 text-2xl font-bold text-forest-900 group-hover:!text-white",
										children: c.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-forest-900/70 group-hover:!text-white/80",
										children: c.headline
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-5 border-t-2 border-dashed border-forest-900/15 group-hover:border-white/20" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-end justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-forest-900 group-hover:!text-white",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[10px] uppercase tracking-widest text-forest-900/60 group-hover:!text-white/60",
												children: c.stats[0].label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-forest-900 group-hover:!text-white",
												children: c.stats[0].value
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-5 text-coral-500 transition group-hover:translate-x-1" })]
									})
								]
							}, c.slug)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/eligibility",
								className: "flex flex-col justify-between rounded-[2.5rem] bg-coral-500 p-6 text-white transition hover:-translate-y-1 shadow-md",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardingPassGenerator, {}),
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
						className: "aspect-[19/14] w-full rounded-[2.5rem] object-cover shadow-2xl"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute -right-4 -bottom-6 rounded-3xl bg-forest-900 p-5 text-white shadow-xl",
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
								t: "Band feedback"
							},
							{
								icon: BadgeCheck,
								t: "Free demo class"
							}
						].map(({ icon: Icon, t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-2xl bg-white p-4 font-semibold ring-1 ring-forest-900/10 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-coral-500" }),
								" ",
								t
							]
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/coaching",
						className: "mt-8 inline-flex rounded-full bg-forest-900 px-7 py-4 font-bold text-white transition hover:bg-forest-700 shadow-md",
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
								className: "relative rounded-[2.5rem] border border-white/10 bg-white/5 p-7 shadow-lg",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FamilyCashflowPlanner, {}),
			homepageApprovals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
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
					children: homepageApprovals.slice(0, 4).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalCard, {
						a,
						i
					}, a.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateCarousel, {
				certificates,
				id: "certificates-desktop"
			}),
			homepageTestimonials.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
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
						homepageTestimonials.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowAllTestimonials(!showAllTestimonials),
								className: "rounded-full border border-forest-900/20 bg-white px-7 py-3.5 font-bold text-forest-900 hover-contrast-cta shadow-sm transition hover:bg-forest-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900",
								children: showAllTestimonials ? "Show Fewer Reviews ↑" : `Show More Reviews (${homepageTestimonials.length - 3}+ और देखें) ↓`
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/success-stories",
								className: "inline-flex min-h-12 items-center justify-center rounded-full border border-forest-900/15 bg-white px-6 py-3 text-sm font-bold text-forest-900 hover-contrast-cta shadow-sm transition hover:bg-forest-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900",
								children: "View all testimonials →"
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
						className: "mt-8 divide-y divide-forest-900/10 rounded-3xl bg-white ring-1 ring-forest-900/10 shadow-sm",
						children: settings.faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
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
					className: "rounded-[2.5rem] bg-forest-900 bg-grain p-8 text-white md:p-10 shadow-2xl",
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
