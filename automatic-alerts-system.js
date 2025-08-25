/**
 * Sistema de Alertas Automáticas - Neo-tech Argentina
 * Sistema que genera alertas en tiempo real basadas en cambios SEO
 */

const fs = require('fs');
const path = require('path');

class AutomaticAlertsSystem {
    constructor() {
        this.alerts = [];
        this.alertRules = {
            seoScoreIncrease: { threshold: 2, enabled: true },
            rankingImprovement: { threshold: 3, enabled: true },
            trafficIncrease: { threshold: 50, enabled: true },
            speedImprovement: { threshold: 5, enabled: true },
            newVisitorsSpike: { threshold: 100, enabled: true },
            ctrImprovement: { threshold: 0.5, enabled: true }
        };
        
        this.isMonitoring = false;
        this.alertCycle = 0;
        this.dashboardPath = path.join(__dirname, 'seo-dashboard-realtime.html');
        this.lastMetrics = null;
    }

    // Iniciar sistema de alertas
    startAlertSystem() {
        console.log('🚨 Iniciando Sistema de Alertas Automáticas...');
        this.isMonitoring = true;
        
        // Verificar alertas cada 25 segundos
        setInterval(() => {
            this.checkAllAlerts();
        }, 25000);
        
        // Limpiar alertas antiguas cada 5 minutos
        setInterval(() => {
            this.cleanOldAlerts();
        }, 300000);
        
        // Mostrar resumen de alertas cada 2 minutos
        setInterval(() => {
            this.showAlertsummary();
        }, 120000);
        
        // Ejecutar primera verificación
        this.checkAllAlerts();
    }

    // Verificar todas las alertas
    checkAllAlerts() {
        this.alertCycle++;
        console.log(`\n🔍 Verificando alertas - Ciclo #${this.alertCycle}`);
        
        // Simular métricas actuales (en un sistema real, estas vendrían de APIs)
        const currentMetrics = this.getCurrentMetrics();
        
        if (this.lastMetrics) {
            this.checkSEOScoreAlert(currentMetrics);
            this.checkRankingAlert(currentMetrics);
            this.checkTrafficAlert(currentMetrics);
            this.checkSpeedAlert(currentMetrics);
            this.checkVisitorsAlert(currentMetrics);
            this.checkCTRAlert(currentMetrics);
            this.checkTechnicalIssues(currentMetrics);
        }
        
        this.lastMetrics = currentMetrics;
        this.updateAlertsInDashboard();
    }

    // Obtener métricas actuales (simuladas pero realistas)
    getCurrentMetrics() {
        const baseMetrics = {
            seoScore: 87 + (Math.random() * 4 - 2), // 85-91
            averagePosition: 20 + (Math.random() * 6 - 3), // 17-23
            organicTraffic: 2800 + Math.floor(Math.random() * 200 - 100), // 2700-2900
            siteSpeed: 94 + (Math.random() * 4 - 2), // 92-96
            newVisitors: 1500 + Math.floor(Math.random() * 300 - 150), // 1350-1650
            organicCTR: 4.2 + (Math.random() * 0.8 - 0.4), // 3.8-4.6
            technicalScore: 92 + (Math.random() * 6 - 3) // 89-95
        };
        
        return baseMetrics;
    }

    // Verificar alerta de SEO Score
    checkSEOScoreAlert(metrics) {
        if (!this.alertRules.seoScoreIncrease.enabled) return;
        
        const improvement = metrics.seoScore - this.lastMetrics.seoScore;
        
        if (improvement >= this.alertRules.seoScoreIncrease.threshold) {
            this.createAlert({
                type: 'success',
                category: 'SEO Score',
                title: '🎉 Mejora en SEO Score',
                message: `El SEO Score mejoró ${improvement.toFixed(1)} puntos (${this.lastMetrics.seoScore.toFixed(1)} → ${metrics.seoScore.toFixed(1)})`,
                priority: 'high',
                actionRequired: false
            });
        } else if (improvement <= -2) {
            this.createAlert({
                type: 'warning',
                category: 'SEO Score',
                title: '⚠️ Descenso en SEO Score',
                message: `El SEO Score descendió ${Math.abs(improvement).toFixed(1)} puntos. Revisar optimizaciones recientes.`,
                priority: 'medium',
                actionRequired: true
            });
        }
    }

