
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ChatAssistant from '@/components/layout/ChatAssistant';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Github, 
  ExternalLink, 
  BookOpen, 
  ArrowLeft, 
  Shield, 
  Database, 
  Search, 
  Code,
  Bug,
  Blocks,
  Terminal,
  Network,
  Fingerprint,
  Cpu,
  Star
} from 'lucide-react';

export default function ReferenceGuide() {
  const categories = [
    {
      name: "Операционные системы",
      icon: <Shield className="h-6 w-6 text-white" />,
      description: "Специализированные ОС для пентеста и анализа безопасности",
      tools: ["Kali Linux", "Parrot OS", "BlackArch", "Commando VM", "Flare VM"]
    },
    {
      name: "Анализ вредоносного ПО",
      icon: <Bug className="h-6 w-6 text-white" />,
      description: "Инструменты для анализа и исследования вредоносного кода",
      tools: ["Any.Run", "VirusTotal", "REMnux", "Cuckoo Sandbox", "Intezer"]
    },
    {
      name: "OSINT",
      icon: <Search className="h-6 w-6 text-white" />,
      description: "Инструменты для разведки на основе открытых источников",
      tools: ["OSINT Framework", "Maltego", "Shodan", "theHarvester", "SpiderFoot"]
    },
    {
      name: "Анализ уязвимостей",
      icon: <Code className="h-6 w-6 text-white" />,
      description: "Инструменты для поиска и анализа уязвимостей",
      tools: ["Nmap", "Metasploit", "Burp Suite", "OWASP ZAP", "Acunetix"]
    },
    {
      name: "Форензика",
      icon: <Fingerprint className="h-6 w-6 text-white" />,
      description: "Инструменты для цифровой криминалистики и расследований",
      tools: ["Autopsy", "Volatility", "FTK Imager", "Sleuth Kit", "CAINE"]
    },
    {
      name: "Реверс-инжиниринг",
      icon: <Blocks className="h-6 w-6 text-white" />,
      description: "Инструменты для анализа и декомпиляции программ",
      tools: ["Ghidra", "IDA Pro", "Radare2", "Binary Ninja", "OllyDbg"]
    },
    {
      name: "Сетевая безопасность",
      icon: <Network className="h-6 w-6 text-white" />,
      description: "Инструменты для анализа и защиты сетей",
      tools: ["Wireshark", "Zeek", "Suricata", "Snort", "NetworkMiner"]
    },
    {
      name: "Базы данных уязвимостей",
      icon: <Database className="h-6 w-6 text-white" />,
      description: "Базы данных с информацией о уязвимостях и угрозах",
      tools: ["MITRE ATT&CK", "CVE", "NVD", "Exploit-DB", "Vulnhub"]
    }
  ];

  return (
    <div className="min-h-screen bg-cyberdark-900 flex flex-col">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link to="/knowledge" className="text-gray-400 hover:text-white flex items-center mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к базе знаний
            </Link>
            
            <h1 className="text-4xl font-bold text-white mb-6">
              <span className="text-cyberblue-400">CyberWhale</span> Справочник кибербезопасности
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Полная коллекция инструментов, ресурсов и методов для специалистов в области кибербезопасности. 
              Справочник постоянно обновляется и содержит более 300 полезных ссылок.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="https://github.com/CyberWhaleOffical1/CyberWhale_Cybersecurity_Reference" target="_blank" rel="noopener noreferrer">
                <Button className="bg-cyberblue-500 hover:bg-cyberblue-600 w-full sm:w-auto">
                  <Github className="mr-2 h-5 w-5" />
                  Открыть на GitHub
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="https://github.com/CyberWhaleOffical1/CyberWhale_Cybersecurity_Reference/blob/main/README.md" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Читать README
                </Button>
              </a>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-cyberdark-800 to-cyberdark-700 rounded-lg border border-cyberdark-700 p-8 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-cyberdark-700/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">300+</div>
                <div className="text-sm text-gray-400">Инструментов</div>
              </div>
              <div className="bg-cyberdark-700/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">20+</div>
                <div className="text-sm text-gray-400">Категорий</div>
              </div>
              <div className="bg-cyberdark-700/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">Бесплатно</div>
              </div>
              <div className="bg-cyberdark-700/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">Доступ</div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-6">Основные категории справочника</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map((category, index) => (
              <div key={index} className="bg-cyberdark-800 rounded-lg border border-cyberdark-700 hover:border-cyberblue-500/50 transition-colors p-6 flex flex-col h-full">
                <div className="bg-gradient-to-br from-cyberblue-600/20 to-purple-600/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-gray-400 mb-4 flex-grow">{category.description}</p>
                <div className="mt-2">
                  <p className="text-gray-300 text-sm font-medium mb-2">Популярные инструменты:</p>
                  <ul className="space-y-1">
                    {category.tools.slice(0, 3).map((tool, i) => (
                      <li key={i} className="text-gray-400 text-sm flex items-center">
                        <Terminal className="mr-2 h-3 w-3 text-cyberblue-400" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-cyberblue-900/50 to-purple-900/50 rounded-lg p-8 border border-cyberblue-500/30 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Присоединяйтесь к проекту</h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Справочник CyberWhale является проектом с открытым исходным кодом. 
              Мы приветствуем ваш вклад в расширение и улучшение нашей базы знаний.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="https://github.com/CyberWhaleOffical1/CyberWhale_Cybersecurity_Reference" target="_blank" rel="noopener noreferrer">
                <Button className="bg-cyberblue-500 hover:bg-cyberblue-600 w-full">
                  <Github className="mr-2 h-5 w-5" />
                  Перейти в репозиторий
                </Button>
              </a>
              <a href="https://github.com/CyberWhaleOffical1/CyberWhale_Cybersecurity_Reference/stargazers" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  <Star className="mr-2 h-5 w-5" />
                  Поставить звезду
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <ChatAssistant />
    </div>
  );
}
