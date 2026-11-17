# Attendance flags and portal branding — 17 November 2026

The Location checks card previously counted every in/out flag, including ADMIN_REVIEW_APPROVED, as a GPS/VPN issue. It now counts only actual location/network indicators: unusually precise GPS, foreign network country, IP/GPS mismatch and outside-office radius. This is a count of affected attendance records, not proof of VPN usage.

Raw audit codes are shown as readable badges. Admin approval is green; half-day checkout is neutral; indicators needing attention are amber. Reviewed automatic-checkout flags no longer keep a completed approved shift in Needs correction. Actual location evidence remains visible even after admin approval; missing OUT remains reviewable. Stored flags, GPS evidence, authorization and payroll are unchanged.

The shared existing Logo component now appears in the admin sidebar and employee attendance header (including unavailable-link state), using /img/logo.png. Existing root favicon already uses the same asset. This does not guarantee a WhatsApp/social preview refresh; those services cache previews and attendance pages remain private/noindex.

Read the supplied tailadmin-design.md in full. Retained its white surfaces, muted canvas, blue actions and semantic status colors; increased tiny attendance metadata text and added an explicit GPS/network disclaimer. No demo metrics, new chart library, fake notifications or unrelated theme redesign were added.

Validation: typecheck and site regressions pass locally; preview CI runs the full suite. Browser/device visual verification is not claimed. Additional worthwhile theme work: 12–14px secondary labels throughout other panels, consistent 40–44px controls, sticky table headers, keyboard drawer checks and narrow-screen card presentation. These require separate visual verification before a broader rollout.
