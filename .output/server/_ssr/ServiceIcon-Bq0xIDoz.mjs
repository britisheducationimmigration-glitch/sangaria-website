import { require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { Briefcase, FileExclamationPoint, GraduationCap, House, Plane, Users } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/ServiceIcon-Bq0xIDoz.js
var import_jsx_runtime = require_jsx_runtime();
var map = {
	graduation: GraduationCap,
	briefcase: Briefcase,
	plane: Plane,
	home: House,
	users: Users,
	file: FileExclamationPoint
};
function ServiceIcon({ name, className }) {
	const Icon = map[name];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className });
}
export { ServiceIcon };
