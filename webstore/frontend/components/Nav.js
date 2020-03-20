import Link from 'next/link';
import User from './User';
import NavStyles from './styles/NavStyles';
import Signout from './Signout';
import { Mutation } from 'react-apollo';
import { TOGGLE_CART_MUTATION } from './Cart';
import CartCount from './CartCount';
import Test from 'react-test-attributes';
import React from 'react';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <Test id="navbar">
      <NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <Signout />
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {toggleCart => (
                <Test id ="toggleCart">
                <button onClick={toggleCart}>
                  My Cart{' '}
                  <CartCount
                    count={me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)}
                  />
                </button>
                </Test>
              )}
            </Mutation>
          </>
        )}

        {!me && (
          <Link href="/signup">
            <a>Signin</a>
          </Link>
        )}
      </NavStyles>
      </Test>
    )}
  </User>
);

export default Nav;
