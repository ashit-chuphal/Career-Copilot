import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "History", path: "/history" },
    { name: "About", path: "/about" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}
      <div className="w-64 glass card-3d p-6 flex flex-col justify-between">

        <div>
          <h1 className="text-2xl font-bold mb-10">CareerCopilot</h1>

          <div className="space-y-4">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block p-3 rounded-xl ${
                  location.pathname === item.path
                    ? "bg-purple-600"
                    : "hover:bg-slate-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 p-3 rounded-xl mt-10"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        {/* TOP BAR */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              U
            </div>
            <span>
              {JSON.parse(atob(localStorage.getItem("token").split(".")[1]))?.firstName || "User"}
            </span>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Layout;