import { Template, EditorElement } from "./types";

// Helper to generate IDs
const gid = () => `el-${Math.random().toString(36).substr(2, 9)}`;

export const emptyCanvasTemplate: EditorElement[] = [
  {
    id: "root-section",
    type: "section",
    label: "Main Container",
    styles: {
      bgColor: "bg-swiss-bg",
      padding: "py-20 px-8",
      margin: "my-0",
      borderRadius: "rounded-none",
      border: "border-2 border-swiss-ink",
      width: "w-full",
      customClasses: "min-h-[500px] flex flex-col justify-center items-center shadow-[4px_4px_0px_#18181A]"
    },
    children: [
      {
        id: gid(),
        type: "heading",
        label: "Welcome Header",
        content: "TACTILE WEB COMPOSER",
        styles: {
          textColor: "text-swiss-ink",
          fontSize: "text-4xl md:text-5xl",
          fontWeight: "font-black",
          alignment: "text-center",
          margin: "mb-4",
          customClasses: "font-syne tracking-tighter"
        }
      },
      {
        id: gid(),
        type: "paragraph",
        label: "Instructions Text",
        content: "Drag or click components from the sidebar palette on the left to inject them into selected layouts. You can edit text content directly or style elements using the property panel.",
        styles: {
          textColor: "text-slate-600",
          fontSize: "text-sm",
          alignment: "text-center",
          margin: "mb-6",
          width: "w-full",
          customClasses: "max-w-xl leading-relaxed"
        },
        props: {
          alt: "Description"
        }
      }
    ]
  }
];

