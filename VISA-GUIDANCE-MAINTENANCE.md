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

1. Review every item in `src/data/visa-guidance.ts` for the destination: fee rows, explanatory summary, requirements, caveat and source links.
2. Follow the official source links and check the current date-effective rules. Add or replace source links if the authority has moved its page.
3. Update `lastVerified` only after the whole country entry has been reviewed. Use the date the review was completed.
4. Keep the eligibility scoring review separate. `src/data/eligibility-rules.ts` controls the checker’s points, thresholds and country matches; update its `updatedAt` only when those rules have actually been reviewed and revised as needed.
5. In the same change, update the public page copy if it could imply a guarantee, and preserve the preliminary-guidance disclaimer on the eligibility results.
6. Record the source, date, changed value and reviewer in the pull request description so the next reviewer can see what was checked.
7. Deploy the branch to a preview and check the affected country page and eligibility result on mobile and desktop before merging to `main`.

## Current review note

On 31 October 2026, the Australia Student visa 500 base fee was checked against the Australian Department of Home Affairs page and updated from AUD 2,000 to AUD 2,500. The same official page reports rule changes effective 2 October 2026, so the country guidance now calls those out. The remaining country entries retain their prior verification dates until each is reviewed in a later monthly pass.
