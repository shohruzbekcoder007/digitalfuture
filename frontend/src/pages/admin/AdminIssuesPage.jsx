import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useIssues, useCreateIssue, useUpdateIssue, useDeleteIssue } from '../../hooks/useJournal';
import { formatDate, pickLocalized } from '../../utils/format';
import { Field, Select, Checkbox, Modal } from './AdminFormElements';

const empty = () => ({
  title: { uz: '', ru: '', en: '' },
  description: { uz: '', ru: '', en: '' },
  volume: 1,
  issueNumber: 1,
  year: new Date().getFullYear(),
  publicationDate: new Date().toISOString().slice(0, 10),
  coverImage: '',
  pdfUrl: '',
  issn: '',
  pages: 0,
  isCurrent: false,
  isPublished: true,
});

export default function AdminIssuesPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];

  const { data, isLoading } = useIssues({ limit: 100 });
  const createMut = useCreateIssue();
  const updateMut = useUpdateIssue();
  const deleteMut = useDeleteIssue();

  const [editing, setEditing] = useState(null);
  const items = data?.data || [];

  const onSave = async () => {
    try {
      if (editing._id) await updateMut.mutateAsync({ id: editing._id, payload: editing });
      else await createMut.mutateAsync(editing);
      toast.success('Saved');
      setEditing(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const onDelete = async (id) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      await deleteMut.mutateAsync(id);
      toast.success('Deleted');
    } catch {
      toast.error('Error');
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing(empty())}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-card text-sm font-semibold hover:bg-primary-600">
          <Plus className="w-4 h-4" /> {t('admin.addNew')}
        </button>
      </div>

      <div className="bg-white rounded-card border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-sub text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Vol/Issue</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-sub">...</td></tr>
            ) : items.map((i) => (
              <tr key={i._id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">Vol.{i.volume}, Iss.{i.issueNumber}</td>
                <td className="px-4 py-3">{pickLocalized(i.title, lang)}</td>
                <td className="px-4 py-3">{i.year}</td>
                <td className="px-4 py-3">{formatDate(i.publicationDate, lang)}</td>
                <td className="px-4 py-3">{i.isCurrent ? '★' : ''}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing({
                    ...i,
                    publicationDate: i.publicationDate
                      ? new Date(i.publicationDate).toISOString().slice(0, 10) : '',
                  })}
                    className="p-2 text-primary hover:bg-primary-50 rounded">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(i._id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing._id ? 'Edit issue' : 'New issue'}
          onClose={() => setEditing(null)} onSave={onSave}
          saving={createMut.isPending || updateMut.isPending}>
          <div className="grid sm:grid-cols-3 gap-3">
            {['uz', 'ru', 'en'].map((l) => (
              <Field key={l} label={`Title (${l})`} value={editing.title[l]}
                onChange={(v) => setEditing({ ...editing, title: { ...editing.title, [l]: v } })} />
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {['uz', 'ru', 'en'].map((l) => (
              <Field key={l} multiline label={`Description (${l})`} value={editing.description[l]}
                onChange={(v) => setEditing({ ...editing, description: { ...editing.description, [l]: v } })} />
            ))}
          </div>
          <div className="grid sm:grid-cols-4 gap-3">
            <Field type="number" label="Volume" value={editing.volume}
              onChange={(v) => setEditing({ ...editing, volume: Number(v) })} />
            <Field type="number" label="Issue #" value={editing.issueNumber}
              onChange={(v) => setEditing({ ...editing, issueNumber: Number(v) })} />
            <Field type="number" label="Year" value={editing.year}
              onChange={(v) => setEditing({ ...editing, year: Number(v) })} />
            <Field type="number" label="Pages" value={editing.pages}
              onChange={(v) => setEditing({ ...editing, pages: Number(v) })} />
          </div>
          <Field type="date" label="Publication date" value={editing.publicationDate}
            onChange={(v) => setEditing({ ...editing, publicationDate: v })} />
          <Field label="Cover image URL" value={editing.coverImage}
            onChange={(v) => setEditing({ ...editing, coverImage: v })} />
          <Field label="PDF URL" value={editing.pdfUrl}
            onChange={(v) => setEditing({ ...editing, pdfUrl: v })} />
          <Field label="ISSN" value={editing.issn}
            onChange={(v) => setEditing({ ...editing, issn: v })} />
          <div className="flex gap-6">
            <Checkbox label="Is current" checked={editing.isCurrent}
              onChange={(v) => setEditing({ ...editing, isCurrent: v })} />
            <Checkbox label="Is published" checked={editing.isPublished}
              onChange={(v) => setEditing({ ...editing, isPublished: v })} />
          </div>
        </Modal>
      )}
    </div>
  );
}
