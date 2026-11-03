import { __toESM } from "../_runtime.mjs";
import { require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { createMiddleware, createServerFn } from "./ssr.mjs";
import { asFaqList, asTrustStatList } from "./site-settings-DNyZ2OvY.mjs";
import { defaultCashflowData } from "./cashflow-i4Ureh_B.mjs";
import { formatBatchStartDate, getBatchDateStatus, isValidBatchStartDate } from "./batch-dates-7Z_1qomz.mjs";
import { getSupportedVideoEmbedUrl } from "./video-0JgGSTnq.mjs";
import { createSsrRpc } from "./public-functions-CqsoBxoJ.mjs";
import { ImagePlus, Pencil, Plus, Trash, X } from "../_libs/lucide-react.mjs";
import { ApprovalCard, TestimonialCard } from "./Cards-jSvl4-wr.mjs";
// node_modules/.nitro/vite/services/ssr/assets/admin-DejIoEfr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function stringValue(value, max = 5e3) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function numberValue(value, fallback = 0) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}
var adminMiddleware = createMiddleware().server(async ({ next, request }) => {
	const { ensureAdminRecord, getAdminRole, getSessionUser } = await import("./site-settings-DNyZ2OvY.mjs").then((n) => n.site_settings_DNyZ2OvY_exports).then((n) => n.auth_server_exports);
	const user = await getSessionUser(request.headers);
	if (!user || !await ensureAdminRecord(user)) throw new Error("Unauthorized");
	const role = await getAdminRole(user);
	if (!role) throw new Error("Forbidden");
	return next({ context: {
		user,
		role
	} });
});
var getAdminSnapshot = createServerFn({ method: "GET" }).middleware([adminMiddleware]).handler(createSsrRpc("bc6628e955d62f88a1c7e7355e3d11a03f725e72aea8b4ac892b92deda6d57a7"));
var updateEnquiry = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const status = stringValue(input.status, 24);
	if (![
		"New",
		"Contacted",
		"Follow-up",
		"Documents Pending",
		"Applied",
		"Converted",
		"Closed"
	].includes(status)) throw new Error("Invalid enquiry status");
	const followUp = stringValue(input.nextFollowUpAt, 32);
	if (followUp && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(followUp)) throw new Error("Invalid follow-up date");
	return {
		id: numberValue(input.id),
		status,
		assignedTo: stringValue(input.assignedTo, 190),
		nextFollowUpAt: followUp ? followUp.replace("T", " ") : null
	};
}).handler(createSsrRpc("ad3256a0430cdfd9e87e6fa51a6ece8bffd7173a5a185b348afdb93198753076"));
var addEnquiryActivity = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const enquiryId = numberValue(input.enquiryId);
	const body = stringValue(input.body, 5e3);
	if (enquiryId <= 0 || !body) throw new Error("Lead and comment are required");
	return {
		enquiryId,
		body
	};
}).handler(createSsrRpc("e663fd49d3889387fe77ccdaa4d8f92cc898cb662f4c769818827c42de74df1f"));
var updateEnquiryActivity = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const id = numberValue(input.id);
	const body = stringValue(input.body, 5e3);
	if (id <= 0 || !body) throw new Error("Comment and text are required");
	return {
		id,
		body
	};
}).handler(createSsrRpc("28c12ead99305a1bce89d74e2d832a8cbb0756610bfb61d0428c57a75a725887"));
var deleteEnquiryActivity = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(createSsrRpc("8e662402a880a86902b0ddaf1c5cec83d236450c39efd19a4b2941a8b32b6a18"));
var deleteEnquiry = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(createSsrRpc("15e52c03393ad28b1a823939164c2c0bf525a268f8cdb7b695a0502ff5f29081"));
var exportEnquiries = createServerFn({ method: "GET" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const status = stringValue(input.status, 24);
	const from = stringValue(input.from, 10);
	const to = stringValue(input.to, 10);
	if (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) throw new Error("Invalid start date");
	if (to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) throw new Error("Invalid end date");
	return {
		query: stringValue(input.query, 120),
		status,
		from,
		to
	};
}).handler(createSsrRpc("8d39bc6fa67345f60fbe9452e7447957afbec69e4e08df633b695494259b9701"));
var savePost = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const title = stringValue(input.title, 220);
	const slug = stringValue(input.slug, 190).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	if (!title || !slug) throw new Error("Title and slug are required");
	const body = Array.isArray(input.body) ? input.body.map((item) => stringValue(item, 5e3)).filter(Boolean) : stringValue(input.body, 2e4).split("\n").map((item) => item.trim()).filter(Boolean);
	return {
		id: numberValue(input.id),
		slug,
		title,
		category: stringValue(input.category, 80) || "Visa News",
		date: stringValue(input.date, 10) || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		excerpt: stringValue(input.excerpt, 5e3),
		readMins: Math.max(1, Math.min(60, numberValue(input.readMins, 4))),
		body,
		published: Boolean(input.published)
	};
}).handler(createSsrRpc("62978480ea3c5b39a74674063c2e970924ad4501dcd4420a571f9b2184cfa167"));
var deletePost = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(createSsrRpc("35feff8f46e8d48cb3925e5e30489b8c62ac8214a17e30d5d189127a46ce3e18"));
var saveStory = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const kind = stringValue(input.kind, 20);
	if (kind !== "approval" && kind !== "testimonial") throw new Error("Choose a story type");
	const name = stringValue(input.name, 160);
	if (!name) throw new Error("Name is required");
	const mediaType = kind === "approval" ? stringValue(input.mediaType, 10) : "none";
	if (![
		"none",
		"photo",
		"video"
	].includes(mediaType)) throw new Error("Choose a valid approval media type");
	const photoBase64 = typeof input.photoBase64 === "string" ? input.photoBase64 : "";
	if (photoBase64.length > 22e5 || photoBase64 && !/^[A-Za-z0-9+/]+={0,2}$/.test(photoBase64)) throw new Error("Choose a smaller student photo");
	const photoMimeType = stringValue(input.photoMimeType, 40);
	const videoUrl = stringValue(input.videoUrl, 500);
	const mediaAlt = stringValue(input.mediaAlt, 500);
	const mediaConsent = Boolean(input.mediaConsent);
	const published = Boolean(input.published);
	if (mediaType === "photo" && !mediaAlt) throw new Error("Add a photo description for accessibility");
	if (mediaType === "video" && !getSupportedVideoEmbedUrl(videoUrl)) throw new Error("Use a valid HTTPS YouTube or Vimeo link");
	if (photoBase64 && (mediaType !== "photo" || photoMimeType !== "image/webp")) throw new Error("Select a photo in JPG, PNG or WebP format");
	if (published && mediaType !== "none" && !mediaConsent) throw new Error("Confirm the student agreed to publish this media");
	return {
		id: numberValue(input.id),
		kind,
		name,
		city: stringValue(input.city, 120),
		country: stringValue(input.country, 120),
		visa: stringValue(input.visa, 160),
		quote: stringValue(input.quote, 1e4),
		rating: Math.max(1, Math.min(5, numberValue(input.rating, 5))),
		initials: stringValue(input.initials, 10),
		flag: stringValue(input.flag, 10),
		date: stringValue(input.date, 10) || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		note: stringValue(input.note, 220),
		mediaType,
		photoBase64,
		photoMimeType,
		videoUrl,
		mediaAlt,
		mediaConsent,
		homepageFeatured: input.homepageFeatured === void 0 ? true : Boolean(input.homepageFeatured),
		published
	};
}).handler(createSsrRpc("d3c3c7bbca9f44251c98c9707a0d69e9f69f1dbde3a7c47cb711f579dd8e32d3"));
var deleteStory = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(createSsrRpc("af452889f2d809e70fa55e1914332b244af16ce42d7d603f28a3d490252fb6e0"));
var saveBatch = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const program = stringValue(input.program, 80);
	const batch = stringValue(input.batch, 160);
	const starts = stringValue(input.starts, 80);
	if (!program || !batch) throw new Error("Program and batch name are required");
	if (!isValidBatchStartDate(starts)) throw new Error("Choose a valid full batch start date");
	return {
		id: numberValue(input.id),
		program,
		batch,
		time: stringValue(input.time, 160),
		seats: Math.max(0, Math.min(999, numberValue(input.seats, 0))),
		starts,
		published: Boolean(input.published)
	};
}).handler(createSsrRpc("338861e369ff76d0d0164fb0eb7899292484abf75eed6c980ebff889b53346ba"));
var deleteBatch = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(createSsrRpc("39063f423bb6527fc2fcb556617ff8623e0cafb94000f1e9e560720454a0e4b3"));
var certificateInput = (data) => {
	const input = data ?? {};
	const id = numberValue(input.id);
	const title = stringValue(input.title, 220);
	const issuer = stringValue(input.issuer, 180);
	const category = stringValue(input.category, 100);
	const credentialDate = stringValue(input.credentialDate, 80);
	const altText = stringValue(input.altText, 500);
	const rawImageBase64 = typeof input.imageBase64 === "string" ? input.imageBase64 : "";
	if (rawImageBase64.length > 42e5) throw new Error("Choose a smaller image (maximum 3 MB after compression)");
	const imageBase64 = stringValue(rawImageBase64, 42e5);
	const imageMimeType = stringValue(input.imageMimeType, 40);
	const published = Boolean(input.published);
	const homepageFeatured = Boolean(input.homepageFeatured);
	const sortOrder = Math.max(0, Math.min(9999, numberValue(input.sortOrder)));
	if (id < 0 || !title || !category || !altText) throw new Error("Title, category and image description are required");
	if (!id && !imageBase64) throw new Error("Choose a certificate photo before saving");
	if (imageBase64 && (!/^[A-Za-z0-9+/]+={0,2}$/.test(imageBase64) || imageBase64.length > 42e5)) throw new Error("Choose a smaller image (maximum 3 MB after compression)");
	if (imageBase64 && ![
		"image/webp",
		"image/jpeg",
		"image/png"
	].includes(imageMimeType)) throw new Error("Use a WebP, JPEG or PNG image");
	return {
		id,
		title,
		issuer,
		category,
		credentialDate,
		altText,
		imageBase64,
		imageMimeType,
		published,
		homepageFeatured,
		sortOrder
	};
};
var saveCertificate = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(certificateInput).handler(createSsrRpc("bb009eeedbfa5efc4b9c62d6379f0b1449902718981e6f5a546f936058c8265e"));
var deleteCertificate = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(createSsrRpc("c16781502dffbbc44d5d70bde7fc33a394a6ae6f7578c8515d34271ff3b1fce7"));
var updateSettings = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const phones = Array.isArray(input.phones) ? input.phones.map((item) => stringValue(item, 24)).filter(Boolean).slice(0, 3) : [];
	const emails = Array.isArray(input.emails) ? input.emails.map((item) => stringValue(item, 190).toLowerCase()).filter(Boolean).slice(0, 3) : [];
	const officeHours = stringValue(input.officeHours, 120);
	const faqs = asFaqList(input.faqs).map((item) => ({
		q: stringValue(item.q, 220),
		a: stringValue(item.a, 1200)
	})).filter((item) => item.q && item.a).slice(0, 20);
	const trustStats = asTrustStatList(input.trustStats).map((item) => ({
		value: stringValue(item.value, 40),
		label: stringValue(item.label, 80)
	})).filter((item) => item.value && item.label).slice(0, 6);
	if (!phones.length || phones.some((phone) => !/^[0-9+() -]{7,24}$/.test(phone))) throw new Error("Add at least one valid phone number.");
	if (!emails.length || emails.some((email) => !/^\S+@\S+\.\S+$/.test(email))) throw new Error("Add at least one valid email address.");
	if (!officeHours) throw new Error("Office hours cannot be empty.");
	if (!faqs.length || !trustStats.length) throw new Error("Keep at least one FAQ and one homepage trust statistic.");
	const publicSettings = {
		phones,
		emails,
		officeHours,
		faqs,
		trustStats
	};
	return {
		popupEnabled: Boolean(input.popupEnabled),
		popupDelaySeconds: Math.min(60, Math.max(3, numberValue(input.popupDelaySeconds, 8))),
		whatsappEnabled: Boolean(input.whatsappEnabled),
		approvalsMarqueeEnabled: Boolean(input.approvalsMarqueeEnabled),
		publicSettingsJson: JSON.stringify(publicSettings)
	};
}).handler(createSsrRpc("55313ac1556d02d085bd7c69c29cd3691075d6bcaaa8b00941bbff11bbed3b7e"));
var saveContactDetails = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const phones = Array.isArray(input.phones) ? input.phones.map((item) => stringValue(item, 24)).filter(Boolean).slice(0, 3) : [];
	const emails = Array.isArray(input.emails) ? input.emails.map((item) => stringValue(item, 190).toLowerCase()).filter(Boolean).slice(0, 3) : [];
	const officeHours = stringValue(input.officeHours, 120);
	if (!phones.length || phones.some((phone) => !/^[0-9+() -]{7,24}$/.test(phone))) throw new Error("Add at least one valid phone number.");
	if (!emails.length || emails.some((email) => !/^\S+@\S+\.\S+$/.test(email))) throw new Error("Add at least one valid email address.");
	if (!officeHours) throw new Error("Office hours cannot be empty.");
	return {
		phones,
		emails,
		officeHours
	};
}).handler(createSsrRpc("1f9b74db8fc24712f43f35dc60e61771ad7982f199032a04bf4d863e328bdd19"));
var saveTrustStat = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const action = stringValue(input.action, 12);
	const index = numberValue(input.index, -1);
	if (!["save", "remove"].includes(action) || !Number.isInteger(index) || index < 0 || index > 5) throw new Error("Invalid trust number action.");
	const statInput = input.trustStat ?? {};
	const trustStat = {
		value: stringValue(statInput.value, 40),
		label: stringValue(statInput.label, 80)
	};
	if (action === "save" && (!trustStat.value || !trustStat.label)) throw new Error("Enter both a trust number and its label before saving.");
	return {
		action,
		index,
		trustStat
	};
}).handler(createSsrRpc("2af8d8d7c0d71d21e4776db91e9724944518b2b113519e8babcf14e06fa0e62f"));
var saveFaq = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const action = stringValue(input.action, 12);
	const index = numberValue(input.index, -1);
	if (!["save", "remove"].includes(action) || !Number.isInteger(index) || index < 0 || index > 19) throw new Error("Invalid FAQ action.");
	const faqInput = input.faq ?? {};
	const faq = {
		q: stringValue(faqInput.q, 220),
		a: stringValue(faqInput.a, 1200)
	};
	if (action === "save" && (!faq.q || !faq.a)) throw new Error("Enter both a question and an answer before saving.");
	return {
		action,
		index,
		faq
	};
}).handler(createSsrRpc("1069b7583e576da249b8ac3355278fca4fd5bedc13efea80d549f94a5aadf7b0"));
var saveCashflow = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	if (!Array.isArray(input.cashflowData) || input.cashflowData.length === 0) throw new Error("Cashflow data is required");
	const cashflowJson = JSON.stringify(input.cashflowData);
	if (cashflowJson.length > 5e5) throw new Error("Cashflow data is too large");
	return { cashflowJson };
}).handler(createSsrRpc("8a86220c9bc907d23b41b8c2d3864ed060bc59c7caaa9602630e8c140ad10d26"));
var getAdminCashflow = createServerFn({ method: "GET" }).middleware([adminMiddleware]).handler(createSsrRpc("fbda677f961f87fbff0df45aa1862a016d8f4b377d401fb4f7da96872e59e1b7"));
var saveAdminUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const email = stringValue(input.email, 190).toLowerCase();
	const role = stringValue(input.role, 30);
	const password = stringValue(input.password, 200);
	if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email");
	if (![
		"super_admin",
		"content_editor",
		"enquiry_manager"
	].includes(role)) throw new Error("Choose a valid role");
	return {
		email,
		role,
		name: stringValue(input.name, 160) || email,
		password
	};
}).handler(createSsrRpc("8ed346d021f8c1b267a71fb35cfb838fe5ed76b57384c3c2919bf8607c3040b4"));
var deleteAdminUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ openId: stringValue(data?.openId, 190) })).handler(createSsrRpc("3b946289294a2951af82164372e0d0a3ef43d95ff26b509e80b84ddcd23c49ec"));
var emptyDraft = () => ({
	id: 0,
	title: "",
	issuer: "",
	category: "Partner authorisations",
	credentialDate: "",
	altText: "",
	imageSrc: "",
	imageBase64: "",
	imageMimeType: "",
	homepageFeatured: false,
	published: false,
	sortOrder: 100
});
var inputClass = "mt-1 min-h-11 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm text-forest-900";
var labelClass = "block text-xs font-bold text-forest-900/75";
async function compressImage(file) {
	if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 2200 / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(bitmap.width * scale));
	canvas.height = Math.max(1, Math.round(bitmap.height * scale));
	const context = canvas.getContext("2d");
	if (!context) throw new Error("Could not prepare this image.");
	context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	const blob = await new Promise((resolve, reject) => {
		canvas.toBlob((value) => value ? resolve(value) : reject(/* @__PURE__ */ new Error("Could not compress this image.")), "image/webp", .86);
	});
	if (blob.size > 3145728) throw new Error("Image is still too large. Choose a smaller photo.");
	return {
		imageSrc: URL.createObjectURL(blob),
		imageBase64: (await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result ?? ""));
			reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read this image."));
			reader.readAsDataURL(blob);
		})).split(",")[1] ?? "",
		imageMimeType: "image/webp"
	};
}
function CertificatePanel({ items, onReload, onNotice }) {
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	function mayDiscard() {
		return !dirty || window.confirm("Discard the unsaved certificate changes?");
	}
	function startNew() {
		if (!mayDiscard()) return;
		setDraft(emptyDraft());
		setDirty(false);
		setError("");
	}
	function startEdit(item) {
		if (!mayDiscard()) return;
		setDraft({
			id: item.id,
			title: item.title,
			issuer: item.issuer,
			category: item.category,
			credentialDate: item.credentialDate,
			altText: item.altText,
			imageSrc: item.imageSrc,
			imageBase64: "",
			imageMimeType: "",
			homepageFeatured: item.homepageFeatured,
			published: item.published,
			sortOrder: item.sortOrder
		});
		setDirty(false);
		setError("");
	}
	function cancelEdit() {
		if (!mayDiscard()) return;
		setDraft(null);
		setDirty(false);
		setError("");
	}
	function update(key, value) {
		setDraft((current) => current ? {
			...current,
			[key]: value
		} : current);
		setDirty(true);
	}
	async function choosePhoto(event) {
		const file = event.currentTarget.files?.[0];
		event.currentTarget.value = "";
		if (!file) return;
		try {
			const image = await compressImage(file);
			setDraft((current) => current ? {
				...current,
				...image
			} : current);
			setDirty(true);
			setError("");
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Could not prepare the image.");
		}
	}
	async function submit(event) {
		event.preventDefault();
		if (!draft) return;
		setBusy(true);
		setError("");
		try {
			await saveCertificate({ data: {
				id: draft.id,
				title: draft.title,
				issuer: draft.issuer,
				category: draft.category,
				credentialDate: draft.credentialDate,
				altText: draft.altText,
				imageBase64: draft.imageBase64,
				imageMimeType: draft.imageMimeType,
				homepageFeatured: draft.homepageFeatured,
				published: draft.published,
				sortOrder: draft.sortOrder
			} });
			setDraft(null);
			setDirty(false);
			onNotice(draft.published ? "Certificate saved." : "Certificate saved as a draft.");
			await onReload();
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Could not save the certificate.");
		} finally {
			setBusy(false);
		}
	}
	async function remove(item) {
		if (!window.confirm("Remove \"" + item.title + "\" from the certificate library? Its uploaded photo will also be removed.")) return;
		setBusy(true);
		try {
			await deleteCertificate({ data: { id: item.id } });
			onNotice("Certificate removed.");
			await onReload();
			if (draft?.id === item.id) {
				setDraft(null);
				setDirty(false);
			}
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Could not remove the certificate.");
		} finally {
			setBusy(false);
		}
	}
	const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "admin-certificates-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600",
						children: "Public credentials page"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "admin-certificates-title",
						className: "mt-1 font-display text-2xl font-extrabold text-forest-900",
						children: "Certificates"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-forest-900/65",
						children: "Choose a photo, enter its details, then press Save. Nothing is published while you edit."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: startNew,
					className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white hover:bg-forest-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						"aria-hidden": "true",
						className: "size-4"
					}), " Add certificate"]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800",
				children: error
			}),
			draft && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mb-8 grid gap-5 rounded-2xl border border-coral-500/25 bg-white p-4 shadow-sm sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-extrabold",
							children: draft.id ? "Edit certificate" : "Add certificate"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-forest-900/60",
							children: "Changes save only when you press the button below."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: cancelEdit,
							"aria-label": "Close editor",
							className: "grid size-10 shrink-0 place-items-center rounded-full border border-forest-900/15 hover:bg-forest-50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								"aria-hidden": "true",
								className: "size-4"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelClass,
								children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									maxLength: 220,
									value: draft.title,
									onChange: (e) => update("title", e.currentTarget.value),
									className: inputClass
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelClass,
								children: ["Issuer / institution", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									maxLength: 180,
									value: draft.issuer,
									onChange: (e) => update("issuer", e.currentTarget.value),
									className: inputClass
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelClass,
								children: [
									"Category",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										list: "certificate-category-suggestions",
										maxLength: 100,
										value: draft.category,
										onChange: (e) => update("category", e.currentTarget.value),
										className: inputClass
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("datalist", {
										id: "certificate-category-suggestions",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Partner authorisations" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Training & qualifications" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Recognition & events" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Student visa results" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "IELTS & PTE results" })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelClass,
								children: ["Certificate date (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									maxLength: 80,
									value: draft.credentialDate,
									onChange: (e) => update("credentialDate", e.currentTarget.value),
									placeholder: "e.g. 2026",
									className: inputClass
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelClass + " sm:col-span-2",
								children: ["Image description for accessibility", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									maxLength: 500,
									value: draft.altText,
									onChange: (e) => update("altText", e.currentTarget.value),
									className: inputClass,
									placeholder: "Describe the certificate photo"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2 sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-forest-900/15 bg-cream px-4 py-2 text-sm font-bold hover:bg-forest-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
									"aria-hidden": "true",
									className: "size-4"
								}),
								" Choose photo",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/jpeg,image/png,image/webp",
									onChange: choosePhoto,
									className: "sr-only"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-forest-900/60",
							children: "JPG, PNG or WebP. The photo is resized and stored in the site database (up to 3 MB)."
						})] }), draft.imageSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex aspect-[4/3] items-center justify-center rounded-xl bg-cream p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: draft.imageSrc,
								alt: "Selected certificate preview",
								className: "certificate-image-enhanced max-h-full max-w-full object-contain"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-forest-900/20 bg-cream text-xs text-forest-900/55",
							children: "Choose a certificate photo"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 items-center gap-2 rounded-xl bg-cream px-3 py-2 text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: draft.published,
									onChange: (e) => update("published", e.currentTarget.checked),
									className: "size-4 accent-forest-900"
								}), " Publish on certificates page"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 items-center gap-2 rounded-xl bg-cream px-3 py-2 text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: draft.homepageFeatured,
									onChange: (e) => update("homepageFeatured", e.currentTarget.checked),
									className: "size-4 accent-forest-900"
								}), " Include in homepage rotation"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelClass,
								children: ["Display order", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									max: 9999,
									value: draft.sortOrder,
									onChange: (e) => update("sortOrder", Number(e.currentTarget.value)),
									className: inputClass
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap justify-end gap-3 border-t border-forest-900/10 pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: cancelEdit,
							className: "min-h-11 rounded-full border border-forest-900/20 px-5 py-2 text-sm font-bold",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy || !draft.title.trim() || !draft.category.trim() || !draft.altText.trim() || !draft.id && !draft.imageBase64,
							className: "min-h-11 rounded-full bg-coral-500 px-5 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50",
							children: busy ? "Saving…" : draft.published ? "Save & publish" : "Save draft"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [sortedItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "overflow-hidden rounded-2xl bg-white ring-1 ring-forest-900/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex aspect-[4/3] items-center justify-center bg-cream p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.imageSrc,
							alt: item.altText,
							loading: "lazy",
							className: "certificate-image-enhanced max-h-full max-w-full object-contain"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-forest-50 px-2.5 py-1 text-[10px] font-bold text-forest-700",
										children: item.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full px-2.5 py-1 text-[10px] font-bold " + (item.published ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"),
										children: item.published ? "Published" : "Draft"
									}),
									item.homepageFeatured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-coral-50 px-2.5 py-1 text-[10px] font-bold text-coral-700",
										children: "Homepage rotation"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-display text-base font-extrabold text-forest-900",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-forest-900/60",
								children: item.issuer
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex gap-2 border-t border-forest-900/10 pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => startEdit(item),
									className: "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-forest-900/15 px-3 py-2 text-xs font-bold hover:bg-forest-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										"aria-hidden": "true",
										className: "size-3.5"
									}), " Edit"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									onClick: () => void remove(item),
									"aria-label": "Remove " + item.title,
									className: "grid size-11 place-items-center rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, {
										"aria-hidden": "true",
										className: "size-4"
									})
								})]
							})
						]
					})]
				}, item.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl bg-white p-8 text-center text-sm text-forest-900/60 sm:col-span-2 lg:col-span-3",
					children: "No certificates have been added yet."
				})]
			})
		]
	});
}
async function preparePhoto(file) {
	if (!file.type.startsWith("image/")) throw new Error("Choose a JPG, PNG or WebP image.");
	if (file.size > 15728640) throw new Error("Choose an image smaller than 15 MB.");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(bitmap.width * scale));
	canvas.height = Math.max(1, Math.round(bitmap.height * scale));
	const context = canvas.getContext("2d");
	if (!context) throw new Error("Could not prepare this image.");
	context.imageSmoothingQuality = "high";
	context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	const blob = await new Promise((resolve, reject) => {
		canvas.toBlob((value) => value ? resolve(value) : reject(/* @__PURE__ */ new Error("Could not prepare this image.")), "image/webp", .82);
	});
	if (blob.size > 1572864) throw new Error("The prepared image is still too large. Choose a smaller photo.");
	return {
		imageSrc: URL.createObjectURL(blob),
		imageBase64: await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result ?? "").split(",")[1] ?? "");
			reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read this image."));
			reader.readAsDataURL(blob);
		}),
		imageMimeType: "image/webp"
	};
}
function StoryEditor({ item, onReload, onNotice, onClose }) {
	const [form, setForm] = (0, import_react.useState)(() => ({
		...item,
		photoBase64: "",
		photoMimeType: ""
	}));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const previewUrl = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => () => {
		if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
	}, []);
	function releasePreview() {
		if (previewUrl.current) {
			URL.revokeObjectURL(previewUrl.current);
			previewUrl.current = "";
		}
	}
	function update(key, value) {
		setForm((current) => ({
			...current,
			[key]: value
		}));
		setError("");
	}
	function selectMediaType(mediaType) {
		if (mediaType !== "photo") releasePreview();
		setForm((current) => ({
			...current,
			mediaType,
			photoSrc: mediaType === "photo" ? current.photoSrc : "",
			photoBase64: mediaType === "photo" ? current.photoBase64 : "",
			photoMimeType: mediaType === "photo" ? current.photoMimeType : "",
			videoUrl: mediaType === "video" ? current.videoUrl : "",
			mediaAlt: mediaType === "none" ? "" : current.mediaAlt,
			mediaConsent: mediaType === current.mediaType ? current.mediaConsent : false
		}));
		setError("");
	}
	async function choosePhoto(event) {
		const file = event.currentTarget.files?.[0];
		event.currentTarget.value = "";
		if (!file) return;
		try {
			const photo = await preparePhoto(file);
			releasePreview();
			previewUrl.current = photo.imageSrc;
			setForm((current) => ({
				...current,
				mediaType: "photo",
				photoSrc: photo.imageSrc,
				photoBase64: photo.imageBase64,
				photoMimeType: photo.imageMimeType,
				videoUrl: "",
				mediaConsent: false
			}));
			setError("");
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Could not prepare this image.");
		}
	}
	async function submit(event) {
		event.preventDefault();
		if (form.kind === "approval" && form.mediaType !== "none" && form.published && !form.mediaConsent) {
			setError("Confirm that the student has agreed to public use of this photo or video before publishing.");
			return;
		}
		setBusy(true);
		setError("");
		try {
			await saveStory({ data: form });
			releasePreview();
			await onReload();
			onNotice("Success story saved.");
			onClose();
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Could not save the story. Check the fields.");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!form.id || !window.confirm("Delete this story?")) return;
		setBusy(true);
		try {
			await deleteStory({ data: { id: form.id } });
			releasePreview();
			await onReload();
			onNotice("Story deleted.");
			onClose();
		} catch {
			setError("Could not delete this story.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "rounded-3xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600",
						children: "Success stories"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-extrabold",
						children: "Story editor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-forest-900/55",
						children: "Add approval details and, when available, a student photo or hosted video. Published entries appear on Success Stories; choose separately whether each story is highlighted on the home page."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": preview,
						onClick: () => setPreview((value) => !value),
						className: "rounded-full px-4 py-2 text-xs font-bold ring-1 ring-forest-900/15 " + (preview ? "bg-coral-500 text-white ring-coral-500" : "bg-white text-forest-900"),
						children: preview ? "Back to edit" : "Preview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "text-sm font-bold text-forest-900/50",
						children: "Close"
					})]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800",
				children: error
			}),
			preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-forest-50 p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] font-bold uppercase tracking-widest text-coral-600",
						children: "Public card preview · unsaved changes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-3 max-w-md",
						children: form.kind === "approval" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalCard, { a: form }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, { t: form })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-forest-900/55",
						children: "Preview changes only; they reach the website after you save."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
							label: "Story type",
							hint: "Use approval for a visa result or testimonial for a client quote.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "field",
								value: form.kind,
								onChange: (event) => {
									const kind = event.currentTarget.value;
									if (kind === "testimonial") {
										releasePreview();
										setForm((current) => ({
											...current,
											kind,
											mediaType: "none",
											photoSrc: "",
											photoBase64: "",
											photoMimeType: "",
											videoUrl: "",
											mediaAlt: "",
											mediaConsent: false
										}));
									} else update("kind", kind);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "testimonial",
									children: "Client testimonial"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "approval",
									children: "Visa approval"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
							label: "Person / family name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								value: form.name,
								onChange: (event) => update("name", event.currentTarget.value),
								placeholder: "Client name",
								required: true
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
							label: "City",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								value: form.city,
								onChange: (event) => update("city", event.currentTarget.value),
								placeholder: "Sangaria"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
							label: "Destination country",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								value: form.country,
								onChange: (event) => update("country", event.currentTarget.value),
								placeholder: "Canada, United Kingdom or Australia"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
							label: "Visa / course",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								value: form.visa,
								onChange: (event) => update("visa", event.currentTarget.value),
								placeholder: "Study Permit, Student Visa, IELTS…"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
							label: "Flag code / emoji (optional)",
							hint: "Example: CA, UK, AU or a flag emoji.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								value: form.flag,
								onChange: (event) => update("flag", event.currentTarget.value),
								placeholder: "CA or 🇨🇦"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
							label: "Initials",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								value: form.initials,
								onChange: (event) => update("initials", event.currentTarget.value),
								placeholder: "HK"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
							label: "Approval / story date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								type: "date",
								value: form.date,
								onChange: (event) => update("date", event.currentTarget.value)
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
						label: "Rating (1 to 5 stars)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							type: "number",
							min: "1",
							max: "5",
							value: form.rating,
							onChange: (event) => update("rating", Number(event.currentTarget.value))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
						label: "Client quote",
						hint: "For an approval, add a short result description.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field",
							rows: 5,
							value: form.quote,
							onChange: (event) => update("quote", event.currentTarget.value),
							placeholder: "My visa was approved…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
						label: "Short result note",
						hint: "Example: September intake · MSc Data Science",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: form.note,
							onChange: (event) => update("note", event.currentTarget.value),
							placeholder: "Extra result detail shown on the card"
						})
					}),
					form.kind === "approval" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-4 rounded-2xl border border-forest-900/10 bg-cream/70 p-4 sm:p-5",
						"aria-label": "Approval photo or video",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-forest-900",
								children: ["Student photo or video ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-normal text-forest-900/50",
									children: "(optional)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-forest-900/60",
								children: "Photos are resized to a light WebP image. Hosted YouTube or Vimeo videos autoplay muted when they appear on screen; visitors can use the player controls to pause or unmute."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
								label: "Media type",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "field",
									value: form.mediaType,
									onChange: (event) => selectMediaType(event.currentTarget.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "none",
											children: "No media"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "photo",
											children: "Student photo"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "video",
											children: "Hosted video link"
										})
									]
								})
							}),
							form.mediaType === "photo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2 sm:items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-forest-900/15 bg-white px-4 py-2 text-sm font-bold hover:bg-forest-50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
												"aria-hidden": "true",
												className: "size-4"
											}),
											" Choose student photo",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/jpeg,image/png,image/webp",
												onChange: choosePhoto,
												className: "sr-only"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-forest-900/60",
										children: "JPG, PNG or WebP · prepared image limit 1.5 MB."
									})] }),
									form.photoSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: form.photoSrc,
										alt: "Selected student approval preview",
										className: "max-h-80 w-full rounded-xl bg-white object-contain"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-forest-900/20 bg-white text-xs text-forest-900/50",
										children: "Choose a student photo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
										label: "Photo description for accessibility",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											maxLength: 500,
											value: form.mediaAlt,
											onChange: (event) => update("mediaAlt", event.currentTarget.value),
											placeholder: "Student receiving a study visa approval",
											required: true
										})
									})
								]
							}),
							form.mediaType === "video" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryField, {
								label: "YouTube or Vimeo link",
								hint: "Use an unlisted YouTube link when the video should not appear in YouTube search.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "field",
									type: "url",
									maxLength: 500,
									value: form.videoUrl,
									onChange: (event) => {
										const videoUrl = event.currentTarget.value;
										setForm((current) => ({
											...current,
											videoUrl,
											mediaConsent: false
										}));
									},
									placeholder: "https://youtu.be/… or https://vimeo.com/…",
									required: true
								})
							}),
							form.mediaType !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start gap-3 rounded-xl border border-forest-900/10 bg-white p-3 text-xs leading-relaxed text-forest-900/75",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.mediaConsent,
									onChange: (event) => update("mediaConsent", event.currentTarget.checked),
									className: "mt-0.5 size-4 shrink-0 accent-forest-900"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I confirm the student has agreed to publish this photo or video on our website." })]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 border-t border-forest-900/10 pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-3 rounded-xl border border-forest-900/10 bg-forest-50 p-3 text-sm font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.homepageFeatured,
							onChange: (event) => update("homepageFeatured", event.currentTarget.checked),
							className: "mt-0.5 size-4 shrink-0 accent-forest-900"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Show on homepage", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs font-normal leading-relaxed text-forest-900/60",
							children: "Turn off to keep this published story on the Success Stories page only."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.published,
							onChange: (event) => update("published", event.currentTarget.checked)
						}), " Publish on website"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: busy || preview,
							className: "rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50",
							children: busy ? "Saving…" : "Save story"
						}), form.id > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: () => void remove(),
							className: "rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-700 disabled:opacity-50",
							children: "Delete"
						})]
					})
				]
			})
		]
	});
}
function StoryField({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-xs font-bold text-forest-900/75",
		children: [
			label,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block font-normal leading-relaxed text-forest-900/50",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1",
				children
			})
		]
	});
}
var roleLabels = {
	super_admin: "Super Admin",
	content_editor: "Content Editor",
	enquiry_manager: "Enquiry Manager"
};
var blankPost = {
	slug: "",
	title: "",
	category: "Visa News",
	date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
	excerpt: "",
	readMins: 4,
	body: [],
	published: false
};
var blankStory = {
	kind: "testimonial",
	name: "",
	city: "",
	country: "",
	visa: "",
	quote: "",
	rating: 5,
	initials: "",
	flag: "",
	date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
	note: "",
	mediaType: "none",
	photoSrc: "",
	videoUrl: "",
	mediaAlt: "",
	mediaConsent: false,
	homepageFeatured: true,
	published: false
};
function AdminPage() {
	const [snapshot, setSnapshot] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("enquiries");
	const [query, setQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("All");
	const [dateFrom, setDateFrom] = (0, import_react.useState)("");
	const [dateTo, setDateTo] = (0, import_react.useState)("");
	const [selectedPost, setSelectedPost] = (0, import_react.useState)(null);
	const [selectedStory, setSelectedStory] = (0, import_react.useState)(null);
	const [selectedBatch, setSelectedBatch] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [showChangePass, setShowChangePass] = (0, import_react.useState)(false);
	const [settingsDirty, setSettingsDirty] = (0, import_react.useState)(false);
	async function reload() {
		try {
			setError("");
			setSnapshot(await getAdminSnapshot());
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Admin access is not configured yet.");
		}
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	(0, import_react.useEffect)(() => {
		if (snapshot?.user.role === "content_editor" && tab === "enquiries") setTab("news");
	}, [snapshot?.user.role, tab]);
	if (!snapshot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "grid min-h-screen place-items-center bg-cream px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAuthCard, { onLoginSuccess: reload })
	});
	const filtered = snapshot.enquiries.filter((item) => {
		const haystack = `${item.name} ${item.phone} ${item.email} ${item.city} ${item.country} ${item.interest} ${item.status} ${item.assignedTo} ${item.source} ${item.summary}`.toLowerCase();
		const created = item.createdAt.slice(0, 10);
		return haystack.includes(query.toLowerCase()) && (statusFilter === "All" || item.status === statusFilter) && (!dateFrom || created >= dateFrom) && (!dateTo || created <= dateTo);
	});
	const newLeadQueue = snapshot.enquiries.filter((item) => item.status === "New");
	const draftQueue = snapshot.posts.filter((item) => !item.published);
	const tabs = snapshot.user.role === "super_admin" ? [
		["enquiries", `Enquiries (${snapshot.enquiryStats.total})`],
		["demo", `Demo requests (${snapshot.enquiryStats.demoRequests})`],
		["review", `Review queue (${newLeadQueue.length + draftQueue.length})`],
		["reports", "Reports"],
		["news", "News & Updates"],
		["stories", "Success Stories"],
		["certificates", "Certificates"],
		["batches", "Coaching batches"],
		["budget", "💰 Cashflow Budget"],
		["settings", "Site settings"],
		["users", "Users & roles"]
	] : snapshot.user.role === "content_editor" ? [
		["review", `Review queue (${draftQueue.length})`],
		["news", "News & Updates"],
		["stories", "Success Stories"],
		["certificates", "Certificates"],
		["batches", "Coaching batches"]
	] : [
		["enquiries", `Enquiries (${snapshot.enquiries.length})`],
		["demo", `Demo requests (${snapshot.enquiryStats.demoRequests})`],
		["review", `Review queue (${newLeadQueue.length})`],
		["reports", "Reports"]
	];
	function showNotice(message) {
		setNotice(message);
		window.setTimeout(() => setNotice(""), 2800);
	}
	function selectTab(value) {
		if (settingsDirty && value !== "settings" && !window.confirm("You have unsaved changes in Site settings. Leave this section and discard them?")) return;
		if (value !== "settings") setSettingsDirty(false);
		setTab(value);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-cream text-forest-900",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-forest-900/10 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.2em] text-coral-600",
						children: "Owner dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-xl font-extrabold leading-tight text-forest-900 sm:text-2xl",
						children: "British Education & Immigration"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 rounded-2xl border border-forest-900/10 bg-cream p-3 sm:flex sm:flex-col sm:items-end sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 text-left text-xs text-forest-900/70 sm:text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-forest-900",
								children: snapshot.user.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "break-all",
								children: snapshot.user.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-coral-600",
								children: roleLabels[snapshot.user.role]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 sm:flex sm:justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowChangePass(true),
							className: "min-h-11 rounded-xl border border-forest-900/15 bg-white px-3 text-xs font-bold text-forest-900 transition hover:bg-forest-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 sm:px-4 sm:text-sm",
							children: "Change password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/admin/oauth/logout",
							className: "inline-flex min-h-11 items-center justify-center rounded-xl bg-coral-500 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500",
							children: "Log out"
						})]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-7xl px-5 py-8 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "admin-section-select",
							className: "mb-2 block text-xs font-bold uppercase tracking-wide text-forest-900/60 sm:hidden",
							children: "Admin section"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "admin-section-select",
							value: tab,
							onChange: (event) => selectTab(event.currentTarget.value),
							className: "min-h-12 w-full rounded-xl border border-forest-900/15 bg-white px-4 text-sm font-bold text-forest-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 sm:hidden",
							children: tabs.map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value,
								children: label
							}, value))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden gap-2 overflow-x-auto overscroll-x-contain pb-2 sm:flex lg:flex-wrap lg:overflow-visible",
							"aria-label": "Admin sections",
							children: tabs.map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => selectTab(value),
								className: `min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${tab === value ? "bg-forest-900 text-white" : "bg-white ring-1 ring-forest-900/10"}`,
								children: label
							}, value))
						})
					]
				}),
				notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-5 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900",
					children: notice
				}),
				tab === "enquiries" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiriesPanel, {
					enquiries: filtered,
					stats: snapshot.enquiryStats,
					query,
					setQuery,
					statusFilter,
					setStatusFilter,
					dateFrom,
					setDateFrom,
					dateTo,
					setDateTo,
					onReload: reload,
					onNotice: showNotice,
					canDelete: snapshot.user.role === "super_admin",
					canManageComments: snapshot.user.role === "super_admin"
				}),
				tab === "demo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoRequestsPanel, {
					enquiries: snapshot.enquiries.filter((item) => item.source === "coaching"),
					totalCount: snapshot.enquiryStats.demoRequests,
					onReload: reload,
					onNotice: showNotice,
					canDelete: snapshot.user.role === "super_admin",
					canManageComments: snapshot.user.role === "super_admin"
				}),
				tab === "review" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewQueuePanel, {
					enquiries: newLeadQueue,
					drafts: draftQueue,
					onOpenEnquiries: () => {
						setQuery("");
						setStatusFilter("New");
						setTab("enquiries");
					},
					onOpenDraft: (post) => {
						setSelectedPost(post);
						setTab("news");
					}
				}),
				tab === "reports" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsPanel, { stats: snapshot.enquiryStats }),
				tab === "news" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentPanel, {
					type: "news",
					items: snapshot.posts,
					selected: selectedPost,
					onSelect: (item) => setSelectedPost(item),
					onReload: reload,
					onNotice: showNotice
				}),
				tab === "stories" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentPanel, {
					type: "stories",
					items: snapshot.stories,
					selected: selectedStory,
					onSelect: (item) => setSelectedStory(item),
					onReload: reload,
					onNotice: showNotice
				}),
				tab === "certificates" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificatePanel, {
					items: snapshot.certificates,
					onReload: reload,
					onNotice: showNotice
				}),
				tab === "batches" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchPanel, {
					items: snapshot.batches,
					selected: selectedBatch,
					onSelect: setSelectedBatch,
					onReload: reload,
					onNotice: showNotice
				}),
				tab === "budget" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashflowAdminPanel, { onNotice: showNotice }),
				tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {
					settings: snapshot.settings,
					onReload: reload,
					onNotice: showNotice,
					onDirtyChange: setSettingsDirty
				}),
				tab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersPanel, {
					users: snapshot.users,
					currentEmail: snapshot.user.email,
					onReload: reload,
					onNotice: showNotice
				}),
				showChangePass && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangePasswordModal, {
					onClose: () => setShowChangePass(false),
					onNotice: showNotice
				})
			]
		})]
	});
}
function PasswordInput({ value, onChange, className, placeholder, required, minLength, autoComplete, ariaLabel, toggleClassName }) {
	const [visible, setVisible] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: visible ? "text" : "password",
			required,
			minLength,
			value,
			onChange: (event) => onChange(event.target.value),
			className: className + " !pr-12",
			placeholder,
			autoComplete,
			"aria-label": ariaLabel
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setVisible((current) => !current),
			"aria-label": visible ? "Hide password" : "Show password",
			"aria-pressed": visible,
			className: "absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400 " + toggleClassName,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				"aria-hidden": "true",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.8",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				className: "h-5 w-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "3"
					}),
					visible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m3 3 18 18" })
				]
			})
		})]
	});
}
function AdminAuthCard({ onLoginSuccess }) {
	const [mode, setMode] = (0, import_react.useState)("login");
	const [identifier, setIdentifier] = (0, import_react.useState)("admin@britisheducationandimmigration.com");
	const [password, setPassword] = (0, import_react.useState)("");
	const [otpEmail, setOtpEmail] = (0, import_react.useState)("");
	const [otpStep, setOtpStep] = (0, import_react.useState)("enter_email");
	const [otpCode, setOtpCode] = (0, import_react.useState)("");
	const [newOtpPassword, setNewOtpPassword] = (0, import_react.useState)("");
	const [recoveryEmail, setRecoveryEmail] = (0, import_react.useState)("admin@britisheducationandimmigration.com");
	const [recoveryKey, setRecoveryKey] = (0, import_react.useState)("");
	const [newPinPassword, setNewPinPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)(null);
	async function handleLogin(event) {
		event.preventDefault();
		setBusy(true);
		setMessage(null);
		try {
			const response = await fetch("/admin/oauth/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					identifier,
					password
				})
			});
			const data = await response.json();
			if (!response.ok || !data.ok) throw new Error(data.error || "Invalid username or password");
			await onLoginSuccess();
		} catch (error) {
			setMessage({
				text: error instanceof Error ? error.message : "Login failed",
				type: "error"
			});
		} finally {
			setBusy(false);
		}
	}
	async function requestOtp() {
		setBusy(true);
		setMessage(null);
		try {
			const response = await fetch("/admin/oauth/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "send-otp",
					email: otpEmail
				})
			});
			const data = await response.json();
			if (!response.ok || !data.ok) throw new Error(data.error || "Failed to send OTP");
			setOtpStep("enter_otp");
			setOtpCode("");
			setMessage({
				text: data.message || "OTP sent. Check your inbox or spam folder.",
				type: "success"
			});
		} catch (error) {
			setMessage({
				text: error instanceof Error ? error.message : "Failed to send OTP",
				type: "error"
			});
		} finally {
			setBusy(false);
		}
	}
	async function handleSendOtp(event) {
		event.preventDefault();
		await requestOtp();
	}
	async function handleVerifyOtp(event) {
		event.preventDefault();
		setBusy(true);
		setMessage(null);
		try {
			const response = await fetch("/admin/oauth/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "verify-otp",
					email: otpEmail,
					otp: otpCode,
					newPassword: newOtpPassword
				})
			});
			const data = await response.json();
			if (!response.ok || !data.ok) throw new Error(data.error || "Failed to verify OTP");
			setMessage({
				text: data.message || "Password reset successfully. Sign in with your new password.",
				type: "success"
			});
			setMode("login");
			setPassword("");
			setOtpStep("enter_email");
			setOtpCode("");
			setNewOtpPassword("");
		} catch (error) {
			setMessage({
				text: error instanceof Error ? error.message : "Failed to verify OTP",
				type: "error"
			});
		} finally {
			setBusy(false);
		}
	}
	async function handlePinReset(event) {
		event.preventDefault();
		setBusy(true);
		setMessage(null);
		try {
			const response = await fetch("/admin/oauth/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "forgot",
					email: recoveryEmail,
					recoveryKey,
					newPassword: newPinPassword
				})
			});
			const data = await response.json();
			if (!response.ok || !data.ok) throw new Error(data.error || "Password reset failed");
			setMessage({
				text: data.message || "Password reset successfully with the Master PIN. Sign in now.",
				type: "success"
			});
			setMode("login");
			setPassword("");
			setRecoveryKey("");
			setNewPinPassword("");
		} catch (error) {
			setMessage({
				text: error instanceof Error ? error.message : "Master PIN reset failed",
				type: "error"
			});
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-md rounded-[2.5rem] bg-forest-900 p-8 text-white shadow-2xl ring-1 ring-white/10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between border-b border-white/10 pb-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.2em] text-coral-400",
					children: "Owner dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-extrabold",
					children: "British Education & Immigration"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex rounded-full bg-forest-950 p-1 text-xs font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setMode("login");
						setMessage(null);
					},
					className: "flex-1 rounded-full py-2.5 transition " + (mode === "login" ? "bg-coral-500 text-white shadow" : "text-forest-100/60 hover:text-white"),
					children: "Sign in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setMode("forgot");
						setOtpStep("enter_email");
						setMessage(null);
					},
					className: "flex-1 rounded-full py-2.5 transition " + (mode !== "login" ? "bg-coral-500 text-white shadow" : "text-forest-100/60 hover:text-white"),
					children: "Forgot password?"
				})]
			}),
			message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 rounded-2xl p-4 text-xs font-bold leading-relaxed " + (message.type === "success" ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40" : "bg-red-500/20 text-red-300 ring-1 ring-red-500/40"),
				children: message.text
			}),
			mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleLogin,
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-xs font-bold text-forest-100/70",
						children: "Username or Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: identifier,
						onChange: (event) => setIdentifier(event.target.value),
						autoComplete: "username",
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:bg-white/20 focus:outline-none focus:ring-coral-400",
						placeholder: "admin@britisheducationandimmigration.com"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-forest-100/70",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setMode("forgot");
								setOtpStep("enter_email");
								setMessage(null);
							},
							className: "text-[11px] font-bold text-coral-400 hover:underline",
							children: "Forgot?"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
						value: password,
						onChange: setPassword,
						required: true,
						autoComplete: "current-password",
						ariaLabel: "Admin password",
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:bg-white/20 focus:outline-none focus:ring-coral-400",
						placeholder: "Enter admin password",
						toggleClassName: "text-white/60 hover:text-white"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "mt-2 w-full rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50",
						children: busy ? "Verifying…" : "Sign in to Dashboard →"
					})
				]
			}) : mode === "forgot" ? otpStep === "enter_email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSendOtp,
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-forest-100/70",
						children: "Enter your registered admin email to receive a 6-digit OTP. It expires after 10 minutes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-xs font-bold text-forest-100/70",
						children: "Registered Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						required: true,
						value: otpEmail,
						onChange: (event) => setOtpEmail(event.target.value),
						autoComplete: "email",
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400",
						placeholder: "Enter your admin email"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy || !otpEmail.trim(),
						className: "mt-2 w-full rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50",
						children: busy ? "Sending OTP…" : "Send 6-Digit OTP to Email →"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-white/10 pt-3 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setRecoveryEmail(otpEmail.trim() || "admin@britisheducationandimmigration.com");
								setMode("pin");
								setMessage(null);
							},
							className: "text-xs font-bold text-coral-400 hover:text-coral-300 hover:underline",
							children: "Email access nahi hai? Master PIN se reset karein →"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setMode("login");
							setMessage(null);
						},
						className: "w-full text-center text-xs font-bold text-forest-100/60 hover:text-white",
						children: "← Back to sign in"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleVerifyOtp,
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 text-xs text-forest-100/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 break-all",
							children: ["Sent to: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: otpEmail })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setOtpStep("enter_email");
								setMessage(null);
							},
							className: "shrink-0 text-coral-400 hover:underline",
							children: "Change"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-xs font-bold text-forest-100/70",
						children: "Enter 6-Digit OTP"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						maxLength: 6,
						pattern: "[0-9]{6}",
						inputMode: "numeric",
						autoComplete: "one-time-code",
						value: otpCode,
						onChange: (event) => setOtpCode(event.target.value.replace(/\D/g, "")),
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-white ring-1 ring-white/10 focus:outline-none focus:ring-coral-400",
						placeholder: "123456",
						"aria-label": "6-digit password reset code"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-xs font-bold text-forest-100/70",
						children: "New Password (minimum 6 characters)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
						value: newOtpPassword,
						onChange: setNewOtpPassword,
						required: true,
						minLength: 6,
						autoComplete: "new-password",
						ariaLabel: "New admin password",
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400",
						placeholder: "Enter new password",
						toggleClassName: "text-white/60 hover:text-white"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy || otpCode.length !== 6 || newOtpPassword.length < 6,
						className: "mt-2 w-full rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50",
						children: busy ? "Verifying OTP…" : "Verify OTP & Reset Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void requestOtp(),
							disabled: busy,
							className: "font-bold text-coral-400 hover:underline disabled:opacity-50",
							children: busy ? "Sending…" : "Resend OTP"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setMode("login");
								setMessage(null);
							},
							className: "font-bold text-forest-100/60 hover:text-white",
							children: "Cancel"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handlePinReset,
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-forest-100/70",
						children: "Master Security PIN reset. Use this fallback if you cannot access the registered admin email."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-xs font-bold text-forest-100/70",
						children: "Admin Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						required: true,
						value: recoveryEmail,
						onChange: (event) => setRecoveryEmail(event.target.value),
						autoComplete: "email",
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400",
						placeholder: "Enter admin email"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-xs font-bold text-forest-100/70",
						children: "Master Recovery Key (Security PIN)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: recoveryKey,
						onChange: (event) => setRecoveryKey(event.target.value),
						autoComplete: "off",
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400",
						placeholder: "Enter recovery key"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-xs font-bold text-forest-100/70",
						children: "New Password (minimum 6 characters)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
						value: newPinPassword,
						onChange: setNewPinPassword,
						required: true,
						minLength: 6,
						autoComplete: "new-password",
						ariaLabel: "New password for Master PIN reset",
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400",
						placeholder: "Enter new password",
						toggleClassName: "text-white/60 hover:text-white"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "mt-2 w-full rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50",
						children: busy ? "Updating…" : "Reset & Save Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between pt-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setMode("forgot");
								setOtpStep("enter_email");
								setMessage(null);
							},
							className: "font-bold text-coral-400 hover:underline",
							children: "← Use email OTP"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setMode("login");
								setMessage(null);
							},
							className: "font-bold text-forest-100/60 hover:text-white",
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 border-t border-white/10 pt-4 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "text-xs font-semibold text-forest-100/60 hover:text-white",
					children: "← Return to public website"
				})
			})
		]
	});
}
function ChangePasswordModal({ onClose, onNotice }) {
	const [oldPassword, setOldPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function handleSubmit(e) {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			setError("New passwords do not match");
			return;
		}
		setBusy(true);
		setError("");
		try {
			const res = await fetch("/admin/oauth/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "change",
					oldPassword,
					newPassword
				})
			});
			const data = await res.json();
			if (!res.ok || !data.ok) throw new Error(data.error || "Failed to update password");
			onNotice("Password updated successfully!");
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update password");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-forest-900/10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-3 border-b border-forest-900/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-extrabold text-forest-900",
						children: "Change Admin Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "text-sm font-bold text-forest-900/40 hover:text-forest-900",
						children: "✕"
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 rounded-xl bg-red-100 p-3 text-xs font-bold text-red-800",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "mt-4 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-forest-900/70 mb-1",
							children: "Current Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
							value: oldPassword,
							onChange: setOldPassword,
							required: true,
							autoComplete: "current-password",
							ariaLabel: "Current admin password",
							className: "field",
							placeholder: "Enter current password",
							toggleClassName: "text-forest-900/50 hover:text-forest-900"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-forest-900/70 mb-1",
							children: "New Password (min 6 characters)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
							value: newPassword,
							onChange: setNewPassword,
							required: true,
							minLength: 6,
							autoComplete: "new-password",
							ariaLabel: "New admin password",
							className: "field",
							placeholder: "Enter new password",
							toggleClassName: "text-forest-900/50 hover:text-forest-900"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-forest-900/70 mb-1",
							children: "Confirm New Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
							value: confirmPassword,
							onChange: setConfirmPassword,
							required: true,
							minLength: 6,
							autoComplete: "new-password",
							ariaLabel: "Confirm new admin password",
							className: "field",
							placeholder: "Re-type new password",
							toggleClassName: "text-forest-900/50 hover:text-forest-900"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onClose,
								className: "rounded-full border border-forest-900/15 px-5 py-2.5 text-xs font-bold text-forest-900",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "rounded-full bg-forest-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-forest-800 disabled:opacity-50",
								children: busy ? "Updating…" : "Update Password"
							})]
						})
					]
				})
			]
		})
	});
}
function EnquiriesPanel({ enquiries, stats, query, setQuery, statusFilter, setStatusFilter, dateFrom, setDateFrom, dateTo, setDateTo, onReload, onNotice, canDelete, canManageComments }) {
	const [viewMode, setViewMode] = (0, import_react.useState)("list");
	const [selectedBoardLeadId, setSelectedBoardLeadId] = (0, import_react.useState)(null);
	async function downloadExcel() {
		try {
			const result = await exportEnquiries({ data: {
				query,
				status: statusFilter === "All" ? "" : statusFilter,
				from: dateFrom,
				to: dateTo
			} });
			const bytes = Uint8Array.from(atob(result.base64), (char) => char.charCodeAt(0));
			const url = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
			const link = document.createElement("a");
			link.href = url;
			link.download = result.filename;
			link.click();
			URL.revokeObjectURL(url);
			onNotice(`${enquiries.length} leads exported to Excel.`);
		} catch {
			onNotice("Could not export leads to Excel.");
		}
	}
	const cards = [
		[
			"All leads",
			stats.total,
			"bg-white"
		],
		[
			"New today",
			stats.newCount,
			"bg-coral-500 text-white"
		],
		[
			"Active pipeline",
			stats.followUps,
			"bg-forest-900 text-white"
		],
		[
			"Due today",
			stats.dueToday,
			"bg-amber-100 text-amber-900"
		],
		[
			"Converted",
			stats.converted,
			"bg-emerald-100 text-emerald-900"
		]
	];
	const boardStatuses = [
		"New",
		"Contacted",
		"Follow-up",
		"Documents Pending",
		"Applied",
		"Converted",
		"Closed"
	];
	const selectedBoardLead = enquiries.find((item) => item.id === selectedBoardLeadId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.18em] text-coral-600",
					children: "Lead command centre"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl font-extrabold",
					children: "Turn enquiries into admissions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-forest-900/60",
					children: "Search, move, assign and schedule every lead from one place."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void downloadExcel(),
				className: "w-fit rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white",
				children: "Download Excel"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
			children: cards.map(([label, value, classes]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `rounded-2xl p-4 ring-1 ring-forest-900/10 ${classes}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-wider opacity-65",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-3xl font-extrabold",
					children: value
				})]
			}, label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-bold text-forest-900/65",
				children: "Choose how to review your filtered leads."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "group",
				"aria-label": "Lead display mode",
				className: "inline-flex rounded-full bg-white p-1 ring-1 ring-forest-900/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": viewMode === "list",
					onClick: () => setViewMode("list"),
					className: "rounded-full px-4 py-2 text-xs font-bold " + (viewMode === "list" ? "bg-forest-900 text-white" : "text-forest-900/65"),
					children: "List"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": viewMode === "board",
					onClick: () => setViewMode("board"),
					className: "rounded-full px-4 py-2 text-xs font-bold " + (viewMode === "board" ? "bg-forest-900 text-white" : "text-forest-900/65"),
					children: "Pipeline board"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-forest-900/10 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					className: "field",
					placeholder: "Search name, phone, city, country…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: statusFilter,
					onChange: (event) => setStatusFilter(event.target.value),
					className: "field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "All",
						children: "All stages"
					}), [
						"New",
						"Contacted",
						"Follow-up",
						"Documents Pending",
						"Applied",
						"Converted",
						"Closed"
					].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: status }, status))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: dateFrom,
					onChange: (event) => setDateFrom(event.target.value),
					className: "field",
					"aria-label": "From date"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: dateTo,
					onChange: (event) => setDateTo(event.target.value),
					className: "field",
					"aria-label": "To date"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap gap-2 text-xs font-bold text-forest-900/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "rounded-full bg-white px-3 py-1.5 ring-1 ring-forest-900/10",
				children: [
					"Showing ",
					enquiries.length,
					" loaded leads"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-white px-3 py-1.5 ring-1 ring-forest-900/10",
				children: "Excel includes Summary + Follow-ups sheets"
			})]
		}),
		viewMode === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4",
			children: [enquiries.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryCard, {
				item,
				onReload,
				onNotice,
				canDelete,
				canManageComments
			}, item.id)), enquiries.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-white p-8 text-center text-forest-900/60",
				children: "No enquiries match these filters."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto pb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid min-w-[1260px] grid-cols-7 gap-3",
					children: boardStatuses.map((stage) => {
						const stageItems = enquiries.filter((item) => item.status === stage);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "min-h-64 rounded-2xl bg-forest-50 p-3 ring-1 ring-forest-900/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
								className: "mb-3 flex items-center justify-between gap-2 border-b border-forest-900/10 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-extrabold text-forest-900",
									children: stage
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-white px-2 py-1 font-mono text-[10px] font-bold text-forest-700",
									children: stageItems.length
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [stageItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelectedBoardLeadId(item.id),
									"aria-label": "Open " + item.name + " lead details",
									className: "rounded-xl bg-white p-3 text-left shadow-sm ring-1 ring-forest-900/10 transition hover:-translate-y-0.5 hover:ring-coral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral-500",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm font-extrabold text-forest-900",
											children: item.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-1 block truncate text-xs text-forest-900/60",
											children: [item.interest || "General counselling", item.country ? " · " + item.country : ""]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-2 block truncate font-mono text-[10px] text-forest-900/55",
											children: item.phone
										}),
										item.nextFollowUpAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-2 block rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-900",
											children: ["Follow-up ", new Date(item.nextFollowUpAt).toLocaleString()]
										}),
										item.assignedTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-2 block truncate text-[10px] text-forest-900/50",
											children: ["Assigned: ", item.assignedTo]
										})
									]
								}, item.id)), stageItems.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-xl border border-dashed border-forest-900/15 px-2 py-4 text-center text-[10px] text-forest-900/45",
									children: "No leads here"
								})]
							})]
						}, stage);
					})
				})
			}), selectedBoardLead ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-forest-50 p-3 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] font-bold uppercase tracking-widest text-coral-600",
						children: "Selected lead"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 text-lg font-extrabold text-forest-900",
						children: selectedBoardLead.name
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelectedBoardLeadId(null),
						className: "rounded-full bg-white px-4 py-2 text-xs font-bold text-forest-900 ring-1 ring-forest-900/10",
						children: "Close details"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryCard, {
					item: selectedBoardLead,
					onReload,
					onNotice,
					canDelete,
					canManageComments
				}, selectedBoardLead.id)]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-white p-6 text-center text-sm text-forest-900/55",
				children: "Choose a lead card to update its stage, owner or follow-up."
			})]
		})
	] });
}
function DemoRequestsPanel({ enquiries, totalCount, onReload, onNotice, canDelete, canManageComments }) {
	const [dueOnly, setDueOnly] = (0, import_react.useState)(false);
	const dueRequests = enquiries.filter((item) => item.nextFollowUpAt && new Date(item.nextFollowUpAt).getTime() <= Date.now() && !["Converted", "Closed"].includes(item.status));
	const visible = dueOnly ? dueRequests : enquiries;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.18em] text-coral-600",
					children: "IELTS & PTE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl font-extrabold",
					children: "Free demo requests"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-forest-900/60",
					children: "Preferred dates are requests. Confirm the available slot with the student and schedule the next follow-up on the lead."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": dueOnly,
				onClick: () => setDueOnly((value) => !value),
				className: "w-fit rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900",
				children: dueOnly ? "Show all requests" : `Follow-ups due (${dueRequests.length})`
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-white p-4 ring-1 ring-forest-900/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-wider text-forest-900/55",
					children: "Total demo requests"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-3xl font-extrabold",
					children: totalCount
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-amber-100 p-4 text-amber-900",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-wider opacity-70",
					children: "Follow-ups due"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-3xl font-extrabold",
					children: dueRequests.length
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4",
			children: [visible.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryCard, {
				item,
				onReload,
				onNotice,
				canDelete,
				canManageComments
			}, item.id)), visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-white p-8 text-center text-forest-900/60",
				children: dueOnly ? "No demo follow-ups are due right now." : "No demo requests have been received yet."
			})]
		}),
		totalCount > enquiries.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 text-xs text-forest-900/55",
			children: [
				"Showing the latest ",
				enquiries.length,
				" requests in the lead list."
			]
		})
	] });
}
function ReviewQueuePanel({ enquiries, drafts, onOpenEnquiries, onOpenDraft }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-[0.18em] text-coral-600",
				children: "Needs attention"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-3xl font-extrabold",
				children: "Review queue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-forest-900/60",
				children: "A read-only overview of new enquiries and unpublished content, with links to the existing editing screens."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-3xl bg-white p-5 ring-1 ring-forest-900/10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-extrabold",
						children: "New enquiries"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-coral-50 px-3 py-1 text-xs font-bold text-coral-700",
						children: enquiries.length
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [enquiries.slice(0, 10).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-cream p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: item.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-forest-900/60",
								children: [item.interest || "General counselling", item.country ? " · " + item.country : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-forest-900/50",
								children: new Date(item.createdAt).toLocaleString()
							})
						]
					}, item.id)), enquiries.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-forest-900/55",
						children: "No new enquiries are waiting."
					})]
				}),
				enquiries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onOpenEnquiries,
					className: "mt-4 rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white",
					children: "Review new enquiries"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-3xl bg-white p-5 ring-1 ring-forest-900/10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-extrabold",
						children: "Unpublished content"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900",
						children: drafts.length
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [drafts.slice(0, 10).map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onOpenDraft(post),
						className: "rounded-2xl bg-cream p-4 text-left transition hover:ring-1 hover:ring-coral-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold",
							children: post.title || "Untitled draft"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-xs text-forest-900/55",
							children: [
								post.category,
								" · ",
								post.date
							]
						})]
					}, post.id)), drafts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-forest-900/55",
						children: "No unpublished articles are waiting."
					})]
				}),
				drafts.length > 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-forest-900/55",
					children: "Showing the latest 10 drafts."
				})
			]
		})]
	})] });
}
function ReportsPanel({ stats }) {
	const conversion = stats.total ? Math.round(stats.converted / stats.total * 100) : 0;
	const statuses = Object.entries(stats.byStatus).sort((a, b) => b[1] - a[1]);
	const sources = Object.entries(stats.bySource).sort((a, b) => b[1] - a[1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.18em] text-coral-600",
					children: "Live lead summary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl font-extrabold",
					children: "Reports"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-forest-900/60",
					children: "Counts are calculated from saved enquiries. Conversion is converted leads divided by all saved leads."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				["New in last 7 days", stats.newLast7Days],
				["Follow-ups due today", stats.dueToday],
				["Demo requests", stats.demoRequests],
				["Conversion rate", conversion + "%"]
			].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-white p-5 ring-1 ring-forest-900/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-wider text-forest-900/55",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-3xl font-extrabold",
					children: value
				})]
			}, String(label)))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-white p-5 ring-1 ring-forest-900/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-extrabold",
					children: "By stage"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 divide-y divide-forest-900/10",
					children: [statuses.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-3 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: value })]
					}, label)), statuses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-3 text-sm text-forest-900/55",
						children: "No enquiry data yet."
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-white p-5 ring-1 ring-forest-900/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-extrabold",
					children: "By source"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 divide-y divide-forest-900/10",
					children: [sources.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-3 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: value })]
					}, label)), sources.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-3 text-sm text-forest-900/55",
						children: "No enquiry data yet."
					})]
				})]
			})]
		})
	] });
}
function EnquiryCard({ item, onReload, onNotice, canDelete, canManageComments }) {
	const [status, setStatus] = (0, import_react.useState)(item.status);
	const [assignedTo, setAssignedTo] = (0, import_react.useState)(item.assignedTo);
	const [nextFollowUpAt, setNextFollowUpAt] = (0, import_react.useState)(item.nextFollowUpAt ? item.nextFollowUpAt.slice(0, 16) : "");
	const [newComment, setNewComment] = (0, import_react.useState)("");
	const [editingActivityId, setEditingActivityId] = (0, import_react.useState)(null);
	const [editingBody, setEditingBody] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		setBusy(true);
		try {
			await updateEnquiry({ data: {
				id: item.id,
				status,
				assignedTo,
				nextFollowUpAt
			} });
			await onReload();
			onNotice("Lead updated.");
		} catch {
			onNotice("Could not update lead.");
		} finally {
			setBusy(false);
		}
	}
	async function addComment(event) {
		event.preventDefault();
		const body = newComment.trim();
		if (!body) return;
		setBusy(true);
		try {
			await addEnquiryActivity({ data: {
				enquiryId: item.id,
				body
			} });
			setNewComment("");
			await onReload();
			onNotice("Timeline comment added.");
		} catch {
			onNotice("Could not add timeline comment.");
		} finally {
			setBusy(false);
		}
	}
	async function saveComment(activityId) {
		const body = editingBody.trim();
		if (!body) return;
		setBusy(true);
		try {
			await updateEnquiryActivity({ data: {
				id: activityId,
				body
			} });
			setEditingActivityId(null);
			setEditingBody("");
			await onReload();
			onNotice("Timeline comment updated.");
		} catch {
			onNotice("Could not update timeline comment.");
		} finally {
			setBusy(false);
		}
	}
	async function removeComment(activityId) {
		if (!window.confirm("Delete this timeline comment?")) return;
		setBusy(true);
		try {
			await deleteEnquiryActivity({ data: { id: activityId } });
			await onReload();
			onNotice("Timeline comment deleted.");
		} catch {
			onNotice("Could not delete timeline comment.");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!window.confirm("Delete this enquiry permanently?")) return;
		setBusy(true);
		try {
			await deleteEnquiry({ data: { id: item.id } });
			await onReload();
			onNotice("Enquiry deleted.");
		} catch {
			onNotice("Could not delete enquiry.");
		} finally {
			setBusy(false);
		}
	}
	const formatActivityTime = (value) => new Date(value).toLocaleString("en-IN", {
		timeZone: "Asia/Kolkata",
		dateStyle: "medium",
		timeStyle: "short"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-between gap-5 lg:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-extrabold",
								children: item.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-coral-50 px-3 py-1 text-xs font-bold text-coral-700",
								children: item.status
							}),
							item.nextFollowUpAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900",
								children: ["Follow-up ", new Date(item.nextFollowUpAt).toLocaleString()]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-forest-900/60",
						children: [
							new Date(item.createdAt).toLocaleString(),
							" · ",
							item.source || "website",
							item.assignedTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · Assigned to ", item.assignedTo] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.phone }),
							item.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", item.email] }),
							item.city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", item.city] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm font-semibold",
						children: [item.interest || "General counselling", item.country && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", item.country] })]
					}),
					item.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-3xl text-sm leading-relaxed text-forest-900/75",
						children: item.message
					}),
					item.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-forest-900/50",
						children: ["Context: ", item.summary]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid content-start gap-2 lg:w-80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: status,
						onChange: (event) => setStatus(event.target.value),
						className: "field bg-cream",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "New" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Contacted" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Follow-up" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Documents Pending" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Applied" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Converted" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Closed" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: assignedTo,
							onChange: (event) => setAssignedTo(event.target.value),
							className: "field bg-cream",
							placeholder: "Assigned counsellor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: nextFollowUpAt,
							onChange: (event) => setNextFollowUpAt(event.target.value),
							className: "field bg-cream",
							"aria-label": "Next follow-up"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: () => void save(),
								className: "rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50",
								children: "Save lead"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `https://wa.me/91${item.phone.replace(/\D/g, "")}`,
								target: "_blank",
								rel: "noreferrer",
								className: "rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white",
								children: "WhatsApp"
							}),
							canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: () => void remove(),
								className: "rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700",
								children: "Delete"
							})
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 border-t border-forest-900/10 pt-5",
			"aria-labelledby": `lead-timeline-${item.id}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-coral-600",
						children: "Lead history"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						id: `lead-timeline-${item.id}`,
						className: "mt-1 text-lg font-extrabold",
						children: "Follow-up timeline"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-forest-900/50",
						children: [
							item.activities.length,
							" ",
							item.activities.length === 1 ? "entry" : "entries"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-4 grid gap-3",
					children: [
						item.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-amber-900",
								children: "Previous note · original timestamp unavailable"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 whitespace-pre-wrap text-sm leading-relaxed text-forest-900/80",
								children: item.notes
							})]
						}),
						item.activities.map((activity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-xl bg-forest-50 p-4 ring-1 ring-forest-900/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-bold text-forest-900",
										children: [
											activity.authorName || activity.authorEmail || "Team member",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-normal text-forest-900/55",
												children: [" · ", formatActivityTime(activity.createdAt)]
											}),
											activity.editedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-normal text-forest-900/55",
												children: [
													" · Edited by ",
													activity.editedBy,
													" on ",
													formatActivityTime(activity.updatedAt)
												]
											})
										]
									}), editingActivityId === activity.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: editingBody,
											onChange: (event) => setEditingBody(event.target.value),
											rows: 3,
											maxLength: 5e3,
											className: "field bg-white",
											"aria-label": "Edit timeline comment"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: busy || !editingBody.trim(),
												onClick: () => void saveComment(activity.id),
												className: "rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50",
												children: "Save edit"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: busy,
												onClick: () => {
													setEditingActivityId(null);
													setEditingBody("");
												},
												className: "rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold text-forest-900",
												children: "Cancel"
											})]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 whitespace-pre-wrap text-sm leading-relaxed text-forest-900/80",
										children: activity.body
									})]
								}), canManageComments && editingActivityId !== activity.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: busy,
										onClick: () => {
											setEditingActivityId(activity.id);
											setEditingBody(activity.body);
										},
										className: "rounded-full border border-forest-900/15 px-3 py-1.5 text-xs font-bold text-forest-900 disabled:opacity-50",
										children: "Edit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: busy,
										onClick: () => void removeComment(activity.id),
										className: "rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 disabled:opacity-50",
										children: "Delete"
									})]
								})]
							})
						}, activity.id)),
						!item.notes && item.activities.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-xl border border-dashed border-forest-900/15 px-4 py-5 text-center text-sm text-forest-900/55",
							children: "No timeline entries yet. Add a note after each call or follow-up to build the lead history."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: addComment,
					className: "mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: newComment,
						onChange: (event) => setNewComment(event.target.value),
						rows: 2,
						maxLength: 5e3,
						className: "field bg-cream",
						placeholder: "Log a call, message, document update or next follow-up…",
						"aria-label": "Add lead timeline comment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy || !newComment.trim(),
						className: "min-h-11 rounded-full bg-coral-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-50",
						children: busy ? "Saving…" : "Add comment"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[11px] text-forest-900/50",
					children: "Comments are timestamped and attributed to your admin account. Only a Super Admin can edit or delete them."
				})
			]
		})]
	});
}
function BatchPanel({ items, selected, onSelect, onReload, onNotice }) {
	const [hasUnsavedChanges, setHasUnsavedChanges] = (0, import_react.useState)(false);
	function selectBatch(item) {
		if (item && selected && item.id !== selected.id && hasUnsavedChanges && !window.confirm("You have unsaved changes in this batch. Switch anyway and discard them?")) return;
		setHasUnsavedChanges(false);
		onSelect(item);
	}
	function closeBatch(saved = false) {
		if (!saved && hasUnsavedChanges && !window.confirm("You have unsaved changes in this batch. Close and discard them?")) return;
		setHasUnsavedChanges(false);
		onSelect(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.18em] text-coral-600",
					children: "IELTS · PTE · Languages"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl font-extrabold",
					children: "Manage upcoming batches"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-forest-900/60",
					children: "Add or update any coaching program without touching code."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => selectBatch({
					id: 0,
					program: "IELTS",
					batch: "",
					time: "",
					seats: 0,
					starts: "",
					published: true
				}),
				className: "rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white",
				children: "+ New batch"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: items.map((item) => {
				const dateStatus = getBatchDateStatus(item.starts);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => selectBatch(item),
					className: `rounded-2xl bg-white p-4 text-left ring-1 ring-forest-900/10 transition hover:ring-forest-900 ${selected?.id === item.id ? "ring-2 ring-coral-500" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.batch }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-forest-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-forest-700",
							children: item.program
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-forest-900/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							item.time,
							" · ",
							formatBatchStartDate(item.starts),
							" · ",
							item.seats,
							" seats · ",
							item.published ? "Published" : "Hidden"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${dateStatus === "expired" ? "bg-red-100 text-red-700" : dateStatus === "needs-date" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`,
							children: dateStatus === "expired" ? "Expired" : dateStatus === "needs-date" ? "Set full date" : "Upcoming"
						})]
					})]
				}, item.id);
			})
		})] }), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchEditor, {
			item: selected,
			onReload,
			onNotice,
			onClose: closeBatch,
			onDirtyChange: setHasUnsavedChanges
		}, `batch-${selected.id}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid min-h-72 place-items-center rounded-3xl border border-dashed border-forest-900/20 p-8 text-center text-forest-900/50",
			children: "Select a batch or create a new one."
		})]
	});
}
function BatchEditor({ item, onReload, onNotice, onClose, onDirtyChange }) {
	const [form, setForm] = (0, import_react.useState)(item);
	const [busy, setBusy] = (0, import_react.useState)(false);
	function update(key, value) {
		setForm((current) => ({
			...current,
			[key]: value
		}));
		onDirtyChange(true);
	}
	async function submit(event) {
		event.preventDefault();
		setBusy(true);
		try {
			await saveBatch({ data: form });
			onDirtyChange(false);
			await onReload();
			onNotice("Coaching batch saved.");
			onClose(true);
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not save batch.");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!form.id || !window.confirm("Delete this coaching batch?")) return;
		setBusy(true);
		try {
			await deleteBatch({ data: { id: form.id } });
			onDirtyChange(false);
			await onReload();
			onNotice("Coaching batch deleted.");
			onClose(true);
		} catch {
			onNotice("Could not delete batch.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "rounded-3xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600",
					children: "Public schedule"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl font-extrabold",
					children: "Batch editor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs leading-relaxed text-forest-900/55",
					children: "These details appear in the Upcoming batches section on the public IELTS & PTE page."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "text-sm font-bold text-forest-900/50",
				children: "Close"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
					label: "Program / language",
					hint: "Example: IELTS, PTE, German A1, French B2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: form.program,
						onChange: (e) => update("program", e.target.value),
						placeholder: "IELTS / PTE / German…",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
					label: "Batch name",
					hint: "Example: German A1 Evening Batch or IELTS Weekend Batch",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: form.batch,
						onChange: (e) => update("batch", e.target.value),
						placeholder: "Name visitors will recognise",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
					label: "Class timing",
					hint: "Example: Mon–Fri · 6:00–8:00 PM",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: form.time,
						onChange: (e) => update("time", e.target.value),
						placeholder: "Days and time"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
							label: "Seats left",
							hint: "Use 0 when full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								type: "number",
								min: "0",
								value: form.seats,
								onChange: (e) => update("seats", Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
							label: "Starts on",
							hint: "Choose the full start date. Expired batches are hidden from the public upcoming list.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								type: "date",
								required: true,
								value: isValidBatchStartDate(form.starts) ? form.starts : "",
								onChange: (e) => update("starts", e.target.value)
							})
						}),
						form.starts && !isValidBatchStartDate(form.starts) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs leading-relaxed text-amber-800",
							children: [
								"Saved start value “",
								form.starts,
								"” has no full year. Choose its complete date before saving so it can expire automatically."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: form.published,
						onChange: (e) => update("published", e.target.checked)
					}), " Show this batch on the public coaching page"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						className: "rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white",
						children: "Save batch"
					}), form.id > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => void remove(),
						className: "rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-700",
						children: "Delete"
					})]
				})
			]
		})]
	});
}
function ContentPanel({ type, items, selected, onSelect, onReload, onNotice }) {
	const news = type === "news";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-[0.18em] text-coral-600",
				children: news ? "News & updates" : "Success stories"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-3xl font-extrabold",
				children: "Edit without code"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onSelect(news ? {
					id: 0,
					...blankPost
				} : {
					id: 0,
					...blankStory
				}),
				className: "rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white",
				children: "+ New"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(item),
				className: `rounded-2xl bg-white p-4 text-left ring-1 ring-forest-900/10 transition hover:ring-forest-900 ${selected?.id === item.id ? "ring-2 ring-coral-500" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: news ? item.title : item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `rounded-full px-2 py-1 text-[10px] font-bold ${item.published ? "bg-emerald-100 text-emerald-800" : "bg-forest-100 text-forest-700"}`,
						children: item.published ? "Published" : "Draft"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-xs text-forest-900/50",
					children: news ? `${item.category} · ${item.date}` : `${item.kind} · ${item.country}`
				})]
			}, item.id))
		})] }), selected ? news ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostEditor, {
			item: selected,
			onReload,
			onNotice,
			onClose: () => onSelect(null)
		}, `post-${selected.id}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryEditor, {
			item: selected,
			onReload,
			onNotice,
			onClose: () => onSelect(null)
		}, `story-${selected.id}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid min-h-72 place-items-center rounded-3xl border border-dashed border-forest-900/20 p-8 text-center text-forest-900/50",
			children: "Select an item or create a new one."
		})]
	});
}
function EditorField({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-bold uppercase tracking-[0.1em] text-forest-900/70",
				children: label
			}),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
				className: "text-xs leading-relaxed text-forest-900/50",
				children: hint
			})
		]
	});
}
function PostEditor({ item, onReload, onNotice, onClose }) {
	const [form, setForm] = (0, import_react.useState)(item);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)(false);
	function update(key, value) {
		setForm((current) => ({
			...current,
			[key]: value
		}));
	}
	async function submit(event) {
		event.preventDefault();
		setBusy(true);
		try {
			await savePost({ data: form });
			await onReload();
			onNotice("News article saved.");
			onClose();
		} catch {
			onNotice("Could not save article. Check the fields.");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!form.id || !window.confirm("Delete this article?")) return;
		setBusy(true);
		try {
			await deletePost({ data: { id: form.id } });
			await onReload();
			onNotice("Article deleted.");
			onClose();
		} catch {
			onNotice("Could not delete article.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "rounded-3xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600",
						children: "News & updates"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-extrabold",
						children: "Article editor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-forest-900/55",
						children: "Fill the fields below. The title, summary and article paragraphs appear on the public News & Blog page."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": preview,
						onClick: () => setPreview((value) => !value),
						className: "rounded-full px-4 py-2 text-xs font-bold ring-1 ring-forest-900/15 " + (preview ? "bg-coral-500 text-white ring-coral-500" : "bg-white text-forest-900"),
						children: preview ? "Back to edit" : "Preview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "text-sm font-bold text-forest-900/50",
						children: "Close"
					})]
				})]
			}),
			preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-forest-50 p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] font-bold uppercase tracking-widest text-coral-600",
						children: "Public preview · unsaved changes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "mt-3 max-w-3xl overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-forest-900/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 text-xs text-forest-900/55",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-forest-50 px-3 py-1 font-bold text-forest-700",
									children: form.category
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									form.readMins,
									" min read · ",
									form.date || "Date not set"
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mt-4 break-words font-display text-2xl font-extrabold text-forest-900",
								children: form.title || "Article headline"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-forest-900/70",
								children: form.excerpt || "Your article summary will appear here."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 border-t border-forest-900/10 pt-4",
								children: form.body.filter((paragraph) => paragraph.trim()).length ? form.body.filter((paragraph) => paragraph.trim()).map((paragraph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-4 text-sm leading-relaxed text-forest-900/75 last:mb-0",
									children: paragraph
								}, index)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-forest-900/50",
									children: "Article paragraphs will appear here."
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-forest-900/55",
						children: "Preview changes only; they reach the website after you return to edit and save."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Headline / title",
						hint: "Example: UK Graduate Route: the latest on post-study work duration",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: form.title,
							onChange: (e) => update("title", e.target.value),
							placeholder: "Write the public article headline",
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
							label: "URL slug",
							hint: "Lowercase words with hyphens only; example: uk-graduate-route-update",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								value: form.slug,
								onChange: (e) => update("slug", e.target.value),
								placeholder: "uk-graduate-route-update",
								required: true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
							label: "Category",
							hint: "Used to group the article",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "field",
								value: form.category,
								onChange: (e) => update("category", e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Visa News" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Study Abroad" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "IELTS & PTE" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Immigration" })
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
							label: "Publish date",
							hint: "Date shown on the article card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								type: "date",
								value: form.date,
								onChange: (e) => update("date", e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
							label: "Reading time (minutes)",
							hint: "Example: 5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								type: "number",
								min: "1",
								value: form.readMins,
								onChange: (e) => update("readMins", Number(e.target.value))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Short summary / excerpt",
						hint: "One or two lines used on cards and SEO previews",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field",
							rows: 3,
							value: form.excerpt,
							onChange: (e) => update("excerpt", e.target.value),
							placeholder: "Summarise the main point for a visitor"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Article content",
						hint: "Write one paragraph per blank line. Do not add headings or HTML tags.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field",
							rows: 10,
							value: form.body.join("\n\n"),
							onChange: (e) => update("body", e.target.value.split(/\n\s*\n/)),
							placeholder: "First paragraph...\\n\\nSecond paragraph..."
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 border-t border-forest-900/10 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: form.published,
						onChange: (e) => update("published", e.target.checked)
					}), " Publish on website"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy || preview,
						className: "rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50",
						children: busy ? "Saving…" : "Save article"
					}), form.id > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => void remove(),
						className: "rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-700 disabled:opacity-50",
						children: "Delete"
					})]
				})]
			})
		]
	});
}
function CashflowAdminPanel({ onNotice }) {
	const [data, setData] = (0, import_react.useState)(defaultCashflowData);
	const [selectedSlug, setSelectedSlug] = (0, import_react.useState)("canada");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getAdminCashflow().then((saved) => setData(saved)).catch(() => onNotice("Could not load cashflow from database. Showing defaults."));
	}, [onNotice]);
	const country = data.find((c) => c.slug === selectedSlug) || data[0];
	const updateCountryField = (field, value) => {
		setData((prev) => prev.map((c) => c.slug === selectedSlug ? {
			...c,
			[field]: value
		} : c));
	};
	const updateStageField = (stageNum, field, value) => {
		setData((prev) => prev.map((c) => {
			if (c.slug !== selectedSlug) return c;
			return {
				...c,
				stages: c.stages.map((st) => st.stageNumber === stageNum ? {
					...st,
					[field]: value
				} : st)
			};
		}));
	};
	const save = async () => {
		try {
			setBusy(true);
			await saveCashflow({ data: { cashflowData: data } });
			onNotice("Budget & Cashflow saved to database and is live on the website.");
		} catch (error) {
			onNotice(error instanceof Error ? error.message : "Could not save budget data.");
		} finally {
			setBusy(false);
		}
	};
	const resetToOfficial = async () => {
		setData(defaultCashflowData);
		try {
			setBusy(true);
			await saveCashflow({ data: { cashflowData: defaultCashflowData } });
			onNotice("Reset to official 2026/2027 embassy defaults and saved to database.");
		} catch {
			onNotice("Reset locally, but database sync failed.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-coral-600 font-bold",
						children: "Financial Configuration"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl font-extrabold mt-1",
						children: "Country Budget & Cashflow Stages"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-forest-900/60 mt-1",
						children: "Edit embassy fees, GIC living costs, and stage-by-stage expenses. Updates reflect instantly on the public website."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: resetToOfficial,
						className: "rounded-xl border border-forest-900/20 px-4 py-2 text-xs font-bold text-forest-900 hover:bg-forest-50 disabled:opacity-50",
						children: "Reset Defaults"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: save,
						className: "rounded-xl bg-forest-900 px-5 py-2 text-xs font-bold text-white hover:bg-forest-800 shadow-md disabled:opacity-50",
						children: busy ? "Saving to DB…" : "Save Changes"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 mb-6",
				children: data.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelectedSlug(c.slug),
					className: "rounded-xl px-4 py-2 text-xs font-bold transition " + (selectedSlug === c.slug ? "bg-coral-500 text-white shadow-sm" : "bg-white ring-1 ring-forest-900/10 text-forest-900 hover:bg-sand/30"),
					children: [
						c.flag,
						" ",
						c.name
					]
				}, c.slug))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-white p-6 ring-1 ring-forest-900/10 shadow-sm space-y-5 mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-extrabold text-forest-900 border-b border-forest-900/10 pb-3",
						children: [
							country.flag,
							" ",
							country.name,
							" Overview Settings"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-bold text-forest-900/80 mb-1",
								children: "Total Estimated Outflow (INR)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-full rounded-xl border border-forest-900/15 p-2.5 text-xs font-semibold",
								value: country.totalEstimateINR,
								onChange: (e) => updateCountryField("totalEstimateINR", e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-bold text-forest-900/80 mb-1",
								children: "Headline Badge"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-full rounded-xl border border-forest-900/15 p-2.5 text-xs font-semibold",
								value: country.headline,
								onChange: (e) => updateCountryField("headline", e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-bold text-forest-900/80 mb-1",
							children: "Official Embassy Rule Note"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							className: "w-full rounded-xl border border-forest-900/15 p-2.5 text-xs",
							value: country.officialRuleNote,
							onChange: (e) => updateCountryField("officialRuleNote", e.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-extrabold text-forest-900",
					children: "Stage-by-Stage Expense Details (4 Stages)"
				}), country.stages.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-white p-5 ring-1 ring-forest-900/10 shadow-sm space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-2 border-b border-forest-900/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-sm text-coral-600",
								children: [
									"Stage 0",
									st.stageNumber,
									": ",
									st.title
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-forest-900/60 font-mono",
								children: ["Stage ID: ", st.stageNumber]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[11px] font-bold text-forest-900/70 mb-1",
									children: "Stage Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "w-full rounded-lg border border-forest-900/15 p-2 text-xs",
									value: st.title,
									onChange: (e) => updateStageField(st.stageNumber, "title", e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[11px] font-bold text-forest-900/70 mb-1",
									children: "Timeline / When to Pay"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "w-full rounded-lg border border-forest-900/15 p-2 text-xs",
									value: st.timeline,
									onChange: (e) => updateStageField(st.stageNumber, "timeline", e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[11px] font-bold text-forest-900/70 mb-1",
									children: "Approx INR Outflow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "w-full rounded-lg border border-forest-900/15 p-2 text-xs font-bold",
									value: st.inrEstimate,
									onChange: (e) => updateStageField(st.stageNumber, "inrEstimate", e.target.value)
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] font-bold text-forest-900/70 mb-1",
								children: "Official Currency Cost"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-full rounded-lg border border-forest-900/15 p-2 text-xs",
								value: st.officialCost,
								onChange: (e) => updateStageField(st.stageNumber, "officialCost", e.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] font-bold text-forest-900/70 mb-1",
								children: "Paid Directly To"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-full rounded-lg border border-forest-900/15 p-2 text-xs",
								value: st.paidTo,
								onChange: (e) => updateStageField(st.stageNumber, "paidTo", e.target.value)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] font-bold text-forest-900/70 mb-1",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-full rounded-lg border border-forest-900/15 p-2 text-xs",
								value: st.description,
								onChange: (e) => updateStageField(st.stageNumber, "description", e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] font-bold text-emerald-800 mb-1",
								children: "Refund / Protection Guarantee"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-full rounded-lg border border-emerald-600/30 bg-emerald-50/40 p-2 text-xs text-emerald-900",
								value: st.refundableInfo,
								onChange: (e) => updateStageField(st.stageNumber, "refundableInfo", e.target.value)
							})]
						})
					]
				}, st.stageNumber))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: save,
					className: "rounded-2xl bg-forest-900 px-8 py-3 text-sm font-bold text-white hover:bg-forest-800 shadow-md disabled:opacity-50",
					children: busy ? "Saving…" : "Save All Budget Changes"
				})
			})
		]
	});
}
function SettingsPanel({ settings, onReload, onNotice, onDirtyChange }) {
	const [form, setForm] = (0, import_react.useState)(settings);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [faqBusy, setFaqBusy] = (0, import_react.useState)(false);
	const [editingFaqIndex, setEditingFaqIndex] = (0, import_react.useState)(null);
	const [faqDraft, setFaqDraft] = (0, import_react.useState)({
		q: "",
		a: ""
	});
	const [editingStatIndex, setEditingStatIndex] = (0, import_react.useState)(null);
	const [statDraft, setStatDraft] = (0, import_react.useState)({
		value: "",
		label: ""
	});
	const [statBusy, setStatBusy] = (0, import_react.useState)(false);
	const [isEditingContactDetails, setIsEditingContactDetails] = (0, import_react.useState)(false);
	const [contactDraft, setContactDraft] = (0, import_react.useState)({
		phones: [...settings.phones],
		emails: [...settings.emails],
		officeHours: settings.officeHours
	});
	const [contactBusy, setContactBusy] = (0, import_react.useState)(false);
	const isDirty = JSON.stringify(form) !== JSON.stringify(settings);
	const faqOriginal = editingFaqIndex === null ? null : form.faqs[editingFaqIndex] ?? {
		q: "",
		a: ""
	};
	const faqDraftDirty = editingFaqIndex !== null && JSON.stringify(faqDraft) !== JSON.stringify(faqOriginal);
	const statOriginal = editingStatIndex === null ? null : form.trustStats[editingStatIndex] ?? {
		value: "",
		label: ""
	};
	const statDraftDirty = editingStatIndex !== null && JSON.stringify(statDraft) !== JSON.stringify(statOriginal);
	const contactOriginal = {
		phones: form.phones,
		emails: form.emails,
		officeHours: form.officeHours
	};
	const contactDraftDirty = isEditingContactDetails && JSON.stringify(contactDraft) !== JSON.stringify(contactOriginal);
	const hasUnsavedChanges = isDirty || faqDraftDirty || statDraftDirty || contactDraftDirty;
	(0, import_react.useEffect)(() => {
		onDirtyChange(hasUnsavedChanges);
	}, [hasUnsavedChanges, onDirtyChange]);
	(0, import_react.useEffect)(() => {
		if (!hasUnsavedChanges) return;
		const warnBeforeLeaving = (event) => {
			event.preventDefault();
			event.returnValue = "";
		};
		window.addEventListener("beforeunload", warnBeforeLeaving);
		return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
	}, [hasUnsavedChanges]);
	function beginTrustStatEdit(index) {
		setStatDraft({ ...form.trustStats[index] });
		setEditingStatIndex(index);
	}
	function beginNewTrustStat() {
		setStatDraft({
			value: "",
			label: ""
		});
		setEditingStatIndex(form.trustStats.length);
	}
	function cancelTrustStatEdit() {
		if (statDraftDirty && !window.confirm("Discard your unsaved homepage trust number changes?")) return;
		setStatDraft({
			value: "",
			label: ""
		});
		setEditingStatIndex(null);
	}
	async function saveTrustStatDraft() {
		if (editingStatIndex === null) return;
		const trustStat = {
			value: statDraft.value.trim(),
			label: statDraft.label.trim()
		};
		if (!trustStat.value || !trustStat.label) {
			onNotice("Enter both a trust number and its label before saving.");
			return;
		}
		setStatBusy(true);
		try {
			const result = await saveTrustStat({ data: {
				action: "save",
				index: editingStatIndex,
				trustStat
			} });
			setForm((current) => ({
				...current,
				trustStats: result.trustStats
			}));
			setStatDraft({
				value: "",
				label: ""
			});
			setEditingStatIndex(null);
			await onReload();
			onNotice("Homepage trust number saved.");
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not save this trust number.");
		} finally {
			setStatBusy(false);
		}
	}
	async function removeTrustStat(index) {
		if (!window.confirm("Remove this trust number from the homepage?")) return;
		setStatBusy(true);
		try {
			const result = await saveTrustStat({ data: {
				action: "remove",
				index
			} });
			setForm((current) => ({
				...current,
				trustStats: result.trustStats
			}));
			await onReload();
			onNotice("Homepage trust number removed.");
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not remove this trust number.");
		} finally {
			setStatBusy(false);
		}
	}
	function beginContactEdit() {
		setContactDraft({
			phones: [...form.phones],
			emails: [...form.emails],
			officeHours: form.officeHours
		});
		setIsEditingContactDetails(true);
	}
	function cancelContactEdit() {
		if (contactDraftDirty && !window.confirm("Discard your unsaved contact detail changes?")) return;
		setIsEditingContactDetails(false);
	}
	async function saveContactEdit() {
		setContactBusy(true);
		try {
			const result = await saveContactDetails({ data: contactDraft });
			setForm((current) => ({
				...current,
				...result
			}));
			setContactDraft({
				phones: result.phones,
				emails: result.emails,
				officeHours: result.officeHours
			});
			setIsEditingContactDetails(false);
			await onReload();
			onNotice("Contact details updated on the public site.");
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not save contact details.");
		} finally {
			setContactBusy(false);
		}
	}
	function beginFaqEdit(index) {
		setFaqDraft({ ...form.faqs[index] });
		setEditingFaqIndex(index);
	}
	function beginNewFaq() {
		setFaqDraft({
			q: "",
			a: ""
		});
		setEditingFaqIndex(form.faqs.length);
	}
	function cancelFaqEdit() {
		setFaqDraft({
			q: "",
			a: ""
		});
		setEditingFaqIndex(null);
	}
	async function saveFaqDraft() {
		if (editingFaqIndex === null) return;
		const faq = {
			q: faqDraft.q.trim(),
			a: faqDraft.a.trim()
		};
		if (!faq.q || !faq.a) {
			onNotice("Enter both a question and an answer, or cancel this FAQ draft.");
			return;
		}
		setFaqBusy(true);
		try {
			const result = await saveFaq({ data: {
				action: "save",
				index: editingFaqIndex,
				faq
			} });
			setForm((current) => ({
				...current,
				faqs: result.faqs
			}));
			cancelFaqEdit();
			await onReload();
			onNotice("FAQ saved and published.");
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not save this FAQ.");
		} finally {
			setFaqBusy(false);
		}
	}
	async function removeFaq(index) {
		if (!window.confirm("Remove this FAQ from the homepage? This takes effect after you confirm.")) return;
		setFaqBusy(true);
		try {
			const result = await saveFaq({ data: {
				action: "remove",
				index
			} });
			setForm((current) => ({
				...current,
				faqs: result.faqs
			}));
			await onReload();
			onNotice("FAQ removed from the homepage.");
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not remove this FAQ.");
		} finally {
			setFaqBusy(false);
		}
	}
	async function save() {
		if (editingFaqIndex !== null || editingStatIndex !== null || isEditingContactDetails) {
			onNotice("Save or cancel the open settings editor before saving the other site settings.");
			return;
		}
		if (form.trustStats.some((item) => !item.value.trim() || !item.label.trim())) {
			onNotice("Complete or remove each homepage trust number before saving.");
			return;
		}
		setBusy(true);
		try {
			await updateSettings({ data: form });
			await onReload();
			onDirtyChange(false);
			onNotice("Site settings saved.");
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not save settings.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-[0.18em] text-coral-600",
				children: "Controls"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-3xl font-extrabold",
				children: "Website settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-forest-900/60",
				children: "These values update the public pages only after you choose a save action. Existing popup and WhatsApp controls remain here too."
			}),
			hasUnsavedChanges && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900",
				children: "You have unsaved changes. Save the FAQ draft or site settings before leaving; otherwise you’ll be asked to discard them."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-5 rounded-3xl bg-white p-6 ring-1 ring-forest-900/10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-4 border-b border-forest-900/10 pb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-extrabold",
								children: "Contact details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-forest-900/55",
								children: "Choose Edit, make your changes, then save them to update the public site."
							})] }), !isEditingContactDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: contactBusy || editingFaqIndex !== null || editingStatIndex !== null,
								onClick: beginContactEdit,
								className: "min-h-11 rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50",
								children: "Edit contact details"
							})]
						}), isEditingContactDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-bold",
								children: "Phone numbers (one per line)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "field min-h-20",
								value: contactDraft.phones.join("\n"),
								onChange: (event) => setContactDraft((current) => ({
									...current,
									phones: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean)
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-bold",
								children: "Email addresses (one per line)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "field min-h-20",
								value: contactDraft.emails.join("\n"),
								onChange: (event) => setContactDraft((current) => ({
									...current,
									emails: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean)
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block text-sm font-bold",
								children: "Office hours"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field",
								maxLength: 120,
								value: contactDraft.officeHours,
								onChange: (event) => setContactDraft((current) => ({
									...current,
									officeHours: event.target.value
								})),
								placeholder: "Mon – Sat · 9:30 AM – 7:30 PM"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: contactBusy,
									onClick: () => void saveContactEdit(),
									className: "min-h-11 rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50",
									children: contactBusy ? "Saving…" : "Save contact details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: contactBusy,
									onClick: cancelContactEdit,
									className: "min-h-11 rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-50",
									children: "Cancel"
								})]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-cream p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs font-bold uppercase tracking-wide text-forest-900/55",
										children: "Phone numbers"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 break-words text-sm font-semibold",
										children: form.phones.join(" · ")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-cream p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs font-bold uppercase tracking-wide text-forest-900/55",
										children: "Email addresses"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 break-words text-sm font-semibold",
										children: form.emails.join(" · ")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-cream p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs font-bold uppercase tracking-wide text-forest-900/55",
										children: "Office hours"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 break-words text-sm font-semibold",
										children: form.officeHours
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-3 border-b border-forest-900/10 pb-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-extrabold",
								children: "Homepage trust numbers"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-forest-900/55",
								children: "Edit or add a number, then choose Save trust number. Removing a number asks you to confirm first."
							})] }),
							form.trustStats.map((item, index) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-3 rounded-2xl bg-cream p-4",
									children: editingStatIndex === index ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest-900/60",
											children: "Trust number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											maxLength: 40,
											"aria-label": "Homepage trust number " + (index + 1),
											value: statDraft.value,
											onChange: (event) => setStatDraft((current) => ({
												...current,
												value: event.target.value
											})),
											placeholder: "2,500+"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest-900/60",
											children: "Label"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											maxLength: 80,
											"aria-label": "Homepage trust number label " + (index + 1),
											value: statDraft.label,
											onChange: (event) => setStatDraft((current) => ({
												...current,
												label: event.target.value
											})),
											placeholder: "Visas approved"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: statBusy || !statDraft.value.trim() || !statDraft.label.trim(),
												onClick: () => void saveTrustStatDraft(),
												className: "min-h-11 rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50",
												children: statBusy ? "Saving…" : "Save trust number"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: statBusy,
												onClick: cancelTrustStatEdit,
												className: "min-h-11 rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-50",
												children: "Cancel"
											})]
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-extrabold text-forest-900",
											children: item.value
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-forest-900/65",
											children: item.label
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: statBusy || editingStatIndex !== null || editingFaqIndex !== null || isEditingContactDetails,
												onClick: () => beginTrustStatEdit(index),
												"aria-label": "Edit homepage trust number " + (index + 1),
												className: "min-h-11 rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50",
												children: "Edit"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: form.trustStats.length <= 1 || statBusy || editingStatIndex !== null || editingFaqIndex !== null || isEditingContactDetails,
												onClick: () => void removeTrustStat(index),
												className: "min-h-11 rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-40",
												children: "Remove"
											})]
										})]
									})
								}, index);
							}),
							editingStatIndex === form.trustStats.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 rounded-2xl border border-coral-300 bg-coral-50/40 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-forest-900",
										children: "New trust number draft — it appears on the homepage after you save it."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest-900/60",
										children: "Trust number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										maxLength: 40,
										"aria-label": "New homepage trust number",
										value: statDraft.value,
										onChange: (event) => setStatDraft((current) => ({
											...current,
											value: event.target.value
										})),
										placeholder: "2,500+"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest-900/60",
										children: "Label"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										maxLength: 80,
										"aria-label": "New homepage trust number label",
										value: statDraft.label,
										onChange: (event) => setStatDraft((current) => ({
											...current,
											label: event.target.value
										})),
										placeholder: "Visas approved"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: statBusy || !statDraft.value.trim() || !statDraft.label.trim(),
											onClick: () => void saveTrustStatDraft(),
											className: "min-h-11 rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50",
											children: statBusy ? "Saving…" : "Save trust number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: statBusy,
											onClick: cancelTrustStatEdit,
											className: "min-h-11 rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-50",
											children: "Cancel"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: form.trustStats.length >= 6 || statBusy || editingStatIndex !== null || editingFaqIndex !== null || isEditingContactDetails,
								onClick: beginNewTrustStat,
								className: "w-fit min-h-11 rounded-full bg-forest-50 px-4 py-2 text-xs font-bold text-forest-900 disabled:opacity-40",
								children: "Add trust number"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-3 border-b border-forest-900/10 pb-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-extrabold",
								children: "Homepage FAQs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-forest-900/55",
								children: "Click “Edit FAQ” to open an entry. Use its “Save FAQ” button to publish that change. “Add FAQ” opens a draft and does not publish it until you press “Save FAQ”."
							})] }),
							form.faqs.map((item, index) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-3 rounded-2xl bg-cream p-4",
									children: editingFaqIndex === index ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											"aria-label": `FAQ question ${index + 1}`,
											value: faqDraft.q,
											onChange: (event) => setFaqDraft({
												...faqDraft,
												q: event.target.value
											}),
											placeholder: "Question"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "field min-h-20",
											"aria-label": `FAQ answer ${index + 1}`,
											value: faqDraft.a,
											onChange: (event) => setFaqDraft({
												...faqDraft,
												a: event.target.value
											}),
											placeholder: "Answer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: faqBusy,
												onClick: () => void saveFaqDraft(),
												className: "rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50",
												children: faqBusy ? "Saving…" : "Save FAQ"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: faqBusy,
												onClick: cancelFaqEdit,
												className: "rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-50",
												children: "Cancel"
											})]
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold",
										children: item.q
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-forest-900/65",
										children: item.a
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: faqBusy || editingFaqIndex !== null || editingStatIndex !== null || isEditingContactDetails,
											onClick: () => beginFaqEdit(index),
											className: "rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50",
											children: "Edit FAQ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: faqBusy || editingFaqIndex !== null || editingStatIndex !== null || isEditingContactDetails || form.faqs.length <= 1,
											onClick: () => void removeFaq(index),
											className: "rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-40",
											children: "Remove"
										})]
									})] })
								}, index);
							}),
							editingFaqIndex === form.faqs.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 rounded-2xl border border-coral-300 bg-coral-50/40 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-forest-900",
										children: "New FAQ draft — it will not appear publicly until saved."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										"aria-label": "New FAQ question",
										value: faqDraft.q,
										onChange: (event) => setFaqDraft({
											...faqDraft,
											q: event.target.value
										}),
										placeholder: "Question"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: "field min-h-20",
										"aria-label": "New FAQ answer",
										value: faqDraft.a,
										onChange: (event) => setFaqDraft({
											...faqDraft,
											a: event.target.value
										}),
										placeholder: "Answer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: faqBusy,
											onClick: () => void saveFaqDraft(),
											className: "rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50",
											children: faqBusy ? "Saving…" : "Save FAQ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: faqBusy,
											onClick: cancelFaqEdit,
											className: "rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-50",
											children: "Cancel"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: form.faqs.length >= 20 || faqBusy || editingFaqIndex !== null || editingStatIndex !== null || isEditingContactDetails,
								onClick: beginNewFaq,
								className: "w-fit rounded-full bg-forest-50 px-4 py-2 text-xs font-bold text-forest-900 disabled:opacity-40",
								children: "Add FAQ"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-extrabold",
								children: "Existing controls"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-4 border-b border-forest-900/10 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block",
									children: "Enquiry popup"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									className: "text-forest-900/60",
									children: "Show the enquiry form after visitors stay on the site."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.popupEnabled,
									onChange: (event) => setForm({
										...form,
										popupEnabled: event.target.checked
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-4 border-b border-forest-900/10 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block",
									children: "WhatsApp button"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									className: "text-forest-900/60",
									children: "Keep the floating WhatsApp contact action visible."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.whatsappEnabled,
									onChange: (event) => setForm({
										...form,
										whatsappEnabled: event.target.checked
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-4 border-b border-forest-900/10 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block",
									children: "Approvals marquee"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									className: "text-forest-900/60",
									children: "Show the moving recent-approval strip on the home page."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.approvalsMarqueeEnabled,
									onChange: (event) => setForm({
										...form,
										approvalsMarqueeEnabled: event.target.checked
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-2 block font-bold",
								children: "Popup delay (seconds)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field max-w-40",
								type: "number",
								min: "3",
								max: "60",
								value: form.popupDelaySeconds,
								onChange: (event) => setForm({
									...form,
									popupDelaySeconds: Number(event.target.value)
								})
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy || !isDirty || editingFaqIndex !== null || editingStatIndex !== null || isEditingContactDetails,
						onClick: () => void save(),
						className: "w-fit rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-60",
						children: busy ? "Saving…" : "Save site settings"
					})
				]
			})
		]
	});
}
function UsersPanel({ users, currentEmail, onReload, onNotice }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("content_editor");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [resetModalUser, setResetModalUser] = (0, import_react.useState)(null);
	const [newStaffPassword, setNewStaffPassword] = (0, import_react.useState)("");
	async function save() {
		const cleanEmail = email.trim().toLowerCase();
		const cleanPassword = password.trim();
		if (!cleanEmail || !cleanPassword) {
			onNotice("Email and initial password are required");
			return;
		}
		if (cleanPassword.length < 6) {
			onNotice("Password must be at least 6 characters");
			return;
		}
		setBusy(true);
		try {
			await saveAdminUser({ data: {
				email: cleanEmail,
				name: name.trim() || cleanEmail,
				role,
				password: cleanPassword
			} });
			setEmail("");
			setName("");
			setPassword("");
			await onReload();
			onNotice("New staff user created. They can sign in with this email and password.");
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not save user.");
		} finally {
			setBusy(false);
		}
	}
	async function handleResetStaffPassword(event) {
		event.preventDefault();
		const cleanPassword = newStaffPassword.trim();
		if (!resetModalUser || cleanPassword.length < 6) return;
		setBusy(true);
		try {
			await saveAdminUser({ data: {
				email: resetModalUser.email,
				name: resetModalUser.name,
				role: resetModalUser.role,
				password: cleanPassword
			} });
			onNotice("Password for " + resetModalUser.email + " has been updated.");
			setResetModalUser(null);
			setNewStaffPassword("");
			await onReload();
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not update staff password.");
		} finally {
			setBusy(false);
		}
	}
	async function remove(openId) {
		if (!window.confirm("Remove this dashboard user? They will no longer be able to log in.")) return;
		setBusy(true);
		try {
			await deleteAdminUser({ data: { openId } });
			await onReload();
			onNotice("Dashboard user removed.");
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not remove user.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.18em] text-coral-600",
					children: "Access control"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl font-extrabold",
					children: "Add New Staff / User"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-forest-900/65",
					children: "Create an account for counsellors or editors. They sign in with this email and password, and only see the sections allowed by their role."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-forest-900/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-forest-900/70",
							children: "Staff Email (Login ID) *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							type: "email",
							autoComplete: "off",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							placeholder: "staff@example.com",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-forest-900/70",
							children: "Staff Full Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							type: "text",
							autoComplete: "off",
							value: name,
							onChange: (event) => setName(event.target.value),
							placeholder: "Staff member's name"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-forest-900/70",
							children: "Initial Password (minimum 6 characters) *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
							value: password,
							onChange: setPassword,
							required: true,
							minLength: 6,
							autoComplete: "new-password",
							ariaLabel: "Initial password for new staff user",
							className: "field",
							placeholder: "Set an initial password",
							toggleClassName: "text-forest-900/50 hover:text-forest-900"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-forest-900/70",
							children: "Role & Permissions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "field",
							value: role,
							onChange: (event) => setRole(event.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "content_editor",
									children: "Content Editor (News, Stories & Batches)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "enquiry_manager",
									children: "Enquiry Manager (Leads & Inquiries)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "super_admin",
									children: "Super Admin (Everything)"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-cream p-4 text-xs text-forest-900/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-forest-900",
								children: roleLabels[role]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1",
								children: role === "super_admin" ? "Full control over leads, content, settings and users." : role === "content_editor" ? "Can manage News, coaching batches and Success Stories." : "Can manage enquiries and follow-ups."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy || !email.trim() || password.trim().length < 6,
							onClick: () => void save(),
							className: "w-fit rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50",
							children: busy ? "Saving…" : "Create staff user"
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [users.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex flex-col justify-between gap-3 rounded-2xl bg-white p-5 ring-1 ring-forest-900/10 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: user.name || user.email }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-forest-900/60",
							children: user.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-2 inline-flex rounded-full bg-coral-50 px-3 py-1 text-xs font-bold text-coral-700",
							children: roleLabels[user.role]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setResetModalUser(user);
								setNewStaffPassword("");
							},
							className: "rounded-full border border-forest-900/20 px-3.5 py-1.5 text-xs font-bold text-forest-900 hover:bg-forest-50",
							children: "Reset password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy || user.email.toLowerCase() === currentEmail.toLowerCase(),
							onClick: () => void remove(user.openId),
							className: "w-fit rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-40",
							children: user.email.toLowerCase() === currentEmail.toLowerCase() ? "Current account" : "Remove"
						})]
					})]
				}, user.openId)), users.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl bg-white p-6 text-center text-sm text-forest-900/60",
					children: "No provisioned users yet."
				})]
			}),
			resetModalUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "presentation",
				onMouseDown: (event) => {
					if (event.target === event.currentTarget) setResetModalUser(null);
				},
				className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "reset-staff-password-title",
					className: "w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-forest-900/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-forest-900/10 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							id: "reset-staff-password-title",
							className: "text-lg font-extrabold text-forest-900",
							children: "Reset staff password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-forest-900/60",
							children: resetModalUser.email
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setResetModalUser(null),
							"aria-label": "Close password reset dialog",
							className: "text-sm font-bold text-forest-900/40 hover:text-forest-900",
							children: "✕"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleResetStaffPassword,
						className: "mt-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-bold text-forest-900/70",
							children: "New Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
							value: newStaffPassword,
							onChange: setNewStaffPassword,
							required: true,
							minLength: 6,
							autoComplete: "new-password",
							ariaLabel: "New password for staff user",
							className: "field",
							placeholder: "Enter new password",
							toggleClassName: "text-forest-900/50 hover:text-forest-900"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setResetModalUser(null),
								className: "rounded-full border border-forest-900/15 px-5 py-2.5 text-xs font-bold text-forest-900",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy || newStaffPassword.trim().length < 6,
								className: "rounded-full bg-forest-900 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50",
								children: busy ? "Saving…" : "Save Password"
							})]
						})]
					})]
				})
			})
		]
	});
}
export { AdminPage as component };
