import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a90e2;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f7ff;
    color: #4a90e2;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#4a90e2' : 'transparent'};
  color: ${props => props.primary ? '#fff' : '#4a90e2'};
  border: 1px solid #4a90e2;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.primary ? '#3a7bc8' : '#f0f7ff'};
  }
`;

function Header({ isLoggedIn, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Logo>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          감성 커뮤니티
        </Link>
      </Logo>

      <Navigation>
        <NavLink to="/">홈</NavLink>
        <NavLink to="/board">게시판</NavLink>
        {isLoggedIn && (
          <>
            <NavLink to="/chat">채팅</NavLink>
            <NavLink to="/friends">친구</NavLink>
          </>
        )}
      </Navigation>

      <UserSection>
        {isLoggedIn ? (
          <>
            <UserName>{user?.name}</UserName>
            <NavLink to="/profile">프로필</NavLink>
            <Button onClick={handleLogout}>로그아웃</Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate('/login')}>로그인</Button>
            <Button primary onClick={() => navigate('/register')}>회원가입</Button>
          </>
        )}
      </UserSection>
    </HeaderContainer>
  );
}

export default Header;
