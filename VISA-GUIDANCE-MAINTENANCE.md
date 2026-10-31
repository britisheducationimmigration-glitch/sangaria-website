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

The eligibility checker’s factors, points and country thresholds were not changed. Its result labels now describe internal profile-checklist matches, and the page explains that these are not government criteria, legal eligibility decisions or approval predictions. The rest of the country entries retain their prior verification dates until reviewed in a later monthly pass.
