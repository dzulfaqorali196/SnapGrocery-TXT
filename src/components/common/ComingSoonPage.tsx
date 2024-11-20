import { Timer, CalendarClock } from 'lucide-react';

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <Timer className="h-32 w-32 text-indigo-200" />
          </div>
          <CalendarClock className="relative h-32 w-32 text-indigo-600" />
        </div>
        
        <h1 className="mt-8 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          {title}
        </h1>
        
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          This feature is under development. We are working hard to provide you with a better shopping experience.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center space-x-2 text-indigo-600">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-200" />
          </div>
        </div>
        
        <div className="mt-12">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
} 