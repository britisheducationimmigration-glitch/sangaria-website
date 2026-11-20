// src/components/admin/StudyPlanPanel.tsx
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Globe2,
  Plus,
  Trash2,
  Undo2,
} from "lucide-react";
import { getAdminCountryPages, saveCountryPage } from "@/lib/admin-functions";
import type {
  StudyPlan,
  StudyPlanChecklistItem,
  StudyPlanTimelineStep,
} from "@/data/fixtures";
import type { CountryPageContent } from "@/lib/country-catalog.server";

type PanelData = {
  countries: CountryPageContent[];
  drafts: CountryPageContent[];
  customSlugs: string[];
  overrideSlugs: string[];
};

const categories = [
  "Admission",
  "Identity",
  "Education",
  "Funds",
  "Application",
  "Additional checks",
  "After submission",
];
const statuses: StudyPlanChecklistItem["status"][] = [
  "Required",
  "Usually required",
  "Recommended",
  "If applicable",
  "After submission",
];
const blankPlan = (): StudyPlan => ({
  lastVerified: "",
  summary: "",
  checklist: [],
  timeline: [],
  sources: [],
});

function ConfirmRemoveButton({
  itemLabel,
  onConfirm,
}: {
  itemLabel: string;
  onConfirm: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
      >
        <Trash2 className="size-3" /> Remove
      </button>
    );
  }
  return (
    <div
      role="alert"
      className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs text-rose-900"
    >
      <span>Remove "{itemLabel}"?</span>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded border border-[#E4E7EC] bg-white px-2 py-0.5 font-semibold text-[#344054]"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="rounded bg-rose-600 px-2 py-0.5 font-semibold text-white"
      >
        Yes
      </button>
    </div>
  );
}

function PlanField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  required,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  return (
    <label className="block min-w-0 text-xs font-semibold text-[#344054]">
      {label}
      {required ? " *" : ""}
      {multiline ? (
        <textarea
          required={required}
          rows={2}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.currentTarget.value)}
          className="mt-1 block min-h-[60px] w-full rounded-xl border border-[#E4E7EC] bg-white p-2.5 text-xs text-[#1D2939] focus:border-[#465FFF] focus:outline-none"
        />
      ) : (
        <input
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.currentTarget.value)}
          className="mt-1 block h-9 w-full rounded-xl border border-[#E4E7EC] bg-white px-2.5 text-xs text-[#1D2939] focus:border-[#465FFF] focus:outline-none"
        />
      )}
      {hint && (
        <span className="mt-0.5 block text-[11px] font-normal text-[#667085]">
          {hint}
        </span>
      )}
    </label>
  );
}

