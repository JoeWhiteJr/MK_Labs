import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

const pillars = [
  {
    name: 'Research Methods',
    services: [
      {
        title: 'MaxDiff & Conjoint Analysis',
        description: 'Quantify what matters most to your stakeholders. We design and execute choice-based research that reveals true priorities — not just stated preferences.',
        bestFor: ['Product teams prioritizing features', 'Nonprofits allocating resources', 'Pricing strategy'],
        deliverables: ['Survey design & fielding', 'Hierarchical Bayes modeling', 'Segment-level priority maps', 'Executive summary deck'],
        timeline: '4–6 weeks',
        investment: '$8,000 – $25,000',
      },
      {
        title: 'UX / Usability Research',
        description: 'Find friction before your users do. We run moderated and unmoderated usability studies with rigorous analysis — not just highlight reels.',
        bestFor: ['Product launches', 'Redesign validation', 'Accessibility audits'],
        deliverables: ['Test protocol & recruitment', 'Session recordings + annotations', 'Severity-ranked findings', 'Prioritized recommendations'],
        timeline: '3–5 weeks',
        investment: '$6,000 – $18,000',
      },
      {
        title: 'Psychometrics & Scale Development',
        description: 'Build measurement instruments that hold up to scrutiny. From item generation through confirmatory factor analysis, we follow APA standards.',
        bestFor: ['Assessment development', 'Program evaluation', 'Academic partnerships'],
        deliverables: ['Literature review & item pool', 'Pilot testing & EFA/CFA', 'Reliability & validity reporting', 'Final instrument + scoring guide'],
        timeline: '8–12 weeks',
        investment: '$15,000 – $40,000',
        oxford: true,
      },
    ],
  },
  {
    name: 'Data & Intelligence',
    services: [
      {
        title: 'AI Integration & Automation',
        description: 'Practical AI that solves real problems. We help you identify high-value automation opportunities and build solutions that your team can actually maintain.',
        bestFor: ['Workflow automation', 'Document processing', 'Decision support systems'],
        deliverables: ['Opportunity assessment', 'Proof of concept', 'Production implementation', 'Team training & handoff'],
        timeline: '4–8 weeks',
        investment: '$10,000 – $35,000',
      },
      {
        title: 'Statistical Modeling & Forecasting',
        description: 'From regression to time series to machine learning — we build models that answer your specific business questions with quantified uncertainty.',
        bestFor: ['Demand forecasting', 'Risk modeling', 'Program impact estimation'],
        deliverables: ['Data audit & preparation', 'Model development & validation', 'Dashboard or reporting tool', 'Methodology documentation'],
        timeline: '4–8 weeks',
        investment: '$10,000 – $30,000',
      },
    ],
  },
  {
    name: 'Operations & Impact',
    services: [
      {
        title: 'Process Mapping & Optimization',
        description: 'See your operations clearly, then improve them systematically. We map workflows, identify bottlenecks, and design streamlined processes.',
        bestFor: ['Scaling organizations', 'Post-merger integration', 'Efficiency audits'],
        deliverables: ['Current-state process maps', 'Bottleneck analysis', 'Future-state design', 'Implementation roadmap'],
        timeline: '3–6 weeks',
        investment: '$8,000 – $20,000',
      },
      {
        title: 'Impact Measurement & Evaluation',
        description: 'Prove what works. We design evaluation frameworks that connect your programs to measurable outcomes — for boards, funders, and your own strategic planning.',
        bestFor: ['Grant reporting', 'Board presentations', 'Strategic planning'],
        deliverables: ['Theory of change / logic model', 'KPI framework', 'Data collection plan', 'Impact report'],
        timeline: '6–10 weeks',
        investment: '$12,000 – $30,000',
      },
    ],
  },
]

export default function Services() {
  const [expandedPillars, setExpandedPillars] = useState({})

  const togglePillar = (name) => {
    setExpandedPillars((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div>
      {/* Hero */}
      <section className="section-dark py-20 md:py-24">
        <div className="max-w-container mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-4">Our Services</p>
          <h1 className="font-display text-display text-white mb-6">
            Seven Services. Three Pillars.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Every engagement is scoped to your specific challenge. No cookie-cutter
            frameworks, no unnecessary deliverables.
          </p>
        </div>
      </section>

      {/* Service Pillars */}
      <section className="section-white py-16 md:py-20">
        <div className="max-w-container mx-auto px-6 space-y-4">
          {pillars.map((pillar) => {
            const isExpanded = expandedPillars[pillar.name] || false
            return (
              <div key={pillar.name} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => togglePillar(pillar.name)}
                  className="w-full flex items-center justify-between px-8 py-6 bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <div>
                    <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-1">Pillar</p>
                    <h2 className="font-display text-h2 text-midnight">{pillar.name}</h2>
                    <p className="text-sm text-muted mt-1">
                      {pillar.services.length} service{pillar.services.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-teal transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-8 pb-8 pt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {pillar.services.map((service) => (
                        <div
                          key={service.title}
                          className={service.oxford ? 'card-oxford' : 'card-service'}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-display text-h3 text-midnight">{service.title}</h3>
                            {service.oxford && (
                              <span className="badge badge-oxford text-xs">Oxford</span>
                            )}
                          </div>
                          <p className="text-body-text mb-5 leading-relaxed">{service.description}</p>

                          <div className="mb-4">
                            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Best For</p>
                            <div className="flex flex-wrap gap-2">
                              {service.bestFor.map((tag) => (
                                <span key={tag} className="badge badge-teal text-xs">{tag}</span>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Deliverables</p>
                            <ul className="space-y-1">
                              {service.deliverables.map((d) => (
                                <li key={d} className="flex items-start gap-2 text-sm text-secondary-text">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center gap-6 pt-4 border-t border-slate-100 text-sm">
                            <div>
                              <span className="text-muted">Timeline: </span>
                              <span className="font-medium text-midnight">{service.timeline}</span>
                            </div>
                            <div>
                              <span className="text-muted">Investment: </span>
                              <span className="font-mono font-medium text-midnight">{service.investment}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-20">
        <div className="max-w-container mx-auto px-6 text-center">
          <h2 className="font-display text-h1 text-white mb-4">Not Sure Which Service Fits?</h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
            Book a free discovery call. We&apos;ll listen to your challenge and
            recommend the right approach — even if it&apos;s not us.
          </p>
          <Link to="/contact" className="btn btn-primary text-lg px-8 py-3">
            Schedule a Discovery Call
          </Link>
        </div>
      </section>
    </div>
  )
}
