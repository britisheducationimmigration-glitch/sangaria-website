import { createMiddleware, createServerFn } from "./ssr.mjs";
import { asFaqList, asTrustStatList, execute, jsonArray, queryRows, readSiteSettings } from "./site-settings-DNyZ2OvY.mjs";
import { defaultCashflowData, mergeNewCashflowDestinations } from "./cashflow-i4Ureh_B.mjs";
import { isValidBatchStartDate } from "./batch-dates-7Z_1qomz.mjs";
import { getSupportedVideoEmbedUrl } from "./video-0JgGSTnq.mjs";
import "./public-functions-CqsoBxoJ.mjs";
import { createServerRpc } from "./createServerRpc--Tf39wPN.mjs";
import { Buffer } from "node:buffer";
// node_modules/.nitro/vite/services/ssr/assets/admin-functions-rgWUbeW7.js
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
function assertCapability(role, capability) {
	if (!(role === "super_admin" || role === "content_editor" && capability === "content" || role === "enquiry_manager" && capability === "enquiries")) throw new Error("You do not have permission for this section");
}
function dateOnly(value) {
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	const text = String(value ?? "");
	if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
	const parsed = new Date(text);
	return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}
function mapActivity(row) {
	return {
		id: Number(row.id),
		enquiryId: Number(row.enquiry_id),
		authorName: String(row.author_name),
		authorEmail: String(row.author_email),
		body: String(row.body),
		createdAt: new Date(String(row.created_at)).toISOString(),
		updatedAt: new Date(String(row.updated_at)).toISOString(),
		editedBy: String(row.edited_by ?? "")
	};
}
function mapEnquiry(row, activities = []) {
	return {
		id: Number(row.id),
		name: String(row.name),
		phone: String(row.phone),
		email: String(row.email),
		city: String(row.city),
		interest: String(row.interest),
		country: String(row.country),
		message: String(row.message),
		source: String(row.source),
		summary: String(row.summary),
		status: String(row.status),
		notes: String(row.notes),
		activities,
		assignedTo: String(row.assigned_to ?? ""),
		nextFollowUpAt: row.next_follow_up_at ? new Date(String(row.next_follow_up_at)).toISOString() : "",
		createdAt: new Date(String(row.created_at)).toISOString(),
		updatedAt: new Date(String(row.updated_at)).toISOString()
	};
}
function mapAdminPost(row) {
	return {
		id: Number(row.id),
		slug: String(row.slug),
		title: String(row.title),
		category: String(row.category),
		date: dateOnly(row.publish_date),
		excerpt: String(row.excerpt),
		readMins: Number(row.read_mins),
		body: jsonArray(row.body_json).map(String),
		published: Boolean(row.published)
	};
}
function mapAdminStory(row) {
	const photoSrc = Boolean(row.has_photo) ? "/success-stories/media/" + Number(row.id) + "?v=" + Number(row.media_version ?? 0) : "";
	const videoUrl = String(row.video_url ?? "");
	const mediaType = photoSrc ? "photo" : getSupportedVideoEmbedUrl(videoUrl) ? "video" : "none";
	return {
		id: Number(row.id),
		kind: String(row.kind),
		name: String(row.name),
		city: String(row.city),
		country: String(row.country),
		visa: String(row.visa),
		quote: String(row.quote),
		rating: Number(row.rating),
		initials: String(row.initials),
		flag: String(row.flag),
		date: dateOnly(row.story_date),
		note: String(row.note),
		mediaType,
		photoSrc,
		videoUrl: mediaType === "video" ? videoUrl : "",
		mediaAlt: String(row.media_alt ?? ""),
		mediaConsent: Boolean(row.media_consent),
		homepageFeatured: Boolean(row.homepage_featured),
		published: Boolean(row.published)
	};
}
function mapBatch(row) {
	return {
		id: Number(row.id),
		program: String(row.program),
		batch: String(row.batch_name),
		time: String(row.time_slot),
		seats: Number(row.seats),
		starts: String(row.starts),
		published: Boolean(row.published)
	};
}
function mapCertificate(row) {
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
		sortOrder: Number(row.sort_order),
		collection: String(row.collection ?? "certificates"),
		hasDatabaseImage
	};
}
var getAdminSnapshot_createServerFn_handler = createServerRpc({
	id: "bc6628e955d62f88a1c7e7355e3d11a03f725e72aea8b4ac892b92deda6d57a7",
	name: "getAdminSnapshot",
	filename: "src/lib/admin-functions.ts"
}, (opts) => getAdminSnapshot.__executeServer(opts));
var getAdminSnapshot = createServerFn({ method: "GET" }).middleware([adminMiddleware]).handler(getAdminSnapshot_createServerFn_handler, async ({ context }) => {
	const [enquiryRows, postRows, storyRows, settingsRows, userRows, statRows, batchRows, statusRows, sourceRows, certificateRows] = await Promise.all([
		context.role === "content_editor" ? Promise.resolve([]) : queryRows("SELECT id, name, phone, email, city, interest, country, message, source, summary, status, notes, assigned_to, next_follow_up_at, created_at, updated_at FROM enquiries ORDER BY created_at DESC LIMIT 150"),
		context.role === "enquiry_manager" ? Promise.resolve([]) : queryRows("SELECT * FROM content_posts ORDER BY publish_date DESC, id DESC LIMIT 100"),
		context.role === "enquiry_manager" ? Promise.resolve([]) : queryRows("SELECT id, kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, photo_data IS NOT NULL AS has_photo, video_url, media_alt, media_consent, media_version, homepage_featured, published FROM success_stories ORDER BY story_date DESC, id DESC LIMIT 100"),
		context.role === "super_admin" ? queryRows("SELECT popup_enabled, popup_delay_seconds, whatsapp_enabled, approvals_marquee_enabled, public_settings_json FROM site_settings WHERE id = 1 LIMIT 1") : Promise.resolve([]),
		context.role === "super_admin" ? queryRows("SELECT * FROM admin_users ORDER BY email ASC") : Promise.resolve([]),
		context.role === "content_editor" ? Promise.resolve([]) : queryRows(`SELECT COUNT(*) AS total, SUM(status = 'New') AS new_count, SUM(status IN ('Follow-up', 'Documents Pending', 'Applied')) AS follow_ups, SUM(status = 'Converted') AS converted, SUM(created_at >= CURRENT_DATE - INTERVAL 6 DAY) AS new_last_7_days, SUM(source = 'coaching') AS demo_requests, SUM(next_follow_up_at IS NOT NULL AND DATE(next_follow_up_at) = CURRENT_DATE() AND status NOT IN ('Converted', 'Closed')) AS due_today FROM enquiries`),
		context.role === "enquiry_manager" ? Promise.resolve([]) : queryRows("SELECT id, program, batch_name, time_slot, seats, starts, published FROM coaching_batches ORDER BY id ASC"),
		context.role === "content_editor" ? Promise.resolve([]) : queryRows("SELECT status, COUNT(*) AS count FROM enquiries GROUP BY status"),
		context.role === "content_editor" ? Promise.resolve([]) : queryRows("SELECT source, COUNT(*) AS count FROM enquiries GROUP BY source"),
		context.role === "enquiry_manager" ? Promise.resolve([]) : queryRows("SELECT id, collection, title, issuer, category, credential_date, alt_text, image_path, image_data IS NOT NULL AS has_database_image, image_version, homepage_featured, published, sort_order FROM certificate_items WHERE collection = 'certificates' ORDER BY sort_order ASC, id ASC")
	]);
	const activityRows = enquiryRows.length ? await queryRows(`SELECT id, enquiry_id, author_name, author_email, body, edited_by, created_at, updated_at
           FROM enquiry_activities
           WHERE enquiry_id IN (${enquiryRows.map(() => "?").join(",")})
           ORDER BY created_at ASC, id ASC`, enquiryRows.map((row) => Number(row.id))) : [];
	const activitiesByEnquiry = /* @__PURE__ */ new Map();
	for (const row of activityRows) {
		const activity = mapActivity(row);
		const existing = activitiesByEnquiry.get(activity.enquiryId) ?? [];
		existing.push(activity);
		activitiesByEnquiry.set(activity.enquiryId, existing);
	}
	const stats = statRows[0] ?? {};
	const byStatus = Object.fromEntries(statusRows.map((row) => [String(row.status), Number(row.count ?? 0)]));
	const bySource = Object.fromEntries(sourceRows.map((row) => [String(row.source || "unknown"), Number(row.count ?? 0)]));
	return {
		user: {
			name: context.user.name,
			email: context.user.email,
			role: context.role
		},
		enquiries: enquiryRows.map((row) => mapEnquiry(row, activitiesByEnquiry.get(Number(row.id)) ?? [])),
		posts: postRows.map(mapAdminPost),
		stories: storyRows.map(mapAdminStory),
		settings: readSiteSettings(settingsRows[0]),
		users: userRows.map((row) => ({
			openId: String(row.open_id || row.id || row.email),
			email: String(row.email),
			name: String(row.name || row.email),
			role: row.role === "admin" ? "super_admin" : String(row.role)
		})),
		enquiryStats: {
			total: Number(stats.total ?? 0),
			newCount: Number(stats.new_count ?? 0),
			followUps: Number(stats.follow_ups ?? 0),
			dueToday: Number(stats.due_today ?? 0),
			converted: Number(stats.converted ?? 0),
			newLast7Days: Number(stats.new_last_7_days ?? 0),
			demoRequests: Number(stats.demo_requests ?? 0),
			byStatus,
			bySource
		},
		batches: batchRows.map(mapBatch),
		certificates: certificateRows.map(mapCertificate)
	};
});
var updateEnquiry_createServerFn_handler = createServerRpc({
	id: "ad3256a0430cdfd9e87e6fa51a6ece8bffd7173a5a185b348afdb93198753076",
	name: "updateEnquiry",
	filename: "src/lib/admin-functions.ts"
}, (opts) => updateEnquiry.__executeServer(opts));
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
}).handler(updateEnquiry_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "enquiries");
	await execute("UPDATE enquiries SET status = ?, assigned_to = ?, next_follow_up_at = ? WHERE id = ?", [
		data.status,
		data.assignedTo,
		data.nextFollowUpAt,
		data.id
	]);
	return { ok: true };
});
var addEnquiryActivity_createServerFn_handler = createServerRpc({
	id: "e663fd49d3889387fe77ccdaa4d8f92cc898cb662f4c769818827c42de74df1f",
	name: "addEnquiryActivity",
	filename: "src/lib/admin-functions.ts"
}, (opts) => addEnquiryActivity.__executeServer(opts));
var addEnquiryActivity = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const enquiryId = numberValue(input.enquiryId);
	const body = stringValue(input.body, 5e3);
	if (enquiryId <= 0 || !body) throw new Error("Lead and comment are required");
	return {
		enquiryId,
		body
	};
}).handler(addEnquiryActivity_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "enquiries");
	if (!(await queryRows("SELECT id FROM enquiries WHERE id = ? LIMIT 1", [data.enquiryId])).length) throw new Error("Lead not found");
	await execute("INSERT INTO enquiry_activities (enquiry_id, author_name, author_email, body) VALUES (?, ?, ?, ?)", [
		data.enquiryId,
		context.user.name,
		context.user.email,
		data.body
	]);
	return { ok: true };
});
var updateEnquiryActivity_createServerFn_handler = createServerRpc({
	id: "28c12ead99305a1bce89d74e2d832a8cbb0756610bfb61d0428c57a75a725887",
	name: "updateEnquiryActivity",
	filename: "src/lib/admin-functions.ts"
}, (opts) => updateEnquiryActivity.__executeServer(opts));
var updateEnquiryActivity = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const id = numberValue(input.id);
	const body = stringValue(input.body, 5e3);
	if (id <= 0 || !body) throw new Error("Comment and text are required");
	return {
		id,
		body
	};
}).handler(updateEnquiryActivity_createServerFn_handler, async ({ data, context }) => {
	if (context.role !== "super_admin") throw new Error("Only a super admin can edit lead comments");
	if ((await execute("UPDATE enquiry_activities SET body = ?, edited_by = ? WHERE id = ?", [
		data.body,
		context.user.email,
		data.id
	])).affectedRows === 0) throw new Error("Comment not found");
	return { ok: true };
});
var deleteEnquiryActivity_createServerFn_handler = createServerRpc({
	id: "8e662402a880a86902b0ddaf1c5cec83d236450c39efd19a4b2941a8b32b6a18",
	name: "deleteEnquiryActivity",
	filename: "src/lib/admin-functions.ts"
}, (opts) => deleteEnquiryActivity.__executeServer(opts));
var deleteEnquiryActivity = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(deleteEnquiryActivity_createServerFn_handler, async ({ data, context }) => {
	if (context.role !== "super_admin") throw new Error("Only a super admin can delete lead comments");
	if ((await execute("DELETE FROM enquiry_activities WHERE id = ?", [data.id])).affectedRows === 0) throw new Error("Comment not found");
	return { ok: true };
});
var deleteEnquiry_createServerFn_handler = createServerRpc({
	id: "15e52c03393ad28b1a823939164c2c0bf525a268f8cdb7b695a0502ff5f29081",
	name: "deleteEnquiry",
	filename: "src/lib/admin-functions.ts"
}, (opts) => deleteEnquiry.__executeServer(opts));
var deleteEnquiry = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(deleteEnquiry_createServerFn_handler, async ({ data, context }) => {
	if (context.role !== "super_admin") throw new Error("Only a super admin can delete enquiries");
	await execute("DELETE FROM enquiry_activities WHERE enquiry_id = ?", [data.id]);
	await execute("DELETE FROM enquiries WHERE id = ?", [data.id]);
	return { ok: true };
});
var exportEnquiries_createServerFn_handler = createServerRpc({
	id: "8d39bc6fa67345f60fbe9452e7447957afbec69e4e08df633b695494259b9701",
	name: "exportEnquiries",
	filename: "src/lib/admin-functions.ts"
}, (opts) => exportEnquiries.__executeServer(opts));
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
}).handler(exportEnquiries_createServerFn_handler, async ({ context, data }) => {
	assertCapability(context.role, "enquiries");
	const clauses = [];
	const values = [];
	if (data.query) {
		clauses.push("(name LIKE ? OR phone LIKE ? OR email LIKE ? OR city LIKE ? OR interest LIKE ? OR country LIKE ? OR status LIKE ?)");
		for (let index = 0; index < 7; index += 1) values.push(`%${data.query}%`);
	}
	if (data.status) {
		clauses.push("status = ?");
		values.push(data.status);
	}
	if (data.from) {
		clauses.push("created_at >= ?");
		values.push(`${data.from} 00:00:00`);
	}
	if (data.to) {
		clauses.push("created_at < DATE_ADD(?, INTERVAL 1 DAY)");
		values.push(`${data.to} 00:00:00`);
	}
	const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
	const rows = await queryRows(`SELECT id, name, phone, email, city, interest, country, message, source, status, notes, assigned_to, next_follow_up_at, created_at FROM enquiries ${where} ORDER BY created_at DESC LIMIT 5000`, values);
	const { createLeadsWorkbook } = await import("./xlsx.server-UaV55CfC.mjs");
	const cleanDate = (value) => value ? new Date(String(value)).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "";
	const leads = rows.map((row) => [
		Number(row.id),
		row.name,
		row.phone,
		row.email,
		row.city,
		row.interest,
		row.country,
		row.status,
		row.assigned_to,
		cleanDate(row.next_follow_up_at),
		row.source,
		row.message,
		row.notes,
		cleanDate(row.created_at)
	]);
	const statusCounts = /* @__PURE__ */ new Map();
	for (const row of rows) statusCounts.set(String(row.status), (statusCounts.get(String(row.status)) ?? 0) + 1);
	const summary = [
		["Status", "Lead count"],
		...Array.from(statusCounts.entries()).map(([leadStatus, count]) => [leadStatus, count]),
		["Total", rows.length]
	];
	const followUps = rows.filter((row) => row.next_follow_up_at).map((row) => [
		cleanDate(row.next_follow_up_at),
		row.name,
		row.phone,
		row.country,
		row.interest,
		row.status,
		row.assigned_to,
		row.notes
	]);
	return {
		filename: `bei-leads-${data.status ? data.status.toLowerCase().replaceAll(" ", "-") : "all"}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`,
		base64: createLeadsWorkbook([
			{
				name: "Leads",
				rows: [[
					"ID",
					"Name",
					"Phone",
					"Email",
					"City",
					"Interest",
					"Country",
					"Status",
					"Assigned to",
					"Next follow-up",
					"Source",
					"Message",
					"Notes",
					"Created at"
				], ...leads],
				widths: [
					8,
					22,
					16,
					28,
					18,
					22,
					18,
					20,
					22,
					22,
					16,
					42,
					42,
					22
				],
				headerRows: [1],
				filter: `A1:N${Math.max(1, leads.length + 1)}`
			},
			{
				name: "Summary",
				rows: [["Lead pipeline", "Count"], ...summary.slice(1)],
				widths: [28, 14],
				headerRows: [1]
			},
			{
				name: "Follow-ups",
				rows: [[
					"Follow-up at",
					"Name",
					"Phone",
					"Country",
					"Interest",
					"Status",
					"Assigned to",
					"Notes"
				], ...followUps],
				widths: [
					22,
					22,
					16,
					18,
					22,
					20,
					22,
					42
				],
				headerRows: [1],
				filter: `A1:H${Math.max(1, followUps.length + 1)}`
			}
		])
	};
});
var savePost_createServerFn_handler = createServerRpc({
	id: "62978480ea3c5b39a74674063c2e970924ad4501dcd4420a571f9b2184cfa167",
	name: "savePost",
	filename: "src/lib/admin-functions.ts"
}, (opts) => savePost.__executeServer(opts));
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
}).handler(savePost_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "content");
	if (data.id) await execute("UPDATE content_posts SET slug = ?, title = ?, category = ?, publish_date = ?, excerpt = ?, read_mins = ?, body_json = ?, published = ? WHERE id = ?", [
		data.slug,
		data.title,
		data.category,
		data.date,
		data.excerpt,
		data.readMins,
		JSON.stringify(data.body),
		data.published ? 1 : 0,
		data.id
	]);
	else await execute("INSERT INTO content_posts (slug, title, category, publish_date, excerpt, read_mins, body_json, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
		data.slug,
		data.title,
		data.category,
		data.date,
		data.excerpt,
		data.readMins,
		JSON.stringify(data.body),
		data.published ? 1 : 0
	]);
	return { ok: true };
});
var deletePost_createServerFn_handler = createServerRpc({
	id: "35feff8f46e8d48cb3925e5e30489b8c62ac8214a17e30d5d189127a46ce3e18",
	name: "deletePost",
	filename: "src/lib/admin-functions.ts"
}, (opts) => deletePost.__executeServer(opts));
var deletePost = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(deletePost_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "content");
	await execute("DELETE FROM content_posts WHERE id = ?", [data.id]);
	return { ok: true };
});
var saveStory_createServerFn_handler = createServerRpc({
	id: "d3c3c7bbca9f44251c98c9707a0d69e9f69f1dbde3a7c47cb711f579dd8e32d3",
	name: "saveStory",
	filename: "src/lib/admin-functions.ts"
}, (opts) => saveStory.__executeServer(opts));
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
}).handler(saveStory_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "content");
	let photo = null;
	if (data.photoBase64) {
		photo = Buffer.from(data.photoBase64, "base64");
		if (!photo.length || photo.length > 1572864) throw new Error("Choose a smaller student photo (maximum 1.5 MB after compression)");
		if (!(photo.toString("ascii", 0, 4) === "RIFF" && photo.toString("ascii", 8, 12) === "WEBP")) throw new Error("The selected photo is not a valid WebP image");
	}
	let existingHasPhoto = false;
	if (data.id && data.mediaType === "photo" && !photo) {
		const existingRows = await queryRows("SELECT photo_data IS NOT NULL AS has_photo FROM success_stories WHERE id = ? LIMIT 1", [data.id]);
		existingHasPhoto = Boolean(existingRows[0]?.has_photo);
		if (!existingHasPhoto) throw new Error("Choose a student photo before saving this approval");
	}
	const mediaType = data.kind === "approval" ? data.mediaType : "none";
	const mediaConsent = mediaType !== "none" && data.mediaConsent ? 1 : 0;
	const base = [
		data.kind,
		data.name,
		data.city,
		data.country,
		data.visa,
		data.quote,
		data.rating,
		data.initials,
		data.flag,
		data.date,
		data.note,
		data.homepageFeatured ? 1 : 0,
		data.published ? 1 : 0
	];
	if (data.id) {
		if (mediaType === "photo" && photo) await execute("UPDATE success_stories SET kind = ?, name = ?, city = ?, country = ?, visa = ?, quote = ?, rating = ?, initials = ?, flag = ?, story_date = ?, note = ?, homepage_featured = ?, published = ?, photo_mime_type = ?, photo_data = ?, video_url = NULL, media_alt = ?, media_consent = ?, media_version = ? WHERE id = ?", [
			...base,
			data.photoMimeType,
			photo,
			data.mediaAlt,
			mediaConsent,
			Date.now(),
			data.id
		]);
		else if (mediaType === "photo") await execute("UPDATE success_stories SET kind = ?, name = ?, city = ?, country = ?, visa = ?, quote = ?, rating = ?, initials = ?, flag = ?, story_date = ?, note = ?, homepage_featured = ?, published = ?, video_url = NULL, media_alt = ?, media_consent = ?, media_version = ? WHERE id = ?", [
			...base,
			data.mediaAlt,
			mediaConsent,
			Date.now(),
			data.id
		]);
		else if (mediaType === "video") await execute("UPDATE success_stories SET kind = ?, name = ?, city = ?, country = ?, visa = ?, quote = ?, rating = ?, initials = ?, flag = ?, story_date = ?, note = ?, homepage_featured = ?, published = ?, photo_mime_type = NULL, photo_data = NULL, video_url = ?, media_alt = ?, media_consent = ?, media_version = ? WHERE id = ?", [
			...base,
			data.videoUrl,
			"",
			mediaConsent,
			Date.now(),
			data.id
		]);
		else await execute("UPDATE success_stories SET kind = ?, name = ?, city = ?, country = ?, visa = ?, quote = ?, rating = ?, initials = ?, flag = ?, story_date = ?, note = ?, homepage_featured = ?, published = ?, photo_mime_type = NULL, photo_data = NULL, video_url = NULL, media_alt = ?, media_consent = ?, media_version = ? WHERE id = ?", [
			...base,
			"",
			0,
			Date.now(),
			data.id
		]);
	} else {
		const photoMimeType = mediaType === "photo" ? data.photoMimeType : null;
		const photoData = mediaType === "photo" ? photo : null;
		if (mediaType === "photo" && !photoData) throw new Error("Choose a student photo before saving this approval");
		const videoUrl = mediaType === "video" ? data.videoUrl : null;
		const mediaAlt = mediaType === "photo" ? data.mediaAlt : "";
		await execute("INSERT INTO success_stories (kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, photo_mime_type, photo_data, video_url, media_alt, media_consent, media_version, homepage_featured, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
			data.kind,
			data.name,
			data.city,
			data.country,
			data.visa,
			data.quote,
			data.rating,
			data.initials,
			data.flag,
			data.date,
			data.note,
			photoMimeType,
			photoData,
			videoUrl,
			mediaAlt,
			mediaConsent,
			photoData ? Date.now() : 0,
			data.homepageFeatured ? 1 : 0,
			data.published ? 1 : 0
		]);
	}
	return { ok: true };
});
var deleteStory_createServerFn_handler = createServerRpc({
	id: "af452889f2d809e70fa55e1914332b244af16ce42d7d603f28a3d490252fb6e0",
	name: "deleteStory",
	filename: "src/lib/admin-functions.ts"
}, (opts) => deleteStory.__executeServer(opts));
var deleteStory = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(deleteStory_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "content");
	await execute("DELETE FROM success_stories WHERE id = ?", [data.id]);
	return { ok: true };
});
var saveBatch_createServerFn_handler = createServerRpc({
	id: "338861e369ff76d0d0164fb0eb7899292484abf75eed6c980ebff889b53346ba",
	name: "saveBatch",
	filename: "src/lib/admin-functions.ts"
}, (opts) => saveBatch.__executeServer(opts));
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
}).handler(saveBatch_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "content");
	if (data.id) await execute("UPDATE coaching_batches SET program = ?, batch_name = ?, time_slot = ?, seats = ?, starts = ?, published = ? WHERE id = ?", [
		data.program,
		data.batch,
		data.time,
		data.seats,
		data.starts,
		data.published ? 1 : 0,
		data.id
	]);
	else await execute("INSERT INTO coaching_batches (program, batch_name, time_slot, seats, starts, published) VALUES (?, ?, ?, ?, ?, ?)", [
		data.program,
		data.batch,
		data.time,
		data.seats,
		data.starts,
		data.published ? 1 : 0
	]);
	return { ok: true };
});
var deleteBatch_createServerFn_handler = createServerRpc({
	id: "39063f423bb6527fc2fcb556617ff8623e0cafb94000f1e9e560720454a0e4b3",
	name: "deleteBatch",
	filename: "src/lib/admin-functions.ts"
}, (opts) => deleteBatch.__executeServer(opts));
var deleteBatch = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(deleteBatch_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "content");
	await execute("DELETE FROM coaching_batches WHERE id = ?", [data.id]);
	return { ok: true };
});
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
var saveCertificate_createServerFn_handler = createServerRpc({
	id: "bb009eeedbfa5efc4b9c62d6379f0b1449902718981e6f5a546f936058c8265e",
	name: "saveCertificate",
	filename: "src/lib/admin-functions.ts"
}, (opts) => saveCertificate.__executeServer(opts));
var saveCertificate = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(certificateInput).handler(saveCertificate_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "content");
	let image = null;
	if (data.imageBase64) {
		image = Buffer.from(data.imageBase64, "base64");
		if (!image.length || image.length > 3145728) throw new Error("Choose a smaller image (maximum 3 MB after compression)");
		const webp = image.toString("ascii", 0, 4) === "RIFF" && image.toString("ascii", 8, 12) === "WEBP";
		const png = image.subarray(0, 8).equals(Buffer.from([
			137,
			80,
			78,
			71,
			13,
			10,
			26,
			10
		]));
		const jpeg = image[0] === 255 && image[1] === 216 && image[2] === 255;
		if (data.imageMimeType === "image/webp" && !webp || data.imageMimeType === "image/png" && !png || data.imageMimeType === "image/jpeg" && !jpeg) throw new Error("The selected file is not a valid image");
	}
	if (data.id) {
		if (image) await execute("UPDATE certificate_items SET title = ?, issuer = ?, category = ?, credential_date = ?, alt_text = ?, image_path = NULL, image_mime_type = ?, image_data = ?, image_version = ?, homepage_featured = ?, published = ?, sort_order = ? WHERE id = ? AND collection = 'certificates'", [
			data.title,
			data.issuer,
			data.category,
			data.credentialDate,
			data.altText,
			data.imageMimeType,
			image,
			Date.now(),
			data.homepageFeatured ? 1 : 0,
			data.published ? 1 : 0,
			data.sortOrder,
			data.id
		]);
		else await execute("UPDATE certificate_items SET title = ?, issuer = ?, category = ?, credential_date = ?, alt_text = ?, homepage_featured = ?, published = ?, sort_order = ? WHERE id = ? AND collection = 'certificates'", [
			data.title,
			data.issuer,
			data.category,
			data.credentialDate,
			data.altText,
			data.homepageFeatured ? 1 : 0,
			data.published ? 1 : 0,
			data.sortOrder,
			data.id
		]);
	} else await execute("INSERT INTO certificate_items (collection, title, issuer, category, credential_date, alt_text, image_mime_type, image_data, image_version, homepage_featured, published, sort_order) VALUES ('certificates', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
		data.title,
		data.issuer,
		data.category,
		data.credentialDate,
		data.altText,
		data.imageMimeType,
		image,
		image ? Date.now() : 0,
		data.homepageFeatured ? 1 : 0,
		data.published ? 1 : 0,
		data.sortOrder
	]);
	return { ok: true };
});
var deleteCertificate_createServerFn_handler = createServerRpc({
	id: "c16781502dffbbc44d5d70bde7fc33a394a6ae6f7578c8515d34271ff3b1fce7",
	name: "deleteCertificate",
	filename: "src/lib/admin-functions.ts"
}, (opts) => deleteCertificate.__executeServer(opts));
var deleteCertificate = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(deleteCertificate_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "content");
	await execute("DELETE FROM certificate_items WHERE id = ? AND collection = 'certificates'", [data.id]);
	return { ok: true };
});
var updateSettings_createServerFn_handler = createServerRpc({
	id: "55313ac1556d02d085bd7c69c29cd3691075d6bcaaa8b00941bbff11bbed3b7e",
	name: "updateSettings",
	filename: "src/lib/admin-functions.ts"
}, (opts) => updateSettings.__executeServer(opts));
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
}).handler(updateSettings_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "settings");
	await execute("UPDATE site_settings SET popup_enabled = ?, popup_delay_seconds = ?, whatsapp_enabled = ?, approvals_marquee_enabled = ?, public_settings_json = ? WHERE id = 1", [
		data.popupEnabled ? 1 : 0,
		data.popupDelaySeconds,
		data.whatsappEnabled ? 1 : 0,
		data.approvalsMarqueeEnabled ? 1 : 0,
		data.publicSettingsJson
	]);
	return { ok: true };
});
var saveContactDetails_createServerFn_handler = createServerRpc({
	id: "1f9b74db8fc24712f43f35dc60e61771ad7982f199032a04bf4d863e328bdd19",
	name: "saveContactDetails",
	filename: "src/lib/admin-functions.ts"
}, (opts) => saveContactDetails.__executeServer(opts));
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
}).handler(saveContactDetails_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "settings");
	const rows = await queryRows("SELECT public_settings_json FROM site_settings WHERE id = 1 LIMIT 1");
	const current = readSiteSettings(rows[0]);
	const publicSettings = {
		phones: data.phones,
		emails: data.emails,
		officeHours: data.officeHours,
		faqs: current.faqs,
		trustStats: current.trustStats
	};
	await execute("UPDATE site_settings SET public_settings_json = ? WHERE id = 1", [JSON.stringify(publicSettings)]);
	return {
		phones: data.phones,
		emails: data.emails,
		officeHours: data.officeHours
	};
});
var saveTrustStat_createServerFn_handler = createServerRpc({
	id: "2af8d8d7c0d71d21e4776db91e9724944518b2b113519e8babcf14e06fa0e62f",
	name: "saveTrustStat",
	filename: "src/lib/admin-functions.ts"
}, (opts) => saveTrustStat.__executeServer(opts));
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
}).handler(saveTrustStat_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "settings");
	const rows = await queryRows("SELECT public_settings_json FROM site_settings WHERE id = 1 LIMIT 1");
	const current = readSiteSettings(rows[0]);
	const trustStats = [...current.trustStats];
	if (data.action === "save") {
		if (data.index > trustStats.length) throw new Error("The trust numbers changed. Reload settings and try again.");
		if (data.index === trustStats.length) {
			if (trustStats.length >= 6) throw new Error("You can show up to six homepage trust numbers.");
			trustStats.push(data.trustStat);
		} else trustStats[data.index] = data.trustStat;
	} else {
		if (data.index >= trustStats.length) throw new Error("This trust number is no longer available. Reload settings and try again.");
		if (trustStats.length <= 1) throw new Error("Keep at least one homepage trust number.");
		trustStats.splice(data.index, 1);
	}
	const publicSettings = {
		phones: current.phones,
		emails: current.emails,
		officeHours: current.officeHours,
		faqs: current.faqs,
		trustStats
	};
	await execute("UPDATE site_settings SET public_settings_json = ? WHERE id = 1", [JSON.stringify(publicSettings)]);
	return { trustStats };
});
var saveFaq_createServerFn_handler = createServerRpc({
	id: "1069b7583e576da249b8ac3355278fca4fd5bedc13efea80d549f94a5aadf7b0",
	name: "saveFaq",
	filename: "src/lib/admin-functions.ts"
}, (opts) => saveFaq.__executeServer(opts));
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
}).handler(saveFaq_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "settings");
	const rows = await queryRows("SELECT public_settings_json FROM site_settings WHERE id = 1 LIMIT 1");
	const current = readSiteSettings(rows[0]);
	const faqs = [...current.faqs];
	if (data.action === "save") {
		if (data.index > faqs.length) throw new Error("This FAQ list changed. Reload the settings and try again.");
		if (data.index === faqs.length) faqs.push(data.faq);
		else faqs[data.index] = data.faq;
	} else {
		if (data.index >= faqs.length) throw new Error("This FAQ is no longer available. Reload the settings and try again.");
		if (faqs.length <= 1) throw new Error("Keep at least one homepage FAQ.");
		faqs.splice(data.index, 1);
	}
	const publicSettings = {
		phones: current.phones,
		emails: current.emails,
		officeHours: current.officeHours,
		faqs,
		trustStats: current.trustStats
	};
	await execute("UPDATE site_settings SET public_settings_json = ? WHERE id = 1", [JSON.stringify(publicSettings)]);
	return { faqs };
});
var saveCashflow_createServerFn_handler = createServerRpc({
	id: "8a86220c9bc907d23b41b8c2d3864ed060bc59c7caaa9602630e8c140ad10d26",
	name: "saveCashflow",
	filename: "src/lib/admin-functions.ts"
}, (opts) => saveCashflow.__executeServer(opts));
var saveCashflow = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	if (!Array.isArray(input.cashflowData) || input.cashflowData.length === 0) throw new Error("Cashflow data is required");
	const cashflowJson = JSON.stringify(input.cashflowData);
	if (cashflowJson.length > 5e5) throw new Error("Cashflow data is too large");
	return { cashflowJson };
}).handler(saveCashflow_createServerFn_handler, async ({ data, context }) => {
	if (context.role !== "super_admin") throw new Error("Only a super admin can update cashflow");
	await execute("UPDATE site_settings SET cashflow_json = ? WHERE id = 1", [data.cashflowJson]);
	return { ok: true };
});
var getAdminCashflow_createServerFn_handler = createServerRpc({
	id: "fbda677f961f87fbff0df45aa1862a016d8f4b377d401fb4f7da96872e59e1b7",
	name: "getAdminCashflow",
	filename: "src/lib/admin-functions.ts"
}, (opts) => getAdminCashflow.__executeServer(opts));
var getAdminCashflow = createServerFn({ method: "GET" }).middleware([adminMiddleware]).handler(getAdminCashflow_createServerFn_handler, async ({ context }) => {
	if (context.role !== "super_admin") throw new Error("Only a super admin can view cashflow settings");
	const raw = (await queryRows("SELECT cashflow_json FROM site_settings WHERE id = 1 LIMIT 1"))[0]?.cashflow_json;
	if (typeof raw !== "string" || !raw.trim()) return defaultCashflowData;
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.length > 0 ? mergeNewCashflowDestinations(parsed) : defaultCashflowData;
	} catch {
		return defaultCashflowData;
	}
});
var saveAdminUser_createServerFn_handler = createServerRpc({
	id: "8ed346d021f8c1b267a71fb35cfb838fe5ed76b57384c3c2919bf8607c3040b4",
	name: "saveAdminUser",
	filename: "src/lib/admin-functions.ts"
}, (opts) => saveAdminUser.__executeServer(opts));
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
}).handler(saveAdminUser_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "users");
	const { hashPassword } = await import("./site-settings-DNyZ2OvY.mjs").then((n) => n.site_settings_DNyZ2OvY_exports).then((n) => n.auth_server_exports);
	const passHash = data.password ? hashPassword(data.password) : null;
	if ((await queryRows("SELECT * FROM admin_users WHERE LOWER(email) = ? LIMIT 1", [data.email])).length > 0) {
		if (passHash) await execute("UPDATE admin_users SET name = ?, role = ?, password_hash = ? WHERE LOWER(email) = ?", [
			data.name,
			data.role,
			passHash,
			data.email
		]);
		else await execute("UPDATE admin_users SET name = ?, role = ? WHERE LOWER(email) = ?", [
			data.name,
			data.role,
			data.email
		]);
	} else {
		if (!passHash) throw new Error("Password is required for new staff account");
		try {
			await execute("INSERT INTO admin_users (open_id, email, name, role, password_hash) VALUES (?, ?, ?, ?, ?)", [
				`email:${data.email}`,
				data.email,
				data.name,
				data.role,
				passHash
			]);
		} catch {
			await execute("INSERT INTO admin_users (email, name, role, password_hash) VALUES (?, ?, ?, ?)", [
				data.email,
				data.name,
				data.role,
				passHash
			]);
		}
	}
	return { ok: true };
});
var deleteAdminUser_createServerFn_handler = createServerRpc({
	id: "3b946289294a2951af82164372e0d0a3ef43d95ff26b509e80b84ddcd23c49ec",
	name: "deleteAdminUser",
	filename: "src/lib/admin-functions.ts"
}, (opts) => deleteAdminUser.__executeServer(opts));
var deleteAdminUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ openId: stringValue(data?.openId, 190) })).handler(deleteAdminUser_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "users");
	if (data.openId === context.user.openId || data.openId === `email:${context.user.email}`) throw new Error("You cannot remove your own active account");
	try {
		await execute("DELETE FROM admin_users WHERE open_id = ? OR LOWER(email) = ?", [data.openId, data.openId.replace("email:", "").toLowerCase()]);
	} catch {
		await execute("DELETE FROM admin_users WHERE LOWER(email) = ?", [data.openId.replace("email:", "").toLowerCase()]);
	}
	return { ok: true };
});
export { addEnquiryActivity_createServerFn_handler, deleteAdminUser_createServerFn_handler, deleteBatch_createServerFn_handler, deleteCertificate_createServerFn_handler, deleteEnquiryActivity_createServerFn_handler, deleteEnquiry_createServerFn_handler, deletePost_createServerFn_handler, deleteStory_createServerFn_handler, exportEnquiries_createServerFn_handler, getAdminCashflow_createServerFn_handler, getAdminSnapshot_createServerFn_handler, saveAdminUser_createServerFn_handler, saveBatch_createServerFn_handler, saveCashflow_createServerFn_handler, saveCertificate_createServerFn_handler, saveContactDetails_createServerFn_handler, saveFaq_createServerFn_handler, savePost_createServerFn_handler, saveStory_createServerFn_handler, saveTrustStat_createServerFn_handler, updateEnquiryActivity_createServerFn_handler, updateEnquiry_createServerFn_handler, updateSettings_createServerFn_handler };
