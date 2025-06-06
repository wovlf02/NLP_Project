import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 2rem 0;
  border-top: 1px solid #e9ecef;
  margin-top: 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FooterTitle = styled.h3`
  color: #4a90e2;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const FooterText = styled.p`
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Copyright = styled.div`
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #adb5bd;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTitle>감성 커뮤니티</FooterTitle>
        <FooterText>NLP 기반 감정 분석을 통한 소통 환경 개선 프로젝트</FooterText>
        <FooterText>정서적으로 안전하고 공감이 가능한 소통 환경을 지향합니다</FooterText>
        <Copyright>© {new Date().getFullYear()} 이은범, 이재필. All rights reserved.</Copyright>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
