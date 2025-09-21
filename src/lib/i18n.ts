import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      sensors: 'Sensors',
      alerts: 'Alerts',
      reports: 'Reports',
      settings: 'Settings',
      logout: 'Logout',
      
      // Dashboard
      oceanMonitoring: 'Ocean Monitoring System',
      activeSensors: 'Active Sensors',
      activeAlerts: 'Active Alerts',
      dataPoints: 'Data Points Today',
      systemStatus: 'System Status',
      
      // Sensor readings
      ph: 'pH Level',
      temperature: 'Temperature (°C)',
      turbidity: 'Turbidity (NTU)',
      dissolvedOxygen: 'Dissolved Oxygen (mg/L)',
      conductivity: 'Conductivity (μS/cm)',
      salinity: 'Salinity (PSU)',
      waterLevel: 'Water Level (m)',
      
      // Hazard types
      tsunami: 'Tsunami',
      highWaves: 'High Waves',
      oilSpill: 'Oil Spill',
      chemicalPollution: 'Chemical Pollution',
      biologicalPollution: 'Biological Pollution',
      
      // Severity levels
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
      
      // Actions
      viewDetails: 'View Details',
      downloadReport: 'Download Report',
      exportData: 'Export Data',
      refresh: 'Refresh',
      filter: 'Filter',
      search: 'Search',
      
      // Time periods
      last24Hours: 'Last 24 Hours',
      lastWeek: 'Last Week',
      lastMonth: 'Last Month',
      
      // Status
      online: 'Online',
      offline: 'Offline',
      maintenance: 'Maintenance',
      
      // Alerts
      newAlert: 'New Alert',
      alertResolved: 'Alert Resolved',
      noActiveAlerts: 'No active alerts',
      
      // Reports
      generateReport: 'Generate Report',
      reportGenerated: 'Report generated successfully',
      
      // Authentication
      signIn: 'Sign In',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      
      // Errors
      errorLoadingData: 'Error loading data',
      errorGeneratingReport: 'Error generating report',
      networkError: 'Network error - working offline',
    }
  },
  es: {
    translation: {
      // Navigation
      dashboard: 'Panel de Control',
      sensors: 'Sensores',
      alerts: 'Alertas',
      reports: 'Reportes',
      settings: 'Configuración',
      logout: 'Cerrar Sesión',
      
      // Dashboard
      oceanMonitoring: 'Sistema de Monitoreo Oceánico',
      activeSensors: 'Sensores Activos',
      activeAlerts: 'Alertas Activas',
      dataPoints: 'Puntos de Datos Hoy',
      systemStatus: 'Estado del Sistema',
      
      // Sensor readings
      ph: 'Nivel de pH',
      temperature: 'Temperatura (°C)',
      turbidity: 'Turbidez (NTU)',
      dissolvedOxygen: 'Oxígeno Disuelto (mg/L)',
      conductivity: 'Conductividad (μS/cm)',
      salinity: 'Salinidad (PSU)',
      waterLevel: 'Nivel del Agua (m)',
      
      // Hazard types
      tsunami: 'Tsunami',
      highWaves: 'Olas Altas',
      oilSpill: 'Derrame de Petróleo',
      chemicalPollution: 'Contaminación Química',
      biologicalPollution: 'Contaminación Biológica',
      
      // Severity levels
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto',
      critical: 'Crítico',
      
      // Actions
      viewDetails: 'Ver Detalles',
      downloadReport: 'Descargar Reporte',
      exportData: 'Exportar Datos',
      refresh: 'Actualizar',
      filter: 'Filtrar',
      search: 'Buscar',
      
      // Time periods
      last24Hours: 'Últimas 24 Horas',
      lastWeek: 'Última Semana',
      lastMonth: 'Último Mes',
      
      // Status
      online: 'En Línea',
      offline: 'Fuera de Línea',
      maintenance: 'Mantenimiento',
      
      // Alerts
      newAlert: 'Nueva Alerta',
      alertResolved: 'Alerta Resuelta',
      noActiveAlerts: 'No hay alertas activas',
      
      // Reports
      generateReport: 'Generar Reporte',
      reportGenerated: 'Reporte generado exitosamente',
      
      // Authentication
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      
      // Errors
      errorLoadingData: 'Error al cargar datos',
      errorGeneratingReport: 'Error al generar reporte',
      networkError: 'Error de red - trabajando sin conexión',
    }
  },
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de Bord',
      sensors: 'Capteurs',
      alerts: 'Alertes',
      reports: 'Rapports',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      
      // Dashboard
      oceanMonitoring: 'Système de Surveillance Océanique',
      activeSensors: 'Capteurs Actifs',
      activeAlerts: 'Alertes Actives',
      dataPoints: 'Points de Données Aujourd\'hui',
      systemStatus: 'État du Système',
      
      // Sensor readings
      ph: 'Niveau de pH',
      temperature: 'Température (°C)',
      turbidity: 'Turbidité (NTU)',
      dissolvedOxygen: 'Oxygène Dissous (mg/L)',
      conductivity: 'Conductivité (μS/cm)',
      salinity: 'Salinité (PSU)',
      waterLevel: 'Niveau d\'Eau (m)',
      
      // Hazard types
      tsunami: 'Tsunami',
      highWaves: 'Vagues Hautes',
      oilSpill: 'Déversement de Pétrole',
      chemicalPollution: 'Pollution Chimique',
      biologicalPollution: 'Pollution Biologique',
      
      // Severity levels
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      critical: 'Critique',
      
      // Actions
      viewDetails: 'Voir les Détails',
      downloadReport: 'Télécharger le Rapport',
      exportData: 'Exporter les Données',
      refresh: 'Actualiser',
      filter: 'Filtrer',
      search: 'Rechercher',
      
      // Time periods
      last24Hours: 'Dernières 24 Heures',
      lastWeek: 'Dernière Semaine',
      lastMonth: 'Dernier Mois',
      
      // Status
      online: 'En Ligne',
      offline: 'Hors Ligne',
      maintenance: 'Maintenance',
      
      // Alerts
      newAlert: 'Nouvelle Alerte',
      alertResolved: 'Alerte Résolue',
      noActiveAlerts: 'Aucune alerte active',
      
      // Reports
      generateReport: 'Générer un Rapport',
      reportGenerated: 'Rapport généré avec succès',
      
      // Authentication
      signIn: 'Se Connecter',
      signOut: 'Se Déconnecter',
      email: 'Email',
      password: 'Mot de Passe',
      
      // Errors
      errorLoadingData: 'Erreur lors du chargement des données',
      errorGeneratingReport: 'Erreur lors de la génération du rapport',
      networkError: 'Erreur réseau - travail hors ligne',
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n