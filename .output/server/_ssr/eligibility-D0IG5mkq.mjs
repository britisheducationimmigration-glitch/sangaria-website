import { __toESM } from "../_runtime.mjs";
import { Link, require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { ArrowLeft, ArrowRight, CircleCheck, CircleX, RotateCcw } from "../_libs/lucide-react.mjs";
import { CountryFlag, EnquiryForm, cn } from "./router-BZ0FCmGH.mjs";
import { Eyebrow } from "./Section-D80DXzE3.mjs";
// node_modules/.nitro/vite/services/ssr/assets/eligibility-D0IG5mkq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var eligibilityRules = {
	updatedAt: "2026-10-26",
	goals: [
		{
			id: "study",
			label: "Study abroad",
			description: "Diploma, bachelors or masters"
		},
		{
			id: "pr",
			label: "PR / Settle",
			description: "Permanent residence"
		},
		{
			id: "work",
			label: "Work permit",
			description: "Job-based visas"
		},
		{
			id: "visit",
			label: "Tourist / Visit",
			description: "Travel or family visit"
		}
	],
	factors: [
		{
			id: "age",
			label: "Your age",
			goals: [
				"study",
				"pr",
				"work",
				"visit"
			],
			options: [
				{
					value: "17-24",
					label: "17 – 24",
					points: 20
				},
				{
					value: "25-29",
					label: "25 – 29",
					points: 18
				},
				{
					value: "30-34",
					label: "30 – 34",
					points: 14
				},
				{
					value: "35-39",
					label: "35 – 39",
					points: 9
				},
				{
					value: "40+",
					label: "40 +",
					points: 5
				}
			]
		},
		{
			id: "education",
			label: "Highest education",
			goals: [
				"study",
				"pr",
				"work"
			],
			options: [
				{
					value: "12th",
					label: "Class 12th",
					points: 10
				},
				{
					value: "diploma",
					label: "Diploma",
					points: 13
				},
				{
					value: "bachelors",
					label: "Bachelors degree",
					points: 18
				},
				{
					value: "masters",
					label: "Masters / PhD",
					points: 22
				}
			]
		},
		{
			id: "marks",
			label: "Marks in last qualification",
			goals: ["study"],
			options: [
				{
					value: "75+",
					label: "75% and above",
					points: 12
				},
				{
					value: "60-74",
					label: "60 – 74%",
					points: 9
				},
				{
					value: "50-59",
					label: "50 – 59%",
					points: 6
				},
				{
					value: "<50",
					label: "Below 50%",
					points: 2
				}
			]
		},
		{
			id: "english",
			label: "English test score",
			help: "IELTS overall or PTE equivalent",
			goals: [
				"study",
				"pr",
				"work"
			],
			options: [
				{
					value: "none",
					label: "Not taken yet",
					points: 0
				},
				{
					value: "5.5",
					label: "IELTS 5.5 / PTE 42–49",
					points: 8
				},
				{
					value: "6.0",
					label: "IELTS 6.0 / PTE 50–57",
					points: 14
				},
				{
					value: "6.5",
					label: "IELTS 6.5 / PTE 58–64",
					points: 18
				},
				{
					value: "7.0+",
					label: "IELTS 7.0+ / PTE 65+",
					points: 24
				}
			]
		},
		{
			id: "experience",
			label: "Work experience",
			goals: [
				"pr",
				"work",
				"visit"
			],
			options: [
				{
					value: "0",
					label: "None",
					points: 0
				},
				{
					value: "1-2",
					label: "1 – 2 years",
					points: 8
				},
				{
					value: "3-5",
					label: "3 – 5 years",
					points: 14
				},
				{
					value: "5+",
					label: "5 + years",
					points: 18
				}
			]
		},
		{
			id: "gap",
			label: "Study gap",
			goals: ["study"],
			options: [
				{
					value: "0-1",
					label: "0 – 1 year",
					points: 10
				},
				{
					value: "2-3",
					label: "2 – 3 years",
					points: 7
				},
				{
					value: "4-5",
					label: "4 – 5 years",
					points: 4
				},
				{
					value: "5+",
					label: "More than 5 years",
					points: 1
				}
			]
		},
		{
			id: "funds",
			label: "Funds available (incl. loan / sponsor)",
			goals: [
				"study",
				"pr",
				"work",
				"visit"
			],
			options: [
				{
					value: "<10",
					label: "Below ₹10 lakh",
					points: 3
				},
				{
					value: "10-20",
					label: "₹10 – 20 lakh",
					points: 9
				},
				{
					value: "20-35",
					label: "₹20 – 35 lakh",
					points: 14
				},
				{
					value: "35+",
					label: "₹35 lakh +",
					points: 18
				}
			]
		},
		{
			id: "travel",
			label: "Previous travel history",
			goals: [
				"visit",
				"pr",
				"study"
			],
			options: [
				{
					value: "none",
					label: "No international travel",
					points: 2
				},
				{
					value: "asia",
					label: "Asia / Dubai / Thailand",
					points: 6
				},
				{
					value: "developed",
					label: "USA / UK / Canada / Europe / Australia",
					points: 12
				}
			]
		},
		{
			id: "refusal",
			label: "Any previous visa refusal?",
			goals: [
				"study",
				"pr",
				"work",
				"visit"
			],
			options: [
				{
					value: "no",
					label: "No",
					points: 8
				},
				{
					value: "one",
					label: "Yes, one",
					points: 3
				},
				{
					value: "multiple",
					label: "Yes, more than one",
					points: 0
				}
			]
		}
	],
	countries: [
		{
			slug: "canada",
			name: "Canada",
			flag: "🇨🇦",
			minScore: {
				study: 60,
				pr: 72,
				work: 65,
				visit: 55
			},
			minFactor: { english: 14 }
		},
		{
			slug: "uk",
			name: "United Kingdom",
			flag: "🇬🇧",
			minScore: {
				study: 50,
				work: 60,
				visit: 50
			},
			note: "IELTS waiver possible with strong Class 12 English"
		},
		{
			slug: "australia",
			name: "Australia",
			flag: "🇦🇺",
			minScore: {
				study: 58,
				pr: 75,
				work: 65,
				visit: 52
			},
			minFactor: { english: 14 }
		},
		{
			slug: "usa",
			name: "United States",
			flag: "🇺🇸",
			minScore: {
				study: 62,
				visit: 60
			},
			minFactor: { english: 18 }
		},
		{
			slug: "new-zealand",
			name: "New Zealand",
			flag: "🇳🇿",
			minScore: {
				study: 55,
				pr: 72,
				work: 62,
				visit: 50
			},
			minFactor: { english: 14 }
		},
		{
			slug: "germany",
			name: "Germany",
			flag: "🇩🇪",
			minScore: {
				study: 58,
				work: 60
			},
			minFactor: { education: 18 },
			note: "Bachelors required for masters programs"
		},
		{
			slug: "europe",
			name: "Europe / Schengen",
			flag: "🇪🇺",
			minScore: { visit: 55 }
		}
	],
	bands: [
		{
			min: 75,
			label: "Excellent profile",
			tone: "great",
			message: "You have a strong profile with multiple country options. Let’s file early for the best intake."
		},
		{
			min: 60,
			label: "Good profile",
			tone: "good",
			message: "You qualify for several destinations. A counsellor can help you pick the safest route."
		},
		{
			min: 45,
			label: "Fair profile",
			tone: "fair",
			message: "A few improvements — usually your English score or funds — will open more options."
		},
		{
			min: 0,
			label: "Needs work",
			tone: "low",
			message: "Don’t worry — most profiles can be improved. Start with IELTS/PTE coaching and a free counselling session."
		}
	]
};
function factorsFor(rules, goal) {
	return rules.factors.filter((f) => f.goals.includes(goal));
}
function evaluate(rules, goal, answers) {
	const factors = factorsFor(rules, goal);
	let earned = 0;
	let max = 0;
	const pointsById = {};
	for (const f of factors) {
		const top = Math.max(...f.options.map((o) => o.points));
		max += top;
		const pts = f.options.find((o) => o.value === answers[f.id])?.points ?? 0;
		pointsById[f.id] = pts;
		earned += pts;
	}
	const score = max === 0 ? 0 : Math.round(earned / max * 100);
	const band = rules.bands.find((b) => score >= b.min) ?? rules.bands[rules.bands.length - 1];
	const countries = rules.countries.filter((c) => c.minScore[goal] !== void 0).map((c) => {
		const min = c.minScore[goal];
		const unmet = Object.entries(c.minFactor ?? {}).filter(([id]) => factors.some((f) => f.id === id)).filter(([id, need]) => (pointsById[id] ?? 0) < (need ?? 0)).map(([id]) => factors.find((f) => f.id === id).label);
		const eligible = score >= min && unmet.length === 0;
		return {
			...c,
			min,
			eligible,
			unmet,
			gap: Math.max(0, min - score)
		};
	}).sort((a, b) => Number(b.eligible) - Number(a.eligible) || a.gap - b.gap);
	return {
		score,
		earned,
		max,
		band,
		countries
	};
}
var toneCls = {
	great: "text-forest-600",
	good: "text-forest-600",
	fair: "text-coral-500",
	low: "text-coral-600"
};
function EligibilityPage() {
	const [goal, setGoal] = (0, import_react.useState)(null);
	const [step, setStep] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const factors = goal ? factorsFor(eligibilityRules, goal) : [];
	const done = goal !== null && step >= factors.length;
	const result = (0, import_react.useMemo)(() => goal && done ? evaluate(eligibilityRules, goal, answers) : null, [
		goal,
		done,
		answers
	]);
	const progress = goal ? Math.round(Math.min(step, factors.length) / factors.length * 100) : 0;
	function reset() {
		setGoal(null);
		setStep(0);
		setAnswers({});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative min-h-[80vh] overflow-hidden bg-forest-900 bg-grain py-16 text-white md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
					light: true,
					children: "Free eligibility check"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-6 text-5xl font-extrabold leading-[0.95] md:text-6xl",
					children: [
						"Where can ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-coral-500",
							children: "you"
						}),
						" go?"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-md text-lg text-forest-100/75",
					children: "Answer a few quick questions. We score your profile against the latest requirements for Canada, UK, Australia, USA, New Zealand, Germany and Europe."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-8 font-mono text-xs text-forest-100/50",
					children: ["Rules last updated · ", eligibilityRules.updatedAt]
				}),
				goal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-xs uppercase tracking-widest text-forest-100/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [progress, "%"] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-2 overflow-hidden rounded-full bg-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-coral-500 transition-all duration-500",
							style: { width: `${progress}%` }
						})
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[2rem] bg-cream p-6 text-forest-900 shadow-2xl md:p-10",
				children: [
					!goal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-rise",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-coral-600",
								children: "Step 1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-3xl font-extrabold",
								children: "What’s your goal?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid gap-4 sm:grid-cols-2",
								children: eligibilityRules.goals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setGoal(g.id);
										setStep(0);
									},
									className: "rounded-2xl bg-white p-6 text-left ring-1 ring-forest-900/10 transition hover:-translate-y-1 hover:ring-2 hover:ring-coral-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-display text-xl font-bold",
										children: g.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-sm text-forest-900/60",
										children: g.description
									})]
								}, g.id))
							})
						]
					}, "goal"),
					goal && !done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-rise",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs uppercase tracking-widest text-coral-600",
								children: [
									"Question ",
									step + 1,
									" of ",
									factors.length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-3xl font-extrabold",
								children: factors[step].label
							}),
							factors[step].help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-forest-900/60",
								children: factors[step].help
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid gap-3",
								children: factors[step].options.map((o) => {
									const active = answers[factors[step].id] === o.value;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											setAnswers((a) => ({
												...a,
												[factors[step].id]: o.value
											}));
											setStep((s) => s + 1);
										},
										className: cn("flex items-center justify-between rounded-2xl px-6 py-4 text-left font-semibold ring-1 transition", active ? "bg-forest-900 text-white ring-forest-900" : "bg-white ring-forest-900/10 hover:ring-2 hover:ring-coral-500"),
										children: [o.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 opacity-40" })]
									}, o.value);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => step === 0 ? reset() : setStep((s) => s - 1),
								className: "mt-8 flex items-center gap-2 text-sm font-bold text-forest-900/60 hover:text-forest-900",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back"]
							})
						]
					}, factors[step].id),
					result && goal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-rise",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-6 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, { score: result.score }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("font-display text-2xl font-extrabold", toneCls[result.band.tone]),
									children: result.band.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-forest-900/70",
									children: result.band.message
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "mt-10 mb-4 font-display text-lg font-bold",
								children: ["Country match for ", eligibilityRules.goals.find((g) => g.id === goal)?.label.toLowerCase()]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-3",
								children: result.countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: cn("flex items-center gap-4 rounded-2xl p-4 ring-1", c.eligible ? "bg-forest-50 ring-forest-600/30" : "bg-white ring-forest-900/10"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
											flag: c.flag,
											country: c.name,
											className: "h-7 w-10 shrink-0 shadow-sm"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold",
												children: c.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-forest-900/60",
												children: c.eligible ? c.note ?? "Your profile meets the typical requirements." : c.unmet.length ? `Improve: ${c.unmet.join(", ")}` : `Needs ${c.gap}% more on your profile score`
											})]
										}),
										c.eligible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-6 text-forest-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-6 text-coral-500/70" })
									]
								}, c.slug))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 rounded-2xl bg-white p-6 ring-1 ring-forest-900/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-xl font-bold",
										children: "Send this result to a counsellor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-5 text-sm text-forest-900/60",
										children: "We’ll call with a detailed, personalised plan — free."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, {
										source: "eligibility",
										compact: true,
										summary: `Goal: ${goal} | Score: ${result.score}% | Eligible: ${result.countries.filter((c) => c.eligible).map((c) => c.name).join(", ") || "none"} | Answers: ${Object.entries(answers).map(([k, v]) => `${k}=${v}`).join(", ")}`
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: reset,
									className: "flex items-center gap-2 text-sm font-bold text-forest-900/60 hover:text-forest-900",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), " Start again"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/coaching",
									className: "text-sm font-bold text-coral-600",
									children: "Boost your score with IELTS / PTE coaching →"
								})]
							})
						]
					})
				]
			})]
		})
	});
}
function ScoreRing({ score }) {
	const r = 52;
	const c = 2 * Math.PI * r;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative size-36 shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 120 120",
			className: "size-full -rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "60",
				cy: "60",
				r,
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "12",
				className: "text-forest-900/10"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "60",
				cy: "60",
				r,
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "12",
				strokeLinecap: "round",
				strokeDasharray: c,
				strokeDashoffset: c - score / 100 * c,
				className: "text-coral-500 transition-all duration-1000"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-display text-4xl font-extrabold",
				children: score
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] uppercase tracking-widest text-forest-900/50",
				children: "Profile score"
			})] })
		})]
	});
}
export { EligibilityPage as component };
