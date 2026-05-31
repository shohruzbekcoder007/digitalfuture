import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useArticles, useCreateArticle, useUpdateArticle, useDeleteArticle,
  useIssues, useAuthors,
} from '../../hooks/useJournal';
import { pickLocalized } from '../../utils/format';
import { Field, Select, Checkbox, Modal } from './AdminFormElements';

const empty = () => ({
  title: { uz: '', ru: '', en: '' },
  abstract: { uz: '', ru: '', en: '' },
  body: { uz: '', ru: '', en: '' },
  authors: [],
  keywords: '',
  category: 'research',
  language: 'uz',
  doi: '',
  pages: '',
  pdfUrl: '',
  publicationDate: new Date().toISOString().slice(0, 10),
  issue: '',
  featured: false,
});

export default function AdminArticlesPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];

  const { data, isLoading } = useArticles({ limit: 200 });
  const { data: issuesRes } = useIssues({ limit: 100 });
  const { data: authorsRes } = useAuthors({ limit: 200 });

  const createMut = useCreateArticle();
  const updateMut = useUpdateArticle();
  const deleteMut = useDeleteArticle();

  const [editing, setEditing] = useState(null);
  const items = data?.data || [];
  const issues = issuesRes?.data || [];
  const authors = authorsRes?.data || [];

  const onSave = async () => {
    const payload = {
      ...editing,
      keywords: typeof editing.keywords === 'string'
        ? editing.keywords.split(',').map((s) => s.trim()).filter(Boolean)
        : editing.keywords,
    };
    try {
      if (editing._id) await updateMut.mutateAsync({ id: editing._id, payload });
      else await createMut.mutateAsync(payload);
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

  const toggleAuthor = (id) => {
    const list = editing.authors.includes(id)
      ? editing.authors.filter((x) => x !== id)
      : [...editing.authors, id];
    setEditing({ ...editing, authors: list });
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
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Issue</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Authors</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-sub">...</td></tr>
            ) : items.map((a) => (
              <tr key={a._id} className="border-t border-line">
                <td className="px-4 py-3 font-medium max-w-md">
                  <div className="truncate">{pickLocalized(a.title, lang)}</div>
                </td>
                <td className="px-4 py-3 text-sub">
                  {a.issue ? `V${a.issue.volume}I${a.issue.issueNumber}` : '—'}
                </td>
                <td className="px-4 py-3 text-sub">{t(`category.${a.category}`)}</td>
                <td className="px-4 py-3 text-sub truncate max-w-[200px]">
                  {(a.authorNames || []).join(', ')}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing({
                    ...a,
                    authors: (a.authors || []).map((au) => au._id || au),
                    issue: a.issue?._id || a.issue,
                    keywords: (a.keywords || []).join(', '),
                    publicationDate: a.publicationDate
                      ? new Date(a.publicationDate).toISOString().slice(0, 10) : '',
                  })}
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
        <Modal title={editing._id ? 'Edit article' : 'New article'}
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
              <Field key={l} multiline rows={4} label={`Abstract (${l})`} value={editing.abstract[l]}
                onChange={(v) => setEditing({ ...editing, abstract: { ...editing.abstract, [l]: v } })} />
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {['uz', 'ru', 'en'].map((l) => (
              <Field key={l} multiline rows={6} label={`Body (${l})`} value={editing.body[l]}
                onChange={(v) => setEditing({ ...editing, body: { ...editing.body, [l]: v } })} />
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Select label="Issue" value={editing.issue}
              onChange={(v) => setEditing({ ...editing, issue: v })}
              options={[{ value: '', label: '—' }, ...issues.map((i) => ({
                value: i._id, label: `Vol.${i.volume} Iss.${i.issueNumber} (${i.year})`,
              }))]} />
            <Select label="Category" value={editing.category}
              onChange={(v) => setEditing({ ...editing, category: v })}
              options={['research', 'review', 'case-study', 'editorial', 'short-communication', 'other']} />
            <Select label="Language" value={editing.language}
              onChange={(v) => setEditing({ ...editing, language: v })}
              options={['uz', 'ru', 'en']} />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="DOI" value={editing.doi}
              onChange={(v) => setEditing({ ...editing, doi: v })} />
            <Field label="Pages (e.g. 1-15)" value={editing.pages}
              onChange={(v) => setEditing({ ...editing, pages: v })} />
            <Field type="date" label="Publication date" value={editing.publicationDate}
              onChange={(v) => setEditing({ ...editing, publicationDate: v })} />
          </div>
          <Field label="PDF URL" value={editing.pdfUrl}
            onChange={(v) => setEditing({ ...editing, pdfUrl: v })} />
          <Field label="Keywords (comma-separated)" value={editing.keywords}
            onChange={(v) => setEditing({ ...editing, keywords: v })} />
          <div>
            <div className="text-sub font-medium text-sm mb-2">Authors</div>
            <div className="max-h-40 overflow-y-auto border border-line rounded-card p-3 grid sm:grid-cols-2 gap-1">
              {authors.map((a) => (
                <label key={a._id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.authors.includes(a._id)}
                    onChange={() => toggleAuthor(a._id)} />
                  <span>{a.fullName}</span>
                </label>
              ))}
            </div>
          </div>
          <Checkbox label="Featured" checked={editing.featured}
            onChange={(v) => setEditing({ ...editing, featured: v })} />
        </Modal>
      )}
    </div>
  );
}
