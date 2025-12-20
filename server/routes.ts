import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { AUTH_CONFIG } from "./auth-config";
import { 
  insertProfileSchema,
  insertProjectSchema,
  insertBlogPostSchema,
  insertExperienceSchema,
  insertSkillSchema,
  insertSocialSchema,
  insertFooterLinkSchema
} from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      if (!AUTH_CONFIG.isConfigured()) {
        res.status(503).json({ error: "Admin credentials not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD environment variables." });
        return;
      }
      
      const { username, password } = req.body;
      
      if (username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
        const token = crypto.randomBytes(32).toString('hex');
        res.json({ token, success: true });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/admin/verify", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token && token.length === 64) {
        res.json({ valid: true });
      } else {
        res.status(401).json({ error: "Invalid token" });
      }
    } catch (error) {
      res.status(401).json({ error: "Verification failed" });
    }
  });

  // Profile routes
  app.get("/api/profile", async (_req, res) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    try {
      const data = insertProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(data);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update profile" });
      }
    }
  });

  // Project routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/featured", async (_req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProjectById(req.params.id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create project" });
      }
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const data = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, data);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update project" });
      }
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/all", async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post) {
        res.status(404).json({ error: "Blog post not found" });
        return;
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create blog post" });
      }
    }
  });

  app.put("/api/blog/:id", async (req, res) => {
    try {
      const data = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, data);
      if (!post) {
        res.status(404).json({ error: "Blog post not found" });
        return;
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update blog post" });
      }
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Blog post not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Experience routes
  app.get("/api/experience", async (_req, res) => {
    try {
      const experience = await storage.getAllExperience();
      res.json(experience);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experience" });
    }
  });

  app.post("/api/experience", async (req, res) => {
    try {
      const data = insertExperienceSchema.parse(req.body);
      const exp = await storage.createExperience(data);
      res.status(201).json(exp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create experience" });
      }
    }
  });

  app.put("/api/experience/:id", async (req, res) => {
    try {
      const data = insertExperienceSchema.partial().parse(req.body);
      const exp = await storage.updateExperience(req.params.id, data);
      if (!exp) {
        res.status(404).json({ error: "Experience not found" });
        return;
      }
      res.json(exp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update experience" });
      }
    }
  });

  app.delete("/api/experience/:id", async (req, res) => {
    try {
      const success = await storage.deleteExperience(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Experience not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete experience" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (_req, res) => {
    try {
      const skills = await storage.getAllSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const data = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(data);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create skill" });
      }
    }
  });

  app.put("/api/skills/:id", async (req, res) => {
    try {
      const data = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(req.params.id, data);
      if (!skill) {
        res.status(404).json({ error: "Skill not found" });
        return;
      }
      res.json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update skill" });
      }
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const success = await storage.deleteSkill(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Skill not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  // Socials routes
  app.get("/api/socials", async (_req, res) => {
    try {
      const socials = await storage.getAllSocials();
      res.json(socials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch socials" });
    }
  });

  app.post("/api/socials", async (req, res) => {
    try {
      const data = insertSocialSchema.parse(req.body);
      const social = await storage.createSocial(data);
      res.status(201).json(social);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create social" });
      }
    }
  });

  app.put("/api/socials/:id", async (req, res) => {
    try {
      const data = insertSocialSchema.partial().parse(req.body);
      const social = await storage.updateSocial(req.params.id, data);
      if (!social) {
        res.status(404).json({ error: "Social not found" });
        return;
      }
      res.json(social);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update social" });
      }
    }
  });

  app.delete("/api/socials/:id", async (req, res) => {
    try {
      const success = await storage.deleteSocial(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Social not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete social" });
    }
  });

  // Footer links routes
  app.get("/api/footer-links", async (_req, res) => {
    try {
      const links = await storage.getAllFooterLinks();
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch footer links" });
    }
  });

  app.post("/api/footer-links", async (req, res) => {
    try {
      const data = insertFooterLinkSchema.parse(req.body);
      const link = await storage.createFooterLink(data);
      res.status(201).json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create footer link" });
      }
    }
  });

  app.delete("/api/footer-links/:id", async (req, res) => {
    try {
      const success = await storage.deleteFooterLink(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Footer link not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete footer link" });
    }
  });

  // LinkedIn posts routes
  app.get("/api/linkedin-posts", async (_req, res) => {
    try {
      const posts = await storage.getAllLinkedinPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch LinkedIn posts" });
    }
  });

  // GitHub contributions routes
  app.get("/api/github-contributions", async (_req, res) => {
    try {
      const contributions = await storage.getAllGithubContributions();
      res.json(contributions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch GitHub contributions" });
    }
  });

  // GitHub sync route
  app.post("/api/github-sync", async (_req, res) => {
    try {
      const { getGitHubUsername, getGitHubContributions } = await import("./github");
      const username = await getGitHubUsername();
      
      if (!username) {
        res.status(400).json({ error: "GitHub not connected or username not available" });
        return;
      }

      const contributions = await getGitHubContributions(username);
      
      if (!contributions) {
        res.status(500).json({ error: "Failed to fetch contributions from GitHub" });
        return;
      }

      // Clear existing contributions and insert new ones
      await storage.clearGithubContributions();
      
      for (const contribution of contributions) {
        await storage.createGithubContribution(contribution);
      }

      res.json({ success: true, count: contributions.length });
    } catch (error) {
      console.error('GitHub sync error:', error);
      res.status(500).json({ error: "Failed to sync GitHub contributions" });
    }
  });

  return httpServer;
}
