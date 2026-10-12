import { useOutletContext } from 'react-router-dom';

// Looks up one of the user's real categories (fetched once by
// DashboardLayout) by its slug: 'lists' (Todos), 'finance', 'health', 'ideas'.
export default function useCategory(slug) {
  const { categories } = useOutletContext();
  return categories.find((c) => c.slug === slug) ?? null;
}
