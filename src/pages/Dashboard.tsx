import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

type NavItem = 'dashboard' | 'deals' | 'contacts' | 'companies' | 'tasks' | 'documents' | 'reports' | 'settings';

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

interface Deal {
  id: number;
  title: string;
  company: string;
  amount: number;
  stage: string;
  contact: string;
  probability: number;
  createdAt: string;
  comments: Comment[];
  description?: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  tags: string[];
}

interface Company {
  id: number;
  name: string;
  inn: string;
  address: string;
  contacts: number;
  deals: number;
  revenue: number;
}

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  status: 'todo' | 'in_progress' | 'done';
  relatedTo?: string;
}

interface Document {
  id: number;
  type: 'proposal' | 'invoice';
  number: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  date: string;
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<NavItem>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealDialogOpen, setDealDialogOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [documentType, setDocumentType] = useState<'proposal' | 'invoice'>('proposal');
  const [dealsView, setDealsView] = useState<'list' | 'kanban'>('kanban');

  const userName = localStorage.getItem('userName') || 'Админ';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const navItems: { id: NavItem; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'deals', label: 'Сделки', icon: 'TrendingUp' },
    { id: 'contacts', label: 'Контакты', icon: 'Users' },
    { id: 'companies', label: 'Компании', icon: 'Building2' },
    { id: 'tasks', label: 'Задачи', icon: 'CheckSquare' },
    { id: 'documents', label: 'Документы', icon: 'FileText' },
    { id: 'reports', label: 'Отчеты', icon: 'BarChart3' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  const [deals, setDeals] = useState<Deal[]>([
    { 
      id: 1, 
      title: 'Поставка оборудования', 
      company: 'ООО "Техносфера"', 
      amount: 1200000, 
      stage: 'Переговоры', 
      contact: 'Иван Петров', 
      probability: 70, 
      createdAt: '2024-10-15',
      description: 'Поставка промышленного оборудования для автоматизации производства',
      comments: [
        { id: 1, author: 'Вы', text: 'Договорились о встрече на следующей неделе', date: '2024-10-20 14:30' },
        { id: 2, author: 'Иван Петров', text: 'Отправил ТЗ на оборудование', date: '2024-10-21 10:15' },
      ]
    },
    { 
      id: 2, 
      title: 'Внедрение CRM', 
      company: 'ИП Смирнов', 
      amount: 450000, 
      stage: 'Принятие решения', 
      contact: 'Анна Смирнова', 
      probability: 50, 
      createdAt: '2024-10-18',
      description: 'Внедрение CRM-системы для управления клиентами',
      comments: [
        { id: 3, author: 'Вы', text: 'Провели демо системы', date: '2024-10-19 16:00' },
      ]
    },
    { 
      id: 3, 
      title: 'Консультационные услуги', 
      company: 'ООО "Альфа"', 
      amount: 280000, 
      stage: 'Заявка', 
      contact: 'Олег Кузнецов', 
      probability: 30, 
      createdAt: '2024-10-20',
      description: 'Консультации по оптимизации бизнес-процессов',
      comments: []
    },
    { 
      id: 4, 
      title: 'Поставка ПО', 
      company: 'ООО "БетаСофт"', 
      amount: 890000, 
      stage: 'Переговоры', 
      contact: 'Мария Волкова', 
      probability: 65, 
      createdAt: '2024-10-19',
      description: 'Поставка лицензий на корпоративное ПО',
      comments: [
        { id: 4, author: 'Мария Волкова', text: 'Нужно коммерческое предложение', date: '2024-10-21 11:20' },
      ]
    },
    { 
      id: 5, 
      title: 'Запрос на расчет стоимости', 
      company: 'ООО "Дельта Групп"', 
      amount: 350000, 
      stage: 'Заявка', 
      contact: 'Сергей Иванов', 
      probability: 25, 
      createdAt: '2024-10-21',
      description: 'Первичный запрос на расчет стоимости услуг',
      comments: []
    },
    { 
      id: 6, 
      title: 'Договор поставки оборудования', 
      company: 'ООО "Гамма"', 
      amount: 2100000, 
      stage: 'Успех', 
      contact: 'Елена Петрова', 
      probability: 100, 
      createdAt: '2024-09-15',
      description: 'Успешно завершенная сделка по поставке оборудования',
      comments: [
        { id: 5, author: 'Вы', text: 'Договор подписан, оплата получена', date: '2024-10-10 12:00' },
      ]
    },
    { 
      id: 7, 
      title: 'IT-консалтинг', 
      company: 'ООО "Эпсилон"', 
      amount: 650000, 
      stage: 'Успех', 
      contact: 'Дмитрий Соколов', 
      probability: 100, 
      createdAt: '2024-09-20',
      description: 'Завершенный проект по IT-консалтингу',
      comments: [
        { id: 6, author: 'Вы', text: 'Проект завершен успешно', date: '2024-10-15 09:30' },
      ]
    },
  ]);

  const contacts: Contact[] = [
    { id: 1, name: 'Иван Петров', email: 'ivan@techno.ru', phone: '+7 (495) 123-45-67', company: 'ООО "Техносфера"', position: 'Директор', tags: ['VIP', 'Партнер'] },
    { id: 2, name: 'Анна Смирнова', email: 'anna@smirnov.ru', phone: '+7 (495) 234-56-78', company: 'ИП Смирнов', position: 'Владелец', tags: ['Клиент'] },
    { id: 3, name: 'Олег Кузнецов', email: 'oleg@alpha.ru', phone: '+7 (495) 345-67-89', company: 'ООО "Альфа"', position: 'Менеджер', tags: ['Лид'] },
    { id: 4, name: 'Мария Волкова', email: 'maria@betasoft.ru', phone: '+7 (495) 456-78-90', company: 'ООО "БетаСофт"', position: 'Закупки', tags: ['VIP'] },
  ];

  const companies: Company[] = [
    { id: 1, name: 'ООО "Техносфера"', inn: '7701234567', address: 'Москва, ул. Ленина, 1', contacts: 3, deals: 5, revenue: 3500000 },
    { id: 2, name: 'ИП Смирнов', inn: '7702345678', address: 'Москва, пр-т Мира, 10', contacts: 1, deals: 2, revenue: 890000 },
    { id: 3, name: 'ООО "Альфа"', inn: '7703456789', address: 'СПб, Невский пр-т, 25', contacts: 2, deals: 3, revenue: 1200000 },
    { id: 4, name: 'ООО "БетаСофт"', inn: '7704567890', address: 'Москва, ул. Тверская, 5', contacts: 4, deals: 7, revenue: 5600000 },
  ];

  const tasks: Task[] = [
    { id: 1, title: 'Позвонить клиенту ООО "Техносфера"', dueDate: '2024-10-22 10:00', priority: 'high', assignee: 'Вы', status: 'todo', relatedTo: 'Поставка оборудования' },
    { id: 2, title: 'Отправить КП по CRM-системе', dueDate: '2024-10-22 14:00', priority: 'medium', assignee: 'Вы', status: 'in_progress', relatedTo: 'Внедрение CRM' },
    { id: 3, title: 'Встреча с партнером', dueDate: '2024-10-22 16:30', priority: 'high', assignee: 'Иван И.', status: 'todo' },
    { id: 4, title: 'Проверить договор поставки', dueDate: '2024-10-23 18:00', priority: 'low', assignee: 'Мария С.', status: 'todo' },
    { id: 5, title: 'Подготовить презентацию', dueDate: '2024-10-24 12:00', priority: 'medium', assignee: 'Вы', status: 'done' },
  ];

  const documents: Document[] = [
    { id: 1, type: 'proposal', number: 'КП-001', client: 'ООО "Техносфера"', amount: 1200000, status: 'sent', date: '2024-10-15' },
    { id: 2, type: 'invoice', number: 'СЧ-042', client: 'ИП Смирнов', amount: 450000, status: 'paid', date: '2024-10-10' },
    { id: 3, type: 'proposal', number: 'КП-002', client: 'ООО "Альфа"', amount: 280000, status: 'draft', date: '2024-10-20' },
    { id: 4, type: 'invoice', number: 'СЧ-043', client: 'ООО "БетаСофт"', amount: 890000, status: 'overdue', date: '2024-09-30' },
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeDealId = Number(active.id);
    const activeDeal = deals.find(d => d.id === activeDealId);
    
    if (!activeDeal) return;

    const overDealId = Number(over.id);
    const overDeal = deals.find(d => d.id === overDealId);

    if (overDeal && activeDeal.stage === overDeal.stage && activeDealId !== overDealId) {
      const stageDeals = deals.filter(d => d.stage === activeDeal.stage);
      const oldIndex = stageDeals.findIndex(d => d.id === activeDealId);
      const newIndex = stageDeals.findIndex(d => d.id === overDealId);

      const reorderedStageDeals = arrayMove(stageDeals, oldIndex, newIndex);
      const otherDeals = deals.filter(d => d.stage !== activeDeal.stage);
      setDeals([...otherDeals, ...reorderedStageDeals]);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeDealId = Number(active.id);
    const overDealId = Number(over.id);
    
    const activeDeal = deals.find(d => d.id === activeDealId);
    const overDeal = deals.find(d => d.id === overDealId);

    if (!activeDeal || !overDeal) return;
    if (activeDeal.stage === overDeal.stage) return;

    setDeals(deals.map(deal => 
      deal.id === activeDealId ? { ...deal, stage: overDeal.stage } : deal
    ));
  };

  const handleDealStageChange = (dealId: number, newStage: string) => {
    setDeals(deals.map(deal => 
      deal.id === dealId ? { ...deal, stage: newStage } : deal
    ));
  };

  const handleOpenDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setDealDialogOpen(true);
  };

  const handleAddComment = () => {
    if (!selectedDeal || !newComment.trim()) return;

    const updatedDeal = {
      ...selectedDeal,
      comments: [
        ...selectedDeal.comments,
        {
          id: Date.now(),
          author: userName,
          text: newComment,
          date: new Date().toLocaleString('ru-RU'),
        },
      ],
    };

    setDeals(deals.map(d => d.id === selectedDeal.id ? updatedDeal : d));
    setSelectedDeal(updatedDeal);
    setNewComment('');
  };

  const handleCreateDocument = () => {
    if (!selectedDeal) return;
    
    const newDoc = {
      id: documents.length + 1,
      type: documentType,
      number: documentType === 'proposal' ? `КП-${String(documents.length + 1).padStart(3, '0')}` : `СЧ-${String(documents.length + 1).padStart(3, '0')}`,
      client: selectedDeal.company,
      amount: selectedDeal.amount,
      status: 'draft' as const,
      date: new Date().toISOString().split('T')[0],
    };
    
    setDocumentDialogOpen(false);
    setActiveSection('documents');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      todo: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      done: 'bg-green-100 text-green-700',
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Черновик',
      sent: 'Отправлен',
      paid: 'Оплачен',
      overdue: 'Просрочен',
      todo: 'К выполнению',
      in_progress: 'В работе',
      done: 'Выполнено',
    };
    return labels[status] || status;
  };

