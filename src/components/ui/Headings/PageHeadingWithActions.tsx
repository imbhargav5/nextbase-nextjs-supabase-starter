type PageHeadingWithActionsProps = {
  heading: string;
  subheading: string;
  children: React.ReactNode;
};

export default function PageHeadingWithActions({
  heading,
  subheading,
  children,
}: PageHeadingWithActionsProps) {
  return (
    <div className="flex justify-between">
      {/* Heading */}
      <div className="flex flex-col w-[480px]">
        <div>
          <p className="text-3xl font-[700] text-black mb-1">{heading}</p>
          <p className="text-base font-[500] text-slate-600">{subheading}</p>
        </div>
      </div>
      {/* Children */}
      {children}
    </div>
  );
}
