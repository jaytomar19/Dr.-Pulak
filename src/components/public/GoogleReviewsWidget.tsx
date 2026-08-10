'use client';

// TODO: Replace with live GBP API pull

interface GoogleReviewsWidgetProps {
  maxReviews?: number;
}

export default function GoogleReviewsWidget({ maxReviews = 3 }: GoogleReviewsWidgetProps) {
  const reviews = [
    { id: 1, name: 'Rahul Sharma', rating: 5, text: 'Dr. Pulak is an amazing surgeon. My knee replacement went smoothly.', date: '2 months ago' },
    { id: 2, name: 'Anita Verma', rating: 5, text: 'Very patient and listens to all concerns carefully.', date: '4 months ago' },
    { id: 3, name: 'Vikas Kumar', rating: 5, text: 'Highly recommend for ACL injuries. Recovered perfectly.', date: '1 year ago' },
  ].slice(0, maxReviews);

  return (
    <div className="google-reviews">
      <div className="google-reviews__header">
        <div className="google-reviews__rating">
          4.9 <span className="google-reviews__stars">★★★★★</span>
        </div>
        <div className="google-reviews__count">(500+ reviews on Google)</div>
      </div>
      
      <div className="google-reviews__grid">
        {reviews.map(review => (
          <div key={review.id} className="google-reviews__card">
            <div className="google-reviews__card-stars">★★★★★</div>
            <div className="google-reviews__card-name">{review.name}</div>
            <div className="google-reviews__card-text">{review.text}</div>
            <div className="google-reviews__card-date">{review.date}</div>
          </div>
        ))}
      </div>
      
      <a href="#" className="google-reviews__link" target="_blank" rel="noopener noreferrer">
        View all Google Reviews
      </a>
    </div>
  );
}
