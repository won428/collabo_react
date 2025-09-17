import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Router } from 'react-router-dom'; // <BrowserRouter>, <Router> 태그 사용시 생성되는 신규 import

import 'bootstrap/dist/css/bootstrap.min.css'; // bootstrap import

const root = ReactDOM.createRoot(document.getElementById('root'));
// <React.StrictMode> </React.StrictMode> : 개발 도중에 발생하는 문제를 추가적으로 감자하기 위하여 rendering을 두번 수행하게 하는 개발자용 태그
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
