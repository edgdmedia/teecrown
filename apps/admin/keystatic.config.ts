import { config, collection, singleton, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: { owner: "edgdmedia", name: "teecrown" },
  },
  ui: {
    brand: {
      name: "Tee'Crown Consult",
    },
    navigation: {
      Content: ["blog", "tours", "testimonials"],
      Settings: ["site", "contact"],
    },
  },
  singletons: {
    site: singleton({
      label: "Site Settings",
      path: "../../apps/web/src/content/site",
      format: "json",
      schema: {
        name: fields.text({ label: "Short brand name" }),
        fullName: fields.text({ label: "Registered company name" }),
        tagline: fields.text({ label: "Homepage tagline" }),
        description: fields.text({ label: "Meta description / footer blurb", multiline: true }),
        url: fields.text({ label: "Canonical site URL" }),
      },
    }),
    contact: singleton({
      label: "Contact Details",
      path: "../../apps/web/src/content/contact",
      format: "json",
      schema: {
        phone: fields.text({ label: "Phone (display)" }),
        phoneIntl: fields.text({ label: "Phone (international, for tel: links)" }),
        wa: fields.text({ label: "WhatsApp number (no +)" }),
        email: fields.text({ label: "Email" }),
        address: fields.text({ label: "Street address" }),
        social: fields.object(
          {
            Facebook: fields.text({ label: "Facebook URL" }),
            Instagram: fields.text({ label: "Instagram URL" }),
            X: fields.text({ label: "X (Twitter) URL" }),
            YouTube: fields.text({ label: "YouTube URL" }),
          },
          { label: "Social links" }
        ),
      },
    }),
  },
  collections: {
    blog: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "../../apps/web/src/content/blog/*",
      format: "json",
      entryLayout: "form",
      columns: ["title", "category", "date"],
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: { label: "Slug" },
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Blog", value: "Blog" },
            { label: "Guide", value: "Guide" },
            { label: "Impact", value: "Impact" },
            { label: "Adventure", value: "Adventure" },
            { label: "Tourism", value: "Tourism" },
          ],
          defaultValue: "Blog",
        }),
        date: fields.text({ label: "Display date" }),
        author: fields.text({ label: "Author" }),
        excerpt: fields.text({ label: "Excerpt", multiline: true }),
        image: fields.text({ label: "Cover image URL" }),
        body: fields.text({ label: "Body (paragraphs separated by blank lines)", multiline: true }),
      },
    }),
    tours: collection({
      label: "Tours",
      slugField: "title",
      path: "../../apps/web/src/content/tours/*",
      format: "json",
      entryLayout: "form",
      columns: ["title", "tag", "duration"],
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: { label: "Slug" },
        }),
        location: fields.text({ label: "Location" }),
        duration: fields.text({ label: "Duration" }),
        tag: fields.text({ label: "Badge label" }),
        excerpt: fields.text({ label: "Excerpt", multiline: true }),
        image: fields.text({ label: "Hero image URL" }),
        gallery: fields.array(fields.text({ label: "Image URL" }), {
          label: "Gallery",
        }),
        intro: fields.text({ label: "Intro (paragraphs separated by blank lines)", multiline: true }),
        included: fields.array(fields.text({ label: "Item" }), {
          label: "What's included",
        }),
        highlights: fields.array(fields.text({ label: "Item" }), {
          label: "Trip highlights",
        }),
        pricing: fields.array(
          fields.object(
            {
              label: fields.text({ label: "Label" }),
              value: fields.text({ label: "Value" }),
            },
            { label: "Pricing row" }
          ),
          { label: "Pricing" }
        ),
        itinerary: fields.array(
          fields.object(
            {
              day: fields.text({ label: "Day" }),
              description: fields.text({ label: "Description" }),
            },
            { label: "Itinerary row" }
          ),
          { label: "Itinerary" }
        ),
        requirements: fields.array(fields.text({ label: "Item" }), {
          label: "Requirements",
        }),
        hashtags: fields.array(fields.text({ label: "Hashtag" }), {
          label: "Hashtags",
        }),
        validUntil: fields.text({ label: "Pricing valid until" }),
      },
    }),
    testimonials: collection({
      label: "Testimonials",
      slugField: "name",
      path: "../../apps/web/src/content/testimonials/*",
      format: "json",
      entryLayout: "form",
      columns: ["name", "title", "rating"],
      schema: {
        name: fields.slug({
          name: { label: "Name" },
          slug: { label: "Slug" },
        }),
        title: fields.text({ label: "Role / context label" }),
        text: fields.text({ label: "Quote", multiline: true }),
        rating: fields.integer({ label: "Rating (1–5)", defaultValue: 5 }),
      },
    }),
  },
});