    // Verificar alerta de ranking
    checkRankingAlert(metrics) {
        if (!this.alertRules.rankingImprovement.enabled) return;
        
        const improvement = this.lastMetrics.averagePosition - metrics.averagePosition;
        
        if (improvement >= this.alertRules.rankingImprovement.threshold) {
            this.createAlert({
                type: 'success',
                category: 'Rankings',
                title: '📈 Mejora significativa en rankings',
                message: `Posición promedio mejoró ${improvement.toFixed(1)} lugares (${this.lastMetrics.averagePosition.toFixed(1)} → ${metrics.averagePosition.toFixed(1)})`,
                priority: 'high',
                actionRequired: false
            });
        }
    }

    // Verificar alerta de tráfico
    checkTrafficAlert(metrics) {
        if (!this.alertRules.trafficIncrease.enabled) return;
        
        const increase = metrics.organicTraffic - this.lastMetrics.organicTraffic;
        
        if (increase >= this.alertRules.trafficIncrease.threshold) {
            this.createAlert({
                type: 'success',
                category: 'Tráfico',
                title: '🚀 Aumento significativo de tráfico',
                message: `Tráfico orgánico aumentó en ${increase} visitantes (+${((increase/this.lastMetrics.organicTraffic)*100).toFixed(1)}%)`,
                priority: 'high',
                actionRequired: false
            });
        } else if (increase <= -100) {
            this.createAlert({
                type: 'error',
                category: 'Tráfico',
                title: '📉 Descenso importante de tráfico',
                message: `Tráfico orgánico descendió ${Math.abs(increase)} visitantes. Investigar causas.`,
                priority: 'high',
                actionRequired: true
            });
        }
    }

    // Verificar alerta de velocidad
    checkSpeedAlert(metrics) {
        if (!this.alertRules.speedImprovement.enabled) return;
        
        const improvement = metrics.siteSpeed - this.lastMetrics.siteSpeed;
        
        if (improvement >= this.alertRules.speedImprovement.threshold) {
            this.createAlert({
                type: 'success',
                category: 'Velocidad',
                title: '⚡ Mejora en velocidad del sitio',
                message: `Velocidad mejoró ${improvement.toFixed(1)} puntos (${this.lastMetrics.siteSpeed.toFixed(1)} → ${metrics.siteSpeed.toFixed(1)})`,
                priority: 'medium',
                actionRequired: false
            });
        } else if (metrics.siteSpeed < 85) {
            this.createAlert({
                type: 'warning',
                category: 'Velocidad',
                title: '🐌 Velocidad del sitio baja',
                message: `Velocidad actual: ${metrics.siteSpeed.toFixed(1)}/100. Optimizar recursos y imágenes.`,
                priority: 'medium',
                actionRequired: true
            });
        }
    }

    // Verificar alerta de visitantes
    checkVisitorsAlert(metrics) {
        if (!this.alertRules.newVisitorsSpike.enabled) return;
        
        const increase = metrics.newVisitors - this.lastMetrics.newVisitors;
        
        if (increase >= this.alertRules.newVisitorsSpike.threshold) {
            this.createAlert({
                type: 'info',
                category: 'Visitantes',
                title: '👥 Pico de nuevos visitantes',
                message: `${increase} nuevos visitantes adicionales detectados. Analizar fuentes de tráfico.`,
                priority: 'medium',
                actionRequired: false
            });
        }
    }

    // Verificar alerta de CTR
    checkCTRAlert(metrics) {
        if (!this.alertRules.ctrImprovement.enabled) return;
        
        const improvement = metrics.organicCTR - this.lastMetrics.organicCTR;
        
        if (improvement >= this.alertRules.ctrImprovement.threshold) {
            this.createAlert({
                type: 'success',
                category: 'CTR',
                title: '🎯 Mejora en CTR orgánico',
                message: `CTR mejoró ${improvement.toFixed(2)}% (${this.lastMetrics.organicCTR.toFixed(2)}% → ${metrics.organicCTR.toFixed(2)}%)`,
                priority: 'medium',
                actionRequired: false
            });
        }
    }

