import styled from 'styled-components';

export const Nav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

export const Tab = styled.li`
  display: inline-block;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  a {
    text-decoration: none;
    color: #000;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;
