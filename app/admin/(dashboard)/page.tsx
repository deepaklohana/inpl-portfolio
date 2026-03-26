import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FileText, Briefcase, Calendar, MessageSquare, ArrowRight, Activity } from 'lucide-react'
import ScrollReveal from '@/components/animations/ScrollReveal'

export default async function AdminDashboardPage() {
  const now = new Date()

  const [
    totalBlogs,
    publishedBlogs,
    totalProjects,
    upcomingEvents,
    totalTestimonials,
    recentBlogs,
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.blog.count({ where: { status: 'published' } }),
    prisma.project.count(),
    prisma.event.count({ where: { event_date: { gt: now } } }),
    prisma.testimonial.count(),
    prisma.blog.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: { id: true, title: true, status: true, created_at: true },
    }),
  ])

  const stats = [
    {
      label: 'Total Blogs',
      value: totalBlogs,
      subValue: `${publishedBlogs} published`,
      href: '/admin/blogs',
      icon: FileText,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
    },
    {
      label: 'Projects',
      value: totalProjects,
      subValue: 'Manage portfolio',
      href: '/admin/projects',
      icon: Briefcase,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents,
      subValue: 'Scheduled events',
      href: '/admin/events',
      icon: Calendar,
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/10',
    },
    {
      label: 'Testimonials',
      value: totalTestimonials,
      subValue: 'Client reviews',
      href: '/admin/testimonials',
      icon: MessageSquare,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Published
          </span>
        )
      case 'draft':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            Draft
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
          </span>
        )
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <Activity className="w-7 h-7 text-blue-600" />
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-2">Welcome back to your administration portal.</p>
      </div>

      {/* Stat Cards */}
      <ScrollReveal variant="fadeUp" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Link
              key={i}
              href={stat.href}
              className="block h-full bg-white border border-[#F3F4F6] rounded-2xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0px_10px_25px_-5px_rgba(34,81,181,0.15)] hover:-translate-y-1 hover:border-[#2251B5]/30 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                {stat.subValue && (
                  <div className="text-xs text-gray-400 mt-1">{stat.subValue}</div>
                )}
              </div>
            </Link>
          )
        })}
      </ScrollReveal>

      {/* Recent Blogs Table */}
      <ScrollReveal variant="fadeUp" className="bg-white border border-[#F3F4F6] rounded-2xl overflow-hidden shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="px-6 py-5 border-b border-[#F3F4F6] flex justify-between items-center bg-[#F9FAFB]/80">
          <h3 className="text-base font-semibold text-gray-900">Recent Blogs</h3>
          <Link href="/admin/blogs" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F9FAFB]/80 text-[#6A7282] border-b border-[#F3F4F6]">
              <tr>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Title</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {recentBlogs.length > 0 ? (
                recentBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[#2251B5]/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-[#101828] max-w-[300px] truncate">
                      <Link href={`/admin/blogs/${blog.id}/edit`} className="hover:text-blue-600 transition-colors">
                        {blog.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(blog.status)}</td>
                    <td className="px-6 py-4 text-right text-gray-500 whitespace-nowrap">
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <p>No recent blogs found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </div>
  )
}
