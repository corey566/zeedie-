const API_BASE = '/api';

export async function fetchProfile() {
  const res = await fetch(`${API_BASE}/profile`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateProfile(data: any) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchFeaturedProjects() {
  const res = await fetch(`${API_BASE}/projects/featured`);
  if (!res.ok) throw new Error('Failed to fetch featured projects');
  return res.json();
}

export async function fetchBlogPosts() {
  const res = await fetch('/api/blog');
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return res.json();
}

export async function fetchAllBlogPosts() {
  const res = await fetch('/api/blog/all');
  if (!res.ok) throw new Error('Failed to fetch all blog posts');
  return res.json();
}

export async function fetchBlogPost(id: string) {
  const res = await fetch(`${API_BASE}/blog/${id}`);
  if (!res.ok) throw new Error('Failed to fetch blog post');
  return res.json();
}

export async function fetchExperience() {
  const res = await fetch(`${API_BASE}/experience`);
  if (!res.ok) throw new Error('Failed to fetch experience');
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch(`${API_BASE}/skills`);
  if (!res.ok) throw new Error('Failed to fetch skills');
  return res.json();
}

export async function fetchSocials() {
  const res = await fetch(`${API_BASE}/socials`);
  if (!res.ok) throw new Error('Failed to fetch socials');
  return res.json();
}

export async function fetchFooterLinks() {
  const res = await fetch(`${API_BASE}/footer-links`);
  if (!res.ok) throw new Error('Failed to fetch footer links');
  return res.json();
}

export async function fetchLinkedinPosts() {
  const res = await fetch(`${API_BASE}/linkedin-posts`);
  if (!res.ok) throw new Error('Failed to fetch LinkedIn posts');
  return res.json();
}

export async function fetchGithubContributions() {
  const res = await fetch(`${API_BASE}/github-contributions`);
  if (!res.ok) throw new Error('Failed to fetch GitHub contributions');
  return res.json();
}

export async function syncGithubContributions() {
  const res = await fetch(`${API_BASE}/github-sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sync GitHub contributions');
  return res.json();
}

export async function fetchAboutBlocks() {
  const res = await fetch(`${API_BASE}/about-blocks`);
  if (!res.ok) throw new Error('Failed to fetch about blocks');
  return res.json();
}

export async function fetchSiteConfig() {
  const res = await fetch(`${API_BASE}/site-config`);
  if (!res.ok) throw new Error('Failed to fetch site configuration');
  return res.json();
}

export async function updateSiteConfig(data: any) {
  const res = await fetch(`${API_BASE}/site-config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update site configuration');
  return res.json();
}

export async function fetchProjectSections(projectId: string) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/sections`);
  if (!res.ok) throw new Error('Failed to fetch project sections');
  return res.json();
}

export async function createProjectSection(projectId: string, data: any) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/sections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create project section');
  return res.json();
}

export async function updateProjectSection(id: string, data: any) {
  const res = await fetch(`${API_BASE}/project-sections/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update project section');
  return res.json();
}

export async function deleteProjectSection(id: string) {
  const res = await fetch(`${API_BASE}/project-sections/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete project section');
}

export async function fetchProject(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

// GitHub Integration
export async function syncRealGithubContributions(username?: string) {
  const res = await fetch(`${API_BASE}/github-sync-real`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: username ? JSON.stringify({ username }) : undefined,
  });
  if (!res.ok) throw new Error('Failed to sync GitHub contributions');
  return res.json();
}

export async function fetchGithubRepos(username?: string) {
  const url = username 
    ? `${API_BASE}/github-repos?username=${username}` 
    : `${API_BASE}/github-repos`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch GitHub repos');
  return res.json();
}

// Theme
export async function fetchTheme() {
  const res = await fetch(`${API_BASE}/theme`);
  if (!res.ok) throw new Error('Failed to fetch theme');
  return res.json();
}

export async function updateTheme(mode: 'light' | 'dark') {
  const res = await fetch(`${API_BASE}/theme`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode }),
  });
  if (!res.ok) throw new Error('Failed to update theme');
  return res.json();
}

// Resume/CV
export async function generateResume() {
  const res = await fetch(`${API_BASE}/resume/generate`);
  if (!res.ok) throw new Error('Failed to generate resume');
  return res.json();
}

// Data Export/Import
export async function exportAllData() {
  const res = await fetch(`${API_BASE}/export`);
  if (!res.ok) throw new Error('Failed to export data');
  return res.json();
}

export async function importAllData(data: any) {
  const res = await fetch(`${API_BASE}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to import data');
  return res.json();
}