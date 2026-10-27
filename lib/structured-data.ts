import { routing } from "@/i18n/routing";
import { brand } from "@/lib/brand";
import { localizedUrl, ogImageUrl } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const SCHEMA_CONTEXT = "https://schema.org";

export const entityIds = {
  person: () => `${getSiteUrl()}/#person`,
  business: () => `${getSiteUrl()}/#business`,
  website: () => `${getSiteUrl()}/#website`,
};

function postalAddress() {
  return {
    "@type": "PostalAddress",
    addressLocality: brand.location.locality,
    addressCountry: brand.location.country,
  };
}

type EntityGraphInput = {
  locale: string;
  /** Localized one-line description of the practice */
  description: string;
  /** Localized job title */
  jobTitle: string;
};

/** Person, ProfessionalService and WebSite nodes, linked by stable `@id`s */
export function entityGraph({ locale, description, jobTitle }: EntityGraphInput) {
  const homeUrl = localizedUrl(locale, "/");
  const site = getSiteUrl();

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "Person",
        "@id": entityIds.person(),
        name: brand.name,
        jobTitle,
        description,
        url: homeUrl,
        email: brand.email,
        address: postalAddress(),
        sameAs: brand.sameAs,
        knowsAbout: brand.knowsAbout,
        knowsLanguage: [...routing.locales],
        worksFor: { "@id": entityIds.business() },
      },
      {
        "@type": "ProfessionalService",
        "@id": entityIds.business(),
        name: brand.name,
        url: homeUrl,
        description,
        image: ogImageUrl(locale),
        founder: { "@id": entityIds.person() },
        address: postalAddress(),
        areaServed: "Worldwide",
        sameAs: brand.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": entityIds.website(),
        name: brand.name,
        url: site,
        inLanguage: [...routing.locales],
        publisher: { "@id": entityIds.person() },
      },
    ],
  };
}

type ServiceInput = {
  name: string;
  description: string;
};

/** Catalog of services offered by the business node */
export function serviceCatalog({
  locale,
  name,
  services,
}: {
  locale: string;
  name: string;
  services: ServiceInput[];
}) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "OfferCatalog",
    name,
    url: localizedUrl(locale, "/services"),
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: { "@id": entityIds.business() },
        areaServed: "Worldwide",
      },
    })),
  };
}

/** The about page, describing the person node */
export function profilePage({ locale, name }: { locale: string; name: string }) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "ProfilePage",
    name,
    url: localizedUrl(locale, "/about"),
    inLanguage: locale,
    mainEntity: { "@id": entityIds.person() },
    isPartOf: { "@id": entityIds.website() },
  };
}
