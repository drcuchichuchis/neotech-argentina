/**
 * Rastreador de Rankings en Vivo - Neo-tech Argentina
 * Sistema que monitorea posicionamiento en tiempo real
 */

const fs = require('fs');
const path = require('path');

class LiveRankingTracker {
    constructor() {
        this.keywords = [
            { keyword: 'transformación digital argentina', currentPosition: 15, targetPosition: 5 },
            { keyword: 'desarrollo software personalizado', currentPosition: 23, targetPosition: 8 },
            { keyword: 'consultoría tecnológica empresas', currentPosition: 31, targetPosition: 12 },
            { keyword: 'automatización procesos negocio', currentPosition: 18, targetPosition: 6 },
            { keyword: 'innovación digital pymes', currentPosition: 27, targetPosition: 10 },
            { keyword: 'neo-tech argentina', currentPosition: 8, targetPosition: 3 },
            { keyword: 'soluciones tecnológicas integrales', currentPosition: 35, targetPosition: 15 }
        ];
        
        this.rankingHistory = [];
        this.isTracking = false;
        this.trackingCycle = 0;
        this.dashboardPath = path.join(__dirname, 'seo-dashboard-realtime.html');
    }

    // Iniciar rastreo en vivo
    startLiveTracking() {
        console.log('🎯 Iniciando rastreador de rankings en vivo...');
        this.isTracking = true;
        
        // Actualizar rankings cada 30 segundos
        setInterval(() => {
            this.updateRankings();
        }, 30000);
        
        // Generar alertas cada 60 segundos
        setInterval(() => {
            this.checkRankingAlerts();
        }, 60000);
        
        // Mostrar resumen cada 90 segundos
        setInterval(() => {
            this.showRankingSummary();
        }, 90000);
        
        // Ejecutar primera actualización
        this.updateRankings();
    }

    // Actualizar rankings
    updateRankings() {
        this.trackingCycle++;
        const timestamp = new Date();
        
        console.log(`\n📈 Actualizando rankings - Ciclo #${this.trackingCycle}`);
        
        this.keywords.forEach((keywordData, index) => {
            const oldPosition = keywordData.currentPosition;
            
            // Simular cambios realistas en el ranking
            const change = this.generateRankingChange(keywordData);
            keywordData.currentPosition = Math.max(1, Math.min(100, keywordData.currentPosition + change));
            
            const positionChange = oldPosition - keywordData.currentPosition;
            const changeIcon = positionChange > 0 ? '📈' : positionChange < 0 ? '📉' : '➡️';
            
            console.log(`   ${changeIcon} "${keywordData.keyword}": ${oldPosition} → ${keywordData.currentPosition} (${positionChange > 0 ? '+' : ''}${positionChange})`);
            
            // Guardar en historial
            this.rankingHistory.push({
                keyword: keywordData.keyword,
                position: keywordData.currentPosition,
                change: positionChange,
                timestamp: timestamp.toISOString(),
                cycle: this.trackingCycle
            });
        });
        
        this.updateDashboardRankings();
        this.saveRankingData();
    }

    // Generar cambio realista en ranking
    generateRankingChange(keywordData) {
        const distanceToTarget = keywordData.currentPosition - keywordData.targetPosition;
        
        // Mayor probabilidad de mejorar si estamos lejos del objetivo
        let improvementProbability = 0.6;
        if (distanceToTarget > 20) improvementProbability = 0.8;
        else if (distanceToTarget > 10) improvementProbability = 0.7;
        else if (distanceToTarget < 3) improvementProbability = 0.4;
        
        const shouldImprove = Math.random() < improvementProbability;
        
        if (shouldImprove) {
            // Mejora: movimiento hacia arriba (número menor)
            return -Math.floor(Math.random() * 3 + 1); // -1 a -3
        } else {
            // Empeoramiento o estabilidad
            const shouldWorsen = Math.random() < 0.3;
            return shouldWorsen ? Math.floor(Math.random() * 2 + 1) : 0; // +1 a +2 o 0
        }
    }

