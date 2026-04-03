import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  FileText, Calendar, MessageSquare, ArrowRight, Activity, 
  Layers, Settings, Newspaper, HelpCircle, LayoutDashboard
} from 'lucide-react'
import ScrollReveal from '@/components/animations/ScrollReveal'

export default async function AdminDashboardPage() {
  const now = new Date()

  // Sequential data fetching to avoid connection pool exhaustion
  // We use sequential await here to be safe and avoid HTTP 500 timeouts
  let totalBlogs = 0
  let publishedBlogs = 0
  let totalProducts = 0
  let totalServices = 0
  let totalEvents = 0
  let upcomingEvents = 0
  let totalNews = 0
  let totalTestimonials = 0
  let totalFAQs = 0

  let recentActivities: Array<{
    id: string | number;
    title: string;
    type: string;
    status: string;
    created_at: Date;
    href: string;
    icon: any;
    color: string;
    bg: string;
  }> = []

  try {
    totalBlogs = await prisma.article.count({ where: { type: 'blog' } })
    publishedBlogs = await prisma.article.count({ where: { type: 'blog', status: 'published' } })
    totalProducts = await prisma.product.count()
    totalServices = await prisma.service.count()
    totalEvents = await prisma.article.count({ where: { type: 'event' } })
    upcomingEvents = await prisma.article.count({ where: { type: 'event', eventDate: { gt: now } } })
    totalNews = await prisma.article.count({ where: { type: 'news' } })
    totalTestimonials = await prisma.testimonial.count()
    totalFAQs = await prisma.fAQ.count()

    const blogs = await prisma.article.findMany({ where: { type: 'blog' }, take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, status: true, createdAt: true } })
    const products = await prisma.product.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, status: true, createdAt: true } })
    const services = await prisma.service.findMany({ take: 5, orderBy: { created_at: 'desc' }, select: { id: true, title: true, status: true, created_at: true } })
    const events = await prisma.article.findMany({ where: { type: 'event' }, take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, status: true, createdAt: true } })
    const news = await prisma.article.findMany({ where: { type: 'news' }, take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, status: true, createdAt: true } })
    const testimonials = await prisma.testimonial.findMany({ take: 5, orderBy: { created_at: 'desc' }, select: { id: true, client_name: true, status: true, created_at: true } })

    // Normalize and merge activities
    const combined = [
      ...blogs.map(b => ({ id: b.id, title: b.title, type: 'Blog', status: b.status, created_at: b.createdAt, href: `/admin/articles/${b.id}/edit`, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' })),
      ...products.map(p => ({ id: p.id, title: p.name, type: 'Product', status: p.status, created_at: p.createdAt, href: `/admin/products/${p.id}/edit`, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-100' })),
      ...services.map(s => ({ id: s.id, title: s.title, type: 'Service', status: s.status, created_at: s.created_at, href: `/admin/services/${s.id}/edit`, icon: Settings, color: 'text-orange-600', bg: 'bg-orange-100' })),
      ...events.map(e => ({ id: e.id, title: e.title, type: 'Event', status: e.status, created_at: e.createdAt, href: `/admin/articles/${e.id}/edit`, icon: Calendar, color: 'text-pink-600', bg: 'bg-pink-100' })),
      ...news.map(n => ({ id: n.id, title: n.title, type: 'News', status: n.status, created_at: n.createdAt, href: `/admin/articles/${n.id}/edit`, icon: Newspaper, color: 'text-teal-600', bg: 'bg-teal-100' })),
      ...testimonials.map(t => ({ id: t.id, title: t.client_name, type: 'Testimonial', status: t.status, created_at: t.created_at, href: `/admin/testimonials/${t.id}/edit`, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' })),
    ]

    recentActivities = combined.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()).slice(0, 10);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : ''
    const lower = String(msg ?? '').toLowerCase()
    if (lower.includes('connection pool') || lower.includes('timed out fetching')) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center bg-white/50 backdrop-blur-md rounded-[32px] p-6 shadow-sm border border-gray-100">
          <p className="text-gray-700 font-medium font-['Inter',sans-serif]">
            Server is establishing secure connections. Please refresh in a few seconds.
          </p>
        </div>
      )
    }
    throw err
  }

  const stats = [
    { label: 'Blogs', value: totalBlogs, subValue: `${publishedBlogs} published`, href: '/admin/articles', icon: FileText, color: 'text-blue-600', outline: 'hover:border-blue-500/20 hover:shadow-[0px_10px_20px_-5px_rgba(37,99,235,0.15)]' },
    { label: 'Products', value: totalProducts, subValue: 'Core portfolio', href: '/admin/products', icon: Layers, color: 'text-indigo-600', outline: 'hover:border-indigo-500/20 hover:shadow-[0px_10px_20px_-5px_rgba(79,70,229,0.15)]' },
    { label: 'Services', value: totalServices, subValue: 'Core offerings', href: '/admin/services', icon: Settings, color: 'text-orange-600', outline: 'hover:border-orange-500/20 hover:shadow-[0px_10px_20px_-5px_rgba(249,115,22,0.15)]' },
    { label: 'Events', value: totalEvents, subValue: `${upcomingEvents} upcoming`, href: '/admin/articles', icon: Calendar, color: 'text-pink-600', outline: 'hover:border-pink-500/20 hover:shadow-[0px_10px_20px_-5px_rgba(236,72,153,0.15)]' },
    { label: 'News', value: totalNews, subValue: 'Press releases', href: '/admin/articles', icon: Newspaper, color: 'text-teal-600', outline: 'hover:border-teal-500/20 hover:shadow-[0px_10px_20px_-5px_rgba(20,184,166,0.15)]' },
    { label: 'Testimonials', value: totalTestimonials, subValue: 'Client reviews', href: '/admin/testimonials', icon: MessageSquare, color: 'text-emerald-600', outline: 'hover:border-emerald-500/20 hover:shadow-[0px_10px_20px_-5px_rgba(16,185,129,0.15)]' },
    { label: 'FAQs', value: totalFAQs, subValue: 'Knowledge base', href: '/admin/faqs', icon: HelpCircle, color: 'text-violet-600', outline: 'hover:border-violet-500/20 hover:shadow-[0px_10px_20px_-5px_rgba(139,92,246,0.15)]' },
  ]

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return <span className="inline-flex items-center rounded-full bg-green-100/50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-green-700 ring-1 ring-inset ring-green-600/20 backdrop-blur-xs">Published</span>
      case 'draft':
        return <span className="inline-flex items-center rounded-full bg-yellow-100/50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-yellow-800 ring-1 ring-inset ring-yellow-600/20 backdrop-blur-xs">Draft</span>
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100/50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-gray-600 ring-1 ring-inset ring-gray-500/20 backdrop-blur-xs">{status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}</span>
    }
  }

  return (
    <div className="space-y-10 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-linear-to-bl from-orange-400/10 to-[#2251B5]/5 blur-[100px] -z-10 rounded-full pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-gray-100/50">
            <LayoutDashboard className="w-8 h-8 text-[#2251B5]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-[#101828] to-[#4A5565] font-['Plus_Jakarta_Sans',sans-serif]">
              Mission Control
            </h1>
            <p className="text-gray-500 mt-1 font-['Inter',sans-serif] font-medium text-sm">
              Welcome to the central nervous system of your platform.
            </p>
          </div>
        </div>
      </div>

      <ScrollReveal variant="fadeUp">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Link
                key={i}
                href={stat.href}
                className={`group relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/80 rounded-[24px] p-6 transition-all duration-500 hover:-translate-y-1 shadow-[0px_4px_20px_-8px_rgba(0,0,0,0.05)] ${stat.outline}`}
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/40 to-white/0 pointer-events-none z-0" />
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className={`p-3.5 rounded-2xl bg-white shadow-[0px_2px_8px_-2px_rgba(0,0,0,0.05)] transition-transform duration-300 group-hover:scale-110 group-hover:bg-gray-50`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#2251B5] transition-all duration-300 transform group-hover:translate-x-1" />
                </div>

                <div className="relative z-10">
                  <div className="text-4xl font-extrabold text-[#101828] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight mb-2 group-hover:text-[#2251B5] transition-colors">{stat.value}</div>
                  <div className="text-sm font-semibold text-[#4A5565] uppercase tracking-wider mb-1">{stat.label}</div>
                  {stat.subValue && (
                    <div className="text-xs text-gray-400 font-medium">{stat.subValue}</div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </ScrollReveal>

      {/* Global Timeline Activity */}
      <ScrollReveal variant="fadeUp" className="mt-8">
        <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[32px] overflow-hidden shadow-[0px_8px_30px_-4px_rgba(34,81,181,0.06)] relative">
          <div className="px-8 py-6 border-b border-white/50 bg-white/40 flex justify-between items-center relative z-10">
            <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-gray-900 flex items-center gap-3">
              <Activity className="text-[#E96429] w-5 h-5 animate-pulse" />
              Global Activity Feed
            </h3>
          </div>
          <div className="p-8 relative z-10">
            {recentActivities.length > 0 ? (
              <div className="space-y-6">
                {recentActivities.map((act, idx) => {
                  const ActIcon = act.icon;
                  return (
                    <div key={`${act.type}-${act.id}`} className="flex items-start gap-5 group relative">
                      {idx !== recentActivities.length - 1 && (
                        <div className="absolute left-[20px] top-[40px] bottom-[-24px] w-[2px] bg-linear-to-b from-gray-200 to-transparent pointer-events-none" />
                      )}
                      <div className="flex flex-col items-center justify-start mt-1 relative z-10">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${act.bg} shadow-sm group-hover:scale-110 transition-transform duration-300 ring-4 ring-white`}>
                          <ActIcon className={`w-5 h-5 ${act.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex justify-start items-center gap-3">
                             <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md ${act.bg} ${act.color} ring-1 ring-inset ring-black/5`}>
                                {act.type}
                             </span>
                             <span className="text-xs font-semibold text-gray-400">
                              {new Date(act.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                             </span>
                          </div>
                          {getStatusBadge(act.status)}
                        </div>
                        <Link href={act.href} className="text-base font-bold font-['Inter',sans-serif] text-[#101828] hover:text-[#2251B5] transition-colors line-clamp-1 mt-2">
                          {act.title}
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
                <div className="text-center py-16">
                   <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                     <Activity className="w-8 h-8 text-gray-300" />
                   </div>
                   <h4 className="text-lg font-bold text-gray-900 mb-1 font-['Plus_Jakarta_Sans',sans-serif]">It's quiet here.</h4>
                   <p className="text-gray-500 font-medium">No recent activity detected on the platform.</p>
                </div>
            )}
          </div>
          <div className="absolute w-[400px] h-[300px] left-[-150px] bottom-[-150px] bg-linear-to-tr from-[#2251B5]/5 to-[#E96429]/5 blur-[80px] rounded-full pointer-events-none z-0" />
        </div>
      </ScrollReveal>
    </div>
  )
}