    // Verificar problemas técnicos
    checkTechnicalIssues(metrics) {
        // Simular detección de problemas técnicos ocasionales
        const issues = [
            { type: 'meta_tags', probability: 0.05, message: 'Meta descripción faltante detectada en nueva página' },
            { type: 'broken_links', probability: 0.03, message: 'Enlace roto detectado en navegación principal' },
            { type: 'image_alt', probability: 0.07, message: 'Imágenes sin atributo ALT encontradas' },
            { type: 'schema_markup', probability: 0.04, message: 'Schema markup incompleto en página de producto' },
            { type: 'mobile_issues', probability: 0.02, message: 'Problema de usabilidad móvil detectado' }
        ];
        
        issues.forEach(issue => {
            if (Math.random() < issue.probability) {
                this.createAlert({
                    type: 'warning',
                    category: 'Técnico',
                    title: '🔧 Problema técnico detectado',
                    message: issue.message,
                    priority: 'medium',
                    actionRequired: true,
                    issueType: issue.type
                });
            }
        });
    }

    // Crear nueva alerta
    createAlert(alertData) {
        const alert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            cycle: this.alertCycle,
            ...alertData
        };
        
        this.alerts.unshift(alert); // Agregar al inicio
        
        // Limitar a 50 alertas máximo
        if (this.alerts.length > 50) {
            this.alerts = this.alerts.slice(0, 50);
        }
        
        console.log(`${this.getAlertIcon(alert.type)} ${alert.title}: ${alert.message}`);
        
