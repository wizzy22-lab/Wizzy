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
    // Never rendered as text — the accessible name of the button the links
    // fold behind below `lg`.
    menu: "Menu",
  },

  hero: {
    // Korean puts the object first, so each locale arranges these three parts
    // independently rather than sharing one sentence template.
    eyebrow: "I TURN",
    phrases: ["Business Problem", "Messy Operation", "User frustration"],
    tail: ["into products", "that grow business"],
    mediaAlt: "Shoot Shoot Penguin app screens on a device mockup",
    // Rendered uppercase in the mono label face; kept in the dictionary so it
    // can be localised later rather than sitting hardcoded in the component.
    scrollHint: "scroll",
  },

  projects: {
    label: "PROJECT",
    // No "coming soon" label: cards without a case study render no button.
    viewCase: "View case study",
  },

  intro: {
    greeting: "Hi, I’m a Product Designer",
    name: "wizzy",
    statement: ["I design products grounded in", "real-world operations & user behavior"],
    closingLead: "What I care about most is building something",
    closing: { before: "Real", after: "Meaningful" },
  },

  // Leads the about section. The wordmark is a brand name, not a person's name —
  // this line is the only place the applicant's own name is stated.
  //
  // One script per locale, no parenthetical: each reader gets the spelling they
  // can actually hold on to, and the other form is one language toggle away.
  about: {
    name: "Haeji Wi",
    // The photo under the name. Describes what the frame shows, not who is in
    // it — the name is already stated in text directly above it.
    photoAlt: "At work",
    // Leads the two brand links at the foot of about. A label, not a link:
    // the case names below it are what you click, so the arrow lives on them.
    brandsLead: "More: brands I built and ran",
    // The claim the section makes, and the evidence for it. Two levels, not
    // one paragraph: the first is what the job is, the second is how the work
    // actually gets decided.
    lead: "I see a product designer’s job as closing the gap between the real world and the digital one.",
    approach:
      "Running a store, I decided from revenue and customer response. Now I decide from user behavior and test results. Design is judgment, not taste — so I define the criteria before I build.",
  },

  timeline: {
    title: "How I got here",
    items: [
      {
        year: "2026–present",
        title: "Leading Real-World Impact",
        description:
          "Leading brand renewal and product development, applying UX thinking to real-world products.",
      },
      {
        year: "2025",
        title: "Transitioned into UX/UI Design",
        description:
          "After graduation, shifted into UX/UI design, studying product thinking and UX methodology at Blossom UX School.",
      },
      {
        year: "2022",
        title: "Founded Wizzy Bakeshop",
        description:
          "Launched Wizzy Bakeshop, leading product development, store operations, and the end-to-end customer experience.",
      },
      {
        year: "2020–2021",
        title: "Trained Professionally",
        description:
          "Advanced my baking to a professional level, working at a bakery in Seoul.",
      },
      {
        year: "2018",
        title: "Studied Navigation, Maritime Trade & Regulations",
        description:
          "Trained to make structured decisions in complex, high-stakes environments — a discipline that still shapes how I approach design problems.",
      },
      {
        year: "2016",
        title: "Discovered Baking",
        description:
          "Started baking as a hobby and turned it into a serious craft — curiosity becoming commitment, a pattern that has repeated ever since.",
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
