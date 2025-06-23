
'use client';
import dynamic from 'next/dynamic';
const LogoIntro = dynamic(() => import('../components/LogoIntro'), { ssr: false });
import Image from 'next/image';

export default function LandingPage() {
  const [showIntro, setShowIntro] = React.useState(true);
  React.useEffect(() => { setTimeout(() => setShowIntro(false), 3000); }, []);
  if (showIntro) return <LogoIntro />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f051d] to-[#230633] text-white">
      <div className="flex flex-col items-center justify-center text-center px-6 py-16">
        <Image
          src="/lunexis-logo.png"
          alt="Lunexis Logo"
          width={192}
          height={192}
          className="w-32 h-32 md:w-48 md:h-48 mb-6 animate-fade-in"
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
          Welcome to Lunexis
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
          A futuristic social experience where connection meets creativity. Share your moments, discover new people, and light up the digital cosmos.
        </p>
        <div className="mt-8 space-x-4">
          <a
            href="/feed"
            className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition"
          >
            Enter the Feed
          </a>
          <a
            href="/signup"
            className="px-6 py-2 border border-white rounded-full font-medium hover:bg-white hover:text-black transition"
          >
            Join Now
          </a>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-12">
        &copy; {new Date().getFullYear()} Lunexis. Made with 🌙.
      </div>
    </div>
  );
}
