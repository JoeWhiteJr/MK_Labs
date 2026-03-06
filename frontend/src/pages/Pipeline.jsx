import { useEffect, useState, useCallback } from 'react'
import { usePipelineStore } from '../store/pipelineStore'
import { Plus, X, DollarSign, Calendar, GripVertical } from 'lucide-react'

const STAGES = [
  { key: 'discovery', label: 'Discovery', color: 'bg-info' },
  { key: 'proposal', label: 'Proposal', color: 'bg-gold' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-teal' },
  { key: 'won', label: 'Won', color: 'bg-success' },
  { key: 'lost', label: 'Lost', color: 'bg-error' },
]

const SERVICE_PILLARS = ['Research Methods', 'Data & Intelligence', 'Operations & Impact']

function LeadCard({ lead, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('leadId', lead.id)
        onDragStart?.(lead.id)
      }}
      className="card p-4 cursor-grab active:cursor-grabbing hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-muted" />
          <h4 className="font-medium text-midnight text-sm">{lead.company_name}</h4>
        </div>
      </div>
      <p className="text-xs text-secondary-text mb-2">{lead.contact_name}</p>
      {lead.service_pillar && (
        <span className="badge badge-teal text-xs mb-2 inline-flex">{lead.service_pillar}</span>
      )}
      <div className="flex items-center justify-between text-xs text-muted mt-2 pt-2 border-t border-slate-100">
        {lead.estimated_value ? (
          <span className="flex items-center gap-1 font-mono">
            <DollarSign size={12} />
            {Number(lead.estimated_value).toLocaleString()}
          </span>
        ) : (
          <span />
        )}
        {lead.next_follow_up && (
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(lead.next_follow_up).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}

function StageColumn({ stage, leads, onDrop }) {
  const [dragOver, setDragOver] = useState(false)
  const stageLeads = leads.filter((l) => l.status === stage.key)

  const totalValue = stageLeads.reduce((sum, l) => sum + Number(l.estimated_value || 0), 0)

  return (
    <div
      className={`flex flex-col min-w-[260px] rounded-xl transition-colors ${
        dragOver ? 'bg-teal-50 ring-2 ring-teal/30' : 'bg-mist'
      }`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const leadId = e.dataTransfer.getData('leadId')
        if (leadId) onDrop(leadId, stage.key)
      }}
    >
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
            <h3 className="font-display font-semibold text-sm text-midnight">{stage.label}</h3>
          </div>
          <span className="text-xs text-muted bg-white px-2 py-0.5 rounded-full">{stageLeads.length}</span>
        </div>
        {totalValue > 0 && (
          <p className="text-xs font-mono text-teal ml-4.5">${totalValue.toLocaleString()}</p>
        )}
      </div>
      <div className="p-2 space-y-2 flex-1 min-h-[200px]">
        {stageLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  )
}

function NewLeadModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    service_pillar: '',
    estimated_value: '',
    notes: '',
    source: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onCreate(form)
    onClose()
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-display text-h3 text-midnight">New Lead</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-mist">
            <X size={20} className="text-muted" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-midnight mb-1">Company *</label>
            <input
              name="company_name"
              required
              value={form.company_name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none text-sm"
              placeholder="Company name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Contact Name *</label>
              <input
                name="contact_name"
                required
                value={form.contact_name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none text-sm"
                placeholder="Contact name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Email</label>
              <input
                name="contact_email"
                type="email"
                value={form.contact_email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none text-sm"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Service Pillar</label>
              <select
                name="service_pillar"
                value={form.service_pillar}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none text-sm bg-white"
              >
                <option value="">Select...</option>
                {SERVICE_PILLARS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Est. Value</label>
              <input
                name="estimated_value"
                type="number"
                value={form.estimated_value}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none text-sm"
                placeholder="10000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1">Source</label>
            <input
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none text-sm"
              placeholder="Referral, website, conference..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1">Notes</label>
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none text-sm resize-none"
              placeholder="Initial notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-6 py-2 text-sm">
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Pipeline() {
  const { leads, isLoading, fetchLeads, fetchMetrics, createLead, updateStage } = usePipelineStore()
  const [showNewLead, setShowNewLead] = useState(false)

  useEffect(() => {
    fetchLeads()
    fetchMetrics()
  }, [fetchLeads, fetchMetrics])

  const handleDrop = useCallback(
    (leadId, newStatus) => {
      const lead = leads.find((l) => l.id === leadId)
      if (lead && lead.status !== newStatus) {
        updateStage(leadId, newStatus)
      }
    },
    [leads, updateStage]
  )

  const totalPipeline = leads
    .filter((l) => !['won', 'lost'].includes(l.status))
    .reduce((sum, l) => sum + Number(l.estimated_value || 0), 0)

  const wonValue = leads
    .filter((l) => l.status === 'won')
    .reduce((sum, l) => sum + Number(l.estimated_value || 0), 0)

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-h1 text-midnight">Pipeline</h1>
          <p className="text-sm text-secondary-text mt-1">Track leads from discovery to close</p>
        </div>
        <button onClick={() => setShowNewLead(true)} className="btn btn-primary text-sm px-4 py-2">
          <Plus size={16} /> New Lead
        </button>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Active Pipeline</p>
          <p className="font-display font-bold text-xl text-midnight font-mono">${totalPipeline.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Won</p>
          <p className="font-display font-bold text-xl text-success font-mono">${wonValue.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Active Leads</p>
          <p className="font-display font-bold text-xl text-midnight">
            {leads.filter((l) => !['won', 'lost'].includes(l.status)).length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Total Leads</p>
          <p className="font-display font-bold text-xl text-midnight">{leads.length}</p>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100" />
            <div className="absolute inset-0 rounded-full border-4 border-teal border-t-transparent animate-spin" />
          </div>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <StageColumn
              key={stage.key}
              stage={stage}
              leads={leads}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}

      {/* New Lead Modal */}
      {showNewLead && (
        <NewLeadModal
          onClose={() => setShowNewLead(false)}
          onCreate={createLead}
        />
      )}
    </div>
  )
}
