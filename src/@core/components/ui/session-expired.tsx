
export default function SessionExpired() {
  const handleReload = () => {
    localStorage.clear(); // hoặc dùng storage.remove(...)
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center max-w-sm">
        <h2 className="text-xl font-semibold mb-3">Phiên đăng nhập đã hết hạn</h2>
        <p className="text-gray-600 mb-5">
          Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.
        </p>
        <button onClick={handleReload}>Đăng nhập lại</button>
      </div>
    </div>
  );
}
