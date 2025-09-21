import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from './components/Layout/Header'
import { Sidebar } from './components/Layout/Sidebar'
import { LoginForm } from './components/Auth/LoginForm'
import { LoadingSpinner } from './components/Common/LoadingSpinner'
import { Dashboard } from './pages/Dashboard'
import { Sensors } from './pages/Sensors'
import { Alerts } from './pages/Alerts'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { useAuth } from './hooks/useAuth'
import './lib/i18n'

function App() {
  const { i18n } = useTranslation()
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration)
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang)
    i18n.changeLanguage(lang)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading Aqua Alert...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'sensors':
        return <Sensors />
      case 'alerts':
        return <Alerts />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLanguageChange={handleLanguageChange}
        currentLanguage={currentLanguage}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App