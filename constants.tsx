
import { MenuSection } from './types';

export const MENU_DATA: MenuSection[] = [
  {
    id: 'fatayer-savory',
    title: 'ركن الفطير الحادق',
    emoji: '🥧',
    image: 'https://8upload.com/image/28fe73463a5771a8/52022918231425109695.jpg',
    subtitles: ['وسط', 'كبير'],
    items: [
      { name: 'سجق', prices: ['90', '120'] },
      { name: 'لحمة مفرومة', prices: ['100', '135'] },
      { name: 'هوت دوج', prices: ['90', '120'] },
      { name: 'بسطرمة', prices: ['100', '140'] },
      { name: 'سلامي', prices: ['100', '135'] },
      { name: 'مشروم', prices: ['90', '115'] },
      { name: 'تونة', prices: ['100', '135'] },
      { name: 'زنجر', prices: ['100', '135'], isSpicy: true },
      { name: 'شاورما فراخ', prices: ['100', '135'] },
      { name: 'ميكس فراخ', prices: ['120', '155'], isPopular: true },
      { name: 'ميكس جبن', prices: ['115', '155'] },
      { name: 'ميكس لحوم', prices: ['120', '160'], isPopular: true },
    ]
  },
  {
    id: 'fatayer-sweet',
    title: 'ركن الفطير الحلو',
    emoji: '🍯',
    image: 'https://8upload.com/image/7e941e36d4afa120/WhatsApp-Image-2022-10-19-at-3.30.52-PM-500x375.jpeg',
    subtitles: ['وسط', 'كبير'],
    items: [
      { name: 'سادة', prices: ['20', '30'] },
      { name: 'بقاشة سكر ولبن', prices: ['30', '40'] },
      { name: 'كريمة', prices: ['40', '55'] },
      { name: 'بسبوسة', prices: ['55', '75'] },
      { name: 'كنافة', prices: ['55', '75'] },
      { name: 'بسبوسة وكنافة', prices: ['55', '75'] },
      { name: 'قشطة وعسل ومكسرات', prices: ['65', '85'], isPopular: true },
      { name: 'شوكولاتة', prices: ['65', '80'] },
      { name: 'لوتس', prices: ['65', '80'] },
      { name: 'مشلتت', prices: ['85', '100'], isPopular: true },
      { name: 'رقاق طري', prices: ['حسب الوزن - اتصل بنا'] },
      { name: 'رقاق ناشف', prices: ['حسب الوزن - اتصل بنا'] },
    ]
  },
  {
    id: 'pizza-oriental',
    title: 'بيتزا شرقي',
    emoji: '🍕',
    image: 'https://8upload.com/image/730f0d20b6d4c90e/920228174853402770529.jpg',
    subtitles: ['وسط', 'كبير'],
    items: [
      { name: 'سجق شرقي', prices: ['100', '120'] },
      { name: 'لحمة مفرومة', prices: ['115', '125'] },
      { name: 'هوت دوج شرقي', prices: ['90', '115'] },
      { name: 'بسطرمة', prices: ['100', '125'] },
      { name: 'سلامي', prices: ['95', '115'] },
      { name: 'مشروم', prices: ['90', '110'] },
      { name: 'تونة', prices: ['105', '125'] },
      { name: 'ميكس لحوم', prices: ['120', '160'], isPopular: true },
      { name: 'ميكس جبن', prices: ['115', '125'] },
      { name: 'شاورما فراخ', prices: ['105', '135'] },
      { name: 'ميكس فراخ', prices: ['120', '150'] },
    ]
  },
  {
    id: 'pizza-italian',
    title: 'بيتزا إيطالي',
    emoji: '🍕',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000',
    subtitles: ['وسط', 'كبير'],
    items: [
      { name: 'مارجريتا', prices: ['75', '90'] },
      { name: 'خضروات', prices: ['75', '90'] },
      { name: 'مشروم', prices: ['90', '115'] },
      { name: 'سجق', prices: ['90', '120'] },
      { name: 'هوت دوج', prices: ['90', '125'] },
      { name: 'سلامي مدخن', prices: ['100', '135'] },
      { name: 'لحمة مفرومة', prices: ['100', '130'] },
      { name: 'بسطرمة', prices: ['100', '135'] },
      { name: 'شاورما فراخ', prices: ['100', '135'] },
      { name: 'زنجر', prices: ['100', '135'], isSpicy: true },
      { name: 'تشيكن رانش', prices: ['115', '145'], isPopular: true },
      { name: 'تشيكن باربكيو', prices: ['110', '140'] },
      { name: 'تونة', prices: ['100', '135'] },
      { name: 'سوبر سوبريم', prices: ['115', '150'] },
      { name: 'ميكس لحوم', prices: ['120', '160'] },
      { name: 'ميكس فراخ', prices: ['120', '155'] },
      { name: 'ميكس جبن', prices: ['115', '150'] },
    ]
  },
  {
    id: 'rolls',
    title: 'رول أطياب',
    emoji: '🌯',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=60&w=800',
    items: [
      { name: 'بطاطس', prices: ['65'] },
      { name: 'سجق', prices: ['80'] },
      { name: 'هوت دوج', prices: ['80'] },
      { name: 'لحمة مفرومة', prices: ['90'] },
      { name: 'زنجر', prices: ['90'], isSpicy: true },
      { name: 'شاورما فراخ', prices: ['90'], isPopular: true },
      { name: 'ميكس جبن', prices: ['100'] },
      { name: 'ميكس لحوم', prices: ['110'] },
    ]
  },
  {
    id: 'syrian',
    title: 'السوري',
    emoji: '🌯',
    image: 'https://8upload.com/image/a4d726b5142e8ffa/1031253834.jpg',
    items: [
      { name: 'بطاطس', prices: ['30'] },
      { name: 'هوت دوج', prices: ['45'] },
      { name: 'شاورما لحمة', prices: ['60'] },
      { name: 'زنجر', prices: ['50'], isSpicy: true },
      { name: 'شاورما فراخ', prices: ['60'], isPopular: true },
      { name: 'برجر', prices: ['60'] },
    ]
  },
  {
    id: 'crepe-savory',
    title: 'ركن الكريب الحادق',
    emoji: '🌯',
    image: 'https://8upload.com/image/b00b5e63f6a0be67/233.jpg',
    items: [
      { name: 'بطاطس', prices: ['50'] },
      { name: 'بطاطس وجبنة', prices: ['55'] },
      { name: 'بانيه', prices: ['60'] },
      { name: 'بانيه وجبنة', prices: ['65'] },
      { name: 'هوت دوج', prices: ['60'] },
      { name: 'هوت دوج وجبنة', prices: ['65'] },
      { name: 'سجق', prices: ['65'] },
      { name: 'سجق وجبنة', prices: ['70'] },
      { name: 'برجر', prices: ['60'] },
      { name: 'برجر وجبنة', prices: ['65'] },
      { name: 'شاورما فراخ', prices: ['75'], isPopular: true },
      { name: 'شاورما فراخ وجبنة', prices: ['80'] },
      { name: 'فاهيتا فراخ', prices: ['80'] },
      { name: 'فاهيتا فراخ وجبنة', prices: ['85'] },
      { name: 'ميكس فراخ', prices: ['80'] },
      { name: 'ميكس فراخ وجبنة', prices: ['85'] },
      { name: 'ميكس لحوم', prices: ['80'], isPopular: true },
      { name: 'ميكس لحوم وجبنة', prices: ['85'] },
      { name: 'ميكس جبن', prices: ['80'] },
    ]
  },
  {
    id: 'crepe-sweet',
    title: 'كريب حلو',
    emoji: '🥞',
    image: 'https://8upload.com/image/8306f88516a43869/940.jpg',
    items: [
      { name: 'شوكولاتة', prices: ['50'] },
      { name: 'شوكولاتة موز ومكسرات', prices: ['60'], isPopular: true },
      { name: 'شوكولاتة أوريو ومكسرات', prices: ['60'] },
      { name: 'لوتس', prices: ['50'] },
    ]
  }
];

