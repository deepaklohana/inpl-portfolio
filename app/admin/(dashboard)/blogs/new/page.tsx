import BlogForm from '@/components/admin/BlogForm';

export default function NewBlogPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <BlogForm mode="create" />
    </div>
  );
}
