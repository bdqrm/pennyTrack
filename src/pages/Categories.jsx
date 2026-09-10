import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { useDataStore } from '../store/dataStore.js'
import { ICON_KEYS, getIconComponent } from '../utils/icons.js'

const PALETTE = [
  '#F5A524',
  '#4C8DFF',
  '#3ECF6E',
  '#E05AC8',
  '#E85A4A',
  '#7C6CFF',
  '#2EC4B6',
  '#FF8A4C',
  '#38BDF8',
  '#8B8B93',
  '#22D3EE',
  '#A3E635',
  '#F472B6',
  '#FB923C',
  '#818CF8',
  '#34D399',
]

const EMPTY_FORM = { id: null, name: '', color: PALETTE[0], icon: 'Package' }

export default function Categories() {
  const categories = useDataStore((s) => s.categories)
  const addCategory = useDataStore((s) => s.addCategory)
  const updateCategory = useDataStore((s) => s.updateCategory)
  const deleteCategory = useDataStore((s) => s.deleteCategory)
  const categoryUsedCount = useDataStore((s) => s.categoryUsedCount)

  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const defaults = categories.filter((c) => c.isDefault)
  const custom = categories.filter((c) => !c.isDefault)
  const editing = Boolean(form.id)

  async function handleSave() {
    const name = form.name.trim()
    if (!name) {
      setError('Enter a category name.')
      return
    }
    if (editing) {
      await updateCategory(form.id, { name, color: form.color, icon: form.icon })
    } else {
      await addCategory({ name, color: form.color, icon: form.icon })
    }
    setForm(EMPTY_FORM)
    setError('')
  }

  function handleEdit(c) {
    setForm({ id: c.id, name: c.name, color: c.color, icon: c.iconKey })
    setError('')
  }

  async function handleDelete(c) {
    const used = await categoryUsedCount(c.id)
    if (used > 0) {
      setError(`This category is used by ${used} expense${used === 1 ? '' : 's'}. Delete those first.`)
      return
    }
    if (window.confirm(`Delete "${c.name}"?`)) {
      await deleteCategory(c.id)
      setError('')
    }
  }

  function renderRow(c) {
    const Icon = c.icon
    return (
      <div key={c.id} className="category-row">
        <span className="expense-badge" style={{ background: `${c.color}2e`, color: '#fff' }}>
          <Icon size={16} strokeWidth={2.1} />
        </span>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
        <button className="icon-btn" aria-label="Edit category" onClick={() => handleEdit(c)}>
          <Pencil size={16} />
        </button>
        {!c.isDefault && (
          <button className="icon-btn" aria-label="Delete category" onClick={() => handleDelete(c)}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Categories" subtitle="Add your own spending categories and edit colors or icons." />

      <div className="card fade-up">
        <label className="field-label">{editing ? `Edit "${form.name}"` : 'New category'}</label>
        <input
          className="text-input"
          placeholder="e.g. Pets"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        {error && (
          <div className="field" style={{ marginTop: 10 }}>
            <p className="alert danger" style={{ margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        <div className="field-label" style={{ marginTop: 16 }}>Color</div>
        <div className="color-swatches">
          {PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              className={`swatch ${form.color === color ? 'selected' : ''}`}
              style={{ background: color }}
              aria-label={`Pick color ${color}`}
              onClick={() => setForm((f) => ({ ...f, color }))}
            />
          ))}
        </div>

        <div className="field-label" style={{ marginTop: 16 }}>Icon</div>
        <div className="icon-grid">
          {ICON_KEYS.map((key) => {
            const Icon = getIconComponent(key)
            return (
              <button
                key={key}
                type="button"
                className={`icon-choice ${form.icon === key ? 'selected' : ''}`}
                aria-label={`Pick icon ${key}`}
                onClick={() => setForm((f) => ({ ...f, icon: key }))}
              >
                <Icon size={18} strokeWidth={2} />
              </button>
            )
          })}
        </div>

        <div className="field" style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1 }}>
            {editing ? (
              <>
                <Pencil size={15} /> Save changes
              </>
            ) : (
              <>
                <Plus size={15} /> Add category
              </>
            )}
          </button>
          {editing && (
            <button className="btn" onClick={() => { setForm(EMPTY_FORM); setError('') }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="card fade-up" style={{ marginTop: 16, paddingBottom: 12, animationDelay: '80ms' }}>
        <div className="card-header">
          <span className="card-header-label">Your categories</span>
        </div>
        {defaults.map(renderRow)}
        {custom.length > 0 && (
          <>
            <div className="card-header" style={{ marginTop: 8 }}>
              <span className="card-header-label">Custom</span>
            </div>
            {custom.map(renderRow)}
          </>
        )}
        {custom.length === 0 && (
          <p className="muted" style={{ margin: '10px 4px 0' }}>
            No custom categories yet — add one above.
          </p>
        )}
      </div>
    </div>
  )
}