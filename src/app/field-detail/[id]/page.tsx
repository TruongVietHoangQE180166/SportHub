// app/field-detail/[id]/page.tsx
import FieldDetailPage from '../../../components/pages/Field-detail';

type ParamsType = { id: string };

export default async function FieldDetailRoute({ params }: { params: Promise<ParamsType> }) {
  const { id } = await params;
  return <FieldDetailPage fieldId={id} />;
}