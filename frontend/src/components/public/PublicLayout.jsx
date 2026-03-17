import { Outlet, NavLink, Link } from 'react-router-dom'
import { Linkedin, Github } from 'lucide-react'

const navLinks = [
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/how-we-work', label: 'How We Work' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/contact', label: 'Contact' },
]

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:text-teal-700 focus:outline-none">
        Skip to main content
      </a>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-midnight shadow-nav">
        <div className="max-w-container mx-auto px-6 flex items-center justify-between h-[72px]">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-xl text-white tracking-tight">
              Michael Kairos Labs
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-teal' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="btn btn-primary text-sm px-5 py-2"
            >
              Schedule a Call
            </Link>
          </div>

          {/* Mobile: simplified - just CTA */}
          <div className="md:hidden">
            <Link to="/contact" className="btn btn-primary text-sm px-4 py-2">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-midnight text-slate-400">
        <div className="max-w-container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h3 className="font-display font-bold text-xl text-white mb-3">
                Michael Kairos Labs
              </h3>
              <p className="text-sm leading-relaxed max-w-md">
                Research. Analytics. Impact. A boutique consultancy delivering Oxford-caliber
                rigor and practical results for mission-driven organizations.
              </p>
              <p className="text-sm mt-4">jmw@michaelkairoslabs.com</p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                Services
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services" className="hover:text-teal transition-colors">Research Methods</Link></li>
                <li><Link to="/services" className="hover:text-teal transition-colors">Data & Intelligence</Link></li>
                <li><Link to="/services" className="hover:text-teal transition-colors">Operations & Impact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-teal transition-colors">About Us</Link></li>
                <li><Link to="/how-we-work" className="hover:text-teal transition-colors">How We Work</Link></li>
                <li><Link to="/case-studies" className="hover:text-teal transition-colors">Case Studies</Link></li>
                <li><Link to="/contact" className="hover:text-teal transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-teal transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-teal transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-midnight-light mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} Michael Kairos Labs LLC. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/company/michael-kairos-labs" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-teal transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/JoeWhiteJr" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-teal transition-colors">
                <Github size={20} />
              </a>
              <Link to="/login" className="text-sm hover:text-teal transition-colors">Team Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
