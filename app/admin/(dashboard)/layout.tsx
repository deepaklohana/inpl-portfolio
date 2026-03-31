import '../../(public)/globals.css'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signOut } from '@/auth'
import { NavLink } from '@/components/admin/NavLink'
import { AuthProvider } from '@/components/admin/AuthProvider'
import AdminPageTransition from '@/components/animations/AdminPageTransition'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  MessageSquare,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  LogOut,
  Hexagon,
  Users,
  FolderOpen,
  Layers,
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <AuthProvider session={session}>
      <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 w-[260px] bg-white flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.03)] border-r border-[#F3F4F6]">
          <div className="p-6 border-b border-[#F3F4F6] flex items-center gap-3">
            <div className="bg-linear-to-br from-[#E96429] to-[#E96429]/80 p-2.5 rounded-xl text-white shadow-sm">
              <Hexagon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">Admin Portal</h2>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <NavLink href="/admin" icon={<LayoutDashboard />}>
              Dashboard
            </NavLink>
            
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</p>
            </div>
            
            <NavLink href="/admin/blogs" icon={<FileText />}>
              Blogs
            </NavLink>
            <NavLink href="/admin/projects" icon={<Briefcase />}>
              Projects
            </NavLink>
            <NavLink href="/admin/products" icon={<Layers />}>
              Products
            </NavLink>
            <NavLink href="/admin/services" icon={<Settings />}>
              Services
            </NavLink>
            <NavLink href="/admin/services/categories" icon={<FolderOpen />} indent>
              Categories
            </NavLink>
            <NavLink href="/admin/testimonials" icon={<MessageSquare />}>
              Testimonials
            </NavLink>
            <NavLink href="/admin/events" icon={<Calendar />}>
              Events
            </NavLink>
            <NavLink href="/admin/news" icon={<Newspaper />}>
              News
            </NavLink>
            <NavLink href="/admin/media" icon={<ImageIcon />}>
              Media
            </NavLink>

            {session.user.role === 'superadmin' && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</p>
                </div>
                <NavLink href="/admin/users" icon={<Users />}>
                  Users
                </NavLink>
              </>
            )}
          </nav>

          <div className="p-4 border-t border-gray-100 flex flex-col gap-4 bg-gray-50/50">
            <div className="px-2">
              <p className="text-xs font-medium text-gray-500">Logged in as</p>
              <p className="text-sm font-medium text-gray-900 truncate break-all">{session.user.name || session.user.email}</p>
              <p className="text-xs text-gray-400 capitalize">{session.user.role}</p>
            </div>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/admin/login' })
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-[260px] p-8 max-w-[1600px] overflow-x-hidden">
          <AdminPageTransition>
            {children}
          </AdminPageTransition>
        </main>
      </div>
    </AuthProvider>
  )
}
