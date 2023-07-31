type BasicPageHeadingProps = {
  heading: string;
  subheading: string;
};

export default function BasicPageHeading({
  heading,
  subheading,
}: BasicPageHeadingProps) {
  return (
    <div className="flex flex-col w-[480px]">
      <div>
        <p className="text-3xl font-[700] text-black mb-1">{heading}</p>
        <p className="text-base font-[450] text-slate-600">{subheading}</p>
      </div>
    </div>
  );
}
