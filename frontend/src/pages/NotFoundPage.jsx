import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="font-serif text-7xl font-bold text-primary">404</div>
      <p className="mt-2 text-sub">Page not found</p>
      <Link to="/" className="mt-5 bg-primary text-white px-5 py-2.5 rounded-card font-semibold">
        Back to home
      </Link>
    </div>
  );
}
