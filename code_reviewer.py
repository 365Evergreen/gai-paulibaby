#!/usr/bin/env python3
import sys
import os
import re
import json

def analyze_code(file_path):
    if not os.path.exists(file_path):
        return {
            "error": f"File {file_path} not found",
            "issues": []
        }

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            code = f.read()
    except Exception as e:
        return {
            "error": f"Failed to read file: {str(e)}",
            "issues": []
        }

    issues = []
    lines = code.split("\n")

    # Helper to add issue
    def add_issue(category, severity, title, description, line_num, snippet, recommendation):
        issues.append({
            "id": f"{category}-{len(issues) + 1}",
            "category": category,
            "severity": severity,
            "title": title,
            "description": description,
            "line": line_num,
            "snippet": snippet.strip() if snippet else None,
            "recommendation": recommendation
        })

    # 1. Security check: Target blank without noopener noreferrer
    target_blank_regex = re.compile(r'href=["\'][^"\']+["\'].*target=["\']_blank["\']')
    for i, line in enumerate(lines):
        if "target=" in line and "_blank" in line:
            if "noopener" not in line or "noreferrer" not in line:
                add_issue(
                    category="security",
                    severity="warning",
                    title="Insecure Target Blank Link",
                    description="Using target=\"_blank\" without rel=\"noopener noreferrer\" makes the page vulnerable to window.opener hijacking (tabnabbing).",
                    line_num=i + 1,
                    snippet=line,
                    recommendation="Add rel=\"noopener noreferrer\" to the anchor tag."
                )

    # 2. Accessibility: Img without alt attribute
    for i, line in enumerate(lines):
        if "<img" in line:
            # Check if alt attribute is present
            if "alt=" not in line or 'alt=""' in line:
                add_issue(
                    category="accessibility",
                    severity="error",
                    title="Missing Image Alt Attribute",
                    description="Images must have a descriptive alt attribute to support screen readers and search engines.",
                    line_num=i + 1,
                    snippet=line,
                    recommendation="Add a descriptive alt attribute, e.g., alt=\"User Profile Avatar\" or alt=\"Company Logo\"."
                )

    # 3. Best Practice: Inline styling
    for i, line in enumerate(lines):
        if "style=" in line and "styles." not in line and "style={{" not in line:
            if not line.strip().startswith("//") and "import" not in line:
                # Basic check for inline styles
                add_issue(
                    category="best-practice",
                    severity="info",
                    title="Avoid Inline Styling",
                    description="Using inline HTML styles goes against Tailwind utility conventions and reduces maintainability.",
                    line_num=i + 1,
                    snippet=line,
                    recommendation="Replace inline style="..." with equivalent Tailwind CSS utility classes."
                )

    # 4. Performance: Extremely nested elements
    # Let's check if there are nested divs with no styling on some lines or excessive hierarchy
    nested_div_count = 0
    max_nested = 0
    for i, line in enumerate(lines):
        nested_div_count += line.count("<div") - line.count("</div")
        if nested_div_count > max_nested:
            max_nested = nested_div_count

    if max_nested > 6:
        add_issue(
            category="performance",
            severity="warning",
            title="Excessive DOM Nesting Depth",
            description=f"The design contains a maximum nesting depth of {max_nested} elements, which degrades DOM rendering performance.",
            line_num=None,
            snippet=None,
            recommendation="Flatten the component tree by grouping adjacent elements in layouts or reducing redundant container wraps."
        )

    # 5. Accessibility: Interactive element without proper label
    for i, line in enumerate(lines):
        if "<button" in line and ">" in line:
            button_text = re.search(r'<button[^>]*>(.*?)</button>', line)
            # If button tag is single-line and has no text or icon label
            if button_text and not button_text.group(1).strip() and "aria-label" not in line:
                add_issue(
                    category="accessibility",
                    severity="error",
                    title="Icon Button Missing Accessible Name",
                    description="Buttons that only contain icons or are empty must have an aria-label for accessibility compliance.",
                    line_num=i + 1,
                    snippet=line,
                    recommendation="Add an aria-label attribute to the button detailing its function, e.g., aria-label=\"Close modal\"."
                )

    # 6. Syntax / Best Practice: Standard buttons without explicit type
    for i, line in enumerate(lines):
        if "<button" in line and "type=" not in line:
            add_issue(
                category="best-practice",
                severity="info",
                title="Button Missing Explicit Type",
                description="Buttons without a type attribute default to 'submit', which can trigger unintended form submissions.",
                line_num=i + 1,
                snippet=line,
                recommendation="Add type=\"button\" (or type=\"submit\" / type=\"reset\") explicitly."
            )

    # 7. Accessibility: Empty links or anchor tags
    for i, line in enumerate(lines):
        if "<a " in line and ("href=\"#\"" in line or "href='#'" in line or "href=\"\"" in line):
            add_issue(
                category="accessibility",
                severity="warning",
                title="Empty or Placeholder Link Anchor",
                description="Using '#' or empty string as an anchor href causes page reloads and breaks keyboard navigation context.",
                line_num=i + 1,
                snippet=line,
                recommendation="Replace href=\"#\" with a real URL, or convert the anchor tag into a styled <button> if it triggers an action."
            )

    return {
        "filePath": file_path,
        "success": True,
        "issuesCount": len(issues),
        "issues": issues
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "No file path provided",
            "issues": []
        }))
        sys.exit(1)

    file_to_review = sys.argv[1]
    result = analyze_code(file_to_review)
    print(json.dumps(result, indent=2))
