import { FeedInfoUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/FeedInfo',
  component: FeedInfoUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FeedInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultFeedInfo: Story = {
  args: {
    feed: {
      orders: [
        {
          _id: '11111',
          status: 'done', // Изменено на 'done' для корректного отображения
          name: 'Burger',
          createdAt: '',
          updatedAt: '',
          number: 123,
          ingredients: ['Булка', 'Начинка']
        }
      ],
      total: 12,
      totalToday: 2
      // Убрали isLoading и error - они не нужны в UI компоненте
    },
    readyOrders: [123, 124, 125],
    pendingOrders: [126, 127]
  }
};
