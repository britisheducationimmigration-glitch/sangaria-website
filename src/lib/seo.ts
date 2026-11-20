const siteOrigin = "https://www.britisheducationandimmigration.com";

export type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
};

export function createPageSeo({
  title,
  description,
  path,
  type = "website",
  image,
}: PageSeoOptions) {
  const canonicalPath =
    path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  const canonicalUrl = `${siteOrigin}${canonicalPath}`;
  const uniqueDescription = description
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteOrigin}${image.startsWith("/") ? "" : "/"}${image}`
    : `${siteOrigin}/img/hero.webp`;

  return {
    meta: [
      { title },
      { name: "description", content: uniqueDescription },
      { name: "robots", content: "index,follow" },
      { property: "og:type", content: type },
      { property: "og:title", content: title },
      { property: "og:description", content: uniqueDescription },
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: ogImage },
      { property: "og:image:alt", content: title },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: uniqueDescription },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
}
