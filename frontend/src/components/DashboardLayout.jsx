import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-bg flex text-brand-text">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        <main className="max-w-6xl mx-auto p-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
