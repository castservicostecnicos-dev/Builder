export type StudioMode = 'beginner' | 'pro';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type ActiveTab = 'preview' | 'code' | 'split' | 'diff' | 'git' | 'components';

export interface ProjectFile {
  path: string;
  content: string;
  description?: string;
  isModified?: boolean;
}

export interface GitCommit {
  id: string;
  hash: string;
  branch: string;
  title: string;
  description: string;
  diffSummary: string;
  timestamp: string;
  author: string;
}

export interface CodeExplanation {
  beginnerSummary: string;
  keyConcepts: string[];
  proArchitecture: string;
}

export interface GeneratedProject {
  appName: string;
  description: string;
  files: ProjectFile[];
  previewHtml: string;
  gitCommit: {
    branch: string;
    title: string;
    description: string;
    diffSummary: string;
  };
  explanation: CodeExplanation;
  thinkingSteps?: string[];
}

export interface TemplatePreset {
  id: string;
  title: string;
  category: 'saas' | 'dashboard' | 'ecommerce' | 'kanban' | 'component';
  description: string;
  prompt: string;
  badge: string;
  icon: string;
  tags: string[];
}

export interface ComplexComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
  previewHtml: string;
  gitCommitMessage: string;
}
