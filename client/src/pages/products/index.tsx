
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ChatAssistant from '@/components/layout/ChatAssistant';

import { 
  Shield, 
  Eye, 
  Lock, 
  Cpu, 
  Code, 
  Network, 
  Server, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  ArrowRight, 
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Product } from '@/types';

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'CyberWhale Scanner',
    description: 'Интеллектуальный сканер уязвимостей с элементами ИИ для автоматического анализа безопасности веб-приложений.',
    price: 49.99,
    features: [
      'Автоматическое обнаружение уязвимостей',
      'ИИ-powered анализ рисков',
      'Интеграция с CI/CD',
      'Подробные отчеты'
    ],
    isFeatured: true,
    isPopular: true,
    comingSoon: false,
    category: 'scanner'
  },
  {
    id: '2',
    name: 'CyberWhale Monitor',
    description: 'Система мониторинга сетевой безопасности в реальном времени с продвинутой аналитикой и обнаружением аномалий.',
    price: 79.99,
    features: [
      'Мониторинг в реальном времени',
      'Обнаружение аномалий',
      'Анализ сетевого трафика',
      'Оповещения об инцидентах'
    ],
    isFeatured: true,
    isPopular: false,
    comingSoon: false,
    category: 'monitor'
  },
  {
    id: '3',
    name: 'CyberWhale Crypto',
    description: 'Инструмент для безопасного хранения и управления криптографическими ключами с поддержкой аппаратных токенов.',
    price: 39.99,
    features: [
      'Управление ключами',
      'Интеграция с HSM',
      'Шифрование данных',
      'Аудит доступа'
    ],
    isFeatured: false,
    isPopular: false,
    comingSoon: false,
    category: 'crypto'
  },
  {
    id: '4',
    name: 'CyberWhale PenTest',
    description: 'Комплексная платформа для проведения тестирования на проникновение с автоматизированными инструментами.',
    price: 89.99,
    features: [
      'Автоматизированное тестирование',
      'Готовые сценарии атак',
      'Генерация отчетов',
      'База данных эксплойтов'
    ],
    isFeatured: false,
    isPopular: true,
    comingSoon: false,
    category: 'pentest'
  },
  {
    id: '5',
    name: 'CyberWhale DevSec',
    description: 'Инструменты для безопасной разработки с интеграцией в IDE и автоматическим анализом кода.',
    price: 0,
    features: [
      'Анализ исходного кода',
      'Проверка зависимостей',
      'Интеграция с IDE',
      'Рекомендации по безопасности'
    ],
    isFeatured: false,
    isPopular: false,
    comingSoon: true,
    category: 'devsec'
  },
  {
    id: '6',
    name: 'CyberWhale Network',
    description: 'Комплексное решение для защиты корпоративных сетей с поддержкой Zero Trust архитектуры.',
    price: 0,
    features: [
      'Zero Trust архитектура',
      'Сегментация сети',
      'Контроль доступа',
      'Анализ угроз'
    ],
    isFeatured: false,
    isPopular: false,
    comingSoon: true,
    category: 'network'
  },
];

