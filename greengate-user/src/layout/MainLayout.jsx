import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBubble from "../components/ChatBubble";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        
        <Outlet />
        <ChatBubble />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
