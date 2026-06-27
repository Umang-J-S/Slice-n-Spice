import { useState, useEffect } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle: string;
  onSuccess: () => void;
}

export default function ReviewModal({ isOpen, onClose, itemId, itemTitle, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingReview, setIsFetchingReview] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMyReview = async () => {
      setIsFetchingReview(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/menu/items/${itemId}/reviews/me`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          setRating(data.data.rating);
          setReviewText(data.data.reviewText || '');
          setHasExistingReview(true);
        } else {
          setRating(0);
          setReviewText('');
          setHasExistingReview(false);
        }
      } catch (err) {
        console.error("Error fetching review:", err);
      } finally {
        setIsFetchingReview(false);
      }
    };

    fetchMyReview();
  }, [isOpen, itemId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/menu/items/${itemId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ rating, reviewText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-2">{hasExistingReview ? "Update" : "Rate"} <span className="text-amber-400">{itemTitle}</span></h2>
          <p className="text-sm text-white/50 mb-6">Let us know how the food was and if you have any suggestions.</p>

          {isFetchingReview ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
              <p className="text-sm text-white/50">Loading your review...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      className={`h-8 w-8 transition-colors ${
                        (hoverRating || rating) >= star 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'fill-transparent text-white/20'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-semibold text-amber-400 min-h-[20px]">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent!"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="reviewText" className="text-sm font-semibold text-white/80">
                  Any suggestions? (Optional)
                </label>
                <span className={`text-xs ${256 - reviewText.length === 0 ? 'text-amber-400 font-bold' : 'text-white/40'}`}>
                  {256 - reviewText.length} characters remaining
                </span>
              </div>
              <textarea
                id="reviewText"
                rows={3}
                maxLength={256}
                placeholder="Was it too spicy? Needs more salt? Or was it perfect?"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 resize-none transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold h-12 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {hasExistingReview ? "Updating..." : "Submitting..."}
                </>
              ) : (
                hasExistingReview ? "Update Review" : "Submit Review"
              )}
            </Button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
