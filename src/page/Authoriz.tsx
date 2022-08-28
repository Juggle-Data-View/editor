import styled from 'styled-components';

const Container = styled.div`
  background-color: #1f2127;
  height: 100%;
  text-align: center;
  overflow: hidden;
  > img {
    margin-top: 100px;
  }
  > p {
    margin-top: -60px;
    font-size: 20px;
    color: rgba(255, 255, 255, 0.35);
  }
`;

export default function NotFound() {
  return (
    <Container>
      <p>无权访问当前页面，请检查页面链接！</p>
    </Container>
  );
}
