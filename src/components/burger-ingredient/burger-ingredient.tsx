import { FC, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import {
  Counter,
  CurrencyIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import { TIngredient } from '@utils-types';
import { useLocation, Link } from 'react-router-dom';
import styles from '../ui/burger-ingredient/burger-ingredient.module.css';

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count: number;
};

export const BurgerIngredient: FC<TBurgerIngredientProps> = ({
  ingredient,
  count
}) => {
  const location = useLocation();

  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: ingredient
  });

  return (
    <Link
      to={`/ingredients/${ingredient._id}`}
      state={{ background: location }}
      className={styles.article}
    >
      <div
        className={styles.container}
        ref={dragRef}
        data-testid={`ingredient-${ingredient._id}`}
      >
        {count > 0 && <Counter count={count} size='default' />}
        <img src={ingredient.image} alt={ingredient.name} />
        <div className={`${styles.cost} mt-2 mb-2`}>
          <span className='text text_type_digits-default mr-2'>
            {ingredient.price}
          </span>
          <CurrencyIcon type='primary' />
        </div>
        <p className={`text text_type_main-default ${styles.text}`}>
          {ingredient.name}
        </p>
      </div>
    </Link>
  );
};
