import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentFormData {
  title: string;
  description: string;
  readTime: string;
  category: string;
  content: string;
}

interface ContentFormProps {
  type: 'article' | 'guide';
  onSubmit: (data: ContentFormData) => void;
  onCancel: () => void;
}

const ContentForm = ({ type, onSubmit, onCancel }: ContentFormProps) => {
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    readTime: '',
    category: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (field: keyof ContentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const placeholderContent = type === 'guide' 
    ? `# Your Guide Title Here

## Introduction
Write your introduction here...

## Prerequisites
- List what readers need to know
- Required tools and setup

## Step-by-Step Guide

### Step 1: Getting Started
Explain the first step in detail...

### Step 2: Implementation
Continue with implementation details...

## Advanced Topics
Cover more complex concepts...

## Conclusion
Wrap up your guide and provide next steps...`
    : `# Your Article Title Here

## Introduction
Share your thoughts and introduce the topic...

## Main Points
- Key insight #1
- Key insight #2
- Key insight #3

## Personal Experience
Share your personal experience or opinion...

## Conclusion
Wrap up your thoughts and encourage discussion...`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Create New {type === 'article' ? 'Article' : 'Guide'}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <X size={24} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-8 rounded-xl border border-border/50">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter the title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all h-24 resize-none"
                placeholder="Brief description..."
                required
              />
            </div>

            {/* Metadata */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Reading Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => handleChange('readTime', e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g., 5 min read"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g., Development, Opinion"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Content *
                <span className="text-xs text-muted-foreground/70 ml-2">
                  (Use markdown formatting: # for headers, ## for subheaders, **bold**)
                </span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
                placeholder={placeholderContent}
                rows={20}
                required
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6 border-t border-border/50">
              <Button
                type="submit"
                variant="neon"
                className="gap-2"
              >
                <Save size={18} />
                Publish {type === 'article' ? 'Article' : 'Guide'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;