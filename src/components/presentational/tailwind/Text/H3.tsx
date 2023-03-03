export default function H3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const classes = ['text-xl font-bold text-gray-900'];
  if (className) {
    classes.push(className);
  }
  return <h3 className={classes.join(' ')}>{children}</h3>;
}
