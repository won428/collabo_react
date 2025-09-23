import { Route, Routes } from "react-router-dom";
import FruitOne from './../pages/FruitOne';
import FruitList from './../pages/FruitList';
import Element from './../pages/Element';
import ElementList from './../pages/ElementList';
import HomePage from './../pages/HomePage';
import SignupPage from './../pages/SignupPage';
import LoginPage from './../pages/LoginPage';
import ProductList from './../pages/ProductList';
// 이 파일은 라우팅 정보를 담고 있는 파일입니다.
// 이러한 파일을 네트워크에서는 routing table이라고 합니다.
function App({user, handleLoginSuccess}){
	// user : 사용자 정보를 저장하고 있는 객체
	// handleLoginSuccess : 로그인 성공시 동작할 액션
    return(
        <Routes>
					{/* path 프롭스는 요청 정보 url, element 프롭스는 컴포넌트 이름 */}
					<Route path="/" element={<HomePage />} />
					<Route path="/fruit" element={<FruitOne />} />
					<Route path="/fruit/list" element={<FruitList />} />
					<Route path="/bread" element={<Element />} />
					<Route path="/bread/list" element={<ElementList />} />
					<Route path="/member/signup" element={<SignupPage />} />
					<Route path="/member/login" element={<LoginPage setUser={handleLoginSuccess} />} />
					<Route path="product/list" element={<ProductList user={user}/>} /> {/* 로그인 여부에 따라서 상품 목록 페이지가 다르게 보여야 하믈, user프롭스를 넘겨 줍니다. */}
        </Routes>
    );    
}
export default App;