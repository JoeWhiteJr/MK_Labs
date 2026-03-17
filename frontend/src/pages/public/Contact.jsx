import { useState } from 'react'
import { Mail, Phone, Clock, Loader2 } from 'lucide-react'
import { contactApi } from '../../services/api'
import { toast } from '../../store/toastStore'

const serviceOptions = [
  'MaxDiff & Conjoint Analysis',
  'UX / Usability Research',
  'Psychometrics & Scale Development',
  'AI Integration & Automation',
  'Statistical Modeling & Forecasting',
  'Process Mapping & Optimization',
  'Impact Measurement & Evaluation',
  'Not sure yet',
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const validateField = (name, value) => {
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address'
    }
    if ((name === 'name' || name === 'message') && !value.trim()) {
      return 'This field is required'
    }
    return ''
  }

  const handleBlur = (e) => {
    const err = validateField(e.target.name, e.target.value)
    setFieldErrors(prev => ({ ...prev, [e.target.name]: err }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      await contactApi.submit({
        name: form.name,
        email: form.email,
        organization: form.company,
        subject: form.service,
        message: form.message,
      })
      setSubmitted(true)
      toast.success('Message sent! We\'ll be in touch shortly.')
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div>
      {/* Hero */}
      <section className="section-dark py-20 md:py-24">
        <div className="max-w-container mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-teal uppercase tracking-widest mb-4">Contact</p>
          <h1 className="font-display text-display text-white mb-6">
            Let&apos;s Talk
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Book a free 30-minute discovery call, or send us a message.
            We respond within one business day.
          </p>
        </div>
      </section>

      <section className="section-white py-20 md:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="card text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-4">
                    <Mail size={32} />
                  </div>
                  <h3 className="font-display text-h2 text-midnight mb-3">Message Sent</h3>
                  <p className="text-body-text">
                    Thanks for reaching out! We&apos;ll get back to you within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.name ? 'border-red-400' : 'border-slate-200'} focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors`}
                        placeholder="Your name"
                      />
                      {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.email ? 'border-red-400' : 'border-slate-200'} focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors`}
                        placeholder="you@company.com"
                      />
                      {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">Company / Organization</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors"
                      placeholder="Your organization"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">Service Interest</label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors bg-white"
                    >
                      <option value="">Select a service (optional)</option>
                      {serviceOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors resize-none"
                      placeholder="Tell us about your challenge or project..."
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full sm:w-auto px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              <div className="card-service">
                <h3 className="font-display text-h3 text-midnight mb-6">Get in Touch</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal flex items-center justify-center flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-midnight">Email</p>
                      <a href="mailto:jmw@michaelkairoslabs.com" className="text-sm text-teal hover:text-teal-dark">
                        jmw@michaelkairoslabs.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal flex items-center justify-center flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-midnight">Phone</p>
                      <a href="tel:+13852045537" className="text-sm text-teal hover:text-teal-dark">
                        (385) 204-5537
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal flex items-center justify-center flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-midnight">Response Time</p>
                      <p className="text-sm text-secondary-text">Within 1 business day</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-teal-50 border-teal-200">
                <h4 className="font-display text-h4 text-midnight mb-2">Free Discovery Call</h4>
                <p className="text-sm text-body-text leading-relaxed">
                  30 minutes, no commitment. We&apos;ll discuss your challenge, suggest
                  an approach, and give you an honest assessment of fit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
