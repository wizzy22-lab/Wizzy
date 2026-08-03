/**
 * Source of truth for the main page's copy and shape.
 * `ko.ts` is typed against this file, so adding a key here forces a Korean
 * translation to be added there too.
 */
const en = {
  meta: {
    title: "Wizzy — Product Designer",
    description: "I turn business problems into products that grow business.",
  },

  brand: {
    name: "Wizzy",
    role: "Product designer",
  },

  // Lowercase in the source, not uppercased by a utility: the bar sets these in
  // the body face at 1rem, so what is written here is what renders.
  nav: {
    project: "project",
    about: "about",
    resume: "resume",
    contact: "contact",
  },

  hero: {
    // Korean puts the object first, so each locale arranges these three parts
    // independently rather than sharing one sentence template.
    eyebrow: "I TURN",
    phrases: ["Business Problem", "Messy Operation", "User frustration"],
    tail: ["into products", "that grow business"],
    photoAlt: "Haeji Wi",
    // Rendered uppercase in the mono label face; kept in the dictionary so it
    // can be localised later rather than sitting hardcoded in the component.
    scrollHint: "scroll",
  },

  projects: {
    label: "PROJECT",
    // No "coming soon" label: cards without a case study render no button.
    viewCase: "View case study",
  },

  businessBrand: {
    // Kept in English in both locales — it reads as a section name, not copy.
    label: "Business & Brand",
  },

  intro: {
    greeting: "Hi, I’m a Product Designer",
    name: "wizzy",
    statement: ["I design products grounded in", "real-world operations & user behavior"],
    closingLead: "What I care about most is building something",
    closing: { before: "Real", after: "Meaningful" },
  },

  timeline: {
    title: "How I got here",
    items: [
      {
        year: "2018",
        title: "Studied Navigation, Maritime Trade & Regulations",
        description:
          "Built a foundation for sharp, structured decision-making in complex, high-stakes environments — a discipline that still shapes how I approach design problems today.",
      },
      {
        year: "2020",
        title: "Discovered Baking",
        description:
          "Started baking as a hobby and gradually turned it into a serious craft — the first sign of a pattern that would repeat throughout my career: curiosity becoming commitment.",
      },
      {
        year: "2018–2021",
        title: "Trained Professionally",
        description:
          "Advanced my baking skills to a professional level, working at a bakery in Seoul.",
      },
      {
        year: "2022",
        title: "Founded Wizzy Bakeshop",
        description:
          "Launched Wizzy Bakeshop, leading product development, store operations, and the end-to-end customer experience. It remains one of the most rewarding chapters of my life.",
      },
      {
        year: "2025",
        title: "Transitioned into UX/UI Design",
        description:
          "After graduation, shifted into UX/UI design, studying product thinking and UX methodology at Blossom UX School.",
      },
      {
        year: "2026–present",
        title: "Leading Real-World Impact",
        description:
          "Leading brand renewal and product development, applying UX thinking to real-world products.",
      },
    ],
  },

  testimonials: {
    title: { lead: "Words", muted: "from people" },
    // TODO: replace with real quotes — these repeat one placeholder, as in Figma.
    items: [
      {
        quote:
          "Transitioned into UX/UI design after graduation, studying product thinking and UX methodologies at Blossom UX school.",
        name: "Josua",
        role: "developer · groundvisi",
      },
      {
        quote:
          "Transitioned into UX/UI design after graduation, studying product thinking and UX methodologies at Blossom UX school.",
        name: "Josua",
        role: "developer · groundvisi",
      },
      {
        quote:
          "Transitioned into UX/UI design after graduation, studying product thinking and UX methodologies at Blossom UX school.",
        name: "Josua",
        role: "developer · groundvisi",
      },
      {
        quote:
          "Transitioned into UX/UI design after graduation, studying product thinking and UX methodologies at Blossom UX school.",
        name: "Josua",
        role: "developer · groundvisi",
      },
    ],
  },

  caseStudy: {
    back: "Back to all projects",
    inProgress: {
      title: "Case study in progress",
      body: "This project doesn’t have a written case study yet. In the meantime, here’s what it was about.",
    },
    nextProject: "Next project",
  },

  footer: {
    connect: "Connect",
    getInTouch: "Get in touch",
    // Its own key rather than `nav.resume`: the bar runs lowercase, the footer
    // sets its links in sentence case beside the address.
    resume: "Resume",
    location: "Location",
    locationValue: "Seoul, South Korea",
    copied: "Copied!",
    copyright: "© 2026 wizzy",
  },
};

// Deliberately not `as const`: the literal types would force ko.ts to repeat the
// English strings verbatim. Widened types let it mirror the shape instead.
export type Dictionary = typeof en;

export default en;
