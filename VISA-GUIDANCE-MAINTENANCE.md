# Visa guidance maintenance

This file is the review checklist for country visa information shown on country pages and in the eligibility checker.

## Review cadence

- Review fee rows, fee summaries, eligibility requirements and caveats at least once each month.
- Recheck sooner when an immigration authority announces a policy or fee change, and before publishing any related article or campaign.
- Do not describe the eligibility checker as using the “latest requirements” unless its scoring rules have been reviewed against current official sources.

## Source standard

Use the destination government's immigration authority, official fee table/calculator, legislation or embassy/consulate instructions as the source of truth. Third-party summaries may help identify a change but must not be used to set a fee or requirement.

For each country, check whether the amount or requirement depends on visa stream, applicant location, nationality, age, family members, concessions, levies or payment charges. Prefer an official estimator when the total varies by case; label a figure as “from” where the authority does.

## Update procedure

1. Review every item in `src/data/visa-guidance.ts` for the destination: fee rows, explanatory summary, requirements, caveat and source links. Also review the matching country summary in `src/data/fixtures.ts` so the headline, stats, highlights, tuition, living funds and English guidance do not conflict with the verified detail.
2. Follow the official source links and check the current date-effective rules. Add or replace source links if the authority has moved its page.
3. Update `lastVerified` only after the whole country entry has been reviewed. Use the date the review was completed.
4. Keep the eligibility scoring review separate. `src/data/eligibility-rules.ts` controls the checker’s points, thresholds and country matches; update its `updatedAt` only when those rules have actually been reviewed and revised as needed.
5. In the same change, update public page and article copy if it could imply a guarantee. Published articles may come from the `content_posts` database table; update that record as well as the matching fixture. For the Canada and UK corrections, the public read path applies reviewed copy only when the stored post exactly matches the known legacy text, so keep the database row and reviewed fixture aligned and confirm the review date and official source links appear on preview.
6. Record the source, date, changed value and reviewer in the pull request description so the next reviewer can see what was checked.
7. Deploy the branch to a preview and check the affected country page and eligibility result on mobile and desktop before merging to `main`.

## Current review note

On 31 October 2026, the Australia Student visa 500 base fee was checked against the Australian Department of Home Affairs page and updated from AUD 2,000 to AUD 2,500. The same official page reports rule changes effective 2 October 2026, so the country guidance now calls those out.

On 31 October 2026, the Canada and UK entries were reviewed against their official immigration sources. Canada’s one-person living-funds figure is CAD 23,448 for applications from 1 September 2026, excluding tuition and transport; the PAL/TAL exceptions and post-graduation work permit rules were clarified, and spouse open work permits are described as limited to eligible cases. The Student Direct Stream is no longer described as available. The UK Student route living-funds figures now show £1,171 outside London and £1,529 in London per month for up to 9 months, the Student visa fee is £558, and the Graduate Route copy gives the application-date cutoffs and doctoral exception. Both countries’ school-specific English guidance was corrected. See the official sources linked in `src/data/visa-guidance.ts`.

The eligibility checker’s factors, points and country thresholds were not changed. Its result labels now describe internal profile-checklist matches, and the page explains that these are not government criteria, legal eligibility decisions or approval predictions. The other destination entries retain their full-review dates until each complete country snapshot is reviewed. A change-specific official source check does not reset the full-country `lastVerified` date.


## Policy change calendar and automatic effective dates

\`src/data/policy-watch.ts\` is the code-managed source for confirmed changes, official announcements and items still awaiting detail. The Super Admin dashboard shows these records under **Policy watch**, including the effective date, what to review and the official source.

Only a change with an official effective date and exact published values is applied automatically. The UK Student maintenance figures are scheduled to change on 30 November 2026. The date-aware overlay covers the country guide, country comparison, visa fee/requirements snapshot, and database-backed public/admin cashflow reads. Before the date, the site shows the current figures and the scheduled figures; on or after the date, the new monthly figures and nine-month cashflow range become current. The overlay does not require a database migration and does not rewrite saved records.

Other items remain labelled as monitoring or proposals until official rules give an exact start date and requirements. In particular:

- Canada’s 150,000 new student-arrival target for 2027 is not the detailed study-permit application cap or a provincial allocation.
- The UK CEFR B2 rule from 26 March 2027 applies to settlement on specified routes; it is not a general Student visa English threshold.
- New Zealand’s 8 March 2027 Green List changes affect occupation-based Work to Residence routes, not the general student visa.
- UK Budget announcements with implementation detail still pending do not replace the current published route rules.
- Germany’s official 2026 study-funds figure does not establish a 2027 amount; do not estimate an increase.

On 3 November 2026, the official sources were checked for the UK 30 November maintenance increase, New Zealand’s 27 October student-rule changes, Australia’s 2 October student application/family rules, and 2027 policy notices relevant to Canada and New Zealand. The NZ study-funds card’s incorrect euro figure was corrected to NZD 20,000 per year. This pass covered core study-route requirements and announced changes; course-specific tuition, provider admission scores, intake calendars, nationality-specific exceptions and every non-study visa route still need their own source checks.
