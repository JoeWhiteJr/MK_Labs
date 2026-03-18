import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, FileText, Rocket, CheckCircle2, ChevronDown } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Discovery',
    description: 'A free 30-minute call where we listen to your challenge, ask the right questions, and determine if there\'s a fit. No sales pitch — just honest conversation.',
    detail: 'You walk away with clarity on your problem, even if we\'re not the right firm.',
  },
  {
    icon: FileText,
    number: '02',
    title: 'Proposal',
    description: 'A clear Statement of Work with defined scope, methodology, timeline, milestones, and fixed pricing. No ambiguity, no scope creep traps.',
    detail: 'We scope conservatively and deliver generously.',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Execute',
    description: 'Rigorous research and analysis with regular check-ins. You\'ll see work-in-progress, not just a final report. We course-correct in real time.',
    detail: 'Weekly status updates. Bi-weekly working sessions. Full transparency.',
  },
  {
    icon: CheckCircle2,
    number: '04',
    title: 'Deliver',
    description: 'Actionable findings with clear recommendations. Not a 200-page report that gathers dust — a focused deliverable your team can act on immediately.',
    detail: 'Includes a handoff session to ensure your team can run with the results.',
  },
]

const engagementModels = [
  {
    title: 'Project-Based',
    description: 'Defined scope, fixed timeline, clear deliverables. Best for discrete research questions or one-time analyses.',
    bestFor: 'Most engagements',
  },
  {
    title: 'Milestone-Based',
    description: 'Larger projects broken into phases with go/no-go gates. Pay per phase, adjust scope as you learn.',
    bestFor: 'Complex, multi-phase work',
  },
  {
    title: 'Retainer',
    description: 'Ongoing access to MKL expertise. Reserved hours each month for analysis, consultation, and ad hoc requests.',
    bestFor: 'Organizations with continuous research needs',
  },
  {
    title: 'Advisory',
    description: 'Strategic counsel without hands-on execution. Monthly check-ins, methodology review, and expert guidance.',
    bestFor: 'Teams with in-house analysts who need senior oversight',
  },
]

const faqs = [
  {
    q: 'How long does a typical engagement take?',
    a: 'Most projects run 4–8 weeks from kickoff to final delivery. Complex psychometric or evaluation projects can take 8–12 weeks. We\'ll give you a clear timeline in the proposal.',
  },
  {
    q: 'What industries do you serve?',
    a: 'We specialize in mission-driven organizations — nonprofits, education, healthcare, social impact, and government. We also work with private sector companies that prioritize outcomes over vanity metrics.',
  },
  {
    q: 'How do you price your services?',
    a: 'Fixed-price for defined scope. We don\'t bill hourly because it creates perverse incentives. You\'ll know the total investment before we start.',
  },
  {
    q: 'Can you work with our existing data?',
    a: 'Absolutely. Many engagements start with a data audit of what you already have. We\'ll tell you what\'s usable, what\'s missing, and the most efficient path to answers.',
  },
  {
    q: 'Do you do the work yourselves or outsource it?',
    a: 'Joe and Jared work directly on every engagement. We don\'t subcontract analytical work. Period.',
  },
]

function FaqAccordion({ faqs }) {
  const [open, setOpen] = useState({})
  const toggle = (q) => setOpen(prev => ({ ...prev, [q]: !prev[q] }))
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map(({ q, a }) => (
        <div key={q} className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle(q)}
            aria-expanded={open[q] || false}
            className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
          >
            <h4 className="font-display text-h4 text-midnight pr-4">{q}</h4>
            <ChevronDown size={20} className={`text-teal flex-shrink-0 transition-transform duration-300 ${open[q] ? 'rotate-180' : ''}`} />
          </button>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open[q] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="px-6 pb-5 text-body-text leading-relaxed">{a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HowWeWork() {
  useEffect(() => {
    document.title = 'How We Work | Michael Kairos Labs'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Our engagement process: Discovery Call, Proposal, Execution, Delivery. Senior-led, transparent methodology, no junior bait-and-switch.')
    // FAQ structured data
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    const script = document.createElement('script'); script.type = 'application/ld+json'; script.text = JSON.stringify(faqSchema); document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])
  return (
    <div>
      {/* Hero */}
      <section className="section-dark py-20 md:py-24">
        <div className="max-w-container mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-4">Our Process</p>
          <h1 className="font-display text-display text-white mb-6">
            How We Work
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A straightforward process designed for clarity and results.
            No mystery, no theater — just good work.
          </p>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="section-white py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {steps.map(({ icon: Icon, number, title, description, detail }) => (
              <div key={number} className="card-dark flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
                    <Icon size={28} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-teal">{number}</span>
                    <h3 className="font-display text-h3 text-white">{title}</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-2">{description}</p>
                  <p className="text-sm text-teal-400 italic">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="section-light py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-3">Engagement Models</p>
            <h2 className="font-display text-h1 text-midnight">Flexible Structures</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {engagementModels.map((model) => (
              <div key={model.title} className="card">
                <h3 className="font-display text-h3 text-midnight mb-2">{model.title}</h3>
                <p className="text-body-text leading-relaxed mb-4">{model.description}</p>
                <span className="badge badge-teal text-xs">Best for: {model.bestFor}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-white py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="font-display text-h1 text-midnight">Common Questions</h2>
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-20">
        <div className="max-w-container mx-auto px-6 text-center">
          <h2 className="font-display text-h1 text-white mb-4">Step One Is Easy</h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
            Book a free discovery call. 30 minutes, no commitment, no sales pitch.
          </p>
          <Link to="/contact" className="btn btn-primary text-lg px-8 py-3">
            Schedule a Discovery Call
          </Link>
        </div>
      </section>
    </div>
  )
}
