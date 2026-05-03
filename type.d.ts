interface SkillRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: Array<string>;
  installCommand: string;
  createdAt: string | null;
  authorClerkId: string | null;
  authorEmail: string | null;
}
