import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Mock API 임포트
import { authApi } from '../api/mockApi';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LoginTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  &:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #d4edda;
  border-radius: 4px;
  text-align: center;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #6c757d;
  
  a {
    color: #4a90e2;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TestAccountBox = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px dashed #dee2e6;
`;

const TestAccountTitle = styled.h3`
  font-size: 1rem;
  color: #495057;
  margin-bottom: 0.5rem;
`;

const TestAccountInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const TestAccountText = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const TestAccountButton = styled.button`
  background-color: #e9ecef;
  color: #495057;
  border: none;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background-color: #dee2e6;
  }
`;

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // 에러 메시지 초기화
    if (error) setError('');
  };
  
  // 테스트 계정으로 자동 입력
  const fillTestAccount = () => {
    setFormData({
      email: 'test@example.com',
      password: 'password'
    });
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 기본 유효성 검사
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    // 로그인 처리 (Mock API 호출)
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await authApi.login(formData.email, formData.password);
      
      if (response.success) {
        setSuccess('로그인 성공! 홈페이지로 이동합니다.');
        
        // 잠시 후 홈페이지로 이동
        setTimeout(() => {
          onLogin(response.data);
          navigate('/');
        }, 1000);
      } else {
        setError(response.error || '이메일 또는 비밀번호가 올바르지 않습니다.');
        setLoading(false);
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error('로그인 실패:', error);
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginTitle>로그인</LoginTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일 주소 입력"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
            required
          />
        </FormGroup>
        
        <LoginButton type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </LoginButton>
      </form>
      
      <RegisterLink>
        계정이 없으신가요? <Link to="/register">회원가입</Link>
      </RegisterLink>
      
      <TestAccountBox>
        <TestAccountTitle>테스트 계정</TestAccountTitle>
        <TestAccountInfo>
          <TestAccountText>
            이메일: test@example.com<br />
            비밀번호: password
          </TestAccountText>
          <TestAccountButton onClick={fillTestAccount}>자동 입력</TestAccountButton>
        </TestAccountInfo>
      </TestAccountBox>
    </LoginContainer>
  );
}

export default Login;
