import { 
  type User, 
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Project,
  type InsertProject,
  type BlogPost,
  type InsertBlogPost,
  type Experience,
  type InsertExperience,
  type Skill,
  type InsertSkill,
  type Social,
  type InsertSocial,
  type FooterLink,
  type InsertFooterLink,
  type LinkedinPost,
  type InsertLinkedinPost,
  type GithubContribution,
  type InsertGithubContribution,
  users,
  profile,
  projects,
  blogPosts,
  experience,
  skills,
  socials,
  footerLinks,
  linkedinPosts,
  githubContributions
} from "@shared/schema";
import { db } from "@db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile methods
  getProfile(): Promise<Profile | undefined>;
  updateProfile(data: InsertProfile): Promise<Profile>;

  // Project methods
  getAllProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Experience methods
  getAllExperience(): Promise<Experience[]>;
  getExperienceById(id: string): Promise<Experience | undefined>;
  createExperience(exp: InsertExperience): Promise<Experience>;
  updateExperience(id: string, exp: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: string): Promise<boolean>;

  // Skills methods
  getAllSkills(): Promise<Skill[]>;
  getSkillsByCategory(category: string): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<boolean>;

  // Socials methods
  getAllSocials(): Promise<Social[]>;
  createSocial(social: InsertSocial): Promise<Social>;
  updateSocial(id: string, social: Partial<InsertSocial>): Promise<Social | undefined>;
  deleteSocial(id: string): Promise<boolean>;

  // Footer links methods
  getAllFooterLinks(): Promise<FooterLink[]>;
  createFooterLink(link: InsertFooterLink): Promise<FooterLink>;
  deleteFooterLink(id: string): Promise<boolean>;

  // LinkedIn posts methods
  getAllLinkedinPosts(): Promise<LinkedinPost[]>;
  createLinkedinPost(post: InsertLinkedinPost): Promise<LinkedinPost>;

  // GitHub contributions methods
  getAllGithubContributions(): Promise<GithubContribution[]>;
  createGithubContribution(contribution: InsertGithubContribution): Promise<GithubContribution>;
  clearGithubContributions(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    const [profileData] = await db.select().from(profile).limit(1);
    return profileData;
  }

  async updateProfile(data: InsertProfile): Promise<Profile> {
    const existing = await this.getProfile();
    if (existing) {
      const [updated] = await db.update(profile).set(data).where(eq(profile.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(profile).values(data).returning();
      return created;
    }
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(projects.order, desc(projects.createdAt));
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.featured, true)).orderBy(projects.order);
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.publishedDate));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedDate));
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Experience methods
  async getAllExperience(): Promise<Experience[]> {
    return db.select().from(experience).orderBy(experience.order, desc(experience.createdAt));
  }

  async getExperienceById(id: string): Promise<Experience | undefined> {
    const [exp] = await db.select().from(experience).where(eq(experience.id, id)).limit(1);
    return exp;
  }

  async createExperience(exp: InsertExperience): Promise<Experience> {
    const [created] = await db.insert(experience).values(exp).returning();
    return created;
  }

  async updateExperience(id: string, exp: Partial<InsertExperience>): Promise<Experience | undefined> {
    const [updated] = await db.update(experience).set(exp).where(eq(experience.id, id)).returning();
    return updated;
  }

  async deleteExperience(id: string): Promise<boolean> {
    const result = await db.delete(experience).where(eq(experience.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Skills methods
  async getAllSkills(): Promise<Skill[]> {
    return db.select().from(skills).orderBy(skills.category, skills.order);
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return db.select().from(skills).where(eq(skills.category, category)).orderBy(skills.order);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [created] = await db.insert(skills).values(skill).returning();
    return created;
  }

  async updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [updated] = await db.update(skills).set(skill).where(eq(skills.id, id)).returning();
    return updated;
  }

  async deleteSkill(id: string): Promise<boolean> {
    const result = await db.delete(skills).where(eq(skills.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Socials methods
  async getAllSocials(): Promise<Social[]> {
    return db.select().from(socials).orderBy(socials.order);
  }

  async createSocial(social: InsertSocial): Promise<Social> {
    const [created] = await db.insert(socials).values(social).returning();
    return created;
  }

  async updateSocial(id: string, social: Partial<InsertSocial>): Promise<Social | undefined> {
    const [updated] = await db.update(socials).set(social).where(eq(socials.id, id)).returning();
    return updated;
  }

  async deleteSocial(id: string): Promise<boolean> {
    const result = await db.delete(socials).where(eq(socials.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Footer links methods
  async getAllFooterLinks(): Promise<FooterLink[]> {
    return db.select().from(footerLinks).orderBy(footerLinks.order);
  }

  async createFooterLink(link: InsertFooterLink): Promise<FooterLink> {
    const [created] = await db.insert(footerLinks).values(link).returning();
    return created;
  }

  async deleteFooterLink(id: string): Promise<boolean> {
    const result = await db.delete(footerLinks).where(eq(footerLinks.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // LinkedIn posts methods
  async getAllLinkedinPosts(): Promise<LinkedinPost[]> {
    return db.select().from(linkedinPosts).orderBy(desc(linkedinPosts.createdAt)).limit(10);
  }

  async createLinkedinPost(post: InsertLinkedinPost): Promise<LinkedinPost> {
    const [created] = await db.insert(linkedinPosts).values(post).returning();
    return created;
  }

  // GitHub contributions methods
  async getAllGithubContributions(): Promise<GithubContribution[]> {
    return db.select().from(githubContributions).orderBy(githubContributions.date);
  }

  async createGithubContribution(contribution: InsertGithubContribution): Promise<GithubContribution> {
    const [created] = await db.insert(githubContributions).values(contribution).returning();
    return created;
  }

  async clearGithubContributions(): Promise<boolean> {
    await db.delete(githubContributions);
    return true;
  }
}

export const storage = new DatabaseStorage();