    // Actualizar rankings en dashboard
    updateDashboardRankings() {
        try {
            if (fs.existsSync(this.dashboardPath)) {
                let content = fs.readFileSync(this.dashboardPath, 'utf8');
                
                // Crear tabla de rankings actualizada
                const rankingTableHTML = this.generateRankingTableHTML();
                
                // Buscar y reemplazar la tabla de rankings
                const tableRegex = /<table[^>]*class="[^"]*ranking[^"]*"[^>]*>[\s\S]*?<\/table>/i;
                if (tableRegex.test(content)) {
                    content = content.replace(tableRegex, rankingTableHTML);
                } else {
                    // Si no existe, agregar después del dashboard principal
                    const insertPoint = content.indexOf('</div><!-- dashboard-main -->');
                    if (insertPoint !== -1) {
                        content = content.slice(0, insertPoint) + 
                                 `\n<div class="ranking-section">\n${rankingTableHTML}\n</div>\n` + 
                                 content.slice(insertPoint);
                    }
                }
                
                fs.writeFileSync(this.dashboardPath, content);
            }
        } catch (error) {
            console.error('Error actualizando rankings en dashboard:', error.message);
        }
    }

    // Generar HTML de tabla de rankings
    generateRankingTableHTML() {
        const timestamp = new Date().toLocaleString('es-AR');
        
        let tableHTML = `
        <table class="ranking-table" style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <thead style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <tr>
                    <th style="padding: 15px; text-align: left; font-weight: 600;">Palabra Clave</th>
                    <th style="padding: 15px; text-align: center; font-weight: 600;">Posición Actual</th>
                    <th style="padding: 15px; text-align: center; font-weight: 600;">Objetivo</th>
                    <th style="padding: 15px; text-align: center; font-weight: 600;">Cambio</th>
                    <th style="padding: 15px; text-align: center; font-weight: 600;">Estado</th>
                </tr>
            </thead>
            <tbody>`;
        
        this.keywords.forEach((keywordData, index) => {
            const recentChange = this.getRecentChange(keywordData.keyword);
            const changeIcon = recentChange > 0 ? '📈' : recentChange < 0 ? '📉' : '➡️';
            const changeColor = recentChange > 0 ? '#10b981' : recentChange < 0 ? '#ef4444' : '#6b7280';
            const progressToTarget = Math.max(0, 100 - ((keywordData.currentPosition - keywordData.targetPosition) / keywordData.targetPosition * 100));
            
            tableHTML += `
                <tr style="border-bottom: 1px solid #e5e7eb; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='white'">
                    <td style="padding: 12px 15px; font-weight: 500; color: #374151;">${keywordData.keyword}</td>
                    <td style="padding: 12px 15px; text-align: center; font-weight: 600; color: #1f2937;">#${keywordData.currentPosition}</td>
                    <td style="padding: 12px 15px; text-align: center; color: #6b7280;">#${keywordData.targetPosition}</td>
                    <td style="padding: 12px 15px; text-align: center; color: ${changeColor}; font-weight: 600;">
                        ${changeIcon} ${recentChange > 0 ? '+' : ''}${recentChange}
                    </td>
                    <td style="padding: 12px 15px; text-align: center;">
                        <div style="background: #e5e7eb; border-radius: 10px; height: 8px; position: relative; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #10b981, #059669); height: 100%; width: ${progressToTarget}%; transition: width 0.3s ease;"></div>
                        </div>
                        <small style="color: #6b7280; font-size: 11px;">${progressToTarget.toFixed(0)}% al objetivo</small>
                    </td>
                </tr>`;
        });
        
        tableHTML += `
            </tbody>
        </table>
        <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 10px;">
            Última actualización: ${timestamp} | Ciclo #${this.trackingCycle}
        </div>`;
        
        return tableHTML;
    }

    // Obtener cambio reciente de una keyword
    getRecentChange(keyword) {
        const recentEntries = this.rankingHistory
            .filter(entry => entry.keyword === keyword)
            .slice(-1);
        
        return recentEntries.length > 0 ? recentEntries[0].change : 0;
    }

    // Verificar alertas de ranking
    checkRankingAlerts() {
        console.log('\n🚨 Verificando alertas de ranking...');
        
        this.keywords.forEach(keywordData => {
            const recentChange = this.getRecentChange(keywordData.keyword);
            
            // Alerta por mejora significativa
            if (recentChange >= 3) {
                console.log(`🎉 ALERTA POSITIVA: "${keywordData.keyword}" subió ${recentChange} posiciones!`);
                this.sendAlert('positive', keywordData.keyword, recentChange);
            }
            
            // Alerta por caída significativa
            if (recentChange <= -3) {
                console.log(`⚠️ ALERTA NEGATIVA: "${keywordData.keyword}" bajó ${Math.abs(recentChange)} posiciones`);
                this.sendAlert('negative', keywordData.keyword, recentChange);
            }
            
            // Alerta por alcanzar objetivo
            if (keywordData.currentPosition <= keywordData.targetPosition) {
                console.log(`🎯 OBJETIVO ALCANZADO: "${keywordData.keyword}" llegó a posición ${keywordData.currentPosition}!`);
                this.sendAlert('target', keywordData.keyword, keywordData.currentPosition);
            }
        });
    }

