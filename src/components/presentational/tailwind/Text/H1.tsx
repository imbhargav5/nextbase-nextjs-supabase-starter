export default function H1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const classes = ['text-3xl font-semibold text-gray-900'];
  if (className) {
    classes.push(className);
  }
  return <h1 className={classes.join(' ')}>{children}</h1>;
}
