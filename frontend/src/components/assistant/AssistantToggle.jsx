import { Bot } from 'lucide-react'
import { useAssistantStore } from '../../store/assistantStore'

export default function AssistantToggle() {
  const { toggleSidebar, isOpen } = useAssistantStore()

  return (
    <button
      onClick={toggleSidebar}
      className={`p-2 rounded-lg transition-colors ${
        isOpen
          ? 'bg-primary-100 text-primary-600'
          : 'hover:bg-gray-100 text-text-secondary'
      }`}
      title="AI Research Assistant"
      aria-label="Toggle AI Research Assistant"
    >
      <Bot size={18} />
    </button>
  )
}
