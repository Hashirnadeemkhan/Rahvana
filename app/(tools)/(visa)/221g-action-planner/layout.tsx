import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '221(g) Action Planner | Rahvana',
  description: 'Get your personalized action plan after your visa interview',
};

export default function TwentyTwoOneGActionPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {children}
    </div>
  );
}