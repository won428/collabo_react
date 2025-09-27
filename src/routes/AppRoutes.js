import { Route, Routes } from "react-router-dom";
import FruitOne from './../pages/FruitOne';
import FruitList from './../pages/FruitList';
import Element from './../pages/Element';
import ElementList from './../pages/ElementList';
import HomePage from './../pages/HomePage';
import SignupPage from './../pages/SignupPage';
import LoginPage from './../pages/LoginPage';
import ProductList from './../pages/ProductList';
import ProductInsertForm from './../pages/ProductInsertForm';
import ProductUpdateForm from './../pages/ProductUpdateForm';
import ProductDetail from './../pages/ProductDetail';
import CartList from './../pages/CartList';

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
					<Route path="/product/list" element={<ProductList user={user}/>} /> {/* 로그인 여부에 따라서 상품 목록 페이지가 다르게 보여야 하믈, user프롭스를 넘겨 줍니다. */}
					<Route path="/product/insert" element={<ProductInsertForm/>} /> 
					{/* 기호 ":id"는 변수처럼 동작하는 매개변수이고, ProductUpdateForm.js 파일에서 참조합니다. */}
					<Route path="/product/update/:id" element={<ProductUpdateForm/>} /> 
					{/* 비로그인시 장바구니와 구매하기 기능은 선택이 불가능해야 하므로, user를 프롭스로 넘겨줍니다. */}
					<Route path="/product/detail/:id" element={<ProductDetail user={user}/>} /> 
					<Route path="/cart/list" element={<CartList user={user}/>} /> 
        </Routes>
    );    
}
export default App;