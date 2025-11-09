import { FaVideoSlash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

interface NotFoundProps {
  onClose: () => void;
}

export default function Noembed({ onClose }: NotFoundProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="backdrop-blur-md bg-white/10 border border-red-500/20 rounded-xl p-8 max-w-md w-full mx-4 relative animate-fade-in shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-red-400 transition-colors"
        >
          <IoMdClose size={24} />
        </button>
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-tr from-red-500 via-red-400 to-rose-500 p-6 rounded-full shadow-xl mb-6 animate-fade-in">
            <FaVideoSlash className="text-white text-4xl drop-shadow-lg animate-pulse" />
          </div>
          
          <div className="text-3xl font-extrabold text-white mb-2 animate-fade-in-up text-center">
            <span className="bg-gradient-to-r from-red-400 via-rose-500 to-red-500 bg-clip-text text-transparent">
              Video Not Found
            </span>
          </div>
          
          <div className="text-base text-gray-200 mb-4 animate-fade-in-up delay-100 text-center">
            Sorry, we couldn't find the video you were looking for.
          </div>
          <Ellipsis />
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
}

function Ellipsis() {
  return (
    <span className="inline-block ml-2">
      <span className="inline-block w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:0s] mx-0.5"></span>
      <span className="inline-block w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:0.2s] mx-0.5"></span>
      <span className="inline-block w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:0.4s] mx-0.5"></span>
    </span>
  );
}
