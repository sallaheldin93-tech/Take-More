type SeoService = {
  name: string;
  description: string;
  slug: string;
};

type SeoOptions = {
  title: string;
  description: string;
  lang: "ar" | "en";
  path: string;
  keywords?: string;
  services?: readonly SeoService[];
};

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

export function applySeo({ title, description, lang, path, keywords, services = [] }: SeoOptions) {
  document.title = title;
  document.documentElement.lang = lang;
  upsertMeta("name", "description", description);
  if (keywords) upsertMeta("name", "keywords", keywords);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:url", `https://take-more.com${path}`);
  upsertMeta("name", "twitter:card", "summary");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertLink("canonical", `https://take-more.com${path}`);

  const id = "take-more-service-schema";
  document.getElementById(id)?.remove();
  if (services.length) {
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          url: `https://take-more.com${service.slug}`,
          provider: { "@type": "Organization", name: "Take More", url: "https://take-more.com" },
          areaServed: "Egypt",
        },
      })),
    });
    document.head.appendChild(script);
  }
}
