interface SearchData {
  query: string;
  productType: string;
  maxPrice?: number;
  features?: string[];
  resultsCount: number;
}

export const addToSearchHistory = (data: SearchData) => {
  const newSearch = {
    id: Date.now().toString(),
    query: data.query,
    productType: data.productType,
    maxPrice: data.maxPrice,
    features: data.features,
    timestamp: new Date().toISOString(),
    resultsCount: data.resultsCount,
    isInWishlist: false,
  };

  try {
    const existing = JSON.parse(sessionStorage.getItem('searchHistory') || '[]');

    const updated = [
      newSearch,
      ...existing.filter((item: any) =>
        item.query.toLowerCase() !== data.query.toLowerCase()
      ),
    ].slice(0, 50); // Keep only 50 entries

    sessionStorage.setItem('searchHistory', JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save search history:', err);
  }
};

