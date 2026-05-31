import clsx from 'clsx';

export default function Badge({ children, className, ...rest }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-badge text-xs font-semibold',
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
