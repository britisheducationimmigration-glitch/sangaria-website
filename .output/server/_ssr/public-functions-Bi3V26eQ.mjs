import { createServerFn } from "./ssr.mjs";
import { approvals, coachingSchedule, execute, jsonArray, posts, queryRows, testimonials } from "./db.server-BhNUs5Hf.mjs";
import { createServerRpc } from "./createServerRpc--Tf39wPN.mjs";
// node_modules/.nitro/vite/services/ssr/assets/public-functions-Bi3V26eQ.js
var defaultSettings = {
	popupEnabled: true,
	popupDelaySeconds: 8,
	whatsappEnabled: true,
	approvalsMarqueeEnabled: true
};
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
function mapSettings(row) {
	return {
		popupEnabled: row ? Boolean(row.popup_enabled) : defaultSettings.popupEnabled,
		popupDelaySeconds: row ? Math.min(60, Math.max(3, Number(row.popup_delay_seconds) || 8)) : defaultSettings.popupDelaySeconds,
		whatsappEnabled: row ? Boolean(row.whatsapp_enabled) : defaultSettings.whatsappEnabled,
		approvalsMarqueeEnabled: row ? Boolean(row.approvals_marquee_enabled) : defaultSettings.approvalsMarqueeEnabled
	};
}
function dateOnly(value) {
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	const text = String(value ?? "");
	if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
	const parsed = new Date(text);
	return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}
var getPublicContent_createServerFn_handler = createServerRpc({
	id: "e2f4072ad03877a5d70f323d6a752ff07a9debb302d3a482a2babe9a67cb65a4",
	name: "getPublicContent",
	filename: "src/lib/public-functions.ts"
}, (opts) => getPublicContent.__executeServer(opts));
var getPublicContent = createServerFn({ method: "GET" }).handler(getPublicContent_createServerFn_handler, async () => {
	if (publicContentCache && publicContentCache.expiresAt > Date.now()) return publicContentCache.data;
	const postRows = await queryRows("SELECT slug, title, category, publish_date, excerpt, read_mins, body_json FROM content_posts WHERE published = 1 ORDER BY publish_date DESC, id DESC");
	const storyRows = await queryRows("SELECT id, kind, name, city, country, visa, quote, rating, initials, flag, story_date, note FROM success_stories WHERE published = 1 ORDER BY story_date DESC, id DESC");
	const settingsRows = await queryRows("SELECT popup_enabled, popup_delay_seconds, whatsapp_enabled, approvals_marquee_enabled FROM site_settings WHERE id = 1 LIMIT 1");
	const data = {
		posts: postRows.length ? postRows.map((row) => ({
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
			note: String(row.note ?? "") || void 0
		})) : approvals,
		testimonials: storyRows.length ? storyRows.filter((row) => row.kind === "testimonial").map((row) => ({
			name: String(row.name),
			city: String(row.city),
			country: String(row.country),
			visa: String(row.visa),
			quote: String(row.quote),
			rating: Number(row.rating),
			initials: String(row.initials)
		})) : testimonials,
		settings: mapSettings(settingsRows[0])
	};
	publicContentCache = {
		data,
		expiresAt: Date.now() + 8e3
	};
	return data;
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
	const data = { batches: rows.length ? rows.map((row) => ({
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
	})) };
	coachingCache = {
		data,
		expiresAt: Date.now() + 8e3
	};
	return data;
});
export { getCoachingContent_createServerFn_handler, getPublicContent_createServerFn_handler, submitEnquiry_createServerFn_handler };
