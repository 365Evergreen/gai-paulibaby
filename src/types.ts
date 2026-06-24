export interface EditorElement {
  id: string;
  type: string; // 'section' | 'grid' | 'flex' | 'card' | 'heading' | 'subheading' | 'paragraph' | 'button' | 'image' | 'badge' | 'input' | 'testimonial' | 'hero' | 'footer' | 'pricing'
  label: string;
  content?: string;
  styles: {
    bgColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    border?: string;
    shadow?: string;
    alignment?: string;
    fontSize?: string;
    fontWeight?: string;
    width?: string;
    flexDir?: string; // for flex container: 'flex-row' | 'flex-col'
    gap?: string; // for flex/grid
    gridCols?: string; // for grid: 'grid-cols-1' | 'grid-cols-2' | 'grid-cols-3'
    customClasses?: string; // manual additions
  };
  props?: {
    src?: string;
    alt?: string;
    placeholder?: string;
    href?: string;
    buttonType?: 'primary' | 'secondary' | 'danger';
    badgeType?: 'default' | 'success' | 'warning' | 'info';
  };
  children?: EditorElement[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  elements: EditorElement[];
  thumbnail: string; // Tailwind icon name or category
}

export interface AISuggestion {
  category: 'layout' | 'color' | 'typography' | 'structure';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  reason: string;
  suggestedStyles?: Record<string, string>; // styles map to apply
  targetElementId?: string; // element to apply to
}

export interface AccessibilityIssue {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Moderate' | 'Minor';
  elementId?: string;
  wcagRule: string;
  recommendation: string;
}

export interface CodeReviewIssue {
  id: string;
  category: 'syntax' | 'security' | 'performance' | 'best-practice' | 'accessibility';
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  line?: number;
  snippet?: string;
  recommendation: string;
}

export interface CollabUser {
  id: string;
  name: string;
  color: string; // hex or tailwind text class
  cursor?: { x: number; y: number; elementId?: string };
  isSimulated?: boolean;
}

export interface CollabMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface CollabSession {
  roomId: string;
  users: CollabUser[];
  messages: CollabMessage[];
  elements?: EditorElement[]; // synchronized content
}

export interface Revision {
  id: string;
  name: string;
  timestamp: string;
  elements: EditorElement[];
  author: string;
}