// Category icons mapping
const categoryIcons: Record<Product['category'], React.ReactNode> = {
  scanner: <Shield className="w-6 h-6" />,
  monitor: <Eye className="w-6 h-6" />,
  crypto: <Lock className="w-6 h-6" />,
  pentest: <Code className="w-6 h-6" />,
  devsec: <Cpu className="w-6 h-6" />,
  network: <Network className="w-6 h-6" />,
  other: <Server className="w-6 h-6" />,
};

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'featured' | 'popular' | 'coming-soon'>('all');
  
  // Filter products based on search and filter
  const filteredProducts = mockProducts.filter(product => {
    // Apply search filter
    const matchesSearch = 
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    if (filter === 'featured' && !product.isFeatured) return false;
    if (filter === 'popular' && !product.isPopular) return false;
    if (filter === 'coming-soon' && !product.comingSoon) return false;
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-cyberdark-900 flex flex-col">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-cyberdark-800 to-cyberdark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                Продукты CyberWhale
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                <span className="text-gradient">Профессиональные инструменты для обеспечения кибербезопасности</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Наши продукты созданы экспертами в области кибербезопасности и предлагают инновационные решения 
                для защиты ваших систем и данных от современных угроз.
              </p>
              
              <div className="flex justify-center">
                <div className="relative max-w-xl w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Поиск по продуктам..."
                    className="pl-10 w-full bg-cyberdark-700 border-cyberdark-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter tabs */}
          <Tabs 
            defaultValue="all" 
            className="mb-10"
            onValueChange={(value) => setFilter(value as 'all' | 'featured' | 'popular' | 'coming-soon')}
          >
            <div className="flex justify-center">
              <TabsList className="bg-cyberdark-800">
                <TabsTrigger value="all">Все продукты</TabsTrigger>
                <TabsTrigger value="featured">Рекомендуемые</TabsTrigger>
                <TabsTrigger value="popular">Популярные</TabsTrigger>
                <TabsTrigger value="coming-soon">Скоро в продаже</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          
          {/* Featured products */}
          {filter === 'all' && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-8">Рекомендуемые продукты</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mockProducts
                  .filter(product => product.isFeatured)
                  .map((product) => (
                    <div 
                      key={product.id}
                      className="bg-gradient-to-b from-cyberdark-800 to-cyberdark-700 rounded-lg overflow-hidden border border-cyberdark-600 hover:border-cyberblue-500/50 transition-all duration-300 hover:shadow-glow-sm"
                    >
                      <div className="p-6">
                        <div className="flex items-start">
                          <div className="bg-gradient-to-br from-cyberblue-500 to-cyberblue-700 rounded-lg p-3 mr-4">
                            {categoryIcons[product.category]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-white">{product.name}</h3>
                              {product.isPopular && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                  Популярный
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-300 mb-4">
                              {product.description}
                            </p>
                            <ul className="space-y-2 mb-6">
                              {product.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-5 h-5 text-cyberblue-500 mr-2 flex-shrink-0" />
                                  <span className="text-gray-300">{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex items-center justify-between">
                              <div className="text-2xl font-bold text-white">
                                ${product.price.toFixed(2)}
                                <span className="text-gray-400 text-sm ml-1">/месяц</span>
                              </div>
                              <Link to={`/products/${product.id}`}>
                                <Button className="bg-cyberblue-500 hover:bg-cyberblue-600">
                                  Подробнее
                                  <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* All products grid */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">
              {filter === 'all' && 'Все продукты'}
              {filter === 'featured' && 'Рекомендуемые продукты'}
              {filter === 'popular' && 'Популярные продукты'}
              {filter === 'coming-soon' && 'Скоро в продаже'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700 hover:border-cyberblue-500/50 transition-all duration-300 hover:shadow-glow-sm"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-cyberdark-700 rounded-lg p-2">
                        {categoryIcons[product.category]}
                      </div>
                      <div className="flex space-x-2">
                        {product.isPopular && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            Популярный
                          </Badge>
                        )}
                        {product.isFeatured && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Рекомендуемый
                          </Badge>
                        )}
                        {product.comingSoon && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Скоро
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    
                    <p className="text-gray-300 mb-4">
                      {product.description}
                    </p>
                    
                    <div className="border-t border-cyberdark-700 pt-4 mb-6">
                      <h4 className="text-sm font-medium text-white mb-2">Основные возможности:</h4>
                      <ul className="space-y-1">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircle className="w-4 h-4 text-cyberblue-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white">
                        {product.comingSoon ? (
                          <span className="text-yellow-400">Скоро в продаже</span>
                        ) : (
                          <span className="text-xl">${product.price.toFixed(2)}<span className="text-gray-400 text-sm">/месяц</span></span>
                        )}
                      </div>
                      <Link to={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          Подробнее
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-cyberdark-800 rounded-lg p-8 border border-cyberdark-700 inline-block">
                  <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Ничего не найдено</h3>
                  <p className="text-gray-300 mb-4">
                    По вашему запросу "{searchQuery}" не найдено продуктов. 
                    Попробуйте изменить поисковый запрос или фильтры.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setFilter('all');
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Comparison section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Сравнение продуктов</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] bg-cyberdark-800 rounded-lg border border-cyberdark-700">
                <thead>
                  <tr className="border-b border-cyberdark-700">
                    <th className="px-6 py-4 text-left text-white font-bold">Функция</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Scanner</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Monitor</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Crypto</th>
                    <th className="px-6 py-4 text-center text-white font-bold">PenTest</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cyberdark-700">
                    <td className="px-6 py-4 text-gray-300">Автоматическое сканирование</td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-cyberdark-700">
                    <td className="px-6 py-4 text-gray-300">Интеграция с CI/CD</td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-cyberdark-700">
                    <td className="px-6 py-4 text-gray-300">Мониторинг в реальном времени</td>
                    <td className="px-6 py-4 text-center text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-gray-500">-</td>
                  </tr>
                  <tr className="border-b border-cyberdark-700">
                    <td className="px-6 py-4 text-gray-300">Управление криптоключами</td>
                    <td className="px-6 py-4 text-center text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-500">-</td>
                  </tr>
                  <tr className="border-b border-cyberdark-700">
                    <td className="px-6 py-4 text-gray-300">Анализ на основе ИИ</td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-300">Генерация отчетов</td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-cyberblue-500"><CheckCircle className="w-5 h-5 mx-auto" /></td>
                  </tr>
                </tbody>
                <tfoot className="border-t border-cyberdark-700 bg-cyberdark-700/50">
                  <tr>
                    <td className="px-6 py-4 text-white font-bold">Цена (в месяц)</td>
                    <td className="px-6 py-4 text-center text-white font-medium">$49.99</td>
                    <td className="px-6 py-4 text-center text-white font-medium">$79.99</td>
                    <td className="px-6 py-4 text-center text-white font-medium">$39.99</td>
                    <td className="px-6 py-4 text-center text-white font-medium">$89.99</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {/* Bundle offer */}
          <div className="mt-20 bg-gradient-to-r from-cyberdark-800 to-cyberdark-700 rounded-lg overflow-hidden border border-cyberdark-600">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center">
                <div className="lg:w-2/3 mb-6 lg:mb-0 lg:pr-8">
                  <Badge className="mb-4 bg-cyberblue-500/20 text-cyberblue-400 border-cyberblue-500/30 px-3 py-1">
                    Специальное предложение
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Пакет Security Pro Bundle
                  </h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Получите полный набор наших ключевых продуктов по специальной цене.
                    Включает Scanner, Monitor и Crypto для комплексной защиты ваших систем.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-cyberblue-500 mr-2" />
                      <span className="text-gray-300">3 продукта в 1 пакете</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-cyberblue-500 mr-2" />
                      <span className="text-gray-300">Экономия 30%</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-cyberblue-500 mr-2" />
                      <span className="text-gray-300">Приоритетная поддержка</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="text-2xl font-bold text-white">$119.99</div>
                      <div className="text-gray-400 line-through">$169.97</div>
                    </div>
                    <Button className="bg-cyberblue-500 hover:bg-cyberblue-600 btn-glow">
                      Подробнее о предложении
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="lg:w-1/3 flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-cyberdark-600 rounded-full flex items-center justify-center absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4">
                      <Shield className="w-10 h-10 text-cyberblue-500" />
                    </div>
                    <div className="w-24 h-24 bg-cyberdark-600 rounded-full flex items-center justify-center">
                      <Eye className="w-12 h-12 text-cyberblue-500" />
                    </div>
                    <div className="w-20 h-20 bg-cyberdark-600 rounded-full flex items-center justify-center absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
                      <Lock className="w-10 h-10 text-cyberblue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Отзывы клиентов</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-cyberdark-600"></div>
                  <div className="ml-3">
                    <h4 className="font-medium text-white">Иван К.</h4>
                    <p className="text-gray-400 text-sm">Chief Security Officer</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  "CyberWhale Scanner значительно упростил процесс обнаружения уязвимостей в наших 
                  веб-приложениях. Особенно впечатляет аналитический модуль на базе ИИ."
                </p>
                <div className="flex text-yellow-500">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                </div>
              </div>
              
              <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-cyberdark-600"></div>
                  <div className="ml-3">
                    <h4 className="font-medium text-white">Анна Д.</h4>
                    <p className="text-gray-400 text-sm">Сетевой администратор</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  "После внедрения CyberWhale Monitor наша команда стала гораздо быстрее реагировать 
                  на инциденты. Система обнаружения аномалий работает превосходно."
                </p>
                <div className="flex text-yellow-500">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <HalfStarIcon />
                </div>
              </div>
              
              <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-cyberdark-600"></div>
                  <div className="ml-3">
                    <h4 className="font-medium text-white">Михаил С.</h4>
                    <p className="text-gray-400 text-sm">DevOps инженер</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  "Интеграция CyberWhale Scanner в наш CI/CD пайплайн позволила нам автоматизировать 
                  тестирование безопасности и значительно снизить риски."
                </p>
                <div className="flex text-yellow-500">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Часто задаваемые вопросы</h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                <h3 className="text-lg font-bold text-white mb-2">Какие способы оплаты вы принимаете?</h3>
                <p className="text-gray-300">
                  Мы принимаем оплату кредитными картами (Visa, MasterCard, American Express), 
                  PayPal, а также банковскими переводами для корпоративных клиентов.
                </p>
              </div>
              
              <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                <h3 className="text-lg font-bold text-white mb-2">Есть ли у вас пробный период?</h3>
                <p className="text-gray-300">
                  Да, мы предлагаем 14-дневный бесплатный пробный период для всех наших продуктов. 
                  Вы можете протестировать полную функциональность продукта без каких-либо ограничений.
                </p>
              </div>
              
              <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                <h3 className="text-lg font-bold text-white mb-2">Какая поддержка предоставляется?</h3>
                <p className="text-gray-300">
                  Все наши продукты включают базовую техническую поддержку по электронной почте. Для 
                  корпоративных клиентов доступны расширенные планы поддержки с гарантированным временем отклика.
                </p>
              </div>
              
              <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                <h3 className="text-lg font-bold text-white mb-2">Можно ли интегрировать ваши продукты с другими решениями?</h3>
                <p className="text-gray-300">
                  Да, наши продукты поддерживают интеграцию с популярными системами безопасности, 
                  инструментами CI/CD и платформами управления. Для получения подробной информации 
                  обратитесь к документации или в нашу службу поддержки.
                </p>
              </div>
              
              <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                <h3 className="text-lg font-bold text-white mb-2">Предлагаете ли вы скидки для образовательных учреждений?</h3>
                <p className="text-gray-300">
                  Да, мы предлагаем специальные образовательные лицензии для учебных заведений и 
                  некоммерческих организаций. Пожалуйста, свяжитесь с нашим отделом продаж для 
                  получения дополнительной информации.
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA section */}
          <div className="mt-20 bg-gradient-to-b from-cyberdark-900 to-cyberdark-800 py-12 rounded-lg border border-cyberdark-700">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-3xl font-bold text-white mb-4">
                Готовы защитить свои системы?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Выберите продукты CyberWhale и получите передовые решения для кибербезопасности 
                от экспертов отрасли.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="bg-cyberblue-500 hover:bg-cyberblue-600 btn-glow">
                  Получить консультацию
                </Button>
                <Button variant="outline">
                  Смотреть демо
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatAssistant />
    </div>
  );
}

// Star icon components
const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);

const HalfStarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <defs>
      <linearGradient id="halfGradient">
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="#4B5563" />
      </linearGradient>
    </defs>
    <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);
