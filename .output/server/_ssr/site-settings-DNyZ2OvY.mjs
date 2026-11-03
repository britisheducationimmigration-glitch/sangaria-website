import { __exportAll as __exportAll$1, __toESM } from "../_runtime.mjs";
import { createMiddleware } from "./ssr.mjs";
import { require_promise } from "../_libs/mysql2+[...].mjs";
import crypto from "node:crypto";
// node_modules/.nitro/vite/services/ssr/assets/site-settings-DNyZ2OvY.js
var site_settings_DNyZ2OvY_exports = /* @__PURE__ */ __exportAll$1({
	__exportAll: () => __exportAll,
	approvals: () => approvals,
	asFaqList: () => asFaqList,
	asTrustStatList: () => asTrustStatList,
	auth_server_exports: () => auth_server_exports,
	bandScoreTable: () => bandScoreTable,
	changeAdminPassword: () => changeAdminPassword,
	coachingCourses: () => coachingCourses,
	coachingSchedule: () => coachingSchedule,
	countries: () => countries,
	defaultCertificates: () => defaultCertificates,
	defaultSiteSettings: () => defaultSiteSettings,
	ensureAdminRecord: () => ensureAdminRecord,
	execute: () => execute,
	getAdminRole: () => getAdminRole,
	getSessionUser: () => getSessionUser,
	jsonArray: () => jsonArray,
	loginAdmin: () => loginAdmin,
	navLinks: () => navLinks,
	posts: () => posts,
	queryRows: () => queryRows,
	readSiteSettings: () => readSiteSettings,
	resetAdminPassword: () => resetAdminPassword,
	sendResetOtp: () => sendResetOtp,
	site: () => site,
	testimonials: () => testimonials,
	verifyOtpAndResetPassword: () => verifyOtpAndResetPassword,
	visaServices: () => visaServices
});
var import_promise = /* @__PURE__ */ __toESM(require_promise());
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var countries = [
	{
		slug: "canada",
		name: "Canada",
		flag: "🇨🇦",
		code: "CA",
		headline: "Study, work and build a path to PR",
		intro: "Eligible students may qualify for a post-graduation work permit (PGWP) and permanent-residence pathways, but programme, institution and personal eligibility rules apply. Confirm the current IRCC criteria before planning.",
		stats: [
			{
				label: "Post-study work (if eligible)",
				value: "PGWP: up to 3 yrs"
			},
			{
				label: "Spouse work permit",
				value: "Eligible cases only"
			},
			{
				label: "Tuition",
				value: "Varies by DLI and programme"
			}
		],
		intakes: [
			"January",
			"May",
			"September"
		],
		visas: [
			"Study Permit",
			"Express Entry PR",
			"PNP",
			"Visitor Visa",
			"Work Permit"
		],
		highlights: [
			"PAL/TAL required in most cases; exemptions apply",
			"PGWP eligibility depends on the school and programme",
			"Spouse open work permits are limited to eligible cases"
		],
		costs: [
			{
				label: "Living funds, 1 person outside Quebec (excl. tuition/travel)",
				value: "CAD 23,448 from 1 Sep 2026"
			},
			{
				label: "Visa fee",
				value: "CAD 150"
			},
			{
				label: "Biometrics",
				value: "CAD 85"
			}
		],
		english: "Set by the school and programme; some PGWP applicants also need language results.",
		studyGuide: {
			tuitionEstimate: "2026 averages: CAD 41,746/year undergraduate and CAD 24,028/year graduate. College diploma programmes are often about CAD 16,000–25,000/year; your offer sets the actual tuition.",
			studentVisaFee: "Study permit CAD 150; biometrics CAD 85 when required.",
			proofOfFunds: "CAD 23,448 for one person outside Quebec from 1 September 2026. Tuition and travel are additional; family size and Quebec rules change the amount.",
			admissionAndEnglish: "Admission from a Designated Learning Institution and a PAL/TAL in most cases (exceptions apply). The school/programme sets admission English; some PGWP applicants have separate IRCC language and field-of-study rules.",
			workWhileStudying: "Eligible students may work off campus up to 24 hours/week while classes are in session and full-time during scheduled breaks.",
			postStudyOption: "An eligible graduate may qualify for a PGWP of up to 3 years. School, programme, application-date, field-of-study and language rules can affect eligibility and duration.",
			intakesNote: "Common starts shown; dates and availability vary by institution and programme. Confirm the selected course calendar.",
			lastVerified: "2 November 2026",
			sources: [
				{
					label: "EduCanada tuition and study costs",
					url: "https://www.educanada.ca/programs-programmes/education_cost-cout_education.aspx?lang=eng"
				},
				{
					label: "IRCC proof of funds",
					url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html"
				},
				{
					label: "IRCC student work conditions",
					url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html"
				},
				{
					label: "IRCC PGWP eligibility",
					url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html"
				}
			]
		}
	},
	{
		slug: "uk",
		name: "United Kingdom",
		flag: "🇬🇧",
		code: "UK",
		headline: "One-year masters, world-famous universities",
		intro: "The UK offers shorter degrees and a Graduate Route for eligible graduates: 2 years for applications by 31 December 2026, 18 months from 1 January 2027, and 3 years for doctoral graduates.",
		stats: [
			{
				label: "Graduate Route",
				value: "2 yrs / 18 mos; 3 yrs doctoral"
			},
			{
				label: "Many masters programmes",
				value: "Often 1 year"
			},
			{
				label: "Tuition",
				value: "Varies by university and course"
			}
		],
		intakes: [
			"January",
			"May",
			"September"
		],
		visas: [
			"Student Visa",
			"Graduate Route",
			"Skilled Worker",
			"Standard Visitor"
		],
		highlights: [
			"English evidence depends on the course, sponsor and visa route",
			"Student work rights depend on visa conditions and course",
			"Graduate Route duration depends on application date"
		],
		costs: [
			{
				label: "Student living funds, outside London (up to 9 months)",
				value: "£1,171 / month"
			},
			{
				label: "Student visa fee (outside UK)",
				value: "£558"
			},
			{
				label: "IHS (health surcharge)",
				value: "£776 / year"
			}
		],
		english: "Usually CEFR B2 at degree level or B1 below; exemptions and provider assessment may apply.",
		studyGuide: {
			tuitionEstimate: "Study UK’s published guide range: undergraduate £11,400–£38,000/year; postgraduate £9,000–£30,000/year. This is indicative; the current course quote from the university controls.",
			studentVisaFee: "Student visa £558 from outside the UK; student Immigration Health Surcharge is £776/year. Total IHS depends on visa length.",
			proofOfFunds: "£1,171/month outside London or £1,529/month in London, for up to 9 months, plus course fees. Exemptions and individual circumstances apply.",
			admissionAndEnglish: "A Confirmation of Acceptance for Studies (CAS) from a licensed Student sponsor is required. English evidence depends on course level, sponsor and visa rules; exemptions may apply.",
			workWhileStudying: "Usually up to 20 hours/week in term for eligible degree-level students at qualifying sponsors; some below-degree courses allow 10 hours, while other courses allow no work. Follow the visa conditions.",
			postStudyOption: "Eligible graduates may get 2 years if they apply by 31 December 2026, 18 months from 1 January 2027, or 3 years for a doctorate. The course must be eligible and the provider must report completion.",
			intakesNote: "Common starts shown; course starts and application deadlines vary by university and programme.",
			lastVerified: "2 November 2026",
			sources: [
				{
					label: "Study UK tuition guidance",
					url: "https://study-uk.britishcouncil.org/moving-uk/cost-studying"
				},
				{
					label: "GOV.UK student visa funds",
					url: "https://www.gov.uk/student-visa/money"
				},
				{
					label: "GOV.UK student work conditions",
					url: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-student"
				},
				{
					label: "GOV.UK Graduate visa",
					url: "https://www.gov.uk/graduate-visa"
				}
			]
		}
	},
	{
		slug: "australia",
		name: "Australia",
		flag: "🇦🇺",
		code: "AU",
		headline: "Sunshine, top-100 universities and skilled migration",
		intro: "Australia rewards skills. Study in a regional area for extra post-study work years and points towards skilled migration.",
		stats: [
			{
				label: "Post-study work",
				value: "2–4 yrs"
			},
			{
				label: "Work while studying",
				value: "48 hrs / fortnight"
			},
			{
				label: "Avg. tuition",
				value: "AUD 25–45k"
			}
		],
		intakes: [
			"February",
			"July",
			"November"
		],
		visas: [
			"Student (500)",
			"Temporary Graduate (485)",
			"Skilled (189/190/491)",
			"Visitor (600)"
		],
		highlights: [
			"Regional study bonus",
			"High minimum wages",
			"Points-tested PR system"
		],
		costs: [
			{
				label: "Living funds",
				value: "AUD 29,710 / yr"
			},
			{
				label: "Visa fee",
				value: "AUD 2,500"
			},
			{
				label: "OSHC",
				value: "AUD ~600 / yr"
			}
		],
		english: "IELTS 6.0 / PTE 50",
		studyGuide: {
			tuitionEstimate: "The site’s AUD 25,000–45,000/year band is a planning estimate, not a national fee rule. Provider, course and city affect tuition; use the official course search for an exact course quote.",
			studentVisaFee: "Subclass 500 starts at AUD 2,500 from 1 July 2026; concessions and extra applicants can change the total.",
			proofOfFunds: "AUD 29,710 for 12 months of the primary student’s living costs, plus first-year tuition and travel. Higher evidence can be needed for accompanying family.",
			admissionAndEnglish: "A Confirmation of Enrolment (CoE) from a CRICOS-registered provider and the Genuine Student assessment are key requirements. English test evidence is required only where applicable; course admission requirements can be higher.",
			workWhileStudying: "Student visa holders may work up to 48 hours per fortnight while their course is in session; check the conditions on the visa. Different rules apply during scheduled breaks.",
			postStudyOption: "Subclass 485 usually allows 2 years after a bachelor’s or coursework master’s, and 3 years after a research master’s or doctorate. Indian nationals may have treaty-specific periods. Age, recent eligible study and other requirements apply. A regional second visa needs qualifying regional study and residence.",
			intakesNote: "Common starts shown; course calendars, trimester options and deadlines vary by provider.",
			lastVerified: "2 November 2026",
			sources: [
				{
					label: "Study Australia course search",
					url: "https://search.studyaustralia.gov.au/courses"
				},
				{
					label: "Study Australia education-cost guidance",
					url: "https://www.studyaustralia.gov.au/en_in/life-in-australia/living-and-education-costs"
				},
				{
					label: "Subclass 500 and financial capacity",
					url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500"
				},
				{
					label: "Student visa charges",
					url: "https://www.studyaustralia.gov.au/en/tools-and-resources/news/student-visa-application-charge-increase"
				},
				{
					label: "Subclass 485 post-higher-education work",
					url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485/post-higher-education-work"
				},
				{
					label: "Regional graduate visa options",
					url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/regional-migration"
				}
			]
		}
	},
	{
		slug: "usa",
		name: "United States",
		flag: "🇺🇸",
		code: "US",
		headline: "The world’s biggest education market",
		intro: "From Ivy League to affordable state universities, the USA offers flexibility, STEM OPT extensions and unmatched research opportunities.",
		stats: [
			{
				label: "STEM OPT",
				value: "Up to 3 yrs"
			},
			{
				label: "Universities",
				value: "4,000+"
			},
			{
				label: "Avg. tuition",
				value: "USD 20–45k"
			}
		],
		intakes: ["January (Spring)", "August (Fall)"],
		visas: [
			"F-1 Student",
			"B1/B2 Visitor",
			"H-1B (via employer)"
		],
		highlights: [
			"Scholarships & assistantships",
			"Flexible majors",
			"Mock visa interview prep"
		],
		costs: [
			{
				label: "SEVIS fee",
				value: "USD 350"
			},
			{
				label: "Visa fee",
				value: "USD 185"
			},
			{
				label: "Living",
				value: "USD 12–18k / yr"
			}
		],
		english: "IELTS 6.5 / PTE 58 / Duolingo 110",
		studyGuide: {
			tuitionEstimate: "The site’s USD 20,000–45,000/year band is a planning estimate only. Tuition and living costs vary widely by school, programme and location; use the school’s current cost estimate on Form I-20.",
			studentVisaFee: "F/M visa application US$185 plus separate I-901 SEVIS fee US$350; reciprocity or other costs may apply.",
			proofOfFunds: "There is no single national living-funds figure. The SEVP-certified school records estimated tuition and living expenses on Form I-20; applicants must show funding for the school’s required amount.",
			admissionAndEnglish: "Acceptance from an SEVP-certified school and Form I-20 are needed. Each school sets its admission and English evidence; there is no single federal IELTS/PTE score.",
			workWhileStudying: "F-1 on-campus work is generally limited to 20 hours/week while school is in session. Off-campus CPT/OPT requires the correct school/USCIS authorization and must meet its rules.",
			postStudyOption: "Eligible students may get up to 12 months of OPT per higher education level. A qualifying STEM degree may support a further 24-month STEM OPT extension with an eligible E-Verify employer.",
			intakesNote: "Spring and fall are common starts; some programmes have summer or rolling entry. Confirm each school’s calendar and deadline.",
			lastVerified: "2 November 2026",
			sources: [
				{
					label: "EducationUSA study costs",
					url: "https://educationusa.state.gov/your-5-steps-us-study/finance-your-studies"
				},
				{
					label: "U.S. Department of State student visas",
					url: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html"
				},
				{
					label: "F-1 student employment regulations",
					url: "https://www.ecfr.gov/current/title-8/section-214.2"
				},
				{
					label: "DHS F-1 practical training overview",
					url: "https://studyinthestates.dhs.gov/assets/SEVP_PracticalTrainingOverview_1-pager.pdf"
				},
				{
					label: "DHS SEVIS fee guidance",
					url: "https://studyinthestates.dhs.gov/students/prepare/paying-the-i-901-sevis-fee"
				}
			]
		}
	},
	{
		slug: "new-zealand",
		name: "New Zealand",
		flag: "🇳🇿",
		code: "NZ",
		headline: "Safe, welcoming and green",
		intro: "New Zealand offers a relaxed lifestyle, high safety and work rights for students and their partners on eligible programs.",
		stats: [
			{
				label: "Post-study work",
				value: "Up to 3 yrs"
			},
			{
				label: "Work while studying",
				value: "25 hrs / week"
			},
			{
				label: "Living funds (student visa, 2026)",
				value: "€992 / month"
			}
		],
		intakes: ["February", "July"],
		visas: [
			"Student Visa",
			"Post-Study Work",
			"Visitor Visa"
		],
		highlights: [
			"Green List occupations",
			"Partner work rights",
			"Small class sizes"
		],
		costs: [
			{
				label: "Living funds",
				value: "NZD 20,000 / yr"
			},
			{
				label: "Visa fee",
				value: "NZD 850"
			},
			{
				label: "Insurance",
				value: "NZD ~700 / yr"
			}
		],
		english: "IELTS 6.0 / PTE 50",
		studyGuide: {
			tuitionEstimate: "Published Study with New Zealand estimates: bachelor’s NZD 35,000–55,000/year; postgraduate NZD 20,000–45,000/year (tuition figures last updated March 2025). Confirm current fees with the provider.",
			studentVisaFee: "Fee Paying Student Visa from NZD 850; the final fee can vary by citizenship, application location and levies.",
			proofOfFunds: "Tertiary students generally show NZD 20,000/year, or NZD 1,667/month for shorter study; tuition is separate. Check current INZ rules for your course and family.",
			admissionAndEnglish: "An offer of place from an approved education provider is required. The provider sets academic and English admission evidence; acceptable insurance and other visa criteria also apply.",
			workWhileStudying: "Eligible visa conditions may allow up to 25 hours/week and full-time work in specified holidays. Rights depend on the visa and course conditions.",
			postStudyOption: "A Post Study Work Visa may last up to 3 years depending on the completed qualification. Eligible master’s/doctoral study of at least 30 weeks can qualify for 3 years; other qualifications have separate rules.",
			intakesNote: "Common starts shown; provider and programme calendars vary.",
			lastVerified: "2 November 2026",
			sources: [
				{
					label: "Study with New Zealand costs",
					url: "https://www.studywithnewzealand.govt.nz/en/plan-your-studies/cost-of-living"
				},
				{
					label: "INZ Fee Paying Student Visa",
					url: "https://www.immigration.govt.nz/visas/fee-paying-student-visa/"
				},
				{
					label: "INZ student work conditions",
					url: "https://www.immigration.govt.nz/study/once-you-have-a-student-visa/working-on-a-student-visa/"
				},
				{
					label: "INZ Post Study Work Visa",
					url: "https://www.immigration.govt.nz/visas/post-study-work-visa/"
				}
			]
		}
	},
	{
		slug: "germany",
		name: "Germany",
		flag: "🇩🇪",
		code: "DE",
		headline: "Low or zero tuition at public universities",
		intro: "Germany is Europe’s engineering powerhouse — public universities charge little or no tuition and graduates get 18 months to find work.",
		stats: [
			{
				label: "Job-seeker period",
				value: "18 months"
			},
			{
				label: "Public tuition",
				value: "Usually none at most public universities"
			},
			{
				label: "Living funds (student visa, 2026)",
				value: "€11,904 / yr"
			}
		],
		intakes: ["April (Summer)", "October (Winter)"],
		visas: [
			"Student Visa",
			"Opportunity Card",
			"EU Blue Card",
			"Schengen Visitor"
		],
		highlights: [
			"English-taught masters",
			"Strong STEM job market",
			"Path to EU Blue Card"
		],
		costs: [
			{
				label: "Living funds (student visa, 2026)",
				value: "€992 / month"
			},
			{
				label: "Visa fee",
				value: "€75"
			},
			{
				label: "Health insurance",
				value: "€120 / month"
			}
		],
		english: "IELTS 6.5 / basic German helps",
		studyGuide: {
			tuitionEstimate: "Most public universities charge no tuition for bachelor’s and many master’s programmes. A semester contribution is usually €70–€430; exceptions, private universities and special programmes can charge tuition.",
			studentVisaFee: "German national long-stay study visa: €75; service-centre and residence-permit costs may be separate.",
			proofOfFunds: "For an admitted student visa in 2026, the living-funds baseline is €11,904 for 12 months (equivalent to €992/month). A blocked account is common, and a scholarship or declaration of commitment may be accepted. The separate visa to seek a university place uses a different €1,091/month baseline; follow the responsible mission’s checklist.",
			admissionAndEnglish: "Admission from a German university and a recognised prior qualification are required. German/English language proof depends on the programme and teaching language; check the university and embassy requirements.",
			workWhileStudying: "Third-country students may work up to 140 full days or 280 half days/year, or alternatively up to 20 hours/week during the lecture period; conditions and student status apply.",
			postStudyOption: "After successfully completing a German degree, graduates may apply for a residence permit of up to 18 months to seek qualified employment; the permit and next work route have eligibility requirements.",
			intakesNote: "Common starts are April (summer) and October (winter); exact dates, deadlines and available programmes vary by university.",
			lastVerified: "2 November 2026",
			sources: [
				{
					label: "Make it in Germany study and visa guidance",
					url: "https://www.make-it-in-germany.com/en/visa-recognition/visa-types/studying"
				},
				{
					label: "DAAD tuition and semester contributions",
					url: "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/"
				},
				{
					label: "Make it in Germany student work rules",
					url: "https://www.make-it-in-germany.com/en/study-vocational-training/studying-in-germany/work"
				},
				{
					label: "German Federal Foreign Office visa service",
					url: "https://www.auswaertiges-amt.de/en/visa-service/215870-215870"
				}
			]
		}
	},
	{
		slug: "europe",
		name: "Europe / Schengen",
		flag: "🇪🇺",
		code: "EU",
		headline: "Visit 29 countries on one visa",
		intro: "Tourist, family visit and business trips to France, Italy, Switzerland, Netherlands and more — we prepare complete, embassy-ready files.",
		stats: [
			{
				label: "Countries covered",
				value: "29"
			},
			{
				label: "Stay allowed",
				value: "90 / 180 days"
			},
			{
				label: "Processing",
				value: "15–45 days"
			}
		],
		intakes: ["Apply 3–6 months before travel"],
		visas: [
			"Schengen Tourist",
			"Family Visit",
			"Business Visa"
		],
		highlights: [
			"Itinerary & hotel bookings",
			"Cover letter drafting",
			"Appointment booking"
		],
		costs: [
			{
				label: "Visa fee",
				value: "€90"
			},
			{
				label: "Travel insurance",
				value: "€30,000 cover"
			},
			{
				label: "VFS service",
				value: "Varies"
			}
		],
		english: "Not required"
	}
];
var visaServices = [
	{
		slug: "study",
		title: "Study Visa",
		icon: "graduation",
		summary: "Course & university shortlisting, offer letters, SOP, financial docs and visa filing.",
		points: [
			"Free profile evaluation",
			"University applications",
			"SOP & LOR drafting",
			"Education loan guidance"
		]
	},
	{
		slug: "tourist",
		title: "Tourist & Visitor Visa",
		icon: "plane",
		summary: "Visit family or travel — Canada, UK, USA, Australia, NZ and Schengen visitor visas.",
		points: [
			"Invitation & itinerary",
			"Bank statement review",
			"Interview preparation",
			"Appointment booking"
		]
	},
	{
		slug: "pr",
		title: "PR & Immigration",
		icon: "home",
		summary: "Permanent residence through Express Entry, PNPs and Australian skilled migration.",
		points: [
			"Points assessment",
			"ECA & skills assessment",
			"Profile creation",
			"Document checklist"
		]
	},
	{
		slug: "work",
		title: "Work Permit",
		icon: "briefcase",
		summary: "Employer-sponsored and open work permits, Germany Opportunity Card and more.",
		points: [
			"CV & profile building",
			"Job-offer verification",
			"LMIA / sponsorship guidance",
			"Work permit filing"
		]
	},
	{
		slug: "spouse",
		title: "Spouse & Dependent Visa",
		icon: "users",
		summary: "Join your partner abroad with a strong relationship and financial file.",
		points: [
			"Relationship evidence",
			"Open work permit for spouse",
			"Dependent child visas",
			"Sponsorship letters"
		]
	},
	{
		slug: "refusal",
		title: "Refusal Cases & Re-apply",
		icon: "file",
		summary: "Visa refused earlier? We analyse the GCMS / refusal reasons and rebuild your file.",
		points: [
			"GCMS notes request",
			"Refusal analysis",
			"Gap explanation",
			"Stronger re-application"
		]
	}
];
var testimonials = [
	{
		name: "Harpreet Kaur",
		city: "Sangaria",
		country: "Canada",
		visa: "Study Permit",
		quote: "My file was refused once from another agent. British Education studied the refusal, fixed my SOP and funds — approved in 4 weeks!",
		rating: 5,
		initials: "HK"
	},
	{
		name: "Rohit Godara",
		city: "Hanumangarh",
		country: "United Kingdom",
		visa: "Student Visa",
		quote: "Got an offer from a top UK university with an IELTS waiver. The team handled everything, even my CAS interview practice.",
		rating: 5,
		initials: "RG"
	},
	{
		name: "Simranjeet Singh",
		city: "Abohar",
		country: "Australia",
		visa: "Student (500)",
		quote: "Scored PTE 72 in my first attempt after their 30-day batch. Then they processed my Australian visa smoothly.",
		rating: 5,
		initials: "SS"
	},
	{
		name: "Manju Beniwal",
		city: "Sri Ganganagar",
		country: "Europe",
		visa: "Schengen Tourist",
		quote: "Our family trip to Switzerland and Italy — all four visas approved. The documentation was very professional.",
		rating: 5,
		initials: "MB"
	},
	{
		name: "Gurpreet Brar",
		city: "Sangaria",
		country: "Canada",
		visa: "Spouse Open Work Permit",
		quote: "I joined my wife in Toronto within 2 months. Honest guidance and no hidden charges.",
		rating: 5,
		initials: "GB"
	},
	{
		name: "Ankit Saharan",
		city: "Rawatsar",
		country: "Germany",
		visa: "Student Visa",
		quote: "Admission to a public university with almost zero tuition. Blocked account and APS — they guided every step.",
		rating: 4,
		initials: "AS"
	}
];
var approvals = [
	{
		name: "Jaspreet K.",
		country: "Canada",
		flag: "🇨🇦",
		visa: "Study Permit",
		date: "2026-10-21",
		note: "Sept intake · Conestoga"
	},
	{
		name: "Ravinder S.",
		country: "UK",
		flag: "🇬🇧",
		visa: "Student Visa",
		date: "2026-10-18",
		note: "MSc Data Science"
	},
	{
		name: "Pooja & Family",
		country: "Schengen",
		flag: "🇪🇺",
		visa: "Tourist Visa",
		date: "2026-10-15",
		note: "France · 4 applicants"
	},
	{
		name: "Karan M.",
		country: "Australia",
		flag: "🇦🇺",
		visa: "Subclass 500",
		date: "2026-10-11",
		note: "Regional Victoria"
	},
	{
		name: "Navdeep G.",
		country: "Canada",
		flag: "🇨🇦",
		visa: "Visitor Visa",
		date: "2026-10-08",
		note: "Parents · 10-year multiple"
	},
	{
		name: "Mandeep B.",
		country: "USA",
		flag: "🇺🇸",
		visa: "F-1 Student",
		date: "2026-10-02",
		note: "Spring intake"
	},
	{
		name: "Sukhpreet K.",
		country: "New Zealand",
		flag: "🇳🇿",
		visa: "Student Visa",
		date: "2026-09-27",
		note: "Auckland"
	},
	{
		name: "Vikas J.",
		country: "Germany",
		flag: "🇩🇪",
		visa: "Student Visa",
		date: "2026-09-22",
		note: "MS Mechanical"
	},
	{
		name: "Amandeep S.",
		country: "Canada",
		flag: "🇨🇦",
		visa: "Spouse OWP",
		date: "2026-09-17"
	},
	{
		name: "Neha R.",
		country: "UK",
		flag: "🇬🇧",
		visa: "Standard Visitor",
		date: "2026-09-12",
		note: "Convocation visit"
	}
];
var posts = [
	{
		slug: "canada-study-permit-cap-2027",
		title: "Canada study permit cap for 2027: what’s confirmed so far",
		category: "Visa News",
		date: "2026-10-20",
		excerpt: "IRCC has published 2026 allocation figures; its 2026 planning binder puts work on the 2027 cap in fall 2026. Check the current PAL/TAL rules before applying.",
		readMins: 2,
		lastReviewed: "2026-10-31",
		sources: [
			{
				label: "IRCC 2026 allocation notice",
				url: "https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/2026-provincial-territorial-allocations-under-international-student-cap.html"
			},
			{
				label: "IRCC 2026 planning binder",
				url: "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/transition-binders/deputy-minister-2026/international-student-program.html"
			},
			{
				label: "PAL/TAL exceptions",
				url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html"
			}
		],
		body: [
			"As of 31 October 2026, IRCC’s public allocation notice lists 2026 figures. Its 2026 planning binder says work to set the 2027 study-permit cap and seek provincial and territorial allocation approvals is scheduled for fall 2026. Check IRCC for a newer notice before making a 2027 plan.",
			"A PAL or TAL is required in most cases. Exemptions include eligible master’s and doctoral students at public designated learning institutions starting 1 January 2026, along with other groups listed by IRCC. Check the exact programme and application rules; Quebec applicants may also need a CAQ.",
			"An allocation or PAL/TAL does not guarantee a study permit. IRCC assesses each application against its full requirements. Confirm current instructions with your designated learning institution and IRCC before applying."
		]
	},
	{
		slug: "uk-graduate-route-update",
		title: "UK Graduate Route: duration by application date",
		category: "Visa News",
		date: "2026-10-12",
		excerpt: "Eligible graduates get 2 years if they apply by 31 December 2026, 18 months from 1 January 2027, or 3 years for doctoral qualifications.",
		readMins: 2,
		lastReviewed: "2026-10-31",
		sources: [{
			label: "GOV.UK Graduate visa",
			url: "https://www.gov.uk/graduate-visa"
		}, {
			label: "Immigration Rules: Graduate route",
			url: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-graduate"
		}],
		body: [
			"Under current GOV.UK rules, eligible graduates receive 2 years when they apply on or before 31 December 2026. Applications made on or after 1 January 2027 receive 18 months. Graduates with a PhD or other doctoral qualification receive 3 years.",
			"The application date sets the duration, not the course intake month. You must apply before your Student permission expires and after your education provider has told the Home Office that you completed your course.",
			"Check the current GOV.UK guidance before planning. The Graduate visa cannot be extended, though some graduates may be able to switch to another route."
		]
	},
	{
		slug: "pte-vs-ielts-which-one",
		title: "PTE or IELTS — which test should you take in 2026?",
		category: "IELTS & PTE",
		date: "2026-10-05",
		excerpt: "Computer-based PTE gives faster results; IELTS is accepted everywhere. Here is a simple way to decide.",
		readMins: 6,
		body: [
			"Both tests are widely accepted for study and migration. PTE is fully computer-based with results usually in 48 hours, while IELTS is available on paper and on computer.",
			"If you are comfortable with typing and speaking into a microphone, PTE often feels faster. If you prefer human examiners for speaking, IELTS can be the better fit.",
			"Take a free mock test at our Sangaria centre and we will recommend the right test for you."
		]
	},
	{
		slug: "schengen-visa-checklist",
		title: "Schengen tourist visa checklist for Indian families",
		category: "Immigration",
		date: "2026-09-28",
		excerpt: "Planning a Europe holiday? These are the documents embassies look for — and the mistakes to avoid.",
		readMins: 4,
		body: ["A strong Schengen application has a clear itinerary, confirmed hotel bookings, travel insurance with €30,000 cover and bank statements that show stable income.", "Apply to the embassy of the country where you will spend the most nights. Book appointments 6–8 weeks before peak summer travel."]
	},
	{
		slug: "germany-public-universities",
		title: "Studying in Germany for (almost) free: public universities explained",
		category: "Study Abroad",
		date: "2026-09-18",
		excerpt: "Blocked account, APS certificate and English-taught masters — your step-by-step guide to Germany.",
		readMins: 7,
		body: ["Most German public universities charge little or no tuition, though semester contributions and programme exceptions apply. A blocked account is one common way to show living funds; check the current official amount and any accepted alternatives before applying.", "Indian students need an APS certificate before applying for the student visa. Start the process at least 3 months in advance."]
	},
	{
		slug: "australia-regional-study-benefits",
		title: "Why regional Australia can add years to your post-study work visa",
		category: "Study Abroad",
		date: "2026-09-09",
		excerpt: "Studying outside Sydney and Melbourne brings extra work rights and migration points.",
		readMins: 5,
		body: ["Graduates from regional campuses may receive additional years on the Temporary Graduate (485) visa and extra points for skilled migration.", "Cities like Adelaide, Perth, Hobart and Gold Coast offer lower living costs too."]
	}
];
var coachingCourses = [{
	test: "IELTS",
	tagline: "Academic & General Training",
	duration: "6 weeks",
	batch: "Morning · Afternoon · Evening",
	features: [
		"All 4 modules: Listening, Reading, Writing, Speaking",
		"Weekly full-length mock tests",
		"One-on-one speaking sessions",
		"Writing task band-score feedback",
		"Cambridge practice material"
	],
	target: "Avg. student band 7.0"
}, {
	test: "PTE",
	tagline: "PTE Academic & PTE Core",
	duration: "4 weeks",
	batch: "Morning · Evening · Weekend",
	features: [
		"AI-scored practice portal access",
		"Templates for Describe Image & Retell Lecture",
		"Computer lab with real-exam headsets",
		"Sectional & full mock tests",
		"Exam booking assistance"
	],
	target: "Avg. student score 65+"
}];
var coachingSchedule = [
	{
		batch: "IELTS Morning",
		time: "8:00 – 10:00 AM",
		seats: 6,
		starts: "2026-11-03"
	},
	{
		batch: "PTE Morning",
		time: "10:00 AM – 12:00 PM",
		seats: 4,
		starts: "Nov 3"
	},
	{
		batch: "IELTS Afternoon",
		time: "1:00 – 3:00 PM",
		seats: 9,
		starts: "2026-11-10"
	},
	{
		batch: "PTE Evening",
		time: "4:00 – 6:00 PM",
		seats: 3,
		starts: "Nov 10"
	},
	{
		batch: "Weekend PTE Crash",
		time: "Sat–Sun · 10 AM – 2 PM",
		seats: 8,
		starts: "2026-11-08"
	}
];
var bandScoreTable = [
	{
		ielts: "8.0+",
		pte: "79+",
		clb: "CLB 10"
	},
	{
		ielts: "7.5",
		pte: "73–78",
		clb: "CLB 9"
	},
	{
		ielts: "7.0",
		pte: "65–72",
		clb: "CLB 8"
	},
	{
		ielts: "6.5",
		pte: "58–64",
		clb: "CLB 7"
	},
	{
		ielts: "6.0",
		pte: "50–57",
		clb: "CLB 6"
	},
	{
		ielts: "5.5",
		pte: "42–49",
		clb: "CLB 5"
	}
];
var faqs = [
	{
		q: "Is the first counselling session free?",
		a: "Yes. Your first profile evaluation — in person in Sangaria or over phone/WhatsApp — is completely free."
	},
	{
		q: "Can I apply with a study gap?",
		a: "Yes. Gaps of several years can be explained with work experience or other evidence. We help you write a clear gap explanation."
	},
	{
		q: "My visa was refused earlier. Can I apply again?",
		a: "Absolutely. We first request your refusal notes (GCMS for Canada) and then fix the weak points before re-applying."
	},
	{
		q: "Do you help with education loans?",
		a: "We guide you through loan options with banks and NBFCs and help prepare the financial documentation."
	},
	{
		q: "Do I need IELTS for the UK?",
		a: "Many UK universities accept Class 12 English marks or PTE/Duolingo. We will shortlist options for your profile."
	}
];
var auth_server_exports = /* @__PURE__ */ __exportAll({
	authMiddleware: () => authMiddleware,
	changeAdminPassword: () => changeAdminPassword,
	createSessionToken: () => createSessionToken,
	ensureAdminRecord: () => ensureAdminRecord,
	getAdminRole: () => getAdminRole,
	getSessionUser: () => getSessionUser,
	hashPassword: () => hashPassword,
	loginAdmin: () => loginAdmin,
	resetAdminPassword: () => resetAdminPassword,
	sendResetOtp: () => sendResetOtp,
	verifyOtpAndResetPassword: () => verifyOtpAndResetPassword,
	verifyPassword: () => verifyPassword,
	verifySessionToken: () => verifySessionToken
});
var DEFAULT_SECRET = "bei-sangaria-secure-session-key-2026";
var DEFAULT_RECOVERY_KEY = "Sangaria@Reset2026";
var DEFAULT_ADMIN_EMAIL = "admin@britisheducationandimmigration.com";
var DEFAULT_ADMIN_PASS = "Admin@Sangaria2026";
function getSessionSecret() {
	return process.env.SESSION_SECRET || DEFAULT_SECRET;
}
function getRecoveryKey() {
	return process.env.ADMIN_RECOVERY_KEY || DEFAULT_RECOVERY_KEY;
}
function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString("hex");
	return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}
