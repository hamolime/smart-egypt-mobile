import colors from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

export function useColors() {
  const { isDark } = useTheme();
  return isDark ? colors.dark : colors.light;
}
