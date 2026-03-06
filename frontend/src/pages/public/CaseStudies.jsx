import { Link } from 'react-router-dom'
import { useState } from 'react'

const filters = ['All', 'Research Methods', 'Data & Intelligence', 'Operations & Impact']

const caseStudies = [
  {
    title: 'Feature Prioritization for EdTech Platform',
    pillar: 'Research Methods',
    service: 'MaxDiff & Conjoint Analysis',
    problem: 'A growing education technology company needed to prioritize 40+ feature requests with limited engineering resources. Stakeholder opinions conflicted, and traditional surveys produced flat, undifferentiated results.',
    approach: 'Designed and fielded a MaxDiff study with 500+ users segmented by role (teacher, admin, student). Applied Hierarchical Bayes modeling to produce individual-level utility scores.',
    outcome: 'Identified 6 high-impact features that drove 80% of user preference. Engineering roadmap was restructured, reducing planned development time by 30% while increasing projected user satisfaction.',
    tags: ['Education', 'Product Strategy'],
  },
  {
    title: 'AI-Powered Document Processing Pipeline',
    pillar: 'Data & Intelligence',
    service: 'AI Integration & Automation',
    problem: 'A nonprofit processing thousands of grant applications annually was spending 200+ staff hours per cycle on manual document review and data extraction.',
    approach: 'Built an LLM-powered pipeline for document classification, key-field extraction, and preliminary scoring. Integrated with existing workflow tools via API.',
    outcome: 'Reduced manual review time by 75%. Staff reallocated to higher-value activities. System maintained 95%+ accuracy on structured fields with human-in-the-loop verification.',
    tags: ['Nonprofit', 'Automation'],
  },
  {
    title: 'Impact Evaluation Framework for Youth Program',
    pillar: 'Operations & Impact',
    service: 'Impact Measurement & Evaluation',
    problem: 'A youth development organization needed to demonstrate program impact to funders but had inconsistent data collection and no evaluation framework.',
    approach: 'Developed a theory of change and logic model. Designed a longitudinal KPI framework with pre/post assessment instruments. Implemented data collection processes across 12 program sites.',
    outcome: 'First comprehensive impact report delivered to board and funders. Demonstrated statistically significant improvement in 4 of 5 target outcomes. Secured multi-year funding renewal.',
    tags: ['Youth Development', 'Evaluation'],
  },
]

export default function CaseStudies() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? caseStudies
    : caseStudies.filter(cs => cs.pillar === activeFilter)

  return (
    <div>
      {/* Hero */}
      <section className="section-dark py-20 md:py-24">
        <div className="max-w-container mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-4">Case Studies</p>
          <h1 className="font-display text-display text-white mb-6">
            Our Work in Action
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Anonymized examples of how we&apos;ve helped organizations solve real
            challenges with rigorous research and analytics.
          </p>
        </div>
      </section>

      {/* Filter + Cards */}
      <section className="section-white py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-12 justify-center">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === f
                    ? 'bg-teal text-white'
                    : 'bg-mist text-secondary-text hover:bg-teal-50 hover:text-teal'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Case Study Cards */}
          <div className="space-y-8 max-w-4xl mx-auto">
            {filtered.map((cs) => (
              <div key={cs.title} className="card-service">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="badge badge-teal text-xs">{cs.pillar}</span>
                  <span className="badge badge-slate text-xs">{cs.service}</span>
                  {cs.tags.map(tag => (
                    <span key={tag} className="text-xs text-muted">{tag}</span>
                  ))}
                </div>

                <h3 className="font-display text-h3 text-midnight mb-6">{cs.title}</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Problem</p>
                    <p className="text-sm text-body-text leading-relaxed">{cs.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Approach</p>
                    <p className="text-sm text-body-text leading-relaxed">{cs.approach}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-teal uppercase tracking-wider mb-2">Outcome</p>
                    <p className="text-sm text-body-text leading-relaxed">{cs.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-20">
        <div className="max-w-container mx-auto px-6 text-center">
          <h2 className="font-display text-h1 text-white mb-4">Have a Similar Challenge?</h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
            Let&apos;s discuss how we can apply the same rigor to your organization.
          </p>
          <Link to="/contact" className="btn btn-primary text-lg px-8 py-3">
            Schedule a Discovery Call
          </Link>
        </div>
      </section>
    </div>
  )
}
