import { Recommendation } from '@/types';
import { useRouter } from 'next/navigation';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const router = useRouter();

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{recommendation.product_id}</h3>
          <p className="text-gray-600 mt-1">{recommendation.user_id}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
          Score: {recommendation.score}
        </span>  
      </div>
      <div className="mt-4 flex justify-between items-center">
        
        <button
          onClick={() => router.push(`/products/${recommendation.product_id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Product
        </button>
      </div>
    </div>
  );
}