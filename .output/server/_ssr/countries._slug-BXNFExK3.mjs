import { Link, require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { CalendarDays, Check, Languages, Wallet } from "../_libs/lucide-react.mjs";
import { EnquiryForm, Route$5 } from "./router-BDXX3wob.mjs";
import { Eyebrow } from "./Section-D80DXzE3.mjs";
// node_modules/.nitro/vite/services/ssr/assets/countries._slug-BXNFExK3.js
var import_jsx_runtime = require_jsx_runtime();
var visaGuidance = {
	canada: {
		lastVerified: "26 October 2026",
		feeRows: [
			{
				label: "Study permit",
				value: "CAD 150"
			},
			{
				label: "Visitor visa",
				value: "CAD 100"
			},
			{
				label: "Work permit",
				value: "CAD 155"
			},
			{
				label: "Express Entry PR",
				value: "CAD 1,590 incl. RPRF"
			},
			{
				label: "Biometrics, when required",
				value: "CAD 85"
			}
		],
		feeSummary: "IRCC government fees shown above are route-specific. Visitor applications by a family of 5+ are capped at CAD 500 when applying together. Express Entry CAD 1,590 includes the right of permanent residence fee; the lower amount without it is CAD 990. A spouse/partner and dependent children have separate fees.",
		requirements: [
			"Study: acceptance from a Designated Learning Institution, a provincial/territorial attestation letter or Quebec Acceptance Certificate in most cases, proof of tuition and living funds, valid travel documents, and health/character evidence where required.",
			"Visitor: valid travel document, clear purpose, enough funds, strong ties such as work/home/family, and proof that you will leave Canada at the end of the visit.",
			"Work: eligibility depends on an employer-specific or open permit. Employer-specific permits generally need a job offer; open permits have their own eligibility rules.",
			"Express Entry: approved language results and program-specific skilled work experience under CEC, FSW or FST, followed by a personalized document checklist after invitation."
		],
		caveat: "Fees, biometrics, medical exams, police certificates, translations, employer compliance fees and visa-centre costs can change or apply separately. Eligibility or an invitation does not guarantee approval.",
		sources: [
			{
				label: "IRCC fee list",
				url: "https://ircc.canada.ca/english/information/fees/fees.asp"
			},
			{
				label: "Study permit documents",
				url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html"
			},
			{
				label: "Visitor visa eligibility",
				url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eligibility.html"
			},
			{
				label: "Express Entry eligibility",
				url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility.html"
			}
		]
	},
	uk: {
		lastVerified: "26 October 2026",
		feeRows: [
			{
				label: "Student visa",
				value: "£558"
			},
			{
				label: "Standard Visitor, 6 months",
				value: "£135"
			},
			{
				label: "Skilled Worker, outside UK",
				value: "£819–£1,618"
			},
			{
				label: "IHS, student/dependant rate",
				value: "£776 per year"
			},
			{
				label: "IHS, most other routes",
				value: "£1,035 per year"
			}
		],
		feeSummary: "The Skilled Worker amount depends on duration, location and occupation; Immigration Health Surcharge is separate and calculated from visa length. Eligible Health and Care Worker applicants can be exempt from IHS.",
		requirements: [
			"Student: licensed student sponsor, Confirmation of Acceptance for Studies, English and financial requirements, and parental consent evidence for applicants aged 16 or 17.",
			"Visitor: permitted activity, valid travel document, genuine temporary visit, funds for the stay and return journey, and intention to leave; work is generally not allowed.",
			"Visitor evidence can include employment/study, bank statements, sponsor relationship and lawful UK sponsor status. Documents not in English or Welsh need full verifiable translations.",
			"Skilled Worker: approved employer, Certificate of Sponsorship, eligible occupation, required salary, English ability and usually £1,270 held for 28 days unless exempt or certified by the employer."
		],
		caveat: "Fees are route-, duration-, nationality- and circumstance-specific. Biometrics, priority, courier, scanning and visa-centre services are separate. Some nationalities need an ETA or neither an ETA nor a visitor visa.",
		sources: [
			{
				label: "Student visa",
				url: "https://www.gov.uk/student-visa"
			},
			{
				label: "Student documents",
				url: "https://www.gov.uk/student-visa/documents-you-must-provide"
			},
			{
				label: "Standard Visitor",
				url: "https://www.gov.uk/standard-visitor"
			},
			{
				label: "Skilled Worker costs",
				url: "https://www.gov.uk/skilled-worker-visa/how-much-it-costs"
			},
			{
				label: "Immigration Health Surcharge",
				url: "https://www.gov.uk/healthcare-immigration-application/how-much-pay"
			}
		]
	},
	australia: {
		lastVerified: "26 October 2026",
		feeRows: [
			{
				label: "Student visa 500, primary applicant",
				value: "AUD 2,000 from"
			},
			{
				label: "Visitor 600, offshore tourist stream",
				value: "AUD 250"
			},
			{
				label: "Skilled Independent 189",
				value: "AUD 6,135 from"
			},
			{
				label: "Other costs",
				value: "Health, police, tests, skills, OSHC separate"
			}
		],
		feeSummary: "The listed charges are primary-applicant government amounts. Additional applicants, concessions, onshore/offshore location, stream and payment surcharges can change the total. Use Home Affairs Visa Pricing Estimator before lodgement.",
		requirements: [
			"Student 500: Confirmation of Enrolment, Genuine Student requirement, identity and circumstance-specific evidence, financial capacity and English evidence when required, adequate health insurance, and health/character compliance.",
			"Visitor 600 tourist stream: apply and remain outside Australia for the offshore stream, show genuine temporary intent, travel purpose, sufficient funds and incentives to return.",
			"Skilled Independent 189: SkillSelect invitation, usually under 45 when invited, nominated occupation, suitable skills assessment, English and points threshold, plus health and character requirements.",
			"Use the Home Affairs document checklist for nationality, location, family composition and route; non-English documents generally need compliant translations."
		],
		caveat: "Australia has no single universal visa fee. Biometrics collection-centre fees, health exams, police certificates, English tests, skills assessments, translations, insurance and OSHC are separate.",
		sources: [
			{
				label: "Current visa pricing",
				url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges/current-visa-pricing"
			},
			{
				label: "Student visa 500",
				url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500"
			},
			{
				label: "Visitor 600 offshore",
				url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600/tourist-stream-overseas"
			},
			{
				label: "Skilled Independent 189",
				url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189"
			}
		]
	},
	usa: {
		lastVerified: "26 October 2026",
		feeRows: [
			{
				label: "F-1 / M-1 student visa",
				value: "US$185"
			},
			{
				label: "B-1 / B-2 visitor visa",
				value: "US$185"
			},
			{
				label: "Employment immigrant visa",
				value: "US$345 per person"
			},
			{
				label: "SEVIS / issuance / petition fees",
				value: "Separate; verify live amount"
			}
		],
		feeSummary: "US$185 applies to the listed B/F/M non-petition-based applications. US$345 is only the employment immigrant visa consular-processing component. SEVIS, USCIS/petition, medical, police, reciprocity and service costs are separate.",
		requirements: [
			"Student: acceptance from a SEVP-approved school, SEVIS registration, signed Form I-20, DS-160, passport, photo, fee receipt, interview, and evidence of academics, funds and intent to depart.",
			"Visitor: B-1/B-2 is for temporary business, tourism or medical treatment. Applicants must show purpose, ability to pay and intent to depart; degree study, employment and permanent residence are not permitted.",
			"Employment-based immigration varies by EB category: EB-1, EB-2 and EB-3 have different petition, qualification and labour-certification rules.",
			"A visa does not guarantee admission; CBP decides admission at the port of entry. Follow the responsible embassy/consulate checklist."
		],
		caveat: "SEVIS amount was not stated on the official DHS page checked, so verify it through the live FMJ payment service. Nationality-dependent reciprocity fees may apply. Do not present any one US fee as a complete immigration cost.",
		sources: [
			{
				label: "State Department visa fees",
				url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html"
			},
			{
				label: "Student visa",
				url: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html"
			},
			{
				label: "Visitor visa",
				url: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html"
			},
			{
				label: "SEVIS fee guidance",
				url: "https://studyinthestates.dhs.gov/students/prepare/paying-the-i-901-sevis-fee"
			}
		]
	},
	"new-zealand": {
		lastVerified: "26 October 2026",
		feeRows: [
			{
				label: "Fee Paying Student Visa",
				value: "From NZD 850"
			},
			{
				label: "Visitor Visa, common case",
				value: "From NZD 441 incl. IVL"
			},
			{
				label: "Skilled Migrant Category",
				value: "From NZD 6,450"
			},
			{
				label: "Visitor fee breakdown",
				value: "NZD 300 + 41 levy + 100 IVL"
			}
		],
		feeSummary: "INZ fees depend on citizenship, application location, category and exemptions. The visitor common-case figure combines an application fee, immigration levy and per-person IVL; eligible Pacific-country rules can differ.",
		requirements: [
			"Student: approved offer of place, tuition payment or scholarship, living funds or acceptable sponsor, genuine study purpose, health/character compliance and acceptable medical/travel insurance.",
			"Visitor: genuine visitor intentions, health and character compliance, sufficient funds or sponsor, and evidence of departure. Self-funded applicants generally need NZD 1,000 per month, or NZD 400 when accommodation is prepaid.",
			"Visitor evidence can include bank statements, accommodation proof and an onward ticket or funds to buy one. Some travellers need an NZeTA rather than a Visitor Visa.",
			"Skilled Migrant Category: age 55 or younger, expression of interest and invitation, skilled job or offer from an accredited employer, points pathway, English, health, character and relationship requirements."
		],
		caveat: "The amounts are from figures and change by fee band and levy rules. Tuition, insurance, medical/X-ray, police certificates, translations and third-party/payment charges are separate.",
		sources: [
			{
				label: "Fee Paying Student Visa",
				url: "https://www.immigration.govt.nz/visas/fee-paying-student-visa/"
			},
			{
				label: "Visitor Visa",
				url: "https://www.immigration.govt.nz/visas/visitor-visa/"
			},
			{
				label: "Skilled Migrant Category",
				url: "https://immigration.govt.nz/visas/skilled-migrant-category-resident-visa"
			},
			{
				label: "INZ fees guide",
				url: "https://www.immigration.govt.nz/assets/inz/documents/forms-and-guides/Fees-Guide-INZ-1028.pdf"
			}
		]
	},
	germany: {
		lastVerified: "26 October 2026",
		feeRows: [
			{
				label: "Schengen short-stay adult",
				value: "EUR 90"
			},
			{
				label: "German national visa, study/work",
				value: "EUR 75"
			},
			{
				label: "Children / reduced cases",
				value: "Depends on age/nationality"
			},
			{
				label: "Visa centre, insurance, residence title",
				value: "Separate"
			}
		],
		feeSummary: "EUR 90 is the common adult Schengen short-stay government fee. EUR 75 is Germany’s national-visa fee for long stays such as study or skilled employment. Neither figure is a total immigration cost.",
		requirements: [
			"Visitor: valid passport, application, photo, medical travel insurance, purpose and itinerary, accommodation, financial means, return intention and fingerprints unless exempt.",
			"Student: university admission and secure financing such as parents’ finances, qualifying commitment, blocked account, bank guarantee or scholarship; local missions may ask for academic, language and insurance documents.",
			"Skilled employment or EU Blue Card: comparable qualification, matching job offer generally lasting at least six months, required licence where applicable, and route-specific salary/market requirements.",
			"After entry for a long stay, non-EU nationals generally apply for the relevant residence permit with the competent foreigners authority."
		],
		caveat: "Mission-, nationality- and exemption-specific checklists control. Blue Card salary thresholds are time-sensitive; study/work fees, residence-title charges, service-centre fees, insurance and document costs are separate.",
		sources: [
			{
				label: "German Federal Foreign Office visas",
				url: "https://www.auswaertiges-amt.de/en/visa-service/215870-215870"
			},
			{
				label: "EU Schengen application rules",
				url: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy/applying-schengen-visa_en"
			},
			{
				label: "Germany study FAQ",
				url: "https://www.auswaertiges-amt.de/en/visa-service/buergerservice/faq/606850-606850"
			},
			{
				label: "Official EU Blue Card portal",
				url: "https://www.make-it-in-germany.com/en/visa-recognition/visa-types/eu-blue-card"
			}
		]
	},
	europe: {
		lastVerified: "26 October 2026",
		feeRows: [
			{
				label: "Schengen short-stay adult",
				value: "EUR 90"
			},
			{
				label: "Children 6 to under 12",
				value: "EUR 45"
			},
			{
				label: "Eligible reduced nationalities",
				value: "EUR 35 or EUR 67.50"
			},
			{
				label: "Student/work/PR",
				value: "National route; no single fee"
			}
		],
		feeSummary: "Schengen is a group of countries, not one immigration destination. Short-stay visitor fees are harmonised, but study, work, skilled-worker and permanent-residence routes are national. The responsible embassy/consulate controls the checklist.",
		requirements: [
			"Apply to the consulate of the main destination or longest-stay country; if stays are equal, apply to the first country. Normally apply from the country where legally resident.",
			"Visitor documents generally include a qualifying passport, application, photo, medical travel insurance, purpose, finances, accommodation and intention to return; fingerprints are generally collected.",
			"Short stay is limited to 90 days in any 180-day period. Applications are generally lodged no earlier than six months and at least 15 days before travel, subject to consulate instructions.",
			"There is no single Schengen student or work visa: stays over 90 days use the selected country’s national visa/residence route. Permanent residence is also country-specific."
		],
		caveat: "EUR 90 is the common adult short-stay government fee only. Visa-centre charges, insurance, translations, legalisation, residence permits and national-route fees are separate. Always check the selected country’s official embassy or immigration authority.",
		sources: [
			{
				label: "EU Schengen application rules",
				url: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy/applying-schengen-visa_en"
			},
			{
				label: "EU visa policy",
				url: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en"
			},
			{
				label: "Germany national visa example",
				url: "https://www.auswaertiges-amt.de/en/visa-service/215870-215870"
			}
		]
	}
};
function CountryPage() {
	const { country: c } = Route$5.useLoaderData();
	const guidance = visaGuidance[c.slug];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-forest-900 bg-grain text-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute -top-10 right-0 font-display text-[16rem] leading-none font-extrabold text-white/[0.04] md:text-[22rem]",
			children: c.code
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/countries",
					className: "text-sm text-forest-100/60 hover:text-white",
					children: "← All destinations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 animate-rise",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryFlag, {
						code: c.code,
						flag: c.flag,
						country: c.name,
						className: "h-14 w-20 shadow-md"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 animate-rise text-5xl font-extrabold md:text-7xl",
					children: c.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 animate-rise text-2xl font-display text-coral-400",
					children: c.headline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-2xl text-lg text-forest-100/80",
					children: c.intro
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3",
					children: c.stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-white/5 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs uppercase tracking-widest text-forest-100/60",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-display text-2xl font-bold",
							children: s.value
						})]
					}, s.label))
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.3fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Visa types we handle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex flex-wrap gap-3",
					children: c.visas.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-2xl bg-white px-5 py-3 font-display font-bold text-forest-900 ring-1 ring-forest-900/10",
						children: v
					}, v))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-white p-7 ring-1 ring-forest-900/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-6 text-coral-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 text-lg font-bold text-forest-900",
								children: "Intakes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-1.5 text-forest-900/70",
								children: c.intakes.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: i }, i))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-white p-7 ring-1 ring-forest-900/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "size-6 text-coral-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 text-lg font-bold text-forest-900",
								children: "English requirement"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-forest-900/70",
								children: c.english
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/coaching",
								className: "mt-3 inline-block text-sm font-bold text-coral-600",
								children: "Prepare with us →"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-forest-50 p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-6 text-forest-700" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 text-lg font-bold text-forest-900",
							children: "Official fee snapshot"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
							className: "mt-4 w-full text-left",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: guidance.feeRows.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-forest-900/10 last:border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 text-forest-900/70",
									children: k.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 text-right font-display font-bold text-forest-900",
									children: k.value
								})]
							}, k.label)) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-forest-900/50",
							children: [
								"Last verified ",
								guidance.lastVerified,
								". Government fees only where stated; add-ons and route exceptions may apply."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-forest-900/70",
							children: guidance.feeSummary
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-white p-8 ring-1 ring-forest-900/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Before you apply" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 text-2xl font-extrabold text-forest-900",
							children: "Core requirements"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-5 space-y-4",
							children: guidance.requirements.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3 text-sm leading-relaxed text-forest-900/75",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0 text-coral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
							}, item))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 rounded-2xl bg-coral-50 p-4 text-sm leading-relaxed text-forest-900/75",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-coral-700",
									children: "Important:"
								}),
								" ",
								guidance.caveat
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 border-t border-forest-900/10 pt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold uppercase tracking-[0.16em] text-forest-900/50",
								children: "Official sources"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-x-4 gap-y-2",
								children: guidance.sources.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: source.url,
									target: "_blank",
									rel: "noreferrer",
									className: "text-sm font-bold text-coral-600 hover:underline",
									children: [source.label, " ↗"]
								}, source.url))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-2xl font-extrabold text-forest-900",
					children: [
						"Why ",
						c.name,
						"?"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 space-y-3",
					children: c.highlights.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 text-lg text-forest-900/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-7 place-items-center rounded-full bg-coral-500 text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
						}), h]
					}, h))
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "h-fit rounded-[2rem] bg-white p-8 ring-1 ring-forest-900/10 lg:sticky lg:top-32",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-extrabold text-forest-900",
					children: [
						"Planning for ",
						c.name,
						"?"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 mb-6 text-forest-900/65",
					children: [
						"Get a free profile check from our ",
						c.name,
						" specialist."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, {
					source: `country-${c.slug}`,
					defaultCountry: c.name,
					compact: true
				})
			]
		})]
	})] });
}
export { CountryPage as component };
