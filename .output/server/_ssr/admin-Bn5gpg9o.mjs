import { __toESM } from "../_runtime.mjs";
import { require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { createMiddleware, createServerFn } from "./ssr.mjs";
import { createSsrRpc } from "./router-DkOd6TGA.mjs";
// node_modules/.nitro/vite/services/ssr/assets/admin-Bn5gpg9o.js
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
	const { ensureAdminRecord, getAdminRole, getSessionUser } = await import("./db.server-BhNUs5Hf.mjs").then((n) => n.db_server_BhNUs5Hf_exports).then((n) => n.auth_server_exports);
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
		notes: stringValue(input.notes, 5e3),
		assignedTo: stringValue(input.assignedTo, 190),
		nextFollowUpAt: followUp ? followUp.replace("T", " ") : null
	};
}).handler(createSsrRpc("ad3256a0430cdfd9e87e6fa51a6ece8bffd7173a5a185b348afdb93198753076"));
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
}).handler(createSsrRpc("d3c3c7bbca9f44251c98c9707a0d69e9f69f1dbde3a7c47cb711f579dd8e32d3"));
var deleteStory = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(createSsrRpc("af452889f2d809e70fa55e1914332b244af16ce42d7d603f28a3d490252fb6e0"));
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
}).handler(createSsrRpc("338861e369ff76d0d0164fb0eb7899292484abf75eed6c980ebff889b53346ba"));
var deleteBatch = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ id: numberValue(data?.id) })).handler(createSsrRpc("39063f423bb6527fc2fcb556617ff8623e0cafb94000f1e9e560720454a0e4b3"));
var updateSettings = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	return {
		popupEnabled: Boolean(input.popupEnabled),
		popupDelaySeconds: Math.min(60, Math.max(3, numberValue(input.popupDelaySeconds, 8))),
		whatsappEnabled: Boolean(input.whatsappEnabled),
		approvalsMarqueeEnabled: Boolean(input.approvalsMarqueeEnabled)
	};
}).handler(createSsrRpc("55313ac1556d02d085bd7c69c29cd3691075d6bcaaa8b00941bbff11bbed3b7e"));
var saveAdminUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => {
	const input = data ?? {};
	const email = stringValue(input.email, 190).toLowerCase();
	const role = stringValue(input.role, 30);
	if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email");
	if (![
		"super_admin",
		"content_editor",
		"enquiry_manager"
	].includes(role)) throw new Error("Choose a valid role");
	return {
		email,
		role,
		name: stringValue(input.name, 160) || email
	};
}).handler(createSsrRpc("8ed346d021f8c1b267a71fb35cfb838fe5ed76b57384c3c2919bf8607c3040b4"));
var deleteAdminUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator((data) => ({ openId: stringValue(data?.openId, 190) })).handler(createSsrRpc("3b946289294a2951af82164372e0d0a3ef43d95ff26b509e80b84ddcd23c49ec"));
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
		const haystack = `${item.name} ${item.phone} ${item.email} ${item.city} ${item.country} ${item.interest} ${item.status} ${item.assignedTo}`.toLowerCase();
		const created = item.createdAt.slice(0, 10);
		return haystack.includes(query.toLowerCase()) && (statusFilter === "All" || item.status === statusFilter) && (!dateFrom || created >= dateFrom) && (!dateTo || created <= dateTo);
	});
	const tabs = snapshot.user.role === "super_admin" ? [
		["enquiries", `Enquiries (${snapshot.enquiryStats.total})`],
		["news", "News & Updates"],
		["stories", "Success Stories"],
		["batches", "Coaching batches"],
		["settings", "Site settings"],
		["users", "Users & roles"]
	] : snapshot.user.role === "content_editor" ? [
		["news", "News & Updates"],
		["stories", "Success Stories"],
		["batches", "Coaching batches"]
	] : [["enquiries", `Enquiries (${snapshot.enquiries.length})`]];
	function showNotice(message) {
		setNotice(message);
		window.setTimeout(() => setNotice(""), 2800);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-cream text-forest-900",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-forest-900/10 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.2em] text-coral-600",
					children: "Owner dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold",
					children: "British Education & Immigration"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right text-xs text-forest-900/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: snapshot.user.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: snapshot.user.email }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-coral-600",
							children: roleLabels[snapshot.user.role]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowChangePass(true),
							className: "mr-3 font-bold text-forest-900 hover:text-coral-600",
							children: "Change password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/admin/oauth/logout",
							className: "font-bold text-coral-600",
							children: "Log out"
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-7xl px-5 py-8 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mb-8 flex gap-2 overflow-x-auto pb-2",
					"aria-label": "Admin sections",
					children: tabs.map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(value),
						className: `whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${tab === value ? "bg-forest-900 text-white" : "bg-white ring-1 ring-forest-900/10"}`,
						children: label
					}, value))
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
					canDelete: snapshot.user.role === "super_admin"
				}),
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
				tab === "batches" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchPanel, {
					items: snapshot.batches,
					selected: selectedBatch,
					onSelect: setSelectedBatch,
					onReload: reload,
					onNotice: showNotice
				}),
				tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {
					settings: snapshot.settings,
					onReload: reload,
					onNotice: showNotice
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
function AdminAuthCard({ onLoginSuccess }) {
	const [mode, setMode] = (0, import_react.useState)("login");
	const [identifier, setIdentifier] = (0, import_react.useState)("admin@britisheducationandimmigration.com");
	const [password, setPassword] = (0, import_react.useState)("");
	const [recoveryEmail, setRecoveryEmail] = (0, import_react.useState)("admin@britisheducationandimmigration.com");
	const [recoveryKey, setRecoveryKey] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)(null);
	async function handleLogin(e) {
		e.preventDefault();
		setBusy(true);
		setMessage(null);
		try {
			const res = await fetch("/admin/oauth/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					identifier,
					password
				})
			});
			const data = await res.json();
			if (!res.ok || !data.ok) throw new Error(data.error || "Invalid username or password");
			await onLoginSuccess();
		} catch (err) {
			setMessage({
				text: err instanceof Error ? err.message : "Login failed",
				type: "error"
			});
		} finally {
			setBusy(false);
		}
	}
	async function handleReset(e) {
		e.preventDefault();
		setBusy(true);
		setMessage(null);
		try {
			const res = await fetch("/admin/oauth/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "forgot",
					email: recoveryEmail,
					recoveryKey,
					newPassword
				})
			});
			const data = await res.json();
			if (!res.ok || !data.ok) throw new Error(data.error || "Password reset failed");
			setMessage({
				text: data.message || "Password updated successfully! Please sign in with your new password.",
				type: "success"
			});
			setMode("login");
			setPassword("");
		} catch (err) {
			setMessage({
				text: err instanceof Error ? err.message : "Reset failed",
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
					className: `flex-1 rounded-full py-2.5 transition ${mode === "login" ? "bg-coral-500 text-white shadow" : "text-forest-100/60 hover:text-white"}`,
					children: "Sign in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setMode("forgot");
						setMessage(null);
					},
					className: `flex-1 rounded-full py-2.5 transition ${mode === "forgot" ? "bg-coral-500 text-white shadow" : "text-forest-100/60 hover:text-white"}`,
					children: "Forgot password?"
				})]
			}),
			message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-5 rounded-2xl p-4 text-xs font-bold leading-relaxed ${message.type === "success" ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40" : "bg-red-500/20 text-red-300 ring-1 ring-red-500/40"}`,
				children: message.text
			}),
			mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleLogin,
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-forest-100/70 mb-1.5",
						children: "Username or Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: identifier,
						onChange: (e) => setIdentifier(e.target.value),
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:bg-white/20 focus:outline-none focus:ring-coral-400",
						placeholder: "admin@britisheducationandimmigration.com"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-forest-100/70",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setMode("forgot");
								setMessage(null);
							},
							className: "text-[11px] font-bold text-coral-400 hover:underline",
							children: "Forgot?"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						required: true,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:bg-white/20 focus:outline-none focus:ring-coral-400",
						placeholder: "Enter admin password"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "w-full mt-2 rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50",
						children: busy ? "Verifying…" : "Sign in to Dashboard →"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleReset,
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-forest-100/70",
						children: "Enter your admin email, the master Recovery Key (Security PIN), and your new password."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-forest-100/70 mb-1.5",
						children: "Admin Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						required: true,
						value: recoveryEmail,
						onChange: (e) => setRecoveryEmail(e.target.value),
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400",
						placeholder: "admin@britisheducationandimmigration.com"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-forest-100/70 mb-1.5",
						children: "Master Recovery Key (Security PIN)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: recoveryKey,
						onChange: (e) => setRecoveryKey(e.target.value),
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400",
						placeholder: "Enter your secret recovery key"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-forest-100/70 mb-1.5",
						children: "New Password (minimum 6 characters)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						required: true,
						minLength: 6,
						value: newPassword,
						onChange: (e) => setNewPassword(e.target.value),
						className: "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400",
						placeholder: "Enter new password"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "w-full mt-2 rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50",
						children: busy ? "Updating…" : "Reset & Save Password"
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							value: oldPassword,
							onChange: (e) => setOldPassword(e.target.value),
							className: "field",
							placeholder: "Enter current password"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-forest-900/70 mb-1",
							children: "New Password (min 6 characters)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							minLength: 6,
							value: newPassword,
							onChange: (e) => setNewPassword(e.target.value),
							className: "field",
							placeholder: "Enter new password"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-forest-900/70 mb-1",
							children: "Confirm New Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							minLength: 6,
							value: confirmPassword,
							onChange: (e) => setConfirmPassword(e.target.value),
							className: "field",
							placeholder: "Re-type new password"
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
function EnquiriesPanel({ enquiries, stats, query, setQuery, statusFilter, setStatusFilter, dateFrom, setDateFrom, dateTo, setDateTo, onReload, onNotice, canDelete }) {
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4",
			children: [enquiries.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryCard, {
				item,
				onReload,
				onNotice,
				canDelete
			}, item.id)), enquiries.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-white p-8 text-center text-forest-900/60",
				children: "No enquiries match these filters."
			})]
		})
	] });
}
function EnquiryCard({ item, onReload, onNotice, canDelete }) {
	const [status, setStatus] = (0, import_react.useState)(item.status);
	const [notes, setNotes] = (0, import_react.useState)(item.notes);
	const [assignedTo, setAssignedTo] = (0, import_react.useState)(item.assignedTo);
	const [nextFollowUpAt, setNextFollowUpAt] = (0, import_react.useState)(item.nextFollowUpAt ? item.nextFollowUpAt.slice(0, 16) : "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		setBusy(true);
		try {
			await updateEnquiry({ data: {
				id: item.id,
				status,
				notes,
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				className: "grid gap-2 lg:w-80",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: notes,
						onChange: (event) => setNotes(event.target.value),
						rows: 3,
						className: "field bg-cream",
						placeholder: "Counsellor notes"
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
		})
	});
}
function BatchPanel({ items, selected, onSelect, onReload, onNotice }) {
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
				onClick: () => onSelect({
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
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(item),
				className: `rounded-2xl bg-white p-4 text-left ring-1 ring-forest-900/10 transition hover:ring-forest-900 ${selected?.id === item.id ? "ring-2 ring-coral-500" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.batch }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-forest-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-forest-700",
						children: item.program
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-1 block text-xs text-forest-900/50",
					children: [
						item.time,
						" · ",
						item.starts,
						" · ",
						item.seats,
						" seats · ",
						item.published ? "Published" : "Hidden"
					]
				})]
			}, item.id))
		})] }), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchEditor, {
			item: selected,
			onReload,
			onNotice,
			onClose: () => onSelect(null)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid min-h-72 place-items-center rounded-3xl border border-dashed border-forest-900/20 p-8 text-center text-forest-900/50",
			children: "Select a batch or create a new one."
		})]
	});
}
function BatchEditor({ item, onReload, onNotice, onClose }) {
	const [form, setForm] = (0, import_react.useState)(item);
	const [busy, setBusy] = (0, import_react.useState)(false);
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
			await saveBatch({ data: form });
			await onReload();
			onNotice("Coaching batch saved.");
			onClose();
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
			await onReload();
			onNotice("Coaching batch deleted.");
			onClose();
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Seats left",
						hint: "Use 0 when full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							type: "number",
							min: "0",
							value: form.seats,
							onChange: (e) => update("seats", Number(e.target.value))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Starts on",
						hint: "Example: 1 December 2026",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: form.starts,
							onChange: (e) => update("starts", e.target.value),
							placeholder: "Start date / month"
						})
					})]
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
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryEditor, {
			item: selected,
			onReload,
			onNotice,
			onClose: () => onSelect(null)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: form.published,
						onChange: (e) => update("published", e.target.checked)
					}), " Publish on website"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						className: "rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white",
						children: "Save article"
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
function StoryEditor({ item, onReload, onNotice, onClose }) {
	const [form, setForm] = (0, import_react.useState)(item);
	const [busy, setBusy] = (0, import_react.useState)(false);
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
			await saveStory({ data: form });
			await onReload();
			onNotice("Success story saved.");
			onClose();
		} catch {
			onNotice("Could not save story. Check the fields.");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!form.id || !window.confirm("Delete this story?")) return;
		setBusy(true);
		try {
			await deleteStory({ data: { id: form.id } });
			await onReload();
			onNotice("Story deleted.");
			onClose();
		} catch {
			onNotice("Could not delete story.");
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
					children: "Success stories"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl font-extrabold",
					children: "Story editor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs leading-relaxed text-forest-900/55",
					children: "Use this for a visa approval or a client testimonial. Published entries appear on the Success Stories page and home page."
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Story type",
						hint: "Choose approval for a result card or testimonial for a client quote",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "field",
							value: form.kind,
							onChange: (e) => update("kind", e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "testimonial",
								children: "Client testimonial"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "approval",
								children: "Visa approval"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Person / family name",
						hint: "Example: Harpreet Kaur or Pooja & Family",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: form.name,
							onChange: (e) => update("name", e.target.value),
							placeholder: "Client name",
							required: true
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "City",
						hint: "Example: Sangaria",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: form.city,
							onChange: (e) => update("city", e.target.value),
							placeholder: "Client city"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Destination country",
						hint: "Example: Canada, United Kingdom or Australia",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: form.country,
							onChange: (e) => update("country", e.target.value),
							placeholder: "Country reached / applied to"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Visa / course",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: form.visa,
							onChange: (e) => update("visa", e.target.value),
							placeholder: "Study Permit, Student Visa, IELTS…"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Flag code / emoji (optional)",
						hint: "Optional; use CA, UK, AU or an emoji. The footer uses reliable code badges.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: form.flag,
							onChange: (e) => update("flag", e.target.value),
							placeholder: "CA or 🇨🇦"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Initials",
						hint: "Two letters shown on the story card; example: HK",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: form.initials,
							onChange: (e) => update("initials", e.target.value),
							placeholder: "HK"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
						label: "Approval / story date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							type: "date",
							value: form.date,
							onChange: (e) => update("date", e.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
					label: "Rating (1 to 5 stars)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						type: "number",
						min: "1",
						max: "5",
						value: form.rating,
						onChange: (e) => update("rating", Number(e.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
					label: "Client quote",
					hint: "Write the exact short testimonial. For an approval, describe the result in one or two sentences.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "field",
						rows: 6,
						value: form.quote,
						onChange: (e) => update("quote", e.target.value),
						placeholder: "My visa was approved..."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorField, {
					label: "Short result note",
					hint: "Example: Sept intake · Conestoga or MSc Data Science",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: form.note,
						onChange: (e) => update("note", e.target.value),
						placeholder: "Extra result detail shown on the card"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: form.published,
						onChange: (e) => update("published", e.target.checked)
					}), " Publish on website"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						className: "rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white",
						children: "Save story"
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
function SettingsPanel({ settings, onReload, onNotice }) {
	const [form, setForm] = (0, import_react.useState)(settings);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		setBusy(true);
		try {
			await updateSettings({ data: form });
			await onReload();
			onNotice("Site settings saved.");
		} catch {
			onNotice("Could not save settings.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-[0.18em] text-coral-600",
				children: "Controls"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-3xl font-extrabold",
				children: "Switch features on or off"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-forest-900/10",
				children: [
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
							onChange: (e) => setForm({
								...form,
								popupEnabled: e.target.checked
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
							onChange: (e) => setForm({
								...form,
								whatsappEnabled: e.target.checked
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
							onChange: (e) => setForm({
								...form,
								approvalsMarqueeEnabled: e.target.checked
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
						onChange: (e) => setForm({
							...form,
							popupDelaySeconds: Number(e.target.value)
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => void save(),
						className: "w-fit rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white",
						children: "Save settings"
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
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		setBusy(true);
		try {
			await saveAdminUser({ data: {
				email,
				name,
				role
			} });
			setEmail("");
			setName("");
			await onReload();
			onNotice("User role saved. They can now sign in with this email.");
		} catch (cause) {
			onNotice(cause instanceof Error ? cause.message : "Could not save user role.");
		} finally {
			setBusy(false);
		}
	}
	async function remove(openId) {
		if (!window.confirm("Remove this dashboard user?")) return;
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
		className: "grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-[0.18em] text-coral-600",
				children: "Access control"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-3xl font-extrabold",
				children: "Users & roles"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-forest-900/65",
				children: "Add an email before that person signs in. They use the owner login button and receive only the permissions assigned here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-forest-900/10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						type: "email",
						value: email,
						onChange: (event) => setEmail(event.target.value),
						placeholder: "User email",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: name,
						onChange: (event) => setName(event.target.value),
						placeholder: "Display name (optional)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field",
						value: role,
						onChange: (event) => setRole(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "content_editor",
								children: "Content Editor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "enquiry_manager",
								children: "Enquiry Manager"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "super_admin",
								children: "Super Admin"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-cream p-4 text-sm text-forest-900/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-forest-900",
							children: roleLabels[role]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: role === "super_admin" ? "Everything: enquiries, content, settings and user roles." : role === "content_editor" ? "Only News/Updates and Success Stories content." : "Only enquiry inbox, status/notes and CSV export."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy || !email,
						onClick: () => void save(),
						className: "w-fit rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50",
						children: "Save user role"
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy || user.email.toLowerCase() === currentEmail.toLowerCase(),
					onClick: () => void remove(user.openId),
					className: "w-fit rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-40",
					children: user.email.toLowerCase() === currentEmail.toLowerCase() ? "Current account" : "Remove"
				})]
			}, user.openId)), users.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-white p-6 text-center text-sm text-forest-900/60",
				children: "No provisioned users yet."
			})]
		})]
	});
}
export { AdminPage as component };
