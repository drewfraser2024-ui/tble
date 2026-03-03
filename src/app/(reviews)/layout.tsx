import BackButton from '@/components/ui/BackButton';

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <BackButton href="/" />
      </div>
      {children}
    </div>
  );
}
