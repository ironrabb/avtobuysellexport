export type Car = {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  region: string;
  fuel: string;
  transmission: string;
  description?: string;
  images?: string[];
  sellerId?: { name: string; phone: string };
};

export type AuthMember = { id: string; name: string; email: string; type: 'BUYER' | 'SELLER' | 'ADMIN' };

export const regions = [
  ['TASHKENT', 'Toshkent shahri'], ['TASHKENT_REGION', 'Toshkent viloyati'], ['SAMARKAND', 'Samarqand'],
  ['ANDIJAN', 'Andijon'], ['FERGANA', 'Farg‘ona'], ['NAMANGAN', 'Namangan'], ['BUKHARA', 'Buxoro'],
  ['KHOREZM', 'Xorazm'], ['NAVOI', 'Navoiy'], ['KASHKADARYA', 'Qashq‘adaryo'], ['SURKHANDARYA', 'Surxondaryo'],
  ['JIZZAKH', 'Jizzax'], ['SYRDARYA', 'Sirdaryo'], ['KARAKALPAKSTAN', 'Qoraqalpog‘iston']
];

export const regionName = (key: string) => regions.find(([value]) => value === key)?.[1] ?? key;

export const carPhoto = (car: Car, index = 0) => car.images?.[index]
  ? `/public${car.images[index]}`
  : `https://images.unsplash.com/${['photo-1492144534655-ae79c964c9d7', 'photo-1503376780353-7e6692767b70', 'photo-1549317661-bd32c8ce0db2', 'photo-1552519507-da3b142c6e3d'][Math.abs(car._id.charCodeAt(0) || 0) % 4]}?auto=format&fit=crop&w=1000&q=85`;

export const money = (value: number) => new Intl.NumberFormat('uz-UZ').format(value);
