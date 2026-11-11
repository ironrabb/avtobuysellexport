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
  status?: string;
  sellerId?: { _id?: string; name: string; phone?: string };
};

export type AuthMember = {
  id: string;
  name: string;
  email: string;
  type: "BUYER" | "SELLER" | "ADMIN";
  status?: string;
  avatarUrl?: string;
};

export const regions = [
  ["TASHKENT", "Toshkent shahri"],
  ["TASHKENT_REGION", "Toshkent viloyati"],
  ["SAMARKAND", "Samarqand"],
  ["ANDIJAN", "Andijon"],
  ["FERGANA", "Farg‘ona"],
  ["NAMANGAN", "Namangan"],
  ["BUKHARA", "Buxoro"],
  ["KHOREZM", "Xorazm"],
  ["NAVOI", "Navoiy"],
  ["KASHKADARYA", "Qashq‘adaryo"],
  ["SURKHANDARYA", "Surxondaryo"],
  ["JIZZAKH", "Jizzax"],
  ["SYRDARYA", "Sirdaryo"],
  ["KARAKALPAKSTAN", "Qoraqalpog‘iston"],
];

const regionLabels: Record<string, Record<string, string>> = {
  uz: {
    TASHKENT: "Toshkent shahri",
    TASHKENT_REGION: "Toshkent viloyati",
    SAMARKAND: "Samarqand",
    ANDIJAN: "Andijon",
    FERGANA: "Farg‘ona",
    NAMANGAN: "Namangan",
    BUKHARA: "Buxoro",
    KHOREZM: "Xorazm",
    NAVOI: "Navoiy",
    KASHKADARYA: "Qashqadaryo",
    SURKHANDARYA: "Surxondaryo",
    JIZZAKH: "Jizzax",
    SYRDARYA: "Sirdaryo",
    KARAKALPAKSTAN: "Qoraqalpog‘iston",
  },
  ru: {
    TASHKENT: "Ташкент",
    TASHKENT_REGION: "Ташкентская область",
    SAMARKAND: "Самарканд",
    ANDIJAN: "Андижан",
    FERGANA: "Фергана",
    NAMANGAN: "Наманган",
    BUKHARA: "Бухара",
    KHOREZM: "Хорезм",
    NAVOI: "Навои",
    KASHKADARYA: "Кашкадарья",
    SURKHANDARYA: "Сурхандарья",
    JIZZAKH: "Джизак",
    SYRDARYA: "Сырдарья",
    KARAKALPAKSTAN: "Каракалпакстан",
  },
  en: {
    TASHKENT: "Tashkent city",
    TASHKENT_REGION: "Tashkent region",
    SAMARKAND: "Samarkand",
    ANDIJAN: "Andijan",
    FERGANA: "Fergana",
    NAMANGAN: "Namangan",
    BUKHARA: "Bukhara",
    KHOREZM: "Khorezm",
    NAVOI: "Navoi",
    KASHKADARYA: "Kashkadarya",
    SURKHANDARYA: "Surkhandarya",
    JIZZAKH: "Jizzakh",
    SYRDARYA: "Syrdarya",
    KARAKALPAKSTAN: "Karakalpakstan",
  },
  ko: {
    TASHKENT: "타슈켄트시",
    TASHKENT_REGION: "타슈켄트주",
    SAMARKAND: "사마르칸트",
    ANDIJAN: "안디잔",
    FERGANA: "페르가나",
    NAMANGAN: "나망간",
    BUKHARA: "부하라",
    KHOREZM: "호레즘",
    NAVOI: "나보이",
    KASHKADARYA: "카슈카다리야",
    SURKHANDARYA: "수르한다리야",
    JIZZAKH: "지자흐",
    SYRDARYA: "시르다리야",
    KARAKALPAKSTAN: "카라칼팍스탄",
  },
};
export const regionName = (key: string, language = "uz") =>
  regionLabels[language]?.[key] ??
  regions.find(([value]) => value === key)?.[1] ??
  key;

const publicCarPhotos = [
  "/180sx.png",
  "/download%20(1).png",
  "/download%20(2).png",
  "/download.png",
  "/Japan%20car.png",
  "/Pink%20car.png",
];

export const carPhoto = (car: Car, index = 0) => {
  if (car.images?.[index]) return `/public${car.images[index]}`;
  const identity = `${car.make} ${car.model}`.toLowerCase();
  if (identity.includes("nissan") && identity.includes("180"))
    return publicCarPhotos[0];
  if (identity.includes("porsche")) return publicCarPhotos[1];
  if (identity.includes("audi")) return publicCarPhotos[2];
  if (identity.includes("nissan") && identity.includes("skyline"))
    return publicCarPhotos[3];
  if (identity.includes("silvia")) return publicCarPhotos[5];
  const hash = [...`${car._id}${identity}`].reduce(
    (value, char) => value + char.charCodeAt(0),
    0,
  );
  return publicCarPhotos[hash % publicCarPhotos.length];
};

export const money = (value: number, language = "uz") =>
  new Intl.NumberFormat(
    (
      { uz: "uz-UZ", ru: "ru-RU", en: "en-US", ko: "ko-KR" } as Record<
        string,
        string
      >
    )[language] ?? "uz-UZ",
  ).format(value);
