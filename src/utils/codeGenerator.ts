import { EditorElement } from "../types";

export function getTailwindClasses(el: EditorElement): string {
  const styles = el.styles;
  const classes: string[] = [];

  if (styles.bgColor) classes.push(styles.bgColor);
  if (styles.textColor) classes.push(styles.textColor);
  if (styles.padding) classes.push(styles.padding);
  if (styles.margin) classes.push(styles.margin);
  if (styles.borderRadius) classes.push(styles.borderRadius);
  if (styles.border) classes.push(styles.border);
  if (styles.shadow) classes.push(styles.shadow);
  if (styles.alignment) classes.push(styles.alignment);
  if (styles.fontSize) classes.push(styles.fontSize);
  if (styles.fontWeight) classes.push(styles.fontWeight);
  if (styles.width) classes.push(styles.width);

  if (el.type === "flex") {
    classes.push("flex");
    if (styles.flexDir) classes.push(styles.flexDir);
    if (styles.gap) classes.push(styles.gap);
  } else if (el.type === "grid") {
    classes.push("grid");
    if (styles.gridCols) classes.push(styles.gridCols);
    if (styles.gap) classes.push(styles.gap);
  } else if (el.type === "hero") {
    classes.push("flex flex-col");
  }

  if (styles.customClasses) {
    classes.push(styles.customClasses);
  }

  return classes.filter(Boolean).join(" ");
}

export function generateHtmlCode(elements: EditorElement[]): string {
  let code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Generated Layout</title>
  <!-- Load Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen">

  <main id="app-root" class="w-full">
`;

  function renderElement(el: EditorElement, indentLevel: number): string {
    const indent = "  ".repeat(indentLevel);
    const classes = getTailwindClasses(el);
    const idAttr = el.id ? ` id="${el.id}"` : "";
    const classAttr = classes ? ` class="${classes}"` : "";

    switch (el.type) {
      case "heading":
        return `${indent}<h1${idAttr}${classAttr}>${el.content || ""}</h1>\n`;
      case "subheading":
        return `${indent}<h2${idAttr}${classAttr}>${el.content || ""}</h2>\n`;
      case "paragraph":
        return `${indent}<p${idAttr}${classAttr}>${el.content || ""}</p>\n`;
      case "button":
        return `${indent}<button${idAttr}${classAttr} type="button">${el.content || "Button"}</button>\n`;
      case "image":
        const src = el.props?.src || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80";
        const alt = el.props?.alt || "Visual asset";
        return `${indent}<img${idAttr}${classAttr} src="${src}" alt="${alt}" referrerPolicy="no-referrer" />\n`;
      case "badge":
        return `${indent}<span${idAttr}${classAttr}>${el.content || ""}</span>\n`;
      case "input":
        const placeholder = el.props?.placeholder || "Type here...";
        return `${indent}<input${idAttr}${classAttr} type="text" placeholder="${placeholder}" />\n`;
      default:
        // Container types (section, grid, flex, card, hero, footer, etc.)
        const tag = el.type === "footer" ? "footer" : "div";
        let out = `${indent}<${tag}${idAttr}${classAttr}>\n`;
        if (el.children && el.children.length > 0) {
          el.children.forEach((child) => {
            out += renderElement(child, indentLevel + 1);
          });
        }
        out += `${indent}</${tag}>\n`;
        return out;
    }
  }

  elements.forEach((el) => {
    code += renderElement(el, 2);
  });

  code += `  </main>

</body>
</html>`;

  return code;
}

export function generateReactCode(elements: EditorElement[]): string {
  let code = `import React from 'react';

export default function GeneratedPage() {
  return (
    <div className="bg-slate-50 min-h-screen w-full font-sans">
`;

  function renderElement(el: EditorElement, indentLevel: number): string {
    const indent = "  ".repeat(indentLevel);
    const classes = getTailwindClasses(el);
    const idAttr = el.id ? ` id="${el.id}"` : "";
    const classAttr = classes ? ` className="${classes}"` : "";

    switch (el.type) {
      case "heading":
        return `${indent}<h1${idAttr}${classAttr}>\n${indent}  {/* Custom Heading */}\n${indent}  ${el.content || ""}\n${indent}</h1>\n`;
      case "subheading":
        return `${indent}<h2${idAttr}${classAttr}>\n${indent}  ${el.content || ""}\n${indent}</h2>\n`;
      case "paragraph":
        return `${indent}<p${idAttr}${classAttr}>\n${indent}  ${el.content || ""}\n${indent}</p>\n`;
      case "button":
        return `${indent}<button${idAttr}${classAttr} type="button">\n${indent}  ${el.content || "Button"}\n${indent}</button>\n`;
      case "image":
        const src = el.props?.src || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80";
        const alt = el.props?.alt || "Visual Asset";
        return `${indent}<img\n${indent}  ${idAttr ? `id="${el.id}"\n` : ""}${indent}  className="${classes}"\n${indent}  src="${src}"\n${indent}  alt="${alt}"\n${indent}  referrerPolicy="no-referrer"\n${indent}/>\n`;
      case "badge":
        return `${indent}<span${idAttr}${classAttr}>\n${indent}  ${el.content || ""}\n${indent}</span>\n`;
      case "input":
        const placeholder = el.props?.placeholder || "Type here...";
        return `${indent}<input\n${indent}  ${idAttr ? `id="${el.id}"\n` : ""}${indent}  className="${classes}"\n${indent}  type="text"\n${indent}  placeholder="${placeholder}"\n${indent}/>\n`;
      default:
        // Container types (section, grid, flex, card, hero, footer, etc.)
        const tag = el.type === "footer" ? "footer" : "div";
        let out = `${indent}<${tag}${idAttr}${classAttr}>\n`;
        if (el.children && el.children.length > 0) {
          el.children.forEach((child) => {
            out += renderElement(child, indentLevel + 1);
          });
        }
        out += `${indent}</${tag}>\n`;
        return out;
    }
  }

  elements.forEach((el) => {
    code += renderElement(el, 3);
  });

  code += `    </div>
  );
}`;

  return code;
}
