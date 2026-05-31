import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthors, useCreateAuthor, useUpdateAuthor, useDeleteAuthor } from '../../hooks/useJournal';
import { Field, Modal } from './AdminFormElements';

const empty = () => ({
  fullName: '',
  affiliation: '',
  country: '',
  email: '',
  orcid: '',
  bio: { uz: '', ru: '', en: '' },
  avatar: '',
});

export default function AdminAuthorsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useAuthors({ limit: 200 });
  const createMut = useCreateAuthor();
  const updateMut = useUpdateAuthor();
  const deleteMut = useDeleteAuthor();
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
    try { await deleteMut.mutateAsync(id); toast.success('Deleted'); }
    catch { toast.error('Error'); }
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Affiliation</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Articles</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-sub">...</td></tr>
            ) : items.map((a) => (
              <tr key={a._id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{a.fullName}</td>
                <td className="px-4 py-3 text-sub">{a.affiliation}</td>
                <td className="px-4 py-3 text-sub">{a.country}</td>
                <td className="px-4 py-3 text-sub">{a.articlesCount}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(a)}
                    className="p-2 text-primary hover:bg-primary-50 rounded">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(a._id)}
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
        <Modal title={editing._id ? 'Edit author' : 'New author'}
          onClose={() => setEditing(null)} onSave={onSave}
          saving={createMut.isPending || updateMut.isPending}>
          <Field label="Full name" value={editing.fullName}
            onChange={(v) => setEditing({ ...editing, fullName: v })} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Affiliation" value={editing.affiliation}
              onChange={(v) => setEditing({ ...editing, affiliation: v })} />
            <Field label="Country" value={editing.country}
              onChange={(v) => setEditing({ ...editing, country: v })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field type="email" label="Email" value={editing.email}
              onChange={(v) => setEditing({ ...editing, email: v })} />
            <Field label="ORCID" value={editing.orcid}
              onChange={(v) => setEditing({ ...editing, orcid: v })} />
          </div>
          <Field label="Avatar URL" value={editing.avatar}
            onChange={(v) => setEditing({ ...editing, avatar: v })} />
          <div className="grid sm:grid-cols-3 gap-3">
            {['uz', 'ru', 'en'].map((l) => (
              <Field key={l} multiline label={`Bio (${l})`} value={editing.bio?.[l] || ''}
                onChange={(v) => setEditing({ ...editing, bio: { ...editing.bio, [l]: v } })} />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
