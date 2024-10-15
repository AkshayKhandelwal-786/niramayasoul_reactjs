import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import styled from 'styled-components';
import Footer from "./Footer";
const Content = styled.div`
  flex-grow: 1;
`;

const Layout = ({ children }) => {
    return (
    <>
      <Header />
      <Content>{children}</Content>
      <Footer/>
    </>
  );
}

export default Layout;
