import { Link } from 'react-router-dom'
import { Linkedin } from 'lucide-react'

const founders = [
  {
    name: 'Joe White',
    role: 'Co-Founder & Technical Lead',
    bio: 'Data analyst and full-stack engineer specializing in AI systems, statistical modeling, and research platform architecture. With expertise spanning Python, React, and agentic AI pipelines, Joe builds the technical infrastructure that powers MKL\u2019s analytical capabilities \u2014 from factor analysis to production-grade RAG systems.',
    linkedin: 'https://www.linkedin.com/in/joseph-whitejr',
    photo: '/brand/joe-white.jpg',
  },
  {
    name: 'Jared Williams',
    role: 'Co-Founder & Growth Strategy',
    bio: 'Market researcher and data analyst with expertise in business analytics, SEO strategy, and digital marketing. Jared combines statistical rigor with growth-driven thinking \u2014 from Tableau dashboards and SPSS analysis to HubSpot campaigns and search optimization. Fluent in Korean, enabling MKL to serve global clients.',
    linkedin: 'https://www.linkedin.com/in/jared-williams-me/',
    photo: '/brand/jared-williams.jpg',
  },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="section-dark py-20 md:py-24">
        <div className="max-w-container mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-4">About Us</p>
          <h1 className="font-display text-display text-white mb-6">
            Two Partners. One Mission.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Michael Kairos Labs is a 50/50 partnership built on a simple belief:
            mission-driven organizations deserve world-class research and analytics
            without the Big Four price tag.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="section-white py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-3">Leadership</p>
            <h2 className="font-display text-h1 text-midnight">Meet the Partners</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {founders.map((founder) => (
              <div key={founder.name} className="card text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-5 border-2 border-slate-100">
                  <img src={founder.photo} alt={founder.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-display text-h3 text-midnight mb-1">{founder.name}</h3>
                <p className="text-sm text-teal font-medium mb-4">{founder.role}</p>
                <p className="text-body-text leading-relaxed mb-4">{founder.bio}</p>
                {founder.linkedin && (
                  <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark transition-colors">
                    <Linkedin size={16} /> LinkedIn
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oxford Partnership */}
      <section className="section-light py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="card-oxford max-w-3xl mx-auto text-center">
            <span className="badge badge-oxford mb-4 inline-flex">Oxford Partnership</span>
            <h2 className="font-display text-h2 text-midnight mb-4">Academic Rigor, Practical Delivery</h2>
            <p className="text-body-text leading-relaxed mb-6">
              Our partnership with Oxford-trained methodologists ensures that every
              instrument we develop, every model we build, and every evaluation we
              design meets the highest standards of academic rigor — while remaining
              actionable for real-world decision-making.
            </p>
            <p className="text-sm text-gold font-medium">
              Psychometrics &bull; Scale Development &bull; Peer-Review Quality Research
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-white py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-3">Mission</p>
              <h3 className="font-display text-h2 text-midnight mb-4">Why We Exist</h3>
              <p className="text-body-text leading-relaxed">
                To provide mission-driven organizations with research and analytics
                capabilities that were previously only accessible through Big Four
                firms — delivered with more rigor, more transparency, and at a fair price.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-3">Vision</p>
              <h3 className="font-display text-h2 text-midnight mb-4">Where We&apos;re Going</h3>
              <p className="text-body-text leading-relaxed">
                We envision a consulting landscape where boutique firms with deep
                specialization consistently outperform generalist giants — because
                expertise, not headcount, drives impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-20">
        <div className="max-w-container mx-auto px-6 text-center">
          <h2 className="font-display text-h1 text-white mb-4">Want to Work With Us?</h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
            We&apos;re selective about the projects we take on — because focus is how
            we deliver exceptional work.
          </p>
          <Link to="/contact" className="btn btn-primary text-lg px-8 py-3">
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  )
}
