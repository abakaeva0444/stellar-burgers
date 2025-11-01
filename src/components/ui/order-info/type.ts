import { TIngredient } from '@utils-types';

export type OrderInfoUIProps = {
  orderInfo: TOrderInfo;
};

type TOrderInfo = {
  ingredientsInfo: Array<TIngredient & { count: number }>; // Изменяем на массив
  date: Date;
  total: number;
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};
