export function Field({ label, value, onChange, type = 'text', multiline, rows = 3 }) {
  return (
    <label className="block text-sm">
      <span className="text-sub font-medium">{label}</span>
      {multiline ? (
        <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={rows}
          className="w-full mt-1 px-3 py-2 border border-line rounded-card outline-none focus:border-primary" />
      ) : (
        <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-line rounded-card outline-none focus:border-primary" />
      )}
    </label>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <label className="block text-sm">
      <span className="text-sub font-medium">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 border border-line rounded-card outline-none focus:border-primary bg-white">
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-ink">{label}</span>
    </label>
  );
}

export function Modal({ title, onClose, onSave, children, saving }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-card border border-line shadow-cardHover w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-line">
          <h2 className="font-serif font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-sub hover:text-ink">×</button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>
        <div className="flex justify-end gap-2 p-5 border-t border-line">
          <button onClick={onClose} className="px-4 py-2 rounded-card border border-line text-sm">Cancel</button>
          <button onClick={onSave} disabled={saving}
            className="bg-primary text-white px-5 py-2 rounded-card text-sm font-semibold hover:bg-primary-600 disabled:opacity-60">
            {saving ? '...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
