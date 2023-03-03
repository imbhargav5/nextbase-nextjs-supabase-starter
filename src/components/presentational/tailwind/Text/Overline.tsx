export default function Overline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const classes = ['text-xs tracking-wider uppercase font-semibold'];
  if (className) {
    classes.push(className);
  } else {
    classes.push('text-black');
  }

  return <p className={classes.join(' ')}>{children}</p>;
}
