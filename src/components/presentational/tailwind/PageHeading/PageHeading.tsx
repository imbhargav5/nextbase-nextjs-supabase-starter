import { Anchor } from '@/components/Anchor';
import H1 from '../Text/H1';

type PageHeadingProps = {
  title: string;
  actions?: React.ReactNode;
  titleHref?: string;
};

export function PageHeading({ title, titleHref, actions }: PageHeadingProps) {
  const titleElement = (
    <H1 className="font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
      {title}
    </H1>
  );
  const wrappedTitleElement = titleHref ? (
    <Anchor href={titleHref}>{titleElement}</Anchor>
  ) : (
    <>{titleElement}</>
  );
  return (
    <div className="md:flex  md:items-center md:justify-between">
      <div className="min-w-0 flex-1">{wrappedTitleElement}</div>
      {actions}
    </div>
  );
}
