import { createMiddleware, createServerFn } from "./ssr.mjs";
import { execute, jsonArray, queryRows } from "./db.server-CEhaHsNY.mjs";
import { createServerRpc } from "./createServerRpc--Tf39wPN.mjs";
// node_modules/.nitro/vite/services/ssr/assets/admin-functions-0Uv72cy_.js
function stringValue(value, max = 5e3) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function numberValue(value, fallback = 0) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}
var defaultSettings = {
	popupEnabled: true,
	popupDelaySeconds: 8,
	whatsappEnabled: true,
	approvalsMarqueeEnabled: true
};
var adminMiddleware = createMiddleware().server(async ({ next, request }) => {
	const { ensureAdminRecord, getAdminRole, getSessionUser } = await import("./db.server-CEhaHsNY.mjs").then((n) => n.db_server_CEhaHsNY_exports).then((n) => n.auth_server_exports);
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
function mapEnquiry(row) {
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
var getAdminSnapshot_createServerFn_handler = createServerRpc({
	id: "bc6628e955d62f88a1c7e7355e3d11a03f725e72aea8b4ac892b92deda6d57a7",
	name: "getAdminSnapshot",
	filename: "src/lib/admin-functions.ts"
}, (opts) => getAdminSnapshot.__executeServer(opts));
var getAdminSnapshot = createServerFn({ method: "GET" }).middleware([adminMiddleware]).handler(getAdminSnapshot_createServerFn_handler, async ({ context }) => {
	const [enquiryRows, postRows, storyRows, settingsRows, userRows, statRows, batchRows] = await Promise.all([
		context.role === "content_editor" ? Promise.resolve([]) : queryRows("SELECT id, name, phone, email, city, interest, country, message, source, summary, status, notes, assigned_to, next_follow_up_at, created_at, updated_at FROM enquiries ORDER BY created_at DESC LIMIT 150"),
		context.role === "enquiry_manager" ? Promise.resolve([]) : queryRows("SELECT * FROM content_posts ORDER BY publish_date DESC, id DESC LIMIT 100"),
		context.role === "enquiry_manager" ? Promise.resolve([]) : queryRows("SELECT * FROM success_stories ORDER BY story_date DESC, id DESC LIMIT 100"),
		context.role === "super_admin" ? queryRows("SELECT popup_enabled, popup_delay_seconds, whatsapp_enabled, approvals_marquee_enabled FROM site_settings WHERE id = 1 LIMIT 1") : Promise.resolve([]),
		context.role === "super_admin" ? queryRows("SELECT * FROM admin_users ORDER BY email ASC") : Promise.resolve([]),
		context.role === "content_editor" ? Promise.resolve([]) : queryRows(`SELECT COUNT(*) AS total, SUM(status = 'New') AS new_count, SUM(status IN ('Follow-up', 'Documents Pending', 'Applied')) AS follow_ups, SUM(status = 'Converted') AS converted, SUM(next_follow_up_at IS NOT NULL AND DATE(next_follow_up_at) = CURRENT_DATE() AND status NOT IN ('Converted', 'Closed')) AS due_today FROM enquiries`),
		context.role === "enquiry_manager" ? Promise.resolve([]) : queryRows("SELECT id, program, batch_name, time_slot, seats, starts, published FROM coaching_batches ORDER BY id ASC")
	]);
	const stats = statRows[0] ?? {};
	return {
		user: {
			name: context.user.name,
			email: context.user.email,
			role: context.role
		},
		enquiries: enquiryRows.map(mapEnquiry),
		posts: postRows.map(mapAdminPost),
		stories: storyRows.map(mapAdminStory),
		settings: mapSettings(settingsRows[0]),
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
			converted: Number(stats.converted ?? 0)
		},
		batches: batchRows.map(mapBatch)
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
		notes: stringValue(input.notes, 5e3),
		assignedTo: stringValue(input.assignedTo, 190),
		nextFollowUpAt: followUp ? followUp.replace("T", " ") : null
	};
}).handler(updateEnquiry_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "enquiries");
	await execute("UPDATE enquiries SET status = ?, notes = ?, assigned_to = ?, next_follow_up_at = ? WHERE id = ?", [
		data.status,
		data.notes,
		data.assignedTo,
		data.nextFollowUpAt,
		data.id
	]);
	return { ok: true };
});
var deleteEnquiry_createServerFn_handler = createServerRpc({
	id: "15e52c03393ad28b1a823939164c2c0bf525a268f8cdb7b695a0502ff5f29081",
	name: "deleteEnquiry",
	filename: "src/lib/admin-functions.ts"
}, (opts) => deleteEnquiry.__executeServer(opts));
var deleteEnquiry = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(deleteEnquiry_createServerFn_handler, async ({ data, context }) => {
	if (context.role !== "super_admin") throw new Error("Only a super admin can delete enquiries");
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
		published: Boolean(input.published)
	};
}).handler(saveStory_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "content");
	if (data.id) await execute("UPDATE success_stories SET kind = ?, name = ?, city = ?, country = ?, visa = ?, quote = ?, rating = ?, initials = ?, flag = ?, story_date = ?, note = ?, published = ? WHERE id = ?", [
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
		data.published ? 1 : 0,
		data.id
	]);
	else await execute("INSERT INTO success_stories (kind, name, city, country, visa, quote, rating, initials, flag, story_date, note, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
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
		data.published ? 1 : 0
	]);
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
	if (!program || !batch) throw new Error("Program and batch name are required");
	return {
		id: numberValue(input.id),
		program,
		batch,
		time: stringValue(input.time, 160),
		seats: Math.max(0, Math.min(999, numberValue(input.seats, 0))),
		starts: stringValue(input.starts, 80),
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
var updateSettings_createServerFn_handler = createServerRpc({
	id: "55313ac1556d02d085bd7c69c29cd3691075d6bcaaa8b00941bbff11bbed3b7e",
	name: "updateSettings",
	filename: "src/lib/admin-functions.ts"
}, (opts) => updateSettings.__executeServer(opts));
var updateSettings = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	return {
		popupEnabled: Boolean(input.popupEnabled),
		popupDelaySeconds: Math.min(60, Math.max(3, numberValue(input.popupDelaySeconds, 8))),
		whatsappEnabled: Boolean(input.whatsappEnabled),
		approvalsMarqueeEnabled: Boolean(input.approvalsMarqueeEnabled)
	};
}).handler(updateSettings_createServerFn_handler, async ({ data, context }) => {
	assertCapability(context.role, "settings");
	await execute("UPDATE site_settings SET popup_enabled = ?, popup_delay_seconds = ?, whatsapp_enabled = ?, approvals_marquee_enabled = ? WHERE id = 1", [
		data.popupEnabled ? 1 : 0,
		data.popupDelaySeconds,
		data.whatsappEnabled ? 1 : 0,
		data.approvalsMarqueeEnabled ? 1 : 0
	]);
	return { ok: true };
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
	const { hashPassword } = await import("./db.server-CEhaHsNY.mjs").then((n) => n.db_server_CEhaHsNY_exports).then((n) => n.auth_server_exports);
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
export { deleteAdminUser_createServerFn_handler, deleteBatch_createServerFn_handler, deleteEnquiry_createServerFn_handler, deletePost_createServerFn_handler, deleteStory_createServerFn_handler, exportEnquiries_createServerFn_handler, getAdminSnapshot_createServerFn_handler, saveAdminUser_createServerFn_handler, saveBatch_createServerFn_handler, savePost_createServerFn_handler, saveStory_createServerFn_handler, updateEnquiry_createServerFn_handler, updateSettings_createServerFn_handler };
