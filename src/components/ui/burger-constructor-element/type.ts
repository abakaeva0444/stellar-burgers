import { TIngredient } from '@utils-types';

export type BurgerConstructorElementUIProps = {
  ingredient: TIngredient; // Также меняем на TIngredient
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
};
