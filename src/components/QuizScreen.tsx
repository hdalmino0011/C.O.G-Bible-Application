import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Award, Play, RotateCcw, CheckCircle2, XCircle, ArrowRight, HelpCircle, Trophy, Flame } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { QuizQuestion, QuizStats } from '../types';

interface QuizScreenProps {
  quizStats: QuizStats;
  onUpdateStats: (stats: QuizStats) => void;
  onNavigateToVerse?: (ref: string) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  quizStats,
  onUpdateStats,
  onNavigateToVerse
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'old' | 'new'>('all');
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Filter and shuffle questions
  const handleStartQuiz = () => {
    let pool = QUIZ_QUESTIONS;
    if (selectedCategory === 'old') {
      pool = QUIZ_QUESTIONS.filter(q => q.category === 'old');
    } else if (selectedCategory === 'new') {
      pool = QUIZ_QUESTIONS.filter(q => q.category === 'new');
    }

    // Shuffle questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setCurrentQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setSessionCorrectCount(0);
    setIsQuizFinished(false);
    setIsQuizActive(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerSubmitted) return;

    setSelectedOption(optionIndex);
    setIsAnswerSubmitted(true);

    const currentQ = currentQuestions[currentIndex];
    const isCorrect = optionIndex === currentQ.answer;

    let newStreak = isCorrect ? quizStats.streak + 1 : 0;
    let newBest = Math.max(quizStats.bestStreak, newStreak);

    if (isCorrect) {
      setSessionCorrectCount(prev => prev + 1);
    }

    onUpdateStats({
      total: quizStats.total + 1,
      correct: isCorrect ? quizStats.correct + 1 : quizStats.correct,
      streak: newStreak,
      bestStreak: newBest
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizFinished(true);
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setIsQuizActive(false);
    setIsQuizFinished(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  const accuracy = quizStats.total > 0
    ? Math.round((quizStats.correct / quizStats.total) * 100)
    : 0;

  const currentQ = currentQuestions[currentIndex];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full pb-28">
      {/* ================= 1. LOBBY VIEW (When Quiz is NOT active) ================= */}
      {!isQuizActive && !isQuizFinished && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Card */}
          <div className="bg-gradient-to-r from-[#10203D] via-[#1B3A6B] to-[#2C548F] rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A227]/20 border border-[#E4C765] flex items-center justify-center mb-3">
                <Trophy className="w-8 h-8 text-[#E4C765]" />
              </div>
              <h2 className="font-serif text-2xl font-bold">Bible Knowledge Challenge</h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-md">
                Test your knowledge of the Holy Scriptures, doctrines, characters, and prophecy of The Church of God.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-xl p-3.5 text-center shadow-xs">
              <span className="block font-serif text-2xl font-bold text-[#1B3A6B] dark:text-[#E4C765]">
                {quizStats.total}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                Answered
              </span>
            </div>

            <div className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-xl p-3.5 text-center shadow-xs">
              <span className="block font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {accuracy}%
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                Accuracy
              </span>
            </div>

            <div className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-xl p-3.5 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 font-serif text-2xl font-bold text-amber-600 dark:text-amber-400">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                {quizStats.streak}
              </div>
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                Streak
              </span>
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-2.5">
              Select Category:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                  selectedCategory === 'all'
                    ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-md ring-2 ring-[#C9A227]/50'
                    : 'bg-white dark:bg-[#182234] text-gray-700 dark:text-gray-200 border-[#E3DFD3] dark:border-[#2A3552] hover:border-[#C9A227]'
                }`}
              >
                All Books (66)
              </button>
              <button
                onClick={() => setSelectedCategory('old')}
                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                  selectedCategory === 'old'
                    ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-md ring-2 ring-[#C9A227]/50'
                    : 'bg-white dark:bg-[#182234] text-gray-700 dark:text-gray-200 border-[#E3DFD3] dark:border-[#2A3552] hover:border-[#C9A227]'
                }`}
              >
                Old Testament
              </button>
              <button
                onClick={() => setSelectedCategory('new')}
                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                  selectedCategory === 'new'
                    ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-md ring-2 ring-[#C9A227]/50'
                    : 'bg-white dark:bg-[#182234] text-gray-700 dark:text-gray-200 border-[#E3DFD3] dark:border-[#2A3552] hover:border-[#C9A227]'
                }`}
              >
                New Testament
              </button>
            </div>
          </div>

          {/* Primary START Button (ONLY SHOWN IN LOBBY) */}
          <div className="pt-2">
            <button
              id="start-quiz-btn"
              onClick={handleStartQuiz}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#1B3A6B] to-[#3E6FB0] hover:from-[#10203D] hover:to-[#1B3A6B] text-white font-serif font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] transition-all"
            >
              <Play className="w-5 h-5 fill-white" />
              Start Bible Quiz
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Questions will appear sequentially with instant biblical scripture citations.
            </p>
          </div>
        </motion.div>
      )}

      {/* ================= 2. ACTIVE QUIZ PLAY VIEW ================= */}
      {isQuizActive && !isQuizFinished && currentQ && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          {/* Top Progress & Cancel */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-2.5 py-1 rounded-full border border-[#C9A227]/20">
                {currentQ.categoryLabel || 'Question'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {currentIndex + 1} of {currentQuestions.length}
              </span>
            </div>

            <button
              onClick={handleRestart}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              Quit Quiz
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#1B3A6B] to-[#C9A227] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-2xl p-5 sm:p-6 shadow-md">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#10203D] dark:text-white leading-snug mb-5">
              {currentQ.q}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === currentQ.answer;

                let optionStyle =
                  'bg-[#F7F5EF] dark:bg-slate-800 border-[#E3DFD3] dark:border-slate-700 text-gray-800 dark:text-gray-100 hover:border-[#C9A227]';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold ring-2 ring-emerald-400/40';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200 font-semibold ring-2 ring-rose-400/40';
                  } else {
                    optionStyle = 'opacity-50 border-gray-200 dark:border-slate-800 text-gray-400';
                  }
                }

                return (
                  <button
                    key={index}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(index)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all text-xs sm:text-sm flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && (
                      <div>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation & Scripture Reference */}
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 rounded-xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs space-y-1.5"
              >
                <div className="font-bold text-[#1B3A6B] dark:text-[#E4C765] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  Scriptural Context &amp; Explanation:
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
                {currentQ.reference && (
                  <p className="text-xs font-semibold text-[#1B3A6B] dark:text-[#E4C765] pt-1">
                    Biblical Reference: {currentQ.reference}
                  </p>
                )}
              </motion.div>
            )}

            {/* Next / Finish Button */}
            {isAnswerSubmitted && (
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="py-2.5 px-6 rounded-xl bg-[#1B3A6B] hover:bg-[#10203D] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
                >
                  {currentIndex + 1 < currentQuestions.length ? 'Next Question' : 'View Results'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ================= 3. QUIZ RESULTS SCREEN ================= */}
      {isQuizFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-2xl p-6 sm:p-8 text-center shadow-lg space-y-5"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-[#C9A227]/20 border-2 border-[#C9A227] flex items-center justify-center">
            <Award className="w-10 h-10 text-[#C9A227]" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-[#10203D] dark:text-white">
              Quiz Completed!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Here is your score for this session
            </p>
          </div>

          <div className="p-4 bg-[#F7F5EF] dark:bg-slate-800 rounded-xl border border-[#E3DFD3] dark:border-slate-700 max-w-sm mx-auto">
            <div className="font-serif text-4xl font-extrabold text-[#1B3A6B] dark:text-[#E4C765]">
              {sessionCorrectCount} / {currentQuestions.length}
            </div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              {Math.round((sessionCorrectCount / (currentQuestions.length || 1)) * 100)}% Correct
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartQuiz}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#1B3A6B] hover:bg-[#10203D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm transition-all"
            >
              Choose Another Category
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
