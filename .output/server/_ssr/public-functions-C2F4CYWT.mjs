import { createServerFn } from "./ssr.mjs";
import { approvals, coachingSchedule, defaultCertificates, execute, jsonArray, posts, queryRows, readSiteSettings, testimonials } from "./site-settings-DNyZ2OvY.mjs";
import { defaultCashflowData, mergeNewCashflowDestinations } from "./cashflow-i4Ureh_B.mjs";
import { isBatchExpired } from "./batch-dates-7Z_1qomz.mjs";
import { getSupportedVideoEmbedUrl } from "./video-0JgGSTnq.mjs";
import { createServerRpc } from "./createServerRpc--Tf39wPN.mjs";
// node_modules/.nitro/vite/services/ssr/assets/public-functions-C2F4CYWT.js
var publicContentCache = null;
function stringValue(value, max = 5e3) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function validateEnquiry(data) {
	const input = data ?? {};
	const result = {
		name: stringValue(input.name, 120),
		phone: stringValue(input.phone, 40),
		email: stringValue(input.email, 190),
		city: stringValue(input.city, 120),
		interest: stringValue(input.interest, 160),
		country: stringValue(input.country, 120),
		message: stringValue(input.message, 5e3),
		source: stringValue(input.source, 160),
		summary: stringValue(input.summary, 5e3)
	};
	if (result.name.length < 2) throw new Error("Please enter your name");
	if (result.phone.replace(/\D/g, "").length < 10) throw new Error("Please enter a valid phone number");
	if (result.email && !/^\S+@\S+\.\S+$/.test(result.email)) throw new Error("Please enter a valid email");
	return result;
}
var submitEnquiry_createServerFn_handler = createServerRpc({
	id: "a03d07227db12b383826e0fa92b2c8222ca6b2e11bcc485b1098bb2038a9a187",
	name: "submitEnquiry",
	filename: "src/lib/public-functions.ts"
}, (opts) => submitEnquiry.__executeServer(opts));
var submitEnquiry = createServerFn({ method: "POST" }).validator(validateEnquiry).handler(submitEnquiry_createServerFn_handler, async ({ data }) => {
	const result = await execute(`INSERT INTO enquiries (name, phone, email, city, interest, country, message, source, summary, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', '')`, [
		data.name,
		data.phone,
		data.email,
		data.city,
		data.interest,
		data.country,
		data.message,
		data.source,
		data.summary
	]);
	return {
		ok: true,
		id: Number(result.insertId)
	};
});
function dateOnly(value) {
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	const text = String(value ?? "");
	if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
	const parsed = new Date(text);
	return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}
