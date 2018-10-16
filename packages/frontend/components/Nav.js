import Link from 'next/link';

import NavStyles from './styles/NavStyles';

const Nav = () => {
  return (
    <NavStyles>
      <Link href="/items">
        <a href="">Items</a>
      </Link>
      <Link href="/sell">
        <a href="">Sell</a>
      </Link>
      <Link href="/signup">
        <a href="">Signup</a>
      </Link>
      <Link href="/orders">
        <a href="">Orders</a>
      </Link>
      <Link href="/me">
        <a href="">Account</a>
      </Link>
    </NavStyles>
  );
};

export default Nav;
