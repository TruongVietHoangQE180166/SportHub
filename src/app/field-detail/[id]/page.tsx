import FieldDetailPage from '../../../components/pages/Field-detail';

export default function FieldDetailRoute({ params }: { params: { id: string } }) {
  return <FieldDetailPage fieldId={params.id} />;
}
