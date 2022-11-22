import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const MobileMenuStyled = styled.nav`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 1rem;
  .menu-tab {
    svg {
      path {
        fill: var(--text-secondary);
      }
    }
    &.active {
      path {
        fill: var(--primary);
      }
    }
  }
`;

const MobileMenu = () => {
  const { pathname } = useLocation();

  const isActive = (path: string): boolean => pathname === path;

  return (
    <MobileMenuStyled>
      <Link className={`menu-tab ${isActive('/general-settings') ? 'active' : ''}`} to="/general-settings">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24.4778 12.5876C24.4743 10.1449 23.7326 7.7602 22.3501 5.74632C20.9676 3.73244 19.0088 2.18336 16.7305 1.30222C14.4522 0.421076 11.9608 0.249011 9.58302 0.808574C7.20522 1.36814 5.05203 2.63321 3.40579 4.43791L3.37143 4.4767C3.32821 4.52436 3.28609 4.57313 3.24287 4.6219C2.38565 5.60542 1.69322 6.72118 1.19242 7.9259C1.08909 8.17377 1.04858 8.44333 1.07451 8.71062C1.10044 8.97791 1.19199 9.23466 1.34103 9.45805C1.49006 9.68145 1.69198 9.86457 1.92882 9.99115C2.16567 10.1177 2.43012 10.1838 2.69867 10.1836H2.88376C3.20545 10.1874 3.52084 10.0943 3.78888 9.91636C4.05693 9.73845 4.26523 9.48398 4.38668 9.18608C4.822 8.15654 5.45285 7.22119 6.24428 6.43183C6.28862 6.38639 6.33516 6.34206 6.38172 6.29772L6.43159 6.24895L6.50585 6.18023L6.61669 6.0827L6.63553 6.06608C7.33774 5.44427 8.13614 4.94044 8.99964 4.57423L9.06171 4.54652C11.1852 3.66981 13.5695 3.66981 15.693 4.54652L15.7528 4.57312C16.4807 4.88217 17.1631 5.28899 17.7811 5.78234L17.8232 5.81559L17.9141 5.89095C17.9518 5.92199 17.9895 5.95302 18.0249 5.98516L18.0615 6.0162L18.2045 6.14366C18.9297 6.80222 19.5382 7.57866 20.0045 8.44016C20.139 8.68864 20.2068 8.96782 20.201 9.25034C20.1952 9.53287 20.1162 9.80907 19.9716 10.0519C19.827 10.2947 19.6219 10.4957 19.3762 10.6354C19.1306 10.7751 18.8528 10.8485 18.5703 10.8486H18.3752C18.0839 10.8529 17.7971 10.7772 17.5459 10.6296C17.2948 10.482 17.089 10.2683 16.951 10.0118C16.3865 8.9988 15.5017 8.20184 14.4355 7.74587C13.3692 7.2899 12.1818 7.20074 11.0594 7.49235C9.93701 7.78397 8.94315 8.43985 8.23371 9.35717C7.52427 10.2745 7.13936 11.4013 7.13936 12.561C7.13936 13.7207 7.52427 14.8475 8.23371 15.7649C8.94315 16.6822 9.93701 17.3381 11.0594 17.6297C12.1818 17.9213 13.3692 17.8321 14.4355 17.3762C15.5017 16.9202 16.3865 16.1232 16.951 15.1102C17.0891 14.8538 17.295 14.6403 17.5461 14.4927C17.7972 14.3452 18.084 14.2694 18.3752 14.2734H18.5703C18.8529 14.2737 19.1306 14.3474 19.3762 14.4872C19.6218 14.627 19.8269 14.8281 19.9715 15.071C20.116 15.3139 20.1951 15.5901 20.2008 15.8726C20.2066 16.1552 20.139 16.4344 20.0045 16.683C19.066 18.4164 17.5665 19.7795 15.7517 20.5489C15.454 20.6706 15.1997 20.879 15.0218 21.147C14.844 21.4149 14.7507 21.7302 14.7542 22.0518V22.2425C14.7544 22.5109 14.8208 22.7751 14.9474 23.0118C15.0741 23.2485 15.2571 23.4503 15.4803 23.5995C15.7035 23.7486 15.96 23.8404 16.2272 23.8669C16.4943 23.8933 16.7638 23.8535 17.0119 23.7509C19.1828 22.8498 21.0445 21.3361 22.3697 19.3947C23.6948 17.4533 24.4262 15.1682 24.4744 12.8181C24.4744 12.7893 24.4744 12.7616 24.4744 12.7339C24.4767 12.6818 24.4778 12.6342 24.4778 12.5876Z" />
          <path d="M12.4266 21.2451C12.0892 21.2449 11.7593 21.3448 11.4786 21.5321C11.198 21.7194 10.9792 21.9857 10.8499 22.2973C10.7206 22.609 10.6867 22.952 10.7524 23.283C10.8181 23.6139 10.9804 23.918 11.2189 24.1566C11.4574 24.3953 11.7614 24.5579 12.0923 24.6238C12.4232 24.6897 12.7662 24.6559 13.078 24.5269C13.3897 24.3978 13.6562 24.1792 13.8437 23.8986C14.0312 23.6181 14.1312 23.2883 14.1312 22.9509C14.1312 22.4987 13.9517 22.065 13.632 21.7451C13.3124 21.4253 12.8788 21.2454 12.4266 21.2451Z" />
          <path d="M9.995 22.1237C9.995 21.7863 9.89493 21.4565 9.70745 21.1759C9.51997 20.8954 9.25351 20.6768 8.94176 20.5477C8.63001 20.4186 8.28698 20.3849 7.95607 20.4508C7.62515 20.5167 7.32122 20.6793 7.08271 20.918C6.8442 21.1566 6.68183 21.4607 6.61614 21.7916C6.55045 22.1226 6.58438 22.4656 6.71366 22.7773C6.84293 23.0889 7.06173 23.3553 7.34239 23.5425C7.62305 23.7298 7.95294 23.8297 8.29036 23.8295C8.74256 23.8292 9.17614 23.6493 9.49579 23.3295C9.81544 23.0096 9.995 22.5759 9.995 22.1237Z" />
          <path d="M6.55677 19.7468C6.55677 19.4094 6.45673 19.0796 6.2693 18.7991C6.08187 18.5186 5.81546 18.3 5.50378 18.1709C5.19209 18.0418 4.84912 18.008 4.51824 18.0738C4.18736 18.1396 3.88342 18.3021 3.64487 18.5406C3.40631 18.7792 3.24386 19.0831 3.17804 19.414C3.11222 19.7449 3.146 20.0878 3.27511 20.3995C3.40421 20.7112 3.62284 20.9776 3.90335 21.1651C4.18386 21.3525 4.51365 21.4525 4.85102 21.4525C5.30341 21.4525 5.73727 21.2728 6.05717 20.9529C6.37706 20.633 6.55677 20.1992 6.55677 19.7468Z" />
          <path d="M4.41224 16.3347C4.41224 15.9972 4.31217 15.6674 4.12469 15.3869C3.93721 15.1063 3.67074 14.8877 3.35899 14.7586C3.04724 14.6296 2.70422 14.5959 2.3733 14.6618C2.04239 14.7277 1.73845 14.8903 1.49994 15.1289C1.26143 15.3676 1.09907 15.6716 1.03337 16.0026C0.967682 16.3335 1.00162 16.6765 1.13089 16.9882C1.26017 17.2999 1.47897 17.5662 1.75963 17.7535C2.04028 17.9408 2.37018 18.0406 2.70759 18.0404C3.15979 18.0401 3.59337 17.8603 3.91303 17.5404C4.23268 17.2206 4.41224 16.7869 4.41224 16.3347Z" />
          <path d="M3.66736 12.3962C3.66736 12.0588 3.56732 11.729 3.37989 11.4485C3.19246 11.168 2.92606 10.9494 2.61438 10.8203C2.30269 10.6912 1.95972 10.6574 1.62884 10.7232C1.29795 10.789 0.994017 10.9515 0.755464 11.19C0.51691 11.4286 0.354453 11.7325 0.288636 12.0634C0.222819 12.3943 0.256598 12.7373 0.385703 13.049C0.514807 13.3606 0.733438 13.627 1.01395 13.8145C1.29446 14.0019 1.62425 14.1019 1.96161 14.1019C2.41392 14.1017 2.84761 13.9219 3.16744 13.602C3.48726 13.2822 3.66707 12.8485 3.66736 12.3962Z" />
        </svg>
      </Link>

      <Link className={`menu-tab ${isActive('/') ? 'active' : ''}`} to="/">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0ZM2 8H6V2H2V8ZM12 16H16V10H12V16ZM12 4H16V2H12V4ZM2 16H6V14H2V16Z" />
        </svg>
      </Link> 
      <Link className={`menu-tab ${isActive('/home') ? 'active' : ''}`} to="/home">
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 18V6L8 0L16 6V18H10V11H6V18H0Z" />
        </svg>
      </Link> 
      <Link className={`menu-tab ${isActive('/search') ? 'active' : ''}`} to="/search">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.146 12.371 1.888 11.113C0.629333 9.85433 0 8.31667 0 6.5C0 4.68333 0.629333 3.14567 1.888 1.887C3.146 0.629 4.68333 0 6.5 0C8.31667 0 9.85433 0.629 11.113 1.887C12.371 3.14567 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5627 8.81267 11 7.75 11 6.5C11 5.25 10.5627 4.18733 9.688 3.312C8.81267 2.43733 7.75 2 6.5 2C5.25 2 4.18733 2.43733 3.312 3.312C2.43733 4.18733 2 5.25 2 6.5C2 7.75 2.43733 8.81267 3.312 9.688C4.18733 10.5627 5.25 11 6.5 11Z" />
        </svg>
      </Link> 

      <Link className={`menu-tab ${isActive('/account') ? 'active' : ''}`} to="/account">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.85 15.1C4.7 14.45 5.65 13.9373 6.7 13.562C7.75 13.1873 8.85 13 10 13C11.15 13 12.25 13.1873 13.3 13.562C14.35 13.9373 15.3 14.45 16.15 15.1C16.7333 14.4167 17.1877 13.6417 17.513 12.775C17.8377 11.9083 18 10.9833 18 10C18 7.78333 17.221 5.89567 15.663 4.337C14.1043 2.779 12.2167 2 10 2C7.78333 2 5.896 2.779 4.338 4.337C2.77933 5.89567 2 7.78333 2 10C2 10.9833 2.16267 11.9083 2.488 12.775C2.81267 13.6417 3.26667 14.4167 3.85 15.1ZM10 11C9.01667 11 8.18733 10.6627 7.512 9.988C6.83733 9.31267 6.5 8.48333 6.5 7.5C6.5 6.51667 6.83733 5.68733 7.512 5.012C8.18733 4.33733 9.01667 4 10 4C10.9833 4 11.8127 4.33733 12.488 5.012C13.1627 5.68733 13.5 6.51667 13.5 7.5C13.5 8.48333 13.1627 9.31267 12.488 9.988C11.8127 10.6627 10.9833 11 10 11ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20ZM10 18C10.8833 18 11.7167 17.871 12.5 17.613C13.2833 17.3543 14 16.9833 14.65 16.5C14 16.0167 13.2833 15.6457 12.5 15.387C11.7167 15.129 10.8833 15 10 15C9.11667 15 8.28333 15.129 7.5 15.387C6.71667 15.6457 6 16.0167 5.35 16.5C6 16.9833 6.71667 17.3543 7.5 17.613C8.28333 17.871 9.11667 18 10 18ZM10 9C10.4333 9 10.7917 8.85833 11.075 8.575C11.3583 8.29167 11.5 7.93333 11.5 7.5C11.5 7.06667 11.3583 6.70833 11.075 6.425C10.7917 6.14167 10.4333 6 10 6C9.56667 6 9.20833 6.14167 8.925 6.425C8.64167 6.70833 8.5 7.06667 8.5 7.5C8.5 7.93333 8.64167 8.29167 8.925 8.575C9.20833 8.85833 9.56667 9 10 9Z" />
        </svg>
      </Link> 
    </MobileMenuStyled>
  )
}

export default MobileMenu