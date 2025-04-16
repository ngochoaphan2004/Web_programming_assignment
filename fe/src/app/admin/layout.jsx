// "use client";
// import Header from "../components/navbar/header";
// import "../globals.css";
// import "../assets/app.css"
// import "../assets/iconly.css"
// import "../assets/auth.css"

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         <div id="main" className="layout-horizontal">
//           <Header authen={authen} user={user} admin = {admin} />
//           <div className="page-content container">
//             {children}
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }
"use client";

import "../globals.css";
import "../assets/app.css";
import "../assets/app-dark.css";
import "../assets/iconly.css";
import {useState} from "react";
import Header from "../components/navbar/header";
import Footter from "../components/footter/footer";
import { AuthProvider, useAuth } from "../contexts/auth"; // Đường dẫn đúng với bạn nhé

function LayoutWithAuth({ children }) {
  const { authen, loading, user ,admin} = useAuth();

  if (loading) {
    return <div>Loading...</div>; // hoặc spinner đẹp hơn nếu có
  }
  return (
    <div id="main" className="layout-horizontal">
      <Header authen={authen} user={user} admin = {admin} />
      <div className="page-content container bg-white rounded-md">
        {children}
      </div>
      <Footter />
    </div>
  );
}
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <LayoutWithAuth>{children}</LayoutWithAuth>
        </AuthProvider>
      </body>
    </html>
  );
}
