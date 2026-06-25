import { requireCurrentWorkspace } from '@/data/user/workspaces';
import {
  getAssignableMembers,
  getFeedbackReport,
  getLabels,
} from '@/data/user/feedback';
import { notFound } from 'next/navigation';
import { ReportDetailClient, type ReportDetail } from './report-detail-client';

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  await requireCurrentWorkspace();
  const { reportId } = await params;
  const [report, members, labels] = await Promise.all([
    getFeedbackReport(reportId),
    getAssignableMembers(),
    getLabels(),
  ]);
  if (!report) notFound();

  return (
    <ReportDetailClient
      report={report as unknown as ReportDetail}
      members={members}
      labels={labels}
    />
  );
}
