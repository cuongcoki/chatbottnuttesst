// import ReactPlayer from "react-player";
// import {
//   MediaController,
//   MediaControlBar,
//   MediaTimeRange,
//   MediaTimeDisplay,
//   MediaVolumeRange,
//   MediaPlaybackRateButton,
//   MediaPlayButton,
//   MediaSeekBackwardButton,
//   MediaSeekForwardButton,
//   MediaMuteButton,
//   MediaFullscreenButton,
// } from "media-chrome/react";
import {
  BookOpen,
  FlaskConical,
  Calculator,
  Atom,
  Beaker,
  PenTool,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import bg_sb from "../../../../public/image/ai_sb/bg1.jpeg";

import bg_sb1 from "../../../../public/image/ai_sb/bg2.jpeg";

export default function Player() {
  return (
    <div className="player-wrapper">
      {/* Title Section */}
      <div className="player-header">
        <h2 className="player-title">Hệ Thống Gia Sư AI TNUT</h2>
        <p className="player-subtitle">
          Trợ thủ đắc lực cho học sinh và giáo viên
        </p>
      </div>

      {/* TV Container with Floating Icons */}
      <div className="tv-scene">
        {/* Floating Icons */}
        <div className="floating-icon icon-1">
          <BookOpen size={40} />
        </div>
        <div className="floating-icon icon-2">
          <Calculator size={36} />
        </div>
        <div className="floating-icon icon-3">
          <FlaskConical size={38} />
        </div>
        <div className="floating-icon icon-4">
          <Atom size={42} />
        </div>
        <div className="floating-icon icon-5">
          <Beaker size={36} />
        </div>
        <div className="floating-icon icon-6">
          <PenTool size={34} />
        </div>

        {/* Carousel Container */}
        <Carousel className="w-full max-w-3xl">
          <CarouselContent>
            <CarouselItem>
              <div className="relative w-full h-full  overflow-hidden rounded-lg">
                {/* Layer 1: Background - Dưới cùng */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={bg_sb}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CarouselItem>


             <CarouselItem>
              <div className="relative w-full h-full  overflow-hidden rounded-lg">
                {/* Layer 1: Background - Dưới cùng */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={bg_sb1}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CarouselItem>

           
            <CarouselItem>
              <div className="tv-frame">
                <div className="tv-bezel">
                  <div className="tv-screen">
                  
                  </div>
                </div>

                <div className="tv-stand">
                  <div className="flex flex-col items-center gap-1 mt-2">
                    
                 
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="carousel-previous" />
          <CarouselNext className="carousel-next" />
        </Carousel>
      </div>

      {/* Features Section */}
      <div className="player-features max-w-6xl mx-auto">
        <div className="feature-item">
          <div className="feature-icon">🎓</div>
          <div className="feature-text">
            <h4>Nền tảng hỗ trợ tự học và nghiên cứu chủ động</h4>
            <p>Đồng hành cùng sinh viên trong học tập mọi lúc, mọi nơi</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🗺️</div>
          <div className="feature-text">
            <h4>Xây dựng lộ trình học tập theo năng lực và chuyên ngành</h4>
            <p>Đáp ứng yêu cầu chương trình đào tạo bậc đại học</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">📊</div>
          <div className="feature-text">
            <h4>Theo dõi và phân tích hiệu quả học tập</h4>
            <p>
              Giúp giảng viên đánh giá quá trình học tập của sinh viên một cách
              toàn diện
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