function DocumentCards({
  items,
  onChange,
  onSave,
  saving,
}: {
  items: StudyPlanChecklistItem[];
  onChange: (items: StudyPlanChecklistItem[]) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  function addDocument() {
    const item = {
      id: "study-" + Date.now() + "-" + items.length,
      category: "Admission",
      title: "",
      detail: "",
      status: "Usually required" as const,
    };
    setOpenId(item.id);
    onChange([...items, item]);
  }
  function update(index: number, patch: Partial<StudyPlanChecklistItem>) {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }
  return (
    <section className="rounded-2xl border border-[#E4E7EC] bg-white p-4">
      <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3">
        <h3 className="text-sm font-bold text-[#1D2939]">
          Required Documents{" "}
          <span className="font-mono text-xs font-semibold text-[#667085]">
            ({items.length})
          </span>
        </h3>
        <button
          type="button"
          onClick={addDocument}
          className="inline-flex min-h-8 items-center gap-1 rounded-xl border border-[#E4E7EC] bg-white px-2.5 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB]"
        >
          <Plus className="size-3 text-[#465FFF]" /> Add document
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <details
            key={item.id}
            open={openId === item.id}
            onToggle={(e) =>
              setOpenId(
                e.currentTarget.open
                  ? item.id
                  : (cur) => (cur === item.id ? null : cur),
              )
            }
            className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB]"
          >
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-xs font-semibold text-[#1D2939]">
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-[#667085] font-mono">{index + 1}.</span>
                <span className="truncate">{item.title || "New document"}</span>
                <span className="rounded bg-[#ECF3FF] px-1.5 py-0.5 text-[10px] text-[#465FFF]">
                  {item.status}
                </span>
              </span>
              <span className="text-xs text-[#465FFF]">
                {openId === item.id ? "Close" : "Edit"}
              </span>
            </summary>
            <div className="grid gap-3 border-t border-[#E4E7EC] bg-white p-3">
              <PlanField
                label="Document name"
                value={item.title}
                required
                hint="Example: Parents’ ITRs — past 2 years"
                onChange={(title) => update(index, { title })}
              />
              <PlanField
                label="Collection instructions"
                value={item.detail}
                required
                multiline
                hint="Who issues this and date validity range."
                onChange={(detail) => update(index, { detail })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-[#344054]">
                  Group
                  <select
                    value={item.category}
                    onChange={(e) =>
                      update(index, { category: e.currentTarget.value })
                    }
                    className="mt-1 block h-8 w-full rounded-lg border border-[#E4E7EC] bg-white px-2 text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-[#344054]">
                  Requirement status
                  <select
                    value={item.status}
                    onChange={(e) =>
                      update(index, {
                        status: e.currentTarget
                          .value as StudyPlanChecklistItem["status"],
                      })
                    }
                    className="mt-1 block h-8 w-full rounded-lg border border-[#E4E7EC] bg-white px-2 text-xs"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#F2F4F7]">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void onSave()}
                  className="min-h-8 rounded-lg border border-[#E4E7EC] px-3 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save draft"}
                </button>
                <ConfirmRemoveButton
                  itemLabel={item.title || "this document"}
                  onConfirm={() => {
                    if (openId === item.id) setOpenId(null);
                    onChange(items.filter((_, i) => i !== index));
                  }}
                />
              </div>
            </div>
          </details>
        ))}
        {!items.length && (
          <p className="rounded-xl border border-dashed border-[#D0D5DD] p-4 text-center text-xs text-[#667085]">
            No checklist items yet. Click "+ Add document" to begin.
          </p>
        )}
      </div>
    </section>
  );
}

function TimelineCards({
  items,
  onChange,
  onSave,
  saving,
}: {
  items: StudyPlanTimelineStep[];
  onChange: (items: StudyPlanTimelineStep[]) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  function update(index: number, patch: Partial<StudyPlanTimelineStep>) {
    onChange(
      items.map((item, i) =>
        i === index
          ? {
              ...item,
              ...patch,
              weeks:
                "Week " + ((patch.weeksFromStart ?? item.weeksFromStart) + 1),
            }
          : item,
      ),
    );
  }
  return (
    <section className="rounded-2xl border border-[#E4E7EC] bg-white p-4">
      <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3">
        <h3 className="text-sm font-bold text-[#1D2939]">
          Timeline Steps{" "}
          <span className="font-mono text-xs font-semibold text-[#667085]">
            ({items.length})
          </span>
        </h3>
        <button
          type="button"
          onClick={() => {
            const w = Math.min(9, items.length * 2);
            setOpenIndex(items.length);
            onChange([
              ...items,
              {
                weeks: "Week " + (w + 1),
                weeksFromStart: w,
                title: "",
                detail: "",
              },
            ]);
          }}
          className="inline-flex min-h-8 items-center gap-1 rounded-xl border border-[#E4E7EC] bg-white px-2.5 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB]"
        >
          <Plus className="size-3 text-[#465FFF]" /> Add step
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <details
            key={index}
            open={openIndex === index}
            onToggle={(e) =>
              setOpenIndex(
                e.currentTarget.open
                  ? index
                  : (cur) => (cur === index ? null : cur),
              )
            }
            className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB]"
          >
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-xs font-semibold text-[#1D2939]">
              <span className="flex min-w-0 items-center gap-2">
                <span className="rounded bg-white border border-[#E4E7EC] px-1.5 py-0.5 font-mono text-[10px] text-[#465FFF]">
                  {item.weeks}
                </span>
                <span className="truncate">{item.title || "New step"}</span>
              </span>
              <span className="text-xs text-[#465FFF]">
                {openIndex === index ? "Close" : "Edit"}
              </span>
            </summary>
            <div className="grid gap-3 border-t border-[#E4E7EC] bg-white p-3">
              <label className="block text-xs font-semibold text-[#344054]">
                Start timing
                <select
                  value={item.weeksFromStart}
                  onChange={(e) =>
                    update(index, {
                      weeksFromStart: Number(e.currentTarget.value),
                    })
                  }
                  className="mt-1 block h-8 w-full rounded-lg border border-[#E4E7EC] bg-white px-2 text-xs"
                >
                  {Array.from({ length: 10 }, (_, w) => (
                    <option key={w} value={w}>
                      {w === 0
                        ? "This week"
                        : "In " + w + (w === 1 ? " week" : " weeks")}
                    </option>
                  ))}
                </select>
              </label>
              <PlanField
                label="Step title"
                value={item.title}
                required
                hint="e.g. University application submission"
                onChange={(title) => update(index, { title })}
              />
              <PlanField
                label="Student action notes"
                value={item.detail}
                required
                multiline
                hint="Clear instructions on what work can occur in parallel."
                onChange={(detail) => update(index, { detail })}
              />
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#F2F4F7]">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void onSave()}
                  className="min-h-8 rounded-lg border border-[#E4E7EC] px-3 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save draft"}
                </button>
                <ConfirmRemoveButton
                  itemLabel={item.title || "this step"}
                  onConfirm={() => {
                    setOpenIndex(null);
                    onChange(items.filter((_, i) => i !== index));
                  }}
                />
              </div>
            </div>
          </details>
        ))}
        {!items.length && (
          <p className="rounded-xl border border-dashed border-[#D0D5DD] p-4 text-center text-xs text-[#667085]">
            No timeline steps yet. Click "+ Add step" to begin.
          </p>
        )}
      </div>
    </section>
  );
}

