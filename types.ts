
export interface MenuItem {
  name: string;
  prices: string[];
  labels?: string[];
  isPopular?: boolean;
  isSpicy?: boolean;
}

export interface MenuSection {
  id: string;
  title: string;
  emoji: string;
  image: string;
  items: MenuItem[];
  subtitles?: string[];
}

export interface AdditionItem {
  name: string;
  prices: string[];
  labels?: string[];
}

export interface AdditionGroup {
  id: string;
  title: string;
  emoji: string;
  image: string;
  items: AdditionItem[];
}

export interface CartItem {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  size?: string;
  quantity: number;
  notes: string;
  addons: { name: string; price: number; quantity: number }[];
}