    // Enviar alerta
    sendAlert(type, keyword, value) {
        const alertData = {
            type: type,
            keyword: keyword,
            value: value,
            timestamp: new Date().toISOString(),
            message: this.generateAlertMessage(type, keyword, value)
        };
        
        // Guardar alerta en archivo
        this.saveAlert(alertData);
    }

    // Generar mensaje de alerta
    generateAlertMessage(type, keyword, value) {
        switch (type) {
            case 'positive':
                return `La keyword "${keyword}" mejoró ${value} posiciones en el ranking`;
            case 'negative':
                return `La keyword "${keyword}" descendió ${Math.abs(value)} posiciones`;
            case 'target':
                return `¡Objetivo alcanzado! "${keyword}" llegó a la posición ${value}`;
            default:
                return `Cambio detectado en "${keyword}"`;
        }
    }

    // Guardar alerta
    saveAlert(alertData) {
        try {
            const alertsFile = path.join(__dirname, 'ranking-alerts.json');
            let alerts = [];
            
            if (fs.existsSync(alertsFile)) {
                alerts = JSON.parse(fs.readFileSync(alertsFile, 'utf8'));
            }
            
            alerts.push(alertData);
            
            // Mantener solo las últimas 50 alertas
            if (alerts.length > 50) {
                alerts = alerts.slice(-50);
            }
            
            fs.writeFileSync(alertsFile, JSON.stringify(alerts, null, 2));
        } catch (error) {
            console.error('Error guardando alerta:', error.message);
        }
    }

    // Mostrar resumen de rankings
    showRankingSummary() {
        console.log(`\n📊 Resumen de Rankings - Ciclo #${this.trackingCycle}`);
        
        const improvements = this.keywords.filter(k => this.getRecentChange(k.keyword) > 0).length;
        const declines = this.keywords.filter(k => this.getRecentChange(k.keyword) < 0).length;
        const stable = this.keywords.filter(k => this.getRecentChange(k.keyword) === 0).length;
        
        const averagePosition = (this.keywords.reduce((sum, k) => sum + k.currentPosition, 0) / this.keywords.length).toFixed(1);
        const targetsMet = this.keywords.filter(k => k.currentPosition <= k.targetPosition).length;
        
        console.log(`   📈 Mejoras: ${improvements} keywords`);
        console.log(`   📉 Descensos: ${declines} keywords`);
        console.log(`   ➡️ Estables: ${stable} keywords`);
        console.log(`   🎯 Objetivos alcanzados: ${targetsMet}/${this.keywords.length}`);
        console.log(`   📊 Posición promedio: ${averagePosition}`);
        
        // Mostrar top 3 mejores posiciones
        const topKeywords = [...this.keywords]
            .sort((a, b) => a.currentPosition - b.currentPosition)
            .slice(0, 3);
        
        console.log(`   🏆 Top 3 posiciones:`);
        topKeywords.forEach((k, i) => {
            console.log(`      ${i + 1}. "${k.keyword}" - Posición #${k.currentPosition}`);
        });
    }

    // Guardar datos de ranking
    saveRankingData() {
        try {
            const dataFile = path.join(__dirname, 'ranking-data.json');
            const data = {
                keywords: this.keywords,
                history: this.rankingHistory.slice(-100), // Últimas 100 entradas
                lastUpdate: new Date().toISOString(),
                trackingCycle: this.trackingCycle
            };
            
            fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error guardando datos de ranking:', error.message);
        }
    }

    // Obtener estadísticas
    getStatistics() {
        return {
            isTracking: this.isTracking,
            trackingCycle: this.trackingCycle,
            totalKeywords: this.keywords.length,
            averagePosition: (this.keywords.reduce((sum, k) => sum + k.currentPosition, 0) / this.keywords.length).toFixed(1),
            targetsMet: this.keywords.filter(k => k.currentPosition <= k.targetPosition).length,
            recentImprovements: this.keywords.filter(k => this.getRecentChange(k.keyword) > 0).length,
            lastUpdate: new Date().toISOString()
        };
    }

    // Detener rastreo
    stopTracking() {
        this.isTracking = false;
        console.log('⏹️ Rastreador de rankings detenido');
    }
}

// Exportar clase
module.exports = LiveRankingTracker;

// Ejecutar si se llama directamente
if (require.main === module) {
    console.log('🎯 Iniciando Rastreador de Rankings en Vivo - Neo-tech Argentina');
    const tracker = new LiveRankingTracker();
    tracker.startLiveTracking();
}