        this.saveAlert(alert);
        return alert;
    }

    // Obtener icono de alerta
    getAlertIcon(type) {
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }

    // Actualizar alertas en dashboard
    updateAlertsInDashboard() {
        try {
            if (fs.existsSync(this.dashboardPath)) {
                let content = fs.readFileSync(this.dashboardPath, 'utf8');
                
                // Generar HTML de alertas
                const alertsHTML = this.generateAlertsHTML();
                
                // Buscar y reemplazar sección de alertas
                const alertsRegex = /<div[^>]*class="[^"]*alerts[^"]*"[^>]*>[\s\S]*?<\/div>(?=\s*<div|\s*<\/)/i;
                if (alertsRegex.test(content)) {
                    content = content.replace(alertsRegex, alertsHTML);
                } else {
                    // Si no existe, agregar después del dashboard
                    const insertPoint = content.indexOf('</body>');
                    if (insertPoint !== -1) {
                        content = content.slice(0, insertPoint) + 
                                 `\n${alertsHTML}\n` + 
                                 content.slice(insertPoint);
                    }
                }
                
                fs.writeFileSync(this.dashboardPath, content);
            }
        } catch (error) {
            console.error('Error actualizando alertas en dashboard:', error.message);
        }
    }

    // Generar HTML de alertas
    generateAlertsHTML() {
        const recentAlerts = this.alerts.slice(0, 10); // Últimas 10 alertas
        
        let alertsHTML = `
        <div class="alerts-section" style="position: fixed; top: 20px; right: 20px; width: 350px; max-height: 80vh; overflow-y: auto; z-index: 1000;">
            <div style="background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); padding: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">🚨 Alertas en Tiempo Real</h3>`;
        
        if (recentAlerts.length === 0) {
            alertsHTML += `
                <div style="text-align: center; color: #6b7280; padding: 20px;">
                    <p>No hay alertas recientes</p>
                    <small>El sistema está monitoreando...</small>
                </div>`;
        } else {
            recentAlerts.forEach(alert => {
                const alertColor = this.getAlertColor(alert.type);
                const timeAgo = this.getTimeAgo(alert.timestamp);
                
                alertsHTML += `
                <div style="border-left: 4px solid ${alertColor}; background: ${alertColor}10; padding: 12px; margin-bottom: 10px; border-radius: 6px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                        <span style="font-weight: 600; color: ${alertColor}; font-size: 14px;">${alert.title}</span>
                        <small style="color: #6b7280; font-size: 11px;">${timeAgo}</small>
                    </div>
                    <p style="margin: 0; color: #374151; font-size: 13px; line-height: 1.4;">${alert.message}</p>
                    ${alert.actionRequired ? '<small style="color: #dc2626; font-weight: 500;">⚡ Acción requerida</small>' : ''}
                </div>`;
            });
        }
        
        alertsHTML += `
                <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <small style="color: #6b7280;">Ciclo #${this.alertCycle} | ${this.alerts.length} alertas totales</small>
                </div>
            </div>
        </div>`;
        
        return alertsHTML;
    }

    // Obtener color de alerta
    getAlertColor(type) {
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        };
        return colors[type] || '#6b7280';
    }

    // Calcular tiempo transcurrido
    getTimeAgo(timestamp) {
        const now = new Date();
        const alertTime = new Date(timestamp);
        const diffMs = now - alertTime;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `${diffMins}m`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h`;
        return `${Math.floor(diffHours / 24)}d`;
    }

    // Limpiar alertas antiguas
    cleanOldAlerts() {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const initialCount = this.alerts.length;
        
        this.alerts = this.alerts.filter(alert => new Date(alert.timestamp) > oneDayAgo);
        
        const removedCount = initialCount - this.alerts.length;
        if (removedCount > 0) {
            console.log(`🧹 Limpieza automática: ${removedCount} alertas antiguas eliminadas`);
        }
    }

    // Mostrar resumen de alertas
    showAlertsummary() {
        console.log(`\n📋 Resumen de Alertas - Ciclo #${this.alertCycle}`);
        
        const recentAlerts = this.alerts.filter(alert => {
            const alertTime = new Date(alert.timestamp);
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return alertTime > oneHourAgo;
        });
        
        const alertsByType = {
            success: recentAlerts.filter(a => a.type === 'success').length,
            warning: recentAlerts.filter(a => a.type === 'warning').length,
            error: recentAlerts.filter(a => a.type === 'error').length,
            info: recentAlerts.filter(a => a.type === 'info').length
        };
        
        console.log(`   Total alertas (última hora): ${recentAlerts.length}`);
        console.log(`   ✅ Éxitos: ${alertsByType.success}`);
        console.log(`   ⚠️ Advertencias: ${alertsByType.warning}`);
        console.log(`   ❌ Errores: ${alertsByType.error}`);
        console.log(`   ℹ️ Información: ${alertsByType.info}`);
        
        const actionRequired = recentAlerts.filter(a => a.actionRequired).length;
        if (actionRequired > 0) {
            console.log(`   ⚡ Requieren acción: ${actionRequired}`);
        }
    }

    // Guardar alerta
    saveAlert(alert) {
        try {
            const alertsFile = path.join(__dirname, 'system-alerts.json');
            let allAlerts = [];
            
            if (fs.existsSync(alertsFile)) {
                allAlerts = JSON.parse(fs.readFileSync(alertsFile, 'utf8'));
            }
            
            allAlerts.unshift(alert);
            
            // Mantener solo las últimas 200 alertas
            if (allAlerts.length > 200) {
                allAlerts = allAlerts.slice(0, 200);
            }
            
            fs.writeFileSync(alertsFile, JSON.stringify(allAlerts, null, 2));
        } catch (error) {
            console.error('Error guardando alerta:', error.message);
        }
    }

    // Obtener estadísticas
    getStatistics() {
        return {
            isMonitoring: this.isMonitoring,
            alertCycle: this.alertCycle,
            totalAlerts: this.alerts.length,
            recentAlerts: this.alerts.filter(a => {
                const alertTime = new Date(a.timestamp);
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                return alertTime > oneHourAgo;
            }).length,
            actionRequired: this.alerts.filter(a => a.actionRequired).length,
            lastUpdate: new Date().toISOString()
        };
    }

    // Detener sistema
    stopAlertSystem() {
        this.isMonitoring = false;
        console.log('⏹️ Sistema de alertas detenido');
    }
}

// Exportar clase
module.exports = AutomaticAlertsSystem;

// Ejecutar si se llama directamente
if (require.main === module) {
    console.log('🚨 Iniciando Sistema de Alertas Automáticas - Neo-tech Argentina');
    const alertSystem = new AutomaticAlertsSystem();
    alertSystem.startAlertSystem();
}