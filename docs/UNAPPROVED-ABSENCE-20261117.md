# Unapproved absence visibility — 17 November 2026

Source review found completed-shift absence intervals already persist in breaks_json and are deducted through merged interval calculation. The UI called those intervals generic breaks, did not show a distinct absence marker and did not load a saved-interval list into the edit dialog. A completed shift can correctly remain Present when remaining net hours meet its threshold; absence does not mean full-day Absent.

Added a shared SavedAbsences view in daily table and Edit dialog, with saved IST departure/return and reason, a distinct Unapproved absence badge independent of Present/Half Day, and explicit net work/deduction information. Edit fields are labeled Add unapproved absence; saved intervals are read-only evidence rather than a blank form that appears unsaved. Save feedback confirms net hours and resulting status. The returned row is placed in panel state immediately before snapshot refresh.

Added MySQL regression assertions for completed shifts: mutation -> snapshot re-read -> two overlapping saved intervals retained -> merged 180-minute deduction -> ordinary re-save preserves intervals. Existing tests cover open-shift absence and eventual OUT. No payroll formula, production record, original evidence or authorization change.

Typecheck and preview CI validate the change. Real authenticated browser reproduction was unavailable; this report does not claim the user's exact runtime failure was reproduced. If an interval is still absent after this update, capture the saved row and visible error using a disposable employee to distinguish validation, deployment or data issues.
