import { useEffect, useState, useCallback } from 'react'
import { trashApi } from '../services/api'
import { Trash2, RotateCcw, FolderKanban, StickyNote, ListTodo, Mic, FileText, Loader2 } from 'lucide-react'
import Button from '../components/Button'
import { toast } from '../store/toastStore'

const TYPE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'project', label: 'Projects', icon: FolderKanban },
  { id: 'note', label: 'Notes', icon: StickyNote },
  { id: 'action', label: 'Tasks', icon: ListTodo },
  { id: 'meeting', label: 'Meetings', icon: Mic },
  { id: 'file', label: 'Files', icon: FileText },
]

const TYPE_COLORS = {
  project: 'bg-blue-100 text-blue-700',
  note: 'bg-yellow-100 text-yellow-700',
  action: 'bg-green-100 text-green-700',
  meeting: 'bg-purple-100 text-purple-700',
  file: 'bg-gray-100 text-gray-700',
}

const TYPE_LABELS = {
  project: 'Project',
  note: 'Note',
  action: 'Task',
  meeting: 'Meeting',
  file: 'File',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

export default function Trash() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchTrash = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await trashApi.list()
      setItems(data.items)
    } catch (error) {
      toast.error('Failed to load trash')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrash()
  }, [fetchTrash])

  useEffect(() => {
    document.title = 'Trash - MKL'
  }, [])

  const handleRestore = async (type, id) => {
    try {
      await trashApi.restore(type, id)
      setItems(prev => prev.filter(item => !(item.id === id && item.type === type)))
      toast.success('Item restored successfully')
    } catch (error) {
      toast.error('Failed to restore item')
    }
  }

  const handlePermanentDelete = async (type, id) => {
    try {
      await trashApi.permanentDelete(type, id)
      setItems(prev => prev.filter(item => !(item.id === id && item.type === type)))
      setConfirmDelete(null)
      toast.success('Item permanently deleted')
    } catch (error) {
      toast.error('Failed to delete item')
    }
  }

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter(item => item.type === activeFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trash2 size={24} className="text-text-secondary" />
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Trash
        </h1>
        <span className="text-sm text-text-secondary">
          ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit overflow-x-auto">
        {TYPE_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.icon && <tab.icon size={14} />}
            {tab.label}
            {tab.id !== 'all' && (
              <span className="text-xs opacity-60">
                {items.filter(i => i.type === tab.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Items List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-text-secondary" size={24} />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Trash2 size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-text-secondary">
            {activeFilter === 'all' ? 'Trash is empty' : `No deleted ${TYPE_TABS.find(t => t.id === activeFilter)?.label.toLowerCase()}`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
            >
              {/* Item info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[item.type]}`}>
                    {TYPE_LABELS[item.type]}
                  </span>
                  <h3 className="text-sm font-medium text-text-primary truncate">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  {item.project_title && (
                    <span className="truncate max-w-[200px]">{item.project_title}</span>
                  )}
                  <span>Deleted {formatDate(item.deleted_at)}</span>
                  {item.deleted_by_name && (
                    <span>by {item.deleted_by_name}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRestore(item.type, item.id)}
                >
                  <RotateCcw size={14} />
                  Restore
                </Button>
                {confirmDelete?.id === item.id && confirmDelete?.type === item.type ? (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handlePermanentDelete(item.type, item.id)}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setConfirmDelete(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setConfirmDelete({ id: item.id, type: item.type })}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
