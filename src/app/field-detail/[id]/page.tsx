// app/field-detail/[id]/page.tsx
import FieldDetailPage from '../../../components/pages/Field-detail';

export default async function FieldDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FieldDetailPage fieldId={id} />;
}