import React from 'react';

const ProductCard = ({ product, onDelete }) => {
  const {
    ProductId,
    'Image Url': imageUrl,
    'Product Desc': productDesc,
    'Origin Price': originPrice,
    'Discount Price': discountPrice,
    'Promotion Url': promotionUrl,
    'Commission Rate': commissionRate,
    'Positive Feedback': positiveFeedback,
    'Coupon Info': couponInfo,
    'Video Url': videoUrl
  } = product;

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
  };

  const calculateDiscount = () => {
    if (!originPrice || !discountPrice) return null;
    const original = parseFloat(originPrice);
    const discount = parseFloat(discountPrice);
    if (isNaN(original) || isNaN(discount)) return null;
    const percentage = Math.round(((original - discount) / original) * 100);
    return percentage > 0 ? `${percentage}% OFF` : null;
  };

  const discountPercentage = calculateDiscount();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <img
          src={imageUrl || '/placeholder-image.jpg'}
          alt={productDesc || 'Product'}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            {discountPercentage}
          </div>
        )}
        {videoUrl && (
          <div className="absolute top-2 right-2">
            <button
              onClick={() => window.open(videoUrl, '_blank')}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              title="Watch Video"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {productDesc || 'No description available'}
        </h3>

        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            {discountPrice && (
              <span className="text-xl font-bold text-green-600">
                {formatPrice(discountPrice)}
              </span>
            )}
            {originPrice && originPrice !== discountPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-1 mb-4 text-sm text-gray-600">
          {commissionRate && (
            <div className="flex justify-between">
              <span>Commission:</span>
              <span className="font-medium">{commissionRate}%</span>
            </div>
          )}
          {positiveFeedback && (
            <div className="flex justify-between">
              <span>Rating:</span>
              <span className="font-medium text-green-600">{positiveFeedback}%</span>
            </div>
          )}
          {couponInfo && (
            <div className="flex justify-between">
              <span>Coupon:</span>
              <span className="font-medium text-blue-600">{couponInfo}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <a
            href={promotionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 text-center"
          >
            Buy Now
          </a>
          {onDelete && (
            <button
              onClick={() => onDelete(ProductId)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors duration-200"
              title="Delete Product"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
