import { Navigate } from 'react-router-dom';
import { useCurrentIssue } from '../hooks/useJournal';

export default function CurrentIssuePage() {
  const { data, isLoading } = useCurrentIssue();
  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-12 text-sub">Loading...</div>;
  const issue = data?.data?.issue;
  if (!issue) return <Navigate to="/archive" replace />;
  return <Navigate to={`/issues/${issue.slug}`} replace />;
}
