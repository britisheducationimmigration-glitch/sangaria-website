import { __exportAll as __exportAll$1, __toESM } from "../_runtime.mjs";
import { createMiddleware } from "./ssr.mjs";
import { require_promise } from "../_libs/mysql2+[...].mjs";
import crypto from "node:crypto";
// node_modules/.nitro/vite/services/ssr/assets/db.server-CEhaHsNY.js
var db_server_CEhaHsNY_exports = /* @__PURE__ */ __exportAll$1({
	__exportAll: () => __exportAll,
	approvals: () => approvals,
	auth_server_exports: () => auth_server_exports,
	bandScoreTable: () => bandScoreTable,
	changeAdminPassword: () => changeAdminPassword,
	coachingCourses: () => coachingCourses,
	coachingSchedule: () => coachingSchedule,
	countries: () => countries,
	execute: () => execute,
	faqs: () => faqs,
	getSessionUser: () => getSessionUser,
	jsonArray: () => jsonArray,
	loginAdmin: () => loginAdmin,
	posts: () => posts,
	queryRows: () => queryRows,
	resetAdminPassword: () => resetAdminPassword,
	sendResetOtp: () => sendResetOtp,
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
		intro: "Canada combines world-ranked colleges with clear post-study work rights and multiple routes to permanent residence through Express Entry and Provincial Nominee Programs.",
		stats: [
			{
				label: "Post-study work",
				value: "Up to 3 yrs"
			},
			{
				label: "Spouse work permit",
				value: "Eligible*"
			},
			{
				label: "Avg. tuition",
				value: "CAD 15–30k"
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
			"SDS-style fast processing streams",
			"Co-op & internship programs",
			"Large Punjabi & Rajasthani community"
		],
		costs: [
			{
				label: "GIC (living funds)",
				value: "CAD 20,635"
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
		english: "IELTS 6.0 (no band < 6) / PTE 60"
	},
	{
		slug: "uk",
		name: "United Kingdom",
		flag: "🇬🇧",
		code: "UK",
		headline: "One-year masters, world-famous universities",
		intro: "The UK offers shorter degrees, a 2-year Graduate Route visa and universities known across the world — ideal for students who want quality and speed.",
		stats: [
			{
				label: "Graduate Route",
				value: "18–24 months"
			},
			{
				label: "Masters duration",
				value: "1 year"
			},
			{
				label: "Avg. tuition",
				value: "£12–22k"
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
			"IELTS waivers at many universities",
			"Work 20 hrs/week while studying",
			"No GIC requirement"
		],
		costs: [
			{
				label: "Living funds (outside London)",
				value: "£1,136 / month"
			},
			{
				label: "Visa fee",
				value: "£524"
			},
			{
				label: "IHS (health surcharge)",
				value: "£776 / year"
			}
		],
		english: "IELTS UKVI 6.0 / PTE Academic 59"
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
				value: "AUD 1,600"
			},
			{
				label: "OSHC",
				value: "AUD ~600 / yr"
			}
		],
		english: "IELTS 6.0 / PTE 50"
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
		english: "IELTS 6.5 / PTE 58 / Duolingo 110"
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
				label: "Avg. tuition",
				value: "NZD 22–35k"
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
				value: "NZD 750"
			},
			{
				label: "Insurance",
				value: "NZD ~700 / yr"
			}
		],
		english: "IELTS 6.0 / PTE 50"
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
				value: "€0 – €3k"
			},
			{
				label: "Blocked account",
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
				label: "Blocked account",
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
		english: "IELTS 6.5 / basic German helps"
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
		title: "Canada study permit cap for 2027: what Rajasthan & Punjab students should know",
		category: "Visa News",
		date: "2026-10-20",
		excerpt: "IRCC has announced its allocation for next year. Here is how the provincial attestation letter (PAL) affects your application.",
		readMins: 5,
		body: [
			"Canada continues to manage the number of new study permits through a national cap and a provincial attestation letter (PAL) requirement for most college and undergraduate programs.",
			"Masters and PhD students at public institutions remain exempt from the PAL requirement, which makes postgraduate programs a strong option for graduates.",
			"Our advice: apply early, keep your funds documentation clean, and choose programs aligned with your previous education. Book a free counselling session to check your profile."
		]
	},
	{
		slug: "uk-graduate-route-update",
		title: "UK Graduate Route: the latest on post-study work duration",
		category: "Visa News",
		date: "2026-10-12",
		excerpt: "Changes to the Graduate Route mean students should plan their career timeline carefully. We break it down.",
		readMins: 4,
		body: [
			"The UK Graduate Route allows international students to stay and work after their studies. Recent policy updates have adjusted the duration for new applicants.",
			"Students starting in January and May intakes should confirm the rules that apply on their visa application date.",
			"Our counsellors can help you choose universities with strong employability records."
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
		body: ["German public universities charge little or no tuition, even for international students. You will need a blocked account to show living funds.", "Indian students need an APS certificate before applying for the student visa. Start the process at least 3 months in advance."]
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
		starts: "Nov 3"
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
		starts: "Nov 10"
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
		starts: "Nov 8"
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
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
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
          published BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX success_kind_idx (kind),
          INDEX success_date_idx (story_date)
        )
      `);
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
export { __exportAll, approvals, bandScoreTable, changeAdminPassword, coachingCourses, coachingSchedule, countries, db_server_CEhaHsNY_exports, execute, faqs, getSessionUser, jsonArray, loginAdmin, posts, queryRows, resetAdminPassword, sendResetOtp, testimonials, verifyOtpAndResetPassword, visaServices };
