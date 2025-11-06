import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from '@/components/ui/empty';

interface EmptyTableProps {
  title: string;
  description: string;
}

export default function EmptyTable({ title, description }: EmptyTableProps) {
  return (
    <Empty>
      <EmptyContent>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
