import { useLocation, Link } from 'react-router-dom'
import { useProjectStore } from '../store/projectStore'
import { ArrowLeft } from 'lucide-react'

const routeLabels = {
  'dashboard': 'Dashboard',
  'my-dashboard': 'My Dashboard',
  'projects': 'Client Projects',
  'pipeline': 'Pipeline',
  'settings': 'Settings',
  'admin': 'Admin',
}

export default function Breadcrumbs() {
  const location = useLocation()
  const { currentProject } = useProjectStore()

  const pathSegments = location.pathname.split('/').filter(Boolean)

  // Don't show breadcrumbs on the main dashboard
  if (pathSegments.length <= 1) return null

  const crumbs = []

  // Build breadcrumb trail
  let currentPath = ''
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    currentPath += `/${segment}`

    if (segment === 'dashboard') {
      crumbs.push({ label: 'Dashboard', path: '/dashboard' })
      continue
    }

    // Named route
    if (routeLabels[segment]) {
      crumbs.push({ label: routeLabels[segment], path: currentPath })
      continue
    }

    // Dynamic project ID
    if (pathSegments[i - 1] === 'projects' && segment !== 'projects') {
      crumbs.push({
        label: currentProject?.title || 'Project',
        path: currentPath
      })
      continue
    }
  }

  if (crumbs.length <= 1) return null

  const parentCrumb = crumbs[crumbs.length - 2]

  return (
    <nav className="text-sm mb-4">
      <Link
        to={parentCrumb.path}
        className="inline-flex items-center gap-1.5 text-secondary-text hover:text-teal transition-colors"
      >
        <ArrowLeft size={14} />
        Back to {parentCrumb.label}
      </Link>
    </nav>
  )
}
