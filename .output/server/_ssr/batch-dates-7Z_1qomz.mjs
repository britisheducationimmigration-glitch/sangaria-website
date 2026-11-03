// node_modules/.nitro/vite/services/ssr/assets/batch-dates-7Z_1qomz.js
function isValidBatchStartDate(value) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const date = /* @__PURE__ */ new Date(`${value}T00:00:00.000Z`);
	return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function todayInIndia(now) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(now);
	const part = (type) => parts.find((item) => item.type === type)?.value ?? "";
	return `${part("year")}-${part("month")}-${part("day")}`;
}
function getBatchDateStatus(starts, now = /* @__PURE__ */ new Date()) {
	if (!isValidBatchStartDate(starts)) return "needs-date";
	return starts < todayInIndia(now) ? "expired" : "upcoming";
}
function isBatchExpired(starts, now = /* @__PURE__ */ new Date()) {
	return getBatchDateStatus(starts, now) === "expired";
}
function formatBatchStartDate(starts) {
	if (!isValidBatchStartDate(starts)) return starts.trim() || "Date to be confirmed";
	const [year, month, day] = starts.split("-").map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	return new Intl.DateTimeFormat("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	}).format(date);
}
export { formatBatchStartDate, getBatchDateStatus, isBatchExpired, isValidBatchStartDate };
