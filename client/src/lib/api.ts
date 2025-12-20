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
  const res = await fetch('/api/blog/all');
  if (!res.ok) throw new Error('Failed to fetch blog posts');
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