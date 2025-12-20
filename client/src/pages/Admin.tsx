import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2, RefreshCw, User, Briefcase, FolderOpen, FileText, Award, Link2, Loader2, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import { Link } from 'wouter';
import { 
  fetchProfile, 
  fetchProjects, 
  fetchBlogPosts, 
  fetchExperience, 
  fetchSkills, 
  fetchSocials,
  syncGithubContributions
} from '@/lib/api';

function StatusMessage({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-xl ${type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

type TabType = 'profile' | 'projects' | 'blog' | 'experience' | 'skills' | 'socials';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const queryClient = useQueryClient();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'socials', label: 'Social Links', icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <button className="flex items-center gap-2 text-black/60 hover:text-black mb-8 transition-colors" data-testid="link-back-home">
              <ArrowLeft className="w-5 h-5" /> Back to Site
            </button>
          </Link>

          <h1 className="font-display text-5xl md:text-7xl mt-4 mb-8 leading-[0.9] tracking-tighter">
            Admin <span className="text-black/40">Panel</span>
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
          {activeTab === 'projects' && <ProjectsEditor />}
          {activeTab === 'blog' && <BlogEditor />}
          {activeTab === 'experience' && <ExperienceEditor />}
          {activeTab === 'skills' && <SkillsEditor />}
          {activeTab === 'socials' && <SocialsEditor />}
        </div>
      </div>
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
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/80 transition-colors disabled:opacity-50"
          data-testid="button-save-profile"
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
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
          <div key={project.id} className="flex items-center justify-between p-4 bg-black/5 rounded-xl">
            <div>
              <h3 className="font-bold">{project.title}</h3>
              <p className="text-sm text-black/60">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(project)}
                className="p-2 hover:bg-black/10 rounded-lg"
                data-testid={`button-edit-project-${project.id}`}
              >
                Edit
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

  const categories = Array.from(new Set(skills.map((s: any) => s.category)));

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
