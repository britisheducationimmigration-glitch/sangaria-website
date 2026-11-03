import { TSS_SERVER_FUNCTION, createServerFn, getServerFnById } from "./ssr.mjs";
// node_modules/.nitro/vite/services/ssr/assets/public-functions-CqsoBxoJ.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var submitEnquiry = createServerFn({ method: "POST" }).validator(validateEnquiry).handler(createSsrRpc("a03d07227db12b383826e0fa92b2c8222ca6b2e11bcc485b1098bb2038a9a187"));
var getPublicContent = createServerFn({ method: "GET" }).handler(createSsrRpc("e2f4072ad03877a5d70f323d6a752ff07a9debb302d3a482a2babe9a67cb65a4"));
var getPublicCashflow = createServerFn({ method: "GET" }).handler(createSsrRpc("a8241b4b2e02f8c7f493172ed4aeab7a069b98c2dd6380d6c31e781abde47e41"));
var getCoachingContent = createServerFn({ method: "GET" }).handler(createSsrRpc("7558011d2551df00f141c4ee6621ab3738add90204213d6627b39f265f6df042"));
export { createSsrRpc, getCoachingContent, getPublicCashflow, getPublicContent, submitEnquiry };
