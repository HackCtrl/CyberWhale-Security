
// Define the types of searchable content
export type SearchResult = {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'challenge' | 'article' | 'community' | 'product' | 'page';
};

// Mock database of searchable content
// In a real app, this would come from your API or database
const searchableContent: SearchResult[] = [
  {
    id: 'challenge-1',
    title: 'Web Exploitation Basics',
    description: 'Learn the fundamentals of web exploitation techniques.',
    url: '/ctf/challenge/1',
    type: 'challenge',
  },
  {
    id: 'challenge-2',
    title: 'Buffer Overflow 101',
    description: 'Introduction to buffer overflow vulnerabilities and exploitation.',
    url: '/ctf/challenge/2',
    type: 'challenge',
  },
  {
    id: 'article-1',
    title: 'Understanding OWASP Top 10',
    description: 'A comprehensive guide to the OWASP Top 10 web application security risks.',
    url: '/knowledge/article/1',
    type: 'article',
  },
  {
    id: 'article-2',
    title: 'Secure Coding Practices',
    description: 'Best practices for writing secure code and preventing common vulnerabilities.',
    url: '/knowledge/article/2',
    type: 'article',
  },
  {
    id: 'community-1',
    title: 'Telegram Community',
    description: 'Join our active Telegram community for discussions and help.',
    url: 'https://t.me/HackCtrl_Official',
    type: 'community',
  },
  {
    id: 'product-1',
    title: 'CyberWhale Pro Subscription',
    description: 'Access premium challenges, resources, and support with our Pro subscription.',
    url: '/products',
    type: 'product',
  },
  {
    id: 'page-home',
    title: 'Home',
    description: 'Main page of CyberWhale platform.',
    url: '/',
    type: 'page',
  },
  {
    id: 'page-about',
    title: 'About Us',
    description: 'Learn about the CyberWhale team and our mission.',
    url: '/about',
    type: 'page',
  },
];

// Search function that filters content based on query
// Improved to better match exact user input and prioritize results
export function searchContent(query: string): SearchResult[] {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Score-based search results
  const scoredResults = searchableContent.map(item => {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const descLower = item.description.toLowerCase();
    
    // Exact matches in title get highest priority
    if (titleLower === normalizedQuery) {
      score += 100;
    } 
    // Title starts with query
    else if (titleLower.startsWith(normalizedQuery)) {
      score += 75;
    }
    // Title contains query
    else if (titleLower.includes(normalizedQuery)) {
      score += 50;
    }
    
    // Description exact match
    if (descLower === normalizedQuery) {
      score += 30;
    }
    // Description contains query
    else if (descLower.includes(normalizedQuery)) {
      score += 15;
    }
    
    // Word match in title (for multi-word searches)
    normalizedQuery.split(' ').forEach(word => {
      if (word.length > 2 && titleLower.includes(word)) {
        score += 10;
      }
    });
    
    // Word match in description
    normalizedQuery.split(' ').forEach(word => {
      if (word.length > 2 && descLower.includes(word)) {
        score += 5;
      }
    });
    
    return { item, score };
  }).filter(({ score }) => score > 0);
  
  // Sort by score (highest first) and return the items
  return scoredResults
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