function verifyPassword(password, stored) {
	if (!stored || !stored.includes(":")) return false;
	try {
		const [salt, key] = stored.split(":");
		if (!salt || !key) return false;
		const keyBuffer = Buffer.from(key, "hex");
		const derivedKey = crypto.scryptSync(password, salt, 64);
		return crypto.timingSafeEqual(keyBuffer, derivedKey);
	} catch {
		return false;
	}
}
function createSessionToken(user) {
	const secret = getSessionSecret();
	const header = Buffer.from(JSON.stringify({
		alg: "HS256",
		typ: "JWT"
	})).toString("base64url");
	const exp = Math.floor(Date.now() / 1e3) + 2592e3;
	const body = Buffer.from(JSON.stringify({
		sub: user.openId,
		email: user.email.toLowerCase(),
		name: user.name,
		role: user.role,
		exp
	})).toString("base64url");
	return `${header}.${body}.${crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url")}`;
}
function verifySessionToken(token) {
	if (!token || typeof token !== "string") return null;
	const parts = token.split(".");
	if (parts.length !== 3) return null;
	const [header, body, signature] = parts;
	const secret = getSessionSecret();
	if (crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url") !== signature) return null;
	try {
		const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
		if (payload.exp && payload.exp < Math.floor(Date.now() / 1e3)) return null;
		return payload;
	} catch {
		return null;
	}
}
function cookiesFrom(headers) {
	const raw = headers.get("cookie") ?? "";
	return Object.fromEntries(raw.split(";").map((part) => part.trim().split("=")).filter(([key, value]) => key && value).map(([key, value]) => {
		try {
			return [key, decodeURIComponent(value)];
		} catch {
			return [key, value];
		}
	}));
}
async function getSessionUser(headers) {
	const sessionToken = cookiesFrom(headers).bei_admin_session;
	if (sessionToken) {
		const verified = verifySessionToken(sessionToken);
		if (verified?.sub && verified?.email) return {
			openId: verified.sub,
			email: verified.email,
			name: verified.name
		};
	}
	const authHeader = headers.get("authorization");
	if (authHeader?.startsWith("Bearer ")) {
		const verified = verifySessionToken(authHeader.slice(7));
		if (verified?.sub && verified?.email) return {
			openId: verified.sub,
			email: verified.email,
			name: verified.name
		};
	}
	return null;
}
function allowedAdminValues() {
	return (process.env.ADMIN_EMAILS ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
}
function normalizeRole(value) {
	if (value === "super_admin" || value === "content_editor" || value === "enquiry_manager") return value;
	if (value === "admin") return "super_admin";
	return null;
}
async function getAdminRole(user) {
	const allowed = allowedAdminValues();
	if (allowed.includes(user.email) || allowed.includes(user.openId.toLowerCase()) || user.openId === "admin-owner") return "super_admin";
	try {
		return normalizeRole((await queryRows("SELECT role FROM admin_users WHERE LOWER(email) = ? LIMIT 1", [user.email.toLowerCase()]))[0]?.role) ?? "super_admin";
	} catch {
		return "super_admin";
	}
}
async function ensureAdminRecord(user) {
	const role = await getAdminRole(user);
	if (!role) return false;
	if (!await getDb()) return true;
	try {
		if ((await queryRows("SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1", [user.email.toLowerCase()])).length === 0) await execute("INSERT INTO admin_users (email, name, role) VALUES (?, ?, ?)", [
			user.email.toLowerCase(),
			user.name,
			role
		]);
	} catch (err) {
		console.error("ensureAdminRecord error:", err);
	}
	return true;
}
async function loginAdmin(identifier, password) {
	const cleanId = (identifier || "").trim().toLowerCase();
	const cleanPass = (password || "").trim();
	if (!cleanId || !cleanPass) return {
		ok: false,
		error: "Please enter both username/email and password"
	};
	try {
		const rows = await queryRows("SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1", [cleanId]);
		if (rows.length > 0) {
			const row = rows[0];
			const storedHash = String(row.password_hash || "");
			if (storedHash && verifyPassword(cleanPass, storedHash)) {
				const user = {
					openId: String(row.open_id || row.id || row.email),
					email: String(row.email).toLowerCase(),
					name: String(row.name || row.email),
					role: String(row.role || "super_admin")
				};
				const token = createSessionToken(user);
				return {
					ok: true,
					user: {
						openId: user.openId,
						email: user.email,
						name: user.name
					},
					token
				};
			}
		}
	} catch (err) {
		console.error("Database query error in loginAdmin:", err);
	}
	const envEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase();
	const envPass = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASS;
	if ((cleanId === envEmail || cleanId === "admin" || cleanId === "owner") && cleanPass === envPass) {
		const user = {
			openId: "admin-owner",
			email: envEmail,
			name: "Owner / Admin",
			role: "super_admin"
		};
		const token = createSessionToken(user);
		return {
			ok: true,
			user: {
				openId: user.openId,
				email: user.email,
				name: user.name
			},
			token
		};
	}
	return {
		ok: false,
		error: "Invalid username/email or password"
	};
}
async function sendEmailViaResend({ to, subject, html }) {
	const apiKey = (process.env.RESEND_API_KEY || "").trim();
	if (!apiKey) throw new Error("RESEND_API_KEY is not set in Vercel settings.");
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			from: "British Education & Immigration <otp@send.britisheducationandimmigration.com>",
			to: [to],
			subject,
			html
		})
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message || "Failed to send email via Resend");
}
async function sendResetOtp(emailInput) {
	const email = emailInput.trim().toLowerCase();
	if (!email || !email.includes("@")) return {
		ok: false,
		error: "Please enter a valid email address"
	};
	const masterEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase();
	const rows = await queryRows("SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1", [email]);
	if (email !== masterEmail && rows.length === 0) return {
		ok: false,
		error: "No admin account found with this email"
	};
	await execute(`
    CREATE TABLE IF NOT EXISTS admin_password_resets (
      email VARCHAR(255) PRIMARY KEY,
      otp VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
	const otp = String(Math.floor(1e5 + Math.random() * 9e5));
	await execute("INSERT INTO admin_password_resets (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at)", [
		email,
		otp,
		new Date(Date.now() + 6e5)
	]);
	const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
      <h2 style="color: #0b3326; margin: 0 0 6px 0; font-size: 22px;">British Education & Immigration</h2>
      <p style="color: #64748b; font-size: 13px; margin: 0;">Sangaria, Rajasthan · Admin Security</p>
      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
      <p style="color: #1e293b; font-size: 15px; margin: 0 0 16px 0;">Hello,</p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
        You requested a password reset for your admin dashboard account. Use the following 6-digit OTP code to reset your password:
      </p>
      <div style="background: #0b3326; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 18px; border-radius: 14px; margin-bottom: 24px;">
        ${otp}
      </div>
      <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
        ⏰ This OTP is valid for <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;
	try {
		await sendEmailViaResend({
			to: email,
			subject: `Your OTP is ${otp} · British Education & Immigration`,
			html
		});
		return {
			ok: true,
			message: `OTP sent to ${email}. Check your inbox or spam folder.`
		};
	} catch (err) {
		console.error("Resend OTP error:", err);
		return {
			ok: false,
			error: err.message || "Failed to send OTP email. Please check your RESEND_API_KEY."
		};
	}
}
async function verifyOtpAndResetPassword(emailInput, otpInput, newPassword) {
	const email = emailInput.trim().toLowerCase();
	const otp = otpInput.trim();
	const cleanPass = newPassword.trim();
	if (!email || !otp || !cleanPass) return {
		ok: false,
		error: "Email, OTP, and New Password are required"
	};
	if (cleanPass.length < 6) return {
		ok: false,
		error: "New password must be at least 6 characters"
	};
	try {
		const rows = await queryRows("SELECT * FROM admin_password_resets WHERE LOWER(email) = ? AND expires_at > CURRENT_TIMESTAMP() LIMIT 1", [email]);
		if (rows.length === 0 || String(rows[0].otp).trim() !== otp) return {
			ok: false,
			error: "Invalid or expired OTP. Please try again."
		};
		await execute("UPDATE admin_users SET password_hash = ? WHERE LOWER(email) = ?", [hashPassword(cleanPass), email]);
		await execute("DELETE FROM admin_password_resets WHERE LOWER(email) = ?", [email]);
		return {
			ok: true,
			message: "Password reset successful! You can now log in."
		};
	} catch (err) {
		console.error("Verify OTP error:", err);
		return {
			ok: false,
			error: "Failed to verify OTP"
		};
	}
}
async function resetAdminPassword(email, recoveryKey, newPassword) {
	const cleanEmail = (email || "").trim().toLowerCase();
	const cleanKey = (recoveryKey || "").trim();
	const cleanPass = (newPassword || "").trim();
	if (!cleanEmail || !cleanKey || !cleanPass) return {
		ok: false,
		error: "All fields (Email, Recovery Key, New Password) are required"
	};
	if (cleanPass.length < 6) return {
		ok: false,
		error: "New password must be at least 6 characters long"
	};
	if (cleanKey !== getRecoveryKey()) return {
		ok: false,
		error: "Invalid Master Recovery Key (Security PIN)"
	};
	const newHash = hashPassword(cleanPass);
	try {
		await execute("UPDATE admin_users SET password_hash = ? WHERE LOWER(email) = ?", [newHash, cleanEmail]);
	} catch (err) {
		console.error("Reset password error:", err);
	}
	return {
		ok: true,
		message: "Password reset successfully!"
	};
}
async function changeAdminPassword(user, oldPass, newPass) {
	if (!oldPass || !newPass) return {
		ok: false,
		error: "Both current and new password are required"
	};
	if (newPass.length < 6) return {
		ok: false,
		error: "New password must be at least 6 characters"
	};
	try {
		const rows = await queryRows("SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1", [user.email.toLowerCase()]);
		const currentHash = rows[0]?.password_hash ? String(rows[0].password_hash) : "";
		if (currentHash && !verifyPassword(oldPass, currentHash)) return {
			ok: false,
			error: "Current password is incorrect"
		};
	} catch {}
	const newHash = hashPassword(newPass);
	try {
		await execute("UPDATE admin_users SET password_hash = ? WHERE LOWER(email) = ?", [newHash, user.email.toLowerCase()]);
	} catch (err) {
		return {
			ok: false,
			error: "Failed to update password in database"
		};
	}
	return {
		ok: true,
		message: "Password updated successfully"
	};
}
var authMiddleware = createMiddleware().server(async ({ next, request }) => {
	const user = await getSessionUser(request.headers);
	if (!user) throw new Error("Unauthorized");
	return next({ context: { user } });
});
createMiddleware().middleware([authMiddleware]).server(async ({ next, context }) => {
	if (!await ensureAdminRecord(context.user)) throw new Error("Forbidden");
	return next({ context: { user: context.user } });
});
var defaultCertificates = [
	{
		slug: "unizportal-representation",
		title: "Partner representation certificate",
		issuer: "UniZ Portal",
		category: "Partner authorisations",
		credentialDate: "",
		altText: "British Education and Immigration partner representation certificate from UniZ Portal",
		imagePath: "/certificates/representation-01.webp",
		homepageFeatured: true,
		published: true,
		sortOrder: 1
	},
	{
		slug: "international-counsellor-training",
		title: "International counsellor training",
		issuer: "The International Counsellor",
		category: "Training & qualifications",
		credentialDate: "",
		altText: "Certificate of completion for international counsellor training",
		imagePath: "/certificates/representation-02.webp",
		homepageFeatured: true,
		published: true,
		sortOrder: 2
	},
	{
		slug: "college-representation",
		title: "College representative certificate",
		issuer: "Education partner",
		category: "Partner authorisations",
		credentialDate: "",
		altText: "College representative certificate authorising British Education and Immigration",
		imagePath: "/certificates/representation-03.webp",
		homepageFeatured: false,
		published: true,
		sortOrder: 3
	},
	{
		slug: "atlantis-college-authorisation",
		title: "Authorisation certificate",
		issuer: "Atlantis College",
		category: "Partner authorisations",
		credentialDate: "",
		altText: "Atlantis College authorisation certificate",
		imagePath: "/certificates/representation-04.webp",
		homepageFeatured: true,
		published: true,
		sortOrder: 4
	},
	{
		slug: "casa-college-representation",
		title: "Student recruitment representation",
		issuer: "CASA College",
		category: "Partner authorisations",
		credentialDate: "",
		altText: "CASA College certificate of representation",
		imagePath: "/certificates/representation-05.webp",
		homepageFeatured: false,
		published: true,
		sortOrder: 5
	},
	{
		slug: "pearson-approved-representative",
		title: "Approved partner representative",
		issuer: "Pearson",
		category: "Partner authorisations",
		credentialDate: "",
		altText: "Pearson approved partner representative certificate",
		imagePath: "/certificates/representation-06.webp",
		homepageFeatured: false,
		published: true,
		sortOrder: 6
	},
	{
		slug: "pearson-partner-meet-2026",
		title: "Partner meet recognition",
		issuer: "Pearson",
		category: "Recognition & events",
		credentialDate: "2026",
		altText: "Pearson HFA partner meet 2026 recognition",
		imagePath: "/certificates/representation-07.webp",
		homepageFeatured: false,
		published: true,
		sortOrder: 7
	},
	{
		slug: "pearson-pte-academic-partner-training",
		title: "PTE Academic partner training",
		issuer: "Pearson Pathways",
		category: "Training & qualifications",
		credentialDate: "",
		altText: "Pearson Pathways PTE Academic partner programme training certificate",
		imagePath: "/certificates/achievement-01.webp",
		homepageFeatured: true,
		published: true,
		sortOrder: 8
	},
	{
		slug: "idp-ielts-trainer-achievement-one",
		title: "IELTS trainer achievement",
		issuer: "IDP IELTS",
		category: "Training & qualifications",
		credentialDate: "",
		altText: "IDP IELTS Train the Trainer certificate of achievement",
		imagePath: "/certificates/achievement-02.webp",
		homepageFeatured: false,
		published: true,
		sortOrder: 9
	},
	{
		slug: "academy-of-learning-authorisation",
		title: "Recruitment representative authorisation",
		issuer: "Academy of Learning, Brampton Campus",
		category: "Partner authorisations",
		credentialDate: "",
		altText: "Academy of Learning Brampton Campus agent authorisation certificate",
		imagePath: "/certificates/achievement-03.webp",
		homepageFeatured: false,
		published: true,
		sortOrder: 10
	},
	{
		slug: "idp-ielts-trainer-achievement-two",
		title: "IELTS trainer achievement",
		issuer: "IDP IELTS",
		category: "Training & qualifications",
		credentialDate: "",
		altText: "IDP IELTS Train the Trainer achievement certificate",
		imagePath: "/certificates/achievement-04.webp",
		homepageFeatured: false,
		published: true,
		sortOrder: 11
	},
	{
		slug: "university-of-saskatchewan-recognition",
		title: "Study in Canada recognition",
		issuer: "University of Saskatchewan",
		category: "Recognition & events",
		credentialDate: "",
		altText: "Study in Canada recognition photo from the University of Saskatchewan",
		imagePath: "/certificates/achievement-05.webp",
		homepageFeatured: true,
		published: true,
		sortOrder: 12
	},
	{
		slug: "pearson-pte-trainer-professional",
		title: "PTE Trainer Professional",
		issuer: "Pearson",
		category: "Training & qualifications",
		credentialDate: "",
		altText: "Pearson certificate of completion for PTE Trainer Professional",
		imagePath: "/certificates/achievement-06.webp",
		homepageFeatured: false,
		published: true,
		sortOrder: 13
	},
	{
		slug: "lyon-institute-partnership",
		title: "Student recruitment partnership",
		issuer: "Lyon Institute of Geography and Multicultural Relations",
		category: "Partner authorisations",
		credentialDate: "",
		altText: "Lyon Institute of Geography and Multicultural Relations student recruitment partner certificate",
		imagePath: "/certificates/achievement-07.webp",
		homepageFeatured: false,
		published: true,
		sortOrder: 14
	},
	{
		slug: "idp-ielts-partnership",
		title: "IELTS referral partner",
		issuer: "IDP IELTS",
		category: "Partner authorisations",
		credentialDate: "",
		altText: "IDP IELTS referral partner certificate for British Education and Immigration",
		imagePath: "/certificates/achievement-08.webp",
		homepageFeatured: true,
		published: true,
		sortOrder: 15
	}
];
var pool = null;
var schemaPromise = null;
function getPool() {
	if (pool) return pool;
	const url = process.env.DATABASE_URL;
	if (!url) return null;
	pool = import_promise.createPool({
		uri: url,
		waitForConnections: true,
		connectionLimit: 5,
		maxIdle: 5,
		idleTimeout: 6e4,
		enableKeepAlive: true,
		ssl: process.env.DATABASE_SSL === "false" ? void 0 : { rejectUnauthorized: false }
	});
	return pool;
}
async function ensureColumn(poolInstance, table, column, definition) {
	const [rows] = await poolInstance.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1", [table, column]);
	if (rows.length === 0) await poolInstance.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
}
async function seed(poolInstance) {
	const [settingsRows] = await poolInstance.query("SELECT id FROM site_settings WHERE id = 1 LIMIT 1");
	if (settingsRows.length === 0) await poolInstance.query(`INSERT INTO site_settings (id, popup_enabled, popup_delay_seconds, whatsapp_enabled, approvals_marquee_enabled)
       VALUES (1, 1, 8, 1, 1)`);
	const [postRows] = await poolInstance.query("SELECT id FROM content_posts LIMIT 1");
	if (postRows.length === 0) for (const post of posts) await poolInstance.query(`INSERT INTO content_posts (slug, title, category, publish_date, excerpt, read_mins, body_json, published)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)`, [
		post.slug,
		post.title,
		post.category,
		post.date,
		post.excerpt,
		post.readMins,
		JSON.stringify(post.body)
	]);
	const [approvalRows] = await poolInstance.query("SELECT id FROM success_stories WHERE kind = 'approval' LIMIT 1");
	if (approvalRows.length === 0) for (const approval of approvals) await poolInstance.query(`INSERT INTO success_stories (kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, published)
         VALUES ('approval', ?, '', ?, ?, '', 5, '', ?, ?, ?, 1)`, [
		approval.name,
		approval.country,
		approval.visa,
		approval.flag,
		approval.date,
		approval.note ?? ""
	]);
	const [testimonialRows] = await poolInstance.query("SELECT id FROM success_stories WHERE kind = 'testimonial' LIMIT 1");
	if (testimonialRows.length === 0) for (const testimonial of testimonials) await poolInstance.query(`INSERT INTO success_stories (kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, published)
         VALUES ('testimonial', ?, ?, ?, ?, ?, ?, ?, '', CURRENT_DATE, '', 1)`, [
		testimonial.name,
		testimonial.city,
		testimonial.country,
		testimonial.visa,
		testimonial.quote,
		testimonial.rating,
		testimonial.initials
	]);
	const [batchRows] = await poolInstance.query("SELECT id FROM coaching_batches LIMIT 1");
	if (batchRows.length === 0) for (const batch of coachingSchedule) {
		const program = batch.batch.includes("IELTS") ? "IELTS" : "PTE";
		await poolInstance.query("INSERT INTO coaching_batches (program, batch_name, time_slot, seats, starts, published) VALUES (?, ?, ?, ?, ?, 1)", [
			program,
			batch.batch,
			batch.time,
			batch.seats,
			batch.starts
		]);
	}
	const [adminRows] = await poolInstance.query("SELECT open_id FROM admin_users LIMIT 1");
	const [certificateSeedRows] = await poolInstance.query("SELECT certificates_seeded FROM site_settings WHERE id = 1 LIMIT 1");
	if (!Boolean(certificateSeedRows[0]?.certificates_seeded)) {
		const [existingCertificates] = await poolInstance.query("SELECT id FROM certificate_items WHERE collection = 'certificates' LIMIT 1");
		if (existingCertificates.length === 0) for (const certificate of defaultCertificates) await poolInstance.query(`INSERT INTO certificate_items (collection, title, issuer, category, credential_date, alt_text, image_path, homepage_featured, published, sort_order)
           VALUES ('certificates', ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
			certificate.title,
			certificate.issuer,
			certificate.category,
			certificate.credentialDate,
			certificate.altText,
			certificate.imagePath,
			certificate.homepageFeatured ? 1 : 0,
			certificate.published ? 1 : 0,
			certificate.sortOrder
		]);
		await poolInstance.query("UPDATE site_settings SET certificates_seeded = 1 WHERE id = 1");
	}
	if (adminRows.length === 0) {
		const initialEmail = (process.env.ADMIN_EMAIL || "admin@britisheducationandimmigration.com").toLowerCase();
		const passwordHash = hashPassword(process.env.ADMIN_PASSWORD || "Admin@Sangaria2026");
		await poolInstance.query(`INSERT INTO admin_users (open_id, email, name, role, password_hash)
       VALUES (?, ?, ?, 'super_admin', ?)`, [
			"admin-owner",
			initialEmail,
			"Owner / Admin",
			passwordHash
		]);
	}
}
async function getDb() {
	const poolInstance = getPool();
	if (!poolInstance) return null;
	if (!schemaPromise) schemaPromise = (async () => {
		await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
          popup_enabled BOOLEAN NOT NULL DEFAULT TRUE,
          popup_delay_seconds INT UNSIGNED NOT NULL DEFAULT 8,
          whatsapp_enabled BOOLEAN NOT NULL DEFAULT TRUE,
          approvals_marquee_enabled BOOLEAN NOT NULL DEFAULT TRUE,
          cashflow_json LONGTEXT NULL,
          public_settings_json LONGTEXT NULL,
          certificates_seeded BOOLEAN NOT NULL DEFAULT FALSE,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
		await ensureColumn(poolInstance, "site_settings", "cashflow_json", "LONGTEXT NULL");
		await ensureColumn(poolInstance, "site_settings", "public_settings_json", "LONGTEXT NULL");
		await ensureColumn(poolInstance, "site_settings", "certificates_seeded", "BOOLEAN NOT NULL DEFAULT FALSE");
		await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS enquiries (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(120) NOT NULL,
          phone VARCHAR(40) NOT NULL,
          email VARCHAR(190) NOT NULL DEFAULT '',
          city VARCHAR(120) NOT NULL DEFAULT '',
          interest VARCHAR(160) NOT NULL DEFAULT '',
          country VARCHAR(120) NOT NULL DEFAULT '',
          message TEXT NOT NULL,
          source VARCHAR(160) NOT NULL DEFAULT '',
          summary TEXT NOT NULL,
          status VARCHAR(24) NOT NULL DEFAULT 'New',
          notes TEXT NOT NULL,
          assigned_to VARCHAR(190) NOT NULL DEFAULT '',
          next_follow_up_at DATETIME NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX enquiries_created_at_idx (created_at),
          INDEX enquiries_status_idx (status)
        )
      `);
		await ensureColumn(poolInstance, "enquiries", "assigned_to", "VARCHAR(190) NOT NULL DEFAULT ''");
		await ensureColumn(poolInstance, "enquiries", "next_follow_up_at", "DATETIME NULL");
		await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS enquiry_activities (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          enquiry_id BIGINT UNSIGNED NOT NULL,
          author_name VARCHAR(160) NOT NULL DEFAULT '',
          author_email VARCHAR(190) NOT NULL DEFAULT '',
          body TEXT NOT NULL,
          edited_by VARCHAR(190) NOT NULL DEFAULT '',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX enquiry_activities_timeline_idx (enquiry_id, created_at, id)
        )
      `);
		await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS coaching_batches (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          program VARCHAR(80) NOT NULL,
          batch_name VARCHAR(160) NOT NULL,
          time_slot VARCHAR(160) NOT NULL,
          seats INT UNSIGNED NOT NULL DEFAULT 0,
          starts VARCHAR(80) NOT NULL DEFAULT '',
          published BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX coaching_published_idx (published),
          INDEX coaching_program_idx (program)
        )
      `);
		await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS certificate_items (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          collection VARCHAR(40) NOT NULL DEFAULT 'certificates',
          title VARCHAR(220) NOT NULL,
          issuer VARCHAR(180) NOT NULL DEFAULT '',
          category VARCHAR(100) NOT NULL DEFAULT 'Partner authorisations',
          credential_date VARCHAR(80) NOT NULL DEFAULT '',
          alt_text VARCHAR(500) NOT NULL DEFAULT '',
          image_path VARCHAR(500) NULL,
          image_mime_type VARCHAR(40) NULL,
          image_data MEDIUMBLOB NULL,
          homepage_featured BOOLEAN NOT NULL DEFAULT FALSE,
          published BOOLEAN NOT NULL DEFAULT FALSE,
          sort_order INT NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX certificate_public_idx (collection, published, sort_order)
        )
      `);
		await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS content_posts (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          slug VARCHAR(190) NOT NULL UNIQUE,
          title VARCHAR(220) NOT NULL,
          category VARCHAR(80) NOT NULL,
          publish_date DATE NOT NULL,
          excerpt TEXT NOT NULL,
          read_mins INT UNSIGNED NOT NULL DEFAULT 4,
          body_json JSON NOT NULL,
          published BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
		await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS success_stories (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          kind VARCHAR(20) NOT NULL,
          name VARCHAR(160) NOT NULL,
          city VARCHAR(120) NOT NULL DEFAULT '',
          country VARCHAR(120) NOT NULL DEFAULT '',
          visa VARCHAR(160) NOT NULL DEFAULT '',
          quote TEXT NOT NULL,
          rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
          initials VARCHAR(10) NOT NULL DEFAULT '',
          flag VARCHAR(10) NOT NULL DEFAULT '',
          story_date DATE NOT NULL,
          note VARCHAR(220) NOT NULL DEFAULT '',
          homepage_featured BOOLEAN NOT NULL DEFAULT TRUE,
          published BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX success_kind_idx (kind),
          INDEX success_date_idx (story_date)
        )
      `);
		await ensureColumn(poolInstance, "certificate_items", "image_version", "BIGINT UNSIGNED NOT NULL DEFAULT 0");
		await ensureColumn(poolInstance, "success_stories", "photo_mime_type", "VARCHAR(40) NULL");
		await ensureColumn(poolInstance, "success_stories", "photo_data", "MEDIUMBLOB NULL");
		await ensureColumn(poolInstance, "success_stories", "video_url", "VARCHAR(500) NULL");
		await ensureColumn(poolInstance, "success_stories", "media_alt", "VARCHAR(500) NOT NULL DEFAULT ''");
		await ensureColumn(poolInstance, "success_stories", "media_consent", "BOOLEAN NOT NULL DEFAULT FALSE");
		await ensureColumn(poolInstance, "success_stories", "media_version", "BIGINT UNSIGNED NOT NULL DEFAULT 0");
		await ensureColumn(poolInstance, "success_stories", "homepage_featured", "BOOLEAN NOT NULL DEFAULT TRUE");
		await poolInstance.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          open_id VARCHAR(190) NOT NULL PRIMARY KEY,
          email VARCHAR(190) NOT NULL DEFAULT '',
          name VARCHAR(160) NOT NULL DEFAULT '',
          role VARCHAR(30) NOT NULL DEFAULT 'super_admin',
          password_hash VARCHAR(255) NOT NULL DEFAULT '',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
		await ensureColumn(poolInstance, "admin_users", "password_hash", "VARCHAR(255) NOT NULL DEFAULT ''");
		await seed(poolInstance);
		return poolInstance;
	})().catch((error) => {
		schemaPromise = null;
		throw error;
	});
	return schemaPromise;
}
async function queryRows(sql, values = []) {
	const database = await getDb();
	if (!database) return [];
	const [rows] = await database.query(sql, values);
	return rows;
}
async function execute(sql, values = []) {
	const database = await getDb();
	if (!database) throw new Error("Database is not configured");
	const [result] = await database.execute(sql, values);
	return result;
}
function jsonArray(value) {
	if (Array.isArray(value)) return value;
	if (typeof value === "string") try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
	return [];
}
var site = {
	name: "British Education and Immigration",
	short: "British Education",
	tagline: "Study, work & settle abroad — guided from Sangaria to the world.",
	phones: ["9658018000", "9772570478"],
	emails: ["admissions@britisheducationandimmigration.com", "support@britisheducationandimmigration.com"],
	whatsapp: "919772570478",
	address: "Near Open Book Library, Bhagatpura Road, Sangaria, Hanumangarh, Rajasthan – 335063",
	mapQuery: "29.798547,74.464214",
	latitude: 29.798547,
	longitude: 74.464214,
	mapUrl: "https://www.google.com/maps/search/?api=1&query=29.798547,74.464214",
	hours: "Mon – Sat · 9:30 AM – 7:30 PM",
	instagram: "https://www.instagram.com/british_education_and_immigrat/",
	facebook: "https://www.facebook.com/BritishEducationAndImmigration"
};
var navLinks = [
	{
		to: "/countries",
		label: "Countries"
	},
	{
		to: "/visas",
		label: "Visas"
	},
	{
		to: "/eligibility",
		label: "Eligibility Check"
	},
	{
		to: "/coaching",
		label: "IELTS & PTE"
	},
	{
		to: "/success-stories",
		label: "Success Stories"
	},
	{
		to: "/updates",
		label: "News & Blog"
	}
];
var defaultSiteSettings = {
	popupEnabled: true,
	popupDelaySeconds: 8,
	whatsappEnabled: true,
	approvalsMarqueeEnabled: true,
	phones: [...site.phones],
	emails: [...site.emails],
	officeHours: site.hours,
	faqs: faqs.map((item) => ({
		q: item.q,
		a: item.a
	})),
	trustStats: [
		{
			value: "2,500+",
			label: "Visas approved"
		},
		{
			value: "98%",
			label: "Success ratio"
		},
		{
			value: "Multiple",
			label: "Study destinations"
		},
		{
			value: "7.0",
			label: "Avg. IELTS band"
		}
	]
};
function cleanStrings(value, maxCount, maxLength) {
	if (!Array.isArray(value)) return [];
	return value.filter((item) => typeof item === "string").map((item) => item.trim().slice(0, maxLength)).filter(Boolean).slice(0, maxCount);
}
function normalizeTrustStat(stat) {
	const label = stat.label.trim().toLowerCase();
	if (label === "reported visa approvals") return {
		...stat,
		label: "Visas approved"
	};
	if (label === "reported success ratio") return {
		...stat,
		label: "Success ratio"
	};
	if (label === "destinations" && stat.value.trim() === "7") return {
		...stat,
		value: "Multiple",
		label: "Study destinations"
	};
	if (label === "reported ielts avg.") return {
		...stat,
		label: "Avg. IELTS band"
	};
	return stat;
}
function mapPublicSiteSettings(raw) {
	let parsed = raw;
	if (typeof parsed === "string") try {
		parsed = JSON.parse(parsed);
	} catch {
		parsed = null;
	}
	const input = parsed && typeof parsed === "object" ? parsed : {};
	const phones = cleanStrings(input.phones, 3, 24);
	const emails = cleanStrings(input.emails, 3, 190);
	const hours = typeof input.officeHours === "string" ? input.officeHours.trim().slice(0, 120) : "";
	const faqs = Array.isArray(input.faqs) ? input.faqs.filter((item) => !!item && typeof item === "object").map((item) => ({
		q: typeof item.q === "string" ? item.q.trim().slice(0, 220) : "",
		a: typeof item.a === "string" ? item.a.trim().slice(0, 1200) : ""
	})).filter((item) => item.q && item.a).slice(0, 20) : [];
	const trustStats = Array.isArray(input.trustStats) ? input.trustStats.filter((item) => !!item && typeof item === "object").map((item) => ({
		value: typeof item.value === "string" ? item.value.trim().slice(0, 40) : "",
		label: typeof item.label === "string" ? item.label.trim().slice(0, 80) : ""
	})).filter((item) => item.value && item.label).slice(0, 6).map(normalizeTrustStat) : [];
	return {
		phones: phones.length ? phones : defaultSiteSettings.phones,
		emails: emails.length ? emails : defaultSiteSettings.emails,
		officeHours: hours || defaultSiteSettings.officeHours,
		faqs: faqs.length ? faqs : defaultSiteSettings.faqs,
		trustStats: trustStats.length ? trustStats : defaultSiteSettings.trustStats
	};
}
function readSiteSettings(row) {
	return {
		...mapPublicSiteSettings(row?.public_settings_json),
		popupEnabled: row ? Boolean(row.popup_enabled) : defaultSiteSettings.popupEnabled,
		popupDelaySeconds: row ? Math.min(60, Math.max(3, Number(row.popup_delay_seconds) || 8)) : defaultSiteSettings.popupDelaySeconds,
		whatsappEnabled: row ? Boolean(row.whatsapp_enabled) : defaultSiteSettings.whatsappEnabled,
		approvalsMarqueeEnabled: row ? Boolean(row.approvals_marquee_enabled) : defaultSiteSettings.approvalsMarqueeEnabled
	};
}
function asFaqList(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((item) => !!item && typeof item === "object" && typeof item.q === "string" && typeof item.a === "string");
}
function asTrustStatList(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((item) => !!item && typeof item === "object" && typeof item.value === "string" && typeof item.label === "string");
}
export { __exportAll, approvals, asFaqList, asTrustStatList, bandScoreTable, changeAdminPassword, coachingCourses, coachingSchedule, countries, defaultCertificates, defaultSiteSettings, ensureAdminRecord, execute, getAdminRole, getSessionUser, jsonArray, loginAdmin, navLinks, posts, queryRows, readSiteSettings, resetAdminPassword, sendResetOtp, site, site_settings_DNyZ2OvY_exports, testimonials, verifyOtpAndResetPassword, visaServices };
