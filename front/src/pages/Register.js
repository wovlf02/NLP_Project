import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RegisterContainer = styled.div`
    max-width: 500px;
    margin: 3rem auto;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const RegisterTitle = styled.h1`
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

const RegisterButton = styled.button`
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

const LoginLink = styled.div`
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

const AgreementSection = styled.div`
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 4px;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
`;

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [agreements, setAgreements] = useState({
        termsOfService: false,
        privacyPolicy: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // 에러 메시지 초기화
        if (error) setError('');
    };

    const handleAgreementChange = (e) => {
        const { name, checked } = e.target;
        setAgreements({ ...agreements, [name]: checked });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 기본 유효성 검사
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!agreements.termsOfService || !agreements.privacyPolicy) {
            setError('이용약관과 개인정보 처리방침에 동의해주세요.');
            return;
        }

        // 회원가입 처리 (실제로는 API 호출)
        setLoading(true);
        setTimeout(() => {
            // 임시 처리: 항상 성공으로 가정
            setSuccess('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            setLoading(false);

            // 3초 후 로그인 페이지로 이동
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }, 1500);
    };

    return (
        <RegisterContainer>
            <RegisterTitle>회원가입</RegisterTitle>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="name">이름</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="이름 입력"
                        required
                    />
                </FormGroup>

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

                <FormGroup>
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="비밀번호 재입력"
                        required
                    />
                </FormGroup>

                <AgreementSection>
                    <h3>이용약관 동의</h3>
                    <CheckboxLabel>
                        <input
                            type="checkbox"
                            name="termsOfService"
                            checked={agreements.termsOfService}
                            onChange={handleAgreementChange}
                        />
                        이용약관에 동의합니다.
                    </CheckboxLabel>
                    <CheckboxLabel>
                        <input
                            type="checkbox"
                            name="privacyPolicy"
                            checked={agreements.privacyPolicy}
                            onChange={handleAgreementChange}
                        />
                        개인정보 처리방침에 동의합니다.
                    </CheckboxLabel>
                </AgreementSection>

                <RegisterButton type="submit" disabled={loading}>
                    {loading ? '가입 중...' : '회원가입'}
                </RegisterButton>
            </form>

            <LoginLink>
                이미 계정이 있으신가요? <Link to="/login">로그인</Link>
            </LoginLink>
        </RegisterContainer>
    );
}

export default Register;