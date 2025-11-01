import { OrderInfoUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/OrderInfo',
  component: OrderInfoUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof OrderInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultOrderInfo: Story = {
  args: {
    orderInfo: {
      // Преобразуем в массив
      ingredientsInfo: [
        {
          _id: '211',
          name: 'Булка',
          type: 'bun',
          proteins: 12,
          fat: 23,
          carbohydrates: 45,
          calories: 56,
          price: 67,
          image: '',
          image_large: '',
          image_mobile: '',
          count: 2
        },
        {
          _id: '212',
          name: 'Котлета',
          type: 'main',
          proteins: 20,
          fat: 15,
          carbohydrates: 30,
          calories: 250,
          price: 45,
          image: '',
          image_large: '',
          image_mobile: '',
          count: 1
        },
        {
          _id: '213',
          name: 'Сыр',
          type: 'main',
          proteins: 15,
          fat: 25,
          carbohydrates: 5,
          calories: 180,
          price: 22,
          image: '',
          image_large: '',
          image_mobile: '',
          count: 1
        }
      ],
      date: new Date('2024-01-25'),
      total: 134,
      _id: '233',
      status: 'done', // Изменено на 'done' для корректного отображения статуса
      name: 'Order',
      createdAt: '',
      updatedAt: '',
      number: 2,
      ingredients: ['211', '212', '213']
    }
  }
};
