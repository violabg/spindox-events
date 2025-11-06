import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getScoresByContest } from '@/queries/scores';

type ScoresTableProps = {
  scores: Awaited<ReturnType<typeof getScoresByContest>>;
};

export default function ScoresTable({ scores }: ScoresTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Total Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scores.map((score, index) => (
          <TableRow key={score.user.id}>
            <TableCell className="text-center">#{index + 1}</TableCell>
            <TableCell>{score.user.name}</TableCell>
            <TableCell className="text-muted-foreground">{score.user.email}</TableCell>
            <TableCell className="text-right font-medium">{score.totalScore}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
