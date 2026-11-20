// src/components/admin/CertificatePanel.tsx
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Award,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { deleteCertificate, saveCertificate } from "@/lib/admin-functions";
import type { AdminCertificate } from "@/lib/content-types";
type Draft = {
  id: number;
  title: string;
  issuer: string;
  category: string;
  credentialDate: string;
  altText: string;
  imageSrc: string;
  imageBase64: string;
  imageMimeType: string;
  homepageFeatured: boolean;
  published: boolean;
  sortOrder: number;
};

const emptyDraft = (): Draft => ({
  id: 0,
  title: "",
  issuer: "",
  category: "Partner authorisations",
  credentialDate: "",
  altText: "",
  imageSrc: "",
  imageBase64: "",
  imageMimeType: "",
  homepageFeatured: false,
  published: true,
  sortOrder: 1,
});

const CATEGORY_PRESETS = [
  "Partner authorisations",
  "Training & qualifications",
  "Recognition & events",
  "Student visa results",
  "IELTS & PTE results",
];

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-[#E4E7EC] bg-white px-3.5 text-sm text-[#1D2939] placeholder:text-[#98A2B3] focus:border-[#465FFF] focus:outline-none focus:ring-2 focus:ring-[#465FFF]/15";
const labelClass = "block text-xs font-semibold text-[#344054]";

async function compressImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare this image.");
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) =>
        value
          ? resolve(value)
          : reject(new Error("Could not compress this image.")),
      "image/webp",
      0.8,
    );
  });
  if (blob.size > 1.2 * 1024 * 1024)
    throw new Error("Image is still too large. Choose a smaller photo.");
  const imageSrc = URL.createObjectURL(blob);
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(blob);
  });
  return {
    imageSrc,
    imageBase64: dataUrl.split(",")[1] ?? "",
    imageMimeType: "image/webp",
  };
}

