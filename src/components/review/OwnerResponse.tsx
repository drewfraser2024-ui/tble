import { formatDate } from '@/lib/utils';
import type { OwnerResponse as OwnerResponseType } from '@/types/review';

interface OwnerResponseProps {
  response: OwnerResponseType;
}

export default function OwnerResponse({ response }: OwnerResponseProps) {
  return (
    <div className="mt-3 bg-turquoise/5 border border-turquoise/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-turquoise/20 flex items-center justify-center">
          <svg className="w-3 h-3 text-turquoise" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-turquoise-dark">
          Owner Response
        </span>
        <span className="text-xs text-gray-400">{formatDate(response.created_at)}</span>
      </div>
      <p className="text-sm text-gray-700">{response.response_text}</p>
      {response.image_url && (
        <img
          src={response.image_url}
          alt="Owner response"
          className="mt-2 w-32 h-32 object-cover rounded-lg"
        />
      )}
    </div>
  );
}