export const PIZZA_FATAYER_ADDITIONS = {
  id: 'additions-pizza',
  title: 'إضافات البيتزا والفطير',
  emoji: '✨',
  image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=60&w=800',
  items: [
    { name: 'إضافة جبن', prices: ['20', '35'], labels: ['عادي', 'دبل'] },
    { name: 'إضافة لحوم', prices: ['25', '40'], labels: ['عادي', 'دبل'] },
    { name: 'مشروم', prices: ['20'] },
    { name: 'شيدر', prices: ['15'] },
    { name: 'رانش', prices: ['15'] },
    { name: 'باربكيو', prices: ['15'] },
    { name: 'باكت بطاطس', prices: ['25'] },
  ]
};

export const CREPE_ADDITIONS = {
  id: 'additions-crepe',
  title: 'إضافات الكريب',
  emoji: '✨',
  image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=60&w=800',
  items: [
    { name: 'رانش', prices: ['15'] },
    { name: 'شيدر', prices: ['10'] },
    { name: 'باربكيو', prices: ['10'] },
    { name: 'موتزاريلا', prices: ['10'] },
    { name: 'رومي', prices: ['10'] },
    { name: 'بطاطس', prices: ['10'] },
    { name: 'مشروم', prices: ['15'] },
    { name: 'بانيه', prices: ['10'] },
    { name: 'لحوم (بسطرمة/سلامي)', prices: ['15', '25'], labels: ['عادي', 'دبل'] },
    { name: 'كونوو', prices: ['20'] },
  ]
};
