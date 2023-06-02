import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

export const Header = styled.header`
  background: linear-gradient(to bottom, #000000, #333333);

  padding: 8px 0;
  border-bottom: 1px solid black;
  > div {
    display: flex;
    height: 70px;
    align-items: center;
    justify-content: space-between;

    gap: 12px;
  }
  > nav {
    display: flex;
  }
`;

export const Logo = styled(Link)`
  font-weight: 700;
  margin: 0;
  margin-left: 50px;
  text-decoration: none;
  color: black;
`;

export const Links = styled(NavLink)`
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  color: #fff;
  font-weight: 500;

  &.active {
    color: white;
    background-color: orangered;
  }
`;
export const Contacts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
