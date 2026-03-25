import { getBlogById } from '@/lib/actions/blogs';
import BlogForm from '@/components/admin/BlogForm';
import { notFound } from 'next/navigation';

export default async function EditBlogPage(props: PageProps<'/admin/blogs/[id]/edit'>) {
  const { id } = await props.params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <BlogForm mode="edit" initialData={blog} />
    </div>
  );
}
