import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.div`
  text-align: center;
  padding: 3rem 0;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  color: #4a90e2;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background-color: #4a90e2;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3a7bc8;
  }
`;

const FeaturesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #4a90e2;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #343a40;
`;

const FeatureDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
`;

function Home() {
  return (
    <HomeContainer>
      <Hero>
        <HeroTitle>감성 커뮤니티에 오신 것을 환영합니다</HeroTitle>
        <HeroSubtitle>
          NLP 기반 감정 분석을 통해 정서적으로 안전하고 공감이 가능한 소통 환경을 제공합니다.
          사용자 간 공감과 이해를 높이는 새로운 커뮤니티 경험을 만나보세요.
        </HeroSubtitle>
        <HeroButton to="/register">지금 시작하기</HeroButton>
      </Hero>

      <FeaturesSection>
        <FeatureCard>
          <FeatureIcon>📝</FeatureIcon>
          <FeatureTitle>게시판</FeatureTitle>
          <FeatureDescription>
            감정 분석을 통해 부정적인 표현을 사전에 인지하고, 
            상대방의 감정을 고려한 소통이 가능한 게시판입니다.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>💬</FeatureIcon>
          <FeatureTitle>실시간 채팅</FeatureTitle>
          <FeatureDescription>
            대화 중 감정의 흐름을 실시간으로 분석하여 오해와 갈등을 
            사전에 방지할 수 있는 채팅 시스템입니다.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>👥</FeatureIcon>
          <FeatureTitle>친구 관리</FeatureTitle>
          <FeatureDescription>
            관심사가 비슷한 친구들을 찾고, 감정적으로 조화로운 
            관계를 유지할 수 있도록 도와드립니다.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <HeroSubtitle>
          감정 인식을 통해 사용자 간 공감과 이해를 높이는 커뮤니티를 경험해보세요.
          감정 왜곡과 갈등을 줄여 정서적 안정성과 참여 지속성을 확보합니다.
        </HeroSubtitle>
        <HeroButton to="/board">커뮤니티 둘러보기</HeroButton>
      </div>
    </HomeContainer>
  );
}

export default Home;