export function CertificatePanel({
  items,
  onReload,
  onNotice,
}: {
  items: AdminCertificate[];
  onReload: () => Promise<void>;
  onNotice: (message: string) => void;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const previewUrl = useRef("");

  useEffect(
    () => () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    },
    [],
  );

  function releasePreview() {
    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = "";
    }
  }

  function mayDiscard() {
    return !dirty || window.confirm("Discard unsaved certificate changes?");
  }

  function startNew() {
    if (!mayDiscard()) return;
    releasePreview();
    setDraft(emptyDraft());
    setDirty(false);
    setError("");
  }

  function startEdit(item: AdminCertificate) {
    if (!mayDiscard()) return;
    releasePreview();
    setDraft({
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      category: item.category,
      credentialDate: item.credentialDate,
      altText: item.altText,
      imageSrc: item.imageSrc,
      imageBase64: "",
      imageMimeType: "",
      homepageFeatured: item.homepageFeatured,
      published: item.published,
      sortOrder: item.sortOrder === 0 ? 1 : item.sortOrder,
    });
    setDirty(false);
    setError("");
  }

  function cancelEdit() {
    if (!mayDiscard()) return;
    releasePreview();
    setDraft(null);
    setDirty(false);
    setError("");
  }

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setDirty(true);
  }

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    try {
      const image = await compressImage(file);
      releasePreview();
      previewUrl.current = image.imageSrc;
      setDraft((current) => (current ? { ...current, ...image } : current));
      setDirty(true);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not prepare the image.",
      );
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      await saveCertificate({
        data: {
          id: draft.id,
          title: draft.title.trim(),
          issuer: draft.issuer.trim(),
          category: draft.category.trim(),
          credentialDate: draft.credentialDate.trim(),
          altText: draft.altText.trim() || draft.title.trim(),
          imageBase64: draft.imageBase64,
          imageMimeType: draft.imageMimeType,
          homepageFeatured: draft.homepageFeatured,
          published: draft.published,
          sortOrder: Math.max(1, draft.sortOrder || 1),
        },
      });
      releasePreview();
      setDraft(null);
      setDirty(false);
      onNotice(
        draft.published
          ? "Certificate published to website."
          : "Certificate saved as draft.",
      );
      await onReload();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save certificate.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: AdminCertificate) {
    if (
      !window.confirm(
        `Delete certificate "${item.title}"? Its public image and credentials will be removed.`,
      )
    )
      return;
    setBusy(true);
    try {
      await deleteCertificate({ data: { id: item.id } });
      onNotice("Certificate removed.");
      await onReload();
      if (draft?.id === item.id) {
        releasePreview();
        setDraft(null);
        setDirty(false);
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not remove certificate.",
      );
    } finally {
      setBusy(false);
    }
  }

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  }, [items]);

  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) => {
      const matchCat = filterCat === "All" || item.category === filterCat;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [sortedItems, filterCat, searchQuery]);

  return (
    <section aria-labelledby="admin-certificates-title" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[#ECF3FF] text-[#465FFF]">
              <Award className="size-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#465FFF]">
              Accreditations & Trust
            </span>
          </div>
          <h2
            id="admin-certificates-title"
            className="mt-1 text-2xl font-bold tracking-tight text-[#1D2939]"
          >
            Certificates & Partners
          </h2>
          <p className="mt-0.5 text-xs text-[#667085]">
            Manage institutional accreditations, Pearson/British Council
            partnerships, and award showcases.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#465FFF] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#3b52d4] active:scale-[0.99]"
        >
          <Plus className="size-4" /> Add certificate
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800"
        >
          {error}
        </div>
      )}

      {/* Editor Modal / Panel */}
      {draft && (
        <form
          onSubmit={submit}
          className="grid gap-6 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-start justify-between border-b border-[#F2F4F7] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#ECF3FF] px-2 py-0.5 text-[11px] font-semibold text-[#465FFF]">
                  {draft.id ? "Edit Mode" : "New Accreditation"}
                </span>
                {draft.published ? (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    Live on Website
                  </span>
                ) : (
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    Private Draft
                  </span>
                )}
              </div>
              <h3 className="mt-1 text-lg font-bold text-[#1D2939]">
                {draft.id
                  ? `Edit "${draft.title || "Certificate"}"`
                  : "Add New Certificate or Accreditation"}
              </h3>
            </div>
            <button
              type="button"
              onClick={cancelEdit}
              aria-label="Close editor"
              className="grid size-9 place-items-center rounded-xl border border-[#E4E7EC] text-[#667085] hover:bg-[#F9FAFB] hover:text-[#1D2939]"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Certificate / Award Title *
                    <input
                      required
                      maxLength={220}
                      value={draft.title}
                      placeholder="e.g. Authorized British Council IELTS Partner 2026"
                      onChange={(e) => update("title", e.currentTarget.value)}
                      className={inputClass}
                    />
                  </label>
                </div>

                <div>
                  <label className={labelClass}>
                    Issuer / Institution *
                    <input
                      required
                      maxLength={180}
                      value={draft.issuer}
                      placeholder="e.g. British Council / IDP / Pearson"
                      onChange={(e) => update("issuer", e.currentTarget.value)}
                      className={inputClass}
                    />
                  </label>
                </div>

                <div>
                  <label className={labelClass}>
                    Credential Date / Year
                    <input
                      maxLength={80}
                      value={draft.credentialDate}
                      onChange={(e) =>
                        update("credentialDate", e.currentTarget.value)
                      }
                      placeholder="e.g. 2025–2026"
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>

              {/* Category with 1-Click Presets */}
              <div>
                <label className={labelClass}>Accreditation Category *</label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {CATEGORY_PRESETS.map((cat) => {
                    const active = draft.category === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => update("category", cat)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                          active
                            ? "bg-[#465FFF] text-white shadow-2xs"
                            : "border border-[#E4E7EC] bg-[#F9FAFB] text-[#475467] hover:bg-[#F2F4F7]"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
                <input
                  required
                  maxLength={100}
                  value={draft.category}
                  onChange={(e) => update("category", e.currentTarget.value)}
                  placeholder="Or enter custom category"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Accessibility Description (Alt text) *
                  <input
                    required
                    maxLength={500}
                    value={draft.altText}
                    onChange={(e) => update("altText", e.currentTarget.value)}
                    className={inputClass}
                    placeholder="Short description for screen readers and SEO"
                  />
                </label>
              </div>

              {/* Toggles & Sort Order */}
              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3 text-xs font-medium text-[#344054] hover:bg-white">
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(e) =>
                      update("published", e.currentTarget.checked)
                    }
                    className="size-4 rounded border-[#D0D5DD] text-[#465FFF] focus:ring-[#465FFF]"
                  />
                  <span>Publish live on site</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3 text-xs font-medium text-[#344054] hover:bg-white">
                  <input
                    type="checkbox"
                    checked={draft.homepageFeatured}
                    onChange={(e) =>
                      update("homepageFeatured", e.currentTarget.checked)
                    }
                    className="size-4 rounded border-[#D0D5DD] text-[#465FFF] focus:ring-[#465FFF]"
                  />
                  <span>Show on homepage</span>
                </label>

                <div>
                  <label className="block text-xs font-medium text-[#344054]">
                    Display Priority Order
                    <input
                      type="number"
                      min={1}
                      max={9999}
                      value={draft.sortOrder}
                      onChange={(e) =>
                        update(
                          "sortOrder",
                          Math.max(1, Number(e.currentTarget.value) || 1),
                        )
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-[#E4E7EC] bg-white px-3 font-mono text-xs text-[#1D2939] focus:border-[#465FFF] focus:outline-none"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Photo Upload & Preview Zone */}
            <div className="flex flex-col">
              <label className={labelClass}>
                Certificate Document / Photo *
              </label>
              <div className="mt-1.5 flex flex-1 flex-col justify-center rounded-2xl border-2 border-dashed border-[#D0D5DD] bg-[#F9FAFB] p-5 text-center transition hover:border-[#465FFF]/50 hover:bg-[#F8F9FC]">
                {draft.imageSrc ? (
                  <div className="space-y-3">
                    <div className="relative mx-auto flex aspect-[4/3] max-h-56 items-center justify-center overflow-hidden rounded-xl border border-[#E4E7EC] bg-white p-2 shadow-2xs">
                      <img
                        src={draft.imageSrc}
                        alt="Certificate Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#E4E7EC] bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-2xs hover:bg-[#F9FAFB]">
                      <UploadCloud className="size-3.5 text-[#465FFF]" /> Change
                      image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={choosePhoto}
                        className="sr-only"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3 py-6">
                    <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#ECF3FF] text-[#465FFF]">
                      <ImagePlus className="size-6" />
                    </div>
                    <div>
                      <label className="cursor-pointer text-xs font-semibold text-[#465FFF] hover:underline">
                        Upload certificate file
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={choosePhoto}
                          className="sr-only"
                        />
                      </label>
                      <p className="mt-1 text-[11px] text-[#667085]">
                        JPG, PNG or WebP (auto-optimized to WebP)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[#F2F4F7] pt-4">
            <button
              type="button"
              onClick={cancelEdit}
              className="min-h-10 rounded-xl border border-[#E4E7EC] bg-white px-4 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                busy ||
                !draft.title.trim() ||
                !draft.category.trim() ||
                (!draft.id && !draft.imageBase64 && !draft.imageSrc)
              }
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#465FFF] px-5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#3b52d4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy
                ? "Saving…"
                : draft.published
                  ? "Save & Publish Live"
                  : "Save as Private Draft"}
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-3.5 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterCat("All")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterCat === "All"
                ? "bg-[#465FFF] text-white shadow-2xs"
                : "bg-[#F9FAFB] text-[#667085] hover:bg-[#F2F4F7] hover:text-[#1D2939]"
            }`}
          >
            All ({items.length})
          </button>
          {CATEGORY_PRESETS.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            if (count === 0 && filterCat !== cat) return null;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  filterCat === cat
                    ? "bg-[#465FFF] text-white shadow-2xs"
                    : "bg-[#F9FAFB] text-[#667085] hover:bg-[#F2F4F7] hover:text-[#1D2939]"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#98A2B3]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificates…"
            className="h-9 w-full rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] pl-8 pr-3 text-xs text-[#1D2939] placeholder:text-[#98A2B3] focus:border-[#465FFF] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Certificate Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white transition hover:border-[#D0D5DD] hover:shadow-xs"
          >
            {/* Image Preview Container */}
            <div className="relative flex aspect-[4/3] items-center justify-center border-b border-[#F2F4F7] bg-[#F9FAFB] p-4">
              <img
                src={item.imageSrc}
                alt={item.altText || item.title}
                loading="lazy"
                className="max-h-full max-w-full rounded-md object-contain transition group-hover:scale-[1.02]"
              />
              <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-0.5 font-mono text-[10px] font-bold text-[#475467] shadow-2xs backdrop-blur">
                #{item.sortOrder}
              </span>
            </div>

            {/* Content Details */}
            <div className="flex flex-1 flex-col p-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-md bg-[#F2F4F7] px-2 py-0.5 text-[10px] font-semibold text-[#475467]">
                  {item.category}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                    item.published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {item.published ? "Published" : "Draft"}
                </span>
                {item.homepageFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                    <Sparkles className="size-2.5" /> Homepage
                  </span>
                )}
              </div>

              <h3 className="mt-2.5 line-clamp-2 text-sm font-bold text-[#1D2939]">
                {item.title}
              </h3>
              <p className="mt-0.5 line-clamp-1 text-xs text-[#667085]">
                {item.issuer}{" "}
                {item.credentialDate ? `· ${item.credentialDate}` : ""}
              </p>

              {/* Action Buttons */}
              <div className="mt-auto flex items-center gap-2 border-t border-[#F2F4F7] pt-3">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E4E7EC] bg-white text-xs font-semibold text-[#344054] transition hover:bg-[#F9FAFB] hover:text-[#1D2939]"
                >
                  <Pencil className="size-3.5 text-[#667085]" /> Edit
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove(item)}
                  aria-label={`Remove ${item.title}`}
                  className="grid size-9 shrink-0 place-items-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </article>
        ))}

        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-12 text-center text-xs text-[#667085] sm:col-span-2 lg:col-span-3">
            {searchQuery || filterCat !== "All"
              ? "No certificates match the current search filter."
              : 'No certificates added yet. Click "Add certificate" to begin.'}
          </div>
        )}
      </div>
    </section>
  );
}
