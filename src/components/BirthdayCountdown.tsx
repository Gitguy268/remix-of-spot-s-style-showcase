import { useState, useEffect } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Cake, PartyPopper, Gift, Heart } from "lucide-react";

const BirthdayCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Spot's birthday is February 26th
      let birthday = new Date(currentYear, 1, 26); // Month is 0-indexed
      
      // If birthday has passed this year, target next year
      if (now > birthday) {
        birthday = new Date(currentYear + 1, 1, 26);
      }
      
      // Check if today is the birthday
      const isToday = now.getMonth() === 1 && now.getDate() === 26;
      setIsBirthday(isToday);
      
      if (isToday) return;
      
      const difference = birthday.getTime() - now.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const getAnticipationMessage = () => {
    if (isBirthday) return "🎉 It's Spot's Birthday Today! 🎉";
    if (timeLeft.days === 0) return "🎁 Spot's birthday is tomorrow! Get ready to celebrate!";
    if (timeLeft.days <= 7) return "🎈 Less than a week until Spot's big day!";
    if (timeLeft.days <= 30) return "🎂 Spot's birthday is coming up soon!";
    if (timeLeft.days <= 60) return "🐕 Mark your calendar for Spot's special day!";
    return "✨ Counting down to Spot's birthday celebration!";
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-primary/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] border border-primary/30">
        <span className="text-2xl md:text-3xl font-bold text-primary tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{label}</span>
    </div>
  );

  if (isBirthday) {
    return (
      <LiquidGlassCard className="p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <PartyPopper className="w-8 h-8 text-primary animate-bounce" />
          <Cake className="w-10 h-10 text-primary" />
          <PartyPopper className="w-8 h-8 text-primary animate-bounce" />
        </div>
        <h3 className="text-2xl font-bold text-gradient mb-2">Happy Birthday, Spot!</h3>
        <p className="text-muted-foreground">February 26th — Celebrating our favorite black Lab! 🎉</p>
      </LiquidGlassCard>
    );
  }

  return (
    <LiquidGlassCard className="p-6">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Cake className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Spot's Birthday Countdown</h3>
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">{getAnticipationMessage()}</p>
      </div>
      
      <div className="flex items-center justify-center gap-3 md:gap-4">
        <TimeUnit value={timeLeft.days} label="Days" />
        <span className="text-2xl text-muted-foreground font-light">:</span>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <span className="text-2xl text-muted-foreground font-light">:</span>
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <span className="text-2xl text-muted-foreground font-light hidden sm:block">:</span>
        <div className="hidden sm:block">
          <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Heart className="w-3 h-3 text-primary" />
          February 26th
          <Heart className="w-3 h-3 text-primary" />
        </p>
      </div>
    </LiquidGlassCard>
  );
};

export default BirthdayCountdown;
