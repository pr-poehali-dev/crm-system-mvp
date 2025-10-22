import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    if (!isLogin) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userCompany', company);
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Rocket" size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold text-foreground">CRM</span>
          </div>
          <p className="text-muted-foreground">
            Управляйте продажами эффективно
          </p>
        </div>

        <Card className="animate-scale-in shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isLogin ? 'Вход в систему' : 'Регистрация'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Введите ваши данные для входа' 
                : 'Создайте аккаунт для начала работы'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Иван Петров"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Компания</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="ООО 'Ваша компания'"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required={!isLogin}
                      className="h-11"
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-muted-foreground">Запомнить меня</span>
                  </label>
                  <a href="#" className="text-primary hover:underline">
                    Забыли пароль?
                  </a>
                </div>
              )}

              <Button type="submit" className="w-full h-11 gap-2" size="lg">
                {isLogin ? (
                  <>
                    <Icon name="LogIn" size={18} />
                    Войти
                  </>
                ) : (
                  <>
                    <Icon name="UserPlus" size={18} />
                    Зарегистрироваться
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">или</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="gap-2">
                  <Icon name="Mail" size={16} />
                  Google
                </Button>
                <Button type="button" variant="outline" className="gap-2">
                  <Icon name="Github" size={16} />
                  GitHub
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              </span>{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2024 CRM. Все права защищены.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a href="#" className="hover:text-foreground transition-colors">Условия использования</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">Конфиденциальность</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
