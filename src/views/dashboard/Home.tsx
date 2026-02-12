import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Brain, MessageSquare, Sparkles, Clock, Trophy, Check, Star, ArrowLeft } from 'lucide-react';

interface AuthUser {
  avatar: string;
  email: string;
  full_name: string;
  id: string;
  role: 'student' | 'teacher';
  username: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Kiểm tra auth_user trong localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsedUser: AuthUser = JSON.parse(storedUser);
        setAuthUser(parsedUser);
      } catch (error) {
        console.error('Error parsing auth_user:', error);
      }
    }
  }, []);

  const handleAuthClick = (): void => {
    if (authUser) {
      // Nếu đã đăng nhập, quay lại dashboard tương ứng
      const dashboardPath = authUser.role === 'student' 
        ? '/student/dashboard/classes' 
        : '/teacher/dashboard/classes';
      navigate(dashboardPath);
    } else {
      // Nếu chưa đăng nhập, chuyển đến trang login
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00994c] to-[#0077cc] flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#00994c] to-[#0077cc] bg-clip-text text-transparent">
              EduBot AI
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-[#00994c] transition-colors">
              Tính năng
            </a>
            <a href="#benefits" className="text-sm font-medium hover:text-[#00994c] transition-colors">
              Lợi ích
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-[#00994c] transition-colors">
              Giá cả
            </a>
            {authUser ? (
              <Button 
                onClick={handleAuthClick}
                className="bg-gradient-to-r from-[#00994c] to-[#006633] hover:from-[#006633] hover:to-[#00994c] text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại Dashboard
              </Button>
            ) : (
              <Button 
                onClick={handleAuthClick}
                variant="outline" 
                className="border-[#00994c] text-[#00994c] hover:bg-[#00994c] hover:text-white"
              >
                Đăng nhập
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-[#00994c] to-[#0077cc] text-white px-4 py-1.5 rounded-full text-sm font-medium">
                🚀 AI Thông Minh Cho Học Sinh
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Học Tập Thông Minh Hơn Với{' '}
              <span className="bg-gradient-to-r from-[#00994c] via-[#008c8c] to-[#0077cc] bg-clip-text text-transparent">
                Trợ Lý AI
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Chatbot AI thông minh giúp học sinh giải đáp thắc mắc, ôn tập bài học, 
              và nâng cao kết quả học tập 24/7. Học mọi lúc, mọi nơi!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleAuthClick}
                className="bg-gradient-to-r from-[#00994c] to-[#006633] hover:from-[#006633] hover:to-[#00994c] text-white"
              >
                {authUser ? 'Vào Dashboard' : 'Bắt Đầu Miễn Phí'}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-[#00994c] text-[#00994c] hover:bg-[#00994c] hover:text-white"
              >
                Xem Demo
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.9/5 đánh giá</span>
              </div>
              <div className="text-sm text-gray-600">
                Hơn <span className="font-bold text-[#00994c]">10,000+</span> học sinh tin dùng
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00994c] to-[#0077cc] rounded-3xl blur-3xl opacity-20"></div>
            <Card className="relative border-2 border-gray-200 shadow-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00994c] to-[#0077cc] flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">EduBot AI</p>
                    <p className="text-xs text-gray-500">Trợ lý học tập của bạn</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="bg-white rounded-lg p-3 ml-auto max-w-[80%]">
                    <p className="text-sm">Em cần giải thích định lý Pythagore 📐</p>
                  </div>
                  <div className="bg-gradient-to-r from-[#00994c] to-[#008c8c] text-white rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">Chào em! Định lý Pythagore nói rằng: Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông. Công thức: a² + b² = c² ✨</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 ml-auto max-w-[80%]">
                    <p className="text-sm">Cho em ví dụ cụ thể được không? 🤔</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Được trang bị công nghệ AI tiên tiến để hỗ trợ học sinh học tập hiệu quả
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain className="h-8 w-8" />,
              title: 'AI Thông Minh',
              description: 'Hiểu ngữ cảnh và trả lời chính xác các câu hỏi học thuật phức tạp'
            },
            {
              icon: <BookOpen className="h-8 w-8" />,
              title: 'Đa Môn Học',
              description: 'Hỗ trợ Toán, Văn, Anh, Lý, Hóa, Sinh và nhiều môn học khác'
            },
            {
              icon: <Clock className="h-8 w-8" />,
              title: '24/7 Hỗ Trợ',
              description: 'Luôn sẵn sàng giải đáp mọi thắc mắc bất cứ lúc nào'
            },
            {
              icon: <Sparkles className="h-8 w-8" />,
              title: 'Giải Thích Chi Tiết',
              description: 'Phân tích từng bước để học sinh hiểu sâu bài học'
            },
            {
              icon: <Trophy className="h-8 w-8" />,
              title: 'Theo Dõi Tiến Độ',
              description: 'Theo dõi kết quả học tập và đề xuất lộ trình cá nhân hóa'
            },
            {
              icon: <MessageSquare className="h-8 w-8" />,
              title: 'Giao Diện Thân Thiện',
              description: 'Chat tự nhiên như với gia sư thực thụ'
            }
          ].map((feature, index) => (
            <Card key={index} className="border-2 hover:border-[#00994c] transition-all hover:shadow-lg group">
              <CardContent className="p-6 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#00994c] to-[#0077cc] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="container mx-auto px-4 py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Tại Sao Chọn EduBot AI?
            </h2>
            <div className="space-y-4">
              {[
                'Tiết kiệm chi phí gia sư lên đến 80%',
                'Học tập linh hoạt theo tốc độ riêng',
                'Không giới hạn số lần hỏi đáp',
                'Cải thiện điểm số trung bình 25%',
                'Tăng tự tin trong học tập',
                'An toàn và bảo mật tuyệt đối'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#00994c] flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="text-center p-6 border-2 border-[#00994c]">
              <CardContent className="space-y-2 p-0">
                <p className="text-4xl font-bold text-[#00994c]">10,000+</p>
                <p className="text-gray-600">Học sinh</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-2 border-[#008c8c]">
              <CardContent className="space-y-2 p-0">
                <p className="text-4xl font-bold text-[#008c8c]">50,000+</p>
                <p className="text-gray-600">Câu hỏi/ngày</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-2 border-[#0077cc]">
              <CardContent className="space-y-2 p-0">
                <p className="text-4xl font-bold text-[#0077cc]">98%</p>
                <p className="text-gray-600">Hài lòng</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-2 border-[#006633]">
              <CardContent className="space-y-2 p-0">
                <p className="text-4xl font-bold text-[#006633]">24/7</p>
                <p className="text-gray-600">Hỗ trợ</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-[#00994c] via-[#008c8c] to-[#0077cc] border-0">
          <CardContent className="p-12 text-center space-y-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold">
              Sẵn Sàng Nâng Cao Kết Quả Học Tập?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Tham gia cùng hàng ngàn học sinh đang học tập thông minh hơn với EduBot AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={handleAuthClick}
                className="bg-white text-[#00994c] hover:bg-gray-100"
              >
                {authUser ? 'Vào Dashboard' : 'Dùng Thử Miễn Phí 7 Ngày'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                Tìm Hiểu Thêm
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00994c] to-[#0077cc] flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">EduBot AI</span>
              </div>
              <p className="text-sm text-gray-600">
                Trợ lý AI thông minh cho học sinh Việt Nam
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sản Phẩm</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#00994c]">Tính năng</a></li>
                <li><a href="#" className="hover:text-[#00994c]">Giá cả</a></li>
                <li><a href="#" className="hover:text-[#00994c]">Ứng dụng</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Hỗ Trợ</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#00994c]">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-[#00994c]">Liên hệ</a></li>
                <li><a href="#" className="hover:text-[#00994c]">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Công Ty</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#00994c]">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-[#00994c]">Blog</a></li>
                <li><a href="#" className="hover:text-[#00994c]">Chính sách</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 EduBot AI. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;