  const dealsByStage = (stage: string) => deals.filter(d => d.stage === stage);

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" className="gap-2">
                    <Icon name="Plus" size={16} />
                    <span className="hidden sm:inline">Создать</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Создать новую запись</DialogTitle>
                    <DialogDescription>Выберите тип записи</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setActiveSection('deals')}>
                      <Icon name="TrendingUp" size={24} />
                      <span>Сделка</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setActiveSection('contacts')}>
                      <Icon name="Users" size={24} />
                      <span>Контакт</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setActiveSection('companies')}>
                      <Icon name="Building2" size={24} />
                      <span>Компания</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setActiveSection('tasks')}>
                      <Icon name="CheckSquare" size={24} />
                      <span>Задача</span>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="ghost" size="sm">
                <Icon name="Bell" size={18} />
              </Button>
              
              <div className="relative group">
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarFallback className="bg-primary text-white text-xs">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-border">
                    <p className="font-medium text-sm">{userName}</p>
                    <p className="text-xs text-muted-foreground">Администратор</p>
                  </div>
                  <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={() => setActiveSection('settings')}>
                      <Icon name="Settings" size={16} />
                      Настройки
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                      <Icon name="LogOut" size={16} />
                      Выход
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-[1600px] mx-auto">
        {activeSection === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Filter" size={20} />
                  Воронка продаж (Drag & Drop)
                </CardTitle>
                <CardDescription>Перетащите карточки сделок между этапами</CardDescription>
              </CardHeader>
              <CardContent>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {funnelStages.map((stage) => (
                      <div key={stage.name} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge className={stage.color}>{stage.name}</Badge>
                          <span className="text-sm text-muted-foreground">{dealsByStage(stage.name).length}</span>
                        </div>
                        
                        <SortableContext
                          items={dealsByStage(stage.name).map(d => d.id.toString())}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2 min-h-[200px] bg-gray-50 rounded-lg p-3">
                            {dealsByStage(stage.name).map((deal) => (
                              <SortableItem key={deal.id} id={deal.id.toString()}>
                                <Card 
                                  className="cursor-move hover:shadow-md transition-all border-l-4 border-l-primary"
                                >
                                  <CardContent className="p-4" onClick={() => handleOpenDeal(deal)}>
                                    <h4 className="font-semibold text-sm text-foreground mb-2">{deal.title}</h4>
                                    <p className="text-xs text-muted-foreground mb-2">{deal.company}</p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-bold text-foreground">
                                        ₽{(deal.amount / 1000).toFixed(0)}K
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <Progress value={deal.probability} className="w-12 h-1" />
                                        <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </SortableItem>
                            ))}
                          </div>
                        </SortableContext>
                      </div>
                    ))}
                  </div>
                </DndContext>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Briefcase" size={20} />
                    Последние сделки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deals.slice(0, 4).map((deal) => (
                      <div 
                        key={deal.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleOpenDeal(deal)}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{deal.title}</h4>
                          <p className="text-sm text-muted-foreground">{deal.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">₽{deal.amount.toLocaleString('ru-RU')}</p>
                          <Badge variant="outline" className="text-xs">{deal.stage}</Badge>
                        </div>
                      </div>
                    ))}
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
                    {tasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          task.priority === 'high' ? 'bg-red-500' : 
                          task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Icon name="Clock" size={12} />
                            {task.dueDate.split(' ')[1]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'deals' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Сделки</h1>
                <p className="text-muted-foreground mt-1">Управление всеми сделками</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <Button 
                    variant={dealsView === 'kanban' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setDealsView('kanban')}
                    className="gap-2"
                  >
                    <Icon name="Kanban" size={16} />
                    Воронка
                  </Button>
                  <Button 
                    variant={dealsView === 'list' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setDealsView('list')}
                    className="gap-2"
                  >
                    <Icon name="List" size={16} />
                    Список
                  </Button>
                </div>
                <Input
                  placeholder="Поиск сделок..."
                  className="w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="gap-2">
                  <Icon name="Plus" size={16} />
                  Новая сделка
                </Button>
              </div>
            </div>

            {dealsView === 'kanban' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Kanban" size={20} />
                    Воронка продаж
                  </CardTitle>
                  <CardDescription>Перетаскивайте сделки между этапами для изменения статуса</CardDescription>
                </CardHeader>
                <CardContent>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {funnelStages.map((stage) => (
                        <div key={stage.name} className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <Badge className={stage.color}>{stage.name}</Badge>
                            <span className="text-sm font-semibold text-muted-foreground">{dealsByStage(stage.name).length}</span>
                          </div>
                          
                          <SortableContext
                            items={dealsByStage(stage.name).map(d => d.id.toString())}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-3 min-h-[400px] bg-gray-50/50 rounded-lg p-3">
                              {dealsByStage(stage.name).map((deal) => (
                                <SortableItem key={deal.id} id={deal.id.toString()}>
                                  <Card 
                                    className="cursor-move hover:shadow-lg transition-all border-l-4 border-l-primary bg-white"
                                  >
                                    <CardContent className="p-4">
                                      <div onClick={() => handleOpenDeal(deal)}>
                                        <h4 className="font-semibold text-base text-foreground mb-2">{deal.title}</h4>
                                        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                                          <Icon name="Building2" size={14} />
                                          {deal.company}
                                        </p>
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">Сумма:</span>
                                            <span className="text-base font-bold text-foreground">
                                              ₽{(deal.amount / 1000).toFixed(0)}K
                                            </span>
                                          </div>
                                          <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs text-muted-foreground">Вероятность:</span>
                                              <span className="text-xs font-medium text-foreground">{deal.probability}%</span>
                                            </div>
                                            <Progress value={deal.probability} className="h-1.5" />
                                          </div>
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                                            <Icon name="User" size={12} />
                                            <span>{deal.contact}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </SortableItem>
                              ))}
                              {dealsByStage(stage.name).length === 0 && (
                                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                                  Перетащите сюда сделки
                                </div>
                              )}
                            </div>
                          </SortableContext>
                        </div>
                      ))}
                    </div>
                  </DndContext>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">Все сделки</TabsTrigger>
                  <TabsTrigger value="Заявка">Заявка</TabsTrigger>
                  <TabsTrigger value="Переговоры">Переговоры</TabsTrigger>
                  <TabsTrigger value="Принятие решения">Принятие решения</TabsTrigger>
                  <TabsTrigger value="Успех">Успех</TabsTrigger>
                </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {deals.map((deal) => (
                  <Card key={deal.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 cursor-pointer" onClick={() => handleOpenDeal(deal)}>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{deal.title}</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Icon name="Building2" size={16} />
                              <span>{deal.company}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Icon name="User" size={16} />
                              <span>{deal.contact}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Icon name="Calendar" size={16} />
                              <span>{deal.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-3">
                          <div>
                            <div className="text-2xl font-bold text-foreground">
                              ₽{deal.amount.toLocaleString('ru-RU')}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Progress value={deal.probability} className="w-24 h-2" />
                              <span className="text-sm text-muted-foreground">{deal.probability}%</span>
                            </div>
                          </div>
                          <Select 
                            value={deal.stage}
                            onValueChange={(value) => handleDealStageChange(deal.id, value)}
                          >
                            <SelectTrigger className="w-48" onClick={(e) => e.stopPropagation()}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {funnelStages.map((stage) => (
                                <SelectItem key={stage.name} value={stage.name}>{stage.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              {funnelStages.map((stage) => (
                <TabsContent key={stage.name} value={stage.name} className="space-y-4">
                  {dealsByStage(stage.name).map((deal) => (
                    <Card key={deal.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 cursor-pointer" onClick={() => handleOpenDeal(deal)}>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">{deal.title}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon name="Building2" size={16} />
                                <span>{deal.company}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon name="User" size={16} />
                                <span>{deal.contact}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon name="Calendar" size={16} />
                                <span>{deal.createdAt}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-3">
                            <div>
                              <div className="text-2xl font-bold text-foreground">
                                ₽{deal.amount.toLocaleString('ru-RU')}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Progress value={deal.probability} className="w-24 h-2" />
                                <span className="text-sm text-muted-foreground">{deal.probability}%</span>
                              </div>
                            </div>
                            <Select 
                              value={deal.stage}
                              onValueChange={(value) => handleDealStageChange(deal.id, value)}
                            >
                              <SelectTrigger className="w-48" onClick={(e) => e.stopPropagation()}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {funnelStages.map((s) => (
                                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}
              </Tabs>
            )}
          </div>
        )}

        {activeSection === 'contacts' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Контакты</h1>
                <p className="text-muted-foreground mt-1">База контактов клиентов</p>
              </div>
              <div className="flex items-center gap-3">
                <Input placeholder="Поиск контактов..." className="w-64" />
                <Button className="gap-2">
                  <Icon name="Plus" size={16} />
                  Новый контакт
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-white">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.position}</p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon name="Mail" size={14} />
                            <span className="truncate">{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon name="Phone" size={14} />
                            <span>{contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon name="Building2" size={14} />
                            <span className="truncate">{contact.company}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {contact.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'companies' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Компании</h1>
                <p className="text-muted-foreground mt-1">База компаний клиентов</p>
              </div>
              <div className="flex items-center gap-3">
                <Input placeholder="Поиск компаний..." className="w-64" />
                <Button className="gap-2">
                  <Icon name="Plus" size={16} />
                  Новая компания
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {companies.map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon name="Building2" size={24} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{company.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Icon name="Hash" size={14} />
                              <span>ИНН: {company.inn}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Icon name="MapPin" size={14} />
                              <span>{company.address}</span>
                            </div>
                          </div>
                          <div className="flex gap-6 mt-4">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Контакты: </span>
                              <span className="font-medium text-foreground">{company.contacts}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Сделки: </span>
                              <span className="font-medium text-foreground">{company.deals}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Выручка</div>
                        <div className="text-2xl font-bold text-foreground mt-1">
                          ₽{(company.revenue / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'tasks' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Задачи</h1>
                <p className="text-muted-foreground mt-1">Управление задачами и напоминаниями</p>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Фильтр" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все задачи</SelectItem>
                    <SelectItem value="my">Мои задачи</SelectItem>
                    <SelectItem value="today">Сегодня</SelectItem>
                    <SelectItem value="overdue">Просрочено</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="gap-2">
                  <Icon name="Plus" size={16} />
                  Новая задача
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    К выполнению
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.filter(t => t.status === 'todo').map((task) => (
                    <div key={task.id} className="p-4 bg-gray-50 rounded-lg border border-border hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-foreground flex-1">{task.title}</h4>
                        <Badge className={`text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="Clock" size={12} />
                          <span>{task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="User" size={12} />
                          <span>{task.assignee}</span>
                        </div>
                        {task.relatedTo && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon name="Link" size={12} />
                            <span>{task.relatedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    В работе
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.filter(t => t.status === 'in_progress').map((task) => (
                    <div key={task.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-foreground flex-1">{task.title}</h4>
                        <Badge className={`text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="Clock" size={12} />
                          <span>{task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="User" size={12} />
                          <span>{task.assignee}</span>
                        </div>
                        {task.relatedTo && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon name="Link" size={12} />
                            <span>{task.relatedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    Выполнено
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.filter(t => t.status === 'done').map((task) => (
                    <div key={task.id} className="p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-sm transition-shadow cursor-pointer opacity-75">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-foreground flex-1 line-through">{task.title}</h4>
                        <Icon name="CheckCircle2" size={16} className="text-green-600" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="Clock" size={12} />
                          <span>{task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="User" size={12} />
                          <span>{task.assignee}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'documents' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Документы</h1>
                <p className="text-muted-foreground mt-1">КП и счета</p>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="proposal">КП</SelectItem>
                    <SelectItem value="invoice">Счета</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="gap-2">
                  <Icon name="Plus" size={16} />
                  Создать документ
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Номер</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Тип</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Клиент</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Сумма</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Дата</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Статус</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-medium text-foreground">{doc.number}</span>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="text-xs">
                              {doc.type === 'proposal' ? 'КП' : 'Счет'}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm text-foreground">{doc.client}</td>
                          <td className="py-4 px-4 text-right font-medium text-foreground">
                            ₽{doc.amount.toLocaleString('ru-RU')}
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{doc.date}</td>
                          <td className="py-4 px-4">
                            <Badge className={`text-xs ${getStatusBadge(doc.status)}`}>
                              {getStatusLabel(doc.status)}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Icon name="Eye" size={16} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Icon name="Download" size={16} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Icon name="Send" size={16} />
                              </Button>
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

        {activeSection === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Отчеты и аналитика</h1>
                <p className="text-muted-foreground mt-1">Анализ эффективности продаж</p>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="month">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Период" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Неделя</SelectItem>
                    <SelectItem value="month">Месяц</SelectItem>
                    <SelectItem value="quarter">Квартал</SelectItem>
                    <SelectItem value="year">Год</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Icon name="Download" size={16} />
                  Экспорт
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Динамика продаж</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">График динамики продаж</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Распределение по этапам</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Icon name="PieChart" size={48} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Круговая диаграмма</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Топ менеджеров</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Иван Иванов', deals: 15, revenue: 4500000 },
                    { name: 'Мария Смирнова', deals: 12, revenue: 3800000 },
                    { name: 'Петр Петров', deals: 10, revenue: 2900000 },
                  ].map((manager, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{manager.name}</p>
                          <p className="text-sm text-muted-foreground">{manager.deals} сделок</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          ₽{(manager.revenue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Настройки</h1>
              <p className="text-muted-foreground mt-1">Настройка системы и параметров</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Профиль</TabsTrigger>
                <TabsTrigger value="company">Компания</TabsTrigger>
                <TabsTrigger value="funnel">Воронка</TabsTrigger>
                <TabsTrigger value="integrations">Интеграции</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Личные данные</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input id="name" defaultValue={userName} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="admin@crm.ru" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input id="phone" defaultValue="+7 (495) 123-45-67" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Должность</Label>
                        <Input id="position" defaultValue="Руководитель отдела продаж" />
                      </div>
                    </div>
                    <Button>Сохранить изменения</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Данные компании</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Название</Label>
                        <Input id="companyName" defaultValue="ООО 'Моя Компания'" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inn">ИНН</Label>
                        <Input id="inn" defaultValue="7701234567" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Адрес</Label>
                        <Input id="address" defaultValue="Москва, ул. Ленина, 1" />
                      </div>
                    </div>
                    <Button>Сохранить изменения</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="funnel" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Настройка этапов воронки</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {funnelStages.map((stage, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Icon name="GripVertical" size={20} className="text-muted-foreground cursor-move" />
                        <Input defaultValue={stage.name} className="flex-1" />
                        <Button variant="ghost" size="sm">
                          <Icon name="Trash2" size={16} className="text-red-600" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full gap-2">
                      <Icon name="Plus" size={16} />
                      Добавить этап
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Интеграции</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'СБИС', icon: 'FileKey', description: 'Электронный документооборот и ЭЦП', connected: true },
                      { name: 'Telegram', icon: 'MessageCircle', description: 'Уведомления в Telegram', connected: false },
                      { name: 'Email', icon: 'Mail', description: 'Интеграция с почтой', connected: true },
                      { name: '1С', icon: 'Database', description: 'Синхронизация с 1С', connected: false },
                    ].map((integration, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon name={integration.icon} size={20} className="text-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <Button variant={integration.connected ? 'outline' : 'default'}>
                          {integration.connected ? 'Настроено' : 'Подключить'}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <Dialog open={dealDialogOpen} onOpenChange={setDealDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDeal && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedDeal.title}</DialogTitle>
                    <DialogDescription className="mt-2">
                      {selectedDeal.company} • {selectedDeal.contact}
                    </DialogDescription>
                  </div>
                  <Badge variant="outline" className="ml-4">{selectedDeal.stage}</Badge>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Детали</TabsTrigger>
                  <TabsTrigger value="comments">Комментарии ({selectedDeal.comments.length})</TabsTrigger>
                  <TabsTrigger value="documents">Документы</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Сумма</Label>
                        <p className="text-2xl font-bold text-foreground mt-1">
                          ₽{selectedDeal.amount.toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Вероятность</Label>
                        <div className="flex items-center gap-3 mt-2">
                          <Progress value={selectedDeal.probability} className="flex-1" />
                          <span className="text-lg font-semibold">{selectedDeal.probability}%</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Этап воронки</Label>
                        <Select 
                          defaultValue={selectedDeal.stage}
                          onValueChange={(value) => handleDealStageChange(selectedDeal.id, value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {funnelStages.map((stage) => (
                              <SelectItem key={stage.name} value={stage.name}>{stage.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Компания</Label>
                        <p className="text-lg font-medium text-foreground mt-1">{selectedDeal.company}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Контактное лицо</Label>
                        <p className="text-lg font-medium text-foreground mt-1">{selectedDeal.contact}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Дата создания</Label>
                        <p className="text-lg font-medium text-foreground mt-1">{selectedDeal.createdAt}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-muted-foreground">Описание</Label>
                    <p className="text-foreground mt-2">{selectedDeal.description || 'Описание не указано'}</p>
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedDeal.comments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Icon name="MessageSquare" size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Пока нет комментариев</p>
                      </div>
                    ) : (
                      selectedDeal.comments.map((comment) => (
                        <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-primary text-white text-xs">
                                {comment.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{comment.author}</span>
                                <span className="text-xs text-muted-foreground">{comment.date}</span>
                              </div>
                              <p className="text-sm text-foreground">{comment.text}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Новый комментарий</Label>
                    <Textarea
                      placeholder="Добавьте комментарий..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()} className="w-full">
                      <Icon name="Send" size={16} className="mr-2" />
                      Отправить комментарий
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="text-center py-8">
                    <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">Создайте КП или счет для этой сделки</p>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => {
                          setDocumentType('proposal');
                          setDocumentDialogOpen(true);
                        }}
                      >
                        <Icon name="FileText" size={16} />
                        Создать КП
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => {
                          setDocumentType('invoice');
                          setDocumentDialogOpen(true);
                        }}
                      >
                        <Icon name="Receipt" size={16} />
                        Создать счет
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {documentType === 'proposal' ? 'Создать коммерческое предложение' : 'Создать счет'}
            </DialogTitle>
            <DialogDescription>
              Документ будет создан для сделки: {selectedDeal?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Клиент</Label>
              <Input value={selectedDeal?.company || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Сумма</Label>
              <Input value={`₽${selectedDeal?.amount.toLocaleString('ru-RU')}`} disabled />
            </div>
            <div className="space-y-2">
              <Label>Описание услуг/товаров</Label>
              <Textarea placeholder="Опишите позиции документа..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateDocument}>
              Создать {documentType === 'proposal' ? 'КП' : 'счет'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;