import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2, RefreshCw, User, Briefcase, FolderOpen, FileText, Award, Link2, Loader2, CheckCircle, AlertCircle, Edit, Settings, Linkedin, Github, LayoutGrid, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';
import { 
  fetchProfile, 
  fetchProjects, 
  fetchBlogPosts, 
  fetchExperience, 
  fetchSkills, 
  fetchSocials,
  fetchLinkedinPosts,
  fetchAboutBlocks,
  syncGithubContributions,
  fetchSiteConfig,
  updateSiteConfig,
  fetchProjectSections,
  createProjectSection,
  updateProjectSection,
  deleteProjectSection
} from '@/lib/api';
import Footer from '@/components/Footer';

function StatusMessage({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-xl ${type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

type TabType = 'profile' | 'siteconfig' | 'about' | 'projects' | 'blog' | 'experience' | 'skills' | 'socials' | 'linkedin' | 'settings';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const queryClient = useQueryClient();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'siteconfig', label: 'Hero & SEO', icon: Settings },
    { id: 'about', label: 'About Page', icon: LayoutGrid },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'socials', label: 'Social Links', icon: Link2 },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <Link href="/">
              <button className="flex items-center gap-2 text-black/60 hover:text-black mb-8 transition-colors" data-testid="link-back-home">
                <ArrowLeft className="w-5 h-5" /> Back to Site
              </button>
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
              }}
              className="flex items-center gap-2 text-black/60 hover:text-red-600 mb-8 transition-colors"
            >
              Logout
            </button>
          </div>

          <h1 className="font-display text-5xl md:text-7xl mt-4 mb-8 leading-[0.9] tracking-tighter">
            Code <span className="text-black/40">Captain</span>
          </h1>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black/60 hover:bg-black/5'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm">
          {activeTab === 'profile' && <ProfileEditor />}
          {activeTab === 'siteconfig' && <SiteConfigEditor />}
          {activeTab === 'about' && <AboutBlocksEditor />}
          {activeTab === 'projects' && <ProjectsEditor />}
          {activeTab === 'blog' && <BlogEditor />}
          {activeTab === 'experience' && <ExperienceEditor />}
          {activeTab === 'skills' && <SkillsEditor />}
          {activeTab === 'socials' && <SocialsEditor />}
          {activeTab === 'linkedin' && <LinkedInPostsEditor />}
          {activeTab === 'settings' && <SettingsEditor />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ProfileEditor() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });
  const [formData, setFormData] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setFormData(null);
    },
  });

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const result = await syncGithubContributions();
      queryClient.invalidateQueries({ queryKey: ['github-contributions'] });
      setSyncStatus({ type: 'success', message: `Successfully synced ${result.count || 0} GitHub contributions!` });
    } catch (error) {
      setSyncStatus({ type: 'error', message: 'Failed to sync GitHub contributions. Please try again.' });
    }
    setSyncing(false);
  };

  const validateForm = () => {
    const d = formData || profile;
    return d?.name?.trim() && d?.email?.trim();
  };

  if (isLoading) return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;

  const data = formData || profile;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display mb-6">Edit Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black/60 mb-2">Name *</label>
          <input
            type="text"
            value={data?.name || ''}
            onChange={(e) => setFormData({ ...data, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black/60 mb-2">Role</label>
          <input
            type="text"
            value={data?.role || ''}
            onChange={(e) => setFormData({ ...data, role: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-role"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black/60 mb-2">Email *</label>
          <input
            type="email"
            value={data?.email || ''}
            onChange={(e) => setFormData({ ...data, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black/60 mb-2">Profile Image URL</label>
          <input
            type="text"
            value={data?.profileImage || ''}
            onChange={(e) => setFormData({ ...data, profileImage: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-profile-image"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black/60 mb-2">Location</label>
          <input
            type="text"
            value={data?.location || ''}
            onChange={(e) => setFormData({ ...data, location: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black/60 mb-2">Years of Experience</label>
          <input
            type="number"
            value={data?.yearsExperience || 0}
            onChange={(e) => setFormData({ ...data, yearsExperience: parseInt(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-years"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black/60 mb-2">Projects Shipped</label>
          <input
            type="number"
            value={data?.projectsShipped || 0}
            onChange={(e) => setFormData({ ...data, projectsShipped: parseInt(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-projects"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black/60 mb-2">Bio</label>
        <textarea
          value={data?.bio || ''}
          onChange={(e) => setFormData({ ...data, bio: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
          data-testid="input-bio"
        />
      </div>

      <div className="flex flex-wrap gap-4 pt-4">
        <button
          onClick={() => updateMutation.mutate(formData)}
          disabled={updateMutation.isPending || !formData || !validateForm()}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/80 disabled:opacity-50"
          data-testid="button-save-profile"
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 disabled:opacity-50"
          data-testid="button-sync-github"
        >
          {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Sync GitHub
        </button>
      </div>

      {updateMutation.isSuccess && <StatusMessage type="success" message="Profile updated successfully!" />}
      {updateMutation.isError && <StatusMessage type="error" message="Failed to update profile. Please try again." />}
      {syncStatus && <StatusMessage type={syncStatus.type} message={syncStatus.message} />}
    </div>
  );
}

function ProjectsEditor() {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [managingSections, setManagingSections] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Project created successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to create project.' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Project updated successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to update project.' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setStatus({ type: 'success', message: 'Project deleted successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to delete project.' }),
  });

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({ ...project, technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '' });
    setStatus(null);
  };

  const handleSave = () => {
    if (!formData?.title?.trim()) {
      setStatus({ type: 'error', message: 'Title is required.' });
      return;
    }
    const techStr = formData.technologies || '';
    const data = {
      ...formData,
      technologies: techStr.split(',').map((t: string) => t.trim()).filter(Boolean),
    };
    if (editingId === 'new') {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: editingId!, data });
    }
  };

  if (isLoading) return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display">Manage Projects</h2>
        <button
          onClick={() => {
            setEditingId('new');
            setFormData({ title: '', description: '', technologies: '', color: 'bg-gray-50', featured: false, order: projects.length + 1 });
            setStatus(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-black/80"
          data-testid="button-add-project"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {status && <StatusMessage type={status.type} message={status.message} />}

      {editingId && (
        <div className="bg-black/5 p-6 rounded-2xl space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title *"
              value={formData?.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-project-title"
            />
            <input
              type="text"
              placeholder="Technologies (comma separated)"
              value={formData?.technologies || ''}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-project-tech"
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData?.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-project-desc"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData?.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              Featured
            </label>
            <select
              value={formData?.color || 'bg-gray-50'}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="px-4 py-2 rounded-xl border border-black/10"
            >
              <option value="bg-blue-50">Blue</option>
              <option value="bg-green-50">Green</option>
              <option value="bg-purple-50">Purple</option>
              <option value="bg-orange-50">Orange</option>
              <option value="bg-pink-50">Pink</option>
              <option value="bg-gray-50">Gray</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending || !formData?.title?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium disabled:opacity-50"
              data-testid="button-save-project"
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId === 'new' ? 'Create' : 'Update'}
            </button>
            <button
              onClick={() => { setEditingId(null); setFormData(null); setStatus(null); }}
              className="px-4 py-2 bg-black/10 rounded-full font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((project: any) => (
          <div key={project.id}>
            <div className="flex items-center justify-between p-4 bg-black/5 rounded-xl">
              <div className="flex-1">
                <h3 className="font-bold">{project.title}</h3>
                <p className="text-sm text-black/60">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setManagingSections(managingSections === project.id ? null : project.id)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Manage Content
                </button>
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 hover:bg-black/10 rounded-lg"
                  data-testid={`button-edit-project-${project.id}`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(project.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  data-testid={`button-delete-project-${project.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {managingSections === project.id && (
              <div className="mt-2 p-4 bg-white rounded-xl border border-black/10">
                <ProjectSectionsManager projectId={project.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogEditor() {
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading } = useQuery({ queryKey: ['blog-posts'], queryFn: fetchBlogPosts });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Blog post created successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to create blog post.' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Blog post updated successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to update blog post.' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setStatus({ type: 'success', message: 'Blog post deleted successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to delete blog post.' }),
  });

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setFormData({ ...post, tags: post.tags.join(', ') });
    setStatus(null);
  };

  const handleSave = () => {
    if (!formData?.title?.trim()) {
      setStatus({ type: 'error', message: 'Title is required.' });
      return;
    }
    const data = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    };
    if (editingId === 'new') {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: editingId!, data });
    }
  };

  if (isLoading) return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display">Manage Blog Posts</h2>
        <button
          onClick={() => {
            setEditingId('new');
            setFormData({ title: '', excerpt: '', content: '', tags: '', published: true });
            setStatus(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-black/80"
          data-testid="button-add-post"
        >
          <Plus className="w-4 h-4" /> Add Post
        </button>
      </div>

      {status && <StatusMessage type={status.type} message={status.message} />}

      {editingId && (
        <div className="bg-black/5 p-6 rounded-2xl space-y-4 mb-6">
          <input
            type="text"
            placeholder="Title *"
            value={formData?.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-post-title"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={formData?.tags || ''}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-post-tags"
          />
          <textarea
            placeholder="Excerpt"
            value={formData?.excerpt || ''}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-post-excerpt"
          />
          <textarea
            placeholder="Full content"
            value={formData?.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-post-content"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData?.published || false}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4"
            />
            Published
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending || !formData?.title?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium disabled:opacity-50"
              data-testid="button-save-post"
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId === 'new' ? 'Create' : 'Update'}
            </button>
            <button
              onClick={() => { setEditingId(null); setFormData(null); setStatus(null); }}
              className="px-4 py-2 bg-black/10 rounded-full font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {posts.map((post: any) => (
          <div key={post.id} className="flex items-center justify-between p-4 bg-black/5 rounded-xl">
            <div>
              <h3 className="font-bold">{post.title}</h3>
              <p className="text-sm text-black/60">{post.excerpt}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(post)}
                className="p-2 hover:bg-black/10 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(post.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceEditor() {
  const queryClient = useQueryClient();
  const { data: experience = [], isLoading } = useQuery({ queryKey: ['experience'], queryFn: fetchExperience });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Experience added successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to add experience.' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/experience/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Experience updated successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to update experience.' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      setStatus({ type: 'success', message: 'Experience deleted successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to delete experience.' }),
  });

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setFormData({ ...exp, highlights: Array.isArray(exp.highlights) ? exp.highlights.join('\n') : '' });
    setStatus(null);
  };

  const handleSave = () => {
    if (!formData?.role?.trim() || !formData?.company?.trim()) {
      setStatus({ type: 'error', message: 'Role and Company are required.' });
      return;
    }
    const highlightsStr = formData.highlights || '';
    const data = {
      ...formData,
      highlights: highlightsStr.split('\n').map((h: string) => h.trim()).filter(Boolean),
    };
    if (editingId === 'new') {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: editingId!, data });
    }
  };

  if (isLoading) return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display">Manage Experience</h2>
        <button
          onClick={() => {
            setEditingId('new');
            setFormData({ role: '', company: '', location: '', period: '', highlights: '', current: false, order: experience.length + 1 });
            setStatus(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-black/80"
          data-testid="button-add-experience"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {status && <StatusMessage type={status.type} message={status.message} />}

      {editingId && (
        <div className="bg-black/5 p-6 rounded-2xl space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Role *"
              value={formData?.role || ''}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-exp-role"
            />
            <input
              type="text"
              placeholder="Company *"
              value={formData?.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-exp-company"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData?.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-exp-location"
            />
            <input
              type="text"
              placeholder="Period (e.g., 2021 – 2023)"
              value={formData?.period || ''}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-exp-period"
            />
          </div>
          <textarea
            placeholder="Highlights (one per line)"
            value={formData?.highlights || ''}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-exp-highlights"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData?.current || false}
              onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
              className="w-4 h-4"
            />
            Current Position
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending || !formData?.role?.trim() || !formData?.company?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium disabled:opacity-50"
              data-testid="button-save-experience"
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId === 'new' ? 'Add' : 'Update'}
            </button>
            <button
              onClick={() => { setEditingId(null); setFormData(null); setStatus(null); }}
              className="px-4 py-2 bg-black/10 rounded-full font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {experience.map((exp: any) => (
          <div key={exp.id} className="flex items-center justify-between p-4 bg-black/5 rounded-xl">
            <div>
              <h3 className="font-bold">{exp.role}</h3>
              <p className="text-sm text-black/60">{exp.company} - {exp.period}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(exp)}
                className="p-2 hover:bg-black/10 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(exp.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsEditor() {
  const queryClient = useQueryClient();
  const { data: skills = [], isLoading } = useQuery({ queryKey: ['skills'], queryFn: fetchSkills });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Skill added successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to add skill.' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Skill updated successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to update skill.' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setStatus({ type: 'success', message: 'Skill deleted successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to delete skill.' }),
  });

  const handleEdit = (skill: any) => {
    setEditingId(skill.id);
    setFormData({ ...skill });
  };

  const handleSave = () => {
    if (!formData?.name?.trim()) {
      setStatus({ type: 'error', message: 'Skill name is required.' });
      return;
    }
    if (editingId === 'new') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id: editingId!, data: formData });
    }
  };

  if (isLoading) return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;

  const categories: string[] = Array.from(new Set(skills.map((s: any) => s.category as string)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display">Manage Skills</h2>
        <button
          onClick={() => {
            setEditingId('new');
            setFormData({ name: '', category: 'Frontend', order: skills.length + 1 });
            setStatus(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-black/80"
          data-testid="button-add-skill"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {status && <StatusMessage type={status.type} message={status.message} />}

      {editingId && (
        <div className="bg-black/5 p-6 rounded-2xl space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Skill name *"
              value={formData?.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-skill-name"
            />
            <select
              value={formData?.category || 'Frontend'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10"
              data-testid="select-skill-category"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps">DevOps</option>
              <option value="Design">Design</option>
              <option value="Tools">Tools</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending || !formData?.name?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium disabled:opacity-50"
              data-testid="button-save-skill"
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId === 'new' ? 'Add' : 'Update'}
            </button>
            <button
              onClick={() => { setEditingId(null); setFormData(null); setStatus(null); }}
              className="px-4 py-2 bg-black/10 rounded-full font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {categories.map((category: string) => (
        <div key={category} className="mb-6">
          <h3 className="font-bold text-lg mb-3">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {skills.filter((s: any) => s.category === category).map((skill: any) => (
              <div key={skill.id} className="flex items-center gap-2 px-3 py-2 bg-black/5 rounded-full group">
                <span>{skill.name}</span>
                <button
                  onClick={() => handleEdit(skill)}
                  className="opacity-0 group-hover:opacity-100 text-black/60 hover:text-black transition-opacity"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(skill.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SocialsEditor() {
  const queryClient = useQueryClient();
  const { data: socials = [], isLoading } = useQuery({ queryKey: ['socials'], queryFn: fetchSocials });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/socials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socials'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Social link added successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to add social link.' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/socials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socials'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Social link updated successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to update social link.' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/socials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socials'] });
      setStatus({ type: 'success', message: 'Social link deleted successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to delete social link.' }),
  });

  const handleEdit = (social: any) => {
    setEditingId(social.id);
    setFormData({ ...social });
    setStatus(null);
  };

  const handleSave = () => {
    if (!formData?.platform?.trim() || !formData?.href?.trim()) {
      setStatus({ type: 'error', message: 'Platform and URL are required.' });
      return;
    }
    if (editingId === 'new') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id: editingId!, data: formData });
    }
  };

  if (isLoading) return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display">Manage Social Links</h2>
        <button
          onClick={() => {
            setEditingId('new');
            setFormData({ platform: '', label: '', value: '', href: '', order: socials.length + 1 });
            setStatus(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-black/80"
          data-testid="button-add-social"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      {status && <StatusMessage type={status.type} message={status.message} />}

      {editingId && (
        <div className="bg-black/5 p-6 rounded-2xl space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Platform * (e.g., Twitter)"
              value={formData?.platform || ''}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-social-platform"
            />
            <input
              type="text"
              placeholder="Label"
              value={formData?.label || ''}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-social-label"
            />
            <input
              type="text"
              placeholder="Display value"
              value={formData?.value || ''}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-social-value"
            />
            <input
              type="url"
              placeholder="URL *"
              value={formData?.href || ''}
              onChange={(e) => setFormData({ ...formData, href: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-social-href"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending || !formData?.platform?.trim() || !formData?.href?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium disabled:opacity-50"
              data-testid="button-save-social"
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId === 'new' ? 'Add' : 'Update'}
            </button>
            <button
              onClick={() => { setEditingId(null); setFormData(null); setStatus(null); }}
              className="px-4 py-2 bg-black/10 rounded-full font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {socials.map((social: any) => (
          <div key={social.id} className="flex items-center justify-between p-4 bg-black/5 rounded-xl">
            <div>
              <h3 className="font-bold">{social.platform}</h3>
              <p className="text-sm text-black/60">{social.value}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(social)}
                className="p-2 hover:bg-black/10 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(social.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkedInPostsEditor() {
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading } = useQuery({ queryKey: ['linkedin-posts'], queryFn: fetchLinkedinPosts });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/linkedin-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'LinkedIn post added successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to add post.' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/linkedin-posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Post updated successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to update post.' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/linkedin-posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts'] });
      setStatus({ type: 'success', message: 'Post deleted successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to delete post.' }),
  });

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setFormData({ ...post });
  };

  const handleSave = () => {
    if (!formData?.content?.trim()) {
      setStatus({ type: 'error', message: 'Content is required.' });
      return;
    }
    if (editingId === 'new') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id: editingId!, data: formData });
    }
  };

  if (isLoading) return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display">LinkedIn Posts</h2>
        <button
          onClick={() => {
            setEditingId('new');
            setFormData({ content: '', date: 'Just now', likes: 0, comments: 0 });
            setStatus(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-black/80"
          data-testid="button-add-linkedin-post"
        >
          <Plus className="w-4 h-4" /> Add Post
        </button>
      </div>

      <p className="text-black/60 text-sm mb-4">
        Manage LinkedIn posts displayed on your portfolio. These are manually added posts to showcase your professional activity.
      </p>

      {status && <StatusMessage type={status.type} message={status.message} />}

      {editingId && (
        <div className="bg-black/5 p-6 rounded-2xl space-y-4 mb-6">
          <textarea
            placeholder="Post content *"
            value={formData?.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none min-h-[100px]"
            data-testid="input-linkedin-content"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Date (e.g., '2 days ago')"
              value={formData?.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-linkedin-date"
            />
            <input
              type="number"
              placeholder="Likes"
              value={formData?.likes || 0}
              onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-linkedin-likes"
            />
            <input
              type="number"
              placeholder="Comments"
              value={formData?.comments || 0}
              onChange={(e) => setFormData({ ...formData, comments: parseInt(e.target.value) || 0 })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              data-testid="input-linkedin-comments"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending || !formData?.content?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium disabled:opacity-50"
              data-testid="button-save-linkedin-post"
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId === 'new' ? 'Add' : 'Update'}
            </button>
            <button
              onClick={() => { setEditingId(null); setFormData(null); setStatus(null); }}
              className="px-4 py-2 bg-black/10 rounded-full font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post.id} className="p-6 bg-black/5 rounded-2xl">
            <p className="mb-4">{post.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm text-black/60">
                <span>{post.date}</span>
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 hover:bg-black/10 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(post.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsEditor() {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSyncGithub = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const result = await syncGithubContributions();
      queryClient.invalidateQueries({ queryKey: ['github-contributions'] });
      setSyncStatus({ type: 'success', message: `Successfully synced ${result.count || 0} GitHub contributions!` });
    } catch (error) {
      setSyncStatus({ type: 'error', message: 'Failed to sync GitHub contributions. Make sure the GitHub integration is connected.' });
    }
    setSyncing(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display mb-6">Settings & Integrations</h2>

      {syncStatus && <StatusMessage type={syncStatus.type} message={syncStatus.message} />}

      <div className="bg-black/5 p-6 rounded-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <Github className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">GitHub Integration</h3>
            <p className="text-sm text-black/60">Sync your contribution graph from GitHub</p>
          </div>
        </div>
        <p className="text-black/60 mb-4">
          Your GitHub contribution data is synced automatically via the Replit GitHub connector. 
          Click the button below to manually refresh your contribution graph.
        </p>
        <button
          onClick={handleSyncGithub}
          disabled={syncing}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/80 disabled:opacity-50"
          data-testid="button-sync-github"
        >
          {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {syncing ? 'Syncing...' : 'Sync GitHub Contributions'}
        </button>
      </div>

      <div className="bg-black/5 p-6 rounded-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-[#0A66C2] rounded-full flex items-center justify-center">
            <Linkedin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">LinkedIn Integration</h3>
            <p className="text-sm text-black/60">Manage your LinkedIn posts showcase</p>
          </div>
        </div>
        <p className="text-black/60 mb-4">
          LinkedIn posts are manually managed through the LinkedIn tab. Add posts you want to showcase on your portfolio.
          Due to LinkedIn API restrictions, automatic syncing is not available.
        </p>
        <Link href="#" onClick={() => {}}>
          <span className="text-black font-medium hover:underline">
            Go to LinkedIn Posts tab to manage posts
          </span>
        </Link>
      </div>

      <div className="bg-black/5 p-6 rounded-2xl">
        <h3 className="font-bold text-lg mb-4">Environment Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-black/60">Admin Credentials</span>
            <span className="font-mono bg-green-100 text-green-700 px-2 py-1 rounded">Configured</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/60">Database</span>
            <span className="font-mono bg-green-100 text-green-700 px-2 py-1 rounded">Connected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/60">GitHub Connector</span>
            <span className="font-mono bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteConfigEditor() {
  const queryClient = useQueryClient();
  const { data: config, isLoading } = useQuery({ queryKey: ['site-config'], queryFn: fetchSiteConfig });
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return updateSiteConfig(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-config'] });
      setFormData(null);
      setStatus({ type: 'success', message: 'Site configuration updated successfully!' });
      // Reload the page to apply SEO changes
      setTimeout(() => window.location.reload(), 1500);
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to update site configuration.' }),
  });

  const handleSave = () => {
    if (!formData) return;
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;

  const data = formData || config;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display mb-6">Hero Section & SEO Settings</h2>

      <p className="text-black/60 text-sm mb-4">
        Configure the hero section and SEO metadata for your portfolio. These settings are stored in a JSON file.
      </p>

      {status && <StatusMessage type={status.type} message={status.message} />}

      {/* Hero Section */}
      <div className="bg-black/5 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-lg mb-4">Hero Section</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">Main Title</label>
            <input
              type="text"
              value={data?.hero?.title || ''}
              onChange={(e) => setFormData({ ...data, hero: { ...data.hero, title: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              placeholder="CREATIVE"
              data-testid="input-hero-title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">Subtitle</label>
            <input
              type="text"
              value={data?.hero?.subtitle || ''}
              onChange={(e) => setFormData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              placeholder="ENGINEER"
              data-testid="input-hero-subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">Description</label>
            <input
              type="text"
              value={data?.hero?.description || ''}
              onChange={(e) => setFormData({ ...data, hero: { ...data.hero, description: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              placeholder="Full Stack Developer"
              data-testid="input-hero-description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">Established Text</label>
            <input
              type="text"
              value={data?.hero?.established || ''}
              onChange={(e) => setFormData({ ...data, hero: { ...data.hero, established: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              placeholder="EST. 2024"
              data-testid="input-hero-established"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">Version Text</label>
            <input
              type="text"
              value={data?.hero?.version || ''}
              onChange={(e) => setFormData({ ...data, hero: { ...data.hero, version: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              placeholder="PORTFOLIO V1"
              data-testid="input-hero-version"
            />
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-black/5 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-lg mb-4">SEO Settings</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">Page Title</label>
            <input
              type="text"
              value={data?.seo?.title || ''}
              onChange={(e) => setFormData({ ...data, seo: { ...data.seo, title: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              placeholder="ZEEDIE | Creative Engineer"
              data-testid="input-seo-title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">Meta Description</label>
            <textarea
              value={data?.seo?.description || ''}
              onChange={(e) => setFormData({ ...data, seo: { ...data.seo, description: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              rows={2}
              placeholder="Portfolio of ZEEDIE - Full Stack Developer & UI/UX Specialist"
              data-testid="input-seo-description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">Keywords (comma separated)</label>
            <input
              type="text"
              value={data?.seo?.keywords || ''}
              onChange={(e) => setFormData({ ...data, seo: { ...data.seo, keywords: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              placeholder="full stack developer, web developer, UI/UX"
              data-testid="input-seo-keywords"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">Author</label>
            <input
              type="text"
              value={data?.seo?.author || ''}
              onChange={(e) => setFormData({ ...data, seo: { ...data.seo, author: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              placeholder="ZEEDIE"
              data-testid="input-seo-author"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">OG Image Path</label>
            <input
              type="text"
              value={data?.seo?.ogImage || ''}
              onChange={(e) => setFormData({ ...data, seo: { ...data.seo, ogImage: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
              placeholder="/opengraph.jpg"
              data-testid="input-seo-ogimage"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending || !formData}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/80 disabled:opacity-50"
          data-testid="button-save-siteconfig"
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
        {formData && (
          <button
            onClick={() => { setFormData(null); setStatus(null); }}
            className="px-6 py-3 bg-black/10 rounded-full font-medium"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function ProjectSectionsManager({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['project-sections', projectId],
    queryFn: () => fetchProjectSections(projectId),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: any) => createProjectSection(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-sections', projectId] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Section created successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to create section.' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => updateProjectSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-sections', projectId] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Section updated successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to update section.' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteProjectSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-sections', projectId] });
      setStatus({ type: 'success', message: 'Section deleted successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to delete section.' }),
  });

  const handleEdit = (section: any) => {
    setEditingId(section.id);
    setFormData({ ...section });
    setStatus(null);
  };

  const handleSave = () => {
    if (!formData?.content?.trim()) {
      setStatus({ type: 'error', message: 'Content is required.' });
      return;
    }
    if (editingId === 'new') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id: editingId!, data: formData });
    }
  };

  if (isLoading) return <Loader2 className="w-5 h-5 animate-spin" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Project Content Sections</h3>
        <button
          onClick={() => {
            setEditingId('new');
            setFormData({ title: '', content: '', imageUrl: '', imageAlignment: '', imageCaption: '', order: sections.length });
            setStatus(null);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-sm hover:bg-black/80"
        >
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </div>

      {status && <StatusMessage type={status.type} message={status.message} />}

      {editingId && (
        <div className="bg-black/5 p-4 rounded-xl space-y-4">
          <input
            type="text"
            placeholder="Section Title (optional)"
            value={formData?.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
          />

          <textarea
            placeholder="Section Content *"
            value={formData?.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none min-h-[200px]"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={formData?.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            />
            <select
              value={formData?.imageAlignment || ''}
              onChange={(e) => setFormData({ ...formData, imageAlignment: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            >
              <option value="">No Image</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left (text wraps)</option>
              <option value="right">Right (text wraps)</option>
              <option value="center">Center</option>
            </select>
            <input
              type="text"
              placeholder="Image caption (optional)"
              value={formData?.imageCaption || ''}
              onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
              className="px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending || !formData?.content?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId === 'new' ? 'Create' : 'Update'}
            </button>
            <button
              onClick={() => { setEditingId(null); setFormData(null); setStatus(null); }}
              className="px-4 py-2 bg-black/10 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sections.map((section: any) => (
          <div key={section.id} className="flex items-start justify-between p-3 bg-white rounded-lg border border-black/10">
            <div className="flex-1">
              <h4 className="font-medium">{section.title || 'Untitled Section'}</h4>
              <div className="text-sm text-black/60 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: section.content }} />
              {section.imageUrl && (
                <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Image: {section.imageAlignment || 'top'}
                </span>
              )}
            </div>
            <div className="flex gap-1 ml-4">
              <button
                onClick={() => handleEdit(section)}
                className="p-2 hover:bg-black/5 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteMutation.mutate(section.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {sections.length === 0 && !editingId && (
          <p className="text-center text-black/40 py-8">No sections yet. Add your first section above.</p>
        )}
      </div>
    </div>
  );
}

function AboutBlocksEditor() {
  const queryClient = useQueryClient();
  const { data: blocks = [], isLoading } = useQuery({ queryKey: ['about-blocks'], queryFn: fetchAboutBlocks });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/about-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-blocks'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Block added successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to add block.' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/about-blocks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-blocks'] });
      setFormData(null);
      setEditingId(null);
      setStatus({ type: 'success', message: 'Block updated successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to update block.' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/about-blocks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-blocks'] });
      setStatus({ type: 'success', message: 'Block deleted successfully!' });
    },
    onError: () => setStatus({ type: 'error', message: 'Failed to delete block.' }),
  });

  const handleEdit = (block: any) => {
    setEditingId(block.id);
    setFormData({ ...block });
  };

  const handleSave = () => {
    if (!formData?.title?.trim() || !formData?.content?.trim()) {
      setStatus({ type: 'error', message: 'Title and content are required.' });
      return;
    }
    if (editingId === 'new') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id: editingId!, data: formData });
    }
  };

  if (isLoading) return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display">About Page Blocks</h2>
        <button
          onClick={() => {
            setEditingId('new');
            setFormData({ title: '', content: '', style: 'light', imageUrl: '', imagePosition: '', order: blocks.length });
            setStatus(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-black/80"
          data-testid="button-add-about-block"
        >
          <Plus className="w-4 h-4" /> Add Block
        </button>
      </div>

      <p className="text-black/60 text-sm mb-4">
        Add content blocks to your About page. You can add text sections with optional images positioned on any side.
      </p>

      {status && <StatusMessage type={status.type} message={status.message} />}

      {editingId && (
        <div className="bg-black/5 p-6 rounded-2xl space-y-4 mb-6">
          <input
            type="text"
            placeholder="Block Title *"
            value={formData?.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
            data-testid="input-about-title"
          />
          <textarea
            placeholder="Content *"
            value={formData?.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none min-h-[120px]"
            data-testid="input-about-content"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-black/60 mb-1 block">Style</label>
              <select
                value={formData?.style || 'light'}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
                data-testid="select-about-style"
              >
                <option value="light">Light Background</option>
                <option value="dark">Dark Background</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-black/60 mb-1 block">Image URL (optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData?.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
                data-testid="input-about-image"
              />
            </div>
            <div>
              <label className="text-sm text-black/60 mb-1 block">Image Position</label>
              <select
                value={formData?.imagePosition || ''}
                onChange={(e) => setFormData({ ...formData, imagePosition: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
                data-testid="select-about-image-position"
              >
                <option value="">No Image</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending || !formData?.title?.trim() || !formData?.content?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium disabled:opacity-50"
              data-testid="button-save-about-block"
            >
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId === 'new' ? 'Add' : 'Update'}
            </button>
            <button
              onClick={() => { setEditingId(null); setFormData(null); setStatus(null); }}
              className="px-4 py-2 bg-black/10 rounded-full font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {blocks.map((block: any) => (
          <div key={block.id} className={`p-6 rounded-2xl ${block.style === 'dark' ? 'bg-black text-white' : 'bg-black/5'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{block.title}</h3>
                <p className={`text-sm line-clamp-2 ${block.style === 'dark' ? 'text-white/70' : 'text-black/60'}`}>{block.content}</p>
                <div className="flex gap-2 mt-2 text-xs">
                  {block.imageUrl && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Image: {block.imagePosition}</span>}
                  <span className={`px-2 py-1 rounded ${block.style === 'dark' ? 'bg-white/20' : 'bg-black/10'}`}>Order: {block.order}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(block)}
                  className={`p-2 rounded-lg ${block.style === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(block.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="text-center py-12 text-black/40">
            No blocks yet. Add your first About page block above.
          </div>
        )}
      </div>
    </div>
  );
}