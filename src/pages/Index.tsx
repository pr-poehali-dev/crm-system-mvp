import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

type NavItem = 'dashboard' | 'deals' | 'contacts' | 'companies' | 'tasks' | 'documents' | 'reports' | 'settings';

interface Deal {
  id: number;
  title: string;
  company: string;
  amount: number;
  stage: string;
  contact: string;
  probability: number;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<NavItem>('dashboard');

  const navItems: { id: NavItem; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Главная', icon: 'LayoutDashboard' },
    { id: 'deals', label: 'Сделки', icon: 'TrendingUp' },
    { id: 'contacts', label: 'Контакты', icon: 'Users' },
    { id: 'companies', label: 'Компании', icon: 'Building2' },
    { id: 'tasks', label: 'Задачи', icon: 'CheckSquare' },
    { id: 'documents', label: 'Документы', icon: 'FileText' },
    { id: 'reports', label: 'Отчеты', icon: 'BarChart3' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  const deals: Deal[] = [
    { id: 1, title: 'Поставка оборудования', company: 'ООО "Техносфера"', amount: 1200000, stage: 'Переговоры', contact: 'Иван Петров', probability: 70 },
    { id: 2, title: 'Внедрение CRM', company: 'ИП Смирнов', amount: 450000, stage: 'Принятие решения', contact: 'Анна Смирнова', probability: 50 },
    { id: 3, title: 'Консультационные услуги', company: 'ООО "Альфа"', amount: 280000, stage: 'Заявка', contact: 'Олег Кузнецов', probability: 30 },
    { id: 4, title: 'Поставка ПО', company: 'ООО "БетаСофт"', amount: 890000, stage: 'Переговоры', contact: 'Мария Волкова', probability: 65 },
  ];

  const funnelStages = [
    { name: 'Заявка', count: 12, color: 'bg-blue-100 text-blue-700' },
    { name: 'Переговоры', count: 8, color: 'bg-purple-100 text-purple-700' },
    { name: 'Принятие решения', count: 5, color: 'bg-amber-100 text-amber-700' },
    { name: 'Успех', count: 3, color: 'bg-green-100 text-green-700' },
  ];

  const stats = [
    { label: 'Всего сделок', value: '28', change: '+12%', icon: 'TrendingUp', color: 'text-blue-600' },
    { label: 'Активных клиентов', value: '156', change: '+8%', icon: 'Users', color: 'text-purple-600' },
    { label: 'Конверсия', value: '24%', change: '+3%', icon: 'Target', color: 'text-green-600' },
    { label: 'Средний чек', value: '₽680K', change: '+15%', icon: 'DollarSign', color: 'text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Rocket" size={20} className="text-white" />
                </div>
                <span className="text-xl font-semibold text-foreground">CRM</span>
              </div>
              
              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? 'default' : 'ghost'}
                    onClick={() => setActiveSection(item.id)}
                    className="gap-2"
                    size="sm"
                  >
                    <Icon name={item.icon} size={16} />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Icon name="Plus" size={16} />
                <span className="hidden sm:inline">Создать</span>
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Bell" size={18} />
              </Button>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarFallback className="bg-primary text-white text-xs">АД</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-[1600px] mx-auto">
        {activeSection === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Главная</h1>
                <p className="text-muted-foreground mt-1">Обзор вашей воронки продаж</p>
              </div>
              <Button className="gap-2">
                <Icon name="Download" size={16} />
                Экспорт отчета
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-2 text-foreground">{stat.value}</p>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <Icon name="ArrowUp" size={12} />
                          {stat.change}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${stat.color}`}>
                        <Icon name={stat.icon} size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Filter" size={20} />
                    Воронка продаж
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {funnelStages.map((stage, index) => {
                      const conversion = index > 0 ? Math.round((stage.count / funnelStages[index - 1].count) * 100) : 100;
                      return (
                        <div key={stage.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className={stage.color}>{stage.name}</Badge>
                              <span className="text-sm text-muted-foreground">{stage.count} сделок</span>
                            </div>
                            {index > 0 && (
                              <span className="text-sm font-medium text-green-600">{conversion}%</span>
                            )}
                          </div>
                          <Progress value={(stage.count / funnelStages[0].count) * 100} className="h-3" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={20} />
                    Задачи на сегодня
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { task: 'Позвонить клиенту', time: '10:00', priority: 'high' },
                      { task: 'Отправить КП', time: '14:00', priority: 'medium' },
                      { task: 'Встреча с партнером', time: '16:30', priority: 'high' },
                      { task: 'Проверить договор', time: '18:00', priority: 'low' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          item.priority === 'high' ? 'bg-red-500' : 
                          item.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.task}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Icon name="Clock" size={12} />
                            {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Briefcase" size={20} />
                  Активные сделки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Сделка</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Компания</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Контакт</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Этап</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Сумма</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Вероятность</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deals.map((deal) => (
                        <tr key={deal.id} className="border-b border-border hover:bg-gray-50 transition-colors cursor-pointer">
                          <td className="py-3 px-4">
                            <div className="font-medium text-foreground">{deal.title}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                  {deal.company.substring(4, 5)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-foreground">{deal.company}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{deal.contact}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-xs">
                              {deal.stage}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-foreground">
                            ₽{deal.amount.toLocaleString('ru-RU')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <Progress value={deal.probability} className="w-16 h-1.5" />
                              <span className="text-xs text-muted-foreground w-8">{deal.probability}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection !== 'dashboard' && (
          <div className="flex items-center justify-center h-[60vh] animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Construction" size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Раздел в разработке</h2>
              <p className="text-muted-foreground">
                Раздел "{navItems.find(item => item.id === activeSection)?.label}" скоро будет доступен
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;