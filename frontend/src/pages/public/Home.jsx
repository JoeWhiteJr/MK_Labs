import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Users, Target, BarChart3 } from 'lucide-react'

const pillars = [
  {
    title: 'Research Methods',
    description: 'MaxDiff, Conjoint, UX/Usability testing, and Psychometrics — rigorous methodologies that produce defensible insights.',
    services: ['MaxDiff & Conjoint Analysis', 'UX/Usability Research', 'Psychometrics & Scale Development'],
  },
  {
    title: 'Data & Intelligence',
    description: 'AI integration and statistical modeling that transforms raw data into strategic advantage.',
    services: ['AI Integration & Automation', 'Statistical Modeling & Forecasting'],
  },
  {
    title: 'Operations & Impact',
    description: 'Process mapping and impact measurement that connect research to real organizational outcomes.',
    services: ['Process Mapping & Optimization', 'Impact Measurement & Evaluation'],
  },
]

const differentiators = [
  { icon: Shield, title: 'Oxford-Caliber Rigor', description: 'Academic precision applied to business problems. Peer-review quality without the ivory tower.' },
  { icon: Users, title: 'Senior-Led, Always', description: 'Joe and Jared work directly on every engagement. No bait-and-switch with junior analysts.' },
  { icon: Target, title: 'Mission-Driven Focus', description: 'We specialize in organizations that measure success by outcomes, not just revenue.' },
  { icon: BarChart3, title: 'Fair, Transparent Pricing', description: 'Big Four quality at fair prices. Clear scoping, no surprise invoices, no filler.' },
]

const stats = [
  { value: '7', label: 'Core Services' },
  { value: '3', label: 'Service Pillars' },
  { value: '2', label: 'Senior Partners' },
  { value: '100%', label: 'Senior-Led Projects' },
]

export default function Home() {
  useEffect(() => { document.title = 'Research. Analytics. Impact. | Michael Kairos Labs'; document.querySelector('meta[name="description"]')?.setAttribute('content', 'Michael Kairos Labs — boutique research and analytics consultancy. Oxford-caliber rigor, practical delivery, fair pricing for mission-driven organizations.') }, [])
  return (
    <div>
      {/* Hero */}
      <section className="section-dark py-24 md:py-32">
        <div className="max-w-container mx-auto px-6 text-center">
          <h1 className="font-display text-display md:text-[56px] text-white mb-6 leading-tight">
            Research. Analytics. Impact.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A modern alternative to Big Four consulting — Oxford-caliber research
            and analytics for mission-driven organizations, at fair prices.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn btn-primary text-lg px-8 py-3">
              Schedule a Free Discovery Call
            </Link>
            <Link to="/services" className="btn btn-secondary text-lg px-8 py-3 border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 hover:bg-transparent">
              Explore Services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="section-light py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="font-display text-h1 text-midnight">Three Pillars of Expertise</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="card-service">
                <h3 className="font-display text-h3 text-midnight mb-3">{pillar.title}</h3>
                <p className="text-body-text mb-5 leading-relaxed">{pillar.description}</p>
                <ul className="space-y-2">
                  {pillar.services.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-secondary-text">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="btn btn-primary">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why MKL */}
      <section className="section-white py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-3">Why MKL</p>
            <h2 className="font-display text-h1 text-midnight">Built Different</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentiators.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card text-center">
                <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} />
                </div>
                <h4 className="font-display text-h4 text-midnight mb-2">{title}</h4>
                <p className="text-sm text-secondary-text leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-midnight py-16">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-stat-lg text-teal mb-1">{value}</div>
                <div className="text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-light py-20 md:py-24">
        <div className="max-w-container mx-auto px-6 text-center">
          <h2 className="font-display text-h1 text-midnight mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-secondary-text max-w-xl mx-auto mb-8">
            Book a free 30-minute discovery call. We&apos;ll discuss your challenge,
            outline an approach, and give you an honest assessment of fit.
          </p>
          <Link to="/contact" className="btn btn-primary text-lg px-8 py-3">
            Schedule a Discovery Call
          </Link>
        </div>
      </section>
    </div>
  )
}
