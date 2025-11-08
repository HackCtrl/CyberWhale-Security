import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Award, Users, BookOpen, Bot, Lock, Search, Zap, Target, TrendingUp } from "lucide-react";
import ChatAssistant from "@/components/layout/ChatAssistant";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyberdark-900 via-cyberdark-800 to-cyberdark-900">
      <ChatAssistant />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyberblue-500/10 to-cyberpurple-500/10"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-5 bg-cover bg-center"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-cyberblue-500/20 border border-cyberblue-500/30 rounded-full">
                <Shield className="w-5 h-5 text-cyberblue-400" />
                <span className="text-cyberblue-400 font-medium">Профессиональная информационная безопасность</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyberblue-400 to-white animate-gradient">
                CyberWhale
              </span>
              <br />
              Защита вашего бизнеса
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Российская компания по информационной безопасности с уникальными ИИ-решениями. 
              Предоставляем профессиональные услуги аудита, консалтинга и создаём кастомные ИИ-аватары 
              для автоматизации задач ИБ.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white px-8 py-6 text-lg">
                  <Shield className="w-5 h-5 mr-2" />
                  Наши услуги
                </Button>
              </Link>
              <Link to="/ctf">
                <Button size="lg" variant="outline" className="border-2 border-cyberblue-500 text-cyberblue-400 hover:bg-cyberblue-500/10 px-8 py-6 text-lg">
                  <Target className="w-5 h-5 mr-2" />
                  Бесплатное обучение
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-cyberdark-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Наши <span className="text-cyberblue-400">услуги</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Комплексные решения по информационной безопасности для бизнеса любого масштаба
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Audits */}
            <div className="group p-8 bg-gradient-to-br from-cyberdark-700 to-cyberdark-800 rounded-2xl border border-cyberdark-600 hover:border-cyberblue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyberblue-500/10">
              <div className="w-16 h-16 bg-cyberblue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyberblue-500/30 transition-all">
                <Search className="w-8 h-8 text-cyberblue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Аудиты безопасности</h3>
              <p className="text-gray-400 mb-6">
                Внешние и внутренние аудиты систем. Проверка на уязвимости с подробными отчётами и рекомендациями.
              </p>
              <div className="text-cyberblue-400 font-semibold">От 50,000 ₽</div>
            </div>

            {/* Service 2: Consulting */}
            <div className="group p-8 bg-gradient-to-br from-cyberdark-700 to-cyberdark-800 rounded-2xl border border-cyberdark-600 hover:border-cyberblue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyberblue-500/10">
              <div className="w-16 h-16 bg-cyberblue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyberblue-500/30 transition-all">
                <BookOpen className="w-8 h-8 text-cyberblue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Консалтинг по ИБ</h3>
              <p className="text-gray-400 mb-6">
                Разработка политик ИБ, категорирование объектов КИИ, сертификация по ГОСТ Р ИСО/МЭК 27001.
              </p>
              <div className="text-cyberblue-400 font-semibold">От 100,000 ₽</div>
            </div>

            {/* Service 3: Pentests */}
            <div className="group p-8 bg-gradient-to-br from-cyberdark-700 to-cyberdark-800 rounded-2xl border border-cyberdark-600 hover:border-cyberblue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyberblue-500/10">
              <div className="w-16 h-16 bg-cyberblue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyberblue-500/30 transition-all">
                <Lock className="w-8 h-8 text-cyberblue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Пентесты</h3>
              <p className="text-gray-400 mb-6">
                Симуляция реальных атак (penetration testing) с подробными отчётами о найденных уязвимостях.
              </p>
              <div className="text-cyberblue-400 font-semibold">От 150,000 ₽</div>
            </div>

            {/* Service 4: Incident Response */}
            <div className="group p-8 bg-gradient-to-br from-cyberdark-700 to-cyberdark-800 rounded-2xl border border-cyberdark-600 hover:border-cyberblue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyberblue-500/10">
              <div className="w-16 h-16 bg-cyberblue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyberblue-500/30 transition-all">
                <Zap className="w-8 h-8 text-cyberblue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Инцидент-респонс</h3>
              <p className="text-gray-400 mb-6">
                Оперативное реагирование на инциденты безопасности с детальным анализом и рекомендациями.
              </p>
              <div className="text-cyberblue-400 font-semibold">От 200,000 ₽</div>
            </div>

            {/* Service 5: Monitoring */}
            <div className="group p-8 bg-gradient-to-br from-cyberdark-700 to-cyberdark-800 rounded-2xl border border-cyberdark-600 hover:border-cyberblue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyberblue-500/10">
              <div className="w-16 h-16 bg-cyberblue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyberblue-500/30 transition-all">
                <TrendingUp className="w-8 h-8 text-cyberblue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Мониторинг 24/7</h3>
              <p className="text-gray-400 mb-6">
                Круглосуточное наблюдение за инфраструктурой с интеграцией в SIEM и SOC-услуги.
              </p>
              <div className="text-cyberblue-400 font-semibold">От 50,000 ₽/мес</div>
            </div>

            {/* Service 6: Custom AI Avatars */}
            <div className="group p-8 bg-gradient-to-br from-cyberpurple-700/50 to-cyberdark-800 rounded-2xl border-2 border-cyberpurple-500/50 hover:border-cyberpurple-500 transition-all duration-300 hover:shadow-xl hover:shadow-cyberpurple-500/20">
              <div className="w-16 h-16 bg-cyberpurple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyberpurple-500/30 transition-all">
                <Bot className="w-8 h-8 text-cyberpurple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Кастомные ИИ-аватары</h3>
              <p className="text-gray-400 mb-6">
                Создание и обучение персональных ИИ-агентов для автоматизации задач ИБ: мониторинг, анализ логов, проверка политик.
              </p>
              <div className="text-cyberpurple-400 font-semibold">От 200,000 ₽ + 5,000 ₽/мес</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Avatars Highlight Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-cyberpurple-500/10 to-cyberblue-500/10 rounded-3xl border border-cyberpurple-500/30 p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-cyberpurple-500/20 border border-cyberpurple-500/30 rounded-full">
                    <Bot className="w-5 h-5 text-cyberpurple-400" />
                    <span className="text-cyberpurple-400 font-medium">Наша уникальная изюминка</span>
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Кастомные ИИ-аватары для вашего бизнеса
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  Мы создаём персональных ИИ-агентов, обученных специально под задачи вашей компании. 
                  Аватары работают локально, анализируют данные и автоматизируют рутинные процессы ИБ.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyberpurple-500/20 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-cyberpurple-400"></div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Анализ логов и событий</div>
                      <div className="text-gray-400">Автоматический мониторинг и выявление аномалий</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyberpurple-500/20 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-cyberpurple-400"></div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Проверка политик ИБ</div>
                      <div className="text-gray-400">Контроль соблюдения требований и стандартов</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyberpurple-500/20 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-cyberpurple-400"></div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Интеграция с вашими системами</div>
                      <div className="text-gray-400">API для Astra Linux, РЕД ОС, Telegram-боты</div>
                    </div>
                  </li>
                </ul>
                <Link to="/products">
                  <Button size="lg" className="bg-cyberpurple-500 hover:bg-cyberpurple-600 text-white">
                    Узнать больше об ИИ-аватарах
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-cyberpurple-500/20 to-cyberblue-500/20 rounded-2xl border border-cyberpurple-500/30 flex items-center justify-center">
                  <Bot className="w-48 h-48 text-cyberpurple-400/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training & CTF Section */}
      <section className="py-20 bg-cyberdark-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Бесплатное <span className="text-cyberblue-400">обучение</span>
            </h2>
            <p className="text-xl text-gray-400">
              Изучайте кибербезопасность на практике, участвуйте в турнирах и получайте доступ к пробным ИИ-аватарам
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-cyberdark-700 to-cyberdark-800 rounded-2xl border border-cyberdark-600">
              <div className="w-20 h-20 bg-cyberblue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-cyberblue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">CTF Турниры</h3>
              <p className="text-gray-400 mb-6">
                Ежемесячные соревнования по кибербезопасности с ценными призами и возможностью продемонстрировать навыки
              </p>
              <Link to="/ctf">
                <Button variant="outline" className="border-cyberblue-500 text-cyberblue-400">
                  Участвовать
                </Button>
              </Link>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-cyberdark-700 to-cyberdark-800 rounded-2xl border border-cyberdark-600">
              <div className="w-20 h-20 bg-cyberblue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-cyberblue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">База знаний</h3>
              <p className="text-gray-400 mb-6">
                Курсы и практические задания по различным направлениям: Web, Crypto, OSINT, Forensics и другие
              </p>
              <Link to="/knowledge">
                <Button variant="outline" className="border-cyberblue-500 text-cyberblue-400">
                  Изучать
                </Button>
              </Link>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-cyberdark-700 to-cyberdark-800 rounded-2xl border border-cyberdark-600">
              <div className="w-20 h-20 bg-cyberblue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-cyberblue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Сообщество</h3>
              <p className="text-gray-400 mb-6">
                Общайтесь с экспертами по ИБ, делитесь опытом и получайте помощь от профессионального сообщества
              </p>
              <Link to="/community">
                <Button variant="outline" className="border-cyberblue-500 text-cyberblue-400">
                  Присоединиться
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-cyberblue-400 mb-2">500 млрд ₽</div>
              <div className="text-gray-400">Рынок ИБ в России</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-cyberblue-400 mb-2">+20%</div>
              <div className="text-gray-400">Рост в 2025 году</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-cyberblue-400 mb-2">24/7</div>
              <div className="text-gray-400">Мониторинг систем</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-cyberblue-400 mb-2">100%</div>
              <div className="text-gray-400">Российские решения</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyberblue-500/10 to-cyberpurple-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Готовы защитить ваш бизнес?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Свяжитесь с нами для консультации по услугам ИБ и кастомным ИИ-решениям
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white px-8 py-6 text-lg">
                  <Shield className="w-5 h-5 mr-2" />
                  Заказать услугу
                </Button>
              </Link>
              <Link to="/ctf">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  <Award className="w-5 h-5 mr-2" />
                  Начать обучение
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