function SourceCards({
  items,
  onChange,
  onSave,
  saving,
}: {
  items: { label: string; url: string }[];
  onChange: (items: { label: string; url: string }[]) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="rounded-2xl border border-[#E4E7EC] bg-white p-4">
      <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3">
        <h3 className="text-sm font-bold text-[#1D2939]">
          Official Embassy Portals{" "}
          <span className="font-mono text-xs font-semibold text-[#667085]">
            ({items.length})
          </span>
        </h3>
        <button
          type="button"
          onClick={() => {
            setOpenIndex(items.length);
            onChange([...items, { label: "", url: "" }]);
          }}
          className="inline-flex min-h-8 items-center gap-1 rounded-xl border border-[#E4E7EC] bg-white px-2.5 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB]"
        >
          <Plus className="size-3 text-[#465FFF]" /> Add link
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <details
            key={index}
            open={openIndex === index}
            onToggle={(e) =>
              setOpenIndex(
                e.currentTarget.open
                  ? index
                  : (cur) => (cur === index ? null : cur),
              )
            }
            className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB]"
          >
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-xs font-semibold text-[#1D2939]">
              <span className="flex min-w-0 items-center gap-2">
                <Globe2 className="size-3.5 text-[#465FFF]" />
                <span className="truncate">
                  {item.label || "New official link"}
                </span>
              </span>
              <span className="text-xs text-[#465FFF]">
                {openIndex === index ? "Close" : "Edit"}
              </span>
            </summary>
            <div className="grid gap-3 border-t border-[#E4E7EC] bg-white p-3 sm:grid-cols-[1fr_1.5fr_auto] sm:items-end">
              <PlanField
                label="Portal name"
                value={item.label}
                required
                placeholder="e.g. IRCC Canada Checklist"
                onChange={(label) =>
                  onChange(
                    items.map((s, i) => (i === index ? { ...s, label } : s)),
                  )
                }
              />
              <PlanField
                label="Direct URL"
                value={item.url}
                required
                placeholder="https://..."
                onChange={(url) =>
                  onChange(
                    items.map((s, i) => (i === index ? { ...s, url } : s)),
                  )
                }
              />
              <div className="flex items-center gap-2 pt-1 sm:pt-0">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void onSave()}
                  className="min-h-8 rounded-lg border border-[#E4E7EC] px-3 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save draft"}
                </button>
                <ConfirmRemoveButton
                  itemLabel={item.label || "this link"}
                  onConfirm={() => {
                    setOpenIndex(null);
                    onChange(items.filter((_, i) => i !== index));
                  }}
                />
              </div>
            </div>
          </details>
        ))}
        {!items.length && (
          <p className="rounded-xl border border-dashed border-[#D0D5DD] p-4 text-center text-xs text-[#667085]">
            No official links added yet. Click "+ Add link" to provide embassy
            references.
          </p>
        )}
      </div>
    </section>
  );
}

