import React from 'react';
import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';
import propTypes from 'prop-types';
import RemoveFromCart from './RemoveFromCart';
import Test from 'react-test-attributes'

const CartStyledItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = ({ cartItem }) => {
  if (!cartItem.item)
    return (
      <CartStyledItem>
        <p>This item has been removed</p>
        <RemoveFromCart id={cartItem.id} />
      </CartStyledItem>
    );
  return (
    <CartStyledItem>
      <img width="100px" src={cartItem.item.image} alt={cartItem.item.title} />
      <Test id={`cart-item-details-${cartItem.item.title}`}>
      <div className="cart-item-details">
        <Test id={"item-title"}>
          <div>
          <h3>{cartItem.item.title}</h3>
          </div>
        </Test>
        <Test id="item-price-quantity">
          <p>
            {cartItem.quantity} &times; {formatMoney(cartItem.item.price)}
            {` : `}
            {formatMoney(cartItem.item.price * cartItem.quantity)}
          </p>
        </Test>
      </div>
      </Test>
      <RemoveFromCart id={cartItem.id} />
    </CartStyledItem>
  );
};

CartItem.propTypes = {
  cartItem: propTypes.object.isRequired,
};

export default CartItem;