var legacyReviewedPosts = {
	"canada-study-permit-cap-2027": {
		title: "Canada study permit cap for 2027: what Rajasthan & Punjab students should know",
		excerpt: "IRCC has announced its allocation for next year. Here is how the provincial attestation letter (PAL) affects your application.",
		body: [
			"Canada continues to manage the number of new study permits through a national cap and a provincial attestation letter (PAL) requirement for most college and undergraduate programs.",
			"Masters and PhD students at public institutions remain exempt from the PAL requirement, which makes postgraduate programs a strong option for graduates.",
			"Our advice: apply early, keep your funds documentation clean, and choose programs aligned with your previous education. Book a free counselling session to check your profile."
		]
	},
	"uk-graduate-route-update": {
		title: "UK Graduate Route: the latest on post-study work duration",
		excerpt: "Changes to the Graduate Route mean students should plan their career timeline carefully. We break it down.",
		body: [
			"The UK Graduate Route allows international students to stay and work after their studies. Recent policy updates have adjusted the duration for new applicants.",
			"Students starting in January and May intakes should confirm the rules that apply on their visa application date.",
			"Our counsellors can help you choose universities with strong employability records."
		]
	}
};
function applyEditorialReview(post) {
	const reviewed = posts.find((candidate) => candidate.slug === post.slug);
	if (!reviewed?.lastReviewed || !reviewed.sources?.length) return post;
	const legacy = legacyReviewedPosts[post.slug];
	const isLegacyCopy = !!legacy && post.title === legacy.title && post.excerpt === legacy.excerpt && JSON.stringify(post.body) === JSON.stringify(legacy.body);
	const isReviewedCopy = post.title === reviewed.title && post.excerpt === reviewed.excerpt && JSON.stringify(post.body) === JSON.stringify(reviewed.body);
	if (!isLegacyCopy && !isReviewedCopy) return post;
	if (isLegacyCopy) return {
		...post,
		title: reviewed.title,
		excerpt: reviewed.excerpt,
		readMins: reviewed.readMins,
		body: reviewed.body,
		lastReviewed: reviewed.lastReviewed,
		sources: reviewed.sources
	};
	return {
		...post,
		lastReviewed: reviewed.lastReviewed,
		sources: reviewed.sources
	};
}
var getPublicContent_createServerFn_handler = createServerRpc({
	id: "e2f4072ad03877a5d70f323d6a752ff07a9debb302d3a482a2babe9a67cb65a4",
	name: "getPublicContent",
	filename: "src/lib/public-functions.ts"
}, (opts) => getPublicContent.__executeServer(opts));
var getPublicContent = createServerFn({ method: "GET" }).handler(getPublicContent_createServerFn_handler, async () => {
	if (publicContentCache && publicContentCache.expiresAt > Date.now()) return publicContentCache.data;
	const postRows = await queryRows("SELECT slug, title, category, publish_date, excerpt, read_mins, body_json FROM content_posts WHERE published = 1 ORDER BY publish_date DESC, id DESC");
	const storyRows = await queryRows("SELECT id, kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, photo_data IS NOT NULL AS has_photo, video_url, media_alt, media_version, homepage_featured FROM success_stories WHERE published = 1 ORDER BY story_date DESC, id DESC");
	const settingsRows = await queryRows("SELECT popup_enabled, popup_delay_seconds, whatsapp_enabled, approvals_marquee_enabled, public_settings_json FROM site_settings WHERE id = 1 LIMIT 1");
	const certificateRows = await queryRows("SELECT id, title, issuer, category, credential_date, alt_text, image_path, image_data IS NOT NULL AS has_database_image, image_version, homepage_featured, published, sort_order FROM certificate_items WHERE collection = 'certificates' AND published = 1 ORDER BY sort_order ASC, id ASC");
	const data = {
		posts: postRows.length ? postRows.map((row) => applyEditorialReview({
			slug: String(row.slug),
			title: String(row.title),
			category: String(row.category),
			date: dateOnly(row.publish_date),
			excerpt: String(row.excerpt),
			readMins: Number(row.read_mins),
			body: jsonArray(row.body_json).map(String)
		})) : posts,
		approvals: storyRows.length ? storyRows.filter((row) => row.kind === "approval").map((row) => ({
			name: String(row.name),
			country: String(row.country),
			flag: String(row.flag),
			visa: String(row.visa),
			date: dateOnly(row.story_date),
			note: String(row.note ?? "") || void 0,
			photoSrc: Boolean(row.has_photo) ? "/success-stories/media/" + Number(row.id) + "?v=" + Number(row.media_version ?? 0) : void 0,
			videoUrl: getSupportedVideoEmbedUrl(String(row.video_url ?? "")) ? String(row.video_url ?? "") : void 0,
			mediaAlt: String(row.media_alt ?? "") || void 0,
			homepageFeatured: Boolean(row.homepage_featured)
		})) : approvals,
		testimonials: storyRows.length ? storyRows.filter((row) => row.kind === "testimonial").map((row) => ({
			name: String(row.name),
			city: String(row.city),
			country: String(row.country),
			visa: String(row.visa),
			quote: String(row.quote),
			rating: Number(row.rating),
			initials: String(row.initials),
			homepageFeatured: Boolean(row.homepage_featured)
		})) : testimonials,
		certificates: certificateRows.length ? certificateRows.map((row) => {
			const id = Number(row.id);
			const hasDatabaseImage = Boolean(row.has_database_image);
			return {
				id,
				title: String(row.title),
				issuer: String(row.issuer),
				category: String(row.category),
				credentialDate: String(row.credential_date ?? ""),
				altText: String(row.alt_text),
				imageSrc: hasDatabaseImage ? "/certificates/image/" + id + "?v=" + Number(row.image_version ?? 0) : String(row.image_path ?? ""),
				homepageFeatured: Boolean(row.homepage_featured),
				published: Boolean(row.published),
				sortOrder: Number(row.sort_order)
			};
		}) : settingsRows.length ? [] : defaultCertificates.map((item, index) => ({
			id: index + 1,
			title: item.title,
			issuer: item.issuer,
			category: item.category,
			credentialDate: item.credentialDate,
			altText: item.altText,
			imageSrc: item.imagePath,
			homepageFeatured: item.homepageFeatured,
			published: item.published,
			sortOrder: item.sortOrder
		})),
		settings: readSiteSettings(settingsRows[0])
	};
	publicContentCache = {
		data,
		expiresAt: Date.now() + 8e3
	};
	return data;
});
var getPublicCashflow_createServerFn_handler = createServerRpc({
	id: "a8241b4b2e02f8c7f493172ed4aeab7a069b98c2dd6380d6c31e781abde47e41",
	name: "getPublicCashflow",
	filename: "src/lib/public-functions.ts"
}, (opts) => getPublicCashflow.__executeServer(opts));
var getPublicCashflow = createServerFn({ method: "GET" }).handler(getPublicCashflow_createServerFn_handler, async () => {
	const raw = (await queryRows("SELECT cashflow_json FROM site_settings WHERE id = 1 LIMIT 1"))[0]?.cashflow_json;
	if (typeof raw !== "string" || !raw.trim()) return defaultCashflowData;
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.length > 0 ? mergeNewCashflowDestinations(parsed) : defaultCashflowData;
	} catch {
		return defaultCashflowData;
	}
});
var coachingCache = null;
var getCoachingContent_createServerFn_handler = createServerRpc({
	id: "7558011d2551df00f141c4ee6621ab3738add90204213d6627b39f265f6df042",
	name: "getCoachingContent",
	filename: "src/lib/public-functions.ts"
}, (opts) => getCoachingContent.__executeServer(opts));
var getCoachingContent = createServerFn({ method: "GET" }).handler(getCoachingContent_createServerFn_handler, async () => {
	if (coachingCache && coachingCache.expiresAt > Date.now()) return coachingCache.data;
	const rows = await queryRows("SELECT id, program, batch_name, time_slot, seats, starts, published FROM coaching_batches WHERE published = 1 ORDER BY id ASC");
	const data = { batches: (rows.length ? rows.map((row) => ({
		id: Number(row.id),
		program: String(row.program),
		batch: String(row.batch_name),
		time: String(row.time_slot),
		seats: Number(row.seats),
		starts: String(row.starts),
		published: Boolean(row.published)
	})) : coachingSchedule.map((batch, index) => ({
		id: index + 1,
		program: batch.batch.includes("IELTS") ? "IELTS" : "PTE",
		batch: batch.batch,
		time: batch.time,
		seats: batch.seats,
		starts: batch.starts,
		published: true
	}))).filter((batch) => !isBatchExpired(batch.starts)) };
	coachingCache = {
		data,
		expiresAt: Date.now() + 8e3
	};
	return data;
});
export { getCoachingContent_createServerFn_handler, getPublicCashflow_createServerFn_handler, getPublicContent_createServerFn_handler, submitEnquiry_createServerFn_handler };