function withoutStudyPlan(entry: CountryPageContent) {
  const country = { ...entry.country };
  delete country.studyPlan;
  return JSON.stringify({ country, guidance: entry.guidance });
}

export function StudyPlanPanel({
  onDirtyChange,
}: {
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [data, setData] = useState<PanelData | null>(null);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [content, setContent] = useState<CountryPageContent | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const countryBySlug = useMemo(
    () =>
      new Map((data?.countries ?? []).map((i) => [i.country.slug, i] as const)),
    [data?.countries],
  );
  const draftBySlug = useMemo(
    () =>
      new Map((data?.drafts ?? []).map((i) => [i.country.slug, i] as const)),
    [data?.drafts],
  );
  const options = useMemo(() => {
    const rows = new Map<string, CountryPageContent>();
    for (const item of data?.countries ?? []) rows.set(item.country.slug, item);
    for (const item of data?.drafts ?? [])
      if (!rows.has(item.country.slug)) rows.set(item.country.slug, item);
    return Array.from(rows.values()).sort((a, b) =>
      a.country.name.localeCompare(b.country.name),
    );
  }, [data?.countries, data?.drafts]);

  async function reload(preferredSlug = selectedSlug) {
    setLoading(true);
    setError("");
    try {
      const next = await getAdminCountryPages();
      setData(next);
      const slug =
        preferredSlug ||
        next.countries[0]?.country.slug ||
        next.drafts[0]?.country.slug ||
        "";
      const sel =
        next.drafts.find((i) => i.country.slug === slug) ??
        next.countries.find((i) => i.country.slug === slug) ??
        null;
      setSelectedSlug(sel?.country.slug ?? "");
      setContent(sel);
      setDirty(false);
      onDirtyChange?.(false);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load study plans.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload("");
  }, []);

  function markDirty() {
    setDirty(true);
    onDirtyChange?.(true);
    setMessage("");
  }

  function chooseCountry(slug: string) {
    if (
      dirty &&
      !window.confirm(
        "Discard unsaved Study Plan changes and switch destination?",
      )
    )
      return;
    const sel = draftBySlug.get(slug) ?? countryBySlug.get(slug) ?? null;
    setSelectedSlug(slug);
    setContent(sel);
    setDirty(false);
    onDirtyChange?.(false);
    setMessage("");
    setError("");
  }

  function updatePlan(patch: Partial<StudyPlan>) {
    setContent((c) =>
      c
        ? {
            ...c,
            country: {
              ...c.country,
              studyPlan: { ...(c.country.studyPlan ?? blankPlan()), ...patch },
            },
          }
        : c,
    );
    markDirty();
  }

  function togglePlan(enabled: boolean) {
    setContent((c) =>
      c
        ? {
            ...c,
            country: {
              ...c.country,
              studyPlan: enabled ? (c.country.studyPlan ?? blankPlan()) : null,
            },
          }
        : c,
    );
    markDirty();
  }

  async function save(status: "draft" | "published") {
    if (!content) return;
    const published = countryBySlug.get(selectedSlug);
    const draft = draftBySlug.get(selectedSlug);
    if (status === "published" && !published) {
      setError("Publish country basic page in Countries tab first.");
      return;
    }
    if (
      status === "published" &&
      draft &&
      published &&
      withoutStudyPlan(draft) !== withoutStudyPlan(published)
    ) {
      setError(
        "This destination has other unpublished changes. Review them in Countries first.",
      );
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await saveCountryPage({ data: { content, status, isNew: !published } });
      setMessage(
        status === "published"
          ? "Study plan published live."
          : "Study plan draft saved.",
      );
      await reload(selectedSlug);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save study plan.",
      );
    } finally {
      setBusy(false);
    }
  }

  function discardChanges() {
    if (!content || !window.confirm("Discard unsaved Study Plan changes?"))
      return;
    setContent(
      draftBySlug.get(selectedSlug) ?? countryBySlug.get(selectedSlug) ?? null,
    );
    setDirty(false);
    onDirtyChange?.(false);
    setError("");
    setMessage("Changes discarded.");
  }

  const plan = content?.country.studyPlan ?? null;
  const published = countryBySlug.get(selectedSlug);
  const draft = draftBySlug.get(selectedSlug);
  const canPublish = Boolean(
    published &&
    !(
      draft &&
      published &&
      withoutStudyPlan(draft) !== withoutStudyPlan(published)
    ),
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-[#1D2939]">
          Study Plans & Checklists
        </h2>
        <p className="text-xs text-[#667085]">
          Manage step-by-step document requirements and intake timelines for
          students.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800"
        >
          <AlertCircle className="size-4 shrink-0" /> {error}
        </div>
      )}
      {message && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800"
        >
          <CheckCircle2 className="size-4 shrink-0" /> {message}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center text-xs text-[#667085]">
          Loading study plans…
        </div>
      ) : !options.length ? (
        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center text-xs text-[#667085]">
          No destinations found. Add and publish a country in the Countries tab
          first.
        </div>
      ) : (
        <>
          <div className="grid gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="block text-xs font-semibold text-[#344054]">
              Select Destination Country
              <select
                value={selectedSlug}
                onChange={(e) => chooseCountry(e.currentTarget.value)}
                className="mt-1.5 block h-10 w-full rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-xs font-semibold text-[#1D2939]"
              >
                {options.map((item) => (
                  <option key={item.country.slug} value={item.country.slug}>
                    {item.country.flag} {item.country.name}
                    {draftBySlug.has(item.country.slug) ? " · (Draft)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <span
              className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${draft ? "bg-amber-50 text-amber-700 border border-amber-200" : published ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-[#F2F4F7] text-[#667085]"}`}
            >
              {draft
                ? "Editing Draft"
                : published
                  ? "Live Published"
                  : "New Draft"}
            </span>
          </div>

          {content && (
            <div className="space-y-6">
              <div className="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E4E7EC] bg-white/95 p-3 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${dirty ? "bg-amber-50 border border-amber-200 text-amber-800 animate-pulse" : "bg-[#F2F4F7] text-[#667085]"}`}
                  >
                    {dirty ? "● Unsaved Changes" : "All changes saved"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!dirty || busy}
                    onClick={discardChanges}
                    className="min-h-9 rounded-xl border border-[#E4E7EC] bg-white px-3 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-40"
                  >
                    <Undo2 className="size-3.5 inline mr-1" /> Discard
                  </button>
                  <button
                    type="button"
                    disabled={!dirty || busy}
                    onClick={() => void save("draft")}
                    className="min-h-9 rounded-xl border border-[#E4E7EC] bg-white px-3 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-40"
                  >
                    {busy ? "Saving…" : "Save draft"}
                  </button>
                  <button
                    type="button"
                    disabled={!dirty || busy || !canPublish}
                    onClick={() => void save("published")}
                    className="min-h-9 rounded-xl bg-[#465FFF] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#3b52d4] disabled:opacity-40"
                  >
                    {busy ? "Publishing…" : "Publish Live"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E4E7EC] bg-white p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(plan)}
                    onChange={(e) => {
                      const en = e.currentTarget.checked;
                      if (
                        !en &&
                        !window.confirm("Disable study plan for this country?")
                      )
                        return;
                      togglePlan(en);
                    }}
                    className="size-4 rounded border-[#D0D5DD] text-[#465FFF]"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#1D2939]">
                      Enable Study Plan for {content.country.flag}{" "}
                      {content.country.name}
                    </p>
                    <p className="text-xs text-[#667085]">
                      Shows milestones and document requirements on public
                      country guidance.
                    </p>
                  </div>
                </label>
              </div>

              {plan && (
                <div className="space-y-6">
                  <div className="grid gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-4 sm:grid-cols-2">
                    <PlanField
                      label="Summary introduction"
                      value={plan.summary}
                      required
                      multiline
                      hint="1-2 sentences explaining roadmap."
                      onChange={(summary) => updatePlan({ summary })}
                    />
                    <PlanField
                      label="Last verified date"
                      value={plan.lastVerified}
                      required
                      hint="e.g. 15 November 2026"
                      onChange={(lastVerified) => updatePlan({ lastVerified })}
                    />
                  </div>
                  <DocumentCards
                    items={plan.checklist}
                    onChange={(checklist) => updatePlan({ checklist })}
                    onSave={() => save("draft")}
                    saving={busy}
                  />
                  <TimelineCards
                    items={plan.timeline}
                    onChange={(timeline) => updatePlan({ timeline })}
                    onSave={() => save("draft")}
                    saving={busy}
                  />
                  <SourceCards
                    items={plan.sources}
                    onChange={(sources) => updatePlan({ sources })}
                    onSave={() => save("draft")}
                    saving={busy}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
