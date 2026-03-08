import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/';

  // Redirect if already logged in
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back');
        navigate(from, { replace: true });
      }
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Check your email to verify your account');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={mode === 'login' ? 'Sign In' : 'Create Account'} description="Access your saved properties and personalized recommendations." />
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container-wide max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2 text-center">
                {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-10">
                {mode === 'login'
                  ? 'Sign in to access your saved properties and preferences.'
                  : 'Join to save properties, track your shortlist, and get personalized recommendations.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-1.5 block">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="h-12 bg-secondary border-border/50"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-1.5 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="h-12 bg-secondary border-border/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-1.5 block">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="h-12 bg-secondary border-border/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wider mt-6"
                >
                  {isSubmitting
                    ? 'Please wait...'
                    : mode === 'login'
                    ? 'Sign In'
                    : 'Create Account'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {mode === 'login'
                    ? "Don't have an account? Create one"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
