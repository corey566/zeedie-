import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keep existing for auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Profile/About Section
export const profile = pgTable("profile", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  email: text("email").notNull(),
  location: text("location"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  yearsExperience: integer("years_experience"),
  projectsShipped: integer("projects_shipped"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profile).omit({ id: true, updatedAt: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profile.$inferSelect;

// Projects
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies").array().notNull(),
  color: text("color").notNull().default('bg-gray-50'),
  featured: boolean("featured").notNull().default(false),
  projectUrl: text("project_url"),
  githubUrl: text("github_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().notNull(),
  published: boolean("published").notNull().default(true),
  publishedDate: timestamp("published_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, publishedDate: true, updatedAt: true });
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Experience
export const experience = pgTable("experience", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  period: text("period").notNull(),
  highlights: text("highlights").array().notNull(),
  order: integer("order").notNull().default(0),
  current: boolean("current").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExperienceSchema = createInsertSchema(experience).omit({ id: true, createdAt: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experience.$inferSelect;

// Skills
export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  order: integer("order").notNull().default(0),
});

export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

// Contact Info / Socials
export const socials = pgTable("socials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  href: text("href").notNull(),
  order: integer("order").notNull().default(0),
});

export const insertSocialSchema = createInsertSchema(socials).omit({ id: true });
export type InsertSocial = z.infer<typeof insertSocialSchema>;
export type Social = typeof socials.$inferSelect;

// Footer Links
export const footerLinks = pgTable("footer_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  href: text("href").notNull(),
  order: integer("order").notNull().default(0),
});

export const insertFooterLinkSchema = createInsertSchema(footerLinks).omit({ id: true });
export type InsertFooterLink = z.infer<typeof insertFooterLinkSchema>;
export type FooterLink = typeof footerLinks.$inferSelect;

// LinkedIn Posts (cached from API)
export const linkedinPosts = pgTable("linkedin_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  date: text("date").notNull(),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  externalId: text("external_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLinkedinPostSchema = createInsertSchema(linkedinPosts).omit({ id: true, createdAt: true });
export type InsertLinkedinPost = z.infer<typeof insertLinkedinPostSchema>;
export type LinkedinPost = typeof linkedinPosts.$inferSelect;

// About Page Blocks
export const aboutBlocks = pgTable("about_blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  style: text("style").notNull().default('light'), // 'light' or 'dark'
  imageUrl: text("image_url"),
  imagePosition: text("image_position"), // 'top', 'bottom', 'left', 'right'
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAboutBlockSchema = createInsertSchema(aboutBlocks).omit({ id: true, createdAt: true });
export type InsertAboutBlock = z.infer<typeof insertAboutBlockSchema>;
export type AboutBlock = typeof aboutBlocks.$inferSelect;

// GitHub Contributions (cached from API)
export const githubContributions = pgTable("github_contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  count: integer("count").notNull().default(0),
  level: integer("level").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGithubContributionSchema = createInsertSchema(githubContributions).omit({ id: true, createdAt: true });
export type InsertGithubContribution = z.infer<typeof insertGithubContributionSchema>;
export type GithubContribution = typeof githubContributions.$inferSelect;
