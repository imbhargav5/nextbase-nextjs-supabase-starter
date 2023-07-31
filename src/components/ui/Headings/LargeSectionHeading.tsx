type LargeSectionHeadingProps = {
  heading: string;
  subheading: string;
  children: React.ReactNode;
};

export default function LargeSectionHeading({
  heading,
  subheading,
  children,
}: LargeSectionHeadingProps) {
  return (
    <div className="flex justify-between">
      {/* Heading */}
      <div className="flex flex-col max-w-[480px]">
        <div>
          <p className="text-2xl font-[600] text-black mb-1">{heading}</p>
          <p className="text-base font-[500] text-slate-600 ">{subheading}</p>
        </div>
      </div>

      {/* Children */}
      {children}
    </div>
  );
}
