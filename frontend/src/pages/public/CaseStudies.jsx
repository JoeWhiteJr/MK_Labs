import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'

export default function CaseStudies() {
  useEffect(() => {
    document.title = 'Case Studies | Michael Kairos Labs'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Case studies from Michael Kairos Labs engagements. Research methods, data intelligence, and impact measurement results.')
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="section-dark py-20 md:py-24">
        <div className="max-w-container mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-4">Case Studies</p>
          <h1 className="font-display text-display text-white mb-6">
            Results That Speak for Themselves
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We&apos;re building our portfolio of client engagements. Check back soon for
            detailed case studies across our three service pillars.
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section-white py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal flex items-center justify-center mx-auto mb-6">
              <FileText size={32} />
            </div>
            <h2 className="font-display text-h2 text-midnight mb-4">Case Studies Coming Soon</h2>
            <p className="text-body-text leading-relaxed mb-8">
              We&apos;re currently working with our first clients and documenting results.
              In the meantime, we&apos;d love to discuss how we can help your organization.
            </p>
            <Link to="/contact" className="btn btn-primary text-lg px-8 py-3">
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-20">
        <div className="max-w-container mx-auto px-6 text-center">
          <h2 className="font-display text-h1 text-white mb-4">Want to Be Our Next Success Story?</h2>
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