export const landingPageTemplate: EditorElement[] = [
  {
    id: "nav-header",
    type: "section",
    label: "Navigation Header",
    styles: {
      bgColor: "bg-swiss-bg",
      padding: "py-4 px-8",
      border: "border-b-2 border-swiss-ink",
      customClasses: "flex justify-between items-center"
    },
    children: [
      {
        id: gid(),
        type: "badge",
        label: "Logo Brand",
        content: "⚡ APEX_STUDIO",
        styles: {
          bgColor: "bg-swiss-ink",
          textColor: "text-white",
          fontWeight: "font-black",
          fontSize: "text-xs",
          borderRadius: "rounded-none",
          padding: "px-3 py-1.5",
          customClasses: "font-mono tracking-widest border-2 border-swiss-ink"
        }
      },
      {
        id: gid(),
        type: "flex",
        label: "Nav Links",
        styles: {
          flexDir: "flex-row",
          gap: "gap-6",
          alignment: "items-center"
        },
        children: [
          {
            id: gid(),
            type: "paragraph",
            label: "Nav Link 1",
            content: "Features",
            styles: { textColor: "text-swiss-ink", fontSize: "text-xs", fontWeight: "font-black", customClasses: "font-mono uppercase tracking-wider" }
          },
          {
            id: gid(),
            type: "paragraph",
            label: "Nav Link 2",
            content: "Pricing",
            styles: { textColor: "text-swiss-ink", fontSize: "text-xs", fontWeight: "font-black", customClasses: "font-mono uppercase tracking-wider" }
          },
          {
            id: gid(),
            type: "button",
            label: "Nav Button",
            content: "GET_STARTED",
            styles: {
              bgColor: "bg-swiss-accent",
              textColor: "text-white",
              padding: "px-4 py-1.5",
              borderRadius: "rounded-none",
              border: "border-2 border-swiss-ink",
              fontSize: "text-xs",
              fontWeight: "font-black",
              customClasses: "font-mono shadow-[2px_2px_0px_#18181A]"
            },
            props: { buttonType: "primary" }
          }
        ]
      }
    ]
  },
  {
    id: "hero-section",
    type: "hero",
    label: "Main Hero Block",
    styles: {
      bgColor: "bg-swiss-bg",
      padding: "py-20 px-8",
      border: "border-b-2 border-swiss-ink",
      borderRadius: "rounded-none"
    },
    children: [
      {
        id: gid(),
        type: "flex",
        label: "Hero Inner Container",
        styles: {
          flexDir: "flex-col",
          gap: "gap-6",
          alignment: "items-center",
          customClasses: "max-w-4xl mx-auto text-center"
        },
        children: [
          {
            id: gid(),
            type: "badge",
            label: "Promo Tag",
            content: "SWISS DESIGN SYSTEM // v2.0",
            styles: {
              bgColor: "bg-swiss-ink",
              textColor: "text-white",
              fontSize: "text-[10px]",
              fontWeight: "font-black",
              borderRadius: "rounded-none",
              padding: "px-3 py-1",
              margin: "mb-2",
              customClasses: "font-mono tracking-widest border-2 border-swiss-ink"
            }
          },
          {
            id: gid(),
            type: "heading",
            label: "Hero Heading",
            content: "DESIGN BEYOND ALL SYSTEM BOUNDARIES.",
            styles: {
              textColor: "text-swiss-ink",
              fontSize: "text-5xl md:text-6xl",
              fontWeight: "font-black",
              alignment: "text-center",
              customClasses: "font-syne tracking-tighter leading-none"
            }
          },
          {
            id: gid(),
            type: "paragraph",
            label: "Hero Subtitle",
            content: "A visual, high-contrast playground to compose robust Tailwind landing screens. Form and scale pair perfectly with compliant code generated live.",
            styles: {
              textColor: "text-slate-600",
              fontSize: "text-base",
              alignment: "text-center",
              margin: "mb-6",
              customClasses: "max-w-2xl leading-relaxed font-medium"
            }
          },
          {
            id: gid(),
            type: "flex",
            label: "Hero Actions",
            styles: {
              flexDir: "flex-row",
              gap: "gap-4",
              alignment: "justify-center"
            },
            children: [
              {
                id: gid(),
                type: "button",
                label: "Primary Hero Button",
                content: "DEPLOY NOW",
                styles: {
                  bgColor: "bg-swiss-accent",
                  textColor: "text-white",
                  padding: "px-6 py-3",
                  borderRadius: "rounded-none",
                  border: "border-2 border-swiss-ink",
                  fontSize: "text-sm",
                  fontWeight: "font-black",
                  shadow: "shadow-[4px_4px_0px_#18181A]",
                  customClasses: "font-mono tracking-wider hover:translate-x-0.5 hover:translate-y-0.5"
                },
                props: { buttonType: "primary" }
              },
              {
                id: gid(),
                type: "button",
                label: "Secondary Hero Button",
                content: "WATCH DEMO",
                styles: {
                  bgColor: "bg-white",
                  textColor: "text-swiss-ink",
                  padding: "px-6 py-3",
                  borderRadius: "rounded-none",
                  fontSize: "text-sm",
                  fontWeight: "font-black",
                  border: "border-2 border-swiss-ink",
                  shadow: "shadow-[4px_4px_0px_#18181A]",
                  customClasses: "font-mono tracking-wider hover:translate-x-0.5 hover:translate-y-0.5"
                },
                props: { buttonType: "secondary" }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "features-section",
    type: "section",
    label: "Features Section Grid",
    styles: {
      bgColor: "bg-white",
      padding: "py-20 px-8"
    },
    children: [
      {
        id: gid(),
        type: "subheading",
        label: "Features Section Title",
        content: "SYSTEM SPECIFICATIONS",
        styles: {
          textColor: "text-swiss-ink",
          fontSize: "text-3xl md:text-4xl",
          fontWeight: "font-black",
          alignment: "text-center",
          margin: "mb-2",
          customClasses: "font-syne tracking-tighter"
        }
      },
      {
        id: gid(),
        type: "paragraph",
        label: "Features Section Subtext",
        content: "Construct beautiful web layouts utilizing tactile, solid structural blocks.",
        styles: {
          textColor: "text-slate-500",
          fontSize: "text-sm",
          alignment: "text-center",
          margin: "mb-12",
          customClasses: "font-medium"
        }
      },
      {
        id: gid(),
        type: "grid",
        label: "Features 3-Col Grid",
        styles: {
          gridCols: "grid-cols-3",
          gap: "gap-8"
        },
        children: [
          {
            id: gid(),
            type: "card",
            label: "Feature Card 1",
            styles: {
              bgColor: "bg-white",
              padding: "p-6",
              borderRadius: "rounded-none",
              border: "border-2 border-swiss-ink",
              shadow: "shadow-[4px_4px_0px_#18181A]"
            },
            children: [
              {
                id: gid(),
                type: "badge",
                label: "Card Icon 1",
                content: "🚀 INSTANT",
                styles: { bgColor: "bg-swiss-accent", textColor: "text-white", fontSize: "text-[10px]", fontWeight: "font-black", borderRadius: "rounded-none", padding: "px-2 py-1", margin: "mb-4", width: "w-fit", border: "border-2 border-swiss-ink", customClasses: "font-mono tracking-widest" }
              },
              {
                id: gid(),
                type: "subheading",
                label: "Card Title 1",
                content: "Dynamic Compilation",
                styles: { textColor: "text-swiss-ink", fontSize: "text-lg", fontWeight: "font-black", margin: "mb-2", customClasses: "font-syne tracking-tight" }
              },
              {
                id: gid(),
                type: "paragraph",
                label: "Card Description 1",
                content: "Assemble gorgeous templates in seconds and see clean React and Tailwind code compiled instantly as you edit.",
                styles: { textColor: "text-slate-600", fontSize: "text-xs", customClasses: "leading-relaxed" }
              }
            ]
          },
          {
            id: gid(),
            type: "card",
            label: "Feature Card 2",
            styles: {
              bgColor: "bg-white",
              padding: "p-6",
              borderRadius: "rounded-none",
              border: "border-2 border-swiss-ink",
              shadow: "shadow-[4px_4px_0px_#18181A]"
            },
            children: [
              {
                id: gid(),
                type: "badge",
                label: "Card Icon 2",
                content: "🧠 DESIGN AUDIT",
                styles: { bgColor: "bg-swiss-ink", textColor: "text-white", fontSize: "text-[10px]", fontWeight: "font-black", borderRadius: "rounded-none", padding: "px-2 py-1", margin: "mb-4", width: "w-fit", border: "border-2 border-swiss-ink", customClasses: "font-mono tracking-widest" }
              },
              {
                id: gid(),
                type: "subheading",
                label: "Card Title 2",
                content: "AI Design Assistant",
                styles: { textColor: "text-swiss-ink", fontSize: "text-lg", fontWeight: "font-black", margin: "mb-2", customClasses: "font-syne tracking-tight" }
              },
              {
                id: gid(),
                type: "paragraph",
                label: "Card Description 2",
                content: "Get deep UI and contrast auditing powered by state-of-the-art intelligent layout review systems.",
                styles: { textColor: "text-slate-600", fontSize: "text-xs", customClasses: "leading-relaxed" }
              }
            ]
          },
          {
            id: gid(),
            type: "card",
            label: "Feature Card 3",
            styles: {
              bgColor: "bg-white",
              padding: "p-6",
              borderRadius: "rounded-none",
              border: "border-2 border-swiss-ink",
              shadow: "shadow-[4px_4px_0px_#18181A]"
            },
            children: [
              {
                id: gid(),
                type: "badge",
                label: "Card Icon 3",
                content: "👥 TEAM SYNC",
                styles: { bgColor: "bg-swiss-bg", textColor: "text-swiss-ink", fontSize: "text-[10px]", fontWeight: "font-black", borderRadius: "rounded-none", padding: "px-2 py-1", margin: "mb-4", width: "w-fit", border: "border-2 border-swiss-ink", customClasses: "font-mono tracking-widest" }
              },
              {
                id: gid(),
                type: "subheading",
                label: "Card Title 3",
                content: "Collaborative Labs",
                styles: { textColor: "text-swiss-ink", fontSize: "text-lg", fontWeight: "font-black", margin: "mb-2", customClasses: "font-syne tracking-tight" }
              },
              {
                id: gid(),
                type: "paragraph",
                label: "Card Description 3",
                content: "Connect live peer sessions to synchronize layouts, edit text concurrently, and check visual styles in real-time.",
                styles: { textColor: "text-slate-600", fontSize: "text-xs", customClasses: "leading-relaxed" }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "site-footer",
    type: "footer",
    label: "Global Site Footer",
    styles: {
      bgColor: "bg-swiss-ink",
      padding: "py-12 px-8",
      textColor: "text-swiss-bg"
    },
    children: [
      {
        id: gid(),
        type: "flex",
        label: "Footer Layout",
        styles: {
          flexDir: "flex-col",
          gap: "gap-6",
          alignment: "items-center",
          customClasses: "max-w-4xl mx-auto md:flex-row md:justify-between"
        },
        children: [
          {
            id: gid(),
            type: "paragraph",
            label: "Footer Copyright",
            content: "© 2026 APEX_STUDIO. All rights reserved.",
            styles: { textColor: "text-slate-400", fontSize: "text-xs", fontWeight: "font-bold", customClasses: "font-mono uppercase tracking-wider" }
          },
          {
            id: gid(),
            type: "flex",
            label: "Footer Socials",
            styles: { flexDir: "flex-row", gap: "gap-4" },
            children: [
              {
                id: gid(),
                type: "paragraph",
                label: "Footer Link Privacy",
                content: "Privacy",
                styles: { textColor: "text-slate-400", fontSize: "text-[10px]", fontWeight: "font-black", customClasses: "hover:text-swiss-accent font-mono uppercase tracking-widest cursor-pointer" }
              },
              {
                id: gid(),
                type: "paragraph",
                label: "Footer Link Terms",
                content: "Terms of Service",
                styles: { textColor: "text-slate-400", fontSize: "text-[10px]", fontWeight: "font-black", customClasses: "hover:text-swiss-accent font-mono uppercase tracking-widest cursor-pointer" }
              }
            ]
          }
        ]
      }
    ]
  }
];

export const templatesList: Template[] = [
  {
    id: "empty",
    name: "Empty Project",
    description: "Start clean with a single content container and heading.",
    elements: emptyCanvasTemplate,
    thumbnail: "Sparkles"
  },
  {
    id: "landing",
    name: "SaaS Landing Page",
    description: "A complete professional landing layout with hero block, navigation bar, and feature grids.",
    elements: landingPageTemplate,
    thumbnail: "LayoutGrid"
  }
];
