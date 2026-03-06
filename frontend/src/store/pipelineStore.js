import { create } from 'zustand'
import { pipelineApi } from '../services/api'

export const usePipelineStore = create((set, get) => ({
  leads: [],
  metrics: null,
  isLoading: false,
  error: null,

  fetchLeads: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await pipelineApi.list()
      set({ leads: data, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.error?.message || 'Failed to load pipeline', isLoading: false })
    }
  },

  fetchMetrics: async () => {
    try {
      const { data } = await pipelineApi.getMetrics()
      set({ metrics: data })
    } catch {
      // non-critical
    }
  },

  createLead: async (data) => {
    const { data: lead } = await pipelineApi.create(data)
    set((s) => ({ leads: [lead, ...s.leads] }))
    return lead
  },

  updateLead: async (id, data) => {
    const { data: updated } = await pipelineApi.update(id, data)
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? updated : l)) }))
    return updated
  },

  updateStage: async (id, status) => {
    // Optimistic update
    const prev = get().leads
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    }))
    try {
      await pipelineApi.updateStage(id, status)
    } catch {
      set({ leads: prev })
    }
  },

  deleteLead: async (id) => {
    await pipelineApi.delete(id)
    set((s) => ({ leads: s.leads.filter((l) => l.id !== id) }))
  },
}))
