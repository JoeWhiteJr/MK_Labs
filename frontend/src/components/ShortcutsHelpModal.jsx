import Modal from './Modal'
const shortcuts = [
  { keys: ['⌘', 'K'], desc: 'Open search' },
  { keys: ['⌘', '/'], desc: 'Show this help' },
  { keys: ['Esc'], desc: 'Close modal / search' },
  { keys: ['G', 'then', 'D'], desc: 'Go to Dashboard' },
  { keys: ['G', 'then', 'P'], desc: 'Go to Projects' },
  { keys: ['G', 'then', 'C'], desc: 'Go to Chat' },
  { keys: ['G', 'then', 'S'], desc: 'Go to Settings' },
]

export default function ShortcutsHelpModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" size="sm">
      <div className="space-y-2">
        {shortcuts.map(({ keys, desc }) => (
          <div key={desc} className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">{desc}</span>
            <div className="flex items-center gap-1">
              {keys.map((key, i) => (
                key === 'then' ? (
                  <span key={i} className="text-xs text-text-secondary mx-0.5">then</span>
                ) : (
                  <kbd key={i} className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-200 text-text-primary font-mono">
                    {key}
                  </kbd>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
