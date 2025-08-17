import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Hero from './Hero';
import ContentGrid from './ContentGrid';
import ContentReader from './ContentReader';
import ContentForm from './ContentForm';
import AdminLogin from './AdminLogin';
import { sampleGuides, sampleArticles, type ContentItem } from '@/data/sampleContent';

const PersonalWebsite = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState<ContentItem | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [guides, setGuides] = useState<ContentItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createType, setCreateType] = useState<'article' | 'guide'>('article');

  // Initialize with sample content
  useEffect(() => {
    if (articles.length === 0 && guides.length === 0) {
      setArticles(sampleArticles);
      setGuides(sampleGuides);
    }
  }, [articles.length, guides.length]);

  // Admin functions
  const handleAdminLogin = (password: string) => {
    if (password === 'johan2025') {
      setIsAdmin(true);
      setShowAdminLogin(false);
    } else {
      alert('Invalid password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setActiveSection('home');
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      handleAdminLogout();
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleCreateContent = (formData: any) => {
    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      readTime: formData.readTime || '5 min read',
      category: formData.category || 'General',
      content: formData.content
    };

    if (createType === 'article') {
      setArticles([newContent, ...articles]);
    } else {
      setGuides([newContent, ...guides]);
    }

    setShowCreateForm(false);
    setActiveSection(createType === 'article' ? 'articles' : 'guides');
  };

  const handleDeleteContent = (id: string, type: 'article' | 'guide') => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'article') {
        setArticles(articles.filter(article => article.id !== id));
      } else {
        setGuides(guides.filter(guide => guide.id !== id));
      }
    }
  };

  const handleCreateNew = (type: 'article' | 'guide') => {
    setCreateType(type);
    setShowCreateForm(true);
  };

  const renderContent = () => {
    // Show create form
    if (showCreateForm) {
      return (
        <ContentForm
          type={createType}
          onSubmit={handleCreateContent}
          onCancel={() => setShowCreateForm(false)}
        />
      );
    }

    // Show article reader
    if (selectedArticle) {
      return (
        <ContentReader
          item={selectedArticle}
          onBack={() => setSelectedArticle(null)}
        />
      );
    }

    // Show sections
    switch (activeSection) {
      case 'home':
        return <Hero setActiveSection={setActiveSection} />;
      
      case 'guides':
        return (
          <ContentGrid
            title="Guides"
            items={guides}
            onSelectItem={setSelectedArticle}
            onCreateNew={isAdmin ? () => handleCreateNew('guide') : undefined}
            onDeleteItem={isAdmin ? (id) => handleDeleteContent(id, 'guide') : undefined}
            isAdmin={isAdmin}
            emptyMessage="No guides available yet."
          />
        );
      
      case 'articles':
        return (
          <ContentGrid
            title="Articles"
            items={articles}
            onSelectItem={setSelectedArticle}
            onCreateNew={isAdmin ? () => handleCreateNew('article') : undefined}
            onDeleteItem={isAdmin ? (id) => handleDeleteContent(id, 'article') : undefined}
            isAdmin={isAdmin}
            emptyMessage="No articles available yet."
          />
        );
      
      default:
        return <Hero setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isAdmin={isAdmin}
        onAdminToggle={handleAdminToggle}
      />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </main>

      {showAdminLogin && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
};

export default PersonalWebsite;