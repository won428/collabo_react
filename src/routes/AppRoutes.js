import { Route, Routes } from "react-router-dom";
import FruitOne from './../pages/FruitOne';
import FruitList from './../pages/FruitList';
import Element from './../pages/Element';
import ElementList from './../pages/ElementList';
// 이 파일은 라우팅 정보를 담고 있는 파일입니다.
// 이러한 파일을 네트워크에서는 routing table이라고 합니다.
function App(){
    return(
        <Routes>
					{/* path 프롭스는 요청 정보 url, element 프롭스는 컴포넌트 이름 */}
					<Route path="/fruit" element={<FruitOne />} />
					<Route path="/fruit/list" element={<FruitList />} />
					<Route path="/bread" element={<Element />} />
					<Route path="/bread/list" element={<ElementList />} />
        </Routes>
    );    
}

export default App;