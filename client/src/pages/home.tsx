import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Menu, X, ChevronRight, MapPin, Users, BookOpen, GraduationCap, ArrowRight, Play, Download, School, FileText, Calendar, Target, Mail } from "lucide-react";
import type { PageContent } from "@shared/schema";
import logoImage from "@assets/WhatsApp_Image_2025-07-24_at_10.24.37_PM-removebg-preview_1753932117331.png";
import teresilaImage from "@assets/image_1753932694971.png";
import galleryImage1 from "@assets/image_1753932244909.png";
import galleryImage2 from "@assets/image_1753932257117.png";
import galleryImage3 from "@assets/image_1753932259885.png";
import galleryImage4 from "@assets/image_1753932270773.png";
import galleryImage5 from "@assets/image_1753932277060.png";
import galleryImage6 from "@assets/image_1753932370081.png";
import galleryImage7 from "@assets/image_1753932372955.png";
import galleryImage8 from "@assets/image_1753932377054.png";
import galleryImage9 from "@assets/image_1753932387634.png";
import galleryImage10 from "@assets/image_1753932392897.png";
import galleryImage11 from "@assets/image_1753932401149.png";

/**
 * The home page of the application.
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ students: 0, schools: 0, themes: 0 });
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [activePhase, setActivePhase] = useState<string | null>(null);

  // Load content from the CMS
  const { data: cmsData } = useQuery({
    queryKey: ["page-content"],
    queryFn: async () => {
      const response = await fetch("/api/content");
      if (!response.ok) throw new Error("Error loading content");
      return response.json();
    },
  });

  const contents: PageContent[] = cmsData?.contents || [];
  
  /**
   * Helper function to get content for a section.
   * @param {string} section - The name of the section.
   * @returns {PageContent | undefined} The content of the section.
   */
  const getSection = (section: string) => 
    contents.find((c) => c.section === section && c.isVisible);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('bg-opacity-95');
        } else {
          navbar.classList.remove('bg-opacity-95');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animated counters for statistics
  useEffect(() => {
    const targets = { students: 150, schools: 2, themes: 4 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);

      setStats({
        students: Math.round(targets.students * easeOutProgress),
        schools: Math.round(targets.schools * easeOutProgress),
        themes: Math.round(targets.themes * easeOutProgress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  /**
   * Scrolls to a section of the page.
   * @param {string} sectionId - The ID of the section to scroll to.
   */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-800 leading-relaxed">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center text-xl font-bold">
            <img src={logoImage} alt="Conexión Rural 360" className="h-12 w-12 mr-3" />
            <span>Conexión Rural 360</span>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <button 
                onClick={() => scrollToSection('inicio')}
                className="text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Inicio
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('proyecto')}
                className="text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Sobre el Proyecto
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('equipo')}
                className="text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Equipo
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('fases')}
                className="text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Fases
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('materiales')}
                className="text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Materiales
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('galeria')}
                className="text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Galería
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-8 py-4 space-y-4">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="block text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('proyecto')}
                className="block text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Sobre el Proyecto
              </button>
              <button 
                onClick={() => scrollToSection('equipo')}
                className="block text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Equipo
              </button>
              <button 
                onClick={() => scrollToSection('fases')}
                className="block text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Fases
              </button>
              <button 
                onClick={() => scrollToSection('materiales')}
                className="block text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Materiales
              </button>
              <button 
                onClick={() => scrollToSection('galeria')}
                className="block text-gray-700 font-medium hover:text-rural-orange-hover transition-colors duration-300"
              >
                Galería
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="text-white py-24 px-8 text-center relative overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/attached_assets/IMG_8988_1754364438033.MP4" type="video/mp4" />
        </video>

        {/* Video Overlay with Gray Filter */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Orange Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient opacity-80"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors duration-300">
            🎓 Investigación Educativa 2025
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            {getSection("hero")?.title || "Conexión Rural 360"}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white/90">
            {getSection("hero")?.subtitle || "Educando en Contexto"}
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed">
            {getSection("hero")?.description || "Una apuesta investigativa para fortalecer la educación desde la creación de una plataforma educativa híbrida con contenidos territorializados."}
          </p>

          {/* Interactive CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() => scrollToSection('proyecto')}
              className="bg-white text-rural-orange-dark px-8 py-4 rounded-xl font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg group"
            >
              Conocer más
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              onClick={() => setVideoPlaying(!videoPlaying)}
              variant="outline"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-rural-orange-dark hover:scale-105 transition-all duration-300 group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Ver Video
            </Button>
          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <School className="h-8 w-8 text-white" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                Participantes
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white">{stats.schools}</div>
            <div className="text-white/80 text-sm">Instituciones Educativas</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-white" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                Beneficiados
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white">{stats.students}</div>
            <div className="text-white/80 text-sm">Estudiantes</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="h-8 w-8 text-white" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                Temáticas
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white">{stats.themes}</div>
            <div className="text-white/80 text-sm">Ejes Temáticos</div>
          </div>
        </div>

        {/* Research Locations */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold mb-8">Lugares de Investigación</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-left relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img 
                  src={galleryImage3} 
                  alt="Escuela Rural"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-white flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-2">Escuela Rural Multigrado El Volcán</h4>
                    <p className="text-white/90 text-sm mb-3 drop-shadow-lg">
                      Pertenece a la IEDRI (Institución Educativa Departamental Rural Integral) Mundo Nuevo. 
                      Ubicada en el municipio de La Calera, a 30 minutos del caso urbano.
                    </p>
                    <a href="https://maps.app.goo.gl/Fcsp5Vgh5TwR2jdw9" target="_blank">
                    <Button 
                      size="sm" 
                      className="bg-white/20 border-white/50 text-white hover:bg-white hover:text-rural-orange-dark backdrop-blur-sm font-semibold"
                    >
                      Ver ubicación
                    </Button>
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-left relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img 
                  src={galleryImage5} 
                  alt="Colegio San Andrés"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-white flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-2">Colegio Nuevo San Andrés de los Altos</h4>
                    <p className="text-white/90 text-sm mb-3 drop-shadow-lg">
                      Ubicado en la localidad de Usme – Bogotá.
                    </p>
                    <a href="https://maps.app.goo.gl/dkAQDTc6QuLoyvsx8" target="_blank">
                    <Button 
                      size="sm" 
                      className="bg-white/20 border-white/50 text-white hover:bg-white hover:text-rural-orange-dark backdrop-blur-sm font-semibold"
                    >
                      Ver ubicación
                    </Button>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="proyecto" className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {getSection("about")?.title || "Sobre el Proyecto"}
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="prose prose-lg">
                <p className="text-lg leading-relaxed">
                  <strong>{getSection("about")?.subtitle || "Conexión Rural 360: Educando en Contexto"}</strong>
                </p>
                <p className="text-lg leading-relaxed">
                  {getSection("about")?.description || 
                    "Es una investigación desarrollada desde febrero de 2025 que, a través de la estrategia de Cartografía Social Infantil, mapeó los intereses, temas y necesidades de niñas y niños de dos instituciones educativas rurales. A partir de estos hallazgos, se diseñaron y produjeron contenidos educativos contextualizados desde la ruralidad, integrados en una plataforma híbrida tipo MOOC que promueve el acceso al aprendizaje desde y para los territorios."}
                </p>
              </div>
            </div>
            <div className="bg-rural-orange-light/10 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-rural-orange-dark">
                {getSection("about")?.buttonText || "Objetivo General"}
              </h3>
              <p className="text-lg leading-relaxed">
                {getSection("about")?.content || 
                  "Determinar el impacto de la implementación de esta plataforma educativa en el fortalecimiento de habilidades digitales en comunidades rurales y en el desarrollo de aprendizajes significativos en torno a la Cultura de paz, la Construcción de ciudadanías, los Idiomas y el Pensamiento computacional."}
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-rural-orange-dark" />
                  <span className="text-sm">Contenidos territorializados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-rural-orange-dark" />
                  <span className="text-sm">Herramientas de gamificación</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-rural-orange-dark" />
                  <span className="text-sm">Capacitaciones para toda la comunidad educativa</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-rural-orange-dark" />
                  <span className="text-sm">Adaptado a condiciones rurales de conectividad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {getSection("team")?.title || "¿Quiénes somos?"}
          </h2>
          <p className="text-center text-xl mb-12 text-gray-600">
            {getSection("team")?.subtitle || "Somos un grupo de profesionales multidisciplinares que cree en la educación como motor de cambio social."}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Principal Investigator */}
            <div className="col-span-full">
              <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-rural-orange-light">
                    <img 
                      src={teresilaImage} 
                      alt="Teresila Barona Villamizar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Teresila Barona Villamizar</h3>
                  <Badge className="mb-4 bg-rural-orange-dark text-white">Investigadora Principal</Badge>
                  <p className="text-gray-600 mb-4">
                    Socióloga y Doctora en Educación, antioqueña y coordinó el proyecto en el semestre 2025-1.
                  </p>
                  <a href="mailto:ltbarona@ucompensar.edu.co">
                  <Button variant="outline" className="group">
                    <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    ltbarona@ucompensar.edu.co
                  </Button>
                  </a>
                </div>
              </Card>
            </div>

            {/* Co-investigators and Research Assistants */}
            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-rural-orange-main/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-rural-orange-dark" />
              </div>
              <h4 className="font-bold mb-2">Coinvestigadores</h4>
              <p className="text-sm text-gray-600">
                Equipo multidisciplinario de investigadores especializados
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-rural-orange-light/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-rural-orange-dark" />
              </div>
              <h4 className="font-bold mb-2">Pasantes de Investigación</h4>
              <p className="text-sm text-gray-600">
                Estudiantes en formación que apoyan el desarrollo del proyecto
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-20 h-20 bg-rural-orange-main/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                <School className="h-10 w-10 text-rural-orange-dark" />
              </div>
              <h4 className="font-bold mb-2">Comunidad Educativa</h4>
              <p className="text-sm text-gray-600">
                Directivos, docentes y estudiantes participantes
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Phases Section */}
      <section id="fases" className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Fases del Proyecto
          </h2>

          <div className="space-y-8">
            {/* CONECTAR Phase */}
            <Card className="p-8 shadow-lg">
              <div 
                className="cursor-pointer"
                onClick={() => setActivePhase(activePhase === 'conectar' ? null : 'conectar')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rural-orange-main rounded-full flex items-center justify-center text-white font-bold text-xl">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-rural-orange-dark">CONECTAR</h3>
                  </div>
                  <ChevronRight 
                    className={`h-6 w-6 transition-transform duration-300 ${
                      activePhase === 'conectar' ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
                <p className="text-gray-600 ml-16">
                  Fase inicial de revisión documental, reconocimiento territorial y construcción de talleres.
                </p>
              </div>

              {activePhase === 'conectar' && (
                <div className="ml-16 mt-6 space-y-4 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Revisión documental</h4>
                      <p className="text-sm text-gray-600">
                        Estudio teórico de antecedentes y para consolidar el marco categorial: Bilingüismo, 
                        Pensamiento computacional, Formación de ciudadanías y Educación para la paz.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Reconocimiento territorial</h4>
                      <p className="text-sm text-gray-600">
                        Visita a las Instituciones Educativas para identificar dinámicas, presentación del equipo 
                        a directivos y docentes, presentación de la investigación y llegar a acuerdos metodológicos.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* CONSTRUIR Phase */}
            <Card className="p-8 shadow-lg">
              <div 
                className="cursor-pointer"
                onClick={() => setActivePhase(activePhase === 'construir' ? null : 'construir')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rural-orange-main rounded-full flex items-center justify-center text-white font-bold text-xl">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-rural-orange-dark">CONSTRUIR - LA CALERA</h3>
                  </div>
                  <ChevronRight 
                    className={`h-6 w-6 transition-transform duration-300 ${
                      activePhase === 'construir' ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
                <p className="text-gray-600 ml-16">
                  Implementación de talleres, levantamiento de requerimientos y desarrollo de contenidos contextualizados.
                </p>
              </div>

              {activePhase === 'construir' && (
                <div className="ml-16 mt-6 space-y-6 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Talleres de asentimiento informado</h4>
                      <p className="text-sm text-gray-600">
                        Como apuesta onto-epistemológica, se realizaron jornadas explicativas y consultivas con los 
                        niños y niñas participantes para obtener sus permisos y alcances de participación.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Talleres de línea base</h4>
                      <p className="text-sm text-gray-600">
                        Jornadas con los estudiantes para conocer sus saberes previos sobre los cuatro ejes temáticos: 
                        Bilingüismo, Pensamiento computacional, Formación de ciudadanías y Educación para la paz.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Talleres de saberes propios</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-rural-orange-light/10 p-4 rounded-lg">
                        <h5 className="font-medium mb-3 text-rural-orange-dark">Formación de Ciudadanías</h5>
                        <ul className="text-sm space-y-1 text-rural-orange-dark">
                          <li>• Taller sobre participación</li>
                          <li>• Taller sobre territorio</li>
                          <li>• Taller sobre memoria colectiva</li>
                        </ul>
                      </div>
                      <div className="bg-rural-orange-light/10 p-4 rounded-lg">
                        <h5 className="font-medium mb-3 text-rural-orange-dark">Educación para la Paz</h5>
                        <ul className="text-sm space-y-1 text-rural-orange-dark">
                          <li>• Taller sobre ética del cuidado</li>
                          <li>• Taller sobre justicia</li>
                          <li>• Taller sobre memoria colectiva</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* MAPEO GENERAL Phase */}
            <Card className="p-8 shadow-lg">
              <div 
                className="cursor-pointer"
                onClick={() => setActivePhase(activePhase === 'mapeo' ? null : 'mapeo')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rural-orange-main rounded-full flex items-center justify-center text-white font-bold text-xl">
                      3
                    </div>
                    <h3 className="text-2xl font-bold text-rural-orange-dark">MAPEO GENERAL</h3>
                  </div>
                  <ChevronRight 
                    className={`h-6 w-6 transition-transform duration-300 ${
                      activePhase === 'mapeo' ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
                <p className="text-gray-600 ml-16">
                  Análisis de datos, creación de la plataforma y apropiación social del conocimiento.
                </p>
              </div>

              {activePhase === 'mapeo' && (
                <div className="ml-16 mt-6 space-y-4 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Identificación de Temas, Intereses y Necesidades</h4>
                      <p className="text-sm text-gray-600">
                        Se analizan los diarios de campo de cada taller y visita para triangular contenidos y 
                        hallar pistas para los hilos temáticos de la plataforma educativa.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Creación de la malla curricular</h4>
                      <p className="text-sm text-gray-600">
                        Se crea la propuesta curricular de la plataforma validando con maestras titulares los 
                        Estándares Básicos de Competencias y los Derechos Básicos de Aprendizaje.
                      </p>
                    </div>
                  </div>
                  <div className="bg-rural-orange-light/10 p-4 rounded-lg">
                    <h5 className="font-medium mb-2 text-rural-orange-dark">Apropiación Social del Conocimiento</h5>
                    <ul className="text-sm space-y-1 text-rural-orange-dark">
                      <li>• Presentación en evento académico internacional</li>
                      <li>• Presentación ante pares académicos institucionales</li>
                      <li>• Participación en programa radial</li>
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section id="materiales" className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Materiales Descargables
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Marco Teórico", type: "PDF", size: "2.5 MB", description: "Fundamentos teóricos de la investigación" },
              { title: "Metodología", type: "PDF", size: "1.8 MB", description: "Cartografía Social Infantil detallada" },
              { title: "Talleres Implementados", type: "ZIP", size: "15 MB", description: "Guías y materiales de todos los talleres" },
              { title: "Resultados Preliminares", type: "PDF", size: "3.2 MB", description: "Análisis de datos y hallazgos" },
              { title: "Malla Curricular", type: "XLSX", size: "850 KB", description: "Estructura curricular de la plataforma" },
              { title: "Galería de Fotos", type: "ZIP", size: "45 MB", description: "Registro fotográfico del proceso" }
            ].map((material, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rural-orange-light/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-rural-orange-dark" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2 group-hover:text-rural-orange-dark transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{material.type}</Badge>
                        <span className="text-xs text-gray-500">{material.size}</span>
                      </div>
                      <Button size="sm" className="group-hover:scale-105 transition-transform">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Gallery Section */}
      <section id="galeria" className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Galería Interactiva
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Talleres de reconocimiento territorial", image: galleryImage1, description: "Actividades de cartografía social desarrolladas en el patio escolar con estudiantes" },
              { title: "Arte mural comunitario", image: galleryImage2, description: "Expresiones artísticas territoriales en las paredes de la comunidad educativa" },
              { title: "Instalaciones educativas", image: galleryImage3, description: "Espacios físicos donde se desarrolla el proceso educativo rural" },
              { title: "Actividades con estudiantes", image: galleryImage4, description: "Sesiones de trabajo con los niños y niñas participantes del proyecto" },
              { title: "Contexto rural comunitario", image: galleryImage5, description: "Entorno rural donde se desarrolla la investigación educativa" },
              { title: "Biblioteca y recursos", image: galleryImage6, description: "Espacios de consulta y recursos educativos disponibles" },
              { title: "Equipo investigativo", image: galleryImage7, description: "Investigadores trabajando directamente con la comunidad educativa" },
              { title: "Desarrollo de contenidos", image: galleryImage8, description: "Reuniones de trabajo para el desarrollo de materiales educativos" },
              { title: "Sesiones de cartografía", image: galleryImage9, description: "Talleres de mapeo territorial con estudiantes y docentes" },
              { title: "Reuniones con docentes", image: galleryImage10, description: "Coordinación y seguimiento con el equipo educativo" },
              { title: "Presentaciones académicas", image: galleryImage11, description: "Socialización de resultados con la comunidad educativa" }
            ].map((item, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 rounded-full p-2">
                      <Play className="h-4 w-4 text-rural-orange-dark" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-rural-orange-dark transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rural-orange-dark text-white py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center text-xl font-bold mb-4">
                <img src={logoImage} alt="Conexión Rural 360" className="h-10 w-10 mr-3 brightness-0 invert" />
                <span>Conexión Rural 360</span>
              </div>
              <p className="text-white/80 mb-4">
                Educando en Contexto - Una investigación que transforma la educación rural a través de la tecnología y contenidos territorializados.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">
                {getSection("contact")?.title || "Contacto"}
              </h3>
              <div className="space-y-2 text-white/80">
                <p>{getSection("contact")?.subtitle || "Teresila Barona Villamizar"}</p>
                <p>{getSection("contact")?.content || "ltbarona@ucompensar.edu.co"}</p>
                <p>{getSection("contact")?.description || "Universidad Compensar"}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Instituciones Participantes</h3>
              <div className="space-y-2 text-white/80">
                <p>IEDRI Mundo Nuevo - La Calera</p>
                <p>Colegio Nuevo San Andrés de los Altos - Usme</p>
                <p>Universidad Compensar</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2025 Conexión Rural 360. